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

  const makeTitle = () => {
    const f = s => s.toString().padStart(3, ' ');
    return `Level ${level} - ${f(score)} / ${f(levelData.bestUserScore)} / ${f(levelData.maxScore)}`;
  };

  useEffect(() => {
    props.navigation.setOptions({
      title: makeTitle(),
    });
  }, [score, levelData.bestUserScore]);

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
    setScore(score);
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

  return (
    <View style={[styles.container, {backgroundColor}]}>
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
      <Grid
        columns={5}
        rows={5}
        letters={letters}
        style={styles.grid}
        onLetterPress={onLetterPress}
        pressedButtons={pressedButtons}
        foregroundColor={foregroundColor}
        backgroundColor={backgroundColor}
      />
      <LetterBar letters={bar} style={{foregroundColor, backgroundColor}}/>
      <ButtonBar
        data={[
          { text: 'Undo', onPress: undo },
          { text: 'Clear word', onPress: clearWord },
          { text: 'Save word', onPress: saveWord },
        ]}
        style={{foregroundColor, backgroundColor}}
      />
      <WordBar
        words={words}
        style={{foregroundColor, backgroundColor}}
        removeWord={idx => removeSavedWord(idx)}
      />
      <ButtonBar
        data={[
          { text: 'Scramble', onPress: scramble },
          { text: 'Reset', onPress: reset },
          { text: 'Finish', onPress: submit, disabled: 2 * score < levelData.maxScore },
        ]}
        style={{foregroundColor, backgroundColor}}
      />
    </View>
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
