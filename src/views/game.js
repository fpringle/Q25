import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, Modal, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';

import Grid from '../components/grid';
import Text from '../components/text';
import { LetterBar, BottomBar, ButtonBar, WordBar } from '../components/bars';
import { themes } from '../styles';
import { getLevel, points, isValid } from '../backend';
import { Level } from '../storage';
import LetterButton from '../components/button';

// random integer in [0, lim]
const randInt = (lim) => Math.floor(Math.random() * (lim + 1));

function Game(props) {

  const level = props.route.params.level;
  const levelData = getLevel(level);
  const origLetters = levelData.letters.split('');
  const theme = props.theme;
  const { backgroundColor, foregroundColor, backgroundColorTransparent } = themes[theme];

  const scrambled = () => {
    let lets = origLetters.slice();
    let n = lets.length;
    for (let i=n-1; i>0; i--) {
      let j = randInt(i);
      [lets[i], lets[j]] = [lets[j], lets[i]];
    }
    return lets;
  }

  const [letters, setLetters] = useState(scrambled());
  const [bar, setBar] = useState([]);
  const [pressedButtons, setPressedButtons] = useState([]);
  const [words, setWords] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [endModalVisible, setEndModalVisible] = useState(false);

  useEffect(() => {
    Level.getBestScore(level).then(best_score => {
      setBestScore(best_score);
    });
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
    return `Level ${level} - ${f(score)} / ${f(bestScore)} / ${f(levelData.best_score)}`;
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: makeTitle(),
    });
  }, [score, bestScore]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        props.navigation.popToTop();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const onLetterPress = idx => {
    if (pressedButtons.includes(idx)) return;
    const newBar = bar.slice();
    const newButtons = pressedButtons.slice();
    newBar.push(letters[idx]);
    newButtons.push(idx);
    setBar(newBar);
    setPressedButtons(newButtons);
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

  const reset = () => {
    setLetters(scrambled());
    setBar([]);
    setPressedButtons([]);
    setWords([]);
    setScore(0);
  };

  const submit = () => {
    Level.getBestScore(level).then(_bestScore => {
      setEndModalVisible(true);
      if (score <= _bestScore) return;
      setBestScore(score);
      const sortedWords = words.slice();
      sortedWords.sort((x,y) => x.length - y.length);
      return Level.setBestScoreAndSolution(level, score, sortedWords);
    })
  };

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
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{color: foregroundColor, fontSize: 24}}>
                {'Level cleared'.toUpperCase()}
              </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, width: '100%'}}>
              <LetterButton
                letter={'Pick level'}
                onPress={() => {
                  props.navigation.navigate('Levels');
                }}
                style={{fontSize: 10, margin: '4%', backgroundColor, borderColor: foregroundColor}}
                textColor={foregroundColor}
              />
              <LetterButton
                letter={'Improve'}
                onPress={() => {
                  setEndModalVisible(false);
                }}
                style={{fontSize: 10, margin: '4%', backgroundColor, borderColor: foregroundColor}}
                textColor={foregroundColor}
              />
              <LetterButton
                letter={'Next level'}
                onPress={() => {
                  setEndModalVisible(false);
                  props.navigation.push('Play', {level: level + 1});
                }}
                style={{fontSize: 10, margin: '4%', backgroundColor, borderColor: foregroundColor}}
                textColor={foregroundColor}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Grid
        columns={5}
        rows={5}
        letters={letters}
        style={{width:'100%', aspectRatio: 1, foregroundColor, backgroundColor}}
        onLetterPress={onLetterPress}
        pressedButtons={pressedButtons}
      />
      <LetterBar letters={bar} style={{foregroundColor, backgroundColor}}/>
      <ButtonBar
        onReset={() => reset()}
        onClearWord={() => clearWord()}
        onSaveWord={() => saveWord()}
        style={{foregroundColor, backgroundColor}}
      />
      <WordBar words={words} style={{foregroundColor, backgroundColor}}/>
      <BottomBar
        score={score}
        bestScore={bestScore}
        maxScore={levelData.best_score}
        onSubmit={() => submit()}
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
});

const mapStateToProps = state => {
  return { theme: state.theme.current };
}

export default connect(mapStateToProps)(Game);
