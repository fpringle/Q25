import word_list from '../data/words/word_list.json';
import levelData from '../data/levels/all_levels.json';

export const points = (word) => {
  return word.length ** 2;
};

export const isValid = (word) => {
  return word.length >= 3 && word_list.includes(word.toLowerCase());
};

export const getLevel = (number) => {
  return levelData[number-1];
};

export const getAllLevels = () => {
  return levelData.slice();
};

export const getNumLevels = () => {
  return levelData.length;
};
