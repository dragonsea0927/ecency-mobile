import React from 'react';
import { useIntl } from 'react-intl';
import { Text, View } from 'react-native';
import transferTypes from '../../constants/transferTypes';
import DropdownButton from '../dropdownButton';
import Icon from '../icon';
import TextInput from '../textInput';
import { TransferFormItem } from '../transferFormItem';
import UserAvatar from '../userAvatar';
// Styles
import styles from './transferAccountSelectorStyles';

export interface TransferAccountSelectorProps {
  accounts: any;
  currentAccountName: any;
  transferType: any;
  balance: any;
  fetchBalance: any;
  from: any;
  setFrom: any;
  destination: any;
  setDestination: any;
  amount: any;
  setAmount: any;
  getAccountsWithUsername: any;
  setIsUsernameValid: any;
  memo: any;
  setMemo: any;
}

const TransferAccountSelector = ({
  accounts,
  currentAccountName,
  transferType,
  balance,
  fetchBalance,
  from,
  setFrom,
  destination,
  setDestination,
  amount,
  setAmount,
  getAccountsWithUsername,
  setIsUsernameValid,
  memo,
  setMemo,
}): JSX.Element => {
  const intl = useIntl();

  const _handleOnDropdownChange = (value) => {
    fetchBalance(value);
    setFrom(value);
    if (transferType === 'convert') {
      setDestination(value);
    }
  };

  const _renderDropdown = (accounts, currentAccountName) => (
    <DropdownButton
      dropdownButtonStyle={styles.dropdownButtonStyle}
      rowTextStyle={styles.rowTextStyle}
      style={styles.dropdown}
      dropdownStyle={styles.dropdownStyle}
      textStyle={styles.dropdownText}
      options={accounts.map((item) => item.username)}
      defaultText={currentAccountName}
      selectedOptionIndex={accounts.findIndex((item) => item.username === currentAccountName)}
      onSelect={(index, value) => _handleOnDropdownChange(value)}
    />
  );

  const _handleOnChange = (state: string, val: string) => {
    let _amount = val.toString();
    if (_amount.includes(',')) {
      _amount = val.replace(',', '.');
    }
    if (state === 'amount') {
      if (parseFloat(Number(_amount)) <= parseFloat(balance)) {
        setAmount(_amount);
      }
    }
    if (state === 'destination') {
      getAccountsWithUsername(val).then((res) => {
        const isValid = res.includes(val);

        setIsUsernameValid(isValid);
      });
      setDestination(_amount);
    }
    if (state === 'memo') {
      setMemo(_amount);
    }
  };

  const _renderInput = (placeholder, state, keyboardType, isTextArea) => (
    <TextInput
      style={[isTextArea ? styles.textarea : styles.input]}
      onChangeText={(amount) => _handleOnChange(state, amount)}
      value={
        state === 'destination'
          ? destination
          : state === 'amount'
          ? amount
          : state === 'memo'
          ? memo
          : ''
      }
      placeholder={placeholder}
      placeholderTextColor="#c1c5c7"
      autoCapitalize="none"
      multiline={isTextArea}
      numberOfLines={isTextArea ? 4 : 1}
      keyboardType={keyboardType}
    />
  );
  return (
    <View style={styles.stepOneContainer}>
      <Text style={styles.sectionHeading}>
        {intl.formatMessage({ id: 'transfer.account_detail_head' })}
      </Text>
      <Text style={styles.sectionSubheading}>
        {intl.formatMessage({ id: 'transfer.account_detail_subhead' })}
      </Text>
      <TransferFormItem
        containerStyle={{ marginTop: 32 }}
        label={intl.formatMessage({ id: 'transfer.from' })}
        rightComponent={() => _renderDropdown(accounts, currentAccountName)}
      />
      {transferType !== transferTypes.CONVERT && (
        <TransferFormItem
          label={intl.formatMessage({ id: 'transfer.to' })}
          rightComponent={() =>
            _renderInput(
              intl.formatMessage({ id: 'transfer.to_placeholder' }),
              'destination',
              'default',
              false,
            )
          }
          containerStyle={styles.elevate}
        />
      )}

      <View style={styles.toFromAvatarsContainer}>
        <UserAvatar username={from} size="xl" style={styles.userAvatar} noAction />
        <Icon style={styles.icon} name="arrow-forward" iconType="MaterialIcons" />
        <UserAvatar username={destination} size="xl" style={styles.userAvatar} noAction />
      </View>
    </View>
  );
};

export default TransferAccountSelector;
