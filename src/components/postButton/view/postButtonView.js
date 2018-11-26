import React, { Component } from 'react';
import {
  Animated, Easing, TouchableOpacity, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Components
import SubPostButton from './subPostButtonView';

// Constant
import { default as ROUTES } from '../../../constants/routeNames';

// Styles
import styles from './postButtonStyles';

const SIZE = 75;
const durationIn = 300;
const durationOut = 200;

class PostButtonView extends Component {
  mode = new Animated.Value(0);

  icon1 = new Animated.Value(0);

  icon2 = new Animated.Value(0);

  icon3 = new Animated.Value(0);

  componentWillReceiveProps(nextProps) {
    const { routes } = this.props;
    const nextRouteName = nextProps.routes[0].routes[nextProps.routes[0].routes.length - 1].routeName;
    const routeName = routes[0].routes[routes[0].routes.length - 1].routeName;
    // For closing sub buttons
    if (routeName !== nextRouteName && nextRouteName !== 'MainDrawer') {
      this.toggleView();
    }
  }

  toggleView = () => {
    if (this.mode._value) {
      Animated.parallel(
        [this.mode, this.icon1, this.icon2, this.icon3].map(item => Animated.timing(item, {
          toValue: 0,
          duration: durationIn,
          easing: Easing.cubic,
        })),
      ).start();
    } else {
      Animated.parallel([
        Animated.timing(this.mode, {
          toValue: 1,
          duration: durationOut,
          easing: Easing.cubic,
        }),
        Animated.sequence([
          ...[this.icon1, this.icon2, this.icon3].map(item => Animated.timing(item, {
            toValue: 1,
            duration: durationOut,
            easing: Easing.elastic(1),
          })),
        ]),
      ]).start();
    }
  };

  render() {
    const firstX = this.icon1.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -25],
    });
    const firstY = this.icon1.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -60],
    });
    const secondX = this.icon2.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 35],
    });
    const secondY = this.icon2.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -85],
    });
    const thirdX = this.icon3.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 95],
    });
    const thirdY = this.icon3.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -60],
    });

    const rotation = this.mode.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    });

    const { handleSubButtonPress } = this.props;

    return (
      <View style={styles.postButtonWrapper}>
        <SubPostButton
          size={SIZE}
          style={{
            left: firstX,
            top: firstY,
          }}
          icon="camera"
          onPress={() => handleSubButtonPress(ROUTES.SCREENS.EDITOR)}
        />
        <SubPostButton
          size={SIZE}
          style={{
            left: secondX,
            top: secondY,
          }}
          icon="pencil"
          onPress={() => handleSubButtonPress(ROUTES.SCREENS.EDITOR)}
        />
        <SubPostButton
          size={SIZE}
          style={{
            left: thirdX,
            top: thirdY,
          }}
          icon="video-camera"
          onPress={() => handleSubButtonPress(ROUTES.SCREENS.EDITOR)}
        />
        <TouchableOpacity onPress={this.toggleView} activeOpacity={1}>
          <Animated.View
            style={[
              styles.postButton,
              {
                transform: [{ rotate: rotation }],
                width: SIZE,
                height: SIZE,
                borderRadius: SIZE / 2,
              },
            ]}
          >
            <Icon name="plus" size={22} color="#F8F8F8" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default PostButtonView;
