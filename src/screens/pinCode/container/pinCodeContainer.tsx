import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Config from 'react-native-config';
import get from 'lodash/get';
import FingerprintScanner from 'react-native-fingerprint-scanner';


// Actions & Services
import { navigate } from '../../../navigation/service';
import {
  updatePinCode,
} from '../../../providers/hive/auth';
import {
  closePinCodeModal,
  isPinCodeOpen,
  login,
  logout,
  logoutDone,
  setEncryptedUnlockPin,
} from '../../../redux/actions/applicationActions';
import {
  getExistUser,
  setExistUser,
  removeAllUserData,
  removePinCode,
  setAuthStatus,
} from '../../../realm/realm';
import { updateCurrentAccount, removeOtherAccount } from '../../../redux/actions/accountAction';

// Utils
import { encryptKey, decryptKey } from '../../../utils/crypto';
import MigrationHelpers from '../../../utils/migrationHelpers';

// Component
import PinCodeScreen from '../screen/pinCodeScreen';


class PinCodeContainer extends Component {
  screenRef = null;

  constructor(props) {
    super(props);
    this.state = {
      isExistUser: null,
      informationText: '',
      newPinCode: null,
      isOldPinVerified: get(props.pinCodeParams, 'isOldPinVerified', false),
      oldPinCode: get(props.pinCodeParams, 'oldPinCode', null),
      failedAttempts: 0,
    };
  }


  //sets initial pin code screen label based on oldPinVerified param/state
  componentDidMount() {

    // this.props.dispatch(setEncryptedUnlockPin(undefined))

    const { intl } = this.props;
    const { isOldPinVerified } = this.state;

    if (!isOldPinVerified) {
      this.setState({
        informationText: intl.formatMessage({
          id: 'pincode.enter_text',
        }),
      });
    } else {
      this.setState({
        informationText: intl.formatMessage({
          id: 'pincode.set_new',
        }),
      });
    }

  }

  _processBiometric = async () => {
    try {
      const {
        intl,
        pinCodeParams: { isReset },
        applicationPinCode,
        isBiometricEnabled,
      } = this.props;

      if (isReset || !isBiometricEnabled) {
        return;
      }

      const biometryType = await FingerprintScanner.isSensorAvailable();
      console.log('biometryType is => ', biometryType);

      await FingerprintScanner.authenticate({
        description: intl.formatMessage({ id: 'pincode.biometric_desc' }),
      });
      console.log('successfully passed biometric auth');

      //code gets here means biometeric succeeded
      if (this.screenRef) {
        const verifiedPin = decryptKey(applicationPinCode, Config.PIN_KEY, this._onDecryptFail);
        this.screenRef.setPinThroughBiometric(verifiedPin);
      }
    } catch (err) {
      console.warn('Failed to process biometric', err);
    }

    FingerprintScanner.release();
  };

  //this function updates realm with appropriate master key required for encyrption
  //this function is important: must run while chaning pin
  //and even logging in with existing pin code

  _updatePinCodeRealm = async (pinData) => {
    try {
      const { currentAccount, dispatch } = this.props;
      const response = await updatePinCode(pinData);
      if (!response) {
        return false;
      }
      const _currentAccount = currentAccount;
      _currentAccount.local = response;
      dispatch(updateCurrentAccount({ ..._currentAccount }));
      return true;
    } catch (err) {
      this._onDecryptFail();
      return false;
    }
  };


  //routine for checking and setting new pin code, same routine is used for
  //setting pin for the first time
  _resetPinCode = (pin) =>
    new Promise((resolve, reject) => {
      const {
        currentAccount,
        dispatch,
        pinCodeParams: { navigateTo, navigateParams, accessToken, callback },
        encUnlockPin,
        intl,
      } = this.props;
      const { isOldPinVerified, oldPinCode, newPinCode } = this.state;

      const pinData = {
        pinCode: pin,
        password: currentAccount ? currentAccount.password : '',
        username: currentAccount ? currentAccount.name : '',
        accessToken,
        oldPinCode,
      };

      //if old pin already verified, check new pin setup conditions.
      if (isOldPinVerified) {
        //if newPin already exist and pin is a valid pin, compare and set new pin
        if (pin !== undefined && pin === newPinCode) {

          this._savePinCode(pin);
          if (callback) {
            callback(pin, oldPinCode);
          }
          dispatch(closePinCodeModal());

          if (navigateTo) {
            navigate({
              routeName: navigateTo,
              params: navigateParams,
            });
          }
          resolve();
        }

        // if newPin code exists and above case failed, that means pins did not match
        // warn user about it and do nothing
        else if (newPinCode) {
          Alert.alert(
            intl.formatMessage({
              id: 'alert.warning',
            }),
            intl.formatMessage({
              id: 'pincode.pin_not_matched',
            }),
          );
          resolve();
        }

        //if newPinCode do yet exist, save it in state and prompt user to reneter pin.
        else {
          this.setState({
            informationText: intl.formatMessage({
              id: 'pincode.write_again',
            }),
            newPinCode: pin,
          });
          resolve();
        }
      }

      // if old pin code is not yet verified attempt to verify code
      else {

        let unlockPin = decryptKey(encUnlockPin, Config.PIN_KEY)

        //check if pins match
        if (unlockPin !== pin) {
          const err = new Error('alert.invalid_pincode');
          reject(err);
          return;
        }


        this.setState({ isOldPinVerified: true });
        this.setState({
          informationText: intl.formatMessage({
            id: 'pincode.set_new',
          }),
          newPinCode: null,
          oldPinCode: pin,
        });
        resolve();

      }
    });



