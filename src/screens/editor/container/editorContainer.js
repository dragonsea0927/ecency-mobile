import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import CryptoJS from 'crypto-js';
// Services and Actions
import * as dsteem from 'dsteem';
import { Buffer } from 'buffer';
import { uploadImage } from '../../../providers/esteem/esteem';
import { postContent } from '../../../providers/steem/dsteem';
import { setDraftPost, getDraftPost } from '../../../realm/realm';
import { getDigitPinCode } from '../../../providers/steem/auth';

// Middleware

// Constants
import { default as ROUTES } from '../../../constants/routeNames';

// Utilities
import { generatePermlink } from '../../../utils/editor';
import { decryptKey } from '../../../utils/crypto';
import { generateSignature } from '../../../utils/image';
// Component
import EditorScreen from '../screen/editorScreen';

/*
  *            Props Name        Description                                     Value
  *@props -->  props name here   description here                                Value Type Here
  *
  */

class ExampleContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPostSending: false,
      isDraftSaving: false,
      isDraftSaved: false,
      draftPost: null,
      isCameraOrPickerOpen: false,
      autoFocusText: false,
    };
  }

  // Component Life Cycle Functions

  // Component Functions
  componentWillMount() {
    const { currentAccount, navigation } = this.props;
    const username = currentAccount && currentAccount.name ? currentAccount.name : '';
    const routingAction = navigation.state && navigation.state.params;

    // Routing action state ex if coming for video or image or only text
    if (routingAction && routingAction.action) {
      this._handleRoutingAction(routingAction.action);
    } else {
      this.setState({ autoFocusText: true });
    }

    getDraftPost(username)
      .then((result) => {
        this.setState({
          draftPost: { body: result.body, title: result.title, tags: result.tags.split(',') },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  _handleRoutingAction = (routingAction) => {
    this.setState({ isCameraOrPickerOpen: true });

    if (routingAction === 'camera') {
      this._handleOpenCamera();
    } else if (routingAction === 'image') {
      this._handleOpenImagePicker();
    }
  };

  // Media select functions <- START ->

  _handleOpenImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      // multiple: true,
      writeTempFile: true,
      includeBase64: true,
    })
      .then((image) => {
        this._handleMediaOnSelected(image);
      })
      .catch((e) => {
        this._handleMediaOnSelectFailure(e);
      });
  };

  _handleOpenCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        this._handleMediaOnSelected(image);
      })
      .catch((e) => {
        this._handleMediaOnSelectFailure(e);
      });
  };

  // TODO: keyboard opening bug fixed
  _handleMediaOnSelected = async (media) => {
    this.setState({ isCameraOrPickerOpen: false });

    const { currentAccount } = this.props;
    const digitPinCode = await getDigitPinCode();
    const privateKey = decryptKey(currentAccount.realm_object.postingKey, digitPinCode);

    // const prefix = new Buffer('ImageSigningChallenge');
    // const data = new Buffer(media.data, 'base64');
    // const commaIdx = media.data.indexOf(',');
    // const dataBs64 = media.data.substring(commaIdx + 1);
    // const sdata = new Buffer(dataBs64, 'base64');

    // const hash = CryptoJS.SHA256(prefix, sdata);
    // const buffer = Buffer.from(hash.toString(CryptoJS.enc.Hex), 'hex');
    // const array = new Uint8Array(buffer);

    // const key = dsteem.PrivateKey.fromString(privateKey);
    // const sign = key.sign(new Buffer(array)).toString();

    const data = new Buffer(media.data, 'base64');

    const payload = {
      username: currentAccount.name,
      image_file: {
        filename: media.filename,
        buffer: data,
        content_type: 'image/jpeg',
      },
    };
    
    // const formData = new FormData();
    // formData.append('file', media);
    // formData.append('filename', media.filename);
    // formData.append('filebase64', media.data);

    const sign = generateSignature(media, privateKey);

    this._uploadImage(currentAccount.name, sign, payload);
  };

  _uploadImage = (username, sign, formData) => {
    uploadImage(username, sign, formData).then((res) => {
      console.log(res);
    });
  };

  _handleMediaOnSelectFailure = (error) => {
    const { navigation } = this.props;
    this.setState({ isCameraOrPickerOpen: false });
    navigation.navigate(ROUTES.SCREENS.HOME);
  };

  // Media select functions <- END ->

  _handleOnSaveButtonPress = (fields) => {
    const { isDraftSaved } = this.state;
    if (!isDraftSaved) {
      const { currentAccount } = this.props;
      const username = currentAccount && currentAccount.name ? currentAccount.name : '';

      this.setState({ isDraftSaving: true });
      const draftField = {
        ...fields,
        tags: fields.tags.toString(),
      };

      setDraftPost(draftField, username)
        .then(() => {
          this.setState({
            isDraftSaving: false,
            isDraftSaved: true,
          });
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  _submitPost = async (fields) => {
    this.setState({ isPostSending: true });

    const { navigation, currentAccount } = this.props;
    const permlink = generatePermlink(fields.title);
    const digitPinCode = await getDigitPinCode();

    const postingKey = decryptKey(currentAccount.realm_object.postingKey, digitPinCode);

    if (currentAccount) {
      const post = {
        ...fields,
        permlink,
        author: currentAccount.name,
      };

      postContent(post, postingKey)
        .then((result) => {
          alert('Your post succesfully shared');
          navigation.navigate(ROUTES.SCREENS.HOME);
        })
        .catch((error) => {
          alert(`Opps! there is a problem${error}`);
          this.setState({ isPostSending: false });
        });
    }
  };

  _handleSubmit = (form) => {
    this._submitPost(form);
  };

  _handleFormChanged = () => {
    const { isDraftSaved } = this.state;

    if (isDraftSaved) {
      this.setState({ isDraftSaved: false });
    }
  };

  render() {
    const { isLoggedIn, isDarkTheme } = this.props;
    const {
      draftPost,
      isDraftSaved,
      isDraftSaving,
      isOpenCamera,
      isCameraOrPickerOpen,
      autoFocusText,
    } = this.state;

    return (
      <EditorScreen
        draftPost={draftPost}
        handleFormChanged={this._handleFormChanged}
        handleOnSaveButtonPress={this._handleOnSaveButtonPress}
        handleOnSubmit={this._handleSubmit}
        handleOnImagePicker={this._handleOpenImagePicker}
        isDarkTheme={isDarkTheme}
        isDraftSaved={isDraftSaved}
        isDraftSaving={isDraftSaving}
        isLoggedIn={isLoggedIn}
        isOpenCamera={isOpenCamera}
        isCameraOrPickerOpen={isCameraOrPickerOpen}
        autoFocusText={autoFocusText}
      />
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.application.isLoggedIn,

  currentAccount: state.account.currentAccount,
});

export default connect(mapStateToProps)(ExampleContainer);
