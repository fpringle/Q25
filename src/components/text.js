import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';


export default function Q25Text(props) {
  return (
    <Text
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

const styles = StyleSheet.create({
  text: {
    fontFamily: 'monospace',
  },
});
