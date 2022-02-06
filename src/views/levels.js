import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import LetterButton from '../components/button';
import { colors } from '../styles';
import { getAllLevels } from '../backend';

export default function Levels({route, navigation}) {

  const [levelData, setLevelData] = useState([]);


  useEffect(() => {
    const levels = getAllLevels();
    setLevelData(levels);
  }, []);

  const renderItem = ({ item }) => (
    <LetterButton
      onPress={() => navigation.navigate('Play', {level: item.number})}
      style={{fontSize: 16, width: '100%', aspectRatio: 1, margin: '1%'}}
      letter={item.number}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={{width: '100%'}}
        data={levelData}
        renderItem={renderItem}
        keyExtractor={item => item.number}
        numColumns={5}
        horizontal={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkGrey,
    alignItems: 'center',
    justifyContent: 'space-around',
    display: 'flex',
    padding: '10%',
    borderWidth: 1,
    borderColor: 'black',
    //paddingBottom: 0,
    //paddingTop: '15%',
  },
});
