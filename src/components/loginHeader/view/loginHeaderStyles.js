import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '$deviceHeight / 3',
  },
  body: {
    flexDirection: 'row',
    maxHeight: '$deviceHeight / 3',
    overflow: 'hidden',
    backgroundColor: '$primaryBackgroundColor',
    height: '$deviceHeight / 2.9',
  },
  description: {
    textAlignVertical: 'center',
    color: '$primaryDarkGray',
    fontSize: 14,
    fontWeight: '400',
  },
  title: {
    textAlignVertical: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '$primaryDarkGray',
    marginBottom: 16,
  },
  mascot: {
    position: 'absolute',
    width: 217,
    height: 300,
    marginLeft: 50,
    marginTop: 40,
    right: -20,
  },
  titleText: {
    alignSelf: 'center',
    marginTop: 50,
    marginLeft: 32,
    width: '$deviceWidth / 3',
  },
  headerRow: {
    width: '$deviceWidth',
    flexDirection: 'row',
    height: 55,
    justifyContent: 'space-between',
    backgroundColor: '$primaryBackgroundColor',
  },
  logo: {
    width: 32,
    height: 32,
    marginLeft: 32,
    alignSelf: 'center',
  },
  headerButton: {
    margin: 10,
    marginRight: 19,
    alignSelf: 'center',
  },
});
