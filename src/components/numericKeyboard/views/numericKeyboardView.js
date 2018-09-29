import React, { Fragment, Component } from "react";
import { View } from "react-native";

import { CircularButton } from "../../";

import styles from "./numericKeyboardStyles";

class NumericKeyboard extends Component {
  /* Props
    *
    *   @prop { func }    onPress            - Function will trigger when any button clicked.
    * 
    */
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Component Life Cycles

  // Component Functions

  _handleOnPress = value => {
    alert(value);
  };

  render() {
    const { onPress } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.buttonGroup}>
          <CircularButton
            style={styles.button}
            text={1}
            value={1}
            onPress={value => onPress && onPress(value)}
          />
          <CircularButton
            style={styles.button}
            text={2}
            value={2}
            onPress={value => onPress && onPress(value)}
          />
          <CircularButton
            style={styles.button}
            text={3}
            value={3}
            onPress={value => onPress && onPress(value)}
          />
        </View>
        <View style={styles.buttonGroup}>
          <CircularButton
            style={styles.button}
            text={4}
            value={4}
            onPress={value => onPress && onPress(value)}
          />
          <CircularButton
            style={styles.button}
            text={5}
            value={5}
            onPress={value => onPress && onPress(value)}
          />
          <CircularButton
            style={styles.button}
            text={6}
            value={6}
            onPress={value => onPress && onPress(value)}
          />
        </View>
        <View style={styles.buttonGroup}>
          <CircularButton
            style={styles.button}
            text={7}
            value={7}
            onPress={value => onPress && onPress(value)}
          />
          <CircularButton
            style={styles.button}
            text={8}
            value={8}
            onPress={value => onPress && onPress(value)}
          />
          <CircularButton
            style={styles.button}
            text={9}
            value={9}
            onPress={value => onPress && onPress(value)}
          />
        </View>
        <CircularButton
          style={styles.button}
          text={0}
          value={0}
          onPress={value => onPress && onPress(value)}
        />
      </View>
    );
  }
}

export default NumericKeyboard;
