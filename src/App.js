import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import settingsStore from './settings';

import Home from './views/home';
import Game from './views/game';
import Levels from './views/levels';
import Settings from './views/settings';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={settingsStore}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen
            name='Home'
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='Levels'
            component={Levels}
            options={{
              headerShown: true,
              title: '',
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name='Play'
            component={Game}
            options={{
              headerShown: true,
              title: '',
              headerShadowVisible: false,
              headerTitleStyle: {
                fontSize: 14,
                fontFamily: 'monospace',
              },
            }}
          />
          <Stack.Screen
            name='Settings'
            component={Settings}
            options={{
              headerShown: true,
              title: '',
              headerShadowVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
