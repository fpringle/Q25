import React from 'react';
import { Linking, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';


export default function Q25Text(props) {
  return (
    <Text
      {...props}
      style={[styles.text, props.style]}
    >
      {props.children}
    </Text>
  );
}

Q25Text.propTypes = {
  children: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export function URLText(props) {
  return (
    <Q25Text
      onPress={() => Linking.openURL(props.url)}
      style={[styles.urlText, props.style]}
    >
      {props.children}
    </Q25Text>
  );
}

URLText.propTypes = {
  children: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  url: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'monospace',
  },
  urlText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
