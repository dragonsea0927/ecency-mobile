import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$primaryBackgroundColor',
  },
  stepOneContainer: {
    zIndex: 2,
    borderWidth: 1,
    borderColor: '$borderColor',
    paddingVertical: 16,
  },
  stepTwoContainer: {
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '$borderColor',
    marginTop: 16,
  },
  stepThreeContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginVertical: 16,
  },
  toFromAvatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  middleContent: {
    flex: 3,
    justifyContent: 'center',
  },
  bottomContent: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '$borderColor',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '$primaryBlack',
    width: 172,
    minHeight: 35,
  },
  error: {
    borderWidth: 1,
    borderColor: 'red',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '$borderColor',
    borderRadius: 8,
    padding: 10,
    color: '$primaryBlack',
    width: 172,
    height: 75,
  },
  description: {
    color: '$iconColor',
  },
  button: {
    width: '$deviceWidth / 3',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  stopButton: {
    width: '$deviceWidth / 3',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
  },
  icon: {
    fontSize: 40,
    color: '$iconColor',
    marginHorizontal: 20,
  },
  rowTextStyle: {
    fontSize: 12,
    color: '$primaryDarkGray',
    padding: 5,
  },
  dropdownText: {
    fontSize: 14,
    paddingLeft: 16,
    paddingHorizontal: 14,
    color: '$primaryDarkGray',
  },
  dropdownStyle: {
    marginTop: 15,
    minWidth: 192,
    width: 192,
    maxHeight: '$deviceHeight - 200',
  },
  dropdownButtonStyle: {
    borderColor: '$borderColor',
    borderWidth: 1,
    height: 44,
    width: 172,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  dropdown: {
    flexGrow: 1,
    width: 150,
  },

  formButton: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: '$primaryBlue',
    marginTop: 5,
  },
  formButtonText: {
    color: '$white',
    fontSize: 14,
  },
  informationText: {
    alignSelf: 'center',
    color: '$iconColor',
    margin: 10,
  },
  spInformation: {
    backgroundColor: 'red',
    width: '$deviceWidth / 3',
    borderRadius: 5,
    margin: 5,
  },
  vestsInformation: {
    backgroundColor: 'gray',
    width: '$deviceWidth / 3',
    borderRadius: 5,
    margin: 5,
  },
  steemInformation: {
    backgroundColor: 'green',
    width: '$deviceWidth / 3',
    borderRadius: 5,
    margin: 5,
  },
  avatar: {
    marginBottom: 30,
  },
  destinationAccountsLists: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  iconButton: {
    borderColor: 'red',
    borderWidth: 1,
    width: 25,
    height: 25,
    borderRadius: 5,
  },
  crossIcon: {
    color: 'red',
  },
  informationView: {
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '$primaryBackgroundColor',
  },
  checkView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
  incomingFundSteem: {
    color: 'green',
    fontSize: 20,
    marginVertical: 5,
  },
  incomingFundVests: {
    color: 'red',
    fontSize: 15,
    marginVertical: 5,
  },
  nextPowerDown: {
    marginVertical: 5,
  },
  transferToContainer: {
    flex: 1,
    width: 172,
    position: 'relative',
  },
  usersDropdownContainer: {
    position: 'absolute',
    top: 40,
    width: 172,
    maxHeight: 250,
  },
  usersDropdown: {
    borderColor: '$primaryWhiteLightBackground',
    borderRadius: 5,
    shadowOpacity: 0.3,
    shadowColor: '$shadowColor',
    backgroundColor: '$primaryLightBackground',
  },
  usersDropItemRow: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  usersDropItemRowText: {
    color: '$primaryDarkGray',
    textAlign: 'left',
    marginLeft: 5,
  },
  paddBottom: {
    paddingBottom: 12,
  },
  fillSpace: {
    flex: 1,
    padding: 16,
  },
  elevate: {
    zIndex: 1,
  },
  sectionHeading: {
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '$primaryBlack',
    fontWeight: '600',
    textAlign: 'left',
  },
  sectionSubheading: {
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 12,
    color: '$primaryBlack',
    fontWeight: '600',
    textAlign: 'left',
  },
  alreadyDelegateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyBox: {
    flex: 1,
  },
  sliderContainer: {
    flex: 2,
  },
  track: {
    height: 2,
    borderRadius: 1,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 16 / 2,
    backgroundColor: '$primaryLightBackground',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.35,
    elevation: 3,
  },
  slider: {
    marginRight: 16,
    marginLeft: 8,
  },
  sliderAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  amountText: {
    fontSize: 12,
    color: '$primaryBlack',
    fontWeight: '600',
    textAlign: 'left',
  },
});
