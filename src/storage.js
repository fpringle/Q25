import AsyncStorage from '@react-native-async-storage/async-storage';

import { getNumLevels } from './backend';

const appPrefix = '@q25';

const makeLevelKey = (number) => appPrefix + ':level' + number;
const makeLevelProgressKey = (number) => makeLevelKey(number) + ':progress';
const makeLevelSolutionKey = (number) => makeLevelKey(number) + ':solution';

export const Level = {
  getBestScore: (level) => {
    return AsyncStorage.getItem(makeLevelProgressKey(level)).then(val => {
      return val ? JSON.parse(val) : 0;
    });
  },
  setBestScore: (level, score) => {
    return AsyncStorage.setItem(makeLevelProgressKey(level), JSON.stringify(score));
  },

  getBestSolution: (level) => {
    return AsyncStorage.getItem(makeLevelSolutionKey(level)).then(val => {
      return val && JSON.parse(val);
    });
  },
  setBestSolution: (level, solution) => {
    return AsyncStorage.setItem(makeLevelSolutionKey(level), JSON.stringify(solution));
  },

  getBestScoreAndSolution: (level) => {
    const keys = [makeLevelProgressKey(level), makeLevelSolutionKey(level)];
    return AsyncStorage.multiGet(keys).then(result => {
      return result.map(([k, v]) => v);
    });
  },
  setBestScoreAndSolution: (level, score, solution) => {
    const keyValPairs = [
      [makeLevelProgressKey(level), JSON.stringify(score)],
      [makeLevelSolutionKey(level), JSON.stringify(solution)],
    ];
    return AsyncStorage.multiSet(keyValPairs);
  },

  getAllBestScores: (maxLevel) => {
    const keys = [];
    for (let i=1; i<=maxLevel; i++) keys.push(makeLevelProgressKey(i));
    return AsyncStorage.multiGet(keys).then(results => results.map(([k, v]) => v));
  },
  resetAllBestScores: () => {
    const keys = [];
    const numLevels = getNumLevels();
    for (let i=1; i<=numLevels; i++) keys.push(makeLevelProgressKey(i));
    return AsyncStorage.multiRemove(keys);
  }
};
