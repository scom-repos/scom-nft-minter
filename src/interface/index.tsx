import { BigNumber, IClientSideProvider } from "@ijstech/eth-wallet";
import { ITokenObject } from "@scom/scom-token-list";

export interface ICommissionInfo {
  chainId: number;
  walletAddress: string;
  share: string;
}
export enum ProductType {
  Buy = "Buy",
  DonateToOwner = "DonateToOwner",
  DonateToEveryone = "DonateToEveryone",

  OswapTroll = "OswapTroll" // 721
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
  productId?: number;
  donateTo?: string;
  logoUrl?: string;
  description?: string;
  link?: string;
  commissions?: ICommissionInfo[];
  chainSpecificProperties?: Record<number, IChainSpecificProperties>;
  defaultChainId: number;
  wallets: IWalletPlugin[];
  networks: any[];
  showHeader?: boolean;
  requiredQuantity?: number;
}

export interface IWalletPlugin {
  name: string;
  packageName?: string;
  provider?: IClientSideProvider;
}

export interface INetworkConfig {
  chainName?: string;
  chainId: number;
}