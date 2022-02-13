import { combineReducers } from 'redux';


///////////////////////////
// theme

// actions
const CHANGE_THEME = 'settings/theme/change';

// action creators
export function doChangeTheme(theme) {
  return {type: CHANGE_THEME, payload: { theme }};
}

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
    case CHANGE_THEME: {
      const { theme } = action.payload;
      if (!state.options.includes(theme)) return state;
      return {...state, current: theme};
    }
    default:
      return state;
  }
}


////////////////////////////
// gameplay

// actions
const SET_BLOCK_SUBMIT = 'settings/gameplay/set_block_submit';
const SET_BLOCK_SAVE = 'settings/gameplay/set_block_save';

// action creators
export function doSetBlockSubmit(blockSubmit) {
  return {
    type: SET_BLOCK_SUBMIT,
    payload: {
      blockSubmit,
    }
  };
}
export function doSetBlockSave(blockSave) {
  return {
    type: SET_BLOCK_SAVE,
    payload: {
      blockSave,
    }
  };
}

// initial state
const initialGameplayState = {
  // stop the user from submitting before they've reached the score threshold?
  blockSubmit: false,
  // stop the user from saving a word before it's valid?
  blockSave: false,
};

// reducer
function gameplayReducer(state=initialGameplayState, action) {
  switch (action.type) {
    case SET_BLOCK_SUBMIT: {
      const { blockSubmit } = action.payload;
      if (blockSubmit === state.blockSubmit) return state;
      return {
        ...state,
        blockSubmit,
      };
    }
    case SET_BLOCK_SAVE: {
      const { blockSave } = action.payload;
      if (blockSave === state.blockSave) return state;
      return {
        ...state,
        blockSave,
      };
    }
    default:
      return state;
  }
}


////////////////////////////
// root

export const settingsReducer = combineReducers({
  theme: themeReducer,
  gameplay: gameplayReducer,
});
