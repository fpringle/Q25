

export const colors = {
  //darkGrey: '#979797',
  darkGrey: '#757575',
  darkGreyTransparent: 'rgba(100, 100, 100, 0.84)',
  lightGrey: '#fafafa',
  lightGreyTransparent: 'rgba(250, 250, 250, 0.84)',
  matrixBlack: '#0D0208',
  matrixGreen: '#008F11',
  matrixBlackTransparent: 'rgba(13, 2, 8, 0.84)',
};

export const themes = {
  classic: {
    backgroundColor: colors.darkGrey,
    backgroundColorTransparent: colors.darkGreyTransparent,
    foregroundColor: colors.lightGrey,
  },
  inverted: {
    backgroundColor: colors.lightGrey,
    backgroundColorTransparent: colors.lightGreyTransparent,
    foregroundColor: colors.darkGrey,
  },
  matrix: {
    backgroundColor: colors.matrixBlack,
    backgroundColorTransparent: colors.matrixBlackTransparent,
    foregroundColor: colors.matrixGreen,
  },
};
