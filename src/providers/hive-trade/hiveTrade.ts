import { PrivateKey } from '@esteemapp/dhive';
import { getAnyPrivateKey, getDigitPinCode, sendHiveOperations } from '../hive/dhive';
import { MarketAsset, OrderIdPrefix, SwapOptions, TransactionType } from './hiveTrade.types';
import { formatNumber } from '../../utils/number';
import bugsnapInstance from '../../config/bugsnag';
import { Operation } from '@hiveio/dhive';


//This operation creates a limit order and matches it against existing open orders. 
//The maximum expiration time for any limit order is 28 days from head_block_time()
export const limitOrderCreate = (
    currentAccount: any,
    pinHash: string,
    amountToSell: number,
    minToReceive: number,
    orderType: TransactionType,
    idPrefix = OrderIdPrefix.EMPTY) => {


    const digitPinCode = getDigitPinCode(pinHash);
    const key = getAnyPrivateKey(
        {
            activeKey: currentAccount?.local?.activeKey,
        },
        digitPinCode,
    );

    if (key) {
        const privateKey = PrivateKey.fromString(key);

        let expiration: any = new Date(Date.now());
        expiration.setDate(expiration.getDate() + 27);
        expiration = expiration.toISOString().split(".")[0];

        const args: Operation[] = [
            [
                'limit_order_create',
                {
                    owner: currentAccount.username,
                    orderid: Number(
                        `${idPrefix}${Math.floor(Date.now() / 1000)
                            .toString()
                            .slice(2)}`
                    ),
                    amount_to_sell: `${orderType === TransactionType.Buy
                        ? formatNumber(amountToSell, 3)
                        : formatNumber(minToReceive, 3)
                        } ${orderType === TransactionType.Buy ? MarketAsset.HBD : MarketAsset.HIVE}`,
                    min_to_receive: `${orderType === TransactionType.Buy
                        ? formatNumber(minToReceive, 3)
                        : formatNumber(amountToSell, 3)
                        } ${orderType === TransactionType.Buy ? MarketAsset.HIVE : MarketAsset.HBD}`,
                    fill_or_kill: false,
                    expiration: expiration
                },
            ],
        ];

        return new Promise((resolve, reject) => {
            sendHiveOperations(args, privateKey)
                .then((result) => {
                    if (result) {
                        resolve(result);
                    }
                })
                .catch((err) => {
                    bugsnapInstance.notify(err);
                    reject(err);
                });
        });
    }

    return Promise.reject(
        new Error('Check private key permission! Required private active key or above.'),
    );
};



export const swapToken = async (
    currentAccount: any,
    pinHash: string,
    data: SwapOptions) => {

    try {
        let amountToSell = 0;
        let minToRecieve = 0;
        let transactionType = TransactionType.None;

        switch (data.fromAsset) {
            case MarketAsset.HIVE:
                amountToSell = data.toAmount
                minToRecieve = data.fromAmount
                transactionType = TransactionType.Sell
                break;
            case MarketAsset.HBD:
                amountToSell = data.fromAmount
                minToRecieve = data.toAmount
                transactionType = TransactionType.Buy
                break;
        }

        await limitOrderCreate(
            currentAccount,
            pinHash,
            amountToSell,
            minToRecieve,
            transactionType,
            OrderIdPrefix.SWAP
        )
    }
    catch (err) {
        console.warn("Failed to swap token", err)
        throw err;
    }
}