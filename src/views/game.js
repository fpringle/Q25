import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, BackHandler, Modal, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Grid from '../components/grid';
import Text from '../components/text';
import { LetterBar, ButtonBar, WordBar } from '../components/bars';
import { themes } from '../styles';
import { points, isValid } from '../backend';
import Q25Button from '../components/button';
import { doUnlockLevel, doUpdateUserProgress } from '../storage/features/levels';
import { doDeleteGame, doUpdateGame } from '../storage/features/game';

// random integer in [0, lim]
const randInt = (lim) => Math.floor(Math.random() * (lim + 1));
const scrambleArray = (array) => {
  const arr = array.slice();
  let n = arr.length;
  for (let i=n-1; i>0; i--) {
    let j = randInt(i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const makeTitle = (score, bestUserScore, maxScore, level) => {
  const f = s => s.toString().padStart(3, ' ');
  return `${level} - ${f(score)} / ${f(bestUserScore)} / ${f(maxScore)}`;
};



function GameLayout(props) {
  const {
    style: {
      backgroundColor,
      foregroundColor,
    },
    modal,
    grid: {
      letters,
      onLetterPress,
      pressedButtons,
    },
    letterBar: {
      bar,
    },
    buttonBar1Data,
    wordBar: {
      words,
      removeWord,
    },
    buttonBar2Data,
    highlights,
  } = props;
  return (
    <View style={[styles.container, {backgroundColor}]}>
      {modal}
      <View style={{flex: 0.95, borderWidth: 2, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderColor: highlights?.grid ? foregroundColor : backgroundColor}}>
        <Grid
          columns={5}
          rows={5}
          letters={letters}
          onLetterPress={onLetterPress || (() => {})}
          pressedButtons={pressedButtons}
          foregroundColor={foregroundColor}
          backgroundColor={backgroundColor}
        />
      </View>
      <View style={{
        width: '105%',
        borderWidth: 2,
        borderColor: highlights?.lettersBar ? foregroundColor : backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      }}>
        <LetterBar letters={bar} style={{foregroundColor, backgroundColor}}/>
      </View>
      <ButtonBar
        data={buttonBar1Data}
        style={{borderWidth: 2, borderColor: highlights?.buttonBar1 ? foregroundColor : backgroundColor}}
        foregroundColor={foregroundColor}
        backgroundColor={backgroundColor}
      />
      <WordBar
        words={words}
        style={{
          foregroundColor,
          backgroundColor,
          borderWidth: 2,
          borderColor: highlights?.wordBar ? foregroundColor : backgroundColor,
        }}
        removeWord={removeWord || (() => {})}
      />
      <ButtonBar
        data={buttonBar2Data}
        style={{
          borderWidth: 2,
          borderColor: highlights?.buttonBar2 ? foregroundColor : backgroundColor
        }}
        foregroundColor={foregroundColor}
        backgroundColor={backgroundColor}
      />
    </View>
  );
}

const tutorialPhases = {
  GRID: 0,
  LETTERS_BAR: 1,
  BUTTON_BAR_1: 2,
  WORD_BAR: 3,
  TITLE: 4,
  BUTTON_BAR_2: 5,
};

const tutorialPhaseOrder = [
  tutorialPhases.GRID,
  tutorialPhases.LETTERS_BAR,
  tutorialPhases.BUTTON_BAR_1,
  tutorialPhases.WORD_BAR,
  tutorialPhases.TITLE,
  tutorialPhases.BUTTON_BAR_2,
];


function ModalBox(props) {
  const {
    foregroundColor,
    backgroundColor,
    onBack,
    onNext,
    onExit,
    backDisabled,
    nextDisabled,
    title,
    text,
    final,
  } = props;
  const buttonStyle = {
    ...styles.modalText,
    padding: 3,
    flex:0,
    width: '25%',
  };
  return (
    <View style={[styles.modalBoxStyle, {borderColor: foregroundColor, backgroundColor, width: '90%', paddingHorizontal: 15, flexDirection: 'column', aspectRatio: null, paddingBottom: 10, paddingTop: 10}]}>
      <View style={{borderWidth: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row', padding: 0}}>
        <Q25Button
          text={''}
          style={{flex: 0, fontSize: 10, aspectRatio: 1}}
          foregroundColor={backgroundColor}
          backgroundColor={backgroundColor}
          disabled={true}
        />
        <Text style={[styles.modalTitle, {color: foregroundColor}]}>
          {title}
        </Text>
        <Q25Button
          text={'X'}
          style={{flex: 0, fontSize: 20, aspectRatio: 1, padding:0}}
          onPress={onExit}
          foregroundColor={foregroundColor}
          backgroundColor={backgroundColor}
        />
      </View>
      <Text style={[styles.modalText, {color: foregroundColor, textAlign: 'center'}]}>
        {text}
      </Text>
      <View style={{marginTop: 5, flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
        {backDisabled ? (
          <View
            style={buttonStyle}
          />
        ) : (
          <Q25Button
            text={'Back'}
            style={buttonStyle}
            onPress={onBack}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
          />
        )}
        {nextDisabled ? (
          <View
            style={buttonStyle}
          />
        ) : (
          <Q25Button
            text={final ? 'End' : 'Next'}
            style={buttonStyle}
            onPress={onNext}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
          />
        )}
      </View>
    </View>
  );
}

function HelpScreen(props) {
  const {foregroundColor, backgroundColor} = props.style;
  const {endTutorial} = props;
  const origLetters = 'abcdefghijklmnopqrstuvwxy'.split('');
  const emptyPressedButtons = [];
  const noOpButtonBar1Data = [
    { text: 'Undo' },
    { text: 'Clear word' },
    { text: 'Save word' },
  ];
  const noOpButtonBar2Data = [
    { text: 'Scramble' },
    { text: 'Reset' },
    { text: 'Finish' },
  ]
  const emptyLetterBar = [];
  const emptyWordBar = [];

  const [tutorialPhase, setTutorialPhase] = useState(0);

  useEffect(() => {
    let _score = tutorialPhase < tutorialPhases.WORD_BAR ? 0 : 16;
    props.changeTitle(makeTitle(_score, 0, 185, 'Tutorial'));
  }, [tutorialPhase]);

  const highlights = {
    grid: false,
    lettersBar: false,
    buttonBar1: false,
    wordBar: false,
    buttonBar2: false,
    title: false,
  };

  let modal;
  let letters;
  let pressedButtons;
  let bar;
  let buttonBar1Data;
  let buttonBar2Data;
  let wordBar;

  switch (tutorialPhase) {
    case tutorialPhases.GRID: {
      highlights.grid = true;
      modal = (
        <Modal
          animationType={'none'}
          transparent={true}
          visible={true}
          onRequestClose={endTutorial}
        >
          <View style={[styles.modalStyle, {justifyContent: 'flex-end'}]}>
            <ModalBox
              foregroundColor={foregroundColor}
              backgroundColor={backgroundColor}
              backDisabled={true}
              onNext={() => setTutorialPhase(tutorialPhase + 1)}
              onExit={endTutorial}
              title={'Grid'}
              text={`The letter grid contains the letters that are available to you this level. Clicking on a letter will add it to the bar.`}
            />
            <View style={{height: '20%', width:'100%'}}/>
          </View>
        </Modal>
      );
      letters = origLetters,
      pressedButtons = emptyPressedButtons;
      buttonBar1Data = noOpButtonBar1Data;
      bar = emptyLetterBar;
      buttonBar2Data = noOpButtonBar2Data;
      wordBar = emptyWordBar;
      highlights.grid = true;
      break;
    }
    case tutorialPhases.LETTERS_BAR: {
      highlights.lettersBar = true;
      modal = (
        <Modal
          animationType={'none'}
          transparent={true}
          visible={true}
          onRequestClose={endTutorial}
        >
          <View style={[styles.modalStyle, {justifyContent: 'flex-end'}]}>
            <ModalBox
              foregroundColor={foregroundColor}
              backgroundColor={backgroundColor}
              onBack={() => setTutorialPhase(tutorialPhase - 1)}
              onNext={() => setTutorialPhase(tutorialPhase + 1)}
              onExit={endTutorial}
              title={'Bar'}
              text={`The word you're currently building. Longer words get more points!\n`}
            />
            <View style={{height: '15%', width:'100%'}}/>
          </View>
        </Modal>
      );
      letters = origLetters,
      pressedButtons = [7, 0, 13, 3];
      buttonBar1Data = noOpButtonBar1Data;
      bar = ['H', 'A', 'N', 'D'];
      buttonBar2Data = noOpButtonBar2Data;
      wordBar = emptyWordBar;
      break;
    }
    case tutorialPhases.BUTTON_BAR_1: {
      highlights.buttonBar1 = true;
      modal = (
        <Modal
          animationType={'none'}
          transparent={true}
          visible={true}
          onRequestClose={endTutorial}
        >
          <View style={[styles.modalStyle, {justifyContent: 'flex-end'}]}>
            <ModalBox
              foregroundColor={foregroundColor}
              backgroundColor={backgroundColor}
              onBack={() => setTutorialPhase(tutorialPhase - 1)}
              onNext={() => setTutorialPhase(tutorialPhase + 1)}
              onExit={endTutorial}
              title={'Buttons'}
              text={`You can remove the last letter with 'Undo', or clear the bar with 'Clear'. Click 'Save' to start working on the next word.`}
            />
            <View style={{height: '3%', width:'100%'}}/>
          </View>
        </Modal>
      );
      letters = origLetters,
      pressedButtons = [7, 0, 13, 3];
      buttonBar1Data = noOpButtonBar1Data;
      bar = ['H', 'A', 'N', 'D'];
      buttonBar2Data = noOpButtonBar2Data;
      wordBar = emptyWordBar;
      break;
    }
    case tutorialPhases.WORD_BAR: {
      highlights.wordBar = true;
      modal = (
        <Modal
          animationType={'none'}
          transparent={true}
          visible={true}
          onRequestClose={endTutorial}
        >
          <View style={[styles.modalStyle, {justifyContent: 'flex-end'}]}>
            <ModalBox
              foregroundColor={foregroundColor}
              backgroundColor={backgroundColor}
              onBack={() => setTutorialPhase(tutorialPhase - 1)}
              onNext={() => setTutorialPhase(tutorialPhase + 1)}
              onExit={endTutorial}
              title={'Saved words'}
              text={`These are the words you've built so far, along with the score for each one. You can hold down on one of them to remove it.`}
            />
            <View style={{height: '33%', width:'100%'}}/>
          </View>
        </Modal>
      );
      letters = 'bcefgijklmopqrstuvwxy'.split(''),
      pressedButtons = [];
      buttonBar1Data = noOpButtonBar1Data;
      bar = [];
      buttonBar2Data = noOpButtonBar2Data;
      wordBar = [['hand', 16]];
      break;
    }
    case tutorialPhases.TITLE: {
      highlights.title = true;
      modal = (
        <Modal
          animationType={'none'}
          transparent={true}
          visible={true}
          onRequestClose={endTutorial}
        >
          <View style={[styles.modalStyle, {justifyContent: 'flex-end'}]}>
            <View style={{height: '5%', width: '100%', flexDirection: 'row', justifyContent: 'flex-start'}}>
              <View style={{width: '35%'}}/>
              <View
                style={{height: '5%', width: '38%', borderColor: foregroundColor, borderTopWidth: 1}}
              />
            </View>
            <ModalBox
              foregroundColor={foregroundColor}
              backgroundColor={backgroundColor}
              onBack={() => setTutorialPhase(tutorialPhase - 1)}
              onNext={() => setTutorialPhase(tutorialPhase + 1)}
              onExit={endTutorial}
              title={'Points'}
              text={`Your current points, your personal best score on this level, and the maximum possible score on this level.`}
            />
            <View style={{height: '65%', width:'100%'}}/>
          </View>
        </Modal>
      );
      letters = 'bcefgijklmopqrstuvwxy'.split(''),
      pressedButtons = [];
      buttonBar1Data = noOpButtonBar1Data;
      bar = [];
      buttonBar2Data = noOpButtonBar2Data;
      wordBar = [['hand', 16]];
      break;
    }
    case tutorialPhases.BUTTON_BAR_2: {
      highlights.buttonBar2 = true;
      modal = (
        <Modal
          animationType={'none'}
          transparent={true}
          visible={true}
          onRequestClose={endTutorial}
        >
          <View style={[styles.modalStyle, {justifyContent: 'flex-end'}]}>
            <ModalBox
              foregroundColor={foregroundColor}
              backgroundColor={backgroundColor}
              onBack={() => setTutorialPhase(tutorialPhase - 1)}
              onNext={endTutorial}
              onExit={endTutorial}
              title={'More buttons'}
              text={`Click 'Scramble' to re-order the grid, 'Reset' to start the level fresh, or 'Finish' once you've got enough points.`}
              final={true}
            />
            <View style={{height: '15%', width:'100%'}}/>
          </View>
        </Modal>
      );
      letters = 'bcefgijklmopqrstuvwxy'.split(''),
      pressedButtons = [];
      buttonBar1Data = noOpButtonBar1Data;
      bar = [];
      buttonBar2Data = noOpButtonBar2Data;
      wordBar = [['hand', 16]];
      break;
    }
  }

  return (
    <GameLayout
      style={{foregroundColor, backgroundColor}}
      grid={{letters, pressedButtons}}
      modal={modal}
      letterBar={{bar}}
      buttonBar1Data={buttonBar1Data}
      buttonBar2Data={buttonBar2Data}
      wordBar={{words: wordBar}}
      highlights={highlights}
    />
  );
}


function Game(props) {
  const level = props.route.params.level;
  const levelData = props.levelData;
  const [origLetters, setOrigLetters] = useState(scrambleArray(levelData.letters.split('')));
  const theme = props.theme;
  const { backgroundColor, foregroundColor, backgroundColorTransparent } = themes[theme];
  const appState = useRef(AppState.currentState);

  const [letters, setLetters] = useState(origLetters);
  const [bar, setBar] = useState([]);
  const [pressedButtons, setPressedButtons] = useState([]);
  const [words, setWords] = useState([]);
  const [score, setScore] = useState(0);
  const [endModalVisible, setEndModalVisible] = useState(false);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [helpScreenVisible, setHelpScreenVisible] = useState(false);
  console.log('helpScreenVisible?', helpScreenVisible);

  const saveGameState = () => {
    props.updateGame(
      level,
      origLetters.slice(),
      letters.slice(),
      bar.slice(),
      pressedButtons.slice(),
      words.slice(),
      endModalVisible
    );
  };

  const loadGame = () => {
    const state = props.gameState;
    setLetters(state.letters.slice());
    setBar(state.bar.slice());
    setPressedButtons(state.pressedButtons.slice());
    setWords(state.words.slice());
    setScore(state.words.map(points).reduce((x,y) => x+y, 0));
    setEndModalVisible(state.endModalVisible);
  };

  const tryLoadGame = () => {
    if (props.gameInProgress) {
      if (level === props.gameState.number) {
        loadGame();
      } else {
        props.deleteGame();
      }
    }
  };

  useEffect(() => {
    tryLoadGame();
  }, []);

  let subscription = useRef(null);

  useEffect(() => {
    subscription.current = AppState.addEventListener("change", function (nextAppState) {
      if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        saveGameState();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      if (subscription.current) {
        subscription.current.remove();
        subscription.current = null;
      }
    };
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor,
      },
      headerTintColor: foregroundColor,
    });
  });

  const updateTitle = () => {
    props.navigation.setOptions({
      title: makeTitle(score, levelData.bestUserScore, levelData.maxScore, `Level ${level}`),
    });
  }

  useEffect(updateTitle, [score, levelData.bestUserScore]);

  const leave = () => {
    saveGameState();
    props.navigation.popToTop();
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => leave()}
          tintColor={foregroundColor}
        />
      ),
      headerRight: () => {
        return (
          <Q25Button
            text={'?'}
            style={styles.helpButton}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
            onPress={() => setHelpScreenVisible(true)}
          />
        )
      },
    });
  });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        leave();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const removeLetterFromWord = (idx) => {
    const index = pressedButtons.indexOf(idx);
    if (index === -1) return;
    const newBar = bar.slice();
    const newPressedButtons = pressedButtons.slice();
    newBar.splice(index, 1);
    newPressedButtons.splice(index, 1);
    setBar(newBar);
    setPressedButtons(newPressedButtons);
  };

  const addLetterToWord = (idx) => {
    const newBar = bar.slice();
    const newPressedButtons = pressedButtons.slice();
    newBar.push(letters[idx]);
    newPressedButtons.push(idx);
    setBar(newBar);
    setPressedButtons(newPressedButtons);
  }

  const onLetterPress = (idx) => {
    if (pressedButtons.includes(idx)) {
      removeLetterFromWord(idx);
    } else {
      addLetterToWord(idx);
    }
  }

  const saveWord = () => {
    if (bar.length === 0) return;
    const word = bar.join('');
    if (!isValid(word)) return;
    const wordScore = points(word)
    const newScore = score + wordScore;
    const newWords = words.slice();
    newWords.push([word, wordScore]);
    const newLetters = letters.slice();
    const pressedIndices = pressedButtons.slice();
    pressedIndices.sort((x, y) => y-x);
    pressedIndices.forEach(idx => newLetters.splice(idx, 1));

    setLetters(newLetters);
    setWords(newWords);
    setScore(newScore);
    clearWord();
  };

  const clearWord = () => {
    if (bar.length === 0) return;
    setBar([]);
    setPressedButtons([]);
  };

  const removeSavedWord = (idx) => {
    if (idx < 0 || idx >= words.length) return;
    const newLetters = letters.slice();
    const newWords = words.slice();
    const [[word, wordScore]] = newWords.splice(idx, 1);
    for (let c of word) newLetters.push(c);
    const newScore = score - wordScore;

    setLetters(newLetters);
    setWords(newWords);
    setScore(newScore);
  };

  const reset = () => {
    setLetters(origLetters.slice());
    setBar([]);
    setPressedButtons([]);
    setWords([]);
    setScore(0);
    props.deleteGame();
  };

  const undo = () => {
    if (pressedButtons.length === 0) return;
    const newBar = bar.slice();
    const newButtons = pressedButtons.slice();
    newBar.pop();
    newButtons.pop();
    setBar(newBar);
    setPressedButtons(newButtons);
  };

  const scramble = () => {
    const lettersWithIndices = letters.map((l, i) => [l, i]);
    const scrambledLettersWithIndices = scrambleArray(lettersWithIndices);
    const newLetters = [];
    const newIndices = [];
    scrambledLettersWithIndices.forEach(([l, i]) => {
      newLetters.push(l);
      newIndices.push(i);
    });
    const newPressedButtons = pressedButtons.map(idx => newIndices.indexOf(idx));

    setLetters(newLetters);
    setPressedButtons(newPressedButtons);
  };

  const submit = () => {
    setEndModalVisible(true);
    if (score > levelData.bestUserScore) {
      const sortedWords = words.slice();
      sortedWords.sort((x,y) => x.length - y.length);
      props.updateUserProgress(level, score, sortedWords);
    }
    props.unlockLevel(level + 1);
  };

  const modalButtonData = [
    {
      text: 'Pick level',
      onPress: () => {
        props.navigation.navigate('Levels');
      },
    },
    {
      text: 'Improve',
      onPress: () => {
        setEndModalVisible(false);
      },
    },
    {
      text: 'Next level',
      onPress: () => {
        setEndModalVisible(false);
        props.navigation.push('Play', {level: level + 1});
      },
    },
  ];

  if (helpScreenVisible) {
    return (
      <HelpScreen
        style={{foregroundColor, backgroundColor}}
        endTutorial={() => {
          setHelpScreenVisible(false);
          updateTitle();
        }}
        changeTitle={title => {
          props.navigation.setOptions({
            title,
          });
        }}
      />
    );
  }

  return (
    <GameLayout
      style={{foregroundColor, backgroundColor}}
      modal={(
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={endModalVisible}
          onRequestClose={() => setEndModalVisible(false)}
        >
          <View style={[styles.modalStyle, backgroundColor: backgroundColorTransparent]}>
            <View style={[styles.modalBoxStyle, {borderColor: foregroundColor, backgroundColor}]}>
              <View style={styles.modalTitleContainer}>
                <Text style={[styles.modalTitle, {color: foregroundColor}]}>
                  {'Level cleared'.toUpperCase()}
                </Text>
              </View>
              <View style={styles.modalButtonContainer}>
                {modalButtonData.map(({text, onPress}) => (
                  <Q25Button
                    key={text}
                    text={text}
                    onPress={onPress}
                    style={styles.modalButton}
                    foregroundColor={foregroundColor}
                    backgroundColor={backgroundColor}
                  />
                ))}
              </View>
            </View>
          </View>
        </Modal>
      )}
      grid={{letters, onLetterPress, pressedButtons}}
      letterBar={{bar}}
      buttonBar1Data={[
        { text: 'Undo', onPress: undo },
        { text: 'Clear word', onPress: clearWord },
        { text: 'Save word', onPress: saveWord },
      ]}
      wordBar={{words, removeWord: removeSavedWord}}
      buttonBar2Data={[
          { text: 'Scramble', onPress: scramble },
          { text: 'Reset', onPress: reset },
          { text: 'Finish', onPress: submit, disabled: 2 * score < levelData.maxScore },
        ]}
    />
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    display: 'flex',
    padding: '10%',
    paddingBottom: 0,
    paddingTop: 0,
  },
  grid: {
    width: '100%',
    aspectRatio: 1,
  },
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBoxStyle: {
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
    aspectRatio: 2.5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
  },
  modalButton: {
    fontSize: 10,
    margin: '4%',
  },
  helpButton: {
    flex: 0,
    aspectRatio: 1,
    fontSize: 14,
    height: '300%',   // TODO fix this
    marginRight: 10,
  },
  modalTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
  },
  modalText: {
    fontSize: 16,
  },
});

const mapStateToProps = (state, ownProps) => {
  const level = ownProps.route.params.level;
  const levelData = {
    bestUserScore: 0,
    bestUserSolution: [],
    ...state.levels.levels[level],
  };
  return {
    theme: state.settings.theme.current,
    levelData,
    gameInProgress: state.game.gameInProgress,
    gameState: state.game.currentGame,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateUserProgress: doUpdateUserProgress,
    unlockLevel: doUnlockLevel,
    updateGame: doUpdateGame,
    deleteGame: doDeleteGame,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(Game);
