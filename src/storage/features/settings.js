import { combineReducers } from 'redux';


///////////////////////////
// theme

// actions
const CHANGE_THEME = 'settings/theme/change';

// action creators
export function doChangeTheme(theme) {
  return {type: CHANGE_THEME, payload: theme};
};

// initial state
const initialThemeState = {
  current: 'classic',
  options: [
    'classic',
    'inverted',
    'matrix',
  ],
};

// reducer
function themeReducer(state=initialThemeState, action) {
  switch (action.type) {
    case CHANGE_THEME:
      if (!state.options.includes(action.payload)) return state;
      return {...state, current: action.payload};
    default:
      return state;
  }
}







////////////////////////////
// root

export const settingsReducer = combineReducers({
  theme: themeReducer,
});

