export interface PageBlock {
  // Properties
  getData: () => any;
  setData: (data: any) => Promise<void>;
  getTag: () => any;
  setTag: (tag: any) => Promise<void>
  validate?: () => boolean;
  defaultEdit?: boolean;
  tag?: any;

  // Page Events
  readonly onEdit: () => Promise<void>;
  readonly onConfirm: () => Promise<void>;
  readonly onDiscard: () => Promise<void>;
  // onClear: () => void;

  // Page Block Events
  edit: () => Promise<void>;
  preview: () => Promise<void>;
  confirm: () => Promise<void>;
  discard: () => Promise<void>;
  config: () => Promise<void>;
}

export interface ICommissionInfo {
  walletAddress: string;
  share: string;
}

export enum ProductType {
  Buy = "Buy",
  DonateToOwner = "DonateToOwner",
  DonateToEveryone = "DonateToEveryone"
}

export interface IConfig {
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