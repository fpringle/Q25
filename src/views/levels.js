import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, FlatList, Modal, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { connect } from 'react-redux';

import Text from '../components/text';
import Q25Button, { Q25ButtonSvg, LockButton } from '../components/button';
import { themes } from '../styles';


function Levels(props) {
  const { theme, levelData } = props;
  const { backgroundColor, backgroundColorTransparent, foregroundColor } = themes[theme];

  const [lockModalVisible, setLockModalVisible] = useState(false);
  const [lockModalLevel, setLockModalLevel] = useState(null);

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
    <View style={styles.levelButtonContainer}>
      {item.unlocked ? (
        <Q25ButtonSvg
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
          maxScore={item.maxScore}
          onPress={() => props.navigation.push('Play', {level: item.number})}
          passingScore={item.passingScore}
          score={item.bestUserScore}
          style={styles.levelButton}
          text={item.number}
        />
      ) : (
        <LockButton
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
          onPress={() => {
            setLockModalLevel(item.number);
            setLockModalVisible(true);
          }}
          style={styles.levelButton}
        />
      )}
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <Modal
        animationType={'none'}
        onRequestClose={() => setLockModalVisible(false)}
        transparent
        visible={lockModalVisible}
      >
        <View style={[styles.modalStyle, backgroundColor: backgroundColorTransparent]}>
          <View style={[styles.modalBoxStyle, {borderColor: foregroundColor, backgroundColor}]}>
            <View style={styles.modalTitleContainer}>
              <Text style={[styles.modalTitle, {color: foregroundColor}]}>
                {'Level locked'.toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.modalText, {color: foregroundColor}]}>
              {`Level ${lockModalLevel} is still locked. Complete the earlier levels to unlock this level.`}
            </Text>
            <View style={styles.modalButtonContainer}>
              {[{text: 'Close', onPress:()=>setLockModalVisible(false)}].map(({text, onPress}) => (
                <Q25Button
                  backgroundColor={backgroundColor}
                  foregroundColor={foregroundColor}
                  key={text}
                  onPress={onPress}
                  style={styles.modalButton}
                  text={text}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={levelData}
        keyExtractor={item => item.number}
        numColumns={5}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
      />
    </View>
  );
}

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
  levelButtonContainer: {
    width: '100%',
    aspectRatio: 1,
    flex: 1/5,
  },
  levelButton: {
    fontSize: 12,
    width: '100%',
    aspectRatio: 1,
    margin: '5%',
    borderRadius: 5,
  },
  flatList: {
    width: '100%',
    marginTop: 5,
  },
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBoxStyle: {
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    paddingTop: 10,
    aspectRatio: 2,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    width: '30%',
    aspectRatio: 2.5,
    marginTop: 10,
  },
  modalButton: {
    fontSize: 10,
    margin: '4%',
  },
  modalTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
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
