import React, { useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { Switch } from 'react-native-paper';

import Text from '../components/text';
import Q25Button from '../components/button';
import { themes } from '../styles';
import { doResetRedux, persistor } from '../storage/storage';
import { doChangeTheme, doSetBlockSubmit, doSetBlockSave } from '../storage/features/settings';
import { doResetUserProgress } from '../storage/features/levels';

const capitalize = s => s[0].toUpperCase() + s.slice(1).toLowerCase();


function SettingsPicker(props) {
  const {label, current, options, dispatcher, foregroundColor, backgroundColor} = props;
  return (
    <View style={[styles.settingsPicker, {borderColor: foregroundColor}]}>
      <Text style={[styles.settingsPickerLabel, {color: foregroundColor}]}>
        {label}
      </Text>
      <View style={[styles.pickerContainer, {borderColor: foregroundColor}]}>
        <Picker
          dropdownIconColor={foregroundColor}
          mode={'dropdown'}
          onValueChange={dispatcher}
          selectedValue={current}
          style={styles.picker}
        >
          {options.map(option => (
            <Picker.Item
              key={option}
              label={capitalize(option)}
              style={{color: foregroundColor, backgroundColor}}
              value={option}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

SettingsPicker.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  current: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  dispatcher: PropTypes.func.isRequired,
  foregroundColor: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.number),
  ]).isRequired,
};


function SettingsSwitch(props) {
  const {label, current, dispatcher, foregroundColor, backgroundColor} = props;
  return (
    <View style={[styles.settingsPicker, {borderColor: foregroundColor}]}>
      <Text style={[styles.settingsPickerLabel, {color: foregroundColor}]}>
        {label}
      </Text>
      <View style={[styles.pickerContainer, {borderColor: foregroundColor}]}>
        <Switch
          onValueChange={dispatcher}
          value={current}
          style={{backgroundColor}}
          theme={{
            colors: {
              accent: foregroundColor,
            }
          }}
          thumbColor={foregroundColor}
        />
      </View>
    </View>
  );
}

SettingsSwitch.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  current: PropTypes.bool.isRequired,
  dispatcher: PropTypes.func.isRequired,
  foregroundColor: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};


function Settings(props) {
  let { theme, themeOptions } = props;
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

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <SettingsPicker
        backgroundColor={backgroundColor}
        current={theme}
        dispatcher={props.changeTheme}
        foregroundColor={foregroundColor}
        label={'Theme'}
        options={themeOptions}
      />
      <SettingsSwitch
        backgroundColor={backgroundColor}
        current={props.gameplay.blockSubmit}
        dispatcher={props.setBlockSubmit}
        foregroundColor={foregroundColor}
        label={'Block submit'}
      />
      <SettingsSwitch
        backgroundColor={backgroundColor}
        current={props.gameplay.blockSave}
        dispatcher={props.setBlockSave}
        foregroundColor={foregroundColor}
        label={'Block save'}
      />
      <View style={styles.bigButtonContainer}>
        <Q25Button
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
          onPress={() => resetProgressDialog()}
          style={styles.bigButton}
          text={'Reset progress'}
        />
      </View>
      <View style={styles.bigButtonContainer}>
        <Q25Button
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
          onPress={() => purgeStoreDialog()}
          style={styles.bigButton}
          text={'Reset everything'}
        />
      </View>
    </View>
  )
}

Settings.propTypes = {
  changeTheme: PropTypes.func.isRequired,
  gameplay: PropTypes.exact({
    blockSave: PropTypes.bool.isRequired,
    blockSubmit: PropTypes.bool.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    setOptions: PropTypes.func.isRequired,
  }),
  resetProgress: PropTypes.func.isRequired,
  resetReduxStore: PropTypes.func.isRequired,
  setBlockSave: PropTypes.func.isRequired,
  setBlockSubmit: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  themeOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  bigButtonContainer: {
    height: '15%',
    width: '100%',
    padding: 10,
  },
});

const mapStateToProps = state => {
  return {
    theme: state.settings.theme.current,
    themeOptions: state.settings.theme.options,
    gameplay: state.settings.gameplay,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    changeTheme: doChangeTheme,
    resetProgress: doResetUserProgress,
    resetReduxStore: doResetRedux,
    setBlockSubmit: doSetBlockSubmit,
    setBlockSave: doSetBlockSave,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
