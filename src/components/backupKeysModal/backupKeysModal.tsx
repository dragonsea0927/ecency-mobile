import React from 'react';
import { useIntl } from 'react-intl';
import { ScrollView, View, Text } from 'react-native';
import styles from './backupKeysModalStyles';
import Modal from '../modal';
import { TextBoxWithCopy } from '..';
import { useAppSelector } from '../../hooks';
import AUTH_TYPE from '../../constants/authType';
import { decryptKey } from '../../utils/crypto';
import { getDigitPinCode } from '../../providers/hive/dhive';

interface BackupPrivateKeysModalProps {
  visible: boolean;
  handleBackupKeysModalVisibility: (value: boolean) => void;
}

export const BackupPrivateKeysModal = ({
  visible,
  handleBackupKeysModalVisibility,
}: BackupPrivateKeysModalProps) => {
  const intl = useIntl();

  const currentAccount = useAppSelector((state) => state.account.currentAccount);
  const pinCode = useAppSelector((state) => state.application.pin);
  const digitPinCode = getDigitPinCode(pinCode);

  const _handleOnCloseSheet = () => {
    handleBackupKeysModalVisibility(false);
  };

  const _renderKey = (authType: string, key: string) => (
    <View style={styles.inputsContainer}>
      <TextBoxWithCopy label={authType} value={key} />
    </View>
  );

  const _renderNoKeys = () => (
    <View style={styles.noKeysContainer}>
      <Text style={styles.noKeysText}>
        {intl.formatMessage({
          id: 'settings.backup_keys_modal.no_keys',
        })}
      </Text>
    </View>
  );
  const _renderContent = (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {currentAccount?.local?.authType === AUTH_TYPE.STEEM_CONNECT && _renderNoKeys()}
      {currentAccount?.local?.masterKey
        ? _renderKey(
            intl.formatMessage({
              id: 'settings.backup_keys_modal.owner_key',
            }),
            decryptKey(currentAccount?.local?.masterKey, digitPinCode) || '',
          )
        : null}
      {currentAccount?.local?.activeKey
        ? _renderKey(
            intl.formatMessage({
              id: 'settings.backup_keys_modal.active_key',
            }),
            decryptKey(currentAccount?.local?.activeKey, digitPinCode) || '',
          )
        : null}
      {currentAccount?.local?.postingKey
        ? _renderKey(
            intl.formatMessage({
              id: 'settings.backup_keys_modal.posting_key',
            }),
            decryptKey(currentAccount?.local?.postingKey, digitPinCode) || '',
          )
        : null}
      {currentAccount?.local?.memoKey
        ? _renderKey(
            intl.formatMessage({
              id: 'settings.backup_keys_modal.memo_key',
            }),
            decryptKey(currentAccount?.local?.memoKey, digitPinCode) || '',
          )
        : null}
    </ScrollView>
  );

  return (
    <Modal
      isOpen={visible}
      handleOnModalClose={_handleOnCloseSheet}
      presentationStyle="formSheet"
      animationType="slide"
      title={intl.formatMessage({ id: 'settings.backup_private_keys' })}
      style={styles.modalStyle}
    >
      {_renderContent}
    </Modal>
  );
};
