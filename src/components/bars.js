import React, { useState } from 'react';
import { Button, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from './text';
import { themes } from '../styles';

export function LetterBar(props) {
  const { backgroundColor, foregroundColor } = props.style;
  const style = {
    borderTopColor: foregroundColor,
    borderBottomColor: foregroundColor,
  };
  return (
    <View style={[styles.letterBar, style]}>
      {props.letters.map((l, i) => (
        <View key={i}>
          <Text style={{fontSize: 32, color: foregroundColor}}>
            {l.toUpperCase()}
          </Text>
        </View>
      ))}
    </View>
  );
};

function ButtonBarButton(props) {
  const { backgroundColor, foregroundColor } = props.style;
  let [background, foreground] = [backgroundColor, foregroundColor];
  if (props.disabled) {
    background = foregroundColor;
    foreground = backgroundColor;
  }
  // these should be Q25Buttons
  return (
    <TouchableOpacity
      style={[styles.button, {borderColor: foreground, backgroundColor: background}]}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      <Text style={{color: foreground, fontSize: 12}}>
        {props.text}
      </Text>
    </TouchableOpacity>
  )
}

export function ButtonBar(props) {
  return (
    <View style={styles.buttonBar}>
      {props.data.map(({text, onPress, disabled}, idx) => (
        <ButtonBarButton key={idx} text={text} onPress={onPress} style={props.style} disabled={disabled}/>
      ))}
    </View>
  );
};

function WordBarRow(props) {
  const {onLongPress, delayLongPress, word, wordScore} = props;
  const [backgroundColor, setBackgroundColor] = useState(props.backgroundColor);
  const [foregroundColor, setForegroundColor] = useState(props.foregroundColor);
  const onPressIn = () => {
    setBackgroundColor(props.foregroundColor);
    setForegroundColor(props.backgroundColor);
  }
  const onPressOut = () => {
    setBackgroundColor(props.backgroundColor);
    setForegroundColor(props.foregroundColor);
  }
  return (
    <TouchableOpacity
      style={{flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between', backgroundColor, borderRadius: 10}}
      onLongPress={onLongPress}
      delayLongPress={delayLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}
    >
      <View style={styles.wordContainer}>
        <Text style={{color: foregroundColor}}>
          {word.toUpperCase()}
        </Text>
      </View>
      <View>
        <Text style={{color: foregroundColor}}>
          {wordScore + ' points'}
        </Text>
      </View>
    </TouchableOpacity>
  )
};

export function WordBar(props) {
  const { backgroundColor, foregroundColor } = props.style;
  return (
    <View style={styles.wordBar}>
      {props.words.map(([word, wordScore], idx) => (
        <WordBarRow
          key={idx}
          onLongPress={() => props.removeWord(idx)}
          delayLongPress={500}
          word={word}
          wordScore={wordScore}
          foregroundColor={foregroundColor}
          backgroundColor={backgroundColor}
        />
      ))}
    </View>
  )
};


const styles = StyleSheet.create({
  letterBar: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    aspectRatio: 6,
    marginTop: 10,
  },
  wordBar: {
    flexDirection: 'column',
    width: '100%',
    height: '25%',
    //borderColor: 'black',
    //borderWidth: 1,
  },
  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    aspectRatio: 6,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    aspectRatio: 6,
  },
  button: {
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 5,
    width: '30%',
    alignItems:'center',
  },
  wordContainer: {
    marginRight: 5,
    width: '60%',
  },
});