  _onRefreshTokenFailed = (error) => {
    setTimeout(() => {
      const { dispatch, intl } = this.props;
      const _logout = () => dispatch(logout());
      Alert.alert(
        intl.formatMessage({
          id: 'alert.fail',
        }),
        error.message,
        [
          { text: intl.formatMessage({ id: 'side_menu.logout' }), onPress: _logout },
          { text: intl.formatMessage({ id: 'alert.cancel' }), style: 'destructive' },
        ],
      );
    }, 300);
  };



  //verifies is the pin entered is right or wrong, also migrates to newer locking method
  _verifyPinCode = async (pin) => {
    try {
      const {
        intl,
        currentAccount,
        dispatch,
        encUnlockPin,
        applicationPinCode,
        pinCodeParams: { navigateTo, navigateParams, callback },
      } = this.props;
      const { oldPinCode } = this.state;

      let unlockPin = encUnlockPin ?
        decryptKey(encUnlockPin, Config.PIN_KEY) : decryptKey(applicationPinCode, Config.PIN_KEY);


      //check if pins match
      if (unlockPin !== pin) {
        throw new Error(intl.formatMessage({
          id: 'alert.invalid_pincode',
        }));
      }

      //migrate data to default pin if encUnlockPin is not set.
      if (!encUnlockPin) {
        await MigrationHelpers.migrateUserEncryption(dispatch, currentAccount, applicationPinCode, this._onRefreshTokenFailed);
      }


      //on successful code verification run requested operation passed as props
      if (callback) {
        callback(pin, oldPinCode);
      }

      if (navigateTo) {
        navigate({
          routeName: navigateTo,
          params: navigateParams,
        });
      }

      dispatch(closePinCodeModal());

      return true;
    } catch (err) {
      throw err
    }
  }


  //encryptes and saved unlockPin
  _savePinCode = (pin) => {
    const { dispatch } = this.props;
    const encryptedPin = encryptKey(pin, Config.PIN_KEY);
    dispatch(setEncryptedUnlockPin(encryptedPin));
  };



  _forgotPinCode = async () => {
    const { otherAccounts, dispatch } = this.props;

    await removeAllUserData()
      .then(async () => {
        dispatch(updateCurrentAccount({}));
        dispatch(login(false));
        removePinCode();
        setAuthStatus({ isLoggedIn: false });
        setExistUser(false);
        if (otherAccounts.length > 0) {
          otherAccounts.map((item) => dispatch(removeOtherAccount(item.username)));
        }
        dispatch(logoutDone());
        dispatch(closePinCodeModal());
        dispatch(isPinCodeOpen(false));
      })
      .catch((err) => {
        console.warn('Failed to remove user data', err);
      });
  };

  _handleFailedAttempt = (error) => {
    console.warn('Failed to set pin: ', error);
    const { intl } = this.props;
    const { failedAttempts } = this.state;
    //increment failed attempt
    const totalAttempts = failedAttempts + 1;

    if (totalAttempts < 3) {
      //shwo failure alert box
      Alert.alert(
        intl.formatMessage({
          id: 'alert.warning',
        }),
        intl.formatMessage({
          id: error.message,
        }),
      );

      let infoMessage = intl.formatMessage({
        id: 'pincode.enter_text',
      });
      infoMessage += `, ${totalAttempts} ${intl.formatMessage({ id: 'pincode.attempts_postfix' })}`;
      if (totalAttempts > 1) {
        infoMessage += `\n${intl.formatMessage({ id: 'pincode.message_reset_warning' })}`;
      }
      this.setState({
        failedAttempts: totalAttempts,
        informationText: infoMessage,
      });

      return false;
    } else {
      //wipe user data
      this._forgotPinCode();
      return true;
    }
  };

  _onDecryptFail = () => {
    const { intl } = this.props;
    Alert.alert(
      intl.formatMessage({
        id: 'alert.warning',
      }),
      intl.formatMessage({
        id: 'alert.decrypt_fail_alert',
      }),
      [
        { text: intl.formatMessage({ id: 'alert.clear' }), onPress: () => this._forgotPinCode() },
        { text: intl.formatMessage({ id: 'alert.cancel' }), style: 'destructive' },
      ],
    );
  };

  _setPinCode = async (pin, isReset) => {
    try {
      // check if reset routine is triggered by user, reroute code to reset hanlder
      if (isReset) {
        await this._resetPinCode(pin);
      } else {
        await this._verifyPinCode(pin);
      }

      return true

    } catch (error) {
      return this._handleFailedAttempt(error);
    }
  };

  _handleForgotButton = () => {
    const { intl } = this.props;

    Alert.alert(
      intl.formatMessage({
        id: 'alert.warning',
      }),
      intl.formatMessage({
        id: 'alert.clear_user_alert',
      }),
      [
        { text: intl.formatMessage({ id: 'alert.clear' }), onPress: () => this._forgotPinCode() },
        { text: intl.formatMessage({ id: 'alert.cancel' }), style: 'destructive' },
      ],
    );
  };

  render() {
    const {
      currentAccount,
      intl,
      pinCodeParams: { isReset },
    } = this.props;
    const { informationText, isOldPinVerified } = this.state;

    return (
      <PinCodeScreen
        ref={(ref) => (this.screenRef = ref)}
        informationText={informationText}
        setPinCode={(pin) => this._setPinCode(pin, isReset)}
        showForgotButton={!isOldPinVerified}
        username={currentAccount.name}
        intl={intl}
        handleForgotButton={() => this._handleForgotButton()}
        isReset={isReset}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  currentAccount: state.account.currentAccount,
  applicationPinCode: state.application.pin,
  encUnlockPin: state.application.encUnlockPin,
  otherAccounts: state.account.otherAccounts,
  pinCodeParams: state.application.pinCodeNavigation,
  isBiometricEnabled: state.application.isBiometricEnabled,
});

export default injectIntl(connect(mapStateToProps)(PinCodeContainer));
