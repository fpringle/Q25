import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import LetterButton from './button';
import { colors } from '../styles';
/*
function GridLetterButton(props) {
  // props: { letter, pressed, onLetterPress }
  let textColor = props.pressed ? colors.darkGrey : colors.lightGrey;
  let disabled;
  let style = {};

  if (props.letter === '') {
    disabled = true;
    style.borderWidth = 0;
  } else {
    disabled = false;
    style.backgroundColor = props.pressed ? colors.lightGrey : colors.darkGrey;
  }


  return (
    <LetterButton
      onPress={props.onLetterPress}
      disabled={disabled}
      style={style}
      textColor={textColor}
      letter={props.letter}
    />
  );
};
*/

export default function Grid(props) {
  const data = props.letters.map((l, idx) => ({
    letter: l,
    index: idx,
    pressed: false,
  }));
  for (let idx of props.pressedButtons) data[idx].pressed = true;
  const renderItem = ({ item }) => {
    const style = {
      backgroundColor: item.pressed ? colors.lightGrey : colors.darkGrey,
      margin: '5%',
    };
    return(
      <View style={{flex: 1/5, aspectRatio: 1}}>
        <LetterButton
          onPress={() => props.onLetterPress(item.index)}
          style={style}
          textColor={item.pressed ? colors.darkGrey : colors.lightGrey}
          letter={item.letter}
        />
      </View>
    );
  };

  return (
    <FlatList
      style={{flex: 1, width: '95%'}}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.index}
      horizontal={false}
      numColumns={5}
    />
  );
};

const styles = StyleSheet.create({
  letterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.darkGrey,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.lightGrey,
//    margin: '5px',
  },
});
