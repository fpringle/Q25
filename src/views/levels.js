import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import LetterButton from '../components/button';
import { themes } from '../styles';
import { getAllLevels } from '../backend';

function Levels(props) {
  const theme = props.theme;
  const { backgroundColor, foregroundColor } = themes[theme];
  const [levelData, setLevelData] = useState([]);

  useEffect(() => {
    const levels = getAllLevels();
    setLevelData(levels);
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor,
      },
      headerTintColor: foregroundColor,
    });
  });

  const renderItem = ({ item }) => (
    <View style={{width: '100%', aspectRatio: 1, flex:1/5}}>
      <LetterButton
        onPress={() => props.navigation.push('Play', {level: item.number})}
        style={{fontSize: 16, width: '100%', aspectRatio: 1, margin: '5%', backgroundColor, borderColor: foregroundColor}}
        letter={item.number}
        textColor={foregroundColor}
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
  return { theme: state.theme.current };
}

export default connect(mapStateToProps)(Levels);
