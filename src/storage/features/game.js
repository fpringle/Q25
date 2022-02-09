

/*
state = {
  gameInProgress: bool,
  currentGame: {
    number: int,
    origLetters: list[str],
    letters: list[str],
    bar: list[str],
    pressedButtons: list[int],
    words: list[str],
    endModalVisible: bool,
  }
}

*/


// actions
const UPDATE_GAME = 'game/update';
const DELETE_GAME = 'game/delete';

// action creators
export function doUpdateGame(
  number,
  origLetters,
  letters,
  bar,
  pressedButtons,
  words,
  endModalVisible
) {
  return {
    type: UPDATE_GAME,
    payload: {
      number,
      origLetters,
      letters,
      bar,
      pressedButtons,
      words,
      endModalVisible,
    },
  };
};
export function doDeleteGame() {
  return {
    type: DELETE_GAME,
  };
}


// initial state
const initialGameState = {
  gameInProgress: false,
  currentGame: null,
};

// reducer
export function gameReducer(state=initialGameState, action) {
  switch (action.type) {
    case UPDATE_GAME: {
      console.log('reducer: update game with payload:');
      console.log(action.payload);
      return {
        ...state,
        gameInProgress: true,
        currentGame: {
          ...action.payload
        },
      };
    }
    case DELETE_GAME: {
      return {
        ...state,
        gameInProgress: false,
        currentGame: null
      };
    }
    default: {
      return state;
    }
  }
}
