import { application } from "@ijstech/components";
import { ERC20ApprovalModel, IERC20ApprovalEventOptions, INetwork, Wallet } from "@ijstech/eth-wallet";
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

export class State {
  contractInfoByChain: ContractInfoByChainType = {};
  ipfsGatewayUrl: string = '';
  embedderCommissionFee: string = '0';
  rpcWalletId: string = '';
  approvalModel: ERC20ApprovalModel;

  constructor(options: any) {
    this.initData(options);
  }

  private initData(options: any) {
    if (options.contractInfo) {
      this.contractInfoByChain = options.contractInfo;
    }
    if (options.ipfsGatewayUrl) {
      this.ipfsGatewayUrl = options.ipfsGatewayUrl;
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
