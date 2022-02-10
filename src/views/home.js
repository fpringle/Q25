import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import Text from '../components/text';
import Q25Button from '../components/button';
import { themes } from '../styles';


function Home(props) {
  const theme = props.theme;
  const { backgroundColor, foregroundColor } = themes[theme];

  const buttonData = [
    {
      text: 'Play',
      onPress: () => {
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
      },
    },
    {
      text: 'Levels',
      onPress: () => {
        props.navigation.navigate('Levels', { level: 1 });
      },
    },
    {
      text: 'Settings',
      onPress: () => {
        props.navigation.navigate('Settings');
      },
    },
  ];

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <View style={styles.title}>
        {['Q', '2', '5'].map((l,i) => (
          <Q25Button
            key={i}
            disabled={true}
            text={l}
            style={styles.titleButton}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
          />
        ))}
      </View>
      {buttonData.map(({text, onPress}) => (
        <View key={text} style={styles.buttonContainer}>
          <Q25Button
            text={text}
            style={styles.button}
            onPress={onPress}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
          />
        </View>
      ))}
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
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    aspectRatio: 4,
    margin: 10,
    fontSize: 32,
  },
  titleButton: {
    aspectRatio: 1,
    margin: 10,
    borderWidth: 2,
  },
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
