import { combineReducers, createStore, bindActionCreators } from 'redux';

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

export const store = createStore(rootReducer);

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
