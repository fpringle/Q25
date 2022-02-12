import config from '../../ads/config';

const { FREE_UNLOCKS } = config;

/*
state = {
  numUnlocks: int,   // using an "unlock" lets the user unlock a level for free
},
*/


// actions
const CONSUME_UNLOCK = 'perks/unlocks/consume';
const ADD_UNLOCKS = 'perks/unlocks/add';

// action creators
export const doConsumeUnlock = () => {
  return {
    type: CONSUME_UNLOCK,
  };
};
export const doAddUnlocks = (add_unlocks) => {
  return {
    type: CONSUME_UNLOCK,
    payload: {
      add_unlocks,
    },
  };
};

// initial state
const initialPerksState = {
  numUnlocks: FREE_UNLOCKS,
};

// reducer
export function perksReducer(state=initialPerksState, action) {
  switch (action.type) {
    case CONSUME_UNLOCK: {
      return {
        ...state,
        numUnlocks: Math.max(0, state.numUnlocks - 1),
      };
    }
    case ADD_UNLOCKS: {
      const { add_unlocks } = action.payload;
      return {
        ...state,
        numUnlocks: state.numUnlocks + add_unlocks,
      };
    }
    default:
      return state;
  }
}
