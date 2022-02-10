import levelData from '../../../data/levels/all_levels.json'

/*
state = {
  numLevels: 1,
  levels: {
    1: {
      number: int,
      letters: string,
      maxScore: int,
      passingScore: int,
      bestUserScore: int,
      bestUserSolution: list[string]
    },
    ...
  }
}
*/

// actions
const UPDATE_USER_PROGRESS = 'levels/update_progress';
const RESET_USER_PROGRESS = 'levels/reset_progress';

// action creators
export const doUpdateUserProgress = (level, score, solution) => {
  return {
    type: UPDATE_USER_PROGRESS,
    payload: {
      level,
      score,
      solution,
    },
  };
};
export const doResetUserProgress = () => {
  return {
    type: RESET_USER_PROGRESS,
  };
}

// initial state

const initialState = {
  levels: levelData,
  numLevels: Object.keys(levelData).length,
};


// reducer
export function levelsReducer(state=initialState, action) {
  switch (action.type) {
    case UPDATE_USER_PROGRESS: {
      const { level, score, solution } = action.payload;
      return {
        ...state,
        levels: {
          ...state.levels,
          [level]: {
            ...state.levels[level],
            bestUserScore: score,
            bestUserSolution: solution.slice(),
          },
        }
      };
    }
    case RESET_USER_PROGRESS: {
      const levels = {};
      for (let key in state.levels) {
        levels[key] = {
          ...state.levels[key],
          bestUserScore: 0,
          bestUserSolution: [],
        };
      }
      return {...state, levels}
    }
    default:
      return state;
  }
};
