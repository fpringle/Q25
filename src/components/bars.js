import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

//import BarGradient from './barGradient';
import { colors } from '../styles';

export function LetterBar(props) {
  return (
    <View style={styles.letterBar}>
      {/*<BarGradient letters={props.letters}/>*/}
      {props.letters.map((l, i) => (
        <View key={i}>
          <Text style={{fontSize: 32, color: colors.lightGrey}}>
            {l.toUpperCase()}
          </Text>
        </View>
      ))}
    </View>
  );
};

function ButtonBarButton(props) {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.buttonText}>
        {props.text}
      </Text>
    </TouchableOpacity>
  )
}

export function ButtonBar(props) {
  return (
    <View style={styles.buttonBar}>
      <ButtonBarButton text={"Reset"} onPress={props.onReset}/>
      <ButtonBarButton text={"Clear word"} onPress={props.onClearWord}/>
      <ButtonBarButton text={"Save word"} onPress={props.onSaveWord}/>
    </View>
  );
};

export function WordBar(props) {
  return (
    <View style={styles.wordBar}>
      {props.words.map(([word, wordScore], idx) => (
        <View key={idx} style={{flexDirection: 'row'}}>
          <View style={{marginRight: 5, width: '60%'}}>
            <Text style={styles.buttonText}>
              {word.toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.buttonText}>
              {wordScore + ' points'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
};

export function BottomBar(props) {
  return (
    <View style={styles.bottomBar}>
      <View style={{marginRight: 50}}>
        <Text style={{color: colors.lightGrey}}>
          {'Score: ' + props.score}
        </Text>
      </View>
      <ButtonBarButton text={"Submit"} onPress={props.onSubmit}/>
    </View>
  )
};



const styles = StyleSheet.create({
  letterBar: {
    borderTopColor: colors.lightGrey,
    borderTopWidth: 1,
    borderBottomColor: colors.lightGrey,
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
  buttonText: {
    color: colors.lightGrey,
  },
  button: {
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.lightGrey,
    padding: 5,
    width: '28%',
    alignItems:'center',
  }
});
