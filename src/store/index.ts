import { application } from "@ijstech/components";
import { Wallet } from "@ijstech/eth-wallet";
import { isWalletConnected } from "../wallet/index";
import { tokenStore } from '@scom/scom-token-list'
import getNetworkList from '@scom/scom-network-list'

export const enum EventId {
  ConnectWallet = 'connectWallet',
  IsWalletConnected = 'isWalletConnected',
  IsWalletDisconnected = 'IsWalletDisconnected',
  chainChanged = 'chainChanged'
}

export enum WalletPlugin {
  MetaMask = 'metamask',
  WalletConnect = 'walletconnect',
}

export interface INetwork {
  chainId: number;
  name: string;
  img?: string;
  rpc?: string;
	symbol?: string;
	env?: string;
  explorerName?: string;
  explorerTxUrl?: string;
  explorerAddressUrl?: string;
  isDisabled?: boolean;
};

export const SupportedNetworks: INetwork[] = [
  {
    name: "BSC Testnet",
    chainId: 97,
    img: "bsc"
  },
  {
    name: "Avalanche FUJI C-Chain",
    chainId: 43113,
    img: "avax"
  }
];

export const getNetworkName = (chainId: number) => {
  return SupportedNetworks.find(v => v.chainId === chainId)?.name || ""
}

export interface IContractDetailInfo {
  address: string;
}

export type ContractType = 'ProductInfo' | 'Proxy';

export interface IContractInfo {
  ProductNFT: IContractDetailInfo;
  ProductInfo: IContractDetailInfo;
  Proxy: IContractDetailInfo;
}

export type ContractInfoByChainType = { [key: number]: IContractInfo };

export const state = {
  contractInfoByChain: {} as ContractInfoByChainType,
  ipfsGatewayUrl: "",
  embedderCommissionFee: "0"
}

export const setDataFromSCConfig = (options: any) => {
  if (options.contractInfo) {
    setContractInfo(options.contractInfo);
  }
  if (options.ipfsGatewayUrl) {
    setIPFSGatewayUrl(options.ipfsGatewayUrl);
  }
  if (options.embedderCommissionFee) {
    setEmbedderCommissionFee(options.embedderCommissionFee);
  }
}

const setContractInfo = (data: ContractInfoByChainType) => {
  state.contractInfoByChain = data;
}

const getContractInfo = (chainId: number) => {
  return state.contractInfoByChain[chainId];
}

export const setIPFSGatewayUrl = (url: string) => {
  state.ipfsGatewayUrl = url;
}

export const getIPFSGatewayUrl = () => {
  return state.ipfsGatewayUrl;
}

const setEmbedderCommissionFee = (fee: string) => {
  state.embedderCommissionFee = fee;
}

export const getEmbedderCommissionFee = () => {
  return state.embedderCommissionFee;
}

export const getContractAddress = (type: ContractType) => {
  const chainId = Wallet.getInstance().chainId;
  const contracts = getContractInfo(chainId) || {};
  return contracts[type]?.address;
}

export async function switchNetwork(chainId: number) {
  if (!isWalletConnected()) {
    application.EventBus.dispatch(EventId.chainChanged, chainId);
    return;
  }
  const wallet = Wallet.getClientInstance();
  if (wallet?.clientSideProvider?.name === WalletPlugin.MetaMask) {
    await wallet.switchNetwork(chainId);
  }
}

export const getToken = (chainId: number, address: string) => {
  const tokenList = tokenStore.getTokenList(chainId)
  return tokenList?.find(t => t.address?.toLowerCase() === address.toLowerCase());
}

export const getNetworkInfo = (chainId: number) => {
  const defaultNetworks = getNetworkList() || [];
  return defaultNetworks.find(v => v.chainId === chainId);
}
