import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { AdMobInterstitial, AdMobRewarded, setTestDeviceIDAsync } from 'expo-ads-admob';
import * as Sentry from 'sentry-expo';

import { store, persistor } from './storage/storage';
import { TEST_AD_UNIT_IDS, REAL_AD_UNIT_IDS } from './ads/ids';

import Home from './views/home';
import Game from './views/game';
import Levels from './views/levels';
import Settings from './views/settings';
import About from './views/about';

Sentry.init({
  dsn: 'https://07fbbe671eac4813a95af7ea6b222526@o1143685.ingest.sentry.io/6204565',
  enableInExpoDevelopment: true,
  debug: true,
});

(async () => {
  await setTestDeviceIDAsync('EMULATOR');
  await AdMobInterstitial.setAdUnitID(TEST_AD_UNIT_IDS.interstitial);
  await AdMobRewarded.setAdUnitID(TEST_AD_UNIT_IDS.rewarded);
})();

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
            <Stack.Screen
              component={About}
              name="About"
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
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
