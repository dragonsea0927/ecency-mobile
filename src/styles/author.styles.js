import { createStyle } from 'react-native-theming';
import { StatusBar, Dimensions } from 'react-native';

const styles = createStyle({
    container: {
        top: StatusBar.currentHeight,
    },
    view: {
        flex: 1,
    },
    content: {
        flex: 1,
        backgroundColor: '@backgroundColor',
    },
    header: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: StatusBar.currentHeight,
    },
    coverImage: {
        width: Dimensions.get('window').width,
        height: 160,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        top: -50,
        borderWidth: 1,
        borderColor: 'white',
        alignSelf: 'center',
    },
    accountNameBody: {
        top: -40,
    },
    accountNameText: {
        fontWeight: '@FONT_WEIGHT_HEAVY',
    },
});
