import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import Svg, { Line, Circle, Path } from 'react-native-svg';

import Text from './text';
import { colors } from '../styles';
import svgPathString from '../svg';

export default function Q25Button(props) {
  const {backgroundColor, foregroundColor} = props;
  return (
    <TouchableOpacity
      disabled={props.disabled || false}
      onPress={props.onPress}
      style={[styles.q25Button, {borderColor: foregroundColor, backgroundColor}, props.style]}
    >
      <Text style={{fontSize: props.style?.fontSize || 32, color: foregroundColor || colors.darkGrey}}>
        {props.text.toString().toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}

Q25Button.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  foregroundColor: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.shape({
    fontSize: PropTypes.number
  }).isRequired,
  text: PropTypes.string.isRequired,
};

export function LockButton(props) {
  const {backgroundColor, foregroundColor} = props;
  return (
    <TouchableOpacity
      accessibilityLabel={'Locked level'}
      accessible
      disabled={props.disabled || false}
      onPress={props.onPress}
      style={[styles.q25Button, {borderColor: foregroundColor, backgroundColor}, props.style]}
    >
      <Image
        source={require('../../assets/images/lock96.png')}
        style={styles.lockImage}
        tintColor={foregroundColor}
      />
    </TouchableOpacity>
  );
}

LockButton.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  foregroundColor: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.shape({}),
};

function CustomXml(props) {
  const pathString = svgPathString(props.size, props.borderRadius, props.centerRadius, props.score, props.maxScore);
  return (
    <Svg
      height={props.size}
      style={[
        styles.svg,
        {borderColor: props.foregroundColor, borderRadius: props.borderRadius}
      ]}
      width={props.size}
    >
      <Path
        d={pathString}
        fill={props.foregroundColor}
        stroke="none"
      />
      {props.score === props.maxScore ? (
        <Circle
          cx={props.size / 2}
          cy={props.size / 2}
          fill={props.backgroundColor}
          r={props.centerRadius}
          stroke="none"
        />
      ) : null}
      <Line
        stroke={(props.score * 2 > props.maxScore) ? props.backgroundColor : props.foregroundColor}
        strokeWidth="1"
        x1={props.size/2}
        x2={props.size/2}
        y1={props.size/2+props.centerRadius}
        y2={props.size}
      />

      <View style={styles.svgButtonTextContainer}>
        <Text
          fontSize={props.fontSize}
          style={[styles.svgButtonText, {color: props.foregroundColor}]}
        >
          {props.levelNumber.toString()}
        </Text>
      </View>
    </Svg>
  )
}

CustomXml.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  borderRadius: PropTypes.number.isRequired,
  centerRadius: PropTypes.number.isRequired,
  fontSize: PropTypes.number.isRequired,
  foregroundColor: PropTypes.string.isRequired,
  levelNumber: PropTypes.number.isRequired,
  maxScore: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
}

export function Q25ButtonSvg(props) {
  const {backgroundColor, foregroundColor} = props;
  const [size, setSize] = useState(50);
  const onLayout = (e) => {
    setSize(e.nativeEvent.layout.height);
  }
  return (
    <TouchableOpacity
      disabled={props.disabled || false}
      onLayout={e => onLayout(e)}
      onPress={props.onPress}
      style={[styles.q25Button, styles.q25ButtonSvg, props.style]}
    >
      <CustomXml
        backgroundColor={backgroundColor}
        borderRadius={props.style.borderRadius}
        centerRadius={size / 3}
        fontSize={props.style.fontSize}
        foregroundColor={foregroundColor}
        levelNumber={props.text}
        maxScore={props.maxScore}
        score={props.score}
        size={size}
      />
    </TouchableOpacity>
  );
}

Q25ButtonSvg.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  foregroundColor: PropTypes.string.isRequired,
  maxScore: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  score: PropTypes.number.isRequired,
  style: PropTypes.shape({
    borderRadius: PropTypes.number.isRequired,
    fontSize: PropTypes.number.isRequired,
  }).isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const styles = StyleSheet.create({
  q25Button: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 0,
  },
  q25ButtonSvg: {
    borderWidth: 0,
  },
  svg: {
    borderWidth: 1,
  },
  svgButtonTextContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  svgButtonText: {
    borderWidth: 0,
    width: '100%',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  lockImage: {
    width: '40%',
    height:'40%',
  },
});
