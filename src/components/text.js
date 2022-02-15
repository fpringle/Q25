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

export function URLText(props) {
  return (
    <Q25Text
      style={[styles.urlText, props.style]}
      onPress={() => Linking.openURL(props.url)}
    >
      {props.children}
    </Q25Text>
  );
}

Q25Text.propTypes = {
  children: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
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
