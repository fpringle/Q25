import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
            backgroundColor={backgroundColor}
            disabled
            foregroundColor={foregroundColor}
            key={i}
            style={styles.titleButton}
            text={l}
          />
        ))}
      </View>
      {buttonData.map(({text, onPress}) => (
        <View
          key={text}
          style={styles.buttonContainer}
        >
          <Q25Button
            backgroundColor={backgroundColor}
            foregroundColor={foregroundColor}
            onPress={onPress}
            style={styles.button}
            text={text}
          />
        </View>
      ))}
    </View>
  );
}

Home.propTypes = {
  gameInProgress: PropTypes.bool.isRequired,
  gameState: PropTypes.exact({
    bar: PropTypes.arrayOf(PropTypes.string),
    endModalVisible: PropTypes.bool.isRequired,
    letters: PropTypes.arrayOf(PropTypes.string).isRequired,
    number: PropTypes.number.isRequired,
    origLetters: PropTypes.arrayOf(PropTypes.string).isRequired,
    pressedButtons: PropTypes.arrayOf(PropTypes.number),
    words: PropTypes.arrayOf(PropTypes.array).isRequired,
  }),
  levelData: PropTypes.arrayOf(PropTypes.exact({
    bestUserScore: PropTypes.number.isRequired,
    bestUserSolution: PropTypes.arrayOf(PropTypes.string).isRequired,
    letters: PropTypes.string.isRequired,
    maxScore: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    unlocked: PropTypes.bool,
  })).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  theme: PropTypes.string.isRequired,
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
