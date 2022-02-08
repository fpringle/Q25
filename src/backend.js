import word_list from '../data/words/word_list.json';

export const points = (word) => {
  return word.length ** 2;
};

export const isValid = (word) => {
  return word.length >= 3 && word_list.includes(word.toLowerCase());
};
