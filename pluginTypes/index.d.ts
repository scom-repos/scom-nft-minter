/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-dapp-container/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-commission-proxy-contract/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@ijstech/eth-contract/index.d.ts" />
/// <reference path="@scom/scom-commission-fee-setup/index.d.ts" />
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
        Subscription = "Subscription",
        DonateToOwner = "DonateToOwner",
        DonateToEveryone = "DonateToEveryone"
    }
    export enum PaymentModel {
        OneTimePurchase = "OneTimePurchase",
        Subscription = "Subscription"
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
        nft: string;
        nftId: BigNumber;
        priceDuration: BigNumber;
    }
    export interface IChainSpecificProperties {
        productId: number;
        recipient: string;
    }
    export interface IEmbedData {
        productId?: number;
        name?: string;
        title?: string;
        nftType?: 'ERC721' | 'ERC1155';
        chainId?: number;
        nftAddress?: string;
        productType?: ProductType;
        erc1155Index?: number;
        tokenToMint?: string;
        isCustomMintToken?: boolean;
        customMintToken?: string;
        duration?: number;
        perPeriodPrice?: number;
        oneTimePrice?: number;
        maxQty?: number;
        paymentModel?: PaymentModel;
        durationInDays?: number;
        priceDuration?: number;
        txnMaxQty?: number;
        uri?: string;
        recipient?: string;
        recipients?: string[];
        logoUrl?: string;
        description?: string;
        link?: string;
        discountRuleId?: number;
        commissions?: ICommissionInfo[];
        referrer?: string;
        chainSpecificProperties?: Record<number, IChainSpecificProperties>;
        defaultChainId?: number;
        wallets?: IWalletPlugin[];
        networks?: any[];
        showHeader?: boolean;
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
    export interface IDiscountRule {
        id: number;
        minDuration: BigNumber;
        discountPercentage: number;
        fixedPrice: BigNumber;
        startTime: number;
        endTime: number;
        discountApplication: number;
    }
    export interface IOswapTroll {
        price: BigNumber;
        cap: BigNumber;
        tokenAddress: string;
        token?: ITokenObject;
        nftBalance?: string | number;
    }
}
/// <amd-module name="@scom/scom-nft-minter/store/tokens/mainnet/avalanche.ts" />
declare module "@scom/scom-nft-minter/store/tokens/mainnet/avalanche.ts" {
    export const Tokens_Avalanche: ({
        address: string;
        name: string;
        symbol: string;
        decimals: number;
        isCommon: boolean;
    } | {
        chainId: number;
        address?: string;
        name: string;
        decimals: number;
        symbol: string;
        status?: boolean;
        logoURI?: string;
        isCommon?: boolean;
        balance?: string | number;
        isNative?: boolean;
        isWETH?: boolean;
        isNew?: boolean;
    })[];
}
/// <amd-module name="@scom/scom-nft-minter/store/tokens/mainnet/bsc.ts" />
declare module "@scom/scom-nft-minter/store/tokens/mainnet/bsc.ts" {
    export const Tokens_BSC: ({
        name: string;
        symbol: string;
        address: string;
        decimals: number;
        isCommon: boolean;
    } | {
        chainId: number;
        address?: string;
        name: string;
        decimals: number;
        symbol: string;
        status?: boolean;
        logoURI?: string;
        isCommon?: boolean;
        balance?: string | number;
        isNative?: boolean;
        isWETH?: boolean;
        isNew?: boolean;
    })[];
}
/// <amd-module name="@scom/scom-nft-minter/store/tokens/mainnet/index.ts" />
declare module "@scom/scom-nft-minter/store/tokens/mainnet/index.ts" {
    export { Tokens_Avalanche } from "@scom/scom-nft-minter/store/tokens/mainnet/avalanche.ts";
    export { Tokens_BSC } from "@scom/scom-nft-minter/store/tokens/mainnet/bsc.ts";
}
/// <amd-module name="@scom/scom-nft-minter/store/tokens/testnet/bsc-testnet.ts" />
declare module "@scom/scom-nft-minter/store/tokens/testnet/bsc-testnet.ts" {
    export const Tokens_BSC_Testnet: ({
        name: string;
        address: string;
        symbol: string;
        decimals: number;
        isCommon: boolean;
    } | {
        chainId: number;
        address?: string;
        name: string;
        decimals: number;
        symbol: string;
        status?: boolean;
        logoURI?: string;
        isCommon?: boolean;
        balance?: string | number;
        isNative?: boolean;
        isWETH?: boolean;
        isNew?: boolean;
    })[];
}
/// <amd-module name="@scom/scom-nft-minter/store/tokens/testnet/fuji.ts" />
declare module "@scom/scom-nft-minter/store/tokens/testnet/fuji.ts" {
    export const Tokens_Fuji: ({
        name: string;
        address: string;
        symbol: string;
        decimals: number;
    } | {
        chainId: number;
        address?: string;
        name: string;
        decimals: number;
        symbol: string;
        status?: boolean;
        logoURI?: string;
        isCommon?: boolean;
        balance?: string | number;
        isNative?: boolean;
        isWETH?: boolean;
        isNew?: boolean;
    })[];
}
/// <amd-module name="@scom/scom-nft-minter/store/tokens/testnet/index.ts" />
declare module "@scom/scom-nft-minter/store/tokens/testnet/index.ts" {
    export { Tokens_BSC_Testnet } from "@scom/scom-nft-minter/store/tokens/testnet/bsc-testnet.ts";
    export { Tokens_Fuji } from "@scom/scom-nft-minter/store/tokens/testnet/fuji.ts";
}
/// <amd-module name="@scom/scom-nft-minter/store/tokens/index.ts" />
declare module "@scom/scom-nft-minter/store/tokens/index.ts" {
    import { ITokenObject } from "@scom/scom-token-list";
    const SupportedERC20Tokens: {
        [chainId: number]: ITokenObject[];
    };
    export { SupportedERC20Tokens };
}
/// <amd-module name="@scom/scom-nft-minter/store/index.ts" />
declare module "@scom/scom-nft-minter/store/index.ts" {
    import { ERC20ApprovalModel, IERC20ApprovalEventOptions, INetwork } from "@ijstech/eth-wallet";
    export * from "@scom/scom-nft-minter/store/tokens/index.ts";
    export interface IContractDetailInfo {
        address: string;
    }
    export type ContractType = 'ProductMarketplace' | 'OneTimePurchaseNFT' | 'SubscriptionNFTFactory' | 'Promotion' | 'Commission' | 'Proxy';
    export interface IContractInfo {
        ProductMarketplace: IContractDetailInfo;
        OneTimePurchaseNFT: IContractDetailInfo;
        SubscriptionNFTFactory: IContractDetailInfo;
        Promotion: IContractDetailInfo;
        Commission: IContractDetailInfo;
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
    export const nullAddress = "0x0000000000000000000000000000000000000000";
    export const getERC20Amount: (wallet: IWallet, tokenAddress: string, decimals: number) => Promise<BigNumber>;
    export const getTokenBalance: (wallet: IWallet, token: ITokenObject) => Promise<BigNumber>;
    export const getTokenInfo: (address: string, chainId: number) => Promise<ITokenObject>;
    export const registerSendTxEvents: (sendTxEventHandlers: ISendTxEventsOptions) => void;
}
/// <amd-module name="@scom/scom-nft-minter/utils/index.ts" />
declare module "@scom/scom-nft-minter/utils/index.ts" {
    import { BigNumber } from '@ijstech/eth-wallet';
    import { State } from "@scom/scom-nft-minter/store/index.ts";
    export const formatNumber: (value: number | string | BigNumber, decimalFigures?: number) => string;
    export function getProxySelectors(state: State, chainId: number): Promise<string[]>;
    export const delay: (ms: number) => Promise<unknown>;
    export { getERC20Amount, getTokenBalance, getTokenInfo, nullAddress, registerSendTxEvents } from "@scom/scom-nft-minter/utils/token.ts";
}
/// <amd-module name="@scom/scom-nft-minter/index.css.ts" />
declare module "@scom/scom-nft-minter/index.css.ts" {
    export const markdownStyle: string;
    export const inputStyle: string;
    export const tokenSelectionStyle: string;
    export const linkStyle: string;
    export const formInputStyle: string;
    export const comboBoxStyle: string;
    export const readOnlyStyle: string;
    export const readOnlyInfoStyle: string;
}
/// <amd-module name="@scom/scom-nft-minter/data.json.ts" />
declare module "@scom/scom-nft-minter/data.json.ts" {
    const _default: {
        infuraId: string;
        contractInfo: {
            "97": {
                ProductMarketplace: {
                    address: string;
                };
                OneTimePurchaseNFT: {
                    address: string;
                };
                SubscriptionNFTFactory: {
                    address: string;
                };
                Promotion: {
                    address: string;
                };
                Commission: {
                    address: string;
                };
                Proxy: {
                    address: string;
                };
            };
            "43113": {
                ProductMarketplace: {
                    address: string;
                };
                OneTimePurchaseNFT: {
                    address: string;
                };
                SubscriptionNFTFactory: {
                    address: string;
                };
                Promotion: {
                    address: string;
                };
                Commission: {
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
        defaultExistingNft: {
            chainId: number;
            nftType: string;
            nftAddress: string;
            erc1155Index: number;
        };
        defaultCreate1155Index: {
            chainId: number;
            tokenToMint: string;
        };
        defaultOswapTroll: {
            chainId: number;
            nftType: string;
            nftAddress: string;
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-nft-minter/API.ts" />
declare module "@scom/scom-nft-minter/API.ts" {
    import { BigNumber } from '@ijstech/eth-wallet';
    import { ProductType, ICommissionInfo, IProductInfo, IDiscountRule } from "@scom/scom-nft-minter/interface/index.tsx";
    import { ITokenObject } from '@scom/scom-token-list';
    import { State } from "@scom/scom-nft-minter/store/index.ts";
    function getProductInfo(state: State, productId: number): Promise<IProductInfo>;
    function getProductOwner(state: State, productId: number): Promise<string>;
    function getNFTBalance(state: State, productId: number): Promise<string>;
    function getProductId(state: State, nftAddress: string, nftId?: number): Promise<number>;
    function getProductIdFromEvent(productMarketplaceAddress: string, receipt: any): number;
    function getDiscountRules(state: State, productId: number): Promise<IDiscountRule[]>;
    function updateDiscountRules(state: State, productId: number, rules: IDiscountRule[], ruleIdsToDelete?: number[], callback?: any, confirmationCallback?: any): Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    function newProduct(productMarketplaceAddress: string, productType: ProductType, quantity: number, // max quantity of this nft can be exist at anytime
    maxQuantity: number, // max quantity for one buy() txn
    price: string, maxPrice: string, //for donation only, no max price when it is 0
    tokenAddress: string, //Native token 0x0000000000000000000000000000000000000000
    tokenDecimals: number, uri: string, nftName?: string, nftSymbol?: string, priceDuration?: number, callback?: any, confirmationCallback?: any): Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    function createSubscriptionNFT(productMarketplaceAddress: string, quantity: number, price: string, tokenAddress: string, tokenDecimals: number, uri: string, priceDuration?: number, callback?: any, confirmationCallback?: any): Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    function newDefaultBuyProduct(productMarketplaceAddress: string, qty: number, // max quantity of this nft can be exist at anytime
    price: string, tokenAddress: string, tokenDecimals: number, uri: string, callback?: any, confirmationCallback?: any): Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    function getProxyTokenAmountIn(productPrice: string, quantity: number, commissions: ICommissionInfo[]): string;
    function buyProduct(state: State, productId: number, quantity: number, commissions: ICommissionInfo[], token: ITokenObject, callback?: any, confirmationCallback?: any): Promise<any>;
    function donate(state: State, productId: number, donateTo: string, amountIn: string, commissions: ICommissionInfo[], token: ITokenObject, callback?: any, confirmationCallback?: any): Promise<any>;
    function subscribe(state: State, productId: number, startTime: number, duration: number, recipient: string, referrer: string, discountRuleId?: number, callback?: any, confirmationCallback?: any): Promise<any>;
    function renewSubscription(state: State, productId: number, duration: number, recipient: string, discountRuleId?: number, callback?: any, confirmationCallback?: any): Promise<any>;
    function updateCommissionCampaign(state: State, productId: number, commissionRate: string, affiliates: string[], callback?: any, confirmationCallback?: any): Promise<any>;
    function updateProductUri(productMarketplaceAddress: string, productId: number | BigNumber, uri: string): Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    function updateProductPrice(productMarketplaceAddress: string, productId: number | BigNumber, price: number | BigNumber, tokenDecimals: number): Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    function fetchUserNftBalance(state: State, address: string): Promise<string>;
    function mintOswapTrollNft(address: string, callback: (err: Error, receipt?: string) => void): Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    function fetchOswapTrollNftInfo(state: State, address: string): Promise<{
        cap: BigNumber;
        price: BigNumber;
        tokenAddress: string;
    }>;
    export { getProductInfo, getNFTBalance, getProductId, getProductIdFromEvent, getDiscountRules, updateDiscountRules, newProduct, createSubscriptionNFT, newDefaultBuyProduct, getProxyTokenAmountIn, buyProduct, donate, subscribe, renewSubscription, getProductOwner, updateProductUri, updateProductPrice, updateCommissionCampaign, fetchOswapTrollNftInfo, fetchUserNftBalance, mintOswapTrollNft };
}
/// <amd-module name="@scom/scom-nft-minter/languages/main.json.ts" />
declare module "@scom/scom-nft-minter/languages/main.json.ts" {
    const _default_1: {
        en: {
            day_s: string;
            month_s: string;
            year_s: string;
            hurry_only_nfts_left: string;
            you_will_pay: string;
            a_commission_fee_of_percent_will_be_applied_to_the_amount_you_input: string;
            confirming: string;
            for_days: string;
            per_day: string;
            now: string;
            make_a_contribution: string;
            all_proceeds_will_go_to_following_vetted_wallet_address: string;
            native_token: string;
            more_information: string;
            hide_information: string;
            approve: string;
            approving: string;
            out_of_stock: string;
            mint: string;
            renew_subscription: string;
            subscribe: string;
            to_contract_with_token: string;
            discount: string;
            quantity: string;
            wallet_address_to_receive_nft: string;
            start_date: string;
            custom: string;
            duration: string;
            end_date: string;
            base_price: string;
            total: string;
            your_donation: string;
            balance: string;
            marketplace_contract_address: string;
            nft_contract_address: string;
            token_used_for_payment: string;
            submit: string;
            this_network_or_this_token_is_not_supported: string;
            details_here: string;
            smart_contract: string;
            something_went_wrong_updating_discount_rule: string;
            something_went_wrong_updating_commission_campaign: string;
            confirm: string;
            this_network_is_not_supported: string;
            invalid_token: string;
            token_to_mint_is_missing: string;
            something_went_wrong_creating_new_product: string;
            token_required: string;
            insufficient_balance: string;
            quantity_greater_than_max_quantity: string;
            invalid_quantity: string;
            over_maximum_order_quantity: string;
            start_date_required: string;
            duration_required: string;
            invalid_duration: string;
            amount_required: string;
        };
        "zh-hant": {};
        vi: {
            day_s: string;
            month_s: string;
            year_s: string;
            hurry_only_nfts_left: string;
            you_will_pay: string;
            a_commission_fee_of_percent_will_be_applied_to_the_amount_you_input: string;
            confirming: string;
            for_days: string;
            per_day: string;
            now: string;
            make_a_contribution: string;
            all_proceeds_will_go_to_following_vetted_wallet_address: string;
            native_token: string;
            more_information: string;
            hide_information: string;
            approve: string;
            approving: string;
            out_of_stock: string;
            mint: string;
            renew_subscription: string;
            subscribe: string;
            to_contract_with_token: string;
            discount: string;
            quantity: string;
            wallet_address_to_receive_nft: string;
            start_date: string;
            custom: string;
            duration: string;
            end_date: string;
            base_price: string;
            total: string;
            your_donation: string;
            balance: string;
            marketplace_contract_address: string;
            nft_contract_address: string;
            token_used_for_payment: string;
            submit: string;
            this_network_or_this_token_is_not_supported: string;
            details_here: string;
            smart_contract: string;
            something_went_wrong_updating_discount_rule: string;
            something_went_wrong_updating_commission_campaign: string;
            confirm: string;
            this_network_is_not_supported: string;
            invalid_token: string;
            token_to_mint_is_missing: string;
            something_went_wrong_creating_new_product: string;
            token_required: string;
            insufficient_balance: string;
            quantity_greater_than_max_quantity: string;
            invalid_quantity: string;
            over_maximum_order_quantity: string;
            start_date_required: string;
            duration_required: string;
            invalid_duration: string;
            amount_required: string;
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-nft-minter/languages/components.json.ts" />
declare module "@scom/scom-nft-minter/languages/components.json.ts" {
    const _default_2: {
        en: {
            subscription: string;
            one_time_purchase: string;
            subscription_price_per_period: string;
            payment_model: string;
            minimum_subscription_period_in_days: string;
            subscription_price: string;
            amount_of_token_to_pay_for_the_subscription: string;
            price: string;
            missing_chain: string;
            missing_nft_address: string;
            missing_index: string;
            you_are_not_the_owner: string;
            updating: string;
            something_went_wrong_when_updating: string;
            update: string;
        };
        "zh-hant": {};
        vi: {
            subscription: string;
            one_time_purchase: string;
            subscription_price_per_period: string;
            payment_model: string;
            minimum_subscription_period_in_days: string;
            subscription_price: string;
            amount_of_token_to_pay_for_the_subscription: string;
            price: string;
            missing_chain: string;
            missing_nft_address: string;
            missing_index: string;
            you_are_not_the_owner: string;
            updating: string;
            something_went_wrong_when_updating: string;
            update: string;
        };
    };
    export default _default_2;
}
/// <amd-module name="@scom/scom-nft-minter/languages/common.json.ts" />
declare module "@scom/scom-nft-minter/languages/common.json.ts" {
    const _default_3: {
        en: {
            switch_network: string;
            connect_wallet: string;
        };
        "zh-hant": {};
        vi: {
            switch_network: string;
            connect_wallet: string;
        };
    };
    export default _default_3;
}
/// <amd-module name="@scom/scom-nft-minter/languages/index.ts" />
declare module "@scom/scom-nft-minter/languages/index.ts" {
    const mainJson: Record<string, any>;
    const componentsJson: Record<string, any>;
    export { mainJson, componentsJson };
}
/// <amd-module name="@scom/scom-nft-minter/component/fieldUpdate.tsx" />
declare module "@scom/scom-nft-minter/component/fieldUpdate.tsx" {
    import { ControlElement, Module, Container } from '@ijstech/components';
    import { State } from "@scom/scom-nft-minter/store/index.ts";
    interface ScomNftMinterFieldUpdateElement extends ControlElement {
        refreshUI: () => void;
        connectWallet: () => void;
        showTxStatusModal: (status: 'warning' | 'success' | 'error', content?: string | Error) => void;
        state: State;
        value: string;
        isUri?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-nft-minter-field-update']: ScomNftMinterFieldUpdateElement;
            }
        }
    }
    export class ScomNftMinterFieldUpdate extends Module {
        private state;
        private inputField;
        private btnUpdate;
        private isUri;
        refreshUI: () => void;
        connectWallet: () => void;
        showTxStatusModal: (status: 'warning' | 'success' | 'error', content?: string | Error, exMessage?: string) => void;
        private rpcWalletEvents;
        static create(options?: ScomNftMinterFieldUpdateElement, parent?: Container): Promise<ScomNftMinterFieldUpdate>;
        constructor(parent?: Container, options?: ScomNftMinterFieldUpdateElement);
        get value(): string | number;
        set value(val: string | number);
        private get rpcWallet();
        private resetRpcWallet;
        private removeRpcWalletEvents;
        onHide(): void;
        private onUpdate;
        private onInputChanged;
        private updateEnabledInput;
        private updateButton;
        private getData;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-nft-minter/component/addressInput.tsx" />
declare module "@scom/scom-nft-minter/component/addressInput.tsx" {
    import { ControlElement, Module } from '@ijstech/components';
    import { State } from "@scom/scom-nft-minter/store/index.ts";
    interface ScomNftMinterAddressInputElement extends ControlElement {
        state: State;
        value?: number;
        readOnly?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-nft-minter-address-input']: ScomNftMinterAddressInputElement;
            }
        }
    }
    export class ScomNftMinterAddressInput extends Module {
        private edtAddress;
        private pnlProductInfo;
        private pnlDurationInDays;
        private lblPaymentModel;
        private lblDurationInDays;
        private lblTitlePrice;
        private lblPriceToMint;
        private state;
        private timeout;
        private _nftType;
        private _nftId;
        private _readonly;
        private isInfoParentUpdated;
        get nftType(): 'ERC721' | 'ERC1155';
        set nftType(value: 'ERC721' | 'ERC1155');
        get nftId(): number;
        set nftId(value: number);
        get value(): string;
        set value(val: string);
        init(): void;
        handleAddressChanged(): void;
        render(): void;
    }
}
/// <amd-module name="@scom/scom-nft-minter/component/index.ts" />
declare module "@scom/scom-nft-minter/component/index.ts" {
    import { ScomNftMinterFieldUpdate } from "@scom/scom-nft-minter/component/fieldUpdate.tsx";
    import { ScomNftMinterAddressInput } from "@scom/scom-nft-minter/component/addressInput.tsx";
    export { ScomNftMinterFieldUpdate, ScomNftMinterAddressInput };
}
/// <amd-module name="@scom/scom-nft-minter/formSchema.json.ts" />
declare module "@scom/scom-nft-minter/formSchema.json.ts" {
    import ScomNetworkPicker from "@scom/scom-network-picker";
    import ScomTokenInput from "@scom/scom-token-input";
    import { ComboBox, Input, Panel } from "@ijstech/components";
    import { State } from "@scom/scom-nft-minter/store/index.ts";
    import { ScomNftMinterAddressInput, ScomNftMinterFieldUpdate } from "@scom/scom-nft-minter/component/index.ts";
    import { PaymentModel } from "@scom/scom-nft-minter/interface/index.tsx";
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
    export function getProjectOwnerSchema1(isPolicy?: boolean): {
        dataSchema: {
            type: string;
            properties: {
                chainId: {
                    type: string;
                    title: string;
                    enum: number[];
                    required: boolean;
                };
                tokenToMint: {
                    type: string;
                    title: string;
                    tooltip: string;
                    required: boolean;
                };
                customMintToken: {
                    type: string;
                    title: string;
                    tooltip: string;
                    required: boolean;
                };
                durationInDays: {
                    type: string;
                    title: string;
                    required: boolean;
                    minimum: number;
                };
                perPeriodPrice: {
                    type: string;
                    title: string;
                    tooltip: string;
                    required: boolean;
                };
                oneTimePrice: {
                    type: string;
                    title: string;
                    tooltip: string;
                    required: boolean;
                };
                uri: {
                    type: string;
                    title: string;
                    tooltip: string;
                };
                paymentModel: {
                    type: string;
                    title: string;
                    oneOf: {
                        title: string;
                        const: PaymentModel;
                    }[];
                    required: boolean;
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
                elements: {
                    type: string;
                    scope: string;
                }[];
                scope?: undefined;
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
                elements?: undefined;
            } | {
                type: string;
                scope: string;
                elements?: undefined;
                rule?: undefined;
            })[];
        };
        customControls(): {
            '#/properties/chainId': {
                render: () => ScomNetworkPicker;
                getData: (control: ScomNetworkPicker) => number;
                setData: (control: ScomNetworkPicker, value: number) => Promise<void>;
            };
            '#/properties/tokenToMint': {
                render: () => ScomTokenInput;
                getData: (control: ScomTokenInput) => string;
                setData: (control: ScomTokenInput, value: string, rowData: any) => Promise<void>;
            };
            '#/properties/paymentModel': {
                render: () => Panel;
                getData: (control: ComboBox) => string;
                setData: (control: ComboBox, value: string) => Promise<void>;
            };
            '#/properties/durationInDays': {
                render: () => Input;
                getData: (control: Input) => any;
                setData: (control: Input, value: number) => Promise<void>;
            };
            '#/properties/perPeriodPrice': {
                render: () => Input;
                getData: (control: Input) => number;
                setData: (control: Input, value: number) => Promise<void>;
            };
            '#/properties/oneTimePrice': {
                render: () => Input;
                getData: (control: Input) => number;
                setData: (control: Input, value: number) => Promise<void>;
            };
        };
    };
    export function getProjectOwnerSchema2(state: State, readonly: boolean, isPolicy: boolean, functions: {
        connectWallet: any;
        showTxStatusModal: any;
        refreshUI: any;
    }): {
        dataSchema: {
            type: string;
            properties: {
                nftType: {
                    type: string;
                    title: string;
                    enum: string[];
                    readonly: boolean;
                    required: boolean;
                };
                chainId: {
                    type: string;
                    title: string;
                    enum: number[];
                    readonly: boolean;
                    required: boolean;
                };
                nftAddress: {
                    type: string;
                    title: string;
                    readonly: boolean;
                    required: boolean;
                };
                erc1155Index: {
                    type: string;
                    title: string;
                    tooltip: string;
                    minimum: number;
                    readonly: boolean;
                };
                newPrice: {
                    type: string;
                    title: string;
                };
                newUri: {
                    type: string;
                    title: string;
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
        };
        customControls(): {
            '#/properties/chainId': {
                render: () => ScomNetworkPicker;
                getData: (control: ScomNetworkPicker) => number;
                setData: (control: ScomNetworkPicker, value: number) => Promise<void>;
            };
            '#/properties/nftType': {
                render: () => Panel;
                getData: (control: ComboBox) => string;
                setData: (control: ComboBox, value: string) => Promise<void>;
            };
            '#/properties/nftAddress': {
                render: () => ScomNftMinterAddressInput;
                getData: (control: ScomNftMinterAddressInput) => string;
                setData: (control: ScomNftMinterAddressInput, value: string, rowData: any) => Promise<void>;
            };
            '#/properties/erc1155Index': {
                render: () => Panel;
                getData: (control: Input) => any;
                setData: (control: Input, value: number) => Promise<void>;
            };
            '#/properties/newPrice': {
                render: () => ScomNftMinterFieldUpdate;
                getData: (control: ScomNftMinterFieldUpdate) => number | "";
                setData: (control: ScomNftMinterFieldUpdate, value: number) => Promise<void>;
            };
            '#/properties/newUri': {
                render: () => ScomNftMinterFieldUpdate;
                getData: (control: ScomNftMinterFieldUpdate) => string | number;
                setData: (control: ScomNftMinterFieldUpdate, value: number) => Promise<void>;
            };
        };
    };
    export function getProjectOwnerSchema3(isDefault1155New: boolean, readonly: boolean, isPolicy: boolean, state: State, functions: {
        connectWallet: any;
        showTxStatusModal: any;
        refreshUI: any;
    }): {
        dataSchema: {
            type: string;
            properties: {
                chainId: {
                    type: string;
                    title: string;
                    enum: number[];
                    required: boolean;
                };
                tokenToMint: {
                    type: string;
                    title: string;
                    tooltip: string;
                    required: boolean;
                };
                customMintToken: {
                    type: string;
                    title: string;
                    tooltip: string;
                    required: boolean;
                };
                durationInDays: {
                    type: string;
                    title: string;
                    required: boolean;
                    minimum: number;
                };
                perPeriodPrice: {
                    type: string;
                    title: string;
                    tooltip: string;
                    required: boolean;
                };
                oneTimePrice: {
                    type: string;
                    title: string;
                    tooltip: string;
                    required: boolean;
                };
                uri: {
                    type: string;
                    title: string;
                    tooltip: string;
                };
                paymentModel: {
                    type: string;
                    title: string;
                    oneOf: {
                        title: string;
                        const: PaymentModel;
                    }[];
                    required: boolean;
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
                elements: {
                    type: string;
                    scope: string;
                }[];
                scope?: undefined;
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
                elements?: undefined;
            } | {
                type: string;
                scope: string;
                elements?: undefined;
                rule?: undefined;
            })[];
        };
        customControls(): {
            '#/properties/chainId': {
                render: () => ScomNetworkPicker;
                getData: (control: ScomNetworkPicker) => number;
                setData: (control: ScomNetworkPicker, value: number) => Promise<void>;
            };
            '#/properties/tokenToMint': {
                render: () => ScomTokenInput;
                getData: (control: ScomTokenInput) => string;
                setData: (control: ScomTokenInput, value: string, rowData: any) => Promise<void>;
            };
            '#/properties/paymentModel': {
                render: () => Panel;
                getData: (control: ComboBox) => string;
                setData: (control: ComboBox, value: string) => Promise<void>;
            };
            '#/properties/durationInDays': {
                render: () => Input;
                getData: (control: Input) => any;
                setData: (control: Input, value: number) => Promise<void>;
            };
            '#/properties/perPeriodPrice': {
                render: () => Input;
                getData: (control: Input) => number;
                setData: (control: Input, value: number) => Promise<void>;
            };
            '#/properties/oneTimePrice': {
                render: () => Input;
                getData: (control: Input) => number;
                setData: (control: Input, value: number) => Promise<void>;
            };
        };
    } | {
        dataSchema: {
            type: string;
            properties: {
                nftType: {
                    type: string;
                    title: string;
                    enum: string[];
                    readonly: boolean;
                    required: boolean;
                };
                chainId: {
                    type: string;
                    title: string;
                    enum: number[];
                    readonly: boolean;
                    required: boolean;
                };
                nftAddress: {
                    type: string;
                    title: string;
                    readonly: boolean;
                    required: boolean;
                };
                erc1155Index: {
                    type: string;
                    title: string;
                    tooltip: string;
                    minimum: number;
                    readonly: boolean;
                };
                newPrice: {
                    type: string;
                    title: string;
                };
                newUri: {
                    type: string;
                    title: string;
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
        };
        customControls(): {
            '#/properties/chainId': {
                render: () => ScomNetworkPicker;
                getData: (control: ScomNetworkPicker) => number;
                setData: (control: ScomNetworkPicker, value: number) => Promise<void>;
            };
            '#/properties/nftType': {
                render: () => Panel;
                getData: (control: ComboBox) => string;
                setData: (control: ComboBox, value: string) => Promise<void>;
            };
            '#/properties/nftAddress': {
                render: () => ScomNftMinterAddressInput;
                getData: (control: ScomNftMinterAddressInput) => string;
                setData: (control: ScomNftMinterAddressInput, value: string, rowData: any) => Promise<void>;
            };
            '#/properties/erc1155Index': {
                render: () => Panel;
                getData: (control: Input) => any;
                setData: (control: Input, value: number) => Promise<void>;
            };
            '#/properties/newPrice': {
                render: () => ScomNftMinterFieldUpdate;
                getData: (control: ScomNftMinterFieldUpdate) => number | "";
                setData: (control: ScomNftMinterFieldUpdate, value: number) => Promise<void>;
            };
            '#/properties/newUri': {
                render: () => ScomNftMinterFieldUpdate;
                getData: (control: ScomNftMinterFieldUpdate) => string | number;
                setData: (control: ScomNftMinterFieldUpdate, value: number) => Promise<void>;
            };
        };
    };
}
/// <amd-module name="@scom/scom-nft-minter/model/configModel.ts" />
declare module "@scom/scom-nft-minter/model/configModel.ts" {
    import { Module } from "@ijstech/components";
    import { State } from "@scom/scom-nft-minter/store/index.ts";
    import ScomCommissionFeeSetup from "@scom/scom-commission-fee-setup";
    import { ICommissionInfo, IDiscountRule, IEmbedData, INetworkConfig, IWalletPlugin, PaymentModel, ProductType } from "@scom/scom-nft-minter/interface/index.tsx";
    interface IConfigOptions {
        refreshWidget: (isDataUpdated?: boolean) => Promise<void>;
        refreshDappContainer: () => void;
        setContaiterTag: (value: any) => void;
        updateTheme: () => void;
        onChainChanged: () => Promise<void>;
        onWalletConnected: () => Promise<void>;
        connectWallet: () => Promise<void>;
        showTxStatusModal: (status: 'warning' | 'success' | 'error', content?: string | Error, exMessage?: string) => void;
        updateUIBySetData: () => Promise<void>;
    }
    export class ConfigModel {
        private state;
        private module;
        private options;
        private _data;
        private productInfo;
        private rpcWalletEvents;
        private isConfigNewIndex;
        private isOnChangeUpdated;
        constructor(state: State, module: Module, options: IConfigOptions);
        get chainId(): number;
        get defaultChainId(): number;
        set defaultChainId(value: number);
        get wallets(): IWalletPlugin[];
        set wallets(value: IWalletPlugin[]);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        get showHeader(): boolean;
        set showHeader(value: boolean);
        get commissions(): ICommissionInfo[];
        set commissions(value: ICommissionInfo[]);
        get rpcWallet(): import("@ijstech/eth-wallet").IRpcWallet;
        get nftType(): "ERC721" | "ERC1155";
        get nftAddress(): string;
        get newPrice(): number;
        get newMaxQty(): number;
        get newTxnMaxQty(): number;
        get recipient(): string;
        get recipients(): string[];
        get referrer(): string;
        get productId(): number;
        get productType(): ProductType;
        set productType(value: ProductType);
        get discountRuleId(): number;
        set discountRuleId(value: number);
        get chainSpecificProperties(): any;
        set chainSpecificProperties(value: any);
        get link(): string;
        set link(value: string);
        get name(): string;
        set name(value: string);
        get description(): string;
        set description(value: string);
        get logoUrl(): string;
        set logoUrl(value: string);
        private getBuilderActions;
        private getProjectOwnerActions;
        getConfigurators(type?: 'new1155' | 'customNft', readonly?: boolean, isPocily?: boolean): ({
            name: string;
            target: string;
            getProxySelectors: (chainId: number) => Promise<string[]>;
            getActions: () => any[];
            getData: any;
            setData: (data: IEmbedData) => Promise<void>;
            getTag: any;
            setTag: any;
            setupData?: undefined;
            updateDiscountRules?: undefined;
            updateCommissionCampaign?: undefined;
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
            updateDiscountRules: (productId: number, rules: IDiscountRule[], ruleIdsToDelete?: number[]) => Promise<unknown>;
            updateCommissionCampaign: (productId: number, commissionRate: string, affiliates: string[]) => Promise<unknown>;
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
                productId?: number;
                name?: string;
                title?: string;
                nftType?: "ERC721" | "ERC1155";
                chainId?: number;
                nftAddress?: string;
                productType?: ProductType;
                erc1155Index?: number;
                tokenToMint?: string;
                isCustomMintToken?: boolean;
                customMintToken?: string;
                duration?: number;
                perPeriodPrice?: number;
                oneTimePrice?: number;
                maxQty?: number;
                paymentModel?: PaymentModel;
                durationInDays?: number;
                priceDuration?: number;
                txnMaxQty?: number;
                uri?: string;
                recipient?: string;
                recipients?: string[];
                logoUrl?: string;
                description?: string;
                link?: string;
                discountRuleId?: number;
                commissions?: ICommissionInfo[];
                referrer?: string;
                chainSpecificProperties?: Record<number, import("@scom/scom-nft-minter/interface/index.tsx").IChainSpecificProperties>;
                defaultChainId?: number;
                wallets?: IWalletPlugin[];
                networks?: any[];
                showHeader?: boolean;
            };
            setData: any;
            getTag: any;
            setTag: any;
            getProxySelectors?: undefined;
            getActions?: undefined;
            setupData?: undefined;
            updateDiscountRules?: undefined;
            updateCommissionCampaign?: undefined;
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
            updateDiscountRules?: undefined;
            updateCommissionCampaign?: undefined;
            elementName?: undefined;
            getLinkParams?: undefined;
            setLinkParams?: undefined;
            bindOnChanged?: undefined;
        })[];
        getData(): IEmbedData;
        setData(data: IEmbedData): Promise<void>;
        getTag(): any;
        setTag(value: any): void;
        private updateTag;
        private updateFormConfig;
        removeRpcWalletEvents: () => void;
        resetRpcWallet: () => Promise<void>;
        initWallet: () => Promise<void>;
        updateDataIndex: () => Promise<void>;
        private getProductTypeByCode;
        private _createProduct;
        private newProduct;
    }
}
/// <amd-module name="@scom/scom-nft-minter/model/nftMinterModel.ts" />
declare module "@scom/scom-nft-minter/model/nftMinterModel.ts" {
    import { ITokenObject } from "@scom/scom-token-list";
    import { BigNumber } from "@ijstech/eth-contract";
    import { State } from "@scom/scom-nft-minter/store/index.ts";
    import { ICommissionInfo, IDiscountRule, IOswapTroll, IProductInfo, ProductType } from "@scom/scom-nft-minter/interface/index.tsx";
    import { ConfigModel } from "@scom/scom-nft-minter/model/configModel.ts";
    import { Module } from "@ijstech/components";
    interface INFTMinterOptions {
        updateSubmitButton: (submitting?: boolean) => void;
        showTxStatusModal: (status: 'warning' | 'success' | 'error', content?: string | Error, exMessage?: string) => void;
        closeTxStatusModal: () => void;
        onMintedNft: (oswapTroll: IOswapTroll) => void;
        onDonated: () => Promise<void>;
        onSubscribed: () => void;
        onBoughtProduct: () => Promise<void>;
    }
    export class NFTMinterModel {
        private state;
        private module;
        private options;
        private _productInfo;
        private _oswapTrollInfo;
        private _discountRules;
        private _discountApplied;
        private _cap;
        private _isRenewal;
        private _tokenAmountIn;
        constructor(module: Module, state: State, options: INFTMinterOptions);
        get rpcWallet(): import("@ijstech/eth-wallet").IRpcWallet;
        get chainId(): number;
        set productInfo(value: IProductInfo);
        get productInfo(): IProductInfo;
        get discountRules(): IDiscountRule[];
        set discountRules(value: IDiscountRule[]);
        get oswapTrollInfo(): IOswapTroll;
        get tokenSymbol(): string;
        get cap(): number;
        get isRenewal(): boolean;
        set isRenewal(value: boolean);
        get discountApplied(): IDiscountRule;
        set discountApplied(value: IDiscountRule);
        get tokenAmountIn(): string;
        updateTokenAmountIn: (qty: number, commissions: ICommissionInfo[], value?: string) => void;
        updateDiscount: (duration: number, startDate: any, days: number) => void;
        getTokenBalance: (_token?: ITokenObject) => Promise<BigNumber>;
        fetchOswapTrollNftInfo: (nftAddress: string) => Promise<{
            price: BigNumber;
            cap: BigNumber;
            tokenAddress: string;
            token: ITokenObject;
            nftBalance: string | number;
        }>;
        fetchProductInfo: (productId: number, type: ProductType, isDataUpdated?: boolean) => Promise<void>;
        fetchDiscountRules: (productId: number) => Promise<void>;
        fetchNftBalance: (productId: number) => Promise<string | 0>;
        getProductInfo: (productId: number) => Promise<IProductInfo>;
        doSubmitAction: (configModel: ConfigModel, token: ITokenObject, tokenValue: string, qty: string, startDate: any, duration: any, days: number, recipient?: string) => Promise<void>;
        private mintNft;
        private buyToken;
    }
}
/// <amd-module name="@scom/scom-nft-minter/model/index.ts" />
declare module "@scom/scom-nft-minter/model/index.ts" {
    export { ConfigModel } from "@scom/scom-nft-minter/model/configModel.ts";
    export { NFTMinterModel } from "@scom/scom-nft-minter/model/nftMinterModel.ts";
}
/// <amd-module name="@scom/scom-nft-minter" />
declare module "@scom/scom-nft-minter" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IChainSpecificProperties, IDiscountRule, IEmbedData, INetworkConfig, IOswapTroll, IWalletPlugin, ProductType } from "@scom/scom-nft-minter/interface/index.tsx";
    import { BlockNoteEditor, BlockNoteSpecs, callbackFnType, executeFnType } from '@scom/scom-blocknote-sdk';
    interface ScomNftMinterElement extends ControlElement {
        lazyLoad?: boolean;
        name?: string;
        nftType?: 'ERC721' | 'ERC1155' | '';
        chainId?: number;
        nftAddress?: string;
        erc1155Index?: number;
        productType?: 'Buy' | 'Subscription' | 'DonateToOwner' | 'DonateToEveryone';
        tokenToMint?: string;
        customMintToken?: string;
        duration?: number;
        perPeriodPrice?: number;
        oneTimePrice?: number;
        maxQty?: number;
        txnMaxQty?: number;
        title?: string;
        description?: string;
        logoUrl?: string;
        link?: string;
        recipients?: string[];
        chainSpecificProperties?: Record<number, IChainSpecificProperties>;
        defaultChainId: number;
        wallets: IWalletPlugin[];
        networks: INetworkConfig[];
        showHeader?: boolean;
        onMintedNFT?: () => void;
    }
    export interface IBuilderConfigurator {
        name: string;
        target: string;
        getActions: (category?: string) => any[];
        getData: () => IEmbedData;
        setData: (data: IEmbedData) => Promise<void>;
        setupData?: (data: IEmbedData) => Promise<boolean>;
        getTag: () => any;
        setTag: (value: any) => void;
        updateDiscountRules?: (productId: number, rules: IDiscountRule[], ruleIdsToDelete: number[]) => Promise<IDiscountRule[]>;
        updateCommissionCampaign?: (productId: number, commissionRate: string, affiliates: string[]) => Promise<boolean>;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-nft-minter"]: ScomNftMinterElement;
            }
        }
    }
    export default class ScomNftMinter extends Module implements BlockNoteSpecs {
        private state;
        private imgLogo;
        private markdownViewer;
        private pnlLink;
        private lblLink;
        private lblTitle;
        private pnlMintFee;
        private lblMintFee;
        private lblSpotsRemaining;
        private lbMarketplaceContract;
        private lbNFTContract;
        private lbToken;
        private iconCopyToken;
        private pnlTokenInput;
        private pnlQty;
        private edtQty;
        private pnlSubscriptionPeriod;
        private comboRecipient;
        private edtStartDate;
        private pnlCustomStartDate;
        private chkCustomStartDate;
        private lblStartDate;
        private edtDuration;
        private comboDurationUnit;
        private lblEndDate;
        private lblBalance;
        private btnSubmit;
        private btnApprove;
        private pnlAddress;
        private lblRef;
        private lblAddress;
        private tokenInput;
        private txStatusModal;
        private pnlDiscount;
        private lblDiscount;
        private lblDiscountAmount;
        private lbOrderTotal;
        private lbOrderTotalTitle;
        private iconOrderTotal;
        private pnlInputFields;
        private pnlUnsupportedNetwork;
        private imgUri;
        private containerDapp;
        private pnlLoading;
        private gridMain;
        private mdWallet;
        private configModel;
        private nftMinterModel;
        private approvalModelAction;
        private isApproving;
        tag: any;
        defaultEdit: boolean;
        private contractAddress;
        private detailWrapper;
        private btnDetail;
        private _renewalDate;
        onMintedNFT: () => void;
        constructor(parent?: Container, options?: ScomNftMinterElement);
        addBlock(blocknote: any, executeFn: executeFnType, callbackFn?: callbackFnType): {
            block: any;
            slashItem: {
                name: string;
                execute: (editor: BlockNoteEditor) => void;
                aliases: string[];
                group: string;
                icon: {
                    name: string;
                };
                hint: string;
            };
            moduleData: {
                name: string;
                localPath: string;
            };
        };
        removeRpcWalletEvents(): void;
        onHide(): void;
        initModels(): void;
        static create(options?: ScomNftMinterElement, parent?: Container): Promise<ScomNftMinter>;
        private get chainId();
        private get rpcWallet();
        get nftType(): "ERC721" | "ERC1155";
        get nftAddress(): string;
        get newPrice(): number;
        get newMaxQty(): number;
        get newTxnMaxQty(): number;
        get recipient(): string;
        get link(): string;
        set link(value: string);
        get oswapTrollInfo(): IOswapTroll;
        get productInfo(): import("@scom/scom-nft-minter/interface/index.tsx").IProductInfo;
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
        get isRenewal(): boolean;
        set isRenewal(value: boolean);
        get renewalDate(): number;
        set renewalDate(value: number);
        get discountApplied(): IDiscountRule;
        private onChainChanged;
        private onWalletConnected;
        private updateTokenBalance;
        private onSetupPage;
        getConfigurators(type?: 'new1155' | 'customNft', readonly?: boolean, isPocily?: boolean): ({
            name: string;
            target: string;
            getProxySelectors: (chainId: number) => Promise<string[]>;
            getActions: () => any[];
            getData: any;
            setData: (data: IEmbedData) => Promise<void>;
            getTag: any;
            setTag: any;
            setupData?: undefined;
            updateDiscountRules?: undefined;
            updateCommissionCampaign?: undefined;
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
            updateDiscountRules: (productId: number, rules: IDiscountRule[], ruleIdsToDelete?: number[]) => Promise<unknown>;
            updateCommissionCampaign: (productId: number, commissionRate: string, affiliates: string[]) => Promise<unknown>;
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
            bindOnChanged: (element: import("@scom/scom-commission-fee-setup").default, callback: (data: any) => Promise<void>) => void;
            getData: () => {
                fee: string;
                productId?: number;
                name?: string;
                title?: string;
                nftType?: "ERC721" | "ERC1155";
                chainId?: number;
                nftAddress?: string;
                productType?: ProductType;
                erc1155Index?: number;
                tokenToMint?: string;
                isCustomMintToken?: boolean;
                customMintToken?: string;
                duration?: number;
                perPeriodPrice?: number;
                oneTimePrice?: number;
                maxQty?: number;
                paymentModel?: import("@scom/scom-nft-minter/interface/index.tsx").PaymentModel;
                durationInDays?: number;
                priceDuration?: number;
                txnMaxQty?: number;
                uri?: string;
                recipient?: string;
                recipients?: string[];
                logoUrl?: string;
                description?: string;
                link?: string;
                discountRuleId?: number;
                commissions?: import("@scom/scom-nft-minter/interface/index.tsx").ICommissionInfo[];
                referrer?: string;
                chainSpecificProperties?: Record<number, IChainSpecificProperties>;
                defaultChainId?: number;
                wallets?: IWalletPlugin[];
                networks?: any[];
                showHeader?: boolean;
            };
            setData: any;
            getTag: any;
            setTag: any;
            getProxySelectors?: undefined;
            getActions?: undefined;
            setupData?: undefined;
            updateDiscountRules?: undefined;
            updateCommissionCampaign?: undefined;
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
            updateDiscountRules?: undefined;
            updateCommissionCampaign?: undefined;
            elementName?: undefined;
            getLinkParams?: undefined;
            setLinkParams?: undefined;
            bindOnChanged?: undefined;
        })[];
        private refreshDappContainer;
        showLoading(): void;
        hideLoading(): void;
        getData(): Promise<IEmbedData>;
        setData(data: IEmbedData): Promise<void>;
        getTag(): any;
        setTag(value: any): Promise<void>;
        private setContaiterTag;
        private updateStyle;
        private updateTheme;
        private connectWallet;
        private updateDAppUI;
        private updateUIBySetData;
        private refreshWidget;
        getProductInfo(): Promise<import("@scom/scom-nft-minter/interface/index.tsx").IProductInfo>;
        private updateTokenAddress;
        private updateSpotsRemaining;
        private onToggleDetail;
        private onViewMarketplaceContract;
        private onViewNFTContract;
        private onViewToken;
        private updateCopyIcon;
        private onCopyMarketplaceContract;
        private onCopyNFTContract;
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
        private getDurationInDays;
        private _updateEndDate;
        private _updateDiscount;
        private _updateTotalAmount;
        private onStartDateChanged;
        private onDurationChanged;
        private onDurationUnitChanged;
        private handleCustomCheckboxChange;
        init(): Promise<void>;
        render(): any;
    }
}
