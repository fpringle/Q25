import React, { useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Picker } from '@react-native-picker/picker';

import Text from '../components/text';
import LetterButton from '../components/button';
import { themes } from '../styles';
import { doChangeTheme } from '../storage/features/settings';
import { doResetUserProgress } from '../storage/features/levels';

const capitalize = s => s[0].toUpperCase() + s.slice(1).toLowerCase();

function Settings(props) {
  let { theme, themeOptions, dispatch } = props;
  console.log(props);
  const { backgroundColor, foregroundColor } = themes[theme];

  useEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor,
      },
      headerTintColor: foregroundColor,
    });
  });

  const resetProgressDialog = () => {
    Alert.alert(
      'WARNING',
      'This will reset all your progress on every level. Are you sure?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Reset',
          onPress: () => props.resetProgress(),
        }
      ],
      {
        cancelable: true,
      },
    );
  };

  const SettingsPicker = ({label, current, options, dispatcher}) => (
    <View style={{flexDirection: 'row', borderWidth: 0, borderColor: foregroundColor, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{color: foregroundColor, flex:1}}>
        {label}
      </Text>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: foregroundColor, display: 'flex'}}>
        <Picker
          mode={'dropdown'}
          selectedValue={current}
          onValueChange={(itemValue) => {
            dispatcher(itemValue);
          }}
          style={{width: '100%'}}
          dropdownIconColor={foregroundColor}
        >
          {options.map(option => (
            <Picker.Item key={option} label={capitalize(option)} value={option} style={{color: foregroundColor, backgroundColor}}/>
          ))}
        </Picker>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <SettingsPicker
        label={'Theme'}
        current={theme}
        options={themeOptions}
        dispatcher={val => props.changeTheme(val)}
      />
      <View style={{height: '15%', width: '100%', padding: 10}}>
        <LetterButton
          letter={'Reset progress'}
          style={{fontSize: 20, backgroundColor, borderColor: foregroundColor}}
          textColor={foregroundColor}
          onPress={() => resetProgressDialog()}
        />
      </View>
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    display: 'flex',
    padding: '10%',
    paddingBottom: '25%'
  },
  buttonContainer: {
    flex: 1,
    //borderWidth: 1,
  },
  button: {
    aspectRatio: 3,
    margin: 10,
    //borderWidth: 1,
    fontSize: 24,
  }
});

const mapStateToProps = state => {
  return {
    theme: state.settings.theme.current,
    themeOptions: state.settings.theme.options,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    changeTheme: doChangeTheme,
    resetProgress: doResetUserProgress,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
