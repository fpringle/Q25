import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import LetterButton from '../components/button';
import { themes } from '../styles';


function Home(props) {
  const theme = props.theme;
  const { backgroundColor, foregroundColor } = themes[theme];
  return (
    <View style={[styles.container, {backgroundColor}]}>
      <View style={styles.title}>
        {['Q', '2', '5'].map((l,i) => (
          <LetterButton
            key={i}
            disabled={true}
            letter={l}
            style={{aspectRatio: 1, margin: 10, borderWidth: 2, backgroundColor, borderColor: foregroundColor}}
            textColor={foregroundColor}
          />
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <LetterButton
          letter={'Play'}
          style={[styles.button, {backgroundColor, backgroundColor, borderColor: foregroundColor}]}
          onPress={() => props.navigation.navigate('Play', { level: 1 })}
          textColor={foregroundColor}
        />
      </View>
      <View style={styles.buttonContainer}>
        <LetterButton
          letter={'Levels'}
          style={[styles.button, {backgroundColor, backgroundColor, borderColor: foregroundColor}]}
          onPress={() => props.navigation.navigate('Levels', { level: 1 })}
          textColor={foregroundColor}
        />
      </View>
      <View style={styles.buttonContainer}>
        <LetterButton
          letter={'Settings'}
          style={[styles.button, {backgroundColor, backgroundColor, borderColor: foregroundColor}]}
          onPress={()=>{props.navigation.navigate('Settings')}}
          textColor={foregroundColor}
        />
      </View>
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    aspectRatio: 4,
    margin: 10,
    //borderWidth: 1,
    fontSize: 24,
  }
});

const mapStateToProps = state => {
  return { theme: state.theme.current };
}

export default connect(mapStateToProps)(Home);
