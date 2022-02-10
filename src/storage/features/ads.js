import config from '../../ads/config';

const { INTERSTITIAL_FREQUENCY } = config;

/*
state= {
  levelsUntilNextAd: 5,
}
*/

// actions
const DECREMENT_LEVELS = 'ads/decrement_levels_until_next_ad';
const RESET_LEVELS = 'ads/reset_levels_until_next_ad';

// action creators
export const doDecrementLevels = () => {
  return {
    type: DECREMENT_LEVELS,
  };
};
export const doResetLevels = () => {
  return {
    type: RESET_LEVELS,
  };
};


// initial state
const initialState = {
  levelsUntilNextAd: INTERSTITIAL_FREQUENCY,
};


// reducer
export function adsReducer(state=initialState, action) {
  switch (action.type) {
    case DECREMENT_LEVELS: {
      return {
        ...state,
        levelsUntilNextAd: state.levelsUntilNextAd - 1,
      };
    }
    case RESET_LEVELS: {
      return {
        ...state,
        levelsUntilNextAd: INTERSTITIAL_FREQUENCY,
      };
    }
    default:
      return state;
  }
};
