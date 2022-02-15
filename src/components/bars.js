import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

import Text from './text';
import Q25Button from './button';

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

LetterBar.propTypes = {
  letters: PropTypes.arrayOf(PropTypes.string).isRequired,
  style: PropTypes.exact({
    foregroundColor: PropTypes.string.isRequired,
  }).isRequired,
};

function ButtonBarButton(props) {
  const { backgroundColor, foregroundColor } = props.style;
  let [background, foreground] = [backgroundColor, foregroundColor];
  if (props.disabled) {
    //background = foregroundColor;
    //foreground = backgroundColor;
  }
  return (
    <Q25Button
      backgroundColor={background}
      disabled={props.disabled}
      foregroundColor={foreground}
      onPress={props.onPress}
      style={styles.button}
      text={props.text}
    />
  );
}

ButtonBarButton.propTypes = {
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.exact({
    backgroundColor: PropTypes.string.isRequired,
    foregroundColor: PropTypes.string.isRequired,
  }).isRequired,
  text: PropTypes.string.isRequired,
};

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

ButtonBar.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.exact({
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    text: PropTypes.string.isRequired,
  })),
  foregroundColor: PropTypes.string.isRequired,
  style: PropTypes.exact({
    borderColor: PropTypes.string.isRequired,
  }).isRequired,
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

WordBarRow.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  delayLongPress: PropTypes.number,
  foregroundColor: PropTypes.string.isRequired,
  onLongPress: PropTypes.func,
  word: PropTypes.string.isRequired,
  wordScore: PropTypes.number.isRequired,
};

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

WordBar.propTypes = {
  removeWord: PropTypes.func,
  style: PropTypes.shape({
    backgroundColor: PropTypes.string.isRequired,
    foregroundColor: PropTypes.string.isRequired,
  }).isRequired,
  words: PropTypes.arrayOf(PropTypes.array).isRequired,
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
  },
  letterBarText: {
    fontSize: 32,
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
    fontSize: 12,
    maxWidth: '30%',
  },
  wordContainer: {
    marginRight: 5,
    width: '60%',
  },
});
