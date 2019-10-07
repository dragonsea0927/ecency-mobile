import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$primaryBackgroundColor',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 72,
    fontWeight: '700',
    color: '$primaryDarkGray',
  },
  countDesc: {
    color: '$primaryDarkGray',
    fontSize: 16,
    marginTop: 5,
    fontWeight: '700',
  },
  spinnerWrapper: {
    flex: 1,
    marginTop: 10,
  },
  backgroundTags: {
    position: 'absolute',
    width: '$deviceWidth',
    height: 320,
    left: 0,
    top: 16,
    right: 0,
    zIndex: 998,
  },
  descriptionWrapper: {
    backgroundColor: '$primaryDarkBlue',
    width: 75,
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    position: 'absolute',
    top: '$deviceHeight / 5',
    right: 0,
  },
  description: {
    fontSize: 10,
    color: '$pureWhite',
    fontWeight: 'bold',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '$primaryDarkBlue',
    transform: [{ rotate: '-90deg' }],
    position: 'absolute',
    left: -22,
  },
  productWrapper: {
    flex: 0.8,
    zIndex: 998,
    alignItems: 'center',
  },
  spinButton: {
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextDate: {
    marginTop: 50,
    color: '$primaryDarkGray',
    fontSize: 16,
    fontWeight: '600',
  },
});
