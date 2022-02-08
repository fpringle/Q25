import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { colors } from '../styles';
import svgPathString from './svg';

const makeXml = (size, cornerRadius, centerRadius, bg, fg, score, maxScore, xOffset, yOffset, level) => {
  return `<svg version="1.1" width="${size+xOffset}" height="${size+yOffset}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg">
        <stop stop-color="${bg}"/>
      </linearGradient>
      <linearGradient id="fg">
        <stop stop-color="${fg}"/>
      </linearGradient>
    </defs>
    <!--<rect x="0" y="0" width="100%" height="100%" fill="url(#bg)"/>-->
    <rect x="${xOffset}" y="${yOffset}" width="${size}" height="${size}" fill="url(#bg)" rx="${cornerRadius}" ry="${cornerRadius}" stroke="url(#fg)" stroke-width="2"/>
    ${svgPathString(size, cornerRadius, centerRadius, score, maxScore, xOffset, yOffset)}
    <text x="50%" y="55%" text-anchor="middle" alignment-baseline="middle" font-size="12" fill="url(#fg)">${level}</text>
  </svg>
  `;
}

export default function LetterButton(props) {
  return (
    <TouchableOpacity
      style={[styles.letterButton, props.style]}
      onPress={() => props.onPress()}
      disabled={props.disabled || false}
    >
      <Text style={{fontSize: props.style?.fontSize || 32, color: props.textColor || colors.lightGrey}}>
        {props.letter.toString().toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}

export function LetterButtonSvg(props) {
  const [size, setSize] = useState(0);
  const onLayout = (e) => {
    setSize(e.nativeEvent.layout.height);
  }
  const xml = makeXml( size, 5, size/4, props.style.backgroundColor, props.textColor.toUpperCase(), props.score, props.maxScore, 0, 0, props.letter);
  if (props.letter === 1) {
    console.log(props.letter.toString().toUpperCase());
    console.log(xml);
  }
  return (
    <TouchableOpacity
      style={[styles.letterButton, props.style, {borderWidth: 0}]}
      onPress={() => props.onPress()}
      disabled={props.disabled || false}
      onLayout={e => onLayout(e)}
    >
      <SvgXml xml={xml} height={'100%'} width={'100%'}>
      </SvgXml>
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
