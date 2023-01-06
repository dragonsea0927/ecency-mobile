import React, { Fragment, useState, useRef, useMemo } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { injectIntl } from 'react-intl';
import get from 'lodash/get';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { hsOptions } from '../../../constants/hsOptions';
import AUTH_TYPE from '../../../constants/authType';

import {
  BasicHeader,
  MainButton,
  Modal,
  TransferAccountSelector,
  TransferAmountInputSection,
} from '../../../components';

import styles from './transferStyles';
import transferTypes from '../../../constants/transferTypes';
import { getEngineActionJSON } from '../../../providers/hive-engine/hiveEngineActions';
import { useAppDispatch } from '../../../hooks';
import { showActionModal } from '../../../redux/actions/uiAction';

const TransferView = ({
  currentAccountName,
  transferType,
  getAccountsWithUsername,
  balance,
  transferToAccount,
  accountType,
  accounts,
  intl,
  handleOnModalClose,
  fundType,
  selectedAccount,
  fetchBalance,
}) => {

  const dispatch = useAppDispatch();

  const [from, setFrom] = useState(currentAccountName);
  const [destination, setDestination] = useState(
    transferType === 'transfer_to_vesting' ||
      transferType === 'transfer_to_savings' ||
      transferType === 'withdraw_vesting' ||
      transferType === 'withdraw_hive' ||
      transferType === 'withdraw_hbd' ||
      transferType === 'convert' ||
      transferType === 'unstake_engine'
      ? currentAccountName
      : transferType === 'purchase_estm'
      ? 'esteem.app'
      : '',
  );
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState(transferType === 'purchase_estm' ? 'estm-purchase' : '');
  const [isUsernameValid, setIsUsernameValid] = useState(
    !!(
      transferType === 'purchase_estm' ||
      transferType === 'transfer_to_vesting' ||
      transferType === 'transfer_to_savings' ||
      transferType === 'withdraw_vesting' ||
      transferType === 'withdraw_hive' ||
      transferType === 'withdraw_hbd' ||
      transferType === 'unstake_engine' ||
      (transferType === 'convert' && currentAccountName)
    ),
  );
  const [hsTransfer, setHsTransfer] = useState(false);
  const [isTransfering, setIsTransfering] = useState(false);

  const isEngineToken = useMemo(()=>transferType.endsWith('_engine'), [transferType]);

  const _handleTransferAction = () => {
    setIsTransfering(true);
    if (accountType === AUTH_TYPE.STEEM_CONNECT) {
      setHsTransfer(true);
    } else {
      transferToAccount(from, destination, amount, memo);
    }
  };

  let path;
  if (hsTransfer) {
    // NOTE: Keepping point purchase url here for referemnce in case we have to put it back again,
    // the path formatting seems quite complex so perhaps it's better to just let it live here
    // as comment
    // if (transferType === transferTypes.PURCHASE_ESTM) {
    //   const json = JSON.stringify({
    //     sender: get(selectedAccount, 'name'),
    //     receiver: destination,
    //     amount: `${Number(amount).toFixed(3)} ${fundType}`,
    //     memo,
    //   });
    //   path = `sign/custom-json?authority=active&required_auths=%5B%22${get(
    //     selectedAccount,
    //     'name',
    //   )}%22%5D&required_posting_auths=%5B%5D&id=ecency_point_transfer&json=${encodeURIComponent(
    //     json,
    //   )}`;
    // } else

    if (transferType === transferTypes.TRANSFER_TO_SAVINGS) {
      path = `sign/transfer_to_savings?from=${currentAccountName}&to=${destination}&amount=${encodeURIComponent(
        `${amount} ${fundType}`,
      )}&memo=${encodeURIComponent(memo)}`;
    } else if (transferType === transferTypes.DELEGATE_VESTING_SHARES) {
      path = `sign/delegate_vesting_shares?delegator=${currentAccountName}&delegatee=${destination}&vesting_shares=${encodeURIComponent(
        `${amount} ${fundType}`,
      )}`;
    } else if (transferType === transferTypes.TRANSFER_TO_VESTING) {
      path = `sign/transfer_to_vesting?from=${currentAccountName}&to=${destination}&amount=${encodeURIComponent(
        `${amount} ${fundType}`,
      )}`;
    } else if (
      transferType === transferTypes.WITHDRAW_HIVE ||
      transferType === transferTypes.WITHDRAW_HBD
    ) {
      path = `sign/transfer_from_savings?from=${currentAccountName}&to=${destination}&amount=${encodeURIComponent(
        `${amount} ${fundType}`,
      )}&request_id=${new Date().getTime() >>> 0}`;
    } else if (transferType === transferTypes.CONVERT) {
      path = `sign/convert?owner=${currentAccountName}&amount=${encodeURIComponent(
        `${amount} ${fundType}`,
      )}&requestid=${new Date().getTime() >>> 0}`;
    } else if (transferType === transferTypes.WITHDRAW_VESTING) {
      path = `sign/withdraw_vesting?account=${currentAccountName}&vesting_shares=${encodeURIComponent(
        `${amount} ${fundType}`,
      )}`;
    } else if (isEngineToken) {
      const json = getEngineActionJSON(
        transferType.split('_')[0],
        destination,
        `${amount} ${fundType}`,
        fundType,
        memo,
      );
      path = `sign/custom-json?authority=active&required_auths=%5B%22${get(
        selectedAccount,
        'name',
      )}%22%5D&required_posting_auths=%5B%5D&id=ssc-mainnet-hive&json=${encodeURIComponent(
        JSON.stringify(json),
      )}`;
    } else {
      path = `sign/transfer?from=${currentAccountName}&to=${destination}&amount=${encodeURIComponent(
        `${amount} ${fundType}`,
      )}&memo=${encodeURIComponent(memo)}`;
    }
  }

  const _onNextPress = () => {
    dispatch(showActionModal({
        title:intl.formatMessage({ id: 'transfer.information' }),
        buttons:[
          {
            text: intl.formatMessage({ id: 'alert.cancel' }),
            onPress: ()=>{}
          },
          {
            text: intl.formatMessage({ id: 'alert.confirm' }),
            onPress:_handleTransferAction
          }
        ]
      }))
    }


  const nextBtnDisabled = !((isEngineToken ? amount > 0 : amount >= 0.001) && isUsernameValid);

  return (
    <View style={styles.container}>
      <BasicHeader
        title={intl.formatMessage({ id: `transfer.${transferType}` })}
        backIconName="close"
      />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={[styles.grow, styles.keyboardAwareScrollContainer]}
      >
        <View style={styles.container}>
          <TransferAccountSelector
            accounts={accounts}
            currentAccountName={currentAccountName}
            transferType={transferType}
            balance={balance}
            fetchBalance={fetchBalance}
            getAccountsWithUsername={getAccountsWithUsername}
            from={from}
            setFrom={setFrom}
            destination={destination}
            setDestination={setDestination}
            amount={amount}
            setAmount={setAmount}
            setIsUsernameValid={setIsUsernameValid}
            memo={memo}
            setMemo={setMemo}
          />
          <TransferAmountInputSection
            balance={balance}
            getAccountsWithUsername={getAccountsWithUsername}
            setIsUsernameValid={setIsUsernameValid}
            setDestination={setDestination}
            destination={destination}
            memo={memo}
            setMemo={setMemo}
            amount={amount}
            setAmount={setAmount}
            hsTransfer={hsTransfer}
            transferType={transferType}
            selectedAccount={selectedAccount}
            fundType={fundType}
            currentAccountName={currentAccountName}
            disableMinimum={isEngineToken}
          />
          <View style={styles.bottomContent}>
            <MainButton
              style={styles.button}
              isDisable={nextBtnDisabled}
              onPress={_onNextPress}
              isLoading={isTransfering}
            >
              <Text style={styles.buttonText}>{intl.formatMessage({ id: 'transfer.next' })}</Text>
            </MainButton>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {path && (
        <Modal
          isOpen={hsTransfer}
          isFullScreen
          isCloseButton
          handleOnModalClose={handleOnModalClose}
          title={intl.formatMessage({ id: 'transfer.steemconnect_title' })}
        >
          <WebView source={{ uri: `${hsOptions.base_url}${path}` }} />
        </Modal>
      )}
    </View>
  );
};

export default injectIntl(TransferView);
