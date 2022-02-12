import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { store, persistor } from './storage/storage';

import Home from './views/home';
import Game from './views/game';
import Levels from './views/levels';
import Settings from './views/settings';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null}
        persistor={persistor}
      >
        <NavigationContainer>
          <Stack.Navigator initialRouteName={'Home'}>
            <Stack.Screen
              component={Home}
              name="Home"
              options={{headerShown: false}}
            />
            <Stack.Screen
              component={Levels}
              name="Levels"
              options={{
                headerShown: true,
                title: '',
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              component={Game}
              name="Play"
              options={() => {
                return {
                  headerShown: true,
                  title: '',
                  headerShadowVisible: false,
                  headerTitleStyle: {
                    fontSize: 14,
                    fontFamily: 'monospace',
                  },
                };
              }}
            />
            <Stack.Screen
              component={Settings}
              name="Settings"
              options={{
                headerShown: true,
                title: '',
                headerShadowVisible: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
