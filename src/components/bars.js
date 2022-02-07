import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { themes } from '../styles';

export function LetterBar(props) {
  const { backgroundColor, foregroundColor } = props.style;
  const style = {
    borderTopColor: foregroundColor,
    borderBottomColor: foregroundColor,
  };
  return (
    <View style={[styles.letterBar, style]}>
      {/*<BarGradient letters={props.letters}/>*/}
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
  return (
    <TouchableOpacity style={[styles.button, {borderColor: foregroundColor}]} onPress={props.onPress}>
      <Text style={{color: foregroundColor}}>
        {props.text}
      </Text>
    </TouchableOpacity>
  )
}

export function ButtonBar(props) {
  return (
    <View style={styles.buttonBar}>
      <ButtonBarButton text={"Reset"} onPress={props.onReset} style={props.style}/>
      <ButtonBarButton text={"Clear word"} onPress={props.onClearWord} style={props.style}/>
      <ButtonBarButton text={"Save word"} onPress={props.onSaveWord} style={props.style}/>
    </View>
  );
};

export function WordBar(props) {
  const { backgroundColor, foregroundColor } = props.style;
  return (
    <View style={styles.wordBar}>
      {props.words.map(([word, wordScore], idx) => (
        <View key={idx} style={{flexDirection: 'row'}}>
          <View style={{marginRight: 5, width: '60%'}}>
            <Text style={{color: foregroundColor}}>
              {word.toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={{color: foregroundColor}}>
              {wordScore + ' points'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
};

export function BottomBar(props) {
  const { backgroundColor, foregroundColor } = props.style;
  const score = (
    'Score: ' +
    props.score.toString().padStart(3, ' ')/* +
    ' / ' +
    props.maxScore.toString()*/
  );

  return (
    <View style={styles.bottomBar}>
      <View style={{marginRight: 20}}>
        <Text style={{color: foregroundColor}}>
          {'Score: ' + props.score.toString().padStart(3, ' ')}
        </Text>
      </View>
      <View style={{marginRight: 20}}>
        <Text style={{color: foregroundColor}}>
          {'Best score: ' + props.bestScore.toString().padStart(3, ' ')}
        </Text>
      </View>
      <ButtonBarButton text={"Submit"} onPress={props.onSubmit} style={props.style}/>
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
    width: '28%',
    alignItems:'center',
  }
});
