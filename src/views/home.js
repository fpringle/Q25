import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import Text from '../components/text';
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
          onPress={() => {
            let level = 1;
            if (props.gameInProgress) {
              level = props.gameState.number;
            } else {
              for (let i=0; i<props.levelData.length; i++) {
                if (props.levelData[i].bestUserScore == 0) {
                  level = props.levelData[i].number;
                  break;
                }
              }
            }
            props.navigation.navigate('Play', { level });
          }}
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
  const levelData = [];
  for (let i=1; i<=state.levels.numLevels; i++) {
    levelData.push({
      bestUserScore: 0,
      bestUserSolution: [],
      ...state.levels.levels[i],
    });
  }
  return {
    theme: state.settings.theme.current,
    gameInProgress: state.game.gameInProgress,
    gameState: state.game.currentGame,
    levelData,
  };
}

export default connect(mapStateToProps)(Home);
