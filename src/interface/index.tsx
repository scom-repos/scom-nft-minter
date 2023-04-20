import { BigNumber, IClientSideProvider } from "@ijstech/eth-wallet";

export interface PageBlock {
  // Properties
  getData: () => any;
  setData: (data: any) => Promise<void>;
  getTag: () => any;
  setTag: (tag: any) => Promise<void>
  defaultEdit?: boolean;
  tag?: any;

  // Page Events
  readonly onEdit: () => Promise<void>;
  readonly onConfirm: () => Promise<void>;
}

export interface ICommissionInfo {
  chainId: number;
  walletAddress: string;
  share: string;
}
export enum ProductType {
  Buy = "Buy",
  DonateToOwner = "DonateToOwner",
  DonateToEveryone = "DonateToEveryone"
}

export interface IProductInfo {
  productType: BigNumber;
  productId: BigNumber;
  uri: string;
  quantity: BigNumber;
  price: BigNumber;
  maxQuantity: BigNumber;
  maxPrice: BigNumber;
  token: ITokenObject;
  status: BigNumber;
}

export interface IChainSpecificProperties {
  productId: number;
  donateTo: string;
}

export interface IEmbedData {
  name?: string;
  title?: string;
  productType?: ProductType;
  logo?: string;
  description?: string;
  link?: string;
  commissions?: ICommissionInfo[];
  chainSpecificProperties?: Record<number, IChainSpecificProperties>;
  wallets: IWalletPlugin[];
  networks: any[];
}

export interface ITokenObject {
  address?: string;
  name: string;
  decimals: number;
  symbol: string;
  status?: boolean | null;
  logoURI?: string;
  isCommon?: boolean | null;
  balance?: string | number;
  isNative?: boolean | null;
  isWETH?: boolean | null;
  isNew?: boolean | null;
};

export interface IWalletPlugin {
  name: string;
  packageName?: string;
  provider?: IClientSideProvider;
}
