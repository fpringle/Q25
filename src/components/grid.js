import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import Q25Button from './button';


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
          backgroundColor={item.pressed ? foregroundColor : backgroundColor}
          foregroundColor={item.pressed ? backgroundColor : foregroundColor}
          idx={item.index}
          onPress={() => props.onLetterPress(item.index)}
          style={{...styles.gridButton, borderColor: foregroundColor}}
          text={item.letter}
        />
      </View>
    );
  };

  return (
    <FlatList
      contentContainerStyle={styles.gridContentContainer}
      data={data}
      horizontal={false}
      keyExtractor={item => item.index}
      numColumns={5}
      renderItem={renderItem}
      style={[styles.grid, props.style]}
    />
  );
}

Grid.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  foregroundColor: PropTypes.string.isRequired,
  letters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onLetterPress: PropTypes.func,
  pressedButtons: PropTypes.arrayOf(PropTypes.number).isRequired,
  style: PropTypes.shape({}),
};

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    width: '85%',
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
