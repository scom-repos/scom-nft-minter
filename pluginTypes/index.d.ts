/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-commission-proxy-contract/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-dapp-container/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-token-input/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-token-input/@scom/scom-token-modal/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@ijstech/eth-contract/index.d.ts" />
/// <reference path="@scom/scom-dex-list/index.d.ts" />
/// <amd-module name="@scom/scom-nft-minter/interface/index.tsx" />
declare module "@scom/scom-nft-minter/interface/index.tsx" {
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
        logoUrl?: string;
        description?: string;
        link?: string;
        commissions?: ICommissionInfo[];
        chainSpecificProperties?: Record<number, IChainSpecificProperties>;
        defaultChainId: number;
        wallets: IWalletPlugin[];
        networks: any[];
        showHeader?: boolean;
        providers: IProviderUI[];
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
    export interface IProviderUI {
        key: string;
        chainId: number;
    }
}
/// <amd-module name="@scom/scom-nft-minter/store/index.ts" />
declare module "@scom/scom-nft-minter/store/index.ts" {
    import { ERC20ApprovalModel, IERC20ApprovalEventOptions } from "@ijstech/eth-wallet";
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
    export type ContractInfoByChainType = {
        [key: number]: IContractInfo;
    };
    export class State {
        dexInfoList: IDexInfo[];
        contractInfoByChain: ContractInfoByChainType;
        embedderCommissionFee: string;
        rpcWalletId: string;
        approvalModel: ERC20ApprovalModel;
        constructor(options: any);
        private initData;
        initRpcWallet(defaultChainId: number): string;
        setDexInfoList(value: IDexInfo[]): void;
        getDexInfoList(options?: {
            key?: string;
            chainId?: number;
        }): IDexInfo[];
        getDexDetail(key: string, chainId: number): IDexDetail;
        getContractAddress(type: ContractType): any;
        getRpcWallet(): import("@ijstech/eth-wallet").IRpcWallet;
        isRpcWalletConnected(): boolean;
        getChainId(): number;
        setApprovalModelAction(options: IERC20ApprovalEventOptions): Promise<import("@ijstech/eth-wallet").IERC20ApprovalAction>;
    }
    export function getClientWallet(): import("@ijstech/eth-wallet").IClientWallet;
    export function isClientWalletConnected(): boolean;
}
/// <amd-module name="@scom/scom-nft-minter/utils/token.ts" />
declare module "@scom/scom-nft-minter/utils/token.ts" {
    import { BigNumber, IWallet, ISendTxEventsOptions } from "@ijstech/eth-wallet";
    import { ITokenObject } from "@scom/scom-token-list";
    export const getERC20Amount: (wallet: IWallet, tokenAddress: string, decimals: number) => Promise<BigNumber>;
    export const getTokenBalance: (wallet: IWallet, token: ITokenObject) => Promise<BigNumber>;
    export const registerSendTxEvents: (sendTxEventHandlers: ISendTxEventsOptions) => void;
}
/// <amd-module name="@scom/scom-nft-minter/utils/index.ts" />
declare module "@scom/scom-nft-minter/utils/index.ts" {
    import { BigNumber } from '@ijstech/eth-wallet';
    import { ITokenObject } from '@scom/scom-token-list';
    import { State } from "@scom/scom-nft-minter/store/index.ts";
    import { IProviderUI } from "@scom/scom-nft-minter/interface/index.tsx";
    export const formatNumber: (value: string | number | BigNumber, decimals?: number) => string;
    export const getProviderProxySelectors: (state: State, providers: IProviderUI[]) => Promise<string[]>;
    export const getPair: (state: State, market: string, tokenA: ITokenObject, tokenB: ITokenObject) => Promise<string>;
    export { getERC20Amount, getTokenBalance, registerSendTxEvents, } from "@scom/scom-nft-minter/utils/token.ts";
}
/// <amd-module name="@scom/scom-nft-minter/index.css.ts" />
declare module "@scom/scom-nft-minter/index.css.ts" {
    export const imageStyle: string;
    export const markdownStyle: string;
    export const inputStyle: string;
    export const inputGroupStyle: string;
    export const tokenSelectionStyle: string;
}
/// <amd-module name="@scom/scom-nft-minter/API.ts" />
declare module "@scom/scom-nft-minter/API.ts" {
    import { BigNumber } from '@ijstech/eth-wallet';
    import { ProductType, ICommissionInfo } from "@scom/scom-nft-minter/interface/index.tsx";
    import { ITokenObject } from '@scom/scom-token-list';
    import { State } from "@scom/scom-nft-minter/store/index.ts";
    function getProductInfo(state: State, productId: number): Promise<{
        token: any;
        productType: BigNumber;
        productId: BigNumber;
        uri: string;
        quantity: BigNumber;
        price: BigNumber;
        maxQuantity: BigNumber;
        maxPrice: BigNumber;
        status: BigNumber;
    }>;
    function newProduct(state: State, productType: ProductType, qty: number, maxQty: number, price: string, maxPrice: string, token?: ITokenObject, callback?: any, confirmationCallback?: any): Promise<{
        receipt: import("@ijstech/eth-contract").TransactionReceipt;
        productId: any;
    }>;
    function getProxyTokenAmountIn(productPrice: string, quantity: number, commissions: ICommissionInfo[]): string;
    function buyProduct(state: State, productId: number, quantity: number, commissions: ICommissionInfo[], token: ITokenObject, callback?: any, confirmationCallback?: any): Promise<any>;
    function donate(state: State, productId: number, donateTo: string, amountIn: string, commissions: ICommissionInfo[], token: ITokenObject, callback?: any, confirmationCallback?: any): Promise<any>;
    export { getProductInfo, newProduct, getProxyTokenAmountIn, buyProduct, donate };
}
/// <amd-module name="@scom/scom-nft-minter/data.json.ts" />
declare module "@scom/scom-nft-minter/data.json.ts" {
    const _default: {
        contractInfo: {
            "43113": {
                ProductNFT: {
                    address: string;
                };
                ProductInfo: {
                    address: string;
                };
                Proxy: {
                    address: string;
                };
            };
            "97": {
                ProductNFT: {
                    address: string;
                };
                ProductInfo: {
                    address: string;
                };
                Proxy: {
                    address: string;
                };
            };
        };
        embedderCommissionFee: string;
        defaultBuilderData: {
            defaultChainId: number;
            networks: {
                chainId: number;
            }[];
            wallets: {
                name: string;
            }[];
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-nft-minter/formSchema.json.ts" />
declare module "@scom/scom-nft-minter/formSchema.json.ts" {
    const _default_1: {
        dataSchema: {
            type: string;
            properties: {
                title: {
                    type: string;
                };
                description: {
                    type: string;
                    format: string;
                };
                logo: {
                    type: string;
                    format: string;
                };
                logoUrl: {
                    type: string;
                    title: string;
                };
                link: {
                    type: string;
                };
                dark: {
                    type: string;
                    properties: {
                        backgroundColor: {
                            type: string;
                            format: string;
                        };
                        fontColor: {
                            type: string;
                            format: string;
                        };
                        inputBackgroundColor: {
                            type: string;
                            format: string;
                        };
                        inputFontColor: {
                            type: string;
                            format: string;
                        };
                    };
                };
                light: {
                    type: string;
                    properties: {
                        backgroundColor: {
                            type: string;
                            format: string;
                        };
                        fontColor: {
                            type: string;
                            format: string;
                        };
                        inputBackgroundColor: {
                            type: string;
                            format: string;
                        };
                        inputFontColor: {
                            type: string;
                            format: string;
                        };
                    };
                };
            };
        };
        uiSchema: {
            type: string;
            elements: ({
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: {
                        type: string;
                        scope: string;
                    }[];
                }[];
            } | {
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: {
                        type: string;
                        label: string;
                        scope: string;
                    }[];
                }[];
            })[];
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-nft-minter" />
declare module "@scom/scom-nft-minter" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IChainSpecificProperties, IEmbedData, INetworkConfig, IProviderUI, IWalletPlugin, ProductType } from "@scom/scom-nft-minter/interface/index.tsx";
    import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
    import { ITokenObject } from '@scom/scom-token-list';
    interface ScomNftMinterElement extends ControlElement {
        lazyLoad?: boolean;
        name?: string;
        title?: string;
        productType?: string;
        description?: string;
        logo?: string;
        logoUrl?: string;
        link?: string;
        chainSpecificProperties?: Record<number, IChainSpecificProperties>;
        defaultChainId: number;
        wallets: IWalletPlugin[];
        networks: INetworkConfig[];
        showHeader?: boolean;
        providers: IProviderUI[];
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-nft-minter"]: ScomNftMinterElement;
            }
        }
    }
    export default class ScomNftMinter extends Module {
        private state;
        private gridDApp;
        private imgLogo;
        private markdownViewer;
        private pnlLink;
        private lblLink;
        private lblTitle;
        private pnlMintFee;
        private lblMintFee;
        private pnlSpotsRemaining;
        private lblSpotsRemaining;
        private pnlMaxQty;
        private lblMaxQty;
        private lblYouPay;
        private pnlQty;
        private edtQty;
        private lblBalance;
        private btnSubmit;
        private btnApprove;
        private lblRef;
        private lblAddress;
        private gridTokenInput;
        private tokenInput;
        private txStatusModal;
        private lbOrderTotal;
        private lbOrderTotalTitle;
        private iconOrderTotal;
        private pnlInputFields;
        private pnlUnsupportedNetwork;
        private containerDapp;
        private mdWallet;
        private productInfo;
        private _type;
        private _data;
        private approvalModelAction;
        private isApproving;
        private tokenAmountIn;
        tag: any;
        defaultEdit: boolean;
        private contractAddress;
        private rpcWalletEvents;
        constructor(parent?: Container, options?: ScomNftMinterElement);
        removeRpcWalletEvents(): void;
        onHide(): void;
        static create(options?: ScomNftMinterElement, parent?: Container): Promise<ScomNftMinter>;
        private get chainId();
        private get rpcWallet();
        get donateTo(): string;
        get link(): string;
        set link(value: string);
        get productId(): number;
        get productType(): ProductType;
        set productType(value: ProductType);
        get name(): string;
        set name(value: string);
        get description(): string;
        set description(value: string);
        get logo(): string;
        set logo(value: string);
        get logoUrl(): string;
        set logoUrl(value: string);
        get commissions(): any;
        set commissions(value: any);
        get chainSpecificProperties(): any;
        set chainSpecificProperties(value: any);
        get wallets(): IWalletPlugin[];
        set wallets(value: IWalletPlugin[]);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        get showHeader(): boolean;
        set showHeader(value: boolean);
        get defaultChainId(): number;
        set defaultChainId(value: number);
        private onChainChanged;
        private updateTokenBalance;
        private onSetupPage;
        private getBuilderActions;
        private getProjectOwnerActions;
        getConfigurators(): ({
            name: string;
            target: string;
            getProxySelectors: () => Promise<string[]>;
            getDexProviderOptions: (chainId: number) => import("@scom/scom-dex-list").IDexInfo[];
            getPair: (market: string, tokenA: ITokenObject, tokenB: ITokenObject) => Promise<string>;
            getActions: () => any[];
            getData: any;
            setData: (data: IEmbedData) => Promise<void>;
            getTag: any;
            setTag: any;
            elementName?: undefined;
            getLinkParams?: undefined;
            setLinkParams?: undefined;
            bindOnChanged?: undefined;
        } | {
            name: string;
            target: string;
            getActions: (category?: string) => any;
            getData: any;
            setData: (data: IEmbedData) => Promise<void>;
            getTag: any;
            setTag: any;
            getProxySelectors?: undefined;
            getDexProviderOptions?: undefined;
            getPair?: undefined;
            elementName?: undefined;
            getLinkParams?: undefined;
            setLinkParams?: undefined;
            bindOnChanged?: undefined;
        } | {
            name: string;
            target: string;
            elementName: string;
            getLinkParams: () => {
                data: string;
            };
            setLinkParams: (params: any) => Promise<void>;
            bindOnChanged: (element: ScomCommissionFeeSetup, callback: (data: any) => Promise<void>) => void;
            getData: () => {
                fee: string;
                name?: string;
                title?: string;
                productType?: ProductType;
                logo?: string;
                logoUrl?: string;
                description?: string;
                link?: string;
                commissions?: import("@scom/scom-nft-minter/interface/index.tsx").ICommissionInfo[];
                chainSpecificProperties?: Record<number, IChainSpecificProperties>;
                defaultChainId: number;
                wallets: IWalletPlugin[];
                networks: any[];
                showHeader?: boolean;
                providers: IProviderUI[];
            };
            setData: any;
            getTag: any;
            setTag: any;
            getProxySelectors?: undefined;
            getDexProviderOptions?: undefined;
            getPair?: undefined;
            getActions?: undefined;
        })[];
        private getData;
        private resetRpcWallet;
        private setData;
        private getTag;
        private updateTag;
        private setTag;
        private updateStyle;
        private updateTheme;
        private initWallet;
        private updateDAppUI;
        private refreshDApp;
        private updateSpotsRemaining;
        private showTxStatusModal;
        private initApprovalAction;
        private updateContractAddress;
        private selectToken;
        private updateSubmitButton;
        private determineBtnSubmitCaption;
        private onApprove;
        private onQtyChanged;
        private onAmountChanged;
        private doSubmitAction;
        private onSubmit;
        private buyToken;
        init(): Promise<void>;
        render(): any;
    }
}
