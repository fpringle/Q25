import config from '../../ads/config';

const { INTERSTITIAL_FREQUENCY } = config;

/*
state= {
  levelsUntilNextAd: 5,
  isRewardedAdLoaded: false,
}
*/

// actions
const DECREMENT_LEVELS = 'ads/decrement_levels_until_next_ad';
const RESET_LEVELS = 'ads/reset_levels_until_next_ad';
const SET_REWARDED_AD_LOADED = 'ads/set_rewarded_ad_loaded';

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
export const doSetRewardedAdLoaded = (isLoaded) => {
  return {
    type: SET_REWARDED_AD_LOADED,
    payload: {
      isLoaded,
    },
  };
};


// initial state
const initialState = {
  levelsUntilNextAd: INTERSTITIAL_FREQUENCY,
  isRewardedAdLoaded: false,
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
    case SET_REWARDED_AD_LOADED: {
      return {
        ...state,
        isRewardedAdLoaded: action.payload.isLoaded,
      };
    }
    default:
      return state;
  }
}
