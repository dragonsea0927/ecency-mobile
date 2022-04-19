/* eslint-disable react/no-unused-state */
import React, { Fragment, Component } from 'react';
import { Text, View, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { injectIntl } from 'react-intl';
import Slider from '@esteemapp/react-native-slider';
import get from 'lodash/get';

import { View as AnimatedView } from 'react-native-animatable';
import { getWithdrawRoutes } from '../../../providers/hive/dhive';
import AUTH_TYPE from '../../../constants/authType';

import {
  BasicHeader,
  TransferFormItem,
  MainButton,
  DropdownButton,
  Modal,
  SquareButton,
  InformationBox,
  Icon,
  IconButton,
  BeneficiarySelectionContent,
  TextInput,
} from '../../../components';
import WithdrawAccountModal from './withdrawAccountModal';

import parseToken from '../../../utils/parseToken';
import parseDate from '../../../utils/parseDate';
import { hpToVests, vestsToHp } from '../../../utils/conversions';
import { isEmptyDate } from '../../../utils/time';

import styles from './transferStyles';
import { OptionsModal } from '../../../components/atoms';
import { Beneficiary } from '../../../redux/reducers/editorReducer';

/* Props
 * ------------------------------------------------
 *   @prop { type }    name                - Description....
 */

class PowerDownView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: props.currentAccountName,
      amount: 0,
      hp: 0.0,
      steemConnectTransfer: false,
      isTransfering: false,
      isOpenWithdrawAccount: false,
      destinationAccounts: [],
      disableDone: false,
      isAmountValid: false,
    };

    this.startActionSheet = React.createRef();
    this.stopActionSheet = React.createRef();
    this.amountTextInput = React.createRef();
  }

  // Component Functions

  _fetchRoutes = (username) => {
    return getWithdrawRoutes(username)
      .then((res) => {
        const accounts = res.map((item) => ({
          username: item.to_account,
          percent: item.percent,
          autoPowerUp: item.auto_vest,
        }));
        this.setState({
          destinationAccounts: accounts,
        });
        return res;
      })
      .catch((e) => {
        alert(e.message || e.toString());
      });
  };

  _handleTransferAction = () => {
    const { transferToAccount, accountType, intl } = this.props;
    const { from, destinationAccounts, amount } = this.state;

    this.setState({ isTransfering: true });

    if (accountType === AUTH_TYPE.STEEM_CONNECT) {
      Alert.alert(
        intl.formatMessage({ id: 'alert.warning' }),
        intl.formatMessage({ id: 'transfer.sc_power_down_error' }),
      );
      this.setState({ steemConnectTransfer: true, isTransfering: false });
    } else {
      transferToAccount(from, destinationAccounts, amount, '');
    }
  };

  _handleAmountChange = ({ hpValue, availableVestingShares }) => {
    const { hivePerMVests } = this.props;
    const parsedValue = parseFloat(hpValue);
    const vestsForHp = hpToVests(hpValue, hivePerMVests);
    const totalHP = vestsToHp(availableVestingShares, hivePerMVests).toFixed(3);

    if (Number.isNaN(parsedValue)) {
      this.setState({ amount: 0, hp: 0.0, isAmountValid: false });
    } else if (parsedValue >= totalHP) {
      this.setState({
        amount: availableVestingShares,
        hp: totalHP,
        isAmountValid: false,
      });
    } else {
      this.setState({ amount: vestsForHp, hp: parsedValue, isAmountValid: true });
    }
  };

  _handleSliderAmountChange = ({ value, availableVestingShares }) => {
    const { hivePerMVests } = this.props;
    const hp = vestsToHp(value, hivePerMVests).toFixed(3);
    const isAmountValid = value !== 0 && value <= availableVestingShares;
    this.setState({ amount: value, hp, isAmountValid });
  };

  // renderers
  _renderDropdown = (accounts, currentAccountName) => (
    <DropdownButton
      dropdownButtonStyle={styles.dropdownButtonStyle}
      rowTextStyle={styles.rowTextStyle}
      style={styles.dropdown}
      dropdownStyle={styles.dropdownStyle}
      textStyle={styles.dropdownText}
      options={accounts.map((item) => item.username)}
      defaultText={currentAccountName}
      selectedOptionIndex={accounts.findIndex((item) => item.username === currentAccountName)}
      onSelect={(index, value) => this._handleOnDropdownChange(value)}
    />
  );

  _renderDestinationAccountItems = () => {
    const { destinationAccounts } = this.state;

    if (destinationAccounts.length <= 0) {
      return this._renderButton();
    }
    return (
      <Fragment>
        {destinationAccounts.map((item) => (
          <View style={styles.destinationAccountsLists} key={item.username}>
            <Text>{item.username}</Text>
            <IconButton
              style={styles.iconButton}
              size={20}
              iconStyle={styles.crossIcon}
              iconType="MaterialIcons"
              name="clear"
              onPress={() => this._removeDestinationAccount(item)}
            />
          </View>
        ))}
        {this._renderButton()}
      </Fragment>
    );
  };

  _removeDestinationAccount = (account) => {
    const { destinationAccounts } = this.state;
    const { setWithdrawVestingRoute, currentAccountName } = this.props;

    const result = destinationAccounts.filter((item) => item.username !== account.username);

    setWithdrawVestingRoute(currentAccountName, account.username, 0, false);
    this.setState({ destinationAccounts: result });
  };

  _renderButton = () => (
    <SquareButton
      style={styles.formButton}
      textStyle={styles.formButtonText}
      onPress={() => this.setState({ isOpenWithdrawAccount: true })}
      text="Add withdraw account"
    />
  );

  _renderInformationText = (text) => <Text style={styles.amountText}>{text}</Text>;

  _renderIncomingFunds = (poweringDownFund, poweringDownVests, nextPowerDown) => (
    <Fragment>
      <Text style={styles.incomingFundSteem}>{`+ ${poweringDownFund} HIVE`}</Text>
      <Text style={styles.incomingFundVests}>{`- ${poweringDownVests} VESTS`}</Text>
      <Text style={styles.nextPowerDown}>{nextPowerDown}</Text>
    </Fragment>
  );

  _renderBeneficiarySelectionContent = () => {
    const { from, destinationAccounts, amount } = this.state;
    const powerDownBeneficiaries = destinationAccounts?.map((item) => ({
      account: item.username,
      weight: item.percent * 100,
      autoPowerUp: item.autoPowerUp,
    }));

    const _handleSaveBeneficiary = (beneficiaries) => {
      const destinationAccounts = beneficiaries.map((item) => ({
        username: item.account,
        percent: item.weight / 100,
        autoPowerUp: item.autoPowerUp,
      }));
      let latestDestinationAccount = destinationAccounts[destinationAccounts.length - 1];
      if (latestDestinationAccount.username && latestDestinationAccount.percent) {
        this._handleOnSubmit(
          latestDestinationAccount.username,
          latestDestinationAccount.percent,
          latestDestinationAccount.autoPowerUp,
        );
      }
    };

    const _handleRemoveBeneficiary = (beneficiary) => {
      if (beneficiary) {
        const beneficiaryAccount = {
          username: beneficiary.account,
          percent: beneficiary.weight / 100,
          autoPowerUp: beneficiary.autoPowerUp,
        };
        this._removeDestinationAccount(beneficiaryAccount);
      }
    };
    return (
      <View style={styles.beneficiaryContainer}>
        <BeneficiarySelectionContent
          setDisableDone={this._handleSetDisableDone}
          powerDown={true}
          powerDownBeneficiaries={powerDownBeneficiaries}
          handleSaveBeneficiary={_handleSaveBeneficiary}
          handleRemoveBeneficiary={_handleRemoveBeneficiary}
        />
      </View>
    );
  };

  _renderAmountInput = (placeholder, availableVestingShares) => {
    const { isAmountValid } = this.state;
    return (
      <TextInput
        style={[styles.amountInput, !isAmountValid && styles.error]}
        onChangeText={(hpValue) => {
          this._handleAmountChange({ hpValue, availableVestingShares });
        }}
        value={this.state.hp.toString()}
        placeholder={placeholder}
        placeholderTextColor="#c1c5c7"
        autoCapitalize="none"
        multiline={false}
        keyboardType="decimal-pad"
        innerRef={this.amountTextInput}
        blurOnSubmit={false}
      />
    );
  };

  _handleSetDisableDone = (value) => {
    this.setState({ disableDone: value });
  };
  _handleOnDropdownChange = (value) => {
    const { fetchBalance } = this.props;

    fetchBalance(value);
    this._fetchRoutes(value);
    this.setState({ from: value, amount: 0 });
  };

  _renderDescription = (text) => <Text style={styles.description}>{text}</Text>;

  _handleOnSubmit = (username, percent, autoPowerUp) => {
    const { destinationAccounts } = this.state;
    const { setWithdrawVestingRoute, currentAccountName, intl } = this.props;

    if (!destinationAccounts.some((item) => item.username === username)) {
      destinationAccounts.push({ username, percent, autoPowerUp });
      setWithdrawVestingRoute(currentAccountName, username, percent, autoPowerUp);
      this.setState({
        isOpenWithdrawAccount: false,
        destinationAccounts,
      });
    } else {
      Alert.alert(
        intl.formatMessage({ id: 'alert.fail' }),
        intl.formatMessage({ id: 'alert.same_user' }),
      );
    }
  };

  // Component Life Cycles
  UNSAFE_componentWillMount() {
    const { currentAccountName } = this.props;

    this._fetchRoutes(currentAccountName);
  }

  render() {
    const {
      accounts,
      selectedAccount,
      intl,
      getAccountsWithUsername,
      transferType,
      currentAccountName,
      hivePerMVests,
    } = this.props;
    const { amount, isTransfering, isOpenWithdrawAccount } = this.state;
    let poweringDownVests = 0;
    let availableVestingShares = 0;
    let poweringDownFund = 0;

    const poweringDown = !isEmptyDate(get(selectedAccount, 'next_vesting_withdrawal'));
    const nextPowerDown = parseDate(get(selectedAccount, 'next_vesting_withdrawal'));

    if (poweringDown) {
      poweringDownVests = parseToken(get(selectedAccount, 'vesting_withdraw_rate'));
      poweringDownFund = vestsToHp(poweringDownVests, hivePerMVests).toFixed(3);
    } else {
      availableVestingShares =
        parseToken(get(selectedAccount, 'vesting_shares')) -
        (Number(get(selectedAccount, 'to_withdraw')) - Number(get(selectedAccount, 'withdrawn'))) /
          1e6 -
        parseToken(get(selectedAccount, 'delegated_vesting_shares'));
    }

    const spCalculated = vestsToHp(amount, hivePerMVests);
    const fundPerWeek = Math.round((spCalculated / 13) * 1000) / 1000;
    const totalHP = vestsToHp(availableVestingShares, hivePerMVests);

    const _renderSlider = () => (
      <View style={styles.sliderBox}>
        <View style={styles.emptyBox} />
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            trackStyle={styles.track}
            thumbStyle={styles.thumb}
            minimumTrackTintColor="#357ce6"
            thumbTintColor="#007ee5"
            maximumValue={availableVestingShares}
            value={amount}
            onValueChange={(value) =>
              this._handleSliderAmountChange({ value, availableVestingShares })
            }
          />
          <View style={styles.sliderAmountContainer}>
            <Text style={styles.amountText}>{`MAX  ${totalHP.toFixed(3)} HP`}</Text>
          </View>
        </View>
      </View>
    );
    const _renderMiddleContent = () => {
      const { intl } = this.props;
      return (
        <AnimatedView animation="bounceInRight" delay={500} useNativeDriver>
          <View style={styles.stepTwoContainer}>
            <Text style={styles.sectionHeading}>
              {intl.formatMessage({ id: 'transfer.power_down_amount_head' })}
            </Text>
            <Text style={styles.sectionSubheading}>
              {intl.formatMessage({ id: 'transfer.power_down_amount_subhead' })}
            </Text>

            <TransferFormItem
              label={intl.formatMessage({ id: 'transfer.amount_hp' })}
              rightComponent={() =>
                this._renderAmountInput(
                  intl.formatMessage({ id: 'transfer.amount' }),
                  availableVestingShares,
                )
              }
              containerStyle={styles.paddBottom}
            />
            {_renderSlider()}
            <View style={styles.estimatedContainer}>
              <Text style={styles.leftEstimated} />
              <Text style={styles.rightEstimated}>
                {intl.formatMessage({ id: 'transfer.estimated_weekly' })} :
                {`+ ${fundPerWeek.toFixed(3)} HIVE`}
              </Text>
            </View>
          </View>
        </AnimatedView>
      );
    };

    return (
      <Fragment>
        <BasicHeader title={intl.formatMessage({ id: `transfer.${transferType}` })} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.powerDownKeyboadrAvoidingContainer}
          keyboardShouldPersistTaps
        >
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContentContainer}>
            {this._renderBeneficiarySelectionContent()}
            {_renderMiddleContent()}
            {/*
            <View style={styles.middleContent}>
              <TransferFormItem
                label={intl.formatMessage({ id: 'transfer.from' })}
                rightComponent={() => this._renderDropdown(accounts, currentAccountName)}
              />
              <TransferFormItem
                label={intl.formatMessage({ id: 'transfer.destination_accounts' })}
                rightComponent={this._renderDestinationAccountItems}
              />

              {!poweringDown && (
                <Fragment>
                  <TransferFormItem
                    label={intl.formatMessage({ id: 'transfer.amount' })}
                    rightComponent={() => this._renderInformationText(`${amount.toFixed(6)} VESTS`)}
                  />
                  <Slider
                    style={styles.slider}
                    trackStyle={styles.track}
                    thumbStyle={styles.thumb}
                    minimumTrackTintColor="#357ce6"
                    thumbTintColor="#007ee5"
                    maximumValue={availableVestingShares}
                    value={amount}
                    onValueChange={(value) => {
                      this.setState({ amount: value });
                    }}
                  />
                  <Text style={styles.informationText}>
                    {intl.formatMessage({ id: 'transfer.amount_information' })}
                  </Text>
                </Fragment>
              )}

              {poweringDown && (
                <Fragment>
                  <TransferFormItem
                    label={intl.formatMessage({ id: 'transfer.incoming_funds' })}
                    rightComponent={() =>
                      this._renderIncomingFunds(
                        poweringDownFund,
                        poweringDownVests,
                        nextPowerDown.toLocaleString(),
                      )
                    }
                  />
                </Fragment>
              )}
            </View>
*/}
            <View style={styles.bottomContent}>
              {!poweringDown && (
                <Fragment>
                  {/*
                  <View style={styles.informationView}>
                    <InformationBox
                      style={styles.spInformation}
                      text={`- ${spCalculated.toFixed(3)} HP`}
                    />
                    <InformationBox
                      style={styles.vestsInformation}
                      text={`- ${amount.toFixed(0)} VESTS`}
                    />
                  </View>
                  <Icon
                    style={styles.icon}
                    size={40}
                    iconType="MaterialIcons"
                    name="arrow-downward"
                  />
                  <InformationBox
                    style={styles.steemInformation}
                    text={`+ ${fundPerWeek.toFixed(3)} HIVE`}
                  />
                  <Text style={styles.informationText}>
                    {intl.formatMessage({ id: 'transfer.estimated_weekly' })}
                  </Text>
*/}
                  <MainButton
                    style={styles.button}
                    isDisable={amount <= 0}
                    onPress={() => this.startActionSheet.current.show()}
                    isLoading={isTransfering}
                  >
                    <Text style={styles.buttonText}>
                      {intl.formatMessage({ id: 'transfer.next' })}
                    </Text>
                  </MainButton>
                </Fragment>
              )}
              {poweringDown && (
                <MainButton
                  style={styles.stopButton}
                  onPress={() => this.stopActionSheet.current.show()}
                  isLoading={isTransfering}
                >
                  <Text style={styles.buttonText}>
                    {intl.formatMessage({ id: 'transfer.stop' })}
                  </Text>
                </MainButton>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <OptionsModal
          ref={this.startActionSheet}
          options={[
            intl.formatMessage({ id: 'alert.confirm' }),
            intl.formatMessage({ id: 'alert.cancel' }),
          ]}
          title={intl.formatMessage({ id: 'transfer.information' })}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={(index) => (index === 0 ? this._handleTransferAction() : null)}
        />
        <OptionsModal
          ref={this.stopActionSheet}
          options={[
            intl.formatMessage({ id: 'alert.confirm' }),
            intl.formatMessage({ id: 'alert.cancel' }),
          ]}
          title={intl.formatMessage({ id: 'transfer.stop_information' })}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={(index) =>
            index === 0 ? this.setState({ amount: 0 }, this._handleTransferAction()) : null
          }
        />
        <Modal
          isOpen={isOpenWithdrawAccount}
          isCloseButton
          isFullScreen
          title={intl.formatMessage({ id: 'transfer.steemconnect_title' })}
          handleOnModalClose={() => this.setState({ isOpenWithdrawAccount: false })}
        >
          <WithdrawAccountModal
            getAccountsWithUsername={getAccountsWithUsername}
            handleOnSubmit={this._handleOnSubmit}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default injectIntl(PowerDownView);
/* eslint-enable */
