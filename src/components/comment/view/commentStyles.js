import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  commentContainer: {
    marginTop: 10,
  },
  leftIcon: {
    color: '$iconColor',
  },
  leftButton: {
    marginLeft: 10,
  },
  rightButton: {
    backgroundColor: '$iconColor',
    height: 18,
    flexDirection: 'row-reverse',
    borderRadius: 20,
    minWidth: 40,
  },
  moreText: {
    color: '$white',
    fontSize: 10,
    marginLeft: 12,
    marginRight: 2,
  },
  bodyWrapper: {
    marginTop: -10,
  },
  iconStyle: {
    color: '$white',
    marginRight: 12,
    marginTop: 1,
  },
  footerWrapper: {
    flex: 1,
    flexDirection: 'row',
    right: 29,
  },
  rightButtonWrapper: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 0,
    bottom: -10,
    padding: 10,
  },
  voteCountText: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    color: '$iconColor',
  },
  voteCountWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
