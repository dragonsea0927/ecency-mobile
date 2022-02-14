import { TextStyle, ViewStyle } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  card: {
    marginHorizontal:16,
    marginVertical:8,
    borderRadius:12,
    overflow: 'hidden',
    backgroundColor: '$primaryLightBackground'
  } as ViewStyle,
  basicsContainer:{
    alignItems:'center',
    padding:16
  } as ViewStyle,
  coinTitleContainer:{
    flexDirection:'row',
    marginTop:16
  } as ViewStyle,
  textCoinTitle:{
      color: '$black',
    fontSize: 34,
    fontWeight:'600',
  } as TextStyle,
  textHeaderChange:{
    color: '$primaryDarkText',
    fontSize: 16,
    marginBottom:32,
  } as TextStyle,
 
  textPositive:{
    color: '$primaryGreen'
  } as TextStyle,
  textNegative:{

  } as TextStyle,
  textBasicValue:{
    color: '$black',
    fontWeight:'600',
    fontSize: 34,

  } as TextStyle,
  textBasicLabel:{
    color: '$primaryDarkText',
    fontSize: 14,
    marginBottom:16,
  } as TextStyle,

  rangeContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    borderRadius:32,
  } as ViewStyle,
  rangeOptionWrapper:{
    borderRadius:32,
    paddingVertical:16,
    paddingHorizontal:24
  } as ViewStyle,
  textRange:{
    fontSize:18,
  } as TextStyle,
  chartContainer:{
    height: 168,
    marginTop: 16,
    marginLeft:-66,
    overflow: 'hidden',
  } as ViewStyle
});
