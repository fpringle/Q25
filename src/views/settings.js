import React, { useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Picker } from '@react-native-picker/picker';

import Text from '../components/text';
import Q25Button from '../components/button';
import { themes } from '../styles';
import { doResetRedux, persistor } from '../storage/storage';
import { doChangeTheme } from '../storage/features/settings';
import { doResetUserProgress } from '../storage/features/levels';

const capitalize = s => s[0].toUpperCase() + s.slice(1).toLowerCase();

function Settings(props) {
  let { theme, themeOptions, dispatch } = props;
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

  const purgeStoreDialog = () => {
    Alert.alert(
      'WARNING',
      'This will wipe all the data associated with this game. Are you sure?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Reset',
          onPress: () => {
            persistor.purge().then(() => props.resetReduxStore());
          },
        }
      ],
      {
        cancelable: true,
      },
    );
  };

  const SettingsPicker = ({label, current, options, dispatcher}) => (
    <View style={[styles.settingsPicker, {borderColor: foregroundColor}]}>
      <Text style={[styles.settingsPickerLabel, {color: foregroundColor}]}>
        {label}
      </Text>
      <View style={[styles.pickerContainer, {borderColor: foregroundColor}]}>
        <Picker
          mode={'dropdown'}
          selectedValue={current}
          onValueChange={(itemValue) => {
            dispatcher(itemValue);
          }}
          style={styles.picker}
          dropdownIconColor={foregroundColor}
        >
          {options.map(option => (
            <Picker.Item
              key={option}
              label={capitalize(option)}
              value={option}
              style={{color: foregroundColor, backgroundColor}}
            />
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
        <Q25Button
          text={'Reset progress'}
          style={styles.bigButton}
          foregroundColor={foregroundColor}
          backgroundColor={backgroundColor}
          onPress={() => resetProgressDialog()}
        />
      </View>
      <View style={{height: '15%', width: '100%', padding: 10}}>
        <Q25Button
          text={'Reset everything'}
          style={styles.bigButton}
          foregroundColor={foregroundColor}
          backgroundColor={backgroundColor}
          onPress={() => purgeStoreDialog()}
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
  },
  button: {
    aspectRatio: 3,
    margin: 10,
    fontSize: 24,
  },
  settingsPicker: {
    flexDirection: 'row',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsPickerLabel: {
    flex: 1,
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    display: 'flex',
  },
  picker: {
    width: '100%',
  },
  bigButton: {
    fontSize: 20,
  },
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
    resetReduxStore: doResetRedux,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
