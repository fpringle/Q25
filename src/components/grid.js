import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from './text';
import Q25Button from './button';
import { colors } from '../styles';


export default function Grid(props) {
  const {backgroundColor, foregroundColor} = props;
  const data = props.letters.map((l, idx) => ({
    letter: l,
    index: idx,
    pressed: false,
  }));
  for (let idx of props.pressedButtons) {
    data[idx].pressed = true;
  }
  const renderItem = ({ item }) => {
    return(
      <View style={styles.gridButtonContainer}>
        <Q25Button
          idx={item.index}
          onPress={() => props.onLetterPress(item.index)}
          style={[styles.gridButton, {borderColor: foregroundColor}]}
          backgroundColor={item.pressed ? foregroundColor : backgroundColor}
          foregroundColor={item.pressed ? backgroundColor : foregroundColor}
          text={item.letter}
        />
      </View>
    );
  };

  return (
    <FlatList
      style={styles.grid}
      contentContainerStyle={styles.gridContentContainer}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.index}
      horizontal={false}
      numColumns={5}
    />
  );
};

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    width: '90%',
  },
  gridContentContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  gridButtonContainer: {
    flex: 1/5,
    aspectRatio: 1,
  },
  gridButton: {
    margin: '5%',
  },
});
