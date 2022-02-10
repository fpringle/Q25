import { combineReducers, compose, createStore, bindActionCreators } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import reduxReset from 'redux-reset';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  levelsReducer,
  doUpdateUserProgress,
  doResetUserProgress,
  doUnlockLevel,
} from './features/levels';
import {
  settingsReducer,
  doChangeTheme,
} from './features/settings';
import {
  gameReducer,
  doUpdateGame,
  doDeleteGame,
} from './features/game';

const rootReducer = combineReducers({
  levels: levelsReducer,
  settings: settingsReducer,
  game: gameReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['game'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const enhanceCreateStore = compose(reduxReset())(createStore);

export const store = enhanceCreateStore(persistedReducer);
export const persistor = persistStore(store);

export const doResetRedux = () => {
  return {
    type: 'RESET',
  };
};

export const boundLevelActions = bindActionCreators(
  {
    update: doUpdateUserProgress,
    reset: doResetUserProgress,
    unlock: doUnlockLevel,
  },
  store.dispatch,
);

export const boundChangeTheme = bindActionCreators(
  doChangeTheme,
  store.dispatch,
);

export const boundGameActions = bindActionCreators(
  {
    update: doUpdateGame,
    delete: doDeleteGame,
  },
  store.dispatch
);
