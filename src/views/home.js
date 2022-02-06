import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import LetterButton from '../components/button';
import { colors } from '../styles';

export default function Home({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        {['Q', '2', '5'].map((l,i) => (
          <LetterButton
            key={i}
            disabled={true}
            letter={l}
            style={{aspectRatio: 1, margin: 10, borderWidth: 2}}
          />
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <LetterButton
          letter={'Play'}
          style={styles.button}
          onPress={() => navigation.navigate('Play', { level: 1 })}
        />
      </View>
      <View style={styles.buttonContainer}>
        <LetterButton
          letter={'Levels'}
          style={styles.button}
          onPress={() => navigation.navigate('Levels', { level: 1 })}
        />
      </View>
      <View style={styles.buttonContainer}>
        <LetterButton
          letter={'Settings'}
          style={styles.button}
          onPress={()=>{}}
        />
      </View>
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkGrey,
    alignItems: 'center',
    justifyContent: 'space-around',
    display: 'flex',
    padding: '10%',
    paddingBottom: '25%'
  },
  title: {
    flexDirection: 'row',
    flex: 5,
    alignItems: 'center',
    //borderWidth: 1,
  },
  buttonContainer: {
    flex: 1,
    //borderWidth: 1,
  },
  button: {
    aspectRatio: 3,
    margin: 10,
    //borderWidth: 1,
    fontSize: 24,
  }
});
