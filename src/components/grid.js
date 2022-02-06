import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import LetterButton from './button';
import { colors } from '../styles';

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

class Grid extends Component {

  render() {
    let grid = [];
    let letters = this.props.letters.slice();
    while (letters.length < this.props.rows * this.props.columns) {
      letters.push('');
    }
    for (let i=0; i<letters.length; i+=this.props.columns) {
      grid.push(
        <View
          style={{display:'flex', flex: 1, flexDirection: 'row', justifyContent:'space-between'}}
          key={'row'+(i/this.props.columns)}
        >
          {letters.slice(i, i+this.props.columns).map((letter, idx) => (
            <View
              style={{flex: 1, margin: 5}}
              key={i+idx}
            >
              <GridLetterButton
                letter={letter}
                onLetterPress={() => this.props.onLetterPress(i+idx)}
                pressed={this.props.pressedButtons.includes(i+idx)}
              />
            </View>
          ))}
        </View>
      );
    }
    return (
      <View style={[{display:'flex', flexDirection:'column', justifyContent:'space-between'}, this.props.style]}>
        {grid}
      </View>
    );
  }
};

export default Grid;


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
