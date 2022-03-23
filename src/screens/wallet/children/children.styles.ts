import { TextStyle, ViewStyle } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ImageStyle } from 'react-native-fast-image';

export default EStyleSheet.create({
  cardContainer: {
    backgroundColor:'$primaryLightBackground',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: "$primaryLightBackground"
  } as ViewStyle,

  cardHeader:{
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal: 16,
    paddingTop:16,
  } as ViewStyle,

  cardTitleContainer:{
    marginHorizontal: 8,
    flex:1,
  } as ViewStyle,

  cardValuesContainer:{
    marginHorizontal: 8,
    
    justifyContent:'flex-end'
  } as ViewStyle,

  claimContainer:{
    flexDirection:'row', 
    justifyContent:'center', 
    alignItems:'center', 
    marginTop:8
  } as ViewStyle,

  claimBtn:{
      flexDirection: 'row',
      paddingHorizontal: 16
  } as ViewStyle,

  claimBtnTitle:{
    color: '$pureWhite',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
  } as ViewStyle,

  claimIconWrapper: {
    backgroundColor: '$pureWhite',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 20,
    width: 24,
    height: 24,
  } as ViewStyle,

  logo:{
    height:24, 
    width:24, 
    borderRadius:12, 
    backgroundColor:'$primaryBlue',
  } as ImageStyle,

  menuIcon:{
    color: '$primaryBlue',
    paddingLeft:12,
  } as ViewStyle,

  header: {
    backgroundColor: '$primaryBackgroundColor',
  },
  dotStyle: {
    backgroundColor: '$primaryDarkText',
  },
  chartContainer:{
    height:112
  },
  cardFooter:{
    position:'absolute', 
    bottom:8, 
    left:76, 
    right:16, 
    paddingTop:8,
    flexDirection:'row', 
    justifyContent:'space-between',
    borderColor:'$chartText',
    borderTopWidth:EStyleSheet.hairlineWidth,
  } as ViewStyle,
  textDiffPositive:{
    fontSize:18,
    color: '$primaryGreen'
  } as TextStyle,
  textDiffNegative:{
    fontSize:16,
    color: '$primaryRed'
  } as TextStyle,
  textCurValue:{
    fontSize:16,
    color: '$primaryBlack',
    fontWeight: '300',
  } as TextStyle,
  textTitle:{
    fontSize:16,
    color: '$primaryBlack',
    fontWeight: '500'
  },
  textSubtitle:{
    fontSize:14,
    color: '$primaryDarkText',
    fontWeight: '300',
  } as TextStyle,
  textSubtitleRight:{
    fontSize:14,
    color: '$primaryDarkText',
    fontWeight: '300',
    textAlign:'right'
  } as TextStyle
});