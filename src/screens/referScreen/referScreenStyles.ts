import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  pointsContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  pointsEarnedRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  earnedWrapper: {
    marginRight: 8,
  },
  pendingWrapper: {
    marginLeft: 8,
  },
  points: {
    color: '$primaryBlue',
    fontSize: 26,
    marginTop: 24,
    justifyContent: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  earendText: {
    color: '$darkIconColor',
    fontSize: 16,
    justifyContent: 'center',
    marginTop: 5,
  },
  pendingText: {
    color: '$primaryDarkGray',
    fontSize: 16,
    justifyContent: 'center',
    marginTop: 5,
  },
  mainButton: {
    marginTop: 16,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  mainButtonWrapper: {
    flexDirection: 'row',
  },
  unclaimedText: {
    color: '$pureWhite',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  mainIconWrapper: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  referralsListContainer: {
    flex: 1,
  },
  rewardText: {
    width: 120,
  },
  dollarSign: {
    color: '$primaryDarkGray',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  blueDollarSign: {
    color: '$primaryBlue',
  },
  rightItemRendererContainer:{
    paddingHorizontal:8,
    height:40,    
    justifyContent:'center'
  },
  rightItemText:{
    textAlign:'right',
    color: '$primaryBlue',
    fontSize: 14,
    fontWeight: 'bold',
  }
});
