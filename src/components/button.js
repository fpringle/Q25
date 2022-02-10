import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Line, Circle, Rect, Path, SvgXml } from 'react-native-svg';

import Text from './text';
import { colors } from '../styles';
import svgPathString from '../svg';

export default function LetterButton(props) {
  return (
    <TouchableOpacity
      style={[styles.letterButton, props.style]}
      onPress={props.onPress ? (() => props.onPress()) : (() => {})}
      disabled={props.disabled || false}
    >
      <Text style={{fontSize: props.style?.fontSize || 32, color: props.textColor || colors.lightGrey}}>
        {props.letter.toString().toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}

function CustomXml(props) {
  const pathString = svgPathString(props.size, props.borderRadius, props.centerRadius, props.score, props.maxScore);
  return (
    <Svg height={props.size} width={props.size} style={{borderWidth: 1, borderColor: props.foregroundColor, borderRadius: props.borderRadius, }}
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
          r={props.centerRadius}
          fill={props.backgroundColor}
          stroke="none"
        />
      ) : null}
      <Line
        x1={props.size/2}
        y1={props.size/2+props.centerRadius}
        x2={props.size/2}
        y2={props.size}
        stroke={(props.score * 2 > props.maxScore) ? props.backgroundColor : props.foregroundColor}
        strokeWidth="1"
      />

      <View style={{height: '100%', width: '100%', borderWidth: 0, borderColor: 'red', justifyContent: 'center'}}>
        <Text
          style={{color: props.foregroundColor, borderWidth: 0, width: '100%', textAlign: 'center', fontFamily:"monospace"}}
          fontSize={props.fontSize}
        >
          {props.levelNumber.toString()}
        </Text>
      </View>
    </Svg>
  )
};

export function LetterButtonSvg(props) {
  const [size, setSize] = useState(50);
  const onLayout = (e) => {
    setSize(e.nativeEvent.layout.height);
  }
  return (
    <TouchableOpacity
      style={[styles.letterButton, props.style, {borderWidth: 0}]}
      onPress={() => props.onPress()}
      disabled={props.disabled || false}
      onLayout={e => onLayout(e)}
    >
      <CustomXml
        backgroundColor={props.style.backgroundColor}
        foregroundColor={props.style.foregroundColor}
        borderRadius={props.style.borderRadius}
        size={size}
        centerRadius={size / 3}
        score={props.score}
        maxScore={props.maxScore}
        levelNumber={props.letter}
        fontSize={props.style.fontSize}
      />
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  letterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.darkGrey,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.lightGrey,
    padding: 0,
//    margin: '5px',
  },
});
