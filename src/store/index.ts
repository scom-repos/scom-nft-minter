import { application } from "@ijstech/components";
import { ERC20ApprovalModel, IERC20ApprovalEventOptions, INetwork, Wallet } from "@ijstech/eth-wallet";
import getNetworkList from "@scom/scom-network-list";

export * from "./tokens/index";
export interface IContractDetailInfo {
  address: string;
}

export type ContractType = 'ProductMarketplace' | 'OneTimePurchaseNFT' | 'SubscriptionNFTFactory' | 'Proxy';

export interface IContractInfo {
  ProductMarketplace: IContractDetailInfo;
  OneTimePurchaseNFT: IContractDetailInfo;
  SubscriptionNFTFactory: IContractDetailInfo;
  Proxy: IContractDetailInfo;
}

interface IExtendedNetwork extends INetwork {
  shortName?: string;
  isDisabled?: boolean;
  isMainChain?: boolean;
  explorerName?: string;
  explorerTxUrl?: string;
  explorerAddressUrl?: string;
  isTestnet?: boolean;
};

export type ContractInfoByChainType = { [key: number]: IContractInfo };

export class State {
  contractInfoByChain: ContractInfoByChainType = {};
  embedderCommissionFee: string = '0';
  rpcWalletId: string = '';
  approvalModel: ERC20ApprovalModel;
  networkMap = {} as { [key: number]: IExtendedNetwork };
  infuraId: string = '';

  constructor(options: any) {
    this.initData(options);
  }

  private initData(options: any) {
    if (options.infuraId) {
      this.infuraId = options.infuraId;
    }
    if (options.contractInfo) {
      this.contractInfoByChain = options.contractInfo;
    }
    if (options.embedderCommissionFee) {
      this.embedderCommissionFee = options.embedderCommissionFee;
    }
  }

  initRpcWallet(defaultChainId: number) {
    if (this.rpcWalletId) {
      return this.rpcWalletId;
    }
    const clientWallet = Wallet.getClientInstance();
    const networkList: INetwork[] = Object.values(application.store?.networkMap || []);
    const instanceId = clientWallet.initRpcWallet({
      networks: networkList,
      defaultChainId,
      infuraId: application.store?.infuraId,
      multicalls: application.store?.multicalls
    });
    this.rpcWalletId = instanceId;
    if (clientWallet.address) {
      const rpcWallet = Wallet.getRpcWalletInstance(instanceId);
      rpcWallet.address = clientWallet.address;
    }

    const defaultNetworkList = getNetworkList();
    const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
      acc[cur.chainId] = cur;
      return acc;
    }, {});
    // const supportedNetworks = ConfigData.supportedNetworks || [];
    for (let network of networkList) {
      const networkInfo = defaultNetworkMap[network.chainId];
      // const supportedNetwork = supportedNetworks.find(v => v.chainId == network.chainId);
      // if (!networkInfo || !supportedNetwork) continue;
      if (!networkInfo) continue;
      if (this.infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
        for (let i = 0; i < network.rpcUrls.length; i++) {
          network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, this.infuraId);
        }
      }
      this.networkMap[network.chainId] = {
        ...networkInfo,
        ...network
      };
    }
    return instanceId;
  }

  getContractAddress(type: ContractType) {
    const chainId = this.getChainId();
    const contracts = this.contractInfoByChain[chainId] || {};
    return contracts[type]?.address;
  }

  getRpcWallet() {
    return this.rpcWalletId ? Wallet.getRpcWalletInstance(this.rpcWalletId) : null;
  }

  isRpcWalletConnected() {
    const wallet = this.getRpcWallet();
    return wallet?.isConnected;
  }

  getNetworkInfo = (chainId: number) => {
    return this.networkMap[chainId];
  }

  getExplorerByAddress = (chainId: number, address: string) => {
    let network = this.getNetworkInfo(chainId);
    if (network && network.explorerAddressUrl) {
      let url = `${network.explorerAddressUrl}${address}`;
      return `<a href="${url}" style="color: var(--colors-primary-main); margin-block: 2px" target="_blank">${address}</a>`
    }
    return address;
  }

  viewExplorerByAddress = (chainId: number, address: string) => {
    let network = this.getNetworkInfo(chainId);
    if (network && network.explorerAddressUrl) {
      let url = `${network.explorerAddressUrl}${address}`;
      window.open(url);
    }
  }

  getChainId() {
    const rpcWallet = this.getRpcWallet();
    return rpcWallet?.chainId;
  }

  async setApprovalModelAction(options: IERC20ApprovalEventOptions) {
    const approvalOptions = {
      ...options,
      spenderAddress: ''
    };
    let wallet = this.getRpcWallet();
    this.approvalModel = new ERC20ApprovalModel(wallet, approvalOptions);
    let approvalModelAction = this.approvalModel.getAction();
    return approvalModelAction;
  }
}

export function getClientWallet() {
  return Wallet.getClientInstance();
}

export function isClientWalletConnected() {
  const wallet = Wallet.getClientInstance();
  return wallet.isConnected;
}
