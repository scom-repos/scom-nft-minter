var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-nft-minter/interface/index.tsx", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaymentModel = exports.ProductType = void 0;
    var ProductType;
    (function (ProductType) {
        ProductType["Buy"] = "Buy";
        ProductType["Subscription"] = "Subscription";
        ProductType["DonateToOwner"] = "DonateToOwner";
        ProductType["DonateToEveryone"] = "DonateToEveryone";
    })(ProductType = exports.ProductType || (exports.ProductType = {}));
    var PaymentModel;
    (function (PaymentModel) {
        PaymentModel["OneTimePurchase"] = "OneTimePurchase";
        PaymentModel["Subscription"] = "Subscription";
    })(PaymentModel = exports.PaymentModel || (exports.PaymentModel = {}));
});
define("@scom/scom-nft-minter/store/tokens/mainnet/avalanche.ts", ["require", "exports", "@scom/scom-token-list"], function (require, exports, scom_token_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Avalanche = void 0;
    exports.Tokens_Avalanche = [
        {
            "address": "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
            "name": "Tether USD",
            "symbol": "USDT.e",
            "decimals": 6,
            "isCommon": true
        },
        {
            ...scom_token_list_1.ChainNativeTokenByChainId[43114]
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/mainnet/bsc.ts", ["require", "exports", "@scom/scom-token-list"], function (require, exports, scom_token_list_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_BSC = void 0;
    exports.Tokens_BSC = [
        {
            "name": "Binance Pegged USDT",
            "symbol": "USDT",
            "address": "0x55d398326f99059fF775485246999027B3197955",
            "decimals": 18,
            "isCommon": true
        },
        {
            ...scom_token_list_2.ChainNativeTokenByChainId[56]
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/mainnet/index.ts", ["require", "exports", "@scom/scom-nft-minter/store/tokens/mainnet/avalanche.ts", "@scom/scom-nft-minter/store/tokens/mainnet/bsc.ts"], function (require, exports, avalanche_1, bsc_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_BSC = exports.Tokens_Avalanche = void 0;
    Object.defineProperty(exports, "Tokens_Avalanche", { enumerable: true, get: function () { return avalanche_1.Tokens_Avalanche; } });
    Object.defineProperty(exports, "Tokens_BSC", { enumerable: true, get: function () { return bsc_1.Tokens_BSC; } });
});
define("@scom/scom-nft-minter/store/tokens/testnet/bsc-testnet.ts", ["require", "exports", "@scom/scom-token-list"], function (require, exports, scom_token_list_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_BSC_Testnet = void 0;
    exports.Tokens_BSC_Testnet = [
        {
            "name": "USDT",
            "address": "0x29386B60e0A9A1a30e1488ADA47256577ca2C385",
            "symbol": "USDT",
            "decimals": 6,
            "isCommon": true
        },
        {
            ...scom_token_list_3.ChainNativeTokenByChainId[97]
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/testnet/fuji.ts", ["require", "exports", "@scom/scom-token-list"], function (require, exports, scom_token_list_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Fuji = void 0;
    exports.Tokens_Fuji = [
        {
            "name": "Tether USD",
            "address": "0xb9C31Ea1D475c25E58a1bE1a46221db55E5A7C6e",
            "symbol": "USDT.e",
            "decimals": 6
        },
        {
            ...scom_token_list_4.ChainNativeTokenByChainId[43113]
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/testnet/index.ts", ["require", "exports", "@scom/scom-nft-minter/store/tokens/testnet/bsc-testnet.ts", "@scom/scom-nft-minter/store/tokens/testnet/fuji.ts"], function (require, exports, bsc_testnet_1, fuji_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Fuji = exports.Tokens_BSC_Testnet = void 0;
    Object.defineProperty(exports, "Tokens_BSC_Testnet", { enumerable: true, get: function () { return bsc_testnet_1.Tokens_BSC_Testnet; } });
    Object.defineProperty(exports, "Tokens_Fuji", { enumerable: true, get: function () { return fuji_1.Tokens_Fuji; } });
});
define("@scom/scom-nft-minter/store/tokens/index.ts", ["require", "exports", "@scom/scom-nft-minter/store/tokens/mainnet/index.ts", "@scom/scom-nft-minter/store/tokens/testnet/index.ts"], function (require, exports, index_1, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SupportedERC20Tokens = void 0;
    const SupportedERC20Tokens = {
        56: index_1.Tokens_BSC.map(v => { return { ...v, chainId: 56 }; }),
        97: index_2.Tokens_BSC_Testnet.map(v => { return { ...v, chainId: 97 }; }),
        43113: index_2.Tokens_Fuji.map(v => { return { ...v, chainId: 43113 }; }),
        43114: index_1.Tokens_Avalanche.map(v => { return { ...v, chainId: 43114 }; }),
    };
    exports.SupportedERC20Tokens = SupportedERC20Tokens;
});
define("@scom/scom-nft-minter/store/index.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-network-list", "@scom/scom-nft-minter/store/tokens/index.ts"], function (require, exports, components_1, eth_wallet_1, scom_network_list_1, index_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isClientWalletConnected = exports.getClientWallet = exports.State = void 0;
    __exportStar(index_3, exports);
    ;
    class State {
        constructor(options) {
            this.contractInfoByChain = {};
            this.embedderCommissionFee = '0';
            this.rpcWalletId = '';
            this.networkMap = {};
            this.infuraId = '';
            this.getNetworkInfo = (chainId) => {
                return this.networkMap[chainId];
            };
            this.getExplorerByAddress = (chainId, address) => {
                let network = this.getNetworkInfo(chainId);
                if (network && network.explorerAddressUrl) {
                    let url = `${network.explorerAddressUrl}${address}`;
                    return `<a href="${url}" style="color: var(--colors-primary-main); margin-block: 2px" target="_blank">${address}</a>`;
                }
                return address;
            };
            this.viewExplorerByAddress = (chainId, address) => {
                let network = this.getNetworkInfo(chainId);
                if (network && network.explorerAddressUrl) {
                    let url = `${network.explorerAddressUrl}${address}`;
                    window.open(url);
                }
            };
            this.initData(options);
        }
        initData(options) {
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
        initRpcWallet(defaultChainId) {
            if (this.rpcWalletId) {
                return this.rpcWalletId;
            }
            const clientWallet = eth_wallet_1.Wallet.getClientInstance();
            const networkList = Object.values(components_1.application.store?.networkMap || []);
            const instanceId = clientWallet.initRpcWallet({
                networks: networkList,
                defaultChainId,
                infuraId: components_1.application.store?.infuraId,
                multicalls: components_1.application.store?.multicalls
            });
            this.rpcWalletId = instanceId;
            if (clientWallet.address) {
                const rpcWallet = eth_wallet_1.Wallet.getRpcWalletInstance(instanceId);
                rpcWallet.address = clientWallet.address;
            }
            const defaultNetworkList = (0, scom_network_list_1.default)();
            const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
                acc[cur.chainId] = cur;
                return acc;
            }, {});
            // const supportedNetworks = ConfigData.supportedNetworks || [];
            for (let network of networkList) {
                const networkInfo = defaultNetworkMap[network.chainId];
                // const supportedNetwork = supportedNetworks.find(v => v.chainId == network.chainId);
                // if (!networkInfo || !supportedNetwork) continue;
                if (!networkInfo)
                    continue;
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
        getContractAddress(type) {
            const chainId = this.getChainId();
            const contracts = this.contractInfoByChain[chainId] || {};
            return contracts[type]?.address;
        }
        getRpcWallet() {
            return this.rpcWalletId ? eth_wallet_1.Wallet.getRpcWalletInstance(this.rpcWalletId) : null;
        }
        isRpcWalletConnected() {
            const wallet = this.getRpcWallet();
            return wallet?.isConnected;
        }
        getChainId() {
            const rpcWallet = this.getRpcWallet();
            return rpcWallet?.chainId;
        }
        async setApprovalModelAction(options) {
            const approvalOptions = {
                ...options,
                spenderAddress: ''
            };
            let wallet = this.getRpcWallet();
            this.approvalModel = new eth_wallet_1.ERC20ApprovalModel(wallet, approvalOptions);
            let approvalModelAction = this.approvalModel.getAction();
            return approvalModelAction;
        }
    }
    exports.State = State;
    function getClientWallet() {
        return eth_wallet_1.Wallet.getClientInstance();
    }
    exports.getClientWallet = getClientWallet;
    function isClientWalletConnected() {
        const wallet = eth_wallet_1.Wallet.getClientInstance();
        return wallet.isConnected;
    }
    exports.isClientWalletConnected = isClientWalletConnected;
});
define("@scom/scom-nft-minter/utils/token.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerSendTxEvents = exports.getTokenInfo = exports.getTokenBalance = exports.getERC20Amount = exports.nullAddress = void 0;
    exports.nullAddress = '0x0000000000000000000000000000000000000000';
    const getERC20Amount = async (wallet, tokenAddress, decimals) => {
        try {
            let erc20 = new eth_wallet_2.Erc20(wallet, tokenAddress, decimals);
            return await erc20.balance;
        }
        catch {
            return new eth_wallet_2.BigNumber(0);
        }
    };
    exports.getERC20Amount = getERC20Amount;
    const getTokenBalance = async (wallet, token) => {
        let balance = new eth_wallet_2.BigNumber(0);
        if (!token)
            return balance;
        if (token.address && token.address !== exports.nullAddress) {
            balance = await (0, exports.getERC20Amount)(wallet, token.address, token.decimals);
        }
        else {
            balance = await wallet.balance;
        }
        return balance;
    };
    exports.getTokenBalance = getTokenBalance;
    const getTokenInfo = async (address, chainId) => {
        let token;
        const wallet = eth_wallet_2.Wallet.getClientInstance();
        wallet.chainId = chainId;
        const isValidAddress = wallet.isAddress(address);
        if (isValidAddress) {
            const tokenAddress = wallet.toChecksumAddress(address);
            const tokenInfo = await wallet.tokenInfo(tokenAddress);
            if (tokenInfo?.symbol) {
                token = {
                    chainId,
                    address: tokenAddress,
                    name: tokenInfo.name,
                    decimals: tokenInfo.decimals,
                    symbol: tokenInfo.symbol
                };
            }
        }
        return token;
    };
    exports.getTokenInfo = getTokenInfo;
    const registerSendTxEvents = (sendTxEventHandlers) => {
        const wallet = eth_wallet_2.Wallet.getClientInstance();
        wallet.registerSendTxEvents({
            transactionHash: (error, receipt) => {
                if (sendTxEventHandlers.transactionHash) {
                    sendTxEventHandlers.transactionHash(error, receipt);
                }
            },
            confirmation: (receipt) => {
                if (sendTxEventHandlers.confirmation) {
                    sendTxEventHandlers.confirmation(receipt);
                }
            },
        });
    };
    exports.registerSendTxEvents = registerSendTxEvents;
});
define("@scom/scom-nft-minter/utils/index.ts", ["require", "exports", "@scom/scom-product-contract", "@ijstech/components", "@scom/scom-nft-minter/utils/token.ts"], function (require, exports, scom_product_contract_1, components_2, token_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerSendTxEvents = exports.nullAddress = exports.getTokenInfo = exports.getTokenBalance = exports.getERC20Amount = exports.delay = exports.getProxySelectors = exports.formatNumber = void 0;
    const formatNumber = (value, decimalFigures) => {
        if (typeof value === 'object') {
            value = value.toFixed();
        }
        const minValue = '0.0000001';
        return components_2.FormatUtils.formatNumber(value, { decimalFigures: decimalFigures !== undefined ? decimalFigures : 4, minValue, hasTrailingZero: false });
    };
    exports.formatNumber = formatNumber;
    async function getProxySelectors(state, chainId) {
        const wallet = state.getRpcWallet();
        await wallet.init();
        if (wallet.chainId != chainId)
            await wallet.switchNetwork(chainId);
        let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
        let contract = new scom_product_contract_1.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
        let permittedProxyFunctions = [
            "buy",
            "donate",
            "subscribe"
        ];
        let selectors = permittedProxyFunctions
            .map(e => e + "(" + contract._abi.filter(f => f.name == e)[0].inputs.map(f => f.type).join(',') + ")")
            .map(e => wallet.soliditySha3(e).substring(0, 10))
            .map(e => contract.address.toLowerCase() + e.replace("0x", ""));
        return selectors;
    }
    exports.getProxySelectors = getProxySelectors;
    const delay = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    exports.delay = delay;
    Object.defineProperty(exports, "getERC20Amount", { enumerable: true, get: function () { return token_1.getERC20Amount; } });
    Object.defineProperty(exports, "getTokenBalance", { enumerable: true, get: function () { return token_1.getTokenBalance; } });
    Object.defineProperty(exports, "getTokenInfo", { enumerable: true, get: function () { return token_1.getTokenInfo; } });
    Object.defineProperty(exports, "nullAddress", { enumerable: true, get: function () { return token_1.nullAddress; } });
    Object.defineProperty(exports, "registerSendTxEvents", { enumerable: true, get: function () { return token_1.registerSendTxEvents; } });
});
define("@scom/scom-nft-minter/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.readOnlyStyle = exports.comboBoxStyle = exports.formInputStyle = exports.linkStyle = exports.tokenSelectionStyle = exports.inputStyle = exports.markdownStyle = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    exports.markdownStyle = components_3.Styles.style({
        color: Theme.text.primary,
        overflowWrap: 'break-word'
    });
    exports.inputStyle = components_3.Styles.style({
        $nest: {
            '> input': {
                textAlign: 'right'
            }
        }
    });
    exports.tokenSelectionStyle = components_3.Styles.style({
        $nest: {
            // '.i-modal_header': {
            //   display: 'none'
            // },
            '#gridTokenList': {
                // maxHeight: '50vh',
                // overflow: 'auto',
                $nest: {
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar': {
                        width: '5px',
                        height: '5px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#FF8800',
                        borderRadius: '5px'
                    }
                }
            },
            // '#pnlSortBalance': {
            //   $nest: {
            //     '.icon-sort-up': {
            //       top: 1
            //     },
            //     '.icon-sort-down': {
            //       bottom: 1
            //     },
            //     'i-icon svg': {
            //       fill: 'inherit'
            //     }
            //   }
            // }
        }
    });
    exports.linkStyle = components_3.Styles.style({
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block',
        cursor: 'pointer',
        $nest: {
            '*': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
            },
        }
    });
    exports.formInputStyle = components_3.Styles.style({
        width: '100% !important',
        $nest: {
            '& > input': {
                height: '100% !important',
                width: '100% !important',
                maxWidth: '100%',
                padding: '0.5rem 1rem',
                color: Theme.input.fontColor,
                backgroundColor: Theme.input.background,
                borderColor: Theme.input.background,
                borderRadius: '0.625rem',
                outline: 'none'
            }
        }
    });
    exports.comboBoxStyle = components_3.Styles.style({
        width: '100% !important',
        height: 42,
        $nest: {
            '.selection': {
                width: '100% !important',
                maxWidth: '100%',
                padding: '0.5rem 1rem',
                color: Theme.input.fontColor,
                backgroundColor: Theme.input.background,
                borderColor: Theme.input.background,
                borderRadius: '0.625rem!important',
            },
            '.selection input': {
                color: 'inherit',
                backgroundColor: 'inherit',
                padding: 0
            },
            '> .icon-btn': {
                justifyContent: 'center',
                borderColor: Theme.input.background,
                borderRadius: '0.625rem',
                width: '42px'
            }
        }
    });
    exports.readOnlyStyle = components_3.Styles.style({
        opacity: 0.8,
        cursor: 'default',
        $nest: {
            '*': {
                cursor: 'default'
            }
        }
    });
});
define("@scom/scom-nft-minter/API.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-nft-minter/interface/index.tsx", "@scom/scom-product-contract", "@scom/scom-commission-proxy-contract", "@scom/oswap-troll-nft-contract", "@scom/scom-nft-minter/utils/index.ts", "@scom/scom-token-list", "@scom/scom-network-list"], function (require, exports, eth_wallet_3, index_4, scom_product_contract_2, scom_commission_proxy_contract_1, oswap_troll_nft_contract_1, index_5, scom_token_list_5, scom_network_list_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mintOswapTrollNft = exports.fetchUserNftBalance = exports.fetchOswapTrollNftInfo = exports.updateCommissionCampaign = exports.updateProductPrice = exports.updateProductUri = exports.getProductOwner = exports.subscribe = exports.donate = exports.buyProduct = exports.getProxyTokenAmountIn = exports.newDefaultBuyProduct = exports.createSubscriptionNFT = exports.newProduct = exports.updateDiscountRules = exports.getDiscountRules = exports.getProductIdFromEvent = exports.getProductId = exports.getNFTBalance = exports.getProductInfo = void 0;
    async function getProductInfo(state, productId) {
        let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
        if (!productMarketplaceAddress)
            return null;
        try {
            const wallet = state.getRpcWallet();
            const productMarketplace = new scom_product_contract_2.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
            const product = await productMarketplace.products(productId);
            const chainId = wallet.chainId;
            if (product.token && product.token === index_5.nullAddress) {
                let net = (0, scom_network_list_2.default)().find(net => net.chainId === chainId);
                return {
                    ...product,
                    token: {
                        chainId: wallet.chainId,
                        address: product.token,
                        decimals: net.nativeCurrency.decimals,
                        symbol: net.nativeCurrency.symbol,
                        name: net.nativeCurrency.symbol,
                    }
                };
            }
            const _tokenList = scom_token_list_5.tokenStore.getTokenList(chainId);
            let token = _tokenList.find(token => product.token && token.address && token.address.toLowerCase() === product.token.toLowerCase());
            if (!token && product.token) {
                token = await (0, index_5.getTokenInfo)(product.token, chainId);
            }
            return {
                ...product,
                token
            };
        }
        catch {
            return null;
        }
    }
    exports.getProductInfo = getProductInfo;
    async function getProductOwner(state, productId) {
        let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
        if (!productMarketplaceAddress)
            return null;
        try {
            const wallet = state.getRpcWallet();
            const productMarketplace = new scom_product_contract_2.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
            const owner = await productMarketplace.productOwner(productId);
            return owner;
        }
        catch {
            return null;
        }
    }
    exports.getProductOwner = getProductOwner;
    async function getNFTBalance(state, productId) {
        let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
        if (!productMarketplaceAddress)
            return null;
        try {
            const wallet = state.getRpcWallet();
            const productMarketplace = new scom_product_contract_2.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
            const product = await productMarketplace.products(productId);
            let nftBalance;
            if (product.productType.eq(1)) {
                // Subscription
                const subscriptionNFT = new scom_product_contract_2.Contracts.SubscriptionNFT(wallet, product.nft);
                nftBalance = await subscriptionNFT.balanceOf(wallet.address);
            }
            else {
                let oneTimePurchaseNFTAddress = state.getContractAddress('OneTimePurchaseNFT');
                if (!oneTimePurchaseNFTAddress)
                    return null;
                const oneTimePurchaseNFT = new scom_product_contract_2.Contracts.OneTimePurchaseNFT(wallet, oneTimePurchaseNFTAddress);
                nftBalance = await oneTimePurchaseNFT.balanceOf({ account: wallet.address, id: product.nftId });
            }
            return nftBalance.toFixed();
        }
        catch {
            return null;
        }
    }
    exports.getNFTBalance = getNFTBalance;
    async function getProductId(state, nftAddress, nftId) {
        let productId;
        try {
            const wallet = state.getRpcWallet();
            if (nftId != null) {
                const oneTimePurchaseNFT = new scom_product_contract_2.Contracts.OneTimePurchaseNFT(wallet, nftAddress);
                productId = (await oneTimePurchaseNFT.productIdByTokenId(nftId)).toNumber();
            }
            else {
                const subscriptionNFT = new scom_product_contract_2.Contracts.SubscriptionNFT(wallet, nftAddress);
                productId = (await subscriptionNFT.productId()).toNumber();
            }
        }
        catch {
            console.log("product id not found");
        }
        return productId;
    }
    exports.getProductId = getProductId;
    function getProductIdFromEvent(productMarketplaceAddress, receipt) {
        let productId;
        try {
            const wallet = eth_wallet_3.Wallet.getClientInstance();
            const productMarketplace = new scom_product_contract_2.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
            let event = productMarketplace.parseNewProductEvent(receipt)[0];
            productId = event?.productId.toNumber();
        }
        catch {
        }
        return productId;
    }
    exports.getProductIdFromEvent = getProductIdFromEvent;
    async function getDiscountRules(state, productId) {
        let discountRules = [];
        let promotionAddress = state.getContractAddress('Promotion');
        if (!promotionAddress)
            return discountRules;
        try {
            const wallet = state.getRpcWallet();
            const promotion = new scom_product_contract_2.Contracts.Promotion(wallet, promotionAddress);
            const ruleCount = await promotion.getDiscountRuleCount(productId);
            let contractCalls = [];
            for (let i = 0; i < ruleCount.toNumber(); i++) {
                contractCalls.push({
                    contract: promotion,
                    methodName: 'discountRules',
                    params: [productId, i],
                    to: promotionAddress
                });
            }
            if (contractCalls.length === 0)
                return discountRules;
            const multicallResults = await wallet.doMulticall(contractCalls);
            for (let i = 0; i < multicallResults.length; i++) {
                const multicallResult = multicallResults[i];
                if (!multicallResult)
                    continue;
                const discountRule = multicallResult;
                discountRules.push({
                    id: discountRule.id.toNumber(),
                    minDuration: discountRule.minDuration,
                    discountPercentage: discountRule.discountPercentage.toNumber(),
                    fixedPrice: eth_wallet_3.Utils.fromDecimals(discountRule.fixedPrice),
                    startTime: discountRule.startTime.toNumber(),
                    endTime: discountRule.endTime.toNumber(),
                    discountApplication: discountRule.discountApplication.toNumber()
                });
            }
        }
        catch (err) {
            console.error('failed to get discount rules');
        }
        return discountRules;
    }
    exports.getDiscountRules = getDiscountRules;
    async function updateDiscountRules(state, productId, rules, ruleIdsToDelete = [], callback, confirmationCallback) {
        let promotionAddress = state.getContractAddress('Promotion');
        if (!promotionAddress)
            throw new Error('Promotion contract not found');
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        const promotion = new scom_product_contract_2.Contracts.Promotion(wallet, promotionAddress);
        (0, index_5.registerSendTxEvents)({
            transactionHash: callback,
            confirmation: confirmationCallback
        });
        let receipt = await promotion.updateDiscountRules({
            productId,
            rules: rules || [],
            ruleIdsToDelete
        });
        return receipt;
    }
    exports.updateDiscountRules = updateDiscountRules;
    async function newProduct(productMarketplaceAddress, productType, quantity, // max quantity of this nft can be exist at anytime
    maxQuantity, // max quantity for one buy() txn
    price, maxPrice, //for donation only, no max price when it is 0
    tokenAddress, //Native token 0x0000000000000000000000000000000000000000
    tokenDecimals, uri, 
    //For Subscription
    nftName = '', nftSymbol = '', priceDuration = 0, callback, confirmationCallback) {
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        const productMarketplace = new scom_product_contract_2.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
        (0, index_5.registerSendTxEvents)({
            transactionHash: callback,
            confirmation: confirmationCallback
        });
        let productTypeCode;
        switch (productType) {
            case index_4.ProductType.Buy:
                productTypeCode = 0;
                break;
            case index_4.ProductType.Subscription:
                productTypeCode = 1;
                break;
            case index_4.ProductType.DonateToOwner:
                productTypeCode = 2;
                break;
            case index_4.ProductType.DonateToEveryone:
                productTypeCode = 3;
                break;
        }
        let receipt = await productMarketplace.newProduct({
            productType: productTypeCode,
            uri: uri || '',
            quantity: quantity,
            maxQuantity: maxQuantity,
            maxPrice: eth_wallet_3.Utils.toDecimals(maxPrice, tokenDecimals),
            price: eth_wallet_3.Utils.toDecimals(price, tokenDecimals),
            token: tokenAddress,
            priceDuration: priceDuration,
            nftName: nftName,
            nftSymbol: nftSymbol
        });
        return receipt;
    }
    exports.newProduct = newProduct;
    async function createSubscriptionNFT(productMarketplaceAddress, quantity, price, tokenAddress, tokenDecimals, uri, priceDuration = 0, callback, confirmationCallback) {
        return await newProduct(productMarketplaceAddress, index_4.ProductType.Subscription, quantity, quantity, price, "0", tokenAddress, tokenDecimals, uri, '', '', priceDuration, callback, confirmationCallback);
    }
    exports.createSubscriptionNFT = createSubscriptionNFT;
    async function newDefaultBuyProduct(productMarketplaceAddress, qty, // max quantity of this nft can be exist at anytime
    //maxQty = qty
    //maxQty: number, // max quantity for one buy() txn
    price, tokenAddress, tokenDecimals, uri, callback, confirmationCallback) {
        //hard requirement for the contract
        if (!( //tokenAddress is a valid address &&
        new eth_wallet_3.BigNumber(tokenDecimals).gt(0) &&
            new eth_wallet_3.BigNumber(qty).gt(0))) {
            console.log("newDefaultBuyProduct() error! require tokenDecimals and qty > 0");
            return;
        }
        if (!new eth_wallet_3.BigNumber(price).gt(0)) {
            //warn that it will be free to mint
            console.log("newDefaultBuyProduct() warning! price = 0");
        }
        return await newProduct(productMarketplaceAddress, index_4.ProductType.Buy, qty, qty, //maxQty
        price, "0", tokenAddress, tokenDecimals, uri, '', '', 0, callback, confirmationCallback);
    }
    exports.newDefaultBuyProduct = newDefaultBuyProduct;
    function getProxyTokenAmountIn(productPrice, quantity, commissions) {
        const amount = new eth_wallet_3.BigNumber(productPrice).isZero() ? new eth_wallet_3.BigNumber(quantity) : new eth_wallet_3.BigNumber(productPrice).times(quantity);
        if (!commissions || !commissions.length) {
            return amount.toFixed();
        }
        const _commissions = commissions.map(v => {
            return {
                to: v.walletAddress,
                amount: amount.times(v.share)
            };
        });
        const commissionsAmount = _commissions.map(v => v.amount).reduce((a, b) => a.plus(b));
        return amount.plus(commissionsAmount).toFixed();
    }
    exports.getProxyTokenAmountIn = getProxyTokenAmountIn;
    async function buyProduct(state, productId, quantity, commissions, token, callback, confirmationCallback) {
        let proxyAddress = state.getContractAddress('Proxy');
        let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        const proxy = new scom_commission_proxy_contract_1.Contracts.Proxy(wallet, proxyAddress);
        const productMarketplace = new scom_product_contract_2.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
        const product = await productMarketplace.products(productId);
        const amount = product.price.times(quantity);
        const _commissions = (commissions || []).filter(v => v.chainId === state.getChainId()).map(v => {
            return {
                to: v.walletAddress,
                amount: amount.times(v.share)
            };
        });
        const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)) : new eth_wallet_3.BigNumber(0);
        let receipt;
        try {
            (0, index_5.registerSendTxEvents)({
                transactionHash: callback,
                confirmation: confirmationCallback
            });
            if (token?.address && token?.address !== index_5.nullAddress) {
                if (commissionsAmount.isZero()) {
                    receipt = await productMarketplace.buy({
                        productId: productId,
                        quantity: quantity,
                        to: wallet.address
                    });
                }
                else {
                    const txData = await productMarketplace.buy.txData({
                        productId: productId,
                        quantity: quantity,
                        to: wallet.address
                    });
                    const tokensIn = {
                        token: token.address,
                        amount: amount.plus(commissionsAmount),
                        directTransfer: false,
                        commissions: _commissions
                    };
                    receipt = await proxy.tokenIn({
                        target: productMarketplaceAddress,
                        tokensIn,
                        data: txData
                    });
                }
            }
            else {
                if (commissionsAmount.isZero()) {
                    receipt = await productMarketplace.buy({
                        productId: productId,
                        quantity,
                        to: wallet.address
                    }, amount);
                }
                else {
                    const txData = await productMarketplace.buy.txData({
                        productId: productId,
                        quantity,
                        to: wallet.address
                    }, amount);
                    receipt = await proxy.ethIn({
                        target: productMarketplaceAddress,
                        commissions: _commissions,
                        data: txData
                    }, amount.plus(commissionsAmount));
                }
            }
        }
        catch (err) {
            console.error(err);
        }
        return receipt;
    }
    exports.buyProduct = buyProduct;
    async function donate(state, productId, donateTo, amountIn, commissions, token, callback, confirmationCallback) {
        let proxyAddress = state.getContractAddress('Proxy');
        let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        const proxy = new scom_commission_proxy_contract_1.Contracts.Proxy(wallet, proxyAddress);
        const productMarketplace = new scom_product_contract_2.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
        const tokenDecimals = token?.decimals || 18;
        const amount = eth_wallet_3.Utils.toDecimals(amountIn, tokenDecimals);
        const _commissions = (commissions || []).map(v => {
            return {
                to: v.walletAddress,
                amount: amount.times(v.share)
            };
        });
        const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)) : new eth_wallet_3.BigNumber(0);
        let receipt;
        try {
            (0, index_5.registerSendTxEvents)({
                transactionHash: callback,
                confirmation: confirmationCallback
            });
            if (token?.address) {
                if (commissionsAmount.isZero()) {
                    receipt = await productMarketplace.donate({
                        donor: wallet.address,
                        donee: donateTo,
                        productId: productId,
                        amountIn: amount
                    });
                }
                else {
                    const txData = await productMarketplace.donate.txData({
                        donor: wallet.address,
                        donee: donateTo,
                        productId: productId,
                        amountIn: amount
                    });
                    const tokensIn = {
                        token: token.address,
                        amount: amount.plus(commissionsAmount),
                        directTransfer: false,
                        commissions: _commissions
                    };
                    receipt = await proxy.tokenIn({
                        target: productMarketplaceAddress,
                        tokensIn,
                        data: txData
                    });
                }
            }
            else {
                if (commissionsAmount.isZero()) {
                    receipt = await productMarketplace.donate({
                        donor: wallet.address,
                        donee: donateTo,
                        productId: productId,
                        amountIn: 0
                    }, { value: amount });
                }
                else {
                    const txData = await productMarketplace.donate.txData({
                        donor: wallet.address,
                        donee: donateTo,
                        productId: productId,
                        amountIn: 0
                    }, { value: amount });
                    receipt = await proxy.ethIn({
                        target: productMarketplaceAddress,
                        commissions: _commissions,
                        data: txData
                    }, amount.plus(commissionsAmount));
                }
            }
        }
        catch (err) {
            console.error(err);
        }
        return receipt;
    }
    exports.donate = donate;
    async function subscribe(state, productId, startTime, duration, recipient, referrer, discountRuleId = 0, callback, confirmationCallback) {
        let commissionAddress = state.getContractAddress('Commission');
        let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        const commission = new scom_product_contract_2.Contracts.Commission(wallet, commissionAddress);
        const productMarketplace = new scom_product_contract_2.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
        const product = await productMarketplace.products(productId);
        let basePrice = product.price;
        if (discountRuleId !== 0) {
            let promotionAddress = state.getContractAddress('Promotion');
            const promotion = new scom_product_contract_2.Contracts.Promotion(wallet, promotionAddress);
            const index = await promotion.discountRuleIdToIndex({ param1: productId, param2: discountRuleId });
            const rule = await promotion.discountRules({ param1: productId, param2: index });
            if (rule.discountPercentage.gt(0)) {
                const discount = product.price.times(rule.discountPercentage).div(100);
                if (product.price.gt(discount))
                    basePrice = product.price.minus(discount);
            }
            else if (rule.fixedPrice.gt(0)) {
                basePrice = rule.fixedPrice;
            }
            else {
                discountRuleId = 0;
            }
        }
        const amount = product.priceDuration.eq(duration) ? basePrice : basePrice.times(duration).div(product.priceDuration);
        let tokenInAmount;
        if (referrer) {
            let campaign = await commission.getCampaign({ campaignId: productId, returnArrays: true });
            const affiliates = (campaign?.affiliates || []).map(a => a.toLowerCase());
            if (affiliates.includes(referrer.toLowerCase())) {
                const commissionRate = eth_wallet_3.Utils.fromDecimals(campaign.commissionRate, 6);
                tokenInAmount = new eth_wallet_3.BigNumber(amount).dividedBy(new eth_wallet_3.BigNumber(1).minus(commissionRate)).decimalPlaces(0);
            }
        }
        let receipt;
        try {
            (0, index_5.registerSendTxEvents)({
                transactionHash: callback,
                confirmation: confirmationCallback
            });
            if (product.token === index_5.nullAddress) {
                if (!tokenInAmount || tokenInAmount.isZero()) {
                    receipt = await productMarketplace.subscribe({
                        to: recipient || wallet.address,
                        productId: productId,
                        startTime: startTime,
                        duration: duration,
                        discountRuleId: discountRuleId
                    }, amount);
                }
                else {
                    const txData = await productMarketplace.subscribe.txData({
                        to: recipient || wallet.address,
                        productId: productId,
                        startTime: startTime,
                        duration: duration,
                        discountRuleId: discountRuleId
                    }, amount);
                    receipt = await commission.proxyCall({
                        affiliate: referrer,
                        campaignId: productId,
                        amount: tokenInAmount,
                        data: txData
                    }, tokenInAmount);
                }
            }
            else {
                if (!tokenInAmount || tokenInAmount.isZero()) {
                    receipt = await productMarketplace.subscribe({
                        to: recipient || wallet.address,
                        productId: productId,
                        startTime: startTime,
                        duration: duration,
                        discountRuleId: discountRuleId
                    });
                }
                else {
                    const txData = await productMarketplace.subscribe.txData({
                        to: recipient || wallet.address,
                        productId: productId,
                        startTime: startTime,
                        duration: duration,
                        discountRuleId: discountRuleId
                    });
                    receipt = await commission.proxyCall({
                        affiliate: referrer,
                        campaignId: productId,
                        amount: tokenInAmount,
                        data: txData
                    });
                }
            }
        }
        catch (err) {
            console.error(err);
        }
        return receipt;
    }
    exports.subscribe = subscribe;
    async function updateCommissionCampaign(state, productId, commissionRate, affiliates, callback, confirmationCallback) {
        let commissionAddress = state.getContractAddress('Commission');
        let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        const commission = new scom_product_contract_2.Contracts.Commission(wallet, commissionAddress);
        const productMarketplace = new scom_product_contract_2.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
        let selectors = ["subscribe"];
        selectors = selectors.map(e => e + "(" + productMarketplace._abi.filter(f => f.name == e)[0].inputs.map(f => f.type).join(',') + ")");
        selectors = selectors.map(e => wallet.soliditySha3(e).substring(0, 10));
        let campaign = {
            id: productId,
            affiliatesRequireApproval: true,
            selectors: selectors,
            commissionRate: eth_wallet_3.Utils.toDecimals(commissionRate, 6),
            affiliates: affiliates
        };
        let receipt;
        try {
            (0, index_5.registerSendTxEvents)({
                transactionHash: callback,
                confirmation: confirmationCallback
            });
            receipt = await commission.updateCampaign(campaign);
        }
        catch (err) {
            console.error(err);
        }
        return receipt;
    }
    exports.updateCommissionCampaign = updateCommissionCampaign;
    async function updateProductUri(productMarketplaceAddress, productId, uri) {
        let wallet = eth_wallet_3.Wallet.getClientInstance();
        const productMarketplace = new scom_product_contract_2.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
        const receipt = await productMarketplace.updateProductUri({ productId, uri });
        return receipt;
    }
    exports.updateProductUri = updateProductUri;
    async function updateProductPrice(productMarketplaceAddress, productId, price, tokenDecimals) {
        let wallet = eth_wallet_3.Wallet.getClientInstance();
        const productMarketplace = new scom_product_contract_2.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
        const receipt = await productMarketplace.updateProductPrice({ productId, price: (0, eth_wallet_3.BigNumber)(price).shiftedBy(tokenDecimals) });
        return receipt;
    }
    exports.updateProductPrice = updateProductPrice;
    //
    //    ERC721 and oswap troll nft 
    //
    async function fetchUserNftBalance(state, address) {
        if (!address)
            return null;
        try {
            const wallet = state.getRpcWallet();
            const erc721 = new oswap_troll_nft_contract_1.Contracts.ERC721(wallet, address);
            const nftBalance = await erc721.balanceOf(wallet.address);
            return nftBalance.toFixed();
        }
        catch {
            return null;
        }
    }
    exports.fetchUserNftBalance = fetchUserNftBalance;
    async function mintOswapTrollNft(address, callback) {
        if (!address)
            return null;
        try {
            const wallet = eth_wallet_3.Wallet.getClientInstance();
            const trollNft = new oswap_troll_nft_contract_1.Contracts.TrollNFT(wallet, address);
            let calls = [
                {
                    contract: trollNft,
                    methodName: 'minimumStake',
                    params: [],
                    to: address
                },
                {
                    contract: trollNft,
                    methodName: 'protocolFee',
                    params: [],
                    to: address
                }
            ];
            let [stake, mintFee] = await wallet.doMulticall(calls) || [];
            const receipt = await trollNft.stake(mintFee.plus(stake));
            return receipt;
        }
        catch (e) {
            callback(e);
            return null;
        }
    }
    exports.mintOswapTrollNft = mintOswapTrollNft;
    async function fetchOswapTrollNftInfo(state, address) {
        if (!address)
            return null;
        try {
            const wallet = state.getRpcWallet();
            const trollNft = new oswap_troll_nft_contract_1.Contracts.TrollNFT(wallet, address);
            let calls = [
                {
                    contract: trollNft,
                    methodName: 'minimumStake',
                    params: [],
                    to: address
                },
                {
                    contract: trollNft,
                    methodName: 'cap',
                    params: [],
                    to: address
                },
                {
                    contract: trollNft,
                    methodName: 'totalSupply',
                    params: [],
                    to: address
                },
                {
                    contract: trollNft,
                    methodName: 'protocolFee',
                    params: [],
                    to: address
                },
                {
                    contract: trollNft,
                    methodName: 'stakeToken',
                    params: [],
                    to: address
                },
            ];
            let [stake, cap, totalSupply, mintFee, stakeToken] = await wallet.doMulticall(calls) || [];
            return {
                cap: cap.minus(totalSupply),
                price: mintFee.plus(stake).shiftedBy(-18),
                tokenAddress: stakeToken
            };
        }
        catch {
            return null;
        }
    }
    exports.fetchOswapTrollNftInfo = fetchOswapTrollNftInfo;
});
define("@scom/scom-nft-minter/data.json.ts", ["require", "exports", "@scom/scom-nft-minter/utils/index.ts"], function (require, exports, index_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "infuraId": "adc596bf88b648e2a8902bc9093930c5",
        "contractInfo": {
            "97": {
                "ProductMarketplace": {
                    "address": "0x93e684ad2AEE178e23675fbE5bA88c3e4e7467f4"
                },
                "OneTimePurchaseNFT": {
                    "address": "0x5aE9c7f08572D52e2DB8508B502D767A1ECf21Bf"
                },
                "SubscriptionNFTFactory": {
                    "address": "0x0055e4edb49425A29784Bd9a7986F5b56dcc8f6b"
                },
                "Promotion": {
                    "address": "0x13d23201a8A6661881d701E1cF56A30A8eb0aE90"
                },
                "Commission": {
                    "address": "0xcdc39C8bC8F9fDAF31D79f461B47477606770c62"
                },
                "Proxy": {
                    "address": "0x9602cB9A782babc72b1b6C96E050273F631a6870"
                },
            },
            "43113": {
                "ProductMarketplace": {
                    "address": "0xeC3747eAbf71D4BDF15Abb70398C04B642363D10"
                },
                "OneTimePurchaseNFT": {
                    "address": "0x404eeCC44F7aFc1f7561b2A9bC475513206D4b15"
                },
                "SubscriptionNFTFactory": {
                    "address": "0x9231761Bd5f32c8f6465d82168BAdaB109D23290"
                },
                "Promotion": {
                    "address": "0x22786FF4E595f1B517242549ec1D263e62dc6F26"
                },
                "Commission": {
                    "address": "0x2Ed01CB805e7f52c92cfE9eC02E7Dc899cA53BCa"
                },
                "Proxy": {
                    "address": "0x7f1EAB0db83c02263539E3bFf99b638E61916B96"
                },
            }
        },
        "embedderCommissionFee": "0",
        "defaultBuilderData": {
            "defaultChainId": 43113,
            "networks": [
                {
                    "chainId": 43113
                },
                {
                    "chainId": 97
                }
            ],
            "wallets": [
                {
                    "name": "metamask"
                }
            ]
        },
        "defaultExistingNft": {
            "chainId": 43113,
            "nftType": "ERC1155",
            "nftAddress": "0xDB301a9Ef98843376C835aFB41608d6A319e138D",
            "erc1155Index": 1
        },
        "defaultCreate1155Index": {
            "chainId": 43113,
            "tokenToMint": index_6.nullAddress
        },
        "defaultOswapTroll": {
            "chainId": 43113,
            "nftType": "ERC721",
            "nftAddress": "0x390118aa8bde8c63f159a0d032dbdc8bed83ef42",
        },
    };
});
define("@scom/scom-nft-minter/component/fieldUpdate.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-nft-minter/index.css.ts", "@scom/scom-nft-minter/API.ts", "@scom/scom-nft-minter/store/index.ts", "@ijstech/eth-wallet", "@scom/scom-nft-minter/utils/index.ts"], function (require, exports, components_4, index_css_1, API_1, index_7, eth_wallet_4, index_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomNftMinterFieldUpdate = void 0;
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomNftMinterFieldUpdate = class ScomNftMinterFieldUpdate extends components_4.Module {
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        constructor(parent, options) {
            super(parent, options);
            this.rpcWalletEvents = [];
        }
        get value() {
            return this.inputField?.value || '';
        }
        set value(val) {
            if (this.inputField) {
                this.inputField.value = val || '';
            }
        }
        get rpcWallet() {
            return this.state.getRpcWallet();
        }
        async resetRpcWallet() {
            this.updateButton();
            this.removeRpcWalletEvents();
            const rpcWallet = this.rpcWallet;
            const chainChangedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_4.Constants.RpcWalletEvent.ChainChanged, async (chainId) => {
                this.updateButton();
            });
            const connectedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_4.Constants.RpcWalletEvent.Connected, async (connected) => {
                this.updateButton();
            });
            this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);
        }
        removeRpcWalletEvents() {
            const rpcWallet = this.rpcWallet;
            for (let event of this.rpcWalletEvents) {
                rpcWallet.unregisterWalletEvent(event);
            }
            this.rpcWalletEvents = [];
        }
        onHide() {
            this.removeRpcWalletEvents();
        }
        async onUpdate() {
            const data = await this.getData();
            const { erc1155Index, nftAddress, chainId } = data;
            if (!(0, index_7.isClientWalletConnected)()) {
                this.connectWallet();
                return;
            }
            if (!this.state.isRpcWalletConnected()) {
                const clientWallet = eth_wallet_4.Wallet.getClientInstance();
                await clientWallet.switchNetwork(chainId);
                return;
            }
            if (!chainId) {
                this.showTxStatusModal('error', `Missing Chain!`);
                return;
            }
            if (!nftAddress) {
                this.showTxStatusModal('error', `Missing NFT Address!`);
                return;
            }
            if (!erc1155Index) {
                this.showTxStatusModal('error', `Missing Index!`);
                return;
            }
            const owner = await (0, API_1.getProductOwner)(this.state, erc1155Index);
            if (owner !== eth_wallet_4.Wallet.getClientInstance().address) {
                this.showTxStatusModal('error', `You are not the owner`);
                return;
            }
            const callback = (err, receipt) => {
                if (err) {
                    this.showTxStatusModal('error', err);
                }
                else if (receipt) {
                    this.showTxStatusModal('success', receipt);
                    this.updateEnabledInput(false);
                }
            };
            const confirmationCallback = async (receipt) => {
                this.updateEnabledInput(true);
                this.refreshUI();
            };
            (0, index_8.registerSendTxEvents)({
                transactionHash: callback,
                confirmation: confirmationCallback
            });
            const value = this.inputField.value;
            const text = `${this.isUri ? 'URI' : 'price'}`;
            try {
                this.showTxStatusModal('warning', `Updating ${text}`);
                if (this.isUri) {
                    await (0, API_1.updateProductUri)(nftAddress, erc1155Index, value);
                }
                else {
                    const productInfo = await (0, API_1.getProductInfo)(this.state, erc1155Index);
                    if (productInfo) {
                        const decimals = productInfo.token?.decimals || 18;
                        await (0, API_1.updateProductPrice)(nftAddress, erc1155Index, value, decimals);
                    }
                }
            }
            catch (e) {
                console.log(`Update ${text}`, e);
                this.showTxStatusModal('error', `Something went wrong when updating ${text}!`);
            }
            this.updateEnabledInput(true);
        }
        async onInputChanged() {
            this.updateButton();
        }
        updateEnabledInput(enabled) {
            this.inputField.enabled = enabled;
            this.btnUpdate.enabled = enabled;
            this.btnUpdate.rightIcon.spin = !enabled;
            this.btnUpdate.rightIcon.visible = !enabled;
        }
        async updateButton() {
            if (!(0, index_7.isClientWalletConnected)() || !this.state.isRpcWalletConnected()) {
                this.btnUpdate.enabled = true;
                this.btnUpdate.caption = (0, index_7.isClientWalletConnected)() ? 'Switch Network' : 'Connect Wallet';
            }
            else {
                // const data = await this.getData();
                // const { chainId, erc1155Index, nftAddress } = data;
                // this.btnUpdate.enabled = !!(chainId && erc1155Index && nftAddress && this.inputField.value);
                this.btnUpdate.enabled = !!this.inputField.value;
                this.btnUpdate.caption = 'Update';
            }
        }
        async getData() {
            const form = this.closest('i-form');
            const data = await form.getFormData();
            return data;
        }
        init() {
            super.init();
            this.refreshUI = this.getAttribute('refreshUI', true);
            this.connectWallet = this.getAttribute('connectWallet', true);
            this.showTxStatusModal = this.getAttribute('showTxStatusModal', true);
            this.state = this.getAttribute('state', true);
            this.isUri = this.getAttribute('isUri', true);
            this.inputField.inputType = this.isUri ? 'text' : 'number';
            this.inputField.value = this.getAttribute('value', true, '');
            this.resetRpcWallet();
        }
        render() {
            return (this.$render("i-hstack", { gap: "0.5rem", verticalAlignment: "center", wrap: "wrap" },
                this.$render("i-input", { id: "inputField", width: "100%", minWidth: "140px", maxWidth: "calc(100% - 148px)", height: "42px", class: index_css_1.formInputStyle, onChanged: this.onInputChanged }),
                this.$render("i-button", { id: "btnUpdate", width: 140, height: 42, padding: { left: '0.5rem', right: '0.5rem' }, margin: { left: 'auto' }, background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText }, border: { radius: '0.5rem' }, enabled: false, caption: "Update", onClick: this.onUpdate })));
        }
    };
    ScomNftMinterFieldUpdate = __decorate([
        (0, components_4.customElements)('i-scom-nft-minter-field-update')
    ], ScomNftMinterFieldUpdate);
    exports.ScomNftMinterFieldUpdate = ScomNftMinterFieldUpdate;
});
define("@scom/scom-nft-minter/component/priceInput.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-nft-minter/index.css.ts"], function (require, exports, components_5, index_css_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomNftMinterPriceInput = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    let ScomNftMinterPriceInput = class ScomNftMinterPriceInput extends components_5.Module {
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        constructor(parent, options) {
            super(parent, options);
        }
        get value() {
            const val = this.inputField?.value;
            return this.isNumber(val) ? Number(val) : undefined;
        }
        set value(val) {
            if (this.inputField) {
                this.inputField.value = val;
            }
        }
        set isUnitShown(val) {
            if (this.lbUnit) {
                this.lbUnit.visible = val;
            }
            if (this.inputField) {
                this.inputField.maxWidth = val ? 'calc(100% - 60px)' : '100%';
            }
        }
        onChanged() {
        }
        isNumber(value) {
            if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
                return false;
            }
            return true;
        }
        init() {
            super.init();
            const val = this.getAttribute('value', true);
            if (val)
                this.inputField.value = val;
            this.isUnitShown = this.getAttribute('isUnitShown', true, false);
        }
        render() {
            return (this.$render("i-hstack", { verticalAlignment: "center" },
                this.$render("i-input", { id: "inputField", inputType: "number", width: "100%", minWidth: "100px", height: "42px", class: index_css_2.formInputStyle, onChanged: this.onChanged }),
                this.$render("i-label", { id: "lbUnit", caption: "Per Day", visible: false, margin: { left: '0.5rem' }, font: { color: Theme.text.primary }, stack: { shrink: '0' } })));
        }
    };
    ScomNftMinterPriceInput = __decorate([
        (0, components_5.customElements)('i-scom-nft-minter-price-input')
    ], ScomNftMinterPriceInput);
    exports.ScomNftMinterPriceInput = ScomNftMinterPriceInput;
});
define("@scom/scom-nft-minter/component/addressInput.tsx", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-nft-minter/API.ts", "@scom/scom-nft-minter/index.css.ts"], function (require, exports, components_6, eth_wallet_5, API_2, index_css_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomNftMinterAddressInput = void 0;
    const Theme = components_6.Styles.Theme.ThemeVars;
    let ScomNftMinterAddressInput = class ScomNftMinterAddressInput extends components_6.Module {
        constructor() {
            super(...arguments);
            this.isInfoParentUpdated = false;
        }
        get nftType() {
            return this._nftType;
        }
        set nftType(value) {
            this._nftType = value;
        }
        get nftId() {
            return this._nftId;
        }
        set nftId(value) {
            this._nftId = value;
        }
        get value() {
            return this.edtAddress.value;
        }
        set value(val) {
            if (this.edtAddress)
                this.edtAddress.value = val;
        }
        init() {
            super.init();
            this.state = this.getAttribute('state', true);
            const val = this.getAttribute('value', true);
            if (val)
                this.edtAddress.value = val;
            const readOnly = this.getAttribute('readOnly', true, false);
            this.edtAddress.readOnly = readOnly;
            if (readOnly) {
                this.edtAddress.classList.add(index_css_3.readOnlyStyle);
                this.lblPaymentModel.classList.add(index_css_3.readOnlyStyle);
                this.lblPriceToMint.classList.add(index_css_3.readOnlyStyle);
            }
        }
        handleAddressChanged() {
            if (this['onChanged'])
                this['onChanged']();
            if (this.timeout)
                clearTimeout(this.timeout);
            this.pnlProductInfo.visible = false;
            if (!this.edtAddress.value || !this.nftType || (this.nftType === 'ERC1155' && !this.nftId))
                return;
            this.timeout = setTimeout(async () => {
                const wallet = this.state.getRpcWallet();
                if (!wallet.isAddress(this.edtAddress.value))
                    return;
                const productId = await (0, API_2.getProductId)(this.state, this.edtAddress.value, this.nftType === 'ERC1155' ? this.nftId : undefined);
                if (!this.isInfoParentUpdated) {
                    this.isInfoParentUpdated = true;
                    const currentFromGroup = this.closest('.form-group');
                    const indexFormGroup = currentFromGroup.nextElementSibling || currentFromGroup;
                    if (indexFormGroup)
                        indexFormGroup.after(this.pnlProductInfo);
                }
                this.pnlProductInfo.visible = !!productId;
                if (productId) {
                    const productInfo = await (0, API_2.getProductInfo)(this.state, productId);
                    const isSubscription = productInfo.productType.toNumber() === 1;
                    this.lblPaymentModel.caption = isSubscription ? 'Subscription' : 'One-Time Purchase';
                    const price = components_6.FormatUtils.formatNumber(eth_wallet_5.Utils.fromDecimals(productInfo.price, productInfo.token.decimals).toFixed(), { minValue: '0.0000001', hasTrailingZero: false });
                    const symbol = productInfo.token?.symbol || '';
                    this.lblPriceToMint.caption = `${price} ${symbol} ${isSubscription ? 'per day' : ''}`;
                }
            });
        }
        render() {
            this.$render("i-stack", { direction: "vertical" },
                this.$render("i-input", { id: "edtAddress", width: "100%", minWidth: "100px", height: 42, class: index_css_3.formInputStyle, onChanged: this.handleAddressChanged }),
                this.$render("i-stack", { id: "pnlProductInfo", direction: "vertical", width: "100%", visible: false },
                    this.$render("i-panel", { padding: { top: 5, bottom: 5, left: 5, right: 5 } },
                        this.$render("i-stack", { direction: "vertical", width: "100%", justifyContent: "center", gap: 5 },
                            this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", gap: 2 },
                                this.$render("i-label", { caption: "Payment Model" })),
                            this.$render("i-stack", { direction: "horizontal", alignItems: "center", width: "100%", height: 42, background: { color: Theme.input.background }, border: { width: 0.5, style: 'solid', color: Theme.input.background, radius: '0.625rem' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' } },
                                this.$render("i-label", { id: "lblPaymentModel", font: { color: Theme.input.fontColor } })))),
                    this.$render("i-panel", { padding: { top: 5, bottom: 5, left: 5, right: 5 } },
                        this.$render("i-stack", { direction: "vertical", width: "100%", justifyContent: "center", gap: 5 },
                            this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", gap: 2 },
                                this.$render("i-label", { caption: "Subscription Price" }),
                                this.$render("i-icon", { width: "1rem", height: "1rem", margin: { left: 2 }, name: "info-circle", tooltip: { content: 'Amount of token to pay for the subscription', placement: 'bottom' } })),
                            this.$render("i-stack", { direction: "horizontal", alignItems: "center", width: "100%", height: 42, background: { color: Theme.input.background }, border: { width: 0.5, style: 'solid', color: Theme.input.background, radius: '0.625rem' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' } },
                                this.$render("i-label", { id: "lblPriceToMint", font: { color: Theme.input.fontColor } }))))));
        }
    };
    ScomNftMinterAddressInput = __decorate([
        (0, components_6.customElements)('i-scom-nft-minter-address-input')
    ], ScomNftMinterAddressInput);
    exports.ScomNftMinterAddressInput = ScomNftMinterAddressInput;
});
define("@scom/scom-nft-minter/component/index.ts", ["require", "exports", "@scom/scom-nft-minter/component/fieldUpdate.tsx", "@scom/scom-nft-minter/component/priceInput.tsx", "@scom/scom-nft-minter/component/addressInput.tsx"], function (require, exports, fieldUpdate_1, priceInput_1, addressInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomNftMinterAddressInput = exports.ScomNftMinterPriceInput = exports.ScomNftMinterFieldUpdate = void 0;
    Object.defineProperty(exports, "ScomNftMinterFieldUpdate", { enumerable: true, get: function () { return fieldUpdate_1.ScomNftMinterFieldUpdate; } });
    Object.defineProperty(exports, "ScomNftMinterPriceInput", { enumerable: true, get: function () { return priceInput_1.ScomNftMinterPriceInput; } });
    Object.defineProperty(exports, "ScomNftMinterAddressInput", { enumerable: true, get: function () { return addressInput_1.ScomNftMinterAddressInput; } });
});
define("@scom/scom-nft-minter/formSchema.json.ts", ["require", "exports", "@scom/scom-network-picker", "@scom/scom-token-input", "@ijstech/components", "@scom/scom-nft-minter/index.css.ts", "@scom/scom-nft-minter/utils/index.ts", "@scom/scom-nft-minter/store/index.ts", "@scom/scom-nft-minter/component/index.ts", "@scom/scom-nft-minter/interface/index.tsx"], function (require, exports, scom_network_picker_1, scom_token_input_1, components_7, index_css_4, index_9, index_10, index_11, index_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProjectOwnerSchema3 = exports.getProjectOwnerSchema2 = exports.getProjectOwnerSchema1 = exports.getBuilderSchema = void 0;
    const chainIds = [97, 43113];
    const networks = chainIds.map(v => { return { chainId: v }; });
    const getSupportedTokens = (chainId) => {
        return index_10.SupportedERC20Tokens[chainId] || [];
    };
    const payment = [
        {
            label: 'One-Time Purchase',
            value: index_12.PaymentModel.OneTimePurchase
        },
        {
            label: 'Subscription',
            value: index_12.PaymentModel.Subscription
        }
    ];
    const nftTypes = [
        {
            label: 'ERC721',
            value: 'ERC721'
        },
        {
            label: 'ERC1155',
            value: 'ERC1155'
        },
    ];
    const theme = {
        backgroundColor: {
            type: 'string',
            format: 'color'
        },
        fontColor: {
            type: 'string',
            format: 'color'
        },
        inputBackgroundColor: {
            type: 'string',
            format: 'color'
        },
        inputFontColor: {
            type: 'string',
            format: 'color'
        }
    };
    const themeUISchema = {
        type: 'Category',
        label: 'Theme',
        elements: [
            {
                type: 'VerticalLayout',
                elements: [
                    {
                        type: 'Group',
                        label: 'Dark',
                        elements: [
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/dark/properties/backgroundColor'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/dark/properties/fontColor'
                                    }
                                ]
                            },
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/dark/properties/inputBackgroundColor'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/dark/properties/inputFontColor'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'Group',
                        label: 'Light',
                        elements: [
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/light/properties/backgroundColor'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/light/properties/fontColor'
                                    }
                                ]
                            },
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/light/properties/inputBackgroundColor'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/light/properties/inputFontColor'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
    function getBuilderSchema() {
        return {
            dataSchema: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string'
                    },
                    description: {
                        type: 'string',
                        format: 'multi'
                    },
                    logoUrl: {
                        type: 'string',
                        title: 'Logo URL'
                    },
                    link: {
                        type: 'string'
                    },
                    dark: {
                        type: 'object',
                        properties: theme
                    },
                    light: {
                        type: 'object',
                        properties: theme
                    }
                }
            },
            uiSchema: {
                type: 'Categorization',
                elements: [
                    {
                        type: 'Category',
                        label: 'General',
                        elements: [
                            {
                                type: 'VerticalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/title'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/description'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/logoUrl'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/link'
                                    }
                                ]
                            }
                        ]
                    },
                    themeUISchema
                ]
            }
        };
    }
    exports.getBuilderSchema = getBuilderSchema;
    function getProjectOwnerSchema(isDonation) {
        const dataSchema = {
            type: 'object',
            properties: {
                nftType: {
                    type: 'string',
                    title: 'NFT Type',
                    enum: [
                        '',
                        'ERC721',
                        'ERC1155',
                        //'ERC1155NewIndex' // for now it is always productType.buy
                    ]
                },
                chainId: {
                    type: 'number',
                    title: 'Chain',
                    enum: chainIds,
                    required: true
                },
                nftAddress: {
                    type: 'string',
                    title: 'Custom NFT Address',
                },
                erc1155Index: {
                    type: 'integer',
                    title: 'Index',
                    tooltip: 'The index of your NFT inside the ERC1155 contract',
                    minimum: 1,
                },
                tokenToMint: {
                    type: 'string',
                    title: 'Currency',
                    tooltip: 'Token to pay for the subscription',
                },
                priceToMint: {
                    title: 'Price',
                    type: 'number',
                    tooltip: 'Amount of token to pay for the subscription',
                },
                maxQty: {
                    type: 'integer',
                    title: 'Max Subscription Allowed',
                    tooltip: 'Max quantity of this subscription existing',
                    minimum: 1,
                },
                /*
                txnMaxQty: {//for 1155 new index only
                    type: 'integer',
                    title: 'Max Quantity per Mint',
                    tooltip: 'Max quantity for each transaction',
                    minimum: 1,
                },
                */
                dark: {
                    type: 'object',
                    properties: theme
                },
                light: {
                    type: 'object',
                    properties: theme
                }
            }
        };
        const donateElements = [];
        if (isDonation) {
            dataSchema.properties["recipient"] = {
                type: 'string',
                format: 'wallet-address'
            };
            donateElements.push({
                type: 'Control',
                scope: '#/properties/recipient',
            });
        }
        return {
            dataSchema: dataSchema,
            uiSchema: {
                type: 'Categorization',
                elements: [
                    {
                        type: 'Category',
                        label: 'General',
                        elements: [
                            {
                                type: 'VerticalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/chainId'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/tokenToMint',
                                        rule: {
                                            effect: 'HIDE',
                                            condition: {
                                                scope: '#/properties/nftType',
                                                schema: {
                                                    enum: ['ERC721', 'ERC1155']
                                                }
                                            }
                                        }
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/priceToMint',
                                        rule: {
                                            effect: 'HIDE',
                                            condition: {
                                                scope: '#/properties/nftType',
                                                schema: {
                                                    enum: ['ERC721', 'ERC1155']
                                                }
                                            }
                                        }
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/maxQty',
                                        rule: {
                                            effect: 'HIDE',
                                            condition: {
                                                scope: '#/properties/nftType',
                                                schema: {
                                                    enum: ['ERC721', 'ERC1155']
                                                }
                                            }
                                        }
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        type: 'Category',
                        label: 'Advance',
                        elements: [
                            {
                                type: 'VerticalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/nftType'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/nftAddress'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/erc1155Index',
                                        rule: {
                                            effect: 'SHOW',
                                            condition: {
                                                scope: '#/properties/nftType',
                                                schema: {
                                                    const: 'ERC1155'
                                                }
                                            }
                                        }
                                    },
                                    /**
                                    {
                                        type: 'Control',
                                        scope: '#/properties/txnMaxQty',
                                        rule: {
                                            effect: 'SHOW',
                                            condition: {
                                                scope: '#/properties/nftType',
                                                schema: {
                                                    const: 'ERC1155NewIndex'
                                                }
                                            }
                                        }
                                    },
                                    */
                                    //...donateElements,
                                ]
                            }
                        ]
                    },
                    //themeUISchema
                ]
            },
            customControls() {
                return getCustomControls();
            }
        };
    }
    //1155NewIndex
    function getProjectOwnerSchema1(isPolicy) {
        const properties = {
            chainId: {
                type: 'number',
                title: 'Chain',
                enum: chainIds,
                required: true
            },
            tokenToMint: {
                type: 'string',
                title: 'Currency',
                tooltip: 'Token to pay for the subscription',
                required: true
            },
            customMintToken: {
                type: 'string',
                title: 'Currency Address',
                tooltip: 'Token address to pay for the subscription',
                required: true
            },
            priceToMint: {
                type: 'number',
                title: 'Subscription Price',
                tooltip: 'Amount of token to pay for the subscription',
                required: true
            },
            uri: {
                type: 'string',
                title: isPolicy ? 'Image Link' : 'URI',
                tooltip: isPolicy ? 'An image to represent the token' : 'Usually a link of an image to represent the NFT'
            },
            paymentModel: {
                type: 'string',
                title: 'Payment Model',
                oneOf: [
                    {
                        title: 'One-Time Purchase',
                        const: index_12.PaymentModel.OneTimePurchase
                    },
                    {
                        title: 'Subscription',
                        const: index_12.PaymentModel.Subscription
                    }
                ],
                required: true
            },
            dark: {
                type: 'object',
                properties: theme
            },
            light: {
                type: 'object',
                properties: theme
            }
        };
        const elements = [
            {
                type: 'HorizontalLayout',
                elements: [
                    {
                        type: 'Control',
                        scope: '#/properties/chainId'
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/tokenToMint'
                    }
                ]
            },
            {
                type: 'Control',
                scope: '#/properties/customMintToken',
                rule: {
                    effect: 'ENABLE',
                    condition: {
                        scope: '#/properties/tokenToMint',
                        schema: {
                            const: scom_token_input_1.CUSTOM_TOKEN.address
                        }
                    }
                }
            },
            {
                type: 'Control',
                scope: '#/properties/paymentModel',
            },
            {
                type: 'Control',
                scope: '#/properties/priceToMint',
            },
            {
                type: 'Control',
                scope: '#/properties/uri',
            }
        ];
        if (!isPolicy) {
            properties['maxQty'] = {
                type: 'integer',
                title: 'Max Subscription Allowed',
                tooltip: 'Max quantity of this subscription existing',
                minimum: 1,
                required: true
            };
            elements.splice(elements.length - 1, 0, {
                type: 'Control',
                scope: '#/properties/maxQty',
            });
        }
        return {
            dataSchema: {
                type: 'object',
                properties: properties
            },
            uiSchema: {
                type: 'VerticalLayout',
                elements: elements
            },
            customControls() {
                return getCustomControls(true);
            }
        };
    }
    exports.getProjectOwnerSchema1 = getProjectOwnerSchema1;
    //existing custom721 or custom1155
    function getProjectOwnerSchema2(state, readonly, isPolicy, functions) {
        let cbbNftType;
        let addressInput;
        let edtNftId;
        return {
            dataSchema: {
                type: 'object',
                properties: {
                    nftType: {
                        type: 'string',
                        title: 'NFT Type',
                        enum: [
                            'ERC721',
                            'ERC1155',
                        ],
                        readonly,
                        required: true
                    },
                    chainId: {
                        type: 'number',
                        title: 'Chain',
                        enum: chainIds,
                        readonly,
                        required: true
                    },
                    nftAddress: {
                        type: 'string',
                        title: 'Custom NFT Address',
                        readonly,
                        required: true
                    },
                    erc1155Index: {
                        type: 'integer',
                        title: 'Index',
                        tooltip: 'The index of your NFT inside the ERC1155 contract',
                        minimum: 1,
                        readonly
                    },
                    newPrice: {
                        type: 'number',
                        title: 'Update Price To',
                    },
                    newUri: {
                        type: 'string',
                        title: isPolicy ? 'Update Image Link To' : 'Update URI To',
                    },
                    dark: {
                        type: 'object',
                        properties: theme
                    },
                    light: {
                        type: 'object',
                        properties: theme
                    }
                }
            },
            uiSchema: {
                type: 'VerticalLayout',
                elements: [
                    {
                        type: 'Control',
                        scope: '#/properties/chainId'
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/nftType'
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/nftAddress'
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/erc1155Index',
                        rule: {
                            effect: 'SHOW',
                            condition: {
                                scope: '#/properties/nftType',
                                schema: {
                                    const: 'ERC1155'
                                }
                            }
                        }
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/newPrice',
                        rule: {
                            effect: 'SHOW',
                            condition: {
                                scope: '#/properties/nftType',
                                schema: {
                                    const: 'ERC1155'
                                }
                            }
                        }
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/newUri',
                        rule: {
                            effect: 'SHOW',
                            condition: {
                                scope: '#/properties/nftType',
                                schema: {
                                    const: 'ERC1155'
                                }
                            }
                        }
                    }
                ]
            },
            customControls() {
                return {
                    '#/properties/chainId': {
                        render: () => {
                            const networkPicker = new scom_network_picker_1.default(undefined, {
                                type: 'combobox',
                                networks,
                                readOnly: readonly
                            });
                            if (readonly) {
                                networkPicker.classList.add(index_css_4.readOnlyStyle);
                            }
                            return networkPicker;
                        },
                        getData: (control) => {
                            return control.selectedNetwork?.chainId;
                        },
                        setData: async (control, value) => {
                            await control.ready();
                            control.setNetworkByChainId(value);
                        }
                    },
                    '#/properties/nftType': {
                        render: () => {
                            const pnlNftType = new components_7.Panel();
                            cbbNftType = new components_7.ComboBox(pnlNftType, {
                                height: '42px',
                                icon: {
                                    name: 'caret-down'
                                },
                                items: nftTypes,
                                readOnly: readonly
                            });
                            if (readonly) {
                                cbbNftType.classList.add(index_css_4.readOnlyStyle);
                            }
                            cbbNftType.classList.add(index_css_4.comboBoxStyle);
                            cbbNftType.onChanged = () => {
                                if (addressInput) {
                                    addressInput.nftType = cbbNftType.selectedItem?.value;
                                    addressInput.handleAddressChanged();
                                }
                                if (pnlNftType['onChanged'])
                                    pnlNftType['onChanged']();
                            };
                            return pnlNftType;
                        },
                        getData: (control) => {
                            return cbbNftType.selectedItem?.value;
                        },
                        setData: async (control, value) => {
                            cbbNftType.selectedItem = nftTypes.find(item => item.value === value);
                        }
                    },
                    '#/properties/nftAddress': {
                        render: () => {
                            addressInput = new index_11.ScomNftMinterAddressInput(undefined, {
                                state,
                                value: '',
                                readOnly: readonly
                            });
                            return addressInput;
                        },
                        getData: (control) => {
                            return control.value;
                        },
                        setData: async (control, value, rowData) => {
                            await control.ready();
                            control.nftType = rowData?.nftType;
                            control.nftId = rowData?.erc1155Index;
                            control.value = value;
                            control.handleAddressChanged();
                        }
                    },
                    '#/properties/erc1155Index': {
                        render: () => {
                            const pnlNftId = new components_7.Panel();
                            edtNftId = new components_7.Input(pnlNftId, {
                                inputType: 'number',
                                height: '42px',
                                width: '100%',
                                readOnly: readonly
                            });
                            if (readonly) {
                                edtNftId.classList.add(index_css_4.readOnlyStyle);
                            }
                            edtNftId.classList.add(index_css_4.formInputStyle);
                            edtNftId.onChanged = () => {
                                if (addressInput) {
                                    addressInput.nftId = edtNftId.value;
                                    addressInput.handleAddressChanged();
                                }
                                if (pnlNftId['onChanged'])
                                    pnlNftId['onChanged']();
                            };
                            return pnlNftId;
                        },
                        getData: (control) => {
                            return edtNftId.value;
                        },
                        setData: async (control, value) => {
                            edtNftId.value = value;
                        }
                    },
                    '#/properties/newPrice': {
                        render: () => {
                            const fieldUpdate = new index_11.ScomNftMinterFieldUpdate(undefined, {
                                refreshUI: () => functions.refreshUI(),
                                connectWallet: () => functions.connectWallet(),
                                showTxStatusModal: (status, content) => functions.showTxStatusModal(status, content),
                                state,
                                value: ''
                            });
                            return fieldUpdate;
                        },
                        getData: (control) => {
                            if (control.value == 0)
                                return 0;
                            return control.value ? Number(control.value) : '';
                        },
                        setData: async (control, value) => {
                            await control.ready();
                            control.value = '';
                        }
                    },
                    '#/properties/newUri': {
                        render: () => {
                            const fieldUpdate = new index_11.ScomNftMinterFieldUpdate(undefined, {
                                isUri: true,
                                refreshUI: () => functions.refreshUI(),
                                connectWallet: () => functions.connectWallet(),
                                showTxStatusModal: (status, content) => functions.showTxStatusModal(status, content),
                                state,
                                value: ''
                            });
                            return fieldUpdate;
                        },
                        getData: (control) => {
                            return control.value;
                        },
                        setData: async (control, value) => {
                            await control.ready();
                            control.value = '';
                        }
                    }
                };
            }
        };
    }
    exports.getProjectOwnerSchema2 = getProjectOwnerSchema2;
    function getProjectOwnerSchema3(isDefault1155New, readonly, isPolicy, state, functions) {
        return isDefault1155New ? getProjectOwnerSchema1(isPolicy) : getProjectOwnerSchema2(state, readonly, isPolicy, functions);
    }
    exports.getProjectOwnerSchema3 = getProjectOwnerSchema3;
    const getCustomControls = (isCustomToken) => {
        let networkPicker;
        let tokenInput;
        let customTokenInput;
        let cbbPaymentModel;
        let priceInput;
        const controls = {
            '#/properties/chainId': {
                render: () => {
                    networkPicker = new scom_network_picker_1.default(undefined, {
                        type: 'combobox',
                        networks,
                        onCustomNetworkSelected: () => {
                            const chainId = networkPicker.selectedNetwork?.chainId;
                            if (tokenInput && chainId !== tokenInput.chainId) {
                                tokenInput.chainId = chainId;
                                tokenInput.token = undefined;
                                tokenInput.tokenDataListProp = getSupportedTokens(chainId);
                                if (isCustomToken && customTokenInput) {
                                    customTokenInput.value = '';
                                    customTokenInput.enabled = false;
                                }
                            }
                        }
                    });
                    return networkPicker;
                },
                getData: (control) => {
                    return control.selectedNetwork?.chainId;
                },
                setData: async (control, value) => {
                    await control.ready();
                    control.setNetworkByChainId(value);
                    if (tokenInput && value !== tokenInput.chainId) {
                        const noChainId = !tokenInput.chainId;
                        tokenInput.chainId = value;
                        tokenInput.tokenDataListProp = getSupportedTokens(value);
                        if (noChainId && tokenInput.address) {
                            tokenInput.address = tokenInput.address;
                            tokenInput.onSelectToken(tokenInput.token);
                        }
                        else {
                            tokenInput.token = undefined;
                            if (isCustomToken) {
                                customTokenInput.value = '';
                                customTokenInput.enabled = false;
                            }
                        }
                    }
                }
            },
            '#/properties/tokenToMint': {
                render: () => {
                    tokenInput = new scom_token_input_1.default(undefined, {
                        type: 'combobox',
                        isBalanceShown: false,
                        isBtnMaxShown: false,
                        isInputShown: false,
                        isCustomTokenShown: true,
                        supportValidAddress: true
                    });
                    const chainId = networkPicker?.selectedNetwork?.chainId;
                    tokenInput.chainId = chainId;
                    tokenInput.tokenDataListProp = getSupportedTokens(chainId);
                    if (isCustomToken) {
                        tokenInput.onSelectToken = (token) => {
                            if (!token) {
                                customTokenInput.value = '';
                            }
                            else {
                                const { address } = token;
                                const isCustomToken = address?.toLowerCase() === scom_token_input_1.CUSTOM_TOKEN.address.toLowerCase();
                                if (!isCustomToken) {
                                    customTokenInput.value = (address && address !== index_9.nullAddress) ? address : 'Native Token';
                                    if (customTokenInput.value)
                                        customTokenInput.onChanged();
                                }
                                else {
                                    customTokenInput.value = '';
                                }
                            }
                            if (isCustomToken && tokenInput.onChanged) {
                                tokenInput.onChanged(tokenInput.token);
                            }
                        };
                    }
                    return tokenInput;
                },
                getData: (control) => {
                    const value = (control.token?.address || control.token?.symbol);
                    return value;
                },
                setData: async (control, value, rowData) => {
                    await control.ready();
                    control.chainId = rowData?.chainId;
                    control.address = value;
                    if (isCustomToken && control.onChanged) {
                        control.onChanged(control.token);
                    }
                    if (customTokenInput) {
                        const isCustomToken = value?.toLowerCase() === scom_token_input_1.CUSTOM_TOKEN.address.toLowerCase();
                        if (!isCustomToken) {
                            customTokenInput.value = (value && value !== index_9.nullAddress) ? value : 'Native Token';
                            if (customTokenInput.value)
                                customTokenInput.onChanged();
                        }
                    }
                }
            },
            '#/properties/paymentModel': {
                render: () => {
                    const pnl = new components_7.Panel();
                    cbbPaymentModel = new components_7.ComboBox(pnl, {
                        height: '42px',
                        icon: {
                            name: 'caret-down'
                        },
                        items: payment
                    });
                    cbbPaymentModel.classList.add(index_css_4.comboBoxStyle);
                    cbbPaymentModel.onChanged = () => {
                        const value = cbbPaymentModel.selectedItem?.value;
                        if (priceInput) {
                            priceInput.isUnitShown = value === index_12.PaymentModel.Subscription;
                        }
                        pnl.onChanged();
                    };
                    pnl.onChanged = () => { };
                    return pnl;
                },
                getData: (control) => {
                    return cbbPaymentModel.selectedItem?.value;
                },
                setData: async (control, value) => {
                    cbbPaymentModel.selectedItem = payment.find(v => v.value === value);
                    if (priceInput) {
                        priceInput.isUnitShown = value === index_12.PaymentModel.Subscription;
                    }
                }
            },
            '#/properties/priceToMint': {
                render: () => {
                    priceInput = new index_11.ScomNftMinterPriceInput(undefined, {
                        isUnitShown: cbbPaymentModel?.selectedItem?.value === index_12.PaymentModel.Subscription
                    });
                    return priceInput;
                },
                getData: (control) => {
                    return control.value;
                },
                setData: async (control, value) => {
                    control.value = value;
                }
            }
        };
        if (isCustomToken) {
            controls['#/properties/customMintToken'] = {
                render: () => {
                    customTokenInput = new components_7.Input(undefined, {
                        inputType: 'text',
                        height: '42px',
                        width: '100%'
                    });
                    customTokenInput.classList.add(index_css_4.formInputStyle);
                    return customTokenInput;
                },
                getData: (control) => {
                    return control.value;
                },
                setData: async (control, value) => {
                    await control.ready();
                    control.value = value;
                    if (!value && tokenInput?.token) {
                        const address = tokenInput.address;
                        const isCustomToken = address?.toLowerCase() === scom_token_input_1.CUSTOM_TOKEN.address.toLowerCase();
                        if (!isCustomToken) {
                            control.value = (address && address !== index_9.nullAddress) ? address : 'Native Token';
                        }
                    }
                }
            };
        }
        return controls;
    };
});
define("@scom/scom-nft-minter", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-nft-minter/interface/index.tsx", "@scom/scom-nft-minter/utils/index.ts", "@scom/scom-nft-minter/store/index.ts", "@scom/scom-nft-minter/index.css.ts", "@scom/scom-nft-minter/API.ts", "@scom/scom-nft-minter/data.json.ts", "@scom/scom-commission-fee-setup", "@scom/scom-token-list", "@scom/scom-token-input", "@scom/scom-nft-minter/formSchema.json.ts"], function (require, exports, components_8, eth_wallet_6, index_13, index_14, index_15, index_css_5, API_3, data_json_1, scom_commission_fee_setup_1, scom_token_list_6, scom_token_input_2, formSchema_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_8.Styles.Theme.ThemeVars;
    const DurationUnits = [
        {
            label: 'Day(s)',
            value: 'days'
        },
        {
            label: 'Month(s)',
            value: 'months'
        },
        {
            label: 'Year(s)',
            value: 'years'
        }
    ];
    let ScomNftMinter = class ScomNftMinter extends components_8.Module {
        constructor(parent, options) {
            super(parent, options);
            this._data = {
                wallets: [],
                networks: [],
                defaultChainId: 0
            };
            this.isApproving = false;
            this.tag = {};
            this.defaultEdit = true;
            this.rpcWalletEvents = [];
            this.isRenewal = false;
            this.onChainChanged = async () => {
                this.tokenInput.chainId = this.state.getChainId();
                this.onSetupPage();
                this.updateContractAddress();
                this.refreshDApp();
            };
            this.updateTokenBalance = async () => {
                const token = this.productInfo?.token;
                if (!token)
                    return;
                try {
                    const symbol = token.symbol || '';
                    this.lblBalance.caption = `${(0, index_14.formatNumber)(await (0, index_14.getTokenBalance)(this.rpcWallet, token))} ${symbol}`;
                }
                catch { }
            };
            this.newProduct = async (maxQty) => {
                return new Promise(async (resolve, reject) => {
                    let contract = this.state.getContractAddress('ProductMarketplace');
                    // const txnMaxQty = this.newTxnMaxQty;
                    const price = new eth_wallet_6.BigNumber(this.newPrice).toFixed();
                    if ((!this.nftType) && new eth_wallet_6.BigNumber(maxQty).gt(0)) {
                        if (this._data.erc1155Index >= 0) {
                            this._data.nftType = 'ERC1155';
                            return resolve(true);
                        }
                        ;
                        const callback = (err, receipt) => {
                            if (err) {
                                this.showTxStatusModal('error', err);
                            }
                        };
                        const confirmationCallback = async (receipt) => {
                            let productId = (0, API_3.getProductIdFromEvent)(contract, receipt);
                            this._data.productId = productId;
                            this._data.nftType = this._data.paymentModel === index_13.PaymentModel.Subscription ? 'ERC721' : 'ERC1155';
                            this.productInfo = await (0, API_3.getProductInfo)(this.state, this.productId);
                            if (this._data.nftType === 'ERC1155') {
                                this._data.erc1155Index = this.productInfo.nftId.toNumber();
                            }
                            this._data.nftAddress = this.productInfo.nft;
                            this._data.productType = this.getProductTypeByCode(this.productInfo.productType.toNumber());
                            this._data.priceToMint = eth_wallet_6.Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals).toNumber();
                            this._data.tokenToMint = this.productInfo.token.address;
                            this._data.durationInDays = Math.ceil((this.productInfo.priceDuration?.toNumber() || 0) / 86400);
                            return resolve(true);
                        };
                        if (!(0, index_15.isClientWalletConnected)()) {
                            this.connectWallet();
                            return resolve(false);
                        }
                        if (!this.state.isRpcWalletConnected()) {
                            const clientWallet = eth_wallet_6.Wallet.getClientInstance();
                            let isConnected = false;
                            try {
                                isConnected = await clientWallet.switchNetwork(this.chainId);
                            }
                            catch {
                                return resolve(false);
                            }
                            if (!isConnected)
                                return resolve(false);
                            await (0, index_14.delay)(3000);
                            contract = this.state.getContractAddress('ProductMarketplace');
                        }
                        if (!contract) {
                            this.showTxStatusModal('error', 'This network is not supported!');
                            return resolve(false);
                        }
                        try {
                            const { tokenToMint, customMintToken, uri } = this._data;
                            const isCustomToken = tokenToMint?.toLowerCase() === scom_token_input_2.CUSTOM_TOKEN.address.toLowerCase();
                            if (!tokenToMint || (isCustomToken && !customMintToken)) {
                                this.showTxStatusModal('error', 'TokenToMint is missing!');
                                return resolve(false);
                            }
                            const tokenAddress = isCustomToken ? customMintToken : tokenToMint;
                            if (tokenAddress === index_14.nullAddress || !tokenAddress.startsWith('0x')) {
                                const address = tokenAddress.toLowerCase();
                                const nativeToken = scom_token_list_6.ChainNativeTokenByChainId[this.chainId];
                                if (!address.startsWith('0x') && address !== nativeToken?.symbol.toLowerCase() && address !== 'native token') {
                                    this.showTxStatusModal('error', 'Invalid token!');
                                    return resolve(false);
                                }
                                //pay native token
                                await this._createProduct(contract, maxQty, price, uri, null, callback, confirmationCallback);
                            }
                            else { //pay erc20
                                let token;
                                if (isCustomToken) {
                                    token = await (0, index_14.getTokenInfo)(tokenAddress, this.chainId);
                                }
                                else {
                                    token = scom_token_list_6.tokenStore.getTokenList(this.chainId).find(v => v.address?.toLowerCase() === tokenAddress.toLowerCase());
                                }
                                if (!token) {
                                    this.showTxStatusModal('error', 'Invalid token!');
                                    return resolve(false);
                                }
                                await this._createProduct(contract, maxQty, price, uri, token, callback, confirmationCallback);
                            }
                        }
                        catch (error) {
                            this.showTxStatusModal('error', 'Something went wrong creating new product!');
                            console.log('newProduct', error);
                            resolve(false);
                        }
                    }
                });
            };
            this.connectWallet = async () => {
                if (this.mdWallet) {
                    await components_8.application.loadPackage('@scom/scom-wallet-modal', '*');
                    this.mdWallet.networks = this.networks;
                    this.mdWallet.wallets = this.wallets;
                    this.mdWallet.showModal();
                }
            };
            this.showTxStatusModal = (status, content, exMessage) => {
                if (!this.txStatusModal)
                    return;
                let params = { status };
                if (status === 'success') {
                    params.txtHash = content;
                }
                else {
                    params.content = content;
                }
                if (exMessage) {
                    params.exMessage = exMessage;
                }
                this.txStatusModal.message = { ...params };
                this.txStatusModal.showModal();
            };
            this.state = new index_15.State(data_json_1.default);
        }
        removeRpcWalletEvents() {
            const rpcWallet = this.rpcWallet;
            for (let event of this.rpcWalletEvents) {
                rpcWallet.unregisterWalletEvent(event);
            }
            this.rpcWalletEvents = [];
        }
        onHide() {
            this.containerDapp.onHide();
            this.removeRpcWalletEvents();
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get chainId() {
            return this.state.getChainId();
        }
        get rpcWallet() {
            return this.state.getRpcWallet();
        }
        get nftType() {
            return this._data.nftType;
        }
        get nftAddress() {
            return this._data.nftAddress;
        }
        get newPrice() {
            return this._data.priceToMint;
        }
        get newMaxQty() {
            return this._data.maxQty;
        }
        get newTxnMaxQty() {
            return this._data.txnMaxQty;
        }
        get recipient() {
            return this._data.recipient ?? this._data.chainSpecificProperties?.[this.chainId]?.recipient ?? '';
        }
        get link() {
            return this._data.link ?? '';
        }
        set link(value) {
            this._data.link = value;
        }
        get productId() {
            return this._data.productId ?? this._data.chainSpecificProperties?.[this.chainId]?.productId ?? 0;
        }
        get productType() {
            return this._data.productType ?? index_13.ProductType.Buy;
        }
        set productType(value) {
            this._data.productType = value;
        }
        get name() {
            return this._data.name ?? '';
        }
        set name(value) {
            this._data.name = value;
        }
        get description() {
            return this._data.description ?? '';
        }
        set description(value) {
            this._data.description = value;
        }
        get logoUrl() {
            return this._data.logoUrl;
        }
        set logoUrl(value) {
            this._data.logoUrl = value;
        }
        get commissions() {
            return this._data.commissions ?? [];
        }
        set commissions(value) {
            this._data.commissions = value;
        }
        get chainSpecificProperties() {
            return this._data.chainSpecificProperties ?? {};
        }
        set chainSpecificProperties(value) {
            this._data.chainSpecificProperties = value;
        }
        get wallets() {
            return this._data.wallets ?? [];
        }
        set wallets(value) {
            this._data.wallets = value;
        }
        get networks() {
            const nets = this._data.networks ?? data_json_1.default.defaultBuilderData.networks;
            if (this._data.chainId && this.nftType === 'ERC721' && !nets.some(v => v.chainId === this._data.chainId)) {
                nets.push({ chainId: this._data.chainId });
            }
            return nets;
        }
        set networks(value) {
            this._data.networks = value;
        }
        get showHeader() {
            return this._data.showHeader ?? true;
        }
        set showHeader(value) {
            this._data.showHeader = value;
        }
        get defaultChainId() {
            return this._data.defaultChainId;
        }
        set defaultChainId(value) {
            this._data.defaultChainId = value;
        }
        getProductTypeByCode(code) {
            let productType;
            switch (code) {
                case 0:
                    productType = index_13.ProductType.Buy;
                    break;
                case 1:
                    productType = index_13.ProductType.Subscription;
                    break;
                case 2:
                    productType = index_13.ProductType.DonateToOwner;
                    break;
                case 3:
                    productType = index_13.ProductType.DonateToEveryone;
                    break;
            }
            return productType;
        }
        async onSetupPage() {
            if (this.state.isRpcWalletConnected())
                await this.initApprovalAction();
        }
        getBuilderActions(category) {
            let self = this;
            const formSchema = (0, formSchema_json_1.getBuilderSchema)();
            const actions = [
                {
                    name: 'Commissions',
                    icon: 'dollar-sign',
                    command: (builder, userInputData) => {
                        let _oldData = {
                            wallets: [],
                            networks: [],
                            defaultChainId: 0
                        };
                        return {
                            execute: async () => {
                                _oldData = { ...this._data };
                                let resultingData = {
                                    ...self._data,
                                    commissions: userInputData.commissions
                                };
                                await self.setData(resultingData);
                                if (builder?.setData)
                                    builder.setData(this._data);
                            },
                            undo: async () => {
                                this._data = { ..._oldData };
                                await self.setData(this._data);
                                if (builder?.setData)
                                    builder.setData(this._data);
                            },
                            redo: () => { }
                        };
                    },
                    customUI: {
                        render: (data, onConfirm) => {
                            const vstack = new components_8.VStack();
                            const config = new scom_commission_fee_setup_1.default(null, {
                                commissions: self._data.commissions,
                                fee: this.state.embedderCommissionFee,
                                networks: self._data.networks
                            });
                            const hstack = new components_8.HStack(null, {
                                verticalAlignment: 'center',
                            });
                            const button = new components_8.Button(hstack, {
                                caption: 'Confirm',
                                width: '100%',
                                height: 40,
                                font: { color: Theme.colors.primary.contrastText }
                            });
                            vstack.append(config);
                            vstack.append(hstack);
                            button.onClick = async () => {
                                const commissions = config.commissions;
                                if (onConfirm)
                                    onConfirm(true, { commissions });
                            };
                            return vstack;
                        }
                    }
                }
            ];
            if (category && category !== 'offers') {
                actions.push({
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = {
                            wallets: [],
                            networks: [],
                            defaultChainId: 0
                        };
                        let oldTag = {};
                        return {
                            execute: async () => {
                                oldData = JSON.parse(JSON.stringify(this._data));
                                const { name, title, productType, logoUrl, description, link, erc1155Index, nftType, chainId, nftAddress, chainSpecificProperties, defaultChainId, tokenToMint, customMintToken, priceToMint, maxQty, txnMaxQty, uri, ...themeSettings } = userInputData;
                                const generalSettings = {
                                    name,
                                    title,
                                    productType,
                                    logoUrl,
                                    description,
                                    link,
                                    erc1155Index,
                                    nftType,
                                    chainId,
                                    nftAddress,
                                    chainSpecificProperties,
                                    defaultChainId,
                                    tokenToMint,
                                    customMintToken,
                                    priceToMint,
                                    maxQty,
                                    txnMaxQty,
                                    uri
                                };
                                Object.assign(this._data, generalSettings);
                                await this.resetRpcWallet();
                                if (builder?.setData)
                                    builder.setData(this._data);
                                this.refreshDApp(true);
                                oldTag = JSON.parse(JSON.stringify(this.tag));
                                if (builder?.setTag)
                                    builder.setTag(themeSettings);
                                else
                                    this.setTag(themeSettings);
                                if (this.containerDapp)
                                    this.containerDapp.setTag(themeSettings);
                            },
                            undo: () => {
                                this._data = JSON.parse(JSON.stringify(oldData));
                                this.refreshDApp(true);
                                if (builder?.setData)
                                    builder.setData(this._data);
                                this.tag = JSON.parse(JSON.stringify(oldTag));
                                if (builder?.setTag)
                                    builder.setTag(this.tag);
                                else
                                    this.setTag(this.tag);
                                if (this.containerDapp)
                                    this.containerDapp.setTag(this.tag);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: formSchema.dataSchema,
                    userInputUISchema: formSchema.uiSchema
                });
            }
            return actions;
        }
        getProjectOwnerActions(isDefault1155New, readonly, isPocily) {
            //const isDonation = this._data.productType === ProductType.DonateToOwner || this._data.productType === ProductType.DonateToEveryone;
            const formSchema = (0, formSchema_json_1.getProjectOwnerSchema3)(isDefault1155New, readonly, isPocily, this.state, {
                refreshUI: this.refreshDApp,
                connectWallet: this.connectWallet,
                showTxStatusModal: this.showTxStatusModal
            });
            const actions = [
                {
                    name: 'Settings',
                    userInputDataSchema: formSchema.dataSchema,
                    userInputUISchema: formSchema.uiSchema,
                    customControls: formSchema.customControls()
                }
            ];
            return actions;
        }
        getConfigurators(type, readonly, isPocily) {
            let isNew1155 = (type && type === 'new1155');
            const { defaultBuilderData, defaultExistingNft, defaultCreate1155Index } = data_json_1.default;
            const defaultData = isNew1155 ? defaultCreate1155Index : defaultExistingNft;
            this.isConfigNewIndex = isNew1155;
            this.isOnChangeUpdated = false;
            let self = this;
            return [
                {
                    name: 'Project Owner Configurator',
                    target: 'Project Owners',
                    getProxySelectors: async (chainId) => {
                        const selectors = await (0, index_14.getProxySelectors)(this.state, chainId);
                        return selectors;
                    },
                    getActions: () => {
                        return this.getProjectOwnerActions(isNew1155, readonly, isPocily);
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        await this.setData({ ...defaultBuilderData, ...defaultData, ...data });
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: (category) => {
                        return this.getBuilderActions(category);
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        await this.setData({ ...defaultBuilderData, ...defaultData, ...data });
                    },
                    setupData: async (data) => {
                        this._data = { ...defaultBuilderData, ...data };
                        if (!this.nftType) {
                            if (isPocily) {
                                this._data.maxQty = new eth_wallet_6.BigNumber(10).pow(12).toNumber();
                            }
                            if (new eth_wallet_6.BigNumber(this.newMaxQty).lte(0)) {
                                return false;
                            }
                            const maxQty = this.newMaxQty;
                            this._data.erc1155Index = undefined;
                            await this.resetRpcWallet();
                            await this.initWallet();
                            return await this.newProduct(maxQty);
                        }
                        else {
                            await this.resetRpcWallet();
                            await this.initWallet();
                            if (!(0, index_15.isClientWalletConnected)()) {
                                this.connectWallet();
                                return;
                            }
                            if (!this.state.isRpcWalletConnected()) {
                                const clientWallet = eth_wallet_6.Wallet.getClientInstance();
                                await clientWallet.switchNetwork(this.chainId);
                                return;
                            }
                            if (this.nftType === 'ERC721' && this._data.erc1155Index != null)
                                this._data.erc1155Index = undefined;
                            let productId = await (0, API_3.getProductId)(this.state, this.nftAddress, this._data.erc1155Index);
                            if (productId) {
                                this._data.productId = productId;
                                this.productInfo = await (0, API_3.getProductInfo)(this.state, this.productId);
                                this._data.productType = this.getProductTypeByCode(this.productInfo.productType.toNumber());
                                this._data.priceToMint = eth_wallet_6.Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals).toNumber();
                                this._data.tokenToMint = this.productInfo.token.address;
                                if (this._data.productType === index_13.ProductType.Subscription) {
                                    this._data.durationInDays = Math.ceil((this.productInfo.priceDuration?.toNumber() || 0) / 86400);
                                }
                            }
                        }
                        return true;
                    },
                    updateDiscountRules: async (productId, rules, ruleIdsToDelete = []) => {
                        return new Promise(async (resolve, reject) => {
                            const callback = (err, receipt) => {
                                if (err) {
                                    this.showTxStatusModal('error', err);
                                }
                            };
                            const confirmationCallback = async (receipt) => {
                                const discountRules = await (0, API_3.getDiscountRules)(this.state, productId);
                                resolve(discountRules);
                            };
                            try {
                                await (0, API_3.updateDiscountRules)(this.state, productId, rules, ruleIdsToDelete, callback, confirmationCallback);
                            }
                            catch (error) {
                                this.showTxStatusModal('error', 'Something went wrong updating discount rule!');
                                console.log('updateDiscountRules', error);
                                reject(error);
                            }
                        });
                    },
                    updateCommissionCampaign: async (productId, commissionRate, affiliates) => {
                        return new Promise(async (resolve, reject) => {
                            const callback = (err, receipt) => {
                                if (err) {
                                    this.showTxStatusModal('error', err);
                                }
                            };
                            const confirmationCallback = async (receipt) => {
                                resolve(true);
                            };
                            try {
                                await (0, API_3.updateCommissionCampaign)(this.state, productId, commissionRate, affiliates, callback, confirmationCallback);
                            }
                            catch (error) {
                                this.showTxStatusModal('error', 'Something went wrong updating commission campaign!');
                                console.log('updateCommissionCampaign', error);
                                reject(error);
                            }
                        });
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Emdedder Configurator',
                    target: 'Embedders',
                    elementName: 'i-scom-commission-fee-setup',
                    getLinkParams: () => {
                        const commissions = self._data.commissions || [];
                        return {
                            data: window.btoa(JSON.stringify(commissions))
                        };
                    },
                    setLinkParams: async (params) => {
                        if (params.data) {
                            const decodedString = window.atob(params.data);
                            const commissions = JSON.parse(decodedString);
                            let resultingData = {
                                ...self._data,
                                commissions
                            };
                            await self.setData(resultingData);
                        }
                    },
                    bindOnChanged: (element, callback) => {
                        element.onChanged = async (data) => {
                            let resultingData = {
                                ...self._data,
                                ...data
                            };
                            await self.setData(resultingData);
                            await callback(data);
                        };
                    },
                    getData: () => {
                        const fee = this.state.embedderCommissionFee;
                        return { ...this.getData(), fee };
                    },
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Editor',
                    target: 'Editor',
                    getActions: (category) => {
                        const actions = this.getProjectOwnerActions(isNew1155, readonly, isPocily);
                        return actions;
                    },
                    getData: this.getData.bind(this),
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                }
            ];
        }
        getData() {
            return this._data;
        }
        async resetRpcWallet() {
            this.removeRpcWalletEvents();
            const rpcWalletId = await this.state.initRpcWallet(this._data.chainId || this.defaultChainId);
            const rpcWallet = this.rpcWallet;
            this.updateFormConfig();
            const chainChangedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_6.Constants.RpcWalletEvent.ChainChanged, async (chainId) => {
                this.onChainChanged();
            });
            const connectedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_6.Constants.RpcWalletEvent.Connected, async (connected) => {
                this.updateFormConfig(true);
                this.onSetupPage();
                this.updateContractAddress();
                this.refreshDApp();
            });
            this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);
            const chainId = this._data.chainId;
            const data = {
                defaultChainId: chainId || this.defaultChainId,
                wallets: this.wallets,
                networks: chainId ? [{ chainId: chainId }] : this.networks,
                showHeader: this.showHeader,
                rpcWalletId: rpcWallet.instanceId
            };
            if (this.containerDapp?.setData)
                await this.containerDapp.setData(data);
        }
        async setData(data) {
            this._data = data;
            this.discountRules = [];
            await this.resetRpcWallet();
            if (!this.tokenInput.isConnected)
                await this.tokenInput.ready();
            this.tokenInput.chainId = this.state.getChainId() ?? this.defaultChainId;
            await this.onSetupPage();
            const commissionFee = this.state.embedderCommissionFee;
            if (!this.lbOrderTotalTitle.isConnected)
                await this.lbOrderTotalTitle.ready();
            this.lbOrderTotalTitle.caption = `You are going to pay`;
            this.iconOrderTotal.tooltip.content = `A commission fee of ${new eth_wallet_6.BigNumber(commissionFee).times(100)}% will be applied to the amount you input.`;
            this.updateContractAddress();
            if (this.nftType === 'ERC721' && this._data.erc1155Index != null)
                this._data.erc1155Index = undefined;
            if (!this.productId && this.nftAddress && (this.nftType === 'ERC721' || this._data.erc1155Index)) {
                await this.initWallet();
                let productId = await (0, API_3.getProductId)(this.state, this.nftAddress, this._data.erc1155Index);
                if (productId)
                    this._data.productId = productId;
            }
            this.edtRecipient.value = this._data.recipient;
            this.edtStartDate.value = undefined;
            this.edtDuration.value = '';
            this.comboDurationUnit.selectedItem = DurationUnits[0];
            await this.refreshDApp(true);
        }
        getTag() {
            return this.tag;
        }
        updateTag(type, value) {
            this.tag[type] = this.tag[type] ?? {};
            for (let prop in value) {
                if (value.hasOwnProperty(prop))
                    this.tag[type][prop] = value[prop];
            }
        }
        async setTag(value) {
            const newValue = value || {};
            for (let prop in newValue) {
                if (newValue.hasOwnProperty(prop)) {
                    if (prop === 'light' || prop === 'dark')
                        this.updateTag(prop, newValue[prop]);
                    else
                        this.tag[prop] = newValue[prop];
                }
            }
            if (this.containerDapp)
                this.containerDapp.setTag(this.tag);
            this.updateTheme();
        }
        updateStyle(name, value) {
            value ?
                this.style.setProperty(name, value) :
                this.style.removeProperty(name);
        }
        updateTheme() {
            const themeVar = this.containerDapp?.theme || 'dark';
            this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
            this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
            this.updateStyle('--input-font_color', this.tag[themeVar]?.inputFontColor);
            this.updateStyle('--input-background', this.tag[themeVar]?.inputBackgroundColor);
            this.updateStyle('--colors-primary-main', this.tag[themeVar]?.buttonBackgroundColor);
        }
        async updateFormConfig(isEvent) {
            if (this.isConfigNewIndex) {
                try {
                    const wrapper = this.parentElement?.parentElement;
                    if (!wrapper)
                        return;
                    const form = (wrapper.querySelector('i-form') || wrapper.parentElement?.querySelector('i-form'));
                    if (!form)
                        return;
                    const btnConfirm = form.lastElementChild?.lastElementChild;
                    if (btnConfirm) {
                        const updateButton = async () => {
                            const data = await form.getFormData();
                            const validation = form.validate(data, form.jsonSchema, { changing: false });
                            btnConfirm.caption = !(0, index_15.isClientWalletConnected)() && validation.valid ? 'Connect Wallet' : 'Confirm';
                        };
                        if (isEvent) {
                            updateButton();
                        }
                        else if (!this.isOnChangeUpdated) {
                            this.isOnChangeUpdated = true;
                            const onFormChange = form.formOptions.onChange;
                            form.formOptions.onChange = async () => {
                                if (onFormChange)
                                    onFormChange();
                                updateButton();
                            };
                            updateButton();
                        }
                    }
                }
                catch { }
            }
        }
        async _createProduct(productMarketplaceAddress, quantity, price, uri, token, callback, confirmationCallback) {
            if (this._data.paymentModel === index_13.PaymentModel.Subscription) {
                await (0, API_3.createSubscriptionNFT)(productMarketplaceAddress, quantity, price, token?.address || index_14.nullAddress, token?.decimals || 18, uri, 1 * 86400, // per day
                callback, confirmationCallback);
            }
            else {
                await (0, API_3.newDefaultBuyProduct)(productMarketplaceAddress, quantity, price, token?.address || index_14.nullAddress, token?.decimals || 18, uri, callback, confirmationCallback);
            }
        }
        async initWallet() {
            try {
                await eth_wallet_6.Wallet.getClientInstance().init();
                await this.rpcWallet.init();
            }
            catch { }
        }
        async updateDAppUI(data) {
            this.markdownViewer.visible = !!data.description;
            this.markdownViewer.load(data.description || '');
            this.pnlLink.visible = !!data.link;
            (!this.lblLink.isConnected) && await this.lblLink.ready();
            this.lblLink.caption = data.link || '';
            this.lblLink.link.href = data.link;
            this.imgLogo.visible = !!data.logoUrl;
            this.imgLogo.url = data.logoUrl || "";
            this.lblTitle.visible = !!data.title;
            (!this.lblTitle.isConnected) && await this.lblTitle.ready();
            this.lblTitle.caption = data.title || '';
        }
        async refreshDApp(isDataUpdated = false) {
            setTimeout(async () => {
                this._type = this.productType;
                await this.updateDAppUI(this._data);
                this.determineBtnSubmitCaption();
                if (!this.nftType)
                    return;
                await this.initWallet();
                this.btnSubmit.enabled = (0, index_15.isClientWalletConnected)() && this.state.isRpcWalletConnected();
                // OswapTroll
                if (this.nftType === 'ERC721' && !this.productId) {
                    this.lblTitle.caption = this._data.title;
                    if (!this.nftAddress)
                        return;
                    const oswapTroll = await (0, API_3.fetchOswapTrollNftInfo)(this.state, this.nftAddress);
                    if (!oswapTroll) {
                        this.pnlUnsupportedNetwork.visible = true;
                        this.pnlInputFields.visible = false;
                        return;
                    }
                    ;
                    const nftBalance = (0, index_15.isClientWalletConnected)() ? await (0, API_3.fetchUserNftBalance)(this.state, this.nftAddress) : 0;
                    const { price, cap, tokenAddress } = oswapTroll;
                    let token = scom_token_list_6.tokenStore.getTokenList(this.chainId).find(v => v.address === tokenAddress);
                    if (!token) {
                        token = await (0, index_14.getTokenInfo)(tokenAddress, this.chainId);
                    }
                    this.pnlInputFields.visible = true;
                    this.pnlUnsupportedNetwork.visible = false;
                    this.detailWrapper.visible = true;
                    this.onToggleDetail();
                    this.btnDetail.visible = true;
                    this.erc1155Wrapper.visible = false;
                    this.lbContract.caption = components_8.FormatUtils.truncateWalletAddress(this.nftAddress);
                    this.updateTokenAddress(tokenAddress);
                    this.lbOwn.caption = (0, index_14.formatNumber)(nftBalance || 0, 0);
                    this.pnlMintFee.visible = true;
                    this.oswapTrollInfo = { token, price };
                    this.lblMintFee.caption = `${(0, index_14.formatNumber)(price)} ${token?.symbol || ''}`;
                    this.lblSpotsRemaining.caption = (0, index_14.formatNumber)(cap, 0);
                    this.cap = cap.toNumber();
                    //this.pnlQty.visible = true;
                    this.pnlSubscriptionPeriod.visible = false;
                    this.edtQty.readOnly = true;
                    this.edtQty.value = '1';
                    this.lbOrderTotal.caption = `${(0, index_14.formatNumber)(price, 6)} ${token?.symbol || ''}`;
                    this.pnlTokenInput.visible = false;
                    this.imgUri.visible = false;
                    this.determineBtnSubmitCaption();
                    return;
                }
                //this.edtQty.readOnly = false;
                this.edtQty.readOnly = true;
                this.productInfo = await (0, API_3.getProductInfo)(this.state, this.productId);
                if (this.productInfo) {
                    if (isDataUpdated && this._type === index_13.ProductType.Subscription) {
                        this.discountRules = await (0, API_3.getDiscountRules)(this.state, this._data.productId);
                    }
                    const token = this.productInfo.token;
                    this.pnlInputFields.visible = true;
                    this.pnlUnsupportedNetwork.visible = false;
                    const price = eth_wallet_6.Utils.fromDecimals(this.productInfo.price, token.decimals).toFixed();
                    (!this.lblRef.isConnected) && await this.lblRef.ready();
                    if (this._type === index_13.ProductType.Buy || this._type === index_13.ProductType.Subscription) {
                        const nftBalance = (0, index_15.isClientWalletConnected)() ? await (0, API_3.getNFTBalance)(this.state, this.productId) : 0;
                        this.detailWrapper.visible = true;
                        this.onToggleDetail();
                        this.btnDetail.visible = true;
                        this.erc1155Wrapper.visible = this.nftType === 'ERC1155';
                        this.lbERC1155Index.caption = `${this.productInfo.nftId?.toNumber() || ''}`;
                        this.lbContract.caption = components_8.FormatUtils.truncateWalletAddress(this.contractAddress || this.nftAddress);
                        this.updateTokenAddress(token.address);
                        this.lbOwn.caption = (0, index_14.formatNumber)(nftBalance, 0);
                        this.pnlMintFee.visible = true;
                        const days = Math.ceil((this.productInfo.priceDuration?.toNumber() || 0) / 86400);
                        const duration = this._type === index_13.ProductType.Subscription ? days > 1 ? ` for ${days} days` : ' per day' : '';
                        this.lblMintFee.caption = `${price ? (0, index_14.formatNumber)(price) : ""} ${token?.symbol || ""}${duration}`;
                        this.lblTitle.caption = this._data.title;
                        this.lblRef.caption = 'smart contract:';
                        this.updateSpotsRemaining();
                        this.tokenInput.inputReadOnly = true;
                        this.pnlQty.visible = false;
                        this.pnlSubscriptionPeriod.visible = this._type === index_13.ProductType.Subscription;
                        if (isDataUpdated && this._type === index_13.ProductType.Subscription) {
                            this.edtStartDate.value = (0, components_8.moment)();
                            const rule = this._data.discountRuleId ? this.discountRules.find(rule => rule.id === this._data.discountRuleId) : null;
                            const isExpired = rule && rule.endTime && rule.endTime < (0, components_8.moment)().unix();
                            if (isExpired)
                                this._data.discountRuleId = undefined;
                            if (rule && !isExpired) {
                                if (rule.startTime && rule.startTime > this.edtStartDate.value.unix()) {
                                    this.edtStartDate.value = (0, components_8.moment)(rule.startTime * 1000);
                                }
                                this.edtDuration.value = rule.minDuration.div(86400).toNumber();
                                this.comboDurationUnit.selectedItem = DurationUnits[0];
                                this.discountApplied = rule;
                                this._updateEndDate();
                                this._updateTotalAmount();
                                if (this.approvalModelAction) {
                                    this.approvalModelAction.checkAllowance(this.productInfo.token, this.tokenAmountIn);
                                }
                            }
                            else {
                                this.edtDuration.value = Math.ceil((this.productInfo.priceDuration?.toNumber() || 0) / 86400);
                                this.onDurationChanged();
                            }
                        }
                        //this.pnlQty.visible = true;
                        this.pnlTokenInput.visible = false;
                        if (this.productInfo.uri) {
                            this.imgUri.visible = true;
                            this.imgUri.url = this.productInfo.uri;
                        }
                        else {
                            this.imgUri.visible = false;
                        }
                        this.edtQty.value = '1';
                        if (this._type !== index_13.ProductType.Subscription)
                            this.onQtyChanged();
                    }
                    else {
                        this.detailWrapper.visible = false;
                        this.btnDetail.visible = false;
                        this.pnlMintFee.visible = false;
                        this.lblTitle.caption = this._data.title || 'Make a Contributon';
                        this.lblTitle.visible = true;
                        this.lblRef.caption = 'All proceeds will go to following vetted wallet address:';
                        this.tokenInput.inputReadOnly = false;
                        this.pnlQty.visible = false;
                        this.pnlTokenInput.visible = true;
                        this.imgUri.visible = false;
                        this.edtQty.value = "";
                        this.lbOrderTotal.caption = "0";
                    }
                    this.tokenInput.value = "";
                    this.pnlAddress.visible = this._type === index_13.ProductType.DonateToOwner || this._type === index_13.ProductType.DonateToEveryone;
                    (!this.lblAddress.isConnected) && await this.lblAddress.ready();
                    this.lblAddress.caption = this.contractAddress || this.nftAddress;
                    this.tokenInput.token = token?.address === index_14.nullAddress ? {
                        ...token,
                        isNative: true,
                        address: undefined
                    } : token;
                    this.updateTokenBalance();
                }
                else {
                    this.pnlInputFields.visible = false;
                    this.pnlUnsupportedNetwork.visible = true;
                }
                this.determineBtnSubmitCaption();
            });
        }
        async getProductInfo() {
            if (!this.productId || !this.productInfo)
                return null;
            if (this.productInfo.productId.isEqualTo(this.productId))
                return this.productInfo;
            try {
                const productInfo = await (0, API_3.getProductInfo)(this.state, this.productId);
                return productInfo;
            }
            catch {
                return null;
            }
        }
        updateTokenAddress(address) {
            const isNativeToken = !address || address === index_14.nullAddress || !address.startsWith('0x');
            if (isNativeToken) {
                const network = this.state.getNetworkInfo(this.chainId);
                this.lbToken.caption = `${network?.chainName || ''} Native Token`;
                this.lbToken.textDecoration = 'none';
                this.lbToken.font = { size: '1rem', color: Theme.text.primary };
                this.lbToken.style.textAlign = 'right';
                this.lbToken.classList.remove(index_css_5.linkStyle);
                this.lbToken.onClick = () => { };
            }
            else {
                this.lbToken.caption = components_8.FormatUtils.truncateWalletAddress(address);
                this.lbToken.textDecoration = 'underline';
                this.lbToken.font = { size: '1rem', color: Theme.colors.primary.main };
                this.lbToken.classList.add(index_css_5.linkStyle);
                this.lbToken.onClick = () => this.onCopyToken();
            }
            this.iconCopyToken.visible = !isNativeToken;
        }
        updateSpotsRemaining() {
            if (this.productId >= 0) {
                this.lblSpotsRemaining.caption = `${(0, index_14.formatNumber)(this.productInfo.quantity, 0)}`;
            }
            else {
                this.lblSpotsRemaining.caption = '';
            }
        }
        onToggleDetail() {
            const isExpanding = this.detailWrapper.visible;
            this.detailWrapper.visible = !isExpanding;
            this.btnDetail.caption = `${isExpanding ? 'More' : 'Hide'} Information`;
            this.btnDetail.rightIcon.name = isExpanding ? 'caret-down' : 'caret-up';
        }
        onViewContract() {
            this.state.viewExplorerByAddress(this.chainId, this.nftType === 'ERC721' ? this.nftAddress : (this.contractAddress || this.nftAddress));
        }
        onViewToken() {
            const token = this.nftType === 'ERC721' && !this.productId ? this.oswapTrollInfo.token : this.productInfo.token;
            this.state.viewExplorerByAddress(this.chainId, token.address || token.symbol);
        }
        onCopyContract() {
            components_8.application.copyToClipboard(this.nftType === 'ERC721' ? this.nftAddress : (this.contractAddress || this.nftAddress));
        }
        onCopyToken() {
            const token = this.nftType === 'ERC721' && !this.productId ? this.oswapTrollInfo.token : this.productInfo.token;
            components_8.application.copyToClipboard(token.address || token.symbol);
        }
        async initApprovalAction() {
            if (!this.approvalModelAction) {
                //this.contractAddress = this.nftType === 'ERC721' ? this.nftAddress : this.state.getContractAddress('Proxy');
                this.approvalModelAction = await this.state.setApprovalModelAction({
                    sender: this,
                    payAction: async () => {
                        await this.doSubmitAction();
                    },
                    onToBeApproved: async (token) => {
                        this.btnApprove.visible = (0, index_15.isClientWalletConnected)() && this.state.isRpcWalletConnected();
                        this.btnSubmit.visible = !this.btnApprove.visible;
                        this.btnSubmit.enabled = false;
                        if (!this.isApproving) {
                            this.btnApprove.rightIcon.visible = false;
                            this.btnApprove.caption = 'Approve';
                        }
                        this.btnApprove.enabled = true;
                        this.isApproving = false;
                    },
                    onToBePaid: async (token) => {
                        this.btnApprove.visible = false;
                        this.btnSubmit.visible = true;
                        this.isApproving = false;
                        this.btnSubmit.enabled = new eth_wallet_6.BigNumber(this.tokenAmountIn).gt(0);
                        this.determineBtnSubmitCaption();
                    },
                    onApproving: async (token, receipt) => {
                        this.isApproving = true;
                        this.btnApprove.rightIcon.spin = true;
                        this.btnApprove.rightIcon.visible = true;
                        this.btnApprove.caption = `Approving ${token?.symbol || ''}`;
                        this.btnSubmit.visible = false;
                        if (receipt) {
                            this.showTxStatusModal('success', receipt);
                        }
                    },
                    onApproved: async (token) => {
                        this.btnApprove.rightIcon.visible = false;
                        this.btnApprove.caption = 'Approve';
                        this.isApproving = false;
                        this.btnSubmit.visible = true;
                        this.btnSubmit.enabled = true;
                    },
                    onApprovingError: async (token, err) => {
                        this.showTxStatusModal('error', err);
                        this.btnApprove.caption = 'Approve';
                        this.btnApprove.rightIcon.visible = false;
                        this.isApproving = false;
                    },
                    onPaying: async (receipt) => {
                        if (receipt) {
                            this.showTxStatusModal('success', receipt);
                            this.btnSubmit.enabled = false;
                            this.btnSubmit.rightIcon.visible = true;
                        }
                    },
                    onPaid: async (receipt) => {
                        this.btnSubmit.rightIcon.visible = false;
                        if (this.txStatusModal)
                            this.txStatusModal.closeModal();
                    },
                    onPayingError: async (err) => {
                        this.showTxStatusModal('error', err);
                    }
                });
                this.updateContractAddress();
                if (this.productInfo?.token?.address !== index_14.nullAddress && this.tokenAmountIn) {
                    this.approvalModelAction.checkAllowance(this.productInfo.token, this.tokenAmountIn);
                }
            }
        }
        updateContractAddress() {
            if (this.approvalModelAction) {
                if (this._data.referrer) {
                    this.contractAddress = this.state.getContractAddress('Commission');
                }
                else {
                    this.contractAddress = this.state.getContractAddress('ProductMarketplace');
                }
                this.state.approvalModel.spenderAddress = this.contractAddress;
            }
        }
        async selectToken(token) {
            const symbol = token?.symbol || '';
            this.lblBalance.caption = `${(0, index_14.formatNumber)(await (0, index_14.getTokenBalance)(this.rpcWallet, token))} ${symbol}`;
        }
        updateSubmitButton(submitting) {
            this.btnSubmit.rightIcon.spin = submitting;
            this.btnSubmit.rightIcon.visible = submitting;
        }
        determineBtnSubmitCaption() {
            if (!(0, index_15.isClientWalletConnected)()) {
                this.btnSubmit.caption = 'Connect Wallet';
                this.btnSubmit.enabled = true;
            }
            else if (!this.state.isRpcWalletConnected()) {
                this.btnSubmit.caption = 'Switch Network';
                this.btnSubmit.enabled = true;
            }
            else if (this.nftType === 'ERC721' && !this.productId) {
                this.btnSubmit.caption = this.cap ? 'Mint' : 'Out of stock';
                this.btnSubmit.enabled = !!this.cap;
            }
            else if (this._type === index_13.ProductType.Buy) {
                this.btnSubmit.caption = 'Mint';
            }
            else if (this._type === index_13.ProductType.Subscription) {
                this.btnSubmit.caption = 'Subscribe';
            }
            else {
                this.btnSubmit.caption = 'Submit';
            }
        }
        async onApprove() {
            if (this.nftType === 'ERC721' && !this.productId) {
                const { price, token } = this.oswapTrollInfo;
                // const contractAddress = this.state.getExplorerByAddress(this.chainId, this.nftAddress);
                const contractAddress = this.state.getContractAddress('ProductMarketplace');
                const tokenAddress = this.state.getExplorerByAddress(this.chainId, token.address);
                this.showTxStatusModal('warning', 'Confirming', `to contract\n${contractAddress}\nwith token\n${tokenAddress}`);
                await this.approvalModelAction.doApproveAction(token, price.toFixed());
            }
            else {
                this.showTxStatusModal('warning', `Approving`);
                await this.approvalModelAction.doApproveAction(this.productInfo.token, this.tokenAmountIn);
            }
        }
        async onQtyChanged() {
            const qty = Number(this.edtQty.value);
            if (qty === 0) {
                this.tokenAmountIn = '0';
                this.tokenInput.value = '0';
                this.lbOrderTotal.caption = `0 ${this.productInfo.token?.symbol || ''}`;
            }
            else {
                const price = eth_wallet_6.Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals);
                this.tokenAmountIn = (0, API_3.getProxyTokenAmountIn)(price.toFixed(), qty, this._data.commissions);
                const amount = price.times(qty);
                this.tokenInput.value = amount.toFixed();
                const commissionFee = this.state.embedderCommissionFee;
                const total = amount.plus(amount.times(commissionFee));
                this.lbOrderTotal.caption = `${(0, index_14.formatNumber)(total, 6)} ${this.productInfo.token?.symbol || ''}`;
            }
            if (this.productInfo && this.state.isRpcWalletConnected()) {
                if (this.productInfo.token?.address !== index_14.nullAddress) {
                    this.approvalModelAction.checkAllowance(this.productInfo.token, this.tokenAmountIn);
                }
                else {
                    this.btnSubmit.enabled = new eth_wallet_6.BigNumber(this.tokenAmountIn).gt(0);
                    this.determineBtnSubmitCaption();
                }
            }
            else {
                this.determineBtnSubmitCaption();
            }
        }
        async onAmountChanged() {
            let amount = Number(this.tokenInput.value);
            if (amount === 0 || !this.productInfo) {
                this.tokenAmountIn = '0';
                this.tokenInput.value = '0';
            }
            else {
                const price = eth_wallet_6.Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals);
                this.tokenAmountIn = (0, API_3.getProxyTokenAmountIn)(price.toFixed(), amount, this._data.commissions);
            }
            amount = Number(this.tokenInput.value);
            const commissionFee = this.state.embedderCommissionFee;
            const total = new eth_wallet_6.BigNumber(amount).plus(new eth_wallet_6.BigNumber(amount).times(commissionFee));
            const token = this.productInfo?.token;
            this.lbOrderTotal.caption = `${(0, index_14.formatNumber)(total, 6)} ${token?.symbol || ''}`;
            if (token && this.state.isRpcWalletConnected() && token?.address !== index_14.nullAddress) {
                if (token?.address !== index_14.nullAddress) {
                    this.approvalModelAction.checkAllowance(token, this.tokenAmountIn);
                }
                else {
                    this.btnSubmit.enabled = new eth_wallet_6.BigNumber(this.tokenAmountIn).gt(0);
                    this.determineBtnSubmitCaption();
                }
            }
            else {
                this.determineBtnSubmitCaption();
            }
        }
        async doSubmitAction() {
            if (!this._data || (!this.productId && this.nftType !== 'ERC721'))
                return;
            this.updateSubmitButton(true);
            if ((this._type === index_13.ProductType.DonateToOwner || this._type === index_13.ProductType.DonateToEveryone) && !this.tokenInput.token) {
                this.showTxStatusModal('error', 'Token Required');
                this.updateSubmitButton(false);
                return;
            }
            if (this.nftType === 'ERC721' && !this.productId) {
                const oswapTroll = await (0, API_3.fetchOswapTrollNftInfo)(this.state, this.nftAddress);
                if (!oswapTroll || oswapTroll.cap.lte(0)) {
                    this.showTxStatusModal('error', 'Out of stock');
                    this.updateSubmitButton(false);
                    return;
                }
                const token = this.oswapTrollInfo.token;
                const balance = await (0, index_14.getTokenBalance)(this.rpcWallet, token);
                if (oswapTroll.price.gt(balance)) {
                    this.showTxStatusModal('error', `Insufficient ${token.symbol} Balance`);
                    this.updateSubmitButton(false);
                    return;
                }
                await this.mintNft();
                return;
            }
            const token = this.productInfo.token;
            const balance = await (0, index_14.getTokenBalance)(this.rpcWallet, token);
            if (this._type === index_13.ProductType.Buy) {
                if (this.edtQty.value && new eth_wallet_6.BigNumber(this.edtQty.value).gt(this.productInfo.maxQuantity)) {
                    this.showTxStatusModal('error', 'Quantity Greater Than Max Quantity');
                    this.updateSubmitButton(false);
                    return;
                }
                if (this.productInfo.maxQuantity.gt(1) && (!this.edtQty.value || !Number.isInteger(Number(this.edtQty.value)))) {
                    this.showTxStatusModal('error', 'Invalid Quantity');
                    this.updateSubmitButton(false);
                    return;
                }
                const requireQty = this.productInfo.maxQuantity.gt(1) && this.edtQty.value ? Number(this.edtQty.value) : 1;
                if (this.productId >= 0) {
                    const product = await (0, API_3.getProductInfo)(this.state, this.productId);
                    if (product.quantity.lt(requireQty)) {
                        this.showTxStatusModal('error', 'Out of stock');
                        this.updateSubmitButton(false);
                        return;
                    }
                }
                const maxOrderQty = new eth_wallet_6.BigNumber(this.productInfo.maxQuantity ?? 0);
                if (maxOrderQty.minus(requireQty).lt(0)) {
                    this.showTxStatusModal('error', 'Over Maximum Order Quantity');
                    this.updateSubmitButton(false);
                    return;
                }
                const amount = this.productInfo.price.times(requireQty).shiftedBy(-token.decimals);
                if (balance.lt(amount)) {
                    this.showTxStatusModal('error', `Insufficient ${this.tokenInput.token.symbol} Balance`);
                    this.updateSubmitButton(false);
                    return;
                }
                await this.buyToken(requireQty);
            }
            else if (this._type === index_13.ProductType.Subscription) {
                if (!this.edtStartDate.value) {
                    this.showTxStatusModal('error', 'Start Date Required');
                    this.updateSubmitButton(false);
                    return;
                }
                if (!this.edtDuration.value) {
                    this.showTxStatusModal('error', 'Duration Required');
                    this.updateSubmitButton(false);
                    return;
                }
                await this.buyToken();
            }
            else {
                if (!this.tokenInput.value) {
                    this.showTxStatusModal('error', 'Amount Required');
                    this.updateSubmitButton(false);
                    return;
                }
                if (balance.lt(this.tokenInput.value)) {
                    this.showTxStatusModal('error', `Insufficient ${this.tokenInput.token.symbol} Balance`);
                    this.updateSubmitButton(false);
                    return;
                }
                await this.buyToken();
            }
            this.updateSubmitButton(false);
            if (this.txStatusModal)
                this.txStatusModal.closeModal();
        }
        async onSubmit() {
            if (!(0, index_15.isClientWalletConnected)()) {
                this.connectWallet();
                return;
            }
            if (!this.state.isRpcWalletConnected()) {
                const clientWallet = eth_wallet_6.Wallet.getClientInstance();
                await clientWallet.switchNetwork(this.chainId);
                return;
            }
            if (this.nftType === 'ERC721' && !this.productId) {
                const contractAddress = this.state.getExplorerByAddress(this.chainId, this.nftAddress);
                const tokenAddress = this.state.getExplorerByAddress(this.chainId, this.oswapTrollInfo.token.address);
                this.showTxStatusModal('warning', 'Confirming', `to contract\n${contractAddress}\nwith token\n${tokenAddress}`);
            }
            else {
                this.showTxStatusModal('warning', 'Confirming');
            }
            this.approvalModelAction.doPayAction();
        }
        async mintNft() {
            const txHashCallback = (err, receipt) => {
                if (err) {
                    this.showTxStatusModal('error', err);
                    this.updateSubmitButton(false);
                }
            };
            const confirmationCallback = async (receipt) => {
                const oswapTroll = await (0, API_3.fetchOswapTrollNftInfo)(this.state, this.nftAddress);
                if (oswapTroll) {
                    this.lblSpotsRemaining.caption = (0, index_14.formatNumber)(oswapTroll.cap, 0);
                    this.cap = oswapTroll.cap.toNumber();
                }
                const nftBalance = await (0, API_3.fetchUserNftBalance)(this.state, this.nftAddress);
                this.lbOwn.caption = (0, index_14.formatNumber)(nftBalance || 0, 0);
                this.updateSubmitButton(false);
                if (this.onMintedNFT)
                    this.onMintedNFT();
            };
            (0, index_14.registerSendTxEvents)({
                transactionHash: txHashCallback,
                confirmation: confirmationCallback
            });
            await (0, API_3.mintOswapTrollNft)(this.nftAddress, txHashCallback);
        }
        async buyToken(quantity) {
            if (!this.productId)
                return;
            const callback = (error, receipt) => {
                if (error) {
                    this.showTxStatusModal('error', error);
                }
            };
            const token = this.productInfo.token;
            if (this.productType == index_13.ProductType.DonateToOwner || this.productType == index_13.ProductType.DonateToEveryone) {
                await (0, API_3.donate)(this.state, this.productId, this.recipient, this.tokenInput.value, this._data.commissions, token, callback, async () => {
                    await this.updateTokenBalance();
                });
            }
            else if (this.productType === index_13.ProductType.Subscription) {
                const startTime = this.edtStartDate.value.unix();
                const days = this.getDurationInDays();
                await (0, API_3.subscribe)(this.state, this.productId, startTime, days * 86400, this.recipient, this._data.referrer, this.discountApplied?.id ?? 0, callback, async () => {
                    await this.updateTokenBalance();
                    this.productInfo = await (0, API_3.getProductInfo)(this.state, this.productId);
                    const nftBalance = await (0, API_3.getNFTBalance)(this.state, this.productId);
                    this.lbOwn.caption = nftBalance;
                    this.updateSpotsRemaining();
                    if (this.onMintedNFT)
                        this.onMintedNFT();
                });
            }
            else if (this.productType == index_13.ProductType.Buy) {
                await (0, API_3.buyProduct)(this.state, this.productId, quantity, this._data.commissions, token, callback, async () => {
                    await this.updateTokenBalance();
                    this.productInfo = await (0, API_3.getProductInfo)(this.state, this.productId);
                    const nftBalance = await (0, API_3.getNFTBalance)(this.state, this.productId);
                    this.lbOwn.caption = nftBalance;
                    this.updateSpotsRemaining();
                    if (this.onMintedNFT)
                        this.onMintedNFT();
                });
            }
        }
        getDurationInDays() {
            const unit = (this.comboDurationUnit.selectedItem?.value || DurationUnits[0].value);
            const duration = Number(this.edtDuration.value) || 0;
            if (unit === 'days') {
                return duration;
            }
            else {
                const dateFormat = 'YYYY-MM-DD';
                const startDate = this.edtStartDate.value ? (0, components_8.moment)(this.edtStartDate.value.format(dateFormat), dateFormat) : (0, components_8.moment)();
                const endDate = (0, components_8.moment)(startDate).add(duration, unit);
                const diff = endDate.diff(startDate, 'days');
                return diff;
            }
        }
        _updateEndDate() {
            const dateFormat = 'YYYY-MM-DD';
            if (!this.edtStartDate.value) {
                this.lblEndDate.caption = '-';
                return;
            }
            const startDate = (0, components_8.moment)(this.edtStartDate.value.format(dateFormat), dateFormat);
            const unit = (this.comboDurationUnit.selectedItem?.value || DurationUnits[0].value);
            const duration = Number(this.edtDuration.value) || 0;
            this.lblEndDate.caption = startDate.add(duration, unit).format('DD/MM/YYYY');
        }
        _updateDiscount() {
            this.discountApplied = undefined;
            const duration = Number(this.edtDuration.value) || 0;
            if (!this.discountRules?.length || !duration || !this.edtStartDate.value)
                return;
            const price = eth_wallet_6.Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals);
            const startTime = this.edtStartDate.value.unix();
            const days = this.getDurationInDays();
            const durationInSec = days * 86400;
            let discountAmount;
            for (let rule of this.discountRules) {
                if (rule.discountApplication === 0 && this.isRenewal)
                    continue;
                if (rule.discountApplication === 1 && !this.isRenewal)
                    continue;
                if ((rule.startTime > 0 && startTime < rule.startTime) || (rule.endTime > 0 && startTime > rule.endTime) || rule.minDuration.gt(durationInSec))
                    continue;
                let basePrice = price;
                if (rule.discountPercentage > 0) {
                    basePrice = price.times(1 - rule.discountPercentage / 100);
                }
                else if (rule.fixedPrice.gt(0)) {
                    basePrice = rule.fixedPrice;
                }
                let tmpDiscountAmount = price.minus(basePrice).div(this.productInfo.priceDuration.div(86400)).times(days);
                if (!this.discountApplied || tmpDiscountAmount.gt(discountAmount)) {
                    this.discountApplied = rule;
                    discountAmount = tmpDiscountAmount;
                }
            }
        }
        _updateTotalAmount() {
            const duration = Number(this.edtDuration.value) || 0;
            if (!duration)
                this.lbOrderTotal.caption = `0 ${this.productInfo.token?.symbol || ''}`;
            const price = this.productInfo.price;
            let basePrice = price;
            this.pnlDiscount.visible = false;
            if (this.discountApplied) {
                if (this.discountApplied.discountPercentage > 0) {
                    basePrice = price.times(1 - this.discountApplied.discountPercentage / 100);
                    this.lblDiscount.caption = `Discount (${this.discountApplied.discountPercentage}% off)`;
                    this.pnlDiscount.visible = true;
                }
                else if (this.discountApplied.fixedPrice.gt(0)) {
                    basePrice = this.discountApplied.fixedPrice;
                    this.lblDiscount.caption = "Discount";
                    this.pnlDiscount.visible = true;
                }
            }
            const pricePerDay = basePrice.div(this.productInfo.priceDuration.div(86400));
            const days = this.getDurationInDays();
            const amountRaw = pricePerDay.times(days);
            const amount = eth_wallet_6.Utils.fromDecimals(amountRaw, this.productInfo.token.decimals);
            this.tokenAmountIn = amount.toFixed();
            if (this.discountApplied) {
                const discountAmountRaw = price.minus(basePrice).div(this.productInfo.priceDuration.div(86400)).times(days);
                const discountAmount = eth_wallet_6.Utils.fromDecimals(discountAmountRaw, this.productInfo.token.decimals);
                this.lblDiscountAmount.caption = `-${(0, index_14.formatNumber)(discountAmount)} ${this.productInfo.token?.symbol || ''}`;
            }
            this.lbOrderTotal.caption = `${(0, index_14.formatNumber)(amount, 6)} ${this.productInfo.token?.symbol || ''}`;
        }
        onStartDateChanged() {
            this._updateEndDate();
            this._updateDiscount();
        }
        onDurationChanged() {
            this._updateEndDate();
            this._updateDiscount();
            this._updateTotalAmount();
            if (this.approvalModelAction) {
                this.approvalModelAction.checkAllowance(this.productInfo.token, this.tokenAmountIn);
            }
        }
        onDurationUnitChanged() {
            this._updateEndDate();
            this._updateDiscount();
            this._updateTotalAmount();
            if (this.approvalModelAction) {
                this.approvalModelAction.checkAllowance(this.productInfo.token, this.tokenAmountIn);
            }
        }
        async init() {
            super.init();
            this._createProduct = this._createProduct.bind(this);
            this.onMintedNFT = this.getAttribute('onMintedNFT', true) || this.onMintedNFT;
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                const link = this.getAttribute('link', true);
                const nftType = this.getAttribute('nftType', true);
                const chainId = this.getAttribute('chainId', true);
                const nftAddress = this.getAttribute('nftAddress', true);
                const erc1155Index = this.getAttribute('erc1155Index', true);
                const productType = this.getAttribute('productType', true);
                const name = this.getAttribute('name', true);
                const title = this.getAttribute('title', true);
                const description = this.getAttribute('description', true);
                const logoUrl = this.getAttribute('logoUrl', true);
                const chainSpecificProperties = this.getAttribute('chainSpecificProperties', true);
                const networks = this.getAttribute('networks', true);
                const wallets = this.getAttribute('wallets', true);
                const showHeader = this.getAttribute('showHeader', true);
                const defaultChainId = this.getAttribute('defaultChainId', true);
                const tokenToMint = this.getAttribute('tokenToMint', true);
                const customMintToken = this.getAttribute('customMintToken', true);
                const priceToMint = this.getAttribute('priceToMint', true);
                const maxQty = this.getAttribute('maxQty', true);
                const txnMaxQty = this.getAttribute('txnMaxQty', true);
                await this.setData({
                    nftType,
                    chainId,
                    nftAddress,
                    erc1155Index,
                    link,
                    productType,
                    name,
                    title,
                    chainSpecificProperties,
                    defaultChainId,
                    tokenToMint,
                    customMintToken,
                    priceToMint,
                    maxQty,
                    txnMaxQty,
                    description,
                    logoUrl,
                    networks,
                    wallets,
                    showHeader
                });
            }
            this.executeReadyCallback();
        }
        render() {
            return (this.$render("i-panel", null,
                this.$render("i-scom-dapp-container", { id: "containerDapp" },
                    this.$render("i-panel", { background: { color: Theme.background.main } },
                        this.$render("i-grid-layout", { width: '100%', height: '100%', templateColumns: ['1fr'] },
                            this.$render("i-stack", { direction: 'vertical', padding: { top: '1.5rem', bottom: '1.25rem', left: '1.25rem', right: '1.5rem' }, alignItems: "center" },
                                this.$render("i-stack", { direction: 'vertical', width: "100%", maxWidth: 600, gap: '0.5rem' },
                                    this.$render("i-vstack", { class: "text-center", gap: "0.5rem" },
                                        this.$render("i-image", { id: 'imgLogo', height: 100, border: { radius: 4 } }),
                                        this.$render("i-label", { id: 'lblTitle', font: { bold: true, size: '1.5rem' } }),
                                        this.$render("i-markdown", { id: 'markdownViewer', class: index_css_5.markdownStyle, width: '100%', height: '100%', margin: { bottom: '0.563rem' } })),
                                    this.$render("i-vstack", { gap: "0.5rem", id: "pnlInputFields" },
                                        this.$render("i-image", { visible: false, id: "imgUri", width: 280, maxWidth: "100%", height: "auto", maxHeight: 150, margin: { top: 4, bottom: 16, left: 'auto', right: 'auto' } }),
                                        this.$render("i-hstack", { id: "detailWrapper", horizontalAlignment: "space-between", gap: 10, visible: false, wrap: "wrap" },
                                            this.$render("i-hstack", { id: "erc1155Wrapper", width: "100%", justifyContent: "space-between", visible: false, gap: "0.5rem", lineHeight: 1.5 },
                                                this.$render("i-label", { caption: "ERC1155 Index", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-label", { id: "lbERC1155Index", font: { size: '1rem' } })),
                                            this.$render("i-hstack", { width: "100%", justifyContent: "space-between", gap: "0.5rem", lineHeight: 1.5 },
                                                this.$render("i-label", { caption: "Contract Address", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-hstack", { gap: "0.25rem", verticalAlignment: "center", maxWidth: "calc(100% - 75px)" },
                                                    this.$render("i-label", { id: "lbContract", font: { size: '1rem', color: Theme.colors.primary.main }, textDecoration: "underline", class: index_css_5.linkStyle, onClick: this.onViewContract }),
                                                    this.$render("i-icon", { fill: Theme.text.primary, name: "copy", width: 16, height: 16, onClick: this.onCopyContract, cursor: "pointer" }))),
                                            this.$render("i-hstack", { width: "100%", justifyContent: "space-between", gap: "0.5rem", lineHeight: 1.5 },
                                                this.$render("i-label", { caption: "Token Address", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-hstack", { gap: "0.25rem", verticalAlignment: "center", maxWidth: "calc(100% - 75px)" },
                                                    this.$render("i-label", { id: "lbToken", font: { size: '1rem', color: Theme.colors.primary.main }, textDecoration: "underline", class: index_css_5.linkStyle, onClick: this.onViewToken }),
                                                    this.$render("i-icon", { id: "iconCopyToken", visible: false, fill: Theme.text.primary, name: "copy", width: 16, height: 16, onClick: this.onCopyToken, cursor: "pointer" }))),
                                            this.$render("i-hstack", { width: "100%", justifyContent: "space-between", gap: "0.5rem", lineHeight: 1.5 },
                                                this.$render("i-label", { caption: "Remaining", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-label", { id: "lblSpotsRemaining", font: { size: '1rem' } })),
                                            this.$render("i-hstack", { id: 'pnlMintFee', width: "100%", justifyContent: "space-between", visible: false, gap: '0.5rem', lineHeight: 1.5 },
                                                this.$render("i-label", { caption: 'Price', font: { bold: true, size: '1rem' } }),
                                                this.$render("i-label", { id: 'lblMintFee', font: { size: '1rem' } })),
                                            this.$render("i-hstack", { width: "100%", justifyContent: "space-between", gap: "0.5rem", lineHeight: 1.5 },
                                                this.$render("i-label", { caption: "You own", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-label", { id: "lbOwn", font: { size: '1rem' } }))),
                                        this.$render("i-button", { id: "btnDetail", caption: "More Information", rightIcon: { width: 10, height: 16, margin: { left: 5 }, fill: Theme.text.primary, name: 'caret-down' }, background: { color: 'transparent' }, border: { width: 1, style: 'solid', color: Theme.text.primary, radius: 8 }, width: 280, maxWidth: "100%", height: 36, margin: { top: 4, bottom: 16, left: 'auto', right: 'auto' }, onClick: this.onToggleDetail, visible: false }),
                                        this.$render("i-hstack", { id: 'pnlQty', width: "100%", justifyContent: "space-between", alignItems: 'center', gap: "0.5rem", lineHeight: 1.5, visible: false },
                                            this.$render("i-label", { caption: 'Quantity', font: { bold: true, size: '1rem' } }),
                                            this.$render("i-panel", { width: "50%" },
                                                this.$render("i-input", { id: 'edtQty', height: 35, width: "100%", onChanged: this.onQtyChanged.bind(this), class: index_css_5.inputStyle, inputType: 'number', font: { size: '1rem' }, border: { radius: 4, style: 'none' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' } }))),
                                        this.$render("i-stack", { id: 'pnlRecipient', width: '100%', direction: "horizontal", alignItems: "center", justifyContent: "space-between", gap: 10 },
                                            this.$render("i-label", { caption: 'Recipient', font: { bold: true, size: '1rem' } }),
                                            this.$render("i-input", { id: 'edtRecipient', height: 35, width: "100%", class: index_css_5.inputStyle, font: { size: '1rem' }, border: { radius: 4, style: 'none' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' } })),
                                        this.$render("i-stack", { id: "pnlSubscriptionPeriod", direction: "vertical", width: "100%", gap: "0.5rem", visible: false },
                                            this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 10 },
                                                this.$render("i-label", { caption: "Starts", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-panel", { width: "50%" },
                                                    this.$render("i-datepicker", { id: 'edtStartDate', height: 36, width: "100%", type: "date", placeholder: "dd/mm/yyyy", background: { color: Theme.input.background }, font: { size: '1rem' }, border: { radius: "0.375rem" }, onChanged: this.onStartDateChanged }))),
                                            this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 10 },
                                                this.$render("i-label", { caption: "Duration", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-stack", { direction: "horizontal", width: "50%", alignItems: "center", gap: "0.5rem" },
                                                    this.$render("i-panel", { width: "50%" },
                                                        this.$render("i-input", { id: 'edtDuration', height: 36, width: "100%", class: index_css_5.inputStyle, inputType: 'number', font: { size: '1rem' }, border: { radius: 4, style: 'none' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }, onChanged: this.onDurationChanged })),
                                                    this.$render("i-panel", { width: "50%" },
                                                        this.$render("i-combo-box", { id: "comboDurationUnit", height: 36, width: "100%", icon: { width: 14, height: 14, name: 'angle-down', fill: Theme.divider }, border: { width: 1, style: 'solid', color: Theme.divider, radius: 5 }, items: DurationUnits, selectedItem: DurationUnits[0], onChanged: this.onDurationUnitChanged })))),
                                            this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 10 },
                                                this.$render("i-label", { caption: "Ends", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-label", { id: "lblEndDate", font: { size: '1rem' } }))),
                                        this.$render("i-stack", { id: "pnlDiscount", direction: "horizontal", width: "100%", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", lineHeight: 1.5, visible: false },
                                            this.$render("i-label", { id: "lblDiscount", caption: "Discount", font: { bold: true, size: '1rem' } }),
                                            this.$render("i-label", { id: "lblDiscountAmount", font: { size: '1rem' } })),
                                        this.$render("i-hstack", { width: "100%", justifyContent: "space-between", alignItems: 'center', gap: "0.5rem", lineHeight: 1.5 },
                                            this.$render("i-hstack", { verticalAlignment: 'center', gap: "0.5rem" },
                                                this.$render("i-label", { id: "lbOrderTotalTitle", caption: 'Total', font: { bold: true, size: '1rem' } }),
                                                this.$render("i-icon", { id: "iconOrderTotal", name: "question-circle", fill: Theme.background.modal, width: 20, height: 20 })),
                                            this.$render("i-label", { id: 'lbOrderTotal', font: { size: '1rem' }, caption: "0" })),
                                        this.$render("i-vstack", { id: "pnlTokenInput", gap: '0.25rem', margin: { bottom: '1rem' }, visible: false },
                                            this.$render("i-hstack", { horizontalAlignment: 'space-between', verticalAlignment: 'center', gap: "0.5rem" },
                                                this.$render("i-label", { caption: "Your donation", font: { weight: 500, size: '1rem' } }),
                                                this.$render("i-hstack", { horizontalAlignment: 'end', verticalAlignment: 'center', gap: "0.5rem", opacity: 0.6 },
                                                    this.$render("i-label", { caption: 'Balance:', font: { size: '1rem' } }),
                                                    this.$render("i-label", { id: 'lblBalance', font: { size: '1rem' }, caption: "0.00" }))),
                                            this.$render("i-stack", { direction: "horizontal", overflow: "hidden", background: { color: Theme.input.background }, font: { color: Theme.input.fontColor }, height: 56, width: "50%", margin: { left: 'auto', right: 'auto' }, alignItems: "center", border: { radius: 16, width: '2px', style: 'solid', color: 'transparent' } },
                                                this.$render("i-scom-token-input", { id: "tokenInput", tokenReadOnly: true, isBtnMaxShown: false, isCommonShown: false, isBalanceShown: false, isSortBalanceShown: false, class: index_css_5.tokenSelectionStyle, padding: { left: '11px' }, font: { size: '1.25rem' }, width: "100%", height: "100%", placeholder: "0.00", modalStyles: {
                                                        maxHeight: '50vh'
                                                    }, onSelectToken: this.selectToken, onInputAmountChanged: this.onAmountChanged }))),
                                        this.$render("i-vstack", { horizontalAlignment: "center", verticalAlignment: 'center', gap: "8px", width: "100%", margin: { top: '0.5rem' } },
                                            this.$render("i-button", { id: "btnApprove", width: '100%', caption: "Approve", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText, bold: true }, rightIcon: { visible: false, fill: Theme.colors.primary.contrastText }, background: { color: Theme.background.gradient }, border: { radius: 12 }, visible: false, onClick: this.onApprove.bind(this) }),
                                            this.$render("i-button", { id: 'btnSubmit', width: '100%', caption: 'Submit', padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText, bold: true }, rightIcon: { visible: false, fill: Theme.colors.primary.contrastText }, background: { color: Theme.background.gradient }, border: { radius: 12 }, onClick: this.onSubmit.bind(this), enabled: false })),
                                        this.$render("i-vstack", { id: "pnlAddress", gap: '0.25rem', margin: { top: '1rem' } },
                                            this.$render("i-label", { id: 'lblRef', font: { size: '0.875rem' }, opacity: 0.5 }),
                                            this.$render("i-label", { id: 'lblAddress', font: { size: '0.875rem' }, overflowWrap: 'anywhere' }))),
                                    this.$render("i-vstack", { id: 'pnlUnsupportedNetwork', visible: false, horizontalAlignment: 'center' },
                                        this.$render("i-label", { caption: 'This network or this token is not supported.', font: { size: '1.5rem' } })),
                                    this.$render("i-hstack", { id: 'pnlLink', visible: false, verticalAlignment: 'center', gap: '0.25rem' },
                                        this.$render("i-label", { caption: 'Details here: ', font: { size: '1rem' } }),
                                        this.$render("i-label", { id: 'lblLink', font: { size: '1rem' } }))))),
                        this.$render("i-scom-wallet-modal", { id: "mdWallet", wallets: [] }),
                        this.$render("i-scom-tx-status-modal", { id: "txStatusModal" })))));
        }
    };
    ScomNftMinter = __decorate([
        components_8.customModule,
        (0, components_8.customElements)('i-scom-nft-minter')
    ], ScomNftMinter);
    exports.default = ScomNftMinter;
});
