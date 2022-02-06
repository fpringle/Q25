import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, Modal, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Grid from '../components/grid';
import { LetterBar, BottomBar, ButtonBar, WordBar } from '../components/bars';
import { colors } from '../styles';
import { getLevel, points, isValid } from '../backend';
import { Level } from '../storage';
import LetterButton from '../components/button';

// random integer in [0, lim]
const randInt = (lim) => Math.floor(Math.random() * (lim + 1));

export default function Game({route, navigation}) {

  const level = route.params.level;
  const levelData = getLevel(level);
  const origLetters = levelData.letters.split('');

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

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.popToTop();
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
    //set
    Level.getBestScore(level).then(_bestScore => {
      //console.log('current best score:', _bestScore)
      setEndModalVisible(true);
      if (score <= _bestScore) return;
      setBestScore(score);
      const sortedWords = words.slice();
      sortedWords.sort((x,y) => x.length - y.length);
      return Level.setBestScoreAndSolution(level, score, sortedWords);
    })
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={endModalVisible}
        onRequestClose={() => setEndModalVisible(false)}
      >
        <View style={styles.modalStyle}>
          <View style={styles.modalBoxStyle}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{color: colors.lightGrey, fontSize: 24}}>
                {'Level cleared'.toUpperCase()}
              </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, width: '100%'}}>
              <LetterButton
                letter={'Pick level'}
                onPress={()=>{}}
                style={{fontSize: 10, margin: '4%'}}
              />
              <LetterButton
                letter={'Improve'}
                onPress={()=>{}}
                style={{fontSize: 10, margin: '4%'}}
              />
              <LetterButton
                letter={'Next level'}
                onPress={() => {
                  setEndModalVisible(false);
                  navigation.push('Play', {level: level + 1});
                }}
                style={{fontSize: 10, margin: '4%'}}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Grid
        columns={5}
        rows={5}
        letters={letters}
        style={{width:'100%', aspectRatio: 1}}
        onLetterPress={onLetterPress}
        pressedButtons={pressedButtons}
      />
      <LetterBar letters={bar}/>
      <ButtonBar
        onReset={() => reset()}
        onClearWord={() => clearWord()}
        onSaveWord={() => saveWord()}
      />
      <WordBar words={words}/>
      <BottomBar
        score={score}
        bestScore={bestScore}
        maxScore={levelData.best_score}
        onSubmit={() => submit()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkGrey,
    alignItems: 'center',
    justifyContent: 'space-around',
    display: 'flex',
    padding: '10%',
    paddingBottom: 0,
    paddingTop: '15%',
  },
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkGreyTransparent,
  },
  modalBoxStyle: {
    borderColor: colors.lightGrey,
    backgroundColor: colors.darkGrey,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
    aspectRatio: 2.5,
  },
});
