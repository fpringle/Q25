import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from './text';

export function LetterBar(props) {
  const { foregroundColor } = props.style;
  const style = {
    borderTopColor: foregroundColor,
    borderBottomColor: foregroundColor,
  };
  return (
    <View style={[styles.letterBar, style, props.style]}>
      {props.letters.map((l, i) => (
        <View key={i}>
          <Text style={[styles.letterBarText, {color: foregroundColor}]}>
            {l.toUpperCase()}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ButtonBarButton(props) {
  const { backgroundColor, foregroundColor } = props.style;
  let [background, foreground] = [backgroundColor, foregroundColor];
  if (props.disabled) {
    background = foregroundColor;
    foreground = backgroundColor;
  }
  // TODO these should be Q25Buttons
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={[styles.button, {borderColor: foreground, backgroundColor: background}]}
    >
      <Text style={[styles.buttonBarButtonText, {color: foreground}]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  )
}

export function ButtonBar(props) {
  const {foregroundColor, backgroundColor} = props;
  return (
    <View style={[styles.buttonBar, props.style]}>
      {props.data.map(({text, onPress, disabled}, idx) => (
        <ButtonBarButton
          disabled={disabled}
          key={idx}
          onPress={onPress}
          style={{foregroundColor, backgroundColor}}
          text={text}
        />
      ))}
    </View>
  );
}

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
      activeOpacity={1}
      delayLongPress={delayLongPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.wordBarRow, {backgroundColor}]}
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
}

export function WordBar(props) {
  const { backgroundColor, foregroundColor } = props.style;
  return (
    <View style={[styles.wordBar, props.style]}>
      {props.words.map(([word, wordScore], idx) => (
        <WordBarRow
          backgroundColor={backgroundColor}
          delayLongPress={500}
          foregroundColor={foregroundColor}
          key={idx}
          onLongPress={() => props.removeWord(idx)}
          word={word}
          wordScore={wordScore}
        />
      ))}
    </View>
  )
}


const styles = StyleSheet.create({
  letterBar: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    aspectRatio: 6,
//    marginTop: 10,
  },
  letterBarText: {
    fontSize: 32,
  },
  buttonBarButtonText: {
    fontSize: 12,
  },
  wordBar: {
    flexDirection: 'column',
    width: '100%',
    height: '25%',
    borderWidth: 2,
    paddingTop: 10,
  },
  wordBarRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '105%',
    paddingHorizontal: 5,
    aspectRatio: 5.7,
    borderWidth: 2,
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
