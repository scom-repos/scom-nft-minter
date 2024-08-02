/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-commission-proxy-contract/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-dapp-container/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@ijstech/eth-contract/index.d.ts" />
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
        nftType?: 'ERC721' | 'ERC1155' | 'ERC1155NewIndex';
        chainId?: number;
        nftAddress?: string;
        productType?: ProductType;
        productId?: number;
        tokenToMint?: string;
        priceToMint?: number;
        maxQty?: number;
        txnMaxQty?: number;
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
}
/// <amd-module name="@scom/scom-nft-minter/store/index.ts" />
declare module "@scom/scom-nft-minter/store/index.ts" {
    import { ERC20ApprovalModel, IERC20ApprovalEventOptions, INetwork } from "@ijstech/eth-wallet";
    export interface IContractDetailInfo {
        address: string;
    }
    export type ContractType = 'ProductInfo' | 'Proxy' | 'Product1155';
    export interface IContractInfo {
        ProductNFT: IContractDetailInfo;
        ProductInfo: IContractDetailInfo;
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
    }
    export type ContractInfoByChainType = {
        [key: number]: IContractInfo;
    };
    export class State {
        contractInfoByChain: ContractInfoByChainType;
        embedderCommissionFee: string;
        rpcWalletId: string;
        approvalModel: ERC20ApprovalModel;
        networkMap: {
            [key: number]: IExtendedNetwork;
        };
        infuraId: string;
        constructor(options: any);
        private initData;
        initRpcWallet(defaultChainId: number): string;
        getContractAddress(type: ContractType): any;
        getRpcWallet(): import("@ijstech/eth-wallet").IRpcWallet;
        isRpcWalletConnected(): boolean;
        getNetworkInfo: (chainId: number) => IExtendedNetwork;
        getExplorerByAddress: (chainId: number, address: string) => string;
        viewExplorerByAddress: (chainId: number, address: string) => void;
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
    import { State } from "@scom/scom-nft-minter/store/index.ts";
    export const formatNumber: (value: number | string | BigNumber, decimalFigures?: number) => string;
    export function getProxySelectors(state: State, chainId: number): Promise<string[]>;
    export const delay: (ms: number) => Promise<unknown>;
    export { getERC20Amount, getTokenBalance, registerSendTxEvents } from "@scom/scom-nft-minter/utils/token.ts";
}
/// <amd-module name="@scom/scom-nft-minter/index.css.ts" />
declare module "@scom/scom-nft-minter/index.css.ts" {
    export const markdownStyle: string;
    export const inputStyle: string;
    export const tokenSelectionStyle: string;
    export const linkStyle: string;
}
/// <amd-module name="@scom/scom-nft-minter/API.ts" />
declare module "@scom/scom-nft-minter/API.ts" {
    import { BigNumber } from '@ijstech/eth-wallet';
    import { ProductType, ICommissionInfo } from "@scom/scom-nft-minter/interface/index.tsx";
    import { ITokenObject } from '@scom/scom-token-list';
    import { State } from "@scom/scom-nft-minter/store/index.ts";
    function getProductInfo(state: State, erc1155Index: number): Promise<{
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
    function getNFTBalance(state: State, erc1155Index: number): Promise<string>;
    function newProduct(productInfoAddress: string, productType: ProductType, qty: number, // max quantity of this nft can be exist at anytime
    maxQty: number, // max quantity for one buy() txn
    price: string, maxPrice: string, //for donation only, no max price when it is 0
    tokenAddress: string, //Native token 0x0000000000000000000000000000000000000000
    tokenDecimals: number, callback?: any, confirmationCallback?: any): Promise<{
        receipt: import("@ijstech/eth-contract").TransactionReceipt;
        productId: any;
    }>;
    function newDefaultBuyProduct(productInfoAddress: string, qty: number, // max quantity of this nft can be exist at anytime
    price: string, tokenAddress: string, tokenDecimals: number, callback?: any, confirmationCallback?: any): Promise<{
        receipt: import("@ijstech/eth-contract").TransactionReceipt;
        productId: any;
    }>;
    function getProxyTokenAmountIn(productPrice: string, quantity: number, commissions: ICommissionInfo[]): string;
    function buyProduct(state: State, productId: number, quantity: number, commissions: ICommissionInfo[], token: ITokenObject, callback?: any, confirmationCallback?: any): Promise<any>;
    function donate(state: State, productId: number, donateTo: string, amountIn: string, commissions: ICommissionInfo[], token: ITokenObject, callback?: any, confirmationCallback?: any): Promise<any>;
    function fetchUserNftBalance(state: State, address: string): Promise<string>;
    function mintOswapTrollNft(address: string, callback: (err: Error, receipt?: string) => void): Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    function fetchOswapTrollNftInfo(state: State, address: string): Promise<{
        cap: BigNumber;
        price: BigNumber;
        tokenAddress: string;
    }>;
    export { getProductInfo, getNFTBalance, newProduct, newDefaultBuyProduct, getProxyTokenAmountIn, buyProduct, donate, fetchOswapTrollNftInfo, fetchUserNftBalance, mintOswapTrollNft };
}
/// <amd-module name="@scom/scom-nft-minter/data.json.ts" />
declare module "@scom/scom-nft-minter/data.json.ts" {
    const _default: {
        infuraId: string;
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
                Product1155: {
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
                Product1155: {
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
        default1155NewIndex: {
            chainSpecificProperties: {
                "97": {
                    "": string;
                };
                "43113": {
                    "": string;
                };
            };
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
    import ScomNetworkPicker from "@scom/scom-network-picker";
    export function getBuilderSchema(): {
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
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                scope: string;
                            }[];
                        }[];
                    }[];
                }[];
            } | {
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: {
                        type: string;
                        scope: string;
                    }[];
                }[];
            })[];
        };
    };
    export function getProjectOwnerSchema(isDonation?: boolean): {
        dataSchema: {
            type: string;
            properties: {
                nftType: {
                    type: string;
                    title: string;
                    enum: string[];
                };
                chainId: {
                    type: string;
                    title: string;
                    enum: number[];
                    required: boolean;
                };
                nftAddress: {
                    type: string;
                    title: string;
                };
                erc1155Index: {
                    type: string;
                    title: string;
                    tooltip: string;
                    minimum: number;
                };
                tokenToMint: {
                    type: string;
                    title: string;
                    tooltip: string;
                };
                priceToMint: {
                    type: string;
                    tooltip: string;
                };
                maxQty: {
                    type: string;
                    title: string;
                    tooltip: string;
                    minimum: number;
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
            elements: {
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: ({
                        type: string;
                        scope: string;
                        rule?: undefined;
                    } | {
                        type: string;
                        scope: string;
                        rule: {
                            effect: string;
                            condition: {
                                scope: string;
                                schema: {
                                    const: string;
                                };
                            };
                        };
                    })[];
                }[];
            }[];
        };
        customControls(): {
            '#/properties/chainId': {
                render: () => ScomNetworkPicker;
                getData: (control: ScomNetworkPicker) => number;
                setData: (control: ScomNetworkPicker, value: number) => Promise<void>;
            };
        };
    };
}
/// <amd-module name="@scom/scom-nft-minter" />
declare module "@scom/scom-nft-minter" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IChainSpecificProperties, IEmbedData, INetworkConfig, IWalletPlugin, ProductType } from "@scom/scom-nft-minter/interface/index.tsx";
    import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
    import { ITokenObject } from '@scom/scom-token-list';
    interface ScomNftMinterElement extends ControlElement {
        lazyLoad?: boolean;
        name?: string;
        nftType?: 'ERC721' | 'ERC1155' | 'ERC1155NewIndex';
        chainId?: number;
        nftAddress?: string;
        productId?: number;
        productType?: 'Buy' | 'DonateToOwner' | 'DonateToEveryone';
        tokenToMint?: string;
        priceToMint?: string;
        maxQty?: number;
        txnMaxQty?: number;
        title?: string;
        description?: string;
        logoUrl?: string;
        link?: string;
        chainSpecificProperties?: Record<number, IChainSpecificProperties>;
        defaultChainId: number;
        wallets: IWalletPlugin[];
        networks: INetworkConfig[];
        showHeader?: boolean;
        requiredQuantity?: number;
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
        private imgLogo;
        private markdownViewer;
        private pnlLink;
        private lblLink;
        private lblTitle;
        private pnlMintFee;
        private lblMintFee;
        private lblSpotsRemaining;
        private lbContract;
        private lbToken;
        private lbOwn;
        private lbERC1155Index;
        private pnlTokenInput;
        private pnlQty;
        private edtQty;
        private lblBalance;
        private btnSubmit;
        private btnApprove;
        private pnlAddress;
        private lblRef;
        private lblAddress;
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
        private cap;
        private oswapTrollInfo;
        private detailWrapper;
        private erc1155Wrapper;
        private btnDetail;
        private isCancelCreate;
        constructor(parent?: Container, options?: ScomNftMinterElement);
        removeRpcWalletEvents(): void;
        onHide(): void;
        static create(options?: ScomNftMinterElement, parent?: Container): Promise<ScomNftMinter>;
        private get chainId();
        private get rpcWallet();
        get nftType(): "ERC721" | "ERC1155" | "ERC1155NewIndex";
        get nftAddress(): string;
        get newToken(): ITokenObject;
        get newPrice(): number;
        get newMaxQty(): number;
        get newTxnMaxQty(): number;
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
            getProxySelectors: (chainId: number) => Promise<string[]>;
            getActions: () => any[];
            getData: any;
            setData: (data: IEmbedData) => Promise<void>;
            getTag: any;
            setTag: any;
            setupData?: undefined;
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
            setupData: (data: IEmbedData) => Promise<boolean>;
            getTag: any;
            setTag: any;
            getProxySelectors?: undefined;
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
                nftType?: "ERC721" | "ERC1155" | "ERC1155NewIndex";
                chainId?: number;
                nftAddress?: string;
                productType?: ProductType;
                productId?: number;
                tokenToMint?: string;
                priceToMint?: number;
                maxQty?: number;
                txnMaxQty?: number;
                donateTo?: string;
                logoUrl?: string;
                description?: string;
                link?: string;
                commissions?: import("@scom/scom-nft-minter/interface/index.tsx").ICommissionInfo[];
                chainSpecificProperties?: Record<number, IChainSpecificProperties>;
                defaultChainId: number;
                wallets: IWalletPlugin[];
                networks: any[];
                showHeader?: boolean;
                requiredQuantity?: number;
            };
            setData: any;
            getTag: any;
            setTag: any;
            getProxySelectors?: undefined;
            getActions?: undefined;
            setupData?: undefined;
        } | {
            name: string;
            target: string;
            getActions: (category?: string) => any[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
            getProxySelectors?: undefined;
            setupData?: undefined;
            elementName?: undefined;
            getLinkParams?: undefined;
            setLinkParams?: undefined;
            bindOnChanged?: undefined;
        })[];
        private getData;
        private resetRpcWallet;
        private setData;
        private getTag;
        private updateTag;
        private setTag;
        private updateStyle;
        private updateTheme;
        private newProduct;
        private initWallet;
        private updateDAppUI;
        private refreshDApp;
        private updateSpotsRemaining;
        private onToggleDetail;
        private onViewContract;
        private onViewToken;
        private onCopyContract;
        private onCopyToken;
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
        private mintNft;
        private buyToken;
        init(): Promise<void>;
        render(): any;
    }
}
