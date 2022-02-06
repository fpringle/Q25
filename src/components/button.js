import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../styles';

export default function LetterButton(props) {
  return (
    <TouchableOpacity
      style={[styles.letterButton, props.style]}
      onPress={() => props.onPress()}
      disabled={props.disabled}
    >
      <Text style={{fontSize: props.style.fontSize || 32, color: props.textColor || colors.lightGrey}}>
        {props.letter.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}


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
