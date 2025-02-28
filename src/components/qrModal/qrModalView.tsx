import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, PermissionsAndroid, Platform, View, Text } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useIntl } from 'react-intl';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { get } from 'lodash';
import * as hiveuri from 'hive-uri';
import { useCameraDevice, Camera, useCodeScanner } from 'react-native-vision-camera';
import styles from './qrModalStyles';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  handleDeepLink,
  showActionModal,
  showWebViewModal,
  toastNotification,
  toggleQRModal,
} from '../../redux/actions/uiAction';
import { deepLinkParser } from '../../utils/deepLinkParser';
import RootNavigation from '../../navigation/rootNavigation';
import getWindowDimensions from '../../utils/getWindowDimensions';
import { isHiveUri, getFormattedTx } from '../../utils/hive-uri';
import { handleHiveUriOperation, resolveTransaction } from '../../providers/hive/dhive';
import bugsnagInstance from '../../config/bugsnag';
import showLoginAlert from '../../utils/showLoginAlert';
import authType from '../../constants/authType';
import { delay } from '../../utils/editor';
import ROUTES from '../../constants/routeNames';

const screenHeight = getWindowDimensions().height;

export const QRModal = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const isVisibleQRModal = useAppSelector((state) => state.ui.isVisibleQRModal);
  const currentAccount = useAppSelector((state) => state.account.currentAccount);
  const pinCode = useAppSelector((state) => state.application.pin);
  const isPinCodeOpen = useAppSelector((state) => state.application.isPinCodeOpen);
  const isLoggedIn = useAppSelector((state) => state.application.isLoggedIn);
  const device = useCameraDevice('back');

  const [isScannerActive, setIsScannerActive] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const sheetModalRef = useRef<ActionSheet>();

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`, codes);
      handleLink({ data: codes[0].value });
    },
  });

  // TODO: make sure to properly clean uri processing code to process uri from deep links and notifications
  const deepLinkToHandle = useAppSelector((state) => state.ui.deepLinkToHandle);
  useEffect(() => {
    if (deepLinkToHandle) {
      handleLink({ data: deepLinkToHandle });
    }
  }, [deepLinkToHandle]);

  useEffect(() => {
    if (isVisibleQRModal) {
      requestCameraPermission();
      setIsScannerActive(true);
      sheetModalRef?.current?.show();
    } else {
      sheetModalRef?.current?.hide();
    }
  }, [isVisibleQRModal]);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      const permissionStatus = await check(PERMISSIONS.IOS.CAMERA);
      if (permissionStatus !== RESULTS.GRANTED) {
        request(PERMISSIONS.IOS.CAMERA).then((result) => {
          if (result === RESULTS.GRANTED) {
            console.log('Camera permission granted');
          } else {
            console.log('Camera permission blocked');
            Alert.alert(
              'Unable to get Camera permission',
              'Please grant camera permission in ecency settings.',
              [
                {
                  text: 'Close',
                  onPress: () => {
                    _onClose();
                  },
                  style: 'cancel',
                },
                {
                  text: 'Allow',
                  onPress: () => {
                    openSettings();
                  },
                },
              ],
            );
          }
        });
      }
    }
    if (Platform.OS === 'android') {
      try {
        const permissionStatus = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (!permissionStatus) {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
            title: 'Ecency Camera Permission',
            message: 'To scan QR, Ecency needs your permission.',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          });
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Camera permission granted');
          } else {
            console.log('Camera permission denied');
          }
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const _onClose = () => {
    dispatch(toggleQRModal(false));
  };

  const handleLink = (e) => {
    setIsScannerActive(false);
    if (isHiveUri(e.data)) {
      _handleHiveUri(e.data);
    } else {
      _handleDeepLink(e.data);
    }
  };

  const _handleHiveUri = async (uri: string) => {
    try {
      setIsScannerActive(false);
      _onClose();
      if (!isLoggedIn) {
        showLoginAlert({ intl });
        return;
      }
      if (isPinCodeOpen) {
        RootNavigation.navigate({
          name: ROUTES.SCREENS.PINCODE,
          params: {
            callback: () => _handleHiveUriTransaction(uri),
          },
        });
      } else {
        _handleHiveUriTransaction(uri);
      }
    } catch (err) {
      _showInvalidAlert();
    }
  };

  const _handleHiveUriTransaction = async (uri: string) => {
    if (get(currentAccount, 'local.authType') === authType.STEEM_CONNECT) {
      await delay(500); // NOTE: it's required to avoid modal mis fire
      dispatch(
        showWebViewModal({
          uri,
        }),
      );
      return;
    }

    const parsed = hiveuri.decode(uri);
    const authoritiesMap = new Map();
    authoritiesMap.set('active', !!currentAccount?.local?.activeKey);
    authoritiesMap.set('posting', !!currentAccount?.local?.postingKey);
    authoritiesMap.set('owner', !!currentAccount?.local?.ownerKey);
    authoritiesMap.set('memo', !!currentAccount?.local?.memoKey);

    getFormattedTx(parsed.tx, authoritiesMap)
      .then(async (formattedTx) => {
        // resolve the decoded tx and params to a signable tx
        const tx = await resolveTransaction(formattedTx.tx, parsed.params, currentAccount.name);
        const ops = get(tx, 'operations', []);
        const op = ops[0];

        dispatch(
          showActionModal({
            title: intl.formatMessage({
              id: 'qr.confirmTransaction',
            }),
            bodyContent: _renderActionModalBody(op, formattedTx.opName),
            buttons: [
              {
                text: intl.formatMessage({
                  id: 'qr.cancel',
                }),
                onPress: () => {
                  console.log('cancel pressed');
                },
                style: 'cancel',
              },
              {
                text: intl.formatMessage({
                  id: 'qr.approve',
                }),
                onPress: () => {
                  handleHiveUriOperation(currentAccount, pinCode, tx)
                    .then(() => {
                      dispatch(toastNotification(intl.formatMessage({ id: 'alert.successful' })));
                    })
                    .catch((err) => {
                      bugsnagInstance.notify(err);
                      if (err) {
                        dispatch(toastNotification(intl.formatMessage({ id: err })));
                      } else {
                        dispatch(
                          toastNotification(intl.formatMessage({ id: 'qr.transaction_failed' })),
                        );
                      }
                    });
                },
              },
            ],
            onClosed: () => dispatch(handleDeepLink('')),
          }),
        );
      })
      .catch((errObj) => {
        Alert.alert(
          intl.formatMessage({ id: errObj.errorKey1 }, { key: errObj.authorityKeyType }),
          intl.formatMessage(
            {
              id: errObj.errorKey2,
            },
            { key: errObj.authorityKeyType },
          ),
        );
      });
  };

  const _handleDeepLink = async (url) => {
    setIsProcessing(true);
    const deepLinkData = await deepLinkParser(url);
    const { name, params, key } = deepLinkData || {};
    setIsProcessing(false);
    if (name && params && key) {
      setIsScannerActive(false);
      _onClose();
      RootNavigation.navigate(deepLinkData);
    } else {
      _showInvalidAlert();
    }
  };

  const _renderTransactionInfoRow = (item: any) => (
    <View style={styles.transactionRow}>
      <Text numberOfLines={1} style={styles.transactionItem1}>
        {item[0]}
      </Text>
      <Text numberOfLines={1} style={styles.transactionItem2}>
        {item[1]}
      </Text>
    </View>
  );
  const _renderActionModalBody = (operations: any, opName: string) => (
    <View style={styles.transactionBodyContainer}>
      <View style={styles.transactionHeadingContainer}>
        <Text style={styles.transactionHeading}>{opName}</Text>
      </View>
      <View style={styles.transactionItemsContainer}>
        {Object.entries(operations[1]).map((item) => _renderTransactionInfoRow(item))}
      </View>
    </View>
  );
  const _showInvalidAlert = () => {
    Alert.alert(
      intl.formatMessage({ id: 'qr.unsupported_alert_title' }),
      intl.formatMessage({ id: 'qr.unsupported_alert_desc' }),
      [
        {
          text: 'Close',
          onPress: () => {
            _onClose();
          },
          style: 'cancel',
        },
      ],
    );
  };

  return (
    <ActionSheet
      ref={sheetModalRef}
      gestureEnabled={true}
      containerStyle={{ ...styles.sheetContent, height: screenHeight }}
      onClose={_onClose}
      indicatorStyle={styles.indicator}
    >
      <View style={styles.mainContainer}>
        {!!device && (
          <Camera
            style={EStyleSheet.absoluteFill}
            device={device}
            isActive={isScannerActive}
            codeScanner={codeScanner}
          />
        )}
        {isProcessing && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator color="white" style={styles.activityIndicator} />
          </View>
        )}
      </View>
    </ActionSheet>
  );
};

export default QRModal;
