import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from './text';
import LetterButton from './button';
import { colors } from '../styles';


export default function Grid(props) {
  const {backgroundColor, foregroundColor} = props.style;
  const data = props.letters.map((l, idx) => ({
    letter: l,
    index: idx,
    pressed: false,
  }));
  for (let idx of props.pressedButtons) data[idx].pressed = true;
  const renderItem = ({ item }) => {
    const style = {
      backgroundColor: item.pressed ? foregroundColor : backgroundColor,
      margin: '5%',
      borderColor: foregroundColor,
    };
    return(
      <View style={{flex: 1/5, aspectRatio: 1}}>
        <LetterButton
          onPress={() => props.onLetterPress(item.index)}
          style={style}
          textColor={item.pressed ? backgroundColor : foregroundColor}
          letter={item.letter}
        />
      </View>
    );
  };

  return (
    <FlatList
      style={{flex: 1, width: '90%'}}
      contentContainerStyle={{justifyContent: 'center', flex: 1}}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.index}
      horizontal={false}
      numColumns={5}
    />
  );
};

const styles = StyleSheet.create({
});
