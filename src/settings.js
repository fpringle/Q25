import { combineReducers, createStore } from 'redux';


// theme
const initialThemeState = {
  current: 'classic',
  options: [
    'classic',
    'inverted',
    'matrix',
  ],
};


function themeReducer(state=initialThemeState, action) {
  switch (action.type) {
    case 'theme/changed':
      if (!state.options.includes(action.payload)) return state;
      return {...state, current: action.payload};
    default:
      return state;
  }
}

// root

const rootReducer = combineReducers({
  theme: themeReducer,
});

export default createStore(rootReducer);


// actions
export function changeTheme(theme) {
  return {type: 'theme/changed', payload: theme};
};
