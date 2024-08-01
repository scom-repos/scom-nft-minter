import { BigNumber } from '@ijstech/eth-wallet';
import { Contracts as ProductContracts } from '@scom/scom-product-contract';
import { State } from "../store/index";
import { FormatUtils } from '@ijstech/components';

export const formatNumber = (value: number | string | BigNumber, decimalFigures?: number) => {
  if (typeof value === 'object') {
    value = value.toFixed();
  }
  const minValue = '0.0000001';
  return FormatUtils.formatNumber(value, {decimalFigures: decimalFigures !== undefined ? decimalFigures : 4, minValue});
};

export async function getProxySelectors(state: State, chainId: number): Promise<string[]> {
  const wallet = state.getRpcWallet();
  await wallet.init();
  if (wallet.chainId != chainId) await wallet.switchNetwork(chainId);
  let productInfoAddress = state.getContractAddress('ProductInfo');
  let contract = new ProductContracts.ProductInfo(wallet, productInfoAddress);
  let permittedProxyFunctions: (keyof ProductContracts.ProductInfo)[] = [
    "buy",
    "buyEth",
    "donate",
    "donateEth"
  ];
  let selectors = permittedProxyFunctions
    .map(e => e + "(" + contract._abi.filter(f => f.name == e)[0].inputs.map(f => f.type).join(',') + ")")
    .map(e => wallet.soliditySha3(e).substring(0, 10))
    .map(e => contract.address.toLowerCase() + e.replace("0x", ""));
  return selectors;
}

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export {
  getERC20Amount,
  getTokenBalance,
  registerSendTxEvents
} from './token';