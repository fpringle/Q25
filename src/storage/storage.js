import { combineReducers, createStore, bindActionCreators } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  levelsReducer,
  doUpdateUserProgress,
  doResetUserProgress
} from './features/levels';
import {
  settingsReducer,
  doChangeTheme,
} from './features/settings';

const rootReducer = combineReducers({
  levels: levelsReducer,
  settings: settingsReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

export const boundLevelActions = bindActionCreators(
  {
    update: doUpdateUserProgress,
    reset: doResetUserProgress,
  },
  store.dispatch,
);

export const boundChangeTheme = bindActionCreators(
  doChangeTheme,
  store.dispatch,
);
