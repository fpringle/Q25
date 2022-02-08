import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Picker } from '@react-native-picker/picker';

import Text from '../components/text';
import LetterButton from '../components/button';
import { themes } from '../styles';
import { changeTheme } from '../settings';

const capitalize = s => s[0].toUpperCase() + s.slice(1).toLowerCase();

function Settings(props) {
  let { theme , dispatch } = props;
  const options = theme.options;
  theme = theme.current;
  const { backgroundColor, foregroundColor } = themes[theme];

  useEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor,
      },
      headerTintColor: foregroundColor,
    });
  });

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
        options={options}
        dispatcher={val => dispatch(changeTheme(val))}
      />
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
  return { theme: state.theme };
}

export default connect(mapStateToProps)(Settings);
