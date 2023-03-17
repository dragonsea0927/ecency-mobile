import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Alert, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useIntl } from 'react-intl';
import { get, isArray } from 'lodash';
import styles from '../styles/tokensSelectModa.styles';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { CheckBox, Icon, Modal, SearchInput, TextButton } from '../../../components';
import { CoinBase, CoinData } from '../../../redux/reducers/walletReducer';
import DEFAULT_ASSETS from '../../../constants/defaultAssets';
import { setSelectedCoins } from '../../../redux/actions/walletActions';
import { AssetIcon } from '../../../components/atoms';
import { profileUpdate } from '../../../providers/hive/dhive';
import { updateCurrentAccount } from '../../../redux/actions/accountAction';
import EStyleSheet from 'react-native-extended-stylesheet';
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

enum TokenType {
  ENGINE = 'ENGINE',
  SPK = 'SPK',
}

interface ProfileToken {
  symbol: string;
  type: TokenType;
}

export const AssetsSelectModal = forwardRef(({ }, ref) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const coinsData = useAppSelector((state) => state.wallet.coinsData);
  const selectedCoins: CoinBase[] = useAppSelector((state) => state.wallet.selectedCoins);
  const pinCode = useAppSelector((state) => state.application.pin);
  const currentAccount = useAppSelector((state) => state.account.currentAccount);

  const [visible, setVisible] = useState(false);
  const [selection, setSelection] = useState<CoinBase[]>([]);
  const [listData, setListData] = useState<CoinData[]>([]);
  const [query, setQuery] = useState('');


  useImperativeHandle(ref, () => ({
    showModal: () => {
      setVisible(true);
      setQuery('');
      setSelection(selectedCoins.filter((item) => (item.isEngine && !!coinsData[item.symbol])));
    },
  }));

  useEffect(() => {
    let data: CoinData[] = [];

    for (const key in coinsData) {
      if (coinsData.hasOwnProperty(key) && coinsData[key].isEngine) {
        const asset: CoinData = coinsData[key];
        const _name = asset.name.toLowerCase();
        const _symbol = asset.symbol.toLowerCase();
        const _query = query.toLowerCase();
        if (query === '' || _symbol.includes(_query) || _name.includes(_query)) {
          data.push(asset);
        }
      }
    }

    data = data.sort((a, b) => {
      const _getSortingIndex = (e) => selection.findIndex((item) => item.symbol === e.symbol);
      const _aIndex = _getSortingIndex(a);
      const _bIndex = _getSortingIndex(b);

      if(_aIndex > -1 && _bIndex > -1){
        return _aIndex - _bIndex
      } if(_aIndex > -1 && _bIndex < 0){
        return -1;
      } else if(_aIndex < 0 && _bIndex > -1){
        return 1;
      } 
      
      return 0;
    });

    setListData(data);
  }, [query, coinsData, selection]);

  // migration snippet
  useEffect(() => {
    const tokens = currentAccount?.about?.profile?.tokens;
    if (!tokens) {
      _updateUserProfile();
    } else if (!isArray(tokens)) {
      // means tokens is using old object formation, covert to array
      const _mapSymbolsToProfileToken = (symbols, type) =>
        isArray(symbols)
          ? symbols.map((symbol) => ({
            symbol,
            type,
          }))
          : [];

      _updateUserProfile([
        ..._mapSymbolsToProfileToken(tokens.engine, TokenType.ENGINE),
        ..._mapSymbolsToProfileToken(tokens.spk, TokenType.SPK),
      ]);
    }
  }, [currentAccount]);

  const _updateUserProfile = async (assetsData?: ProfileToken[]) => {
    try {
      if (!assetsData?.length) {
        assetsData = selection.map((item) => ({
          symbol: item.symbol,
          type: TokenType.ENGINE,
        })); // TODO: later handle SPK assets as well
      }

      const updatedCurrentAccountData = currentAccount;
      updatedCurrentAccountData.about.profile = {
        ...updatedCurrentAccountData.about.profile,
        tokens: assetsData,
      };
      const params = {
        ...updatedCurrentAccountData.about.profile,
      };
      await profileUpdate(params, pinCode, currentAccount);
      dispatch(updateCurrentAccount(updatedCurrentAccountData));
    } catch (err) {
      Alert.alert(
        intl.formatMessage({
          id: 'alert.fail',
        }),
        get(err, 'message', err.toString()),
      );
    }
  };

  const _onApply = () => {
    dispatch(setSelectedCoins([...DEFAULT_ASSETS, ...selection]));
    setVisible(false);
    _updateUserProfile(); // update the user profile with updated tokens data
  };

  const _onDragEnd = ({data, from, to}) => {
    const totalSel = selection.length;
    const item = listData[from];

    const _obj = {
      id: item.symbol,
      symbol: item.symbol,
      isEngine: true,
      notCrypto: false,
    }
    console.log("change order", item.symbol, from, to, 'total:',totalSel)

    if(from >= totalSel && to <= totalSel){
      //insert in set at to
      selection.splice(to, 0, _obj)
    } else if (from < totalSel && to >= totalSel) {
      //remove from sel
      selection.splice(from, 1);
    } else if (from < totalSel && to < totalSel){
      //order change from to
      selection.splice(from, 1);
      selection.splice(to, 0, _obj);
    }

    setSelection([...selection])
  }

  const _renderOptions = () => {
    const _renderItem = ({ item, drag }) => {
      const key = item.symbol;
      const index = selection.findIndex((selected) => selected.symbol === item.symbol);
      const isSelected = index >= 0;

      const _onPress = () => {
        if (isSelected) {
          selection.splice(index, 1);
        } else {
          selection.push({
            id: key,
            symbol: key,
            isEngine: true,
            notCrypto: false,
          });
        }
        setSelection([...selection]);
      };

      return (
        <ScaleDecorator>
          <View style={styles.checkView}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox clicked={_onPress} isChecked={isSelected} />
              <AssetIcon
                id={item.symbol}
                containerStyle={styles.assetIconContainer}
                iconUrl={item.iconUrl}
                isEngine={item.isEngine}
                iconSize={24}
              />
              <Text style={styles.informationText}>{key}</Text>
            </View>
            <TouchableWithoutFeedback onPressIn={drag} >
              <Icon
                iconType="MaterialCommunityIcons"
                name='drag-horizontal-variant'
                color={EStyleSheet.value("$iconColor")}
                size={24}
              />
            </TouchableWithoutFeedback>
          </View>
        </ScaleDecorator>
      );
    };

    return (
      <DraggableFlatList
        containerStyle={styles.scrollContainer}
        data={listData}
        extraData={query}
        renderItem={_renderItem}
        onDragEnd={_onDragEnd}
        keyExtractor={(item, index) => `token_${item.symbol + index}`}
      />
    );
  };

  const _renderContent = () => {
    return (
      <View style={styles.modalContainer}>
        <SearchInput
          onChangeText={setQuery}
          placeholder={intl.formatMessage({ id: 'header.search' })}
          autoFocus={false}
          backEnabled={false}
        />

        {_renderOptions()}

        <View style={styles.actionPanel}>
          <TextButton
            text={intl.formatMessage({ id: 'alert.confirm' })}
            onPress={_onApply}
            textStyle={styles.btnText}
            style={styles.button}
          />
        </View>
      </View>
    );
  };

  return (
    <Modal
      isOpen={visible}
      handleOnModalClose={() => setVisible(false)}
      isFullScreen
      isCloseButton
      presentationStyle="formSheet"
      title={intl.formatMessage({ id: 'wallet.engine_select_assets' })}
      animationType="slide"
      style={styles.modalStyle}
    >
      {_renderContent()}
    </Modal>
  );
});
