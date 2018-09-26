import React, { Component } from "react";
import { View, Text, Image, TextInput } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FastImage from "react-native-fast-image";

// Constants

// Components

// Styles
import styles from "./formInputStyles";

class FormInputView extends Component {
  /* Props
    * ------------------------------------------------
    *   @prop { string }    placeholder            - Title for header string.
    *   @prop { string }    type      - Description for header string.
    *   @prop { string }    isFirstImage      - Description for header string.
    *   @prop { string }    isEditable      - Description for header string.
    *   @prop { string }    isValid      - Description for header string.
    *
    * 
    */
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      inputBorderColor: "#c1c5c7",
    };
  }

  // Component Life Cycles

  // Component Functions
  _handleOnChange = value => {
    const { onChange } = this.props;

    value && this.setState({ value });
    onChange && value && onChange(value);
  };

  render() {
    const { inputBorderColor, value } = this.state;
    const {
      placeholder,
      type,
      isFirstImage,
      isEditable,
      isValid,
      leftIconName,
      rightIconName,
      secureTextEntry,
    } = this.props;

    return (
      <View
        style={[
          styles.wrapper,
          {
            borderBottomColor: isValid ? inputBorderColor : "red",
          },
        ]}
      >
        {isFirstImage && value && value.length > 2 ? (
          <View style={{ flex: 0.15 }}>
            <FastImage
              style={styles.firstImage}
              source={{
                uri: `https://steemitimages.com/u/${value}/avatar/small`,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        ) : (
          <Ionicons name={rightIconName} style={styles.icon} />
        )}
        <TextInput
          onFocus={() =>
            this.setState({
              inputBorderColor: "#357ce6",
            })
          }
          onSubmitEditing={() =>
            this.setState({
              inputBorderColor: "#c1c5c7",
            })
          }
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          editable={isEditable || true}
          textContentType={type}
          onChangeText={value => {
            this._handleOnChange(value);
          }}
          value={value}
          style={styles.textInput}
        />
        {value && value.length > 0 ? (
          <Ionicons
            onPress={() => this.setState({ value: "" })}
            name={leftIconName}
            style={styles.icon}
          />
        ) : null}
      </View>
    );
  }
}

export default FormInputView;
