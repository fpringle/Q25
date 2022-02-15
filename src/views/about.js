import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import { connect } from 'react-redux';

import Text, { URLText } from '../components/text';
import { themes } from '../styles';


function Url(props) {
  return (
    <URLText
      style={[styles.text, {color: props.color}]}
      url={props.url}
    >
      {props.text}
    </URLText>
  );
}

Url.propTypes = {
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

function About(props) {
  let { theme } = props;
  const { backgroundColor, foregroundColor } = themes[theme];

  const version = Constants.manifest.version;
  const versionCode = Constants.manifest.android.versionCode;

  useEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor,
      },
      headerTintColor: foregroundColor,
      title: `Q25 - version ${version} (${versionCode})`,
    });
  }, []);

  const libraries = [
    ['React Navigation', 'https://reactnavigation.org/'],
    ['react-native-picker', 'https://github.com/react-native-picker/picker'],
    ['react-native-svg', 'https://github.com/react-native-svg/react-native-svg'],
    ['Sentry', 'https://sentry.io/'],
    ['Redux', 'https://redux.js.org/'],
    ['React Native Elements', 'https://reactnativeelements.com/'],
    ['React Native Paper', 'https://callstack.github.io/react-native-paper/'],
    ['Redux Persist', 'https://github.com/rt2zz/redux-persist'],
  ].sort((x, y) => x[0].toLowerCase() < y[0].toLowerCase() ? -1 : 1);

  const librariesNodes = [];
  libraries.forEach(([name, url]) => {
    librariesNodes.push('\n');
    librariesNodes.push((
      <Url
        color={foregroundColor}
        key={name}
        text={name}
        url={url}
      />
    ));
  });

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <View style={styles.textContainer}>

        <View style={styles.subTextContainer}>
        <Text style={[styles.text, {color: foregroundColor}]}>
          {'Thank you for playing!'}
        </Text>
        </View>

        <View style={styles.subTextContainer}>
        <Text style={[styles.text, {color: foregroundColor}]}>
          {'Q25 is made by '}
          <Url
            color={foregroundColor}
            text={'Frederick Pringle'}
            url={'https://play.google.com/store/apps/dev?id=5456037314185531832'}
          />
          {' using '}
          <Url
            color={foregroundColor}
            text={'React Native'}
            url={'https://reactnative.dev/'}
          />
          {' and '}
          <Url
            color={foregroundColor}
            text={'Expo'}
            url={'https://expo.dev/'}
          />
          {'.'}
        </Text>
        </View>

        <View style={styles.subTextContainer}>
        <Text style={[styles.text, {color: foregroundColor}]}>
          {'Thanks to '}
          <Url
            color={foregroundColor}
            text={'Kevin Atkinson'}
            url={'http://www.kevina.org/'}
          />
          {' for making the '}
          <Url
            color={foregroundColor}
            text={'SCOWL wordlist'}
            url={'http://wordlist.aspell.net/'}
          />
          {' publicly available.'}
        </Text>
        </View>

        <View style={styles.subTextContainer}>
        <Text style={[styles.text, {color: foregroundColor}]}>
          <Url
            color={foregroundColor}
            text={'Lock Icon Vector'}
            url={'https://www.freeiconspng.com/img/29056'}
          />
          {' courtesy of '}
          <Url
            color={foregroundColor}
            text={'Free Icons PNG'}
            url={'https://www.freeiconspng.com/'}
          />
        </Text>
        </View>

        <View style={[styles.subTextContainer, {flex: null}]}>
        <Text style={[styles.text, {color: foregroundColor}]}>
          {`Other open-source software used in this app include:\n`}
          {librariesNodes}
        </Text>
        </View>

      </View>
    </View>
  )
}

About.propTypes = {
  navigation: PropTypes.shape({
    setOptions: PropTypes.func.isRequired,
  }),
  theme: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    display: 'flex',
    padding: '10%',
    paddingTop: 0,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    fontSize: 16,
    textAlign: 'center'
  },
  subTextContainer: {
    flex: 1,
    minWidth: '100%',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => {
  return {
    theme: state.settings.theme.current,
  };
};

export default connect(mapStateToProps)(About);
