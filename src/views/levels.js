import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, FlatList, Modal, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { useFocusEffect } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AdMobRewarded } from 'expo-ads-admob';

import Text from '../components/text';
import Q25Button, { Q25ButtonSvg, LockButton } from '../components/button';
import { themes } from '../styles';
import { doConsumeUnlock } from '../storage/features/perks';
import { doUnlockLevel } from '../storage/features/levels';
import { doSetRewardedAdLoaded } from '../storage/features/ads';


// console.log = () => {};

function Levels(props) {
  const { theme, levelData } = props;
  const { backgroundColor, backgroundColorTransparent, foregroundColor } = themes[theme];

  const [lockModalVisible, setLockModalVisible] = useState(false);
  const lockModalLevel = useRef(null);
  const [explanationModalVisible, setExplanationModalVisible] = useState(false);
  const [adLoading, setAdLoading] = useState(false);

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
      headerRight: explanationModalVisible ? null : () => (
        <Q25Button
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
          onPress={() => setExplanationModalVisible(true)}
          style={styles.helpButton}
          text={'?'}
        />
      ),
    });
  }, [explanationModalVisible]);

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

  const loadAd = async () => {
    console.log('loading ad');
    setAdLoading(true);
    await AdMobRewarded.requestAdAsync();
  }

  const tryLoadAd = async () => {
    if (!(props.isRewardedAdLoaded || adLoading)) {
      await loadAd();
    }
  };

  useEffect(() => {
    tryLoadAd();
  }, []);

  const onAdLoad = () => {
    console.log('ad loaded - props.setRewardedAdLoaded(true); setAdLoading(false)')
    props.setRewardedAdLoaded(true);
    setAdLoading(false);
  };

  const useUnlock = () => {
    props.consumeUnlock();
    props.unlockLevel(lockModalLevel);
    setLockModalVisible(false);
  };

  const onDismiss = async () => {
    // user dismissed ad without reward
    console.log('user dismissed ad - props.setRewardedAdLoaded(false); loadAd()')
    props.setRewardedAdLoaded(false);
    setAdLoading(false);
    await loadAd();
  };

  const onEarnReward = () => {
    setLockModalVisible(false);
    console.log(`User finished ad, unlock level ${lockModalLevel}`);
    props.unlockLevel(lockModalLevel);
  };

  useEffect(() => {
    AdMobRewarded.addEventListener('rewardedVideoDidLoad', onAdLoad);
    return () => {
      AdMobRewarded.removeEventListener('rewardedVideoDidLoad', onAdLoad);
    };
  }, []);

  useEffect(() => {
    AdMobRewarded.addEventListener('rewardedVideoDidDismiss', onDismiss);
    return () => {
      AdMobRewarded.removeEventListener('rewardedVideoDidDismiss', onDismiss);
    };
  }, []);

  useEffect(() => {
    AdMobRewarded.addEventListener('rewardedVideoUserDidEarnReward', onEarnReward);
    return () => {
      AdMobRewarded.removeEventListener('rewardedVideoUserDidEarnReward', onEarnReward);
    }
  }, [lockModalLevel]);

  useEffect(() => {
    return AdMobRewarded.removeAllListeners;
  }, []);

  const leftButton = props.numUnlocks > 0 ? {
    text: `Unlock (${props.numUnlocks} remaining)`,
    onPress: useUnlock,
  } : props.isRewardedAdLoaded ? {
    text: `Watch ad to unlock`,
    onPress: async () => {
      await AdMobRewarded.showAdAsync();
    },
  } : {
    text: `Ad loading`,
    disabled: true,
  };

  const lockModalButtonsData =  [
    leftButton,
    {
      text: 'Close',
      onPress: () => setLockModalVisible(false),
    },
  ];

  const explanationModalButtonsData = [
    {
      text: 'Close',
      onPress: () => setExplanationModalVisible(false),
    },
  ];

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
          onPress={async () => {
            lockModalLevel.current = item.number;
            setLockModalVisible(true);
            await tryLoadAd();
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
              {`Level ${lockModalLevel.current} is still locked. Complete level ${lockModalLevel.current-1} to unlock this level.`}
            </Text>
            <View style={styles.modalButtonContainer}>
              {lockModalButtonsData.map(({text, onPress, disabled}) => (
                <Q25Button
                  backgroundColor={disabled ? foregroundColor : backgroundColor}
                  foregroundColor={disabled ? backgroundColor : foregroundColor}
                  key={text}
                  onPress={disabled ? null : onPress}
                  style={styles.modalButton}
                  text={text}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType={'none'}
        onRequestClose={() => setLockModalVisible(false)}
        transparent
        visible={explanationModalVisible}
      >
        <View style={[styles.modalStyle, backgroundColor: backgroundColorTransparent]}>
          <View style={[styles.modalBoxStyle, {borderColor: foregroundColor, backgroundColor, aspectRatio: 1.6}]}>
            <Text style={[styles.modalText, {color: foregroundColor}]}>
              {`This screen shows the levels you've completed, and how well you've done on each one. Some levels are locked - to unlock them you have to complete the previous levels, use an unlock token (${props.numUnlocks} remaining), or watch an advert.`}
            </Text>
            <View style={[styles.modalButtonContainer, {justifyContent: 'center'}]}>
              {explanationModalButtonsData.map(({text, onPress, disabled}) => (
                <Q25Button
                  backgroundColor={disabled ? foregroundColor : backgroundColor}
                  foregroundColor={disabled ? backgroundColor : foregroundColor}
                  key={text}
                  onPress={disabled ? null : onPress}
                  style={{...styles.modalButton, maxWidth: '25%', aspectRatio: 3, marginTop: 0}}
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

Levels.propTypes = {
  consumeUnlock: PropTypes.func.isRequired,
  isRewardedAdLoaded: PropTypes.bool.isRequired,
  levelData: PropTypes.arrayOf(PropTypes.exact({
    bestUserScore: PropTypes.number.isRequired,
    bestUserSolution: PropTypes.arrayOf(PropTypes.string).isRequired,
    letters: PropTypes.string.isRequired,
    maxScore: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    unlocked: PropTypes.bool,
  })).isRequired,
  navigation: PropTypes.shape({
    popToTop: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
  numUnlocks: PropTypes.number.isRequired,
  setRewardedAdLoaded: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  unlockLevel: PropTypes.func.isRequired,
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
  helpButton: {
    flex: 0,
    aspectRatio: 1,
    fontSize: 14,
    height: '300%',   // TODO fix this
    marginRight: 10,
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
    padding: '3%',
    paddingBottom: 0,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    fontSize: 10,
    margin: '4%',
    flex: 1,
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
    numUnlocks: state.perks.numUnlocks,
    isRewardedAdLoaded: state.ads.isRewardedAdLoaded,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    consumeUnlock: doConsumeUnlock,
    setRewardedAdLoaded: doSetRewardedAdLoaded,
    unlockLevel: doUnlockLevel,
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Levels);
