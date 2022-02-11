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

  const SettingsPicker = ({label, current, options, dispatcher}) => (
    <View style={[styles.settingsPicker, {borderColor: foregroundColor}]}>
      <Text style={[styles.settingsPickerLabel, {color: foregroundColor}]}>
        {label}
      </Text>
      <View style={[styles.pickerContainer, {borderColor: foregroundColor}]}>
        <Picker
          dropdownIconColor={foregroundColor}
          mode={'dropdown'}
          onValueChange={(itemValue) => {
            dispatcher(itemValue);
          }}
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

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <SettingsPicker
        current={theme}
        dispatcher={val => props.changeTheme(val)}
        label={'Theme'}
        options={themeOptions}
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
