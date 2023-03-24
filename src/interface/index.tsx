import { BigNumber } from "@ijstech/eth-wallet";

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

export interface IEmbedData {
  name?: string;
  productType?: ProductType;
  donateTo?: string;
  productId?: number;
  logo?: string;
  description?: string;
  hideDescription?: boolean;
  link?: string;
  chainId?: number;
  token?: ITokenObject;
  price?: string;
  maxPrice?: string;
  maxOrderQty?: number;
  qty?: number;
  commissions?: ICommissionInfo[];
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