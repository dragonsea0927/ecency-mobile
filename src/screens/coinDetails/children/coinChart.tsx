import React, { useState, useEffect } from 'react'
import { View, Dimensions } from 'react-native'
import { RangeSelector } from '.';
import { SimpleChart } from '../../../components'
import { useAppSelector } from '../../../hooks';
import { fetchMarketChart } from '../../../providers/coingecko/coingecko';
import styles, { CHART_NEGATIVE_MARGIN } from './children.styles';


interface CoinChartProps {
  coinId:string;
}

export const CoinChart = ({coinId}:CoinChartProps) => {

  const priceHistory = useAppSelector(state=>state.wallet.priceHistories[coinId]);

  const [range, setRange] = useState(1);
  const [chartData, setChartData] = useState(priceHistory?.data);

  const _fetchMarketData = async (days:number) => {
    const marketData = await fetchMarketChart(coinId, 'usd', days, 'hourly') 
    setChartData(marketData.prices.map(item=>item.yValue));
  }


  const _onRangeChange = (range) => {
    setRange(range);
    _fetchMarketData(range);
  }

    const _renderGraph = () => {
        const _baseWidth = Dimensions.get("window").width - 32 + CHART_NEGATIVE_MARGIN;
        return (
          <View style={styles.chartContainer}>
            <SimpleChart 
                data={chartData || []}
                baseWidth={_baseWidth} // from react-native
                chartHeight={200}
                showLine={true}
                showLabels={true}
              />
          </View>
      )}
    return (
      <>
        <View style={styles.card}>
            {_renderGraph()}
        </View>
        <RangeSelector range={range} onRangeChange={_onRangeChange} />
      </>
    )
}