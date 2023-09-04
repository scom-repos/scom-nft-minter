import { application } from "@ijstech/components";
import { ERC20ApprovalModel, IERC20ApprovalEventOptions, INetwork, Wallet } from "@ijstech/eth-wallet";
import { IDexDetail, IDexInfo } from '@scom/scom-dex-list';
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
  dexInfoList: IDexInfo[] = [];
  contractInfoByChain: ContractInfoByChainType = {};
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

  setDexInfoList(value: IDexInfo[]) {
    this.dexInfoList = value;
  }

  getDexInfoList(options?: { key?: string, chainId?: number }) {
    if (!options) return this.dexInfoList;
    const { key, chainId } = options;
    let dexList = this.dexInfoList;
    if (key) {
      dexList = dexList.filter(v => v.dexCode === key);
    }
    if (chainId) {
      dexList = dexList.filter(v => v.details.some(d => d.chainId === chainId));
    }
    return dexList;
  }

  getDexDetail(key: string, chainId: number) {
    for (const dex of this.dexInfoList) {
      if (dex.dexCode === key) {
        const dexDetail: IDexDetail = dex.details.find(v => v.chainId === chainId);
        if (dexDetail) {
          return dexDetail;
        }
      }
    }
    return undefined;
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
