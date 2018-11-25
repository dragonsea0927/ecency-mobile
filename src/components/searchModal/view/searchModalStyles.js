import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  inputWrapper: {
    backgroundColor: '$primaryLightBackground',
    flexDirection: 'row',
    height: 44,
    margin: 16,
    borderRadius: 8,
    padding: 5,
    justifyContent: 'center',
  },
  icon: {
    alignSelf: 'center',
    color: '$primaryDarkGray',
    marginLeft: 16,
  },
  input: {
    color: '$primaryDarkGray',
    fontSize: 14,
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  closeIconButton: {
    backgroundColor: '$iconColor',
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 16,
  },
  closeIcon: {
    color: '$white',
    fontSize: 16,
  },
});
