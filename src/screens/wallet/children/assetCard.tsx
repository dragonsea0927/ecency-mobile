import { View, Text, TouchableOpacity } from 'react-native';
import React, { ComponentType, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import styles from '../styles/children.styles';
import { SimpleChart } from '../../../components';
import getWindowDimensions from '../../../utils/getWindowDimensions';
import { ASSET_IDS } from '../../../constants/defaultAssets';
import { ClaimButton } from './claimButton';

import { AssetIcon } from '../../../components/atoms';

export interface AssetCardProps {
  id: string;
  chartData: number[];
  name: string;
  iconUrl?: string;
  notCrypto?: boolean;
  isEngine?: boolean;
  symbol: string;
  currencySymbol: string;
  changePercent: number;
  currentValue: number;
  ownedTokens: number;
  unclaimedRewards: string;
  enableBuy?: boolean;
  isClaiming?: boolean;
  isLoading?: boolean;
  footerComponent: ComponentType<any>;
  onCardPress: () => void;
  onClaimPress: () => void;
  onBoostAccountPress: () => void;
}

export const AssetCard = ({
  id,
  name,
  iconUrl,
  notCrypto,
  isEngine,
  chartData,
  currencySymbol,
  symbol,
  changePercent,
  currentValue,
  ownedTokens,
  footerComponent,
  unclaimedRewards,
  enableBuy,
  isClaiming,
  isLoading,
  onCardPress,
  onClaimPress,
  onBoostAccountPress,
}: AssetCardProps) => {
  const intl = useIntl();

  const [claimExpected, setClaimExpected] = useState(false);

  useEffect(() => {
    if (!isClaiming && claimExpected) {
      setClaimExpected(false);
    }
  }, [isClaiming]);

  const _onClaimPress = () => {
    setClaimExpected(!!unclaimedRewards);
    onClaimPress();
  };

  const _name = intl.messages[`wallet.${id}.name`]
    ? intl.formatMessage({ id: `wallet.${id}.name` })
    : name;
  const value = `${isEngine ? ownedTokens.toFixed(6) : ownedTokens} ${isEngine ? '' : symbol}`;

  const _renderHeader = (
    <View style={styles.cardHeader}>
      <AssetIcon
        id={id}
        iconUrl={iconUrl}
        isEngine={isEngine}
        containerStyle={styles.logoContainer}
        iconSize={32}
      />
      <View style={styles.cardTitleContainer}>
        <Text style={styles.textTitle}>{symbol}</Text>
        <Text style={styles.textSubtitle}>{_name}</Text>
      </View>
      <View style={styles.cardValuesContainer}>
        <Text style={styles.textTitle}>{value}</Text>

        <Text style={styles.textSubtitleRight}>
          {`${(ownedTokens * currentValue).toFixed(6)}${currencySymbol}`}
        </Text>
      </View>
    </View>
  );

  const _renderClaimSection = () => {
    if (unclaimedRewards || enableBuy) {
      const btnTitle = unclaimedRewards || intl.formatMessage({ id: `wallet.${id}.buy` });

      return (
        <ClaimButton
          title={btnTitle}
          isLoading={isLoading}
          isClaiming={isClaiming}
          isClaimExpected={claimExpected}
          containerStyle={id !== ASSET_IDS.ECENCY && styles.claimContainer}
          onPress={_onClaimPress}
        />
      );
    }
  };

  const _renderBoostAccount = () => {
    if (id === ASSET_IDS.HP && ownedTokens < 50) {
      return (
        <ClaimButton
          title={intl.formatMessage({ id: 'wallet.get_boost' })}
          onPress={onBoostAccountPress}
        />
      );
    }
  };

  const _renderGraph = () => {
    if (!chartData.length) {
      return null;
    }
    const _baseWidth = getWindowDimensions().width - 32;
    return (
      <View style={styles.chartContainer}>
        <SimpleChart
          data={chartData.slice(0, 24)}
          baseWidth={_baseWidth}
          showLine={false}
          chartHeight={60}
        />
      </View>
    );
  };

  const _renderFooter =
    chartData.length > 0 ? (
      <View style={styles.cardFooter}>
        <Text style={styles.textCurValue}>{`${currencySymbol} ${currentValue.toFixed(2)}`}</Text>
        <Text style={changePercent > 0 ? styles.textDiffPositive : styles.textDiffNegative}>{`${
          changePercent >= 0 ? '+' : ''
        }${changePercent.toFixed(1)}%`}</Text>
      </View>
    ) : (
      <View style={{ height: 12 }} />
    );

  return (
    <TouchableOpacity onPress={onCardPress}>
      <View style={styles.cardContainer}>
        {_renderHeader}
        {_renderBoostAccount()}
        {_renderClaimSection()}
        {!notCrypto && _renderGraph()}
        {!notCrypto ? _renderFooter : <View style={{ height: 12 }} />}
        {footerComponent && footerComponent}
      </View>
    </TouchableOpacity>
  );
};
