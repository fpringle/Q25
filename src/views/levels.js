import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { connect } from 'react-redux';

import Text from '../components/text';
import LetterButton, { LetterButtonSvg } from '../components/button';
import { themes } from '../styles';

function Levels(props) {
  const { theme, levelData } = props;
  const { backgroundColor, foregroundColor } = themes[theme];

  useEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor,
      },
      headerTintColor: foregroundColor,
    });
  });

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => props.navigation.popToTop()}
          tintColor={foregroundColor}
        />
      ),
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        props.navigation.popToTop();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={{width: '100%', aspectRatio: 1, flex:1/5}}>
      <LetterButtonSvg
        onPress={() => props.navigation.push('Play', {level: item.number})}
        style={{fontSize: 12, width: '100%', aspectRatio: 1, margin: '5%', backgroundColor, borderColor: foregroundColor, borderRadius: 5, foregroundColor}}
        letter={item.number}
        textColor={foregroundColor}
        maxScore={item.maxScore}
        score={item.bestUserScore}
        passingScore={item.passingScore}
      />
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <FlatList
        style={{width: '100%', marginTop: 5}}
        data={levelData}
        renderItem={renderItem}
        keyExtractor={item => item.number}
        numColumns={5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    display: 'flex',
    padding: '10%',
    //paddingBottom: 0,
    paddingTop: 0,
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
    levelData,
  };
}
export default connect(mapStateToProps)(Levels);
