import React, { Component } from 'react';
import {
  View, KeyboardAvoidingView, ScrollView, FlatList, Text, ActionSheetIOS
} from 'react-native';
import Markdown, { getUniqueID } from 'react-native-markdown-renderer';
// Components
import Formats from './formats/formats';
import { IconButton } from '../../iconButton';
import { DropdownButton } from '../../dropdownButton';
import { StickyBar } from '../../basicUIElements';
import { TextInput } from '../../textInput';
import applyImageLink from './formats/applyWebLinkFormat';
// Styles
import styles from './markdownEditorStyles';
import markdownStyle from './markdownPreviewStyles';

export default class MarkdownEditorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      selection: { start: 0, end: 0 },
    };
  }

  // Lifecycle functions
  componentWillReceiveProps(nextProps) {
    const { draftBody, uploadedImage } = this.props;

    if (nextProps.draftBody && draftBody !== nextProps.draftBody) {
      this.setState({
        text: nextProps.draftBody,
      });
    }

    if (nextProps.uploadedImage && nextProps.uploadedImage !== uploadedImage) {
      applyImageLink({
        getState: this._getState,
        setState: (state, callback) => {
          this.setState(state, callback);
        },
        item: { url: nextProps.uploadedImage.url, text: nextProps.uploadedImage.hash },
        isImage: !!nextProps.uploadedImage,
      });
    }
  }

  // Component functions
  _changeText = (input) => {
    const {
      onChange, handleOnTextChange, handleIsValid, componentID,
    } = this.props;

    this.setState({ text: input });

    if (onChange) {
      onChange(input);
    }

    if (handleIsValid) {
      handleIsValid(componentID, !!(input && input.length));
    }

    if (handleOnTextChange) {
      handleOnTextChange(input);
    }
  };

  _handleOnSelectionChange = (event) => {
    this.setState({
      selection: event.nativeEvent.selection,
    });
  };

  _getState = () => {
    this.setState({
      selection: {
        start: 1,
        end: 1,
      },
    });
    return this.state;
  };

  _renderPreview = () => {
    const { text } = this.state;
    const rules = {
      heading1: (node, children, parent, styles) => (
        <Text key={getUniqueID()} style={styles.heading1}>
          {children}
        </Text>
      ),
      heading2: (node, children, parent, styles) => (
        <Text key={getUniqueID()} style={styles.heading2}>
          {children}
        </Text>
      ),
    };

    return (
      <View style={styles.textWrapper}>
        <ScrollView removeClippedSubviews>
          <Markdown rules={rules} style={markdownStyle}>
            {text === '' ? '...' : text}
          </Markdown>
        </ScrollView>
      </View>
    );
  };

  _renderMarkupButton = ({ item, getState, setState }) => (
    <View style={styles.buttonWrapper}>
      <IconButton
        size={20}
        style={styles.editorButton}
        iconStyle={styles.icon}
        iconType={item.iconType}
        name={item.icon}
        onPress={() => item.onPress({ getState, setState, item })}
      />
    </View>
  );

  _handleOnImageButtonPress = () => {
    const { handleOpenImagePicker } = this.props;

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Take Photo', 'Select From Gallery'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        handleOpenImagePicker(buttonIndex === 1 ? 'camera' : buttonIndex === 2 && 'image');
      },
    );
  }

  _renderEditorButtons = ({ getState, setState }) => {
    return (
      <StickyBar>
        <View style={styles.leftButtonsWrapper}>
          <FlatList
            data={Formats}
            keyboardShouldPersistTaps="always"
            renderItem={({ item, index }) => index !== 9 && this._renderMarkupButton({ item, getState, setState })
            }
            horizontal
          />
        </View>
        <View style={styles.rightButtonsWrapper}>
          <IconButton
            size={20}
            style={styles.rightIcons}
            iconStyle={styles.icon}
            iconType="FontAwesome"
            name="link"
            onPress={() => Formats[9].onPress({ getState, setState })}
          />
          <IconButton
            onPress={() => this._handleOnImageButtonPress()}
            style={styles.rightIcons}
            size={20}
            iconStyle={styles.icon}
            iconType="FontAwesome"
            name="image"
          />
          <DropdownButton
            style={styles.dropdownStyle}
            options={['option1', 'option2', 'option3', 'option4']}
            iconName="md-more"
            iconStyle={styles.dropdownIconStyle}
            isHasChildIcon
          />
        </View>
      </StickyBar>
    );
  };

  render() {
    const { isPreviewActive, intl } = this.props;
    const { text, selection } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {!isPreviewActive ? (
          <TextInput
            multiline
            onChangeText={e => this._changeText(e)}
            onSelectionChange={this._handleOnSelectionChange}
            placeholder={intl.formatMessage({
              id: 'editor.description',
            })}
            placeholderTextColor="#c1c5c7"
            selection={selection}
            selectionColor="#357ce6"
            style={styles.textWrapper}
            underlineColorAndroid="transparent"
            value={text}
            {...this.props}
          />
        ) : (
          this._renderPreview()
        )}
        {!isPreviewActive
          && this._renderEditorButtons({
            getState: this._getState,
            setState: (state, callback) => {
              this.setState(state, callback);
            },
          })}
      </KeyboardAvoidingView>
    );
  }
}
