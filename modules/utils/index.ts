import { BigNumber, Erc20, Wallet, IWallet } from "@ijstech/eth-wallet";
import { ITokenObject } from "@modules/interface";

export const formatNumber = (value: any, decimals?: number) => {
  let val = value;
  const minValue = '0.0000001';
  if (typeof value === 'string') {
    val = new BigNumber(value).toNumber();
  } else if (typeof value === 'object') {
    val = value.toNumber();
  }
  if (val != 0 && new BigNumber(val).lt(minValue)) {
    return `<${minValue}`;
  }
  return formatNumberWithSeparators(val, decimals || 4);
};

export const formatNumberWithSeparators = (value: number, precision?: number) => {
  if (!value) value = 0;
  if (precision) {
    let outputStr = '';
    if (value >= 1) {
      outputStr = value.toLocaleString('en-US', { maximumFractionDigits: precision });
    }
    else {
      outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
    }

    if (outputStr.length > 18) {
      outputStr = outputStr.substr(0, 18) + '...'
    }
    return outputStr;
  }
  else {
    return value.toLocaleString('en-US');
  }
}

export const getERC20Amount = async (wallet: IWallet, tokenAddress: string, decimals: number) => {
  let erc20 = new Erc20(wallet, tokenAddress, decimals);
  return await erc20.balance;
}

export const getTokenBalance = async (token: ITokenObject) => {
  const wallet = Wallet.getInstance();
  let balance = new BigNumber(0);
  if (!token) return balance;
  if (token.address) {
    balance = await getERC20Amount(wallet, token.address, token.decimals);
  } else {
    balance = await wallet.balance;
  }
  return balance;
}