interface WalletTokenBase {
    id:string,
    coingeckoId:string,
    tokenName:string,
    tokenSymbol:string,
    notCryptoToken:boolean,
}

const WALLET_TOKENS = [{
    id:'Ecency', 
    coingeckoId:'ecency',
    tokenName:'Ecency Points', 
    tokenSymbol:'Points',
    notCryptoToken:true
},{
    id:'Hive',
    coingeckoId:'hive',
    tokenName:'Hive Token',
    tokenSymbol:'Hive',
    notCryptoToken:false
},{ 
    id:'HBD',
    coingeckoId:'hive_dollar',
    tokenName:'Hive Dollar',
    tokenSymbol:'HBD',
    notCryptoToken:false
}] as WalletTokenBase[]


export default WALLET_TOKENS