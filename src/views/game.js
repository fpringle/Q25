import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Grid from '../components/grid';
import {LetterBar, BottomBar, ButtonBar, WordBar} from '../components/bars';
import {colors} from '../styles';

const _letters = 'abcdefghijklmnopqrstuvwxy'.split('');

const points = word => word.length ** 2;

export default function Game() {
  const [letters, setLetters] = useState(_letters.slice());
  const [bar, setBar] = useState([]);
  const [pressedButtons, setPressedButtons] = useState([]);
  const [words, setWords] = useState([]);
  const [score, setScore] = useState(0);

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
    setLetters(_letters.slice());
    setBar([]);
    setPressedButtons([]);
    setWords([]);
    setScore(0);
  };

  const submit = () => {

  };

  return (
    <View style={styles.container}>
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
      <BottomBar score={score} onSubmit={() => submit()}/>
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
});
