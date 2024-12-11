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
    exports.readOnlyInfoStyle = exports.readOnlyStyle = exports.comboBoxStyle = exports.formInputStyle = exports.linkStyle = exports.tokenSelectionStyle = exports.inputStyle = exports.markdownStyle = void 0;
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
        opacity: 0.65,
        cursor: 'default',
        $nest: {
            '*': {
                cursor: 'default'
            },
            '.btn-cb-network': {
                borderColor: 'transparent !important',
                background: Theme.action.disabledBackground
            },
            'i-icon': {
                display: 'none'
            },
            '.icon-btn': {
                display: 'none'
            },
            '.selection': {
                borderRadius: 'inherit !important',
                maxWidth: '100%'
            },
        }
    });
    exports.readOnlyInfoStyle = components_3.Styles.style({
        $nest: {
            '&> i-panel > i-stack > :last-child': {
                opacity: 0.7
            }
        }
    });
});
define("@scom/scom-nft-minter/data.json.ts", ["require", "exports", "@scom/scom-nft-minter/utils/index.ts"], function (require, exports, index_4) {
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
                },
                {
                    "name": "walletconnect"
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
            "tokenToMint": index_4.nullAddress
        },
        "defaultOswapTroll": {
            "chainId": 43113,
            "nftType": "ERC721",
            "nftAddress": "0x390118aa8bde8c63f159a0d032dbdc8bed83ef42",
        },
    };
});
define("@scom/scom-nft-minter/API.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-nft-minter/interface/index.tsx", "@scom/scom-product-contract", "@scom/scom-commission-proxy-contract", "@scom/oswap-troll-nft-contract", "@scom/scom-nft-minter/utils/index.ts", "@scom/scom-token-list", "@scom/scom-network-list"], function (require, exports, eth_wallet_3, index_5, scom_product_contract_2, scom_commission_proxy_contract_1, oswap_troll_nft_contract_1, index_6, scom_token_list_5, scom_network_list_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mintOswapTrollNft = exports.fetchUserNftBalance = exports.fetchOswapTrollNftInfo = exports.updateCommissionCampaign = exports.updateProductPrice = exports.updateProductUri = exports.getProductOwner = exports.renewSubscription = exports.subscribe = exports.donate = exports.buyProduct = exports.getProxyTokenAmountIn = exports.newDefaultBuyProduct = exports.createSubscriptionNFT = exports.newProduct = exports.updateDiscountRules = exports.getDiscountRules = exports.getProductIdFromEvent = exports.getProductId = exports.getNFTBalance = exports.getProductInfo = void 0;
    async function getProductInfo(state, productId) {
        let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
        if (!productMarketplaceAddress)
            return null;
        try {
            const wallet = state.getRpcWallet();
            const productMarketplace = new scom_product_contract_2.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
            const product = await productMarketplace.products(productId);
            const chainId = wallet.chainId;
            if (product.token && product.token === index_6.nullAddress) {
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
                token = await (0, index_6.getTokenInfo)(product.token, chainId);
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
        (0, index_6.registerSendTxEvents)({
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
        (0, index_6.registerSendTxEvents)({
            transactionHash: callback,
            confirmation: confirmationCallback
        });
        let productTypeCode;
        switch (productType) {
            case index_5.ProductType.Buy:
                productTypeCode = 0;
                break;
            case index_5.ProductType.Subscription:
                productTypeCode = 1;
                break;
            case index_5.ProductType.DonateToOwner:
                productTypeCode = 2;
                break;
            case index_5.ProductType.DonateToEveryone:
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
        return await newProduct(productMarketplaceAddress, index_5.ProductType.Subscription, quantity, quantity, price, "0", tokenAddress, tokenDecimals, uri, '', '', priceDuration, callback, confirmationCallback);
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
        return await newProduct(productMarketplaceAddress, index_5.ProductType.Buy, qty, qty, //maxQty
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
            (0, index_6.registerSendTxEvents)({
                transactionHash: callback,
                confirmation: confirmationCallback
            });
            if (token?.address && token?.address !== index_6.nullAddress) {
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
            (0, index_6.registerSendTxEvents)({
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
    async function getDiscount(state, productId, productPrice, discountRuleId) {
        let basePrice = productPrice;
        let promotionAddress = state.getContractAddress('Promotion');
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        const promotion = new scom_product_contract_2.Contracts.Promotion(wallet, promotionAddress);
        const index = await promotion.discountRuleIdToIndex({ param1: productId, param2: discountRuleId });
        const rule = await promotion.discountRules({ param1: productId, param2: index });
        if (rule.discountPercentage.gt(0)) {
            const discount = productPrice.times(rule.discountPercentage).div(100);
            if (productPrice.gt(discount))
                basePrice = productPrice.minus(discount);
        }
        else if (rule.fixedPrice.gt(0)) {
            basePrice = rule.fixedPrice;
        }
        else {
            discountRuleId = 0;
        }
        return {
            price: basePrice,
            id: discountRuleId
        };
    }
    async function subscribe(state, productId, startTime, duration, recipient, referrer, discountRuleId = 0, callback, confirmationCallback) {
        let commissionAddress = state.getContractAddress('Commission');
        let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        const commission = new scom_product_contract_2.Contracts.Commission(wallet, commissionAddress);
        const productMarketplace = new scom_product_contract_2.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
        const product = await productMarketplace.products(productId);
        let basePrice = product.price;
        if (discountRuleId !== 0) {
            const discount = await getDiscount(state, productId, product.price, discountRuleId);
            basePrice = discount.price;
            if (discount.id === 0)
                discountRuleId = 0;
        }
        const amount = product.priceDuration.eq(duration) ? basePrice : basePrice.times(duration).div(product.priceDuration);
        let tokenInAmount;
        if (referrer) {
            let campaign = await commission.getCampaign({ campaignId: productId, returnArrays: true });
            const affiliates = (campaign?.affiliates || []).map(a => a.toLowerCase());
            if (affiliates.includes(referrer.toLowerCase())) {
                const commissionRate = eth_wallet_3.Utils.fromDecimals(campaign.commissionRate, 6);
                tokenInAmount = new eth_wallet_3.BigNumber(amount).dividedBy(new eth_wallet_3.BigNumber(1).minus(commissionRate)).decimalPlaces(0, eth_wallet_3.BigNumber.ROUND_DOWN);
            }
        }
        let receipt;
        try {
            (0, index_6.registerSendTxEvents)({
                transactionHash: callback,
                confirmation: confirmationCallback
            });
            if (product.token === index_6.nullAddress) {
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
            throw err;
        }
        return receipt;
    }
    exports.subscribe = subscribe;
    async function renewSubscription(state, productId, duration, recipient, discountRuleId = 0, callback, confirmationCallback) {
        let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        const productMarketplace = new scom_product_contract_2.Contracts.ProductMarketplace(wallet, productMarketplaceAddress);
        const product = await productMarketplace.products(productId);
        const subscriptionNFT = new scom_product_contract_2.Contracts.SubscriptionNFT(wallet, product.nft);
        let nftId = await subscriptionNFT.tokenOfOwnerByIndex({
            owner: recipient,
            index: 0
        });
        let basePrice = product.price;
        if (discountRuleId !== 0) {
            const discount = await getDiscount(state, productId, product.price, discountRuleId);
            basePrice = discount.price;
            if (discount.id === 0)
                discountRuleId = 0;
        }
        const amount = product.priceDuration.eq(duration) ? basePrice : basePrice.times(duration).div(product.priceDuration);
        let receipt;
        try {
            (0, index_6.registerSendTxEvents)({
                transactionHash: callback,
                confirmation: confirmationCallback
            });
            if (product.token === index_6.nullAddress) {
                receipt = await productMarketplace.renewSubscription({
                    productId: productId,
                    nftId: nftId,
                    duration: duration,
                    discountRuleId: discountRuleId
                }, amount);
            }
            else {
                receipt = await productMarketplace.renewSubscription({
                    productId: productId,
                    nftId: nftId,
                    duration: duration,
                    discountRuleId: discountRuleId
                });
            }
        }
        catch (err) {
            console.error(err);
            throw err;
        }
        return receipt;
    }
    exports.renewSubscription = renewSubscription;
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
            (0, index_6.registerSendTxEvents)({
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
define("@scom/scom-nft-minter/languages/main.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/languages/main.json.ts'/> 
    exports.default = {
        "en": {
            "a_commission_fee_of_percent_will_be_applied_to_the_amount_you_input": "A commission fee of {{rate}}% will be applied to the amount you input.",
            "all_proceeds_will_go_to_following_vetted_wallet_address": "All proceeds will go to following vetted wallet address:",
            "amount_required": "Amount Required",
            "approve": "Approve",
            "approving": "Approving",
            "balance": "Balance:",
            "base_price": "Base Price",
            "confirm": "Confirm",
            "confirming": "Confirming",
            "custom": "Custom",
            "day_s": "Day(s)",
            "details_here": "Details here: ",
            "discount": "Discount",
            "duration_required": "Duration Required",
            "duration": "Duration",
            "end_date": "End Date",
            "for_days": " for {{days}} days",
            "hide_information": "Hide Information",
            "hurry_only_nfts_left": "🔥 Hurry! Only [ {{cap}} NFTs Left ] 🔥",
            "insufficient_balance": "Insufficient {{symbol}} Balance",
            "invalid_duration": "Invalid Duration",
            "invalid_quantity": "Invalid Quantity",
            "invalid_token": "Invalid token!",
            "make_a_contribution": "Make a Contributon",
            "marketplace_contract_address": "Marketplace Contract Address",
            "mint": "Mint",
            "month_s": "Month(s)",
            "more_information": "More Information",
            "native_token": "{{chainName}} Native Token",
            "nft_contract_address": "NFT Contract Address",
            "now": "Now",
            "out_of_stock": "Out of stock",
            "over_maximum_order_quantity": "Over Maximum Order Quantity",
            "per_day": " per day",
            "quantity_greater_than_max_quantity": "Quantity Greater Than Max Quantity",
            "quantity": "Quantity",
            "renew_subscription": "Renew Subscription",
            "smart_contract": "smart contract:",
            "something_went_wrong_creating_new_product": "Something went wrong creating new product!",
            "something_went_wrong_updating_commission_campaign": "Something went wrong updating commission campaign!",
            "something_went_wrong_updating_discount_rule": "Something went wrong updating discount rule!",
            "start_date_required": "Start Date Required",
            "start_date": "Start Date",
            "submit": "Submit",
            "subscribe": "Subscribe",
            "this_network_is_not_supported": "This network is not supported!",
            "this_network_or_this_token_is_not_supported": "This network or this token is not supported.",
            "to_contract_with_token": "to contract\n{{address}}\nwith token\n{{token}}",
            "token_required": "Token Required",
            "token_to_mint_is_missing": "TokenToMint is missing!",
            "token_used_for_payment": "Token used for payment",
            "total": "Total",
            "wallet_address_to_receive_nft": "Wallet Address to Receive NFT",
            "year_s": "Year(s)",
            "you_will_pay": "You will pay",
            "your_donation": "Your donation",
        },
        "zh-hant": {
            "a_commission_fee_of_percent_will_be_applied_to_the_amount_you_input": "您輸入的金額將收取 {{rate}}% 的佣金費用。",
            "all_proceeds_will_go_to_following_vetted_wallet_address": "所有收益將轉入以下經過審核的錢包地址：",
            "amount_required": "所需金額",
            "approve": "批准",
            "approving": "正在批准",
            "balance": "餘額：",
            "base_price": "基礎價格",
            "confirm": "確認",
            "confirming": "正在確認",
            "custom": "自定義",
            "day_s": "天",
            "details_here": "詳情請見：",
            "discount": "折扣",
            "duration_required": "所需時長",
            "duration": "時長",
            "end_date": "結束日期",
            "for_days": "為期 {{days}} 天",
            "hide_information": "隱藏信息",
            "hurry_only_nfts_left": "🔥 快點！僅剩 [ {{cap}} 個NFT ] 🔥",
            "insufficient_balance": "{{symbol}} 餘額不足",
            "invalid_duration": "無效的時長",
            "invalid_quantity": "無效的數量",
            "invalid_token": "無效的代幣！",
            "make_a_contribution": "做出貢獻",
            "marketplace_contract_address": "市場合約地址",
            "mint": "鑄造",
            "month_s": "月",
            "more_information": "更多信息",
            "native_token": "{{chainName}} 原生代幣",
            "nft_contract_address": "NFT 合約地址",
            "now": "現在",
            "out_of_stock": "缺貨",
            "over_maximum_order_quantity": "超過最大訂購數量",
            "per_day": "每天",
            "quantity_greater_than_max_quantity": "數量超過最大數量",
            "quantity": "數量",
            "renew_subscription": "續訂",
            "smart_contract": "智能合約：",
            "something_went_wrong_creating_new_product": "創建新產品時出錯！",
            "something_went_wrong_updating_commission_campaign": "更新佣金活動時出錯！",
            "something_went_wrong_updating_discount_rule": "更新折扣規則時出錯！",
            "start_date_required": "開始日期必填",
            "start_date": "開始日期",
            "submit": "提交",
            "subscribe": "訂閱",
            "this_network_is_not_supported": "不支持此網絡！",
            "this_network_or_this_token_is_not_supported": "不支持此網絡或代幣。",
            "to_contract_with_token": "合約地址\n{{address}}\n代幣\n{{token}}",
            "token_required": "代幣必填",
            "token_to_mint_is_missing": "缺少鑄造的代幣！",
            "token_used_for_payment": "用於支付的代幣",
            "total": "總計",
            "wallet_address_to_receive_nft": "接收NFT的錢包地址",
            "year_s": "年",
            "you_will_pay": "您將支付",
            "your_donation": "您的捐款",
        },
        "vi": {
            "a_commission_fee_of_percent_will_be_applied_to_the_amount_you_input": "Phí hoa hồng {{rate}}% sẽ được áp dụng cho số tiền bạn nhập.",
            "all_proceeds_will_go_to_following_vetted_wallet_address": "Toàn bộ số tiền sẽ được chuyển đến địa chỉ ví đã xác minh sau đây:",
            "amount_required": "Yêu cầu số lượng",
            "approve": "Phê duyệt",
            "approving": "Đang phê duyệt",
            "balance": "Số dư:",
            "base_price": "Giá cơ bản",
            "confirm": "Xác nhận",
            "confirming": "Đang xác nhận",
            "custom": "Tùy chỉnh",
            "day_s": "Ngày",
            "details_here": "Chi tiết tại đây:",
            "discount": "Giảm giá",
            "duration_required": "Yêu cầu thời gian",
            "duration": "Thời gian",
            "end_date": "Ngày kết thúc",
            "for_days": " trong {{days}} ngày",
            "hide_information": "Ẩn thông tin",
            "hurry_only_nfts_left": "🔥 Nhanh lên! Chỉ còn [ {{cap}} NFT ] 🔥",
            "insufficient_balance": "Số dư {{symbol}} không đủ",
            "invalid_duration": "Thời gian không hợp lệ",
            "invalid_quantity": "Số lượng không hợp lệ",
            "invalid_token": "Token không hợp lệ!",
            "make_a_contribution": "Đóng góp",
            "marketplace_contract_address": "Địa chỉ hợp đồng Marketplace",
            "mint": "Đúc",
            "month_s": "Tháng",
            "more_information": "Thêm thông tin",
            "native_token": "Token gốc {{chainName}}",
            "nft_contract_address": "Địa chỉ hợp đồng NFT",
            "now": "Bây giờ",
            "out_of_stock": "Hết hàng",
            "over_maximum_order_quantity": "Vượt quá số lượng đặt hàng tối đa",
            "per_day": " mỗi ngày",
            "quantity_greater_than_max_quantity": "Số lượng vượt quá số lượng tối đa",
            "quantity": "Số lượng",
            "renew_subscription": "Gia hạn đăng ký",
            "smart_contract": "hợp đồng thông minh:",
            "something_went_wrong_creating_new_product": "Đã xảy ra lỗi khi tạo sản phẩm mới!",
            "something_went_wrong_updating_commission_campaign": "Đã xảy ra lỗi khi cập nhật chiến dịch hoa hồng!",
            "something_went_wrong_updating_discount_rule": "Đã xảy ra lỗi khi cập nhật quy tắc giảm giá!",
            "start_date_required": "Yêu cầu ngày bắt đầu",
            "start_date": "Ngày bắt đầu",
            "submit": "Gửi",
            "subscribe": "Đăng ký",
            "this_network_is_not_supported": "Mạng này không được hỗ trợ!",
            "this_network_or_this_token_is_not_supported": "Mạng này hoặc token này không được hỗ trợ.",
            "to_contract_with_token": "đến hợp đồng\n{{address}}\nvới token\n{{token}}",
            "token_required": "Token bắt buộc",
            "token_to_mint_is_missing": "Thiếu token để đúc!",
            "token_used_for_payment": "Token sử dụng để thanh toán",
            "total": "Tổng cộng",
            "wallet_address_to_receive_nft": "Địa chỉ ví nhận NFT",
            "year_s": "Năm",
            "you_will_pay": "Bạn sẽ phải trả",
            "your_donation": "Khoản quyên góp của bạn",
        }
    };
});
define("@scom/scom-nft-minter/languages/components.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/languages/components.json.ts'/> 
    exports.default = {
        "en": {
            "amount_of_token_to_pay_for_the_subscription": "Amount of token to pay for the subscription",
            "minimum_subscription_period_in_days": "Minimum Subscription Period (in Days)",
            "missing_chain": "Missing Chain!",
            "missing_index": "Missing Index!",
            "missing_nft_address": "Missing NFT Address!",
            "one_time_purchase": "One-Time Purchase",
            "payment_model": "Payment Model",
            "price": "Price",
            "something_went_wrong_when_updating": "Something went wrong when updating",
            "subscription_price_per_period": "Subscription Price per Period",
            "subscription_price": "Subscription Price",
            "subscription": "Subscription",
            "update": "Update",
            "updating": "Updating",
            "you_are_not_the_owner": "You are not the owner",
        },
        "zh-hant": {
            "amount_of_token_to_pay_for_the_subscription": "訂閱所需支付的代幣數量",
            "minimum_subscription_period_in_days": "最短訂閱期（天）",
            "missing_chain": "缺少鏈！",
            "missing_index": "缺少索引！",
            "missing_nft_address": "缺少 NFT 地址！",
            "one_time_purchase": "一次性購買",
            "payment_model": "支付模式",
            "price": "價格",
            "something_went_wrong_when_updating": "更新時出錯",
            "subscription_price_per_period": "每期訂閱價格",
            "subscription_price": "訂閱價格",
            "subscription": "訂閱",
            "update": "更新",
            "updating": "正在更新",
            "you_are_not_the_owner": "你不是擁有者",
        },
        "vi": {
            "amount_of_token_to_pay_for_the_subscription": "Số lượng token để thanh toán cho đăng ký",
            "minimum_subscription_period_in_days": "Thời gian đăng ký tối thiểu (theo ngày)",
            "missing_chain": "Thiếu chuỗi!",
            "missing_index": "Thiếu chỉ mục!",
            "missing_nft_address": "Thiếu địa chỉ NFT!",
            "one_time_purchase": "Mua một lần",
            "payment_model": "Mô hình thanh toán",
            "price": "Giá",
            "something_went_wrong_when_updating": "Đã xảy ra lỗi khi cập nhật",
            "subscription_price_per_period": "Giá đăng ký theo kỳ",
            "subscription_price": "Giá đăng ký",
            "subscription": "Đăng ký",
            "update": "Cập nhật",
            "updating": "Đang cập nhật",
            "you_are_not_the_owner": "Bạn không phải là chủ sở hữu",
        }
    };
});
define("@scom/scom-nft-minter/languages/common.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/languages/common.json.ts'/> 
    exports.default = {
        "en": {
            "connect_wallet": "Connect Wallet",
            "switch_network": "Switch Network",
        },
        "zh-hant": {
            "connect_wallet": "連接錢包",
            "switch_network": "切換網絡",
        },
        "vi": {
            "connect_wallet": "Kết nối ví",
            "switch_network": "Chuyển mạng",
        }
    };
});
define("@scom/scom-nft-minter/languages/index.ts", ["require", "exports", "@scom/scom-nft-minter/languages/main.json.ts", "@scom/scom-nft-minter/languages/components.json.ts", "@scom/scom-nft-minter/languages/common.json.ts"], function (require, exports, main_json_1, components_json_1, common_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.componentsJson = exports.mainJson = void 0;
    function mergeI18nData(i18nData) {
        const mergedI18nData = {};
        for (let i = 0; i < i18nData.length; i++) {
            const i18nItem = i18nData[i];
            for (const key in i18nItem) {
                mergedI18nData[key] = { ...(mergedI18nData[key] || {}), ...(i18nItem[key] || {}) };
            }
        }
        return mergedI18nData;
    }
    const mainJson = mergeI18nData([main_json_1.default, common_json_1.default]);
    exports.mainJson = mainJson;
    const componentsJson = mergeI18nData([components_json_1.default, common_json_1.default]);
    exports.componentsJson = componentsJson;
});
define("@scom/scom-nft-minter/component/fieldUpdate.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-nft-minter/index.css.ts", "@scom/scom-nft-minter/API.ts", "@scom/scom-nft-minter/store/index.ts", "@ijstech/eth-wallet", "@scom/scom-nft-minter/utils/index.ts", "@scom/scom-nft-minter/languages/index.ts"], function (require, exports, components_4, index_css_1, API_1, index_7, eth_wallet_4, index_8, index_9) {
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
                this.showTxStatusModal('error', this.i18n.get('$missing_chain'));
                return;
            }
            if (!nftAddress) {
                this.showTxStatusModal('error', this.i18n.get('$missing_nft_address'));
                return;
            }
            if (!erc1155Index) {
                this.showTxStatusModal('error', this.i18n.get('$missing_index'));
                return;
            }
            const owner = await (0, API_1.getProductOwner)(this.state, erc1155Index);
            if (owner !== eth_wallet_4.Wallet.getClientInstance().address) {
                this.showTxStatusModal('error', this.i18n.get('$you_are_not_the_owner'));
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
                this.showTxStatusModal('warning', `${this.i18n.get('$updating')} ${text}`);
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
                this.showTxStatusModal('error', `${this.i18n.get('$something_went_wrong_when_updating')} ${text}!`);
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
                this.btnUpdate.caption = (0, index_7.isClientWalletConnected)() ? '$switch_network' : '$connect_wallet';
            }
            else {
                // const data = await this.getData();
                // const { chainId, erc1155Index, nftAddress } = data;
                // this.btnUpdate.enabled = !!(chainId && erc1155Index && nftAddress && this.inputField.value);
                this.btnUpdate.enabled = !!this.inputField.value;
                this.btnUpdate.caption = '$update';
            }
        }
        async getData() {
            const form = this.closest('i-form');
            const data = await form.getFormData();
            return data;
        }
        init() {
            this.i18n.init({ ...index_9.componentsJson });
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
                this.$render("i-button", { id: "btnUpdate", width: 140, height: 42, padding: { left: '0.5rem', right: '0.5rem' }, margin: { left: 'auto' }, background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText }, border: { radius: '0.5rem' }, enabled: false, caption: "$update", onClick: this.onUpdate })));
        }
    };
    ScomNftMinterFieldUpdate = __decorate([
        (0, components_4.customElements)('i-scom-nft-minter-field-update')
    ], ScomNftMinterFieldUpdate);
    exports.ScomNftMinterFieldUpdate = ScomNftMinterFieldUpdate;
});
define("@scom/scom-nft-minter/component/addressInput.tsx", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-nft-minter/API.ts", "@scom/scom-nft-minter/index.css.ts", "@scom/scom-nft-minter/languages/index.ts"], function (require, exports, components_5, eth_wallet_5, API_2, index_css_2, index_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomNftMinterAddressInput = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    let ScomNftMinterAddressInput = class ScomNftMinterAddressInput extends components_5.Module {
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
            this.i18n.init({ ...index_10.componentsJson });
            super.init();
            this.state = this.getAttribute('state', true);
            const val = this.getAttribute('value', true);
            if (val)
                this.edtAddress.value = val;
            const readOnly = this.getAttribute('readOnly', true, false);
            this.edtAddress.readOnly = readOnly;
            if (readOnly) {
                this.edtAddress.classList.add(index_css_2.readOnlyStyle);
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
                    const durationInDays = Math.ceil((productInfo.priceDuration?.toNumber() || 0) / 86400);
                    this.lblPaymentModel.caption = isSubscription ? '$subscription' : '$one_time_purchase';
                    const price = components_5.FormatUtils.formatNumber(eth_wallet_5.Utils.fromDecimals(productInfo.price, productInfo.token.decimals).toFixed(), { minValue: '0.0000001', hasTrailingZero: false });
                    const symbol = productInfo.token?.symbol || '';
                    this.lblTitlePrice.caption = isSubscription ? '$subscription_price_per_period' : '$price';
                    this.lblPriceToMint.caption = `${price} ${symbol}`;
                    this.lblDurationInDays.caption = durationInDays.toString();
                    this.pnlDurationInDays.visible = isSubscription;
                }
            });
        }
        render() {
            this.$render("i-stack", { direction: "vertical" },
                this.$render("i-input", { id: "edtAddress", width: "100%", minWidth: "100px", height: 42, class: index_css_2.formInputStyle, onChanged: this.handleAddressChanged }),
                this.$render("i-stack", { id: "pnlProductInfo", class: index_css_2.readOnlyInfoStyle, direction: "vertical", width: "100%", visible: false },
                    this.$render("i-panel", { padding: { top: 5, bottom: 5, left: 5, right: 5 } },
                        this.$render("i-stack", { direction: "vertical", width: "100%", justifyContent: "center", gap: 5 },
                            this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", gap: 2 },
                                this.$render("i-label", { caption: "$payment_model" })),
                            this.$render("i-stack", { direction: "horizontal", alignItems: "center", width: "100%", height: 42, background: { color: Theme.input.background }, border: { width: 0.5, style: 'solid', color: Theme.input.background, radius: '0.625rem' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' } },
                                this.$render("i-label", { id: "lblPaymentModel", font: { color: Theme.input.fontColor } })))),
                    this.$render("i-panel", { id: "pnlDurationInDays", visible: false, padding: { top: 5, bottom: 5, left: 5, right: 5 } },
                        this.$render("i-stack", { direction: "vertical", width: "100%", justifyContent: "center", gap: 5 },
                            this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", gap: 2 },
                                this.$render("i-label", { caption: "$minimum_subscription_period_in_days" })),
                            this.$render("i-stack", { direction: "horizontal", alignItems: "center", width: "100%", height: 42, background: { color: Theme.input.background }, border: { width: 0.5, style: 'solid', color: Theme.input.background, radius: '0.625rem' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' } },
                                this.$render("i-label", { id: "lblDurationInDays", font: { color: Theme.input.fontColor } })))),
                    this.$render("i-panel", { padding: { top: 5, bottom: 5, left: 5, right: 5 } },
                        this.$render("i-stack", { direction: "vertical", width: "100%", justifyContent: "center", gap: 5 },
                            this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", gap: 2 },
                                this.$render("i-label", { id: "lblTitlePrice", caption: "$subscription_price" }),
                                this.$render("i-icon", { width: "1rem", height: "1rem", margin: { left: 2 }, name: "info-circle", tooltip: { content: '$amount_of_token_to_pay_for_the_subscription', placement: 'bottom' } })),
                            this.$render("i-stack", { direction: "horizontal", alignItems: "center", width: "100%", height: 42, background: { color: Theme.input.background }, border: { width: 0.5, style: 'solid', color: Theme.input.background, radius: '0.625rem' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' } },
                                this.$render("i-label", { id: "lblPriceToMint", font: { color: Theme.input.fontColor } }))))));
        }
    };
    ScomNftMinterAddressInput = __decorate([
        (0, components_5.customElements)('i-scom-nft-minter-address-input')
    ], ScomNftMinterAddressInput);
    exports.ScomNftMinterAddressInput = ScomNftMinterAddressInput;
});
define("@scom/scom-nft-minter/component/index.ts", ["require", "exports", "@scom/scom-nft-minter/component/fieldUpdate.tsx", "@scom/scom-nft-minter/component/addressInput.tsx"], function (require, exports, fieldUpdate_1, addressInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomNftMinterAddressInput = exports.ScomNftMinterFieldUpdate = void 0;
    Object.defineProperty(exports, "ScomNftMinterFieldUpdate", { enumerable: true, get: function () { return fieldUpdate_1.ScomNftMinterFieldUpdate; } });
    Object.defineProperty(exports, "ScomNftMinterAddressInput", { enumerable: true, get: function () { return addressInput_1.ScomNftMinterAddressInput; } });
});
define("@scom/scom-nft-minter/formSchema.json.ts", ["require", "exports", "@scom/scom-network-picker", "@scom/scom-token-input", "@ijstech/components", "@scom/scom-nft-minter/index.css.ts", "@scom/scom-nft-minter/utils/index.ts", "@scom/scom-nft-minter/store/index.ts", "@scom/scom-nft-minter/component/index.ts", "@scom/scom-nft-minter/interface/index.tsx"], function (require, exports, scom_network_picker_1, scom_token_input_1, components_6, index_css_3, index_11, index_12, index_13, index_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProjectOwnerSchema3 = exports.getProjectOwnerSchema2 = exports.getProjectOwnerSchema1 = exports.getBuilderSchema = void 0;
    const chainIds = [97, 43113];
    const networks = chainIds.map(v => { return { chainId: v }; });
    const getSupportedTokens = (chainId) => {
        return index_12.SupportedERC20Tokens[chainId] || [];
    };
    const payment = [
        {
            label: 'One-Time Purchase',
            value: index_14.PaymentModel.OneTimePurchase
        },
        {
            label: 'Subscription',
            value: index_14.PaymentModel.Subscription
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
                paymentModel: {
                    type: 'string',
                    title: 'Payment Model',
                    oneOf: [
                        {
                            title: 'One-Time Purchase',
                            const: index_14.PaymentModel.OneTimePurchase
                        },
                        {
                            title: 'Subscription',
                            const: index_14.PaymentModel.Subscription
                        }
                    ],
                    required: true
                },
                tokenToMint: {
                    type: 'string',
                    title: 'Currency',
                    tooltip: 'Token to pay for the subscription',
                },
                customMintToken: {
                    type: 'string',
                    title: 'Currency Address',
                    tooltip: 'Token address to pay for the subscription',
                    required: true
                },
                durationInDays: {
                    type: 'integer',
                    title: 'Minimum Subscription Period (in Days)',
                    required: true,
                    minimum: 1
                },
                perPeriodPrice: {
                    type: 'number',
                    title: 'Subscription Price per Period',
                    tooltip: 'Amount of token to pay for the subscription',
                    required: true
                },
                oneTimePrice: {
                    type: 'number',
                    title: 'Price',
                    tooltip: 'Amount of token to pay for one-time purchase',
                    required: true
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
                                        scope: '#/properties/paymentModel',
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/durationInDays',
                                        rule: {
                                            effect: 'SHOW',
                                            condition: {
                                                scope: '#/properties/paymentModel',
                                                schema: {
                                                    const: index_14.PaymentModel.Subscription
                                                }
                                            }
                                        }
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/perPeriodPrice',
                                        rule: {
                                            effect: 'SHOW',
                                            condition: {
                                                scope: '#/properties/paymentModel',
                                                schema: {
                                                    const: index_14.PaymentModel.Subscription
                                                }
                                            }
                                        }
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/oneTimePrice',
                                        rule: {
                                            effect: 'SHOW',
                                            condition: {
                                                scope: '#/properties/paymentModel',
                                                schema: {
                                                    const: index_14.PaymentModel.OneTimePurchase
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
            durationInDays: {
                type: 'integer',
                title: 'Minimum Subscription Period (in Days)',
                required: true,
                minimum: 1
            },
            perPeriodPrice: {
                type: 'number',
                title: 'Subscription Price per Period',
                tooltip: 'Amount of token to pay for the subscription',
                required: true
            },
            oneTimePrice: {
                type: 'number',
                title: 'Price',
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
                        const: index_14.PaymentModel.OneTimePurchase
                    },
                    {
                        title: 'Subscription',
                        const: index_14.PaymentModel.Subscription
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
                scope: '#/properties/durationInDays',
                rule: {
                    effect: 'SHOW',
                    condition: {
                        scope: '#/properties/paymentModel',
                        schema: {
                            const: index_14.PaymentModel.Subscription
                        }
                    }
                }
            },
            {
                type: 'Control',
                scope: '#/properties/perPeriodPrice',
                rule: {
                    effect: 'SHOW',
                    condition: {
                        scope: '#/properties/paymentModel',
                        schema: {
                            const: index_14.PaymentModel.Subscription
                        }
                    }
                }
            },
            {
                type: 'Control',
                scope: '#/properties/oneTimePrice',
                rule: {
                    effect: 'SHOW',
                    condition: {
                        scope: '#/properties/paymentModel',
                        schema: {
                            const: index_14.PaymentModel.OneTimePurchase
                        }
                    }
                }
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
                                networkPicker.classList.add(index_css_3.readOnlyStyle);
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
                            const pnlNftType = new components_6.Panel();
                            cbbNftType = new components_6.ComboBox(pnlNftType, {
                                height: '42px',
                                icon: {
                                    name: 'caret-down'
                                },
                                items: nftTypes,
                                readOnly: readonly
                            });
                            if (readonly) {
                                cbbNftType.classList.add(index_css_3.readOnlyStyle);
                            }
                            cbbNftType.classList.add(index_css_3.comboBoxStyle);
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
                            addressInput = new index_13.ScomNftMinterAddressInput(undefined, {
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
                            const pnlNftId = new components_6.Panel();
                            edtNftId = new components_6.Input(pnlNftId, {
                                inputType: 'number',
                                height: '42px',
                                width: '100%',
                                readOnly: readonly
                            });
                            if (readonly) {
                                edtNftId.classList.add(index_css_3.readOnlyStyle);
                            }
                            edtNftId.classList.add(index_css_3.formInputStyle);
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
                            const fieldUpdate = new index_13.ScomNftMinterFieldUpdate(undefined, {
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
                            const fieldUpdate = new index_13.ScomNftMinterFieldUpdate(undefined, {
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
        let durationInput;
        let perPeriodPriceInput;
        let oneTimePirceInput;
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
                                    customTokenInput.value = (address && address !== index_11.nullAddress) ? address : 'Native Token';
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
                            customTokenInput.value = (value && value !== index_11.nullAddress) ? value : 'Native Token';
                            if (customTokenInput.value)
                                customTokenInput.onChanged();
                        }
                    }
                }
            },
            '#/properties/paymentModel': {
                render: () => {
                    const pnl = new components_6.Panel();
                    cbbPaymentModel = new components_6.ComboBox(pnl, {
                        height: '42px',
                        icon: {
                            name: 'caret-down'
                        },
                        items: payment
                    });
                    cbbPaymentModel.classList.add(index_css_3.comboBoxStyle);
                    cbbPaymentModel.onChanged = () => {
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
                }
            },
            '#/properties/durationInDays': {
                render: () => {
                    durationInput = new components_6.Input(undefined, {
                        inputType: 'integer',
                        height: '42px',
                        width: '100%'
                    });
                    durationInput.classList.add(index_css_3.formInputStyle);
                    return durationInput;
                },
                getData: (control) => {
                    if (cbbPaymentModel?.selectedItem?.value === index_14.PaymentModel.OneTimePurchase) {
                        return 1;
                    }
                    return control.value;
                },
                setData: async (control, value) => {
                    control.value = value;
                }
            },
            '#/properties/perPeriodPrice': {
                render: () => {
                    perPeriodPriceInput = new components_6.Input(undefined, {
                        inputType: 'number',
                        height: '42px',
                        width: '100%'
                    });
                    perPeriodPriceInput.classList.add(index_css_3.formInputStyle);
                    return perPeriodPriceInput;
                },
                getData: (control) => {
                    let value = control.value;
                    if (cbbPaymentModel?.selectedItem?.value === index_14.PaymentModel.OneTimePurchase) {
                        value = oneTimePirceInput?.value || 0;
                    }
                    return Number(value);
                },
                setData: async (control, value) => {
                    control.value = value;
                }
            },
            '#/properties/oneTimePrice': {
                render: () => {
                    oneTimePirceInput = new components_6.Input(undefined, {
                        inputType: 'number',
                        height: '42px',
                        width: '100%'
                    });
                    oneTimePirceInput.classList.add(index_css_3.formInputStyle);
                    return oneTimePirceInput;
                },
                getData: (control) => {
                    let value = control.value;
                    if (cbbPaymentModel?.selectedItem?.value === index_14.PaymentModel.Subscription) {
                        value = perPeriodPriceInput?.value || 0;
                    }
                    return Number(value);
                },
                setData: async (control, value) => {
                    control.value = value;
                }
            }
        };
        if (isCustomToken) {
            controls['#/properties/customMintToken'] = {
                render: () => {
                    customTokenInput = new components_6.Input(undefined, {
                        inputType: 'text',
                        height: '42px',
                        width: '100%'
                    });
                    customTokenInput.classList.add(index_css_3.formInputStyle);
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
                            control.value = (address && address !== index_11.nullAddress) ? address : 'Native Token';
                        }
                    }
                }
            };
        }
        return controls;
    };
});
///<amd-module name='@scom/scom-nft-minter/model/configModel.ts'/> 
define("@scom/scom-nft-minter/model/configModel.ts", ["require", "exports", "@ijstech/components", "@scom/scom-nft-minter/store/index.ts", "@ijstech/eth-wallet", "@scom/scom-nft-minter/formSchema.json.ts", "@scom/scom-commission-fee-setup", "@scom/scom-nft-minter/data.json.ts", "@scom/scom-nft-minter/interface/index.tsx", "@scom/scom-nft-minter/utils/index.ts", "@scom/scom-nft-minter/API.ts", "@scom/scom-token-input", "@scom/scom-token-list"], function (require, exports, components_7, index_15, eth_wallet_6, formSchema_json_1, scom_commission_fee_setup_1, data_json_1, index_16, index_17, API_3, scom_token_input_2, scom_token_list_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfigModel = void 0;
    const Theme = components_7.Styles.Theme.ThemeVars;
    class ConfigModel {
        constructor(state, module, options) {
            this.options = {
                refreshWidget: async (isDataUpdated) => { },
                refreshDappContainer: () => { },
                setContaiterTag: (value) => { },
                updateTheme: () => { },
                onChainChanged: async () => { },
                onWalletConnected: async () => { },
                connectWallet: async () => { },
                showTxStatusModal: (status, content, exMessage) => { },
                updateUIBySetData: async () => { }
            };
            this._data = {
                wallets: [],
                networks: [],
                defaultChainId: 0
            };
            this.rpcWalletEvents = [];
            this.removeRpcWalletEvents = () => {
                const rpcWallet = this.rpcWallet;
                for (let event of this.rpcWalletEvents) {
                    rpcWallet.unregisterWalletEvent(event);
                }
                this.rpcWalletEvents = [];
            };
            this.resetRpcWallet = async () => {
                this.removeRpcWalletEvents();
                const rpcWalletId = await this.state.initRpcWallet(this._data.chainId || this.defaultChainId);
                this.updateFormConfig();
                const rpcWallet = this.rpcWallet;
                const chainChangedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_6.Constants.RpcWalletEvent.ChainChanged, async (chainId) => {
                    await this.options.onChainChanged();
                });
                const connectedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_6.Constants.RpcWalletEvent.Connected, async (connected) => {
                    await this.updateFormConfig(true);
                    this.options.onWalletConnected();
                });
                this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);
                this.options.refreshDappContainer();
            };
            this.initWallet = async () => {
                try {
                    await eth_wallet_6.Wallet.getClientInstance().init();
                    await this.rpcWallet.init();
                }
                catch (err) {
                    console.log(err);
                }
            };
            this.updateDataIndex = async () => {
                if (this.nftType === 'ERC721' && this._data.erc1155Index != null)
                    this._data.erc1155Index = undefined;
                if (!this.productId && this.nftAddress && (this.nftType === 'ERC721' || this._data.erc1155Index)) {
                    await this.initWallet();
                    let productId = await (0, API_3.getProductId)(this.state, this.nftAddress, this._data.erc1155Index);
                    if (productId)
                        this._data.productId = productId;
                }
            };
            this.getProductTypeByCode = (code) => {
                let productType;
                switch (code) {
                    case 0:
                        productType = index_16.ProductType.Buy;
                        break;
                    case 1:
                        productType = index_16.ProductType.Subscription;
                        break;
                    case 2:
                        productType = index_16.ProductType.DonateToOwner;
                        break;
                    case 3:
                        productType = index_16.ProductType.DonateToEveryone;
                        break;
                }
                return productType;
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
                                this.options.showTxStatusModal('error', err);
                            }
                        };
                        const confirmationCallback = async (receipt) => {
                            let productId = (0, API_3.getProductIdFromEvent)(contract, receipt);
                            this._data.productId = productId;
                            this._data.nftType = this._data.paymentModel === index_16.PaymentModel.Subscription ? 'ERC721' : 'ERC1155';
                            this.productInfo = await (0, API_3.getProductInfo)(this.state, this.productId);
                            if (this._data.nftType === 'ERC1155') {
                                this._data.erc1155Index = this.productInfo.nftId.toNumber();
                            }
                            this._data.nftAddress = this.productInfo.nft;
                            this._data.productType = this.getProductTypeByCode(this.productInfo.productType.toNumber());
                            const price = eth_wallet_6.Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals).toNumber();
                            if (this._data.productType === index_16.ProductType.Subscription) {
                                this._data.perPeriodPrice = price;
                            }
                            else {
                                this._data.oneTimePrice = price;
                            }
                            this._data.tokenToMint = this.productInfo.token.address;
                            this._data.durationInDays = Math.ceil((this.productInfo.priceDuration?.toNumber() || 0) / 86400);
                            return resolve(true);
                        };
                        if (!(0, index_15.isClientWalletConnected)()) {
                            this.options.connectWallet();
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
                            await (0, index_17.delay)(3000);
                            contract = this.state.getContractAddress('ProductMarketplace');
                        }
                        if (!contract) {
                            this.options.showTxStatusModal('error', this.module.i18n.get('$this_network_is_not_supported'));
                            return resolve(false);
                        }
                        try {
                            const { tokenToMint, customMintToken, uri, durationInDays } = this._data;
                            const isCustomToken = tokenToMint?.toLowerCase() === scom_token_input_2.CUSTOM_TOKEN.address.toLowerCase();
                            if (!tokenToMint || (isCustomToken && !customMintToken)) {
                                this.options.showTxStatusModal('error', this.module.i18n.get('$token_to_mint_is_missing'));
                                return resolve(false);
                            }
                            const tokenAddress = isCustomToken ? customMintToken : tokenToMint;
                            if (tokenAddress === index_17.nullAddress || !tokenAddress.startsWith('0x')) {
                                const address = tokenAddress.toLowerCase();
                                const nativeToken = scom_token_list_6.ChainNativeTokenByChainId[this.chainId];
                                if (!address.startsWith('0x') && address !== nativeToken?.symbol.toLowerCase() && address !== 'native token') {
                                    this.options.showTxStatusModal('error', this.module.i18n.get('$invalid_token'));
                                    return resolve(false);
                                }
                                //pay native token
                                await this._createProduct(contract, maxQty, price, uri, durationInDays, null, callback, confirmationCallback);
                            }
                            else { //pay erc20
                                let token;
                                if (isCustomToken) {
                                    token = await (0, index_17.getTokenInfo)(tokenAddress, this.chainId);
                                }
                                else {
                                    token = scom_token_list_6.tokenStore.getTokenList(this.chainId).find(v => v.address?.toLowerCase() === tokenAddress.toLowerCase());
                                }
                                if (!token) {
                                    this.options.showTxStatusModal('error', this.module.i18n.get('$invalid_token'));
                                    return resolve(false);
                                }
                                await this._createProduct(contract, maxQty, price, uri, durationInDays, token, callback, confirmationCallback);
                            }
                        }
                        catch (error) {
                            this.options.showTxStatusModal('error', this.module.i18n.get('$something_went_wrong_creating_new_product'));
                            console.log('newProduct', error);
                            resolve(false);
                        }
                    }
                });
            };
            this.state = state;
            this.module = module;
            this.options = options;
            this._createProduct = this._createProduct.bind(this);
        }
        get chainId() {
            return this.state.getChainId();
        }
        get defaultChainId() {
            return this._data.defaultChainId;
        }
        set defaultChainId(value) {
            this._data.defaultChainId = value;
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
        get commissions() {
            return this._data.commissions ?? [];
        }
        set commissions(value) {
            this._data.commissions = value;
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
            return this._data.paymentModel === index_16.PaymentModel.Subscription ? this._data.perPeriodPrice : this._data.oneTimePrice;
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
        get recipients() {
            return this._data.recipients || [];
        }
        get referrer() {
            return this._data.referrer;
        }
        get productId() {
            return this._data.productId ?? this._data.chainSpecificProperties?.[this.chainId]?.productId ?? 0;
        }
        get productType() {
            return this._data.productType ?? index_16.ProductType.Buy;
        }
        set productType(value) {
            this._data.productType = value;
        }
        get discountRuleId() {
            return this._data.discountRuleId;
        }
        set discountRuleId(value) {
            this._data.discountRuleId = value;
        }
        get chainSpecificProperties() {
            return this._data.chainSpecificProperties ?? {};
        }
        set chainSpecificProperties(value) {
            this._data.chainSpecificProperties = value;
        }
        get link() {
            return this._data.link ?? '';
        }
        set link(value) {
            this._data.link = value;
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
                            const vstack = new components_7.VStack();
                            const config = new scom_commission_fee_setup_1.default(null, {
                                commissions: self._data.commissions,
                                fee: this.state.embedderCommissionFee,
                                networks: self._data.networks
                            });
                            const hstack = new components_7.HStack(null, {
                                verticalAlignment: 'center',
                            });
                            const button = new components_7.Button(hstack, {
                                caption: '$confirm',
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
                                const { name, title, productType, logoUrl, description, link, erc1155Index, nftType, chainId, nftAddress, chainSpecificProperties, defaultChainId, tokenToMint, customMintToken, duration, perPeriodPirce, oneTimePirce, maxQty, txnMaxQty, uri, ...themeSettings } = userInputData;
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
                                    duration,
                                    perPeriodPirce,
                                    oneTimePirce,
                                    maxQty,
                                    txnMaxQty,
                                    uri
                                };
                                Object.assign(this._data, generalSettings);
                                await this.resetRpcWallet();
                                if (builder?.setData)
                                    builder.setData(this._data);
                                await this.options.refreshWidget(true);
                                oldTag = JSON.parse(JSON.stringify(this.module.tag));
                                if (builder?.setTag)
                                    builder.setTag(themeSettings);
                                else
                                    this.setTag(themeSettings);
                                this.options.setContaiterTag(themeSettings);
                            },
                            undo: async () => {
                                this._data = JSON.parse(JSON.stringify(oldData));
                                await this.options.refreshWidget(true);
                                if (builder?.setData)
                                    builder.setData(this._data);
                                const tag = JSON.parse(JSON.stringify(oldTag));
                                this.module.tag = tag;
                                if (builder?.setTag)
                                    builder.setTag(tag);
                                else
                                    this.setTag(tag);
                                this.options.setContaiterTag(tag);
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
                refreshUI: this.options.refreshWidget,
                connectWallet: this.options.connectWallet,
                showTxStatusModal: this.options.showTxStatusModal
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
                        const selectors = await (0, index_17.getProxySelectors)(this.state, chainId);
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
                                this.options.connectWallet();
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
                                this._data.tokenToMint = this.productInfo.token.address;
                                const price = eth_wallet_6.Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals).toNumber();
                                if (this._data.productType === index_16.ProductType.Subscription) {
                                    this._data.durationInDays = Math.ceil((this.productInfo.priceDuration?.toNumber() || 0) / 86400);
                                    this._data.perPeriodPrice = price;
                                }
                                else {
                                    this._data.oneTimePrice = price;
                                }
                            }
                        }
                        return true;
                    },
                    updateDiscountRules: async (productId, rules, ruleIdsToDelete = []) => {
                        return new Promise(async (resolve, reject) => {
                            const callback = (err, receipt) => {
                                if (err) {
                                    this.options.showTxStatusModal('error', err);
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
                                this.options.showTxStatusModal('error', this.module.i18n.get('$something_went_wrong_updating_discount_rule'));
                                console.log('updateDiscountRules', error);
                                reject(error);
                            }
                        });
                    },
                    updateCommissionCampaign: async (productId, commissionRate, affiliates) => {
                        return new Promise(async (resolve, reject) => {
                            const callback = (err, receipt) => {
                                if (err) {
                                    this.options.showTxStatusModal('error', err);
                                }
                            };
                            const confirmationCallback = async (receipt) => {
                                resolve(true);
                            };
                            try {
                                await (0, API_3.updateCommissionCampaign)(this.state, productId, commissionRate, affiliates, callback, confirmationCallback);
                            }
                            catch (error) {
                                this.options.showTxStatusModal('error', this.module.i18n.get('$something_went_wrong_updating_commission_campaign'));
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
        async setData(data) {
            this._data = data;
            await this.options.updateUIBySetData();
        }
        getTag() {
            return this.module.tag;
        }
        setTag(value) {
            const newValue = value || {};
            for (let prop in newValue) {
                if (newValue.hasOwnProperty(prop)) {
                    if (prop === 'light' || prop === 'dark')
                        this.updateTag(prop, newValue[prop]);
                    else
                        this.module.tag[prop] = newValue[prop];
                }
            }
            this.options.setContaiterTag(this.module.tag);
            this.options.updateTheme();
        }
        updateTag(type, value) {
            this.module.tag[type] = this.module.tag[type] ?? {};
            for (let prop in value) {
                if (value.hasOwnProperty(prop))
                    this.module.tag[type][prop] = value[prop];
            }
        }
        async updateFormConfig(isEvent) {
            if (this.isConfigNewIndex) {
                try {
                    const wrapper = this.module.parentElement?.parentElement;
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
                            btnConfirm.caption = !(0, index_15.isClientWalletConnected)() && validation.valid ? '$connect_wallet' : '$confirm';
                        };
                        if (isEvent) {
                            await updateButton();
                        }
                        else if (!this.isOnChangeUpdated) {
                            this.isOnChangeUpdated = true;
                            const onFormChange = form.formOptions.onChange;
                            form.formOptions.onChange = async () => {
                                if (onFormChange)
                                    onFormChange();
                                await updateButton();
                            };
                            await updateButton();
                        }
                    }
                }
                catch { }
            }
        }
        async _createProduct(productMarketplaceAddress, quantity, price, uri, durationInDays, token, callback, confirmationCallback) {
            if (this._data.paymentModel === index_16.PaymentModel.Subscription) {
                await (0, API_3.createSubscriptionNFT)(productMarketplaceAddress, quantity, price, token?.address || index_17.nullAddress, token?.decimals || 18, uri, (durationInDays || 1) * 86400, // per day
                callback, confirmationCallback);
            }
            else {
                await (0, API_3.newDefaultBuyProduct)(productMarketplaceAddress, quantity, price, token?.address || index_17.nullAddress, token?.decimals || 18, uri, callback, confirmationCallback);
            }
        }
    }
    exports.ConfigModel = ConfigModel;
});
define("@scom/scom-nft-minter/model/nftMinterModel.ts", ["require", "exports", "@scom/scom-token-list", "@ijstech/eth-contract", "@scom/scom-nft-minter/store/index.ts", "@scom/scom-nft-minter/interface/index.tsx", "@scom/scom-nft-minter/utils/index.ts", "@scom/scom-nft-minter/API.ts", "@ijstech/eth-wallet"], function (require, exports, scom_token_list_7, eth_contract_1, index_18, index_19, index_20, API_4, eth_wallet_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NFTMinterModel = void 0;
    class NFTMinterModel {
        constructor(module, state, options) {
            this.options = {
                updateSubmitButton: async (submitting) => { },
                showTxStatusModal: (status, content, exMessage) => { },
                closeTxStatusModal: () => { },
                onMintedNft: (oswapTroll) => { },
                onDonated: async () => { },
                onSubscribed: () => { },
                onBoughtProduct: async () => { }
            };
            this.updateTokenAmountIn = (qty, commissions, value) => {
                if (value) {
                    this._tokenAmountIn = value;
                    return;
                }
                if (!qty) {
                    this._tokenAmountIn = '0';
                    return;
                }
                const { token, price } = this.productInfo;
                const productPrice = eth_wallet_7.Utils.fromDecimals(price, token.decimals);
                this._tokenAmountIn = (0, API_4.getProxyTokenAmountIn)(productPrice.toFixed(), qty, commissions);
            };
            this.updateDiscount = (duration, startDate, days) => {
                this.discountApplied = undefined;
                if (!this.discountRules?.length || !duration || !startDate)
                    return;
                const price = eth_wallet_7.Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals);
                const startTime = startDate.unix();
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
            };
            this.getTokenBalance = async (_token) => {
                const token = _token || this.productInfo?.token || this.oswapTrollInfo?.token;
                if (!token)
                    return;
                let balance = new eth_contract_1.BigNumber(0);
                try {
                    balance = await (0, index_20.getTokenBalance)(this.rpcWallet, token);
                }
                catch { }
                return balance;
            };
            this.fetchOswapTrollNftInfo = async (nftAddress) => {
                const oswapTroll = await (0, API_4.fetchOswapTrollNftInfo)(this.state, nftAddress);
                if (!oswapTroll) {
                    this._oswapTrollInfo = null;
                    return null;
                }
                const nftBalance = (0, index_18.isClientWalletConnected)() ? await (0, API_4.fetchUserNftBalance)(this.state, nftAddress) : 0;
                const { price, cap, tokenAddress } = oswapTroll;
                let token = scom_token_list_7.tokenStore.getTokenList(this.chainId).find(v => v.address === tokenAddress);
                if (!token) {
                    token = await (0, index_20.getTokenInfo)(tokenAddress, this.chainId);
                }
                const info = {
                    price,
                    cap,
                    tokenAddress,
                    token,
                    nftBalance
                };
                this._oswapTrollInfo = info;
                this._cap = cap.toNumber();
                return info;
            };
            this.fetchProductInfo = async (productId, type, isDataUpdated) => {
                const info = await (0, API_4.getProductInfo)(this.state, productId);
                this._productInfo = info;
                if (isDataUpdated && type === index_19.ProductType.Subscription) {
                    await this.fetchDiscountRules(productId);
                }
            };
            this.fetchDiscountRules = async (productId) => {
                this._discountRules = await (0, API_4.getDiscountRules)(this.state, productId);
            };
            this.fetchNftBalance = async (productId) => {
                const nftBalance = (0, index_18.isClientWalletConnected)() ? await (0, API_4.getNFTBalance)(this.state, productId) : 0;
                return nftBalance;
            };
            this.getProductInfo = async (productId) => {
                if (!productId || !this.productInfo)
                    return null;
                if (this.productInfo.productId.isEqualTo(productId))
                    return this.productInfo;
                try {
                    const productInfo = await (0, API_4.getProductInfo)(this.state, productId);
                    return productInfo;
                }
                catch {
                    return null;
                }
            };
            this.doSubmitAction = async (configModel, token, tokenValue, qty, startDate, duration, days, recipient) => {
                const { productId, nftType, productType, nftAddress } = configModel;
                if (!configModel.getData() || (!productId && nftType !== 'ERC721'))
                    return;
                this.options.updateSubmitButton(true);
                if ((productType === index_19.ProductType.DonateToOwner || productType === index_19.ProductType.DonateToEveryone) && !token) {
                    this.options.showTxStatusModal('error', this.module.i18n.get('$token_required'));
                    this.options.updateSubmitButton(false);
                    return;
                }
                if (nftType === 'ERC721' && !productId) {
                    const oswapTroll = await this.fetchOswapTrollNftInfo(nftAddress);
                    if (!oswapTroll || oswapTroll.cap.lte(0)) {
                        this.options.showTxStatusModal('error', this.module.i18n.get('$out_of_stock'));
                        this.options.updateSubmitButton(false);
                        return;
                    }
                    const token = this.oswapTrollInfo.token;
                    const balance = await this.getTokenBalance(token);
                    if (oswapTroll.price.gt(balance)) {
                        this.options.showTxStatusModal('error', this.module.i18n.get('$insufficient_balance', { symbol: token.symbol }));
                        this.options.updateSubmitButton(false);
                        return;
                    }
                    await this.mintNft(nftAddress);
                    return;
                }
                const balance = await (0, index_20.getTokenBalance)(this.rpcWallet, this.productInfo.token);
                try {
                    const { maxQuantity, price } = this.productInfo;
                    if (productType === index_19.ProductType.Buy) {
                        if (qty && new eth_contract_1.BigNumber(qty).gt(maxQuantity)) {
                            this.options.showTxStatusModal('error', this.module.i18n.get('$quantity_greater_than_max_quantity'));
                            this.options.updateSubmitButton(false);
                            return;
                        }
                        if (maxQuantity.gt(1) && (!qty || !Number.isInteger(Number(qty)))) {
                            this.options.showTxStatusModal('error', this.module.i18n.get('$invalid_quantity'));
                            this.options.updateSubmitButton(false);
                            return;
                        }
                        const requireQty = maxQuantity.gt(1) && qty ? Number(qty) : 1;
                        if (productId >= 0) {
                            const product = await (0, API_4.getProductInfo)(this.state, productId);
                            if (product.quantity.lt(requireQty)) {
                                this.options.showTxStatusModal('error', this.module.i18n.get('$out_of_stock'));
                                this.options.updateSubmitButton(false);
                                return;
                            }
                        }
                        const maxOrderQty = new eth_contract_1.BigNumber(maxQuantity ?? 0);
                        if (maxOrderQty.minus(requireQty).lt(0)) {
                            this.options.showTxStatusModal('error', this.module.i18n.get('$over_maximum_order_quantity'));
                            this.options.updateSubmitButton(false);
                            return;
                        }
                        const amount = price.times(requireQty).shiftedBy(-token.decimals);
                        if (balance.lt(amount)) {
                            this.options.showTxStatusModal('error', this.module.i18n.get('$insufficient_balance', { symbol: token.symbol }));
                            this.options.updateSubmitButton(false);
                            return;
                        }
                        await this.buyToken(configModel, tokenValue, startDate, days, configModel.recipient, requireQty);
                    }
                    else if (productType === index_19.ProductType.Subscription) {
                        if (!startDate) {
                            this.options.showTxStatusModal('error', this.module.i18n.get('$start_date_required'));
                            this.options.updateSubmitButton(false);
                            return;
                        }
                        const _duration = Number(duration) || 0;
                        if (!_duration || _duration <= 0 || !Number.isInteger(_duration)) {
                            this.options.showTxStatusModal('error', !duration ? this.module.i18n.get('$duration_required') : this.module.i18n.get('$invalid_duration'));
                            this.options.updateSubmitButton(false);
                            return;
                        }
                        await this.buyToken(configModel, tokenValue, startDate, days, recipient);
                    }
                    else {
                        if (!tokenValue) {
                            this.options.showTxStatusModal('error', this.module.i18n.get('$amount_required'));
                            this.options.updateSubmitButton(false);
                            return;
                        }
                        if (balance.lt(tokenValue)) {
                            this.options.showTxStatusModal('error', this.module.i18n.get('$insufficient_balance', { symbol: token.symbol }));
                            this.options.updateSubmitButton(false);
                            return;
                        }
                        await this.buyToken(configModel, tokenValue, startDate, days, configModel.recipient);
                    }
                    this.options.updateSubmitButton(false);
                    this.options.closeTxStatusModal();
                }
                catch (error) {
                    this.options.showTxStatusModal('error', error);
                    this.options.updateSubmitButton(false);
                }
            };
            this.module = module;
            this.state = state;
            this.options = options;
        }
        get rpcWallet() {
            return this.state.getRpcWallet();
        }
        get chainId() {
            return this.state.getChainId();
        }
        set productInfo(value) {
            this._productInfo = value;
        }
        get productInfo() {
            return this._productInfo;
        }
        get discountRules() {
            return this._discountRules || [];
        }
        set discountRules(value) {
            this._discountRules = value;
        }
        get oswapTrollInfo() {
            return this._oswapTrollInfo;
        }
        get tokenSymbol() {
            return this._productInfo?.token?.symbol || '';
        }
        get cap() {
            return this._cap;
        }
        get isRenewal() {
            return this._isRenewal;
        }
        set isRenewal(value) {
            this._isRenewal = value;
        }
        get discountApplied() {
            return this._discountApplied;
        }
        set discountApplied(value) {
            this._discountApplied = value;
        }
        get tokenAmountIn() {
            return this._tokenAmountIn;
        }
        async mintNft(nftAddress) {
            const txHashCallback = (err, receipt) => {
                if (err) {
                    this.options.showTxStatusModal('error', err);
                    this.options.updateSubmitButton(false);
                }
            };
            const confirmationCallback = async (receipt) => {
                const oswapTroll = await (0, API_4.fetchOswapTrollNftInfo)(this.state, nftAddress);
                if (oswapTroll) {
                    this._cap = oswapTroll.cap.toNumber();
                }
                this.options.onMintedNft(oswapTroll);
            };
            (0, index_20.registerSendTxEvents)({
                transactionHash: txHashCallback,
                confirmation: confirmationCallback
            });
            await (0, API_4.mintOswapTrollNft)(nftAddress, txHashCallback);
        }
        async buyToken(configModel, tokenValue, startDate, days, recipient, quantity) {
            const { productId, productType, referrer, commissions } = configModel;
            if (!productId)
                return;
            const callback = (error, receipt) => {
                if (error) {
                    this.options.showTxStatusModal('error', error);
                }
            };
            const token = this.productInfo.token;
            if (productType == index_19.ProductType.DonateToOwner || productType == index_19.ProductType.DonateToEveryone) {
                await (0, API_4.donate)(this.state, productId, recipient, tokenValue, commissions, token, callback, async () => {
                    await this.options.onDonated();
                });
            }
            else if (productType === index_19.ProductType.Subscription) {
                const startTime = startDate.unix();
                const duration = days * 86400;
                const confirmationCallback = async () => {
                    this.productInfo = await (0, API_4.getProductInfo)(this.state, productId);
                    this.options.onSubscribed();
                };
                if (this.isRenewal) {
                    await (0, API_4.renewSubscription)(this.state, productId, duration, recipient, this.discountApplied?.id ?? 0, callback, confirmationCallback);
                }
                else {
                    await (0, API_4.subscribe)(this.state, productId, startTime, duration, recipient, referrer, this.discountApplied?.id ?? 0, callback, confirmationCallback);
                }
            }
            else if (productType == index_19.ProductType.Buy) {
                await (0, API_4.buyProduct)(this.state, productId, quantity, commissions, token, callback, async () => {
                    this.productInfo = await (0, API_4.getProductInfo)(this.state, productId);
                    this.options.onBoughtProduct();
                });
            }
        }
    }
    exports.NFTMinterModel = NFTMinterModel;
});
define("@scom/scom-nft-minter/model/index.ts", ["require", "exports", "@scom/scom-nft-minter/model/configModel.ts", "@scom/scom-nft-minter/model/nftMinterModel.ts"], function (require, exports, configModel_1, nftMinterModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NFTMinterModel = exports.ConfigModel = void 0;
    Object.defineProperty(exports, "ConfigModel", { enumerable: true, get: function () { return configModel_1.ConfigModel; } });
    Object.defineProperty(exports, "NFTMinterModel", { enumerable: true, get: function () { return nftMinterModel_1.NFTMinterModel; } });
});
define("@scom/scom-nft-minter", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-nft-minter/interface/index.tsx", "@scom/scom-nft-minter/utils/index.ts", "@scom/scom-nft-minter/store/index.ts", "@scom/scom-nft-minter/index.css.ts", "@scom/scom-nft-minter/data.json.ts", "@scom/scom-nft-minter/model/index.ts", "@scom/scom-blocknote-sdk", "@scom/scom-nft-minter/languages/index.ts"], function (require, exports, components_8, eth_wallet_8, index_21, index_22, index_23, index_css_4, data_json_2, model_1, scom_blocknote_sdk_1, index_24) {
    "use strict";
    var ScomNftMinter_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_8.Styles.Theme.ThemeVars;
    const DurationUnits = [
        {
            label: '$day_s',
            value: 'days'
        },
        {
            label: '$month_s',
            value: 'months'
        },
        {
            label: '$year_s',
            value: 'years'
        }
    ];
    let ScomNftMinter = ScomNftMinter_1 = class ScomNftMinter extends components_8.Module {
        constructor(parent, options) {
            super(parent, options);
            this.isApproving = false;
            this.tag = {};
            this.defaultEdit = true;
            this.onChainChanged = async () => {
                this.tokenInput.chainId = this.state.getChainId();
                await this.onSetupPage();
                this.updateContractAddress();
                await this.refreshWidget();
            };
            this.onWalletConnected = async () => {
                await this.onSetupPage();
                this.updateContractAddress();
                await this.refreshWidget();
            };
            this.updateTokenBalance = async () => {
                this.lblBalance.caption = `${(0, index_22.formatNumber)(await this.nftMinterModel.getTokenBalance())} ${this.nftMinterModel.tokenSymbol}`;
            };
            this.refreshDappContainer = () => {
                const rpcWallet = this.rpcWallet;
                const chainId = this.configModel.getData().chainId || this.configModel.chainId;
                const containerData = {
                    defaultChainId: chainId || this.defaultChainId,
                    wallets: this.wallets,
                    networks: chainId ? [{ chainId: chainId }] : this.networks,
                    showHeader: this.showHeader,
                    rpcWalletId: rpcWallet.instanceId
                };
                if (this.containerDapp?.setData)
                    this.containerDapp.setData(containerData);
            };
            this.connectWallet = async () => {
                if (this.mdWallet) {
                    await components_8.application.loadPackage('@scom/scom-wallet-modal', '*');
                    this.mdWallet.networks = this.networks;
                    this.mdWallet.wallets = this.wallets;
                    this.mdWallet.showModal();
                }
            };
            this.updateUIBySetData = async () => {
                this.showLoading();
                this.nftMinterModel.discountRules = [];
                await this.configModel.resetRpcWallet();
                if (!this.tokenInput.isConnected)
                    await this.tokenInput.ready();
                this.tokenInput.chainId = this.state.getChainId() ?? this.defaultChainId;
                await this.onSetupPage();
                const commissionFee = this.state.embedderCommissionFee;
                if (!this.lbOrderTotalTitle.isConnected)
                    await this.lbOrderTotalTitle.ready();
                this.lbOrderTotalTitle.caption = "$you_will_pay";
                this.iconOrderTotal.tooltip.content = this.i18n.get('$a_commission_fee_of_percent_will_be_applied_to_the_amount_you_input', { rate: `${new eth_wallet_8.BigNumber(commissionFee).times(100)}` });
                this.updateContractAddress();
                await this.configModel.updateDataIndex();
                this.comboRecipient.items = this.configModel.recipients.map(address => ({
                    label: address,
                    value: address
                }));
                if (this.comboRecipient.items.length)
                    this.comboRecipient.selectedItem = this.comboRecipient.items[0];
                this.edtStartDate.value = undefined;
                this.edtDuration.value = '';
                this.comboDurationUnit.selectedItem = DurationUnits[0];
                await this.refreshWidget(true);
            };
            this.refreshWidget = async (isDataUpdated = false) => {
                setTimeout(async () => {
                    try {
                        const type = this.productType;
                        const data = this.configModel.getData();
                        const { title, discountRuleId } = data;
                        await this.updateDAppUI(data);
                        this.determineBtnSubmitCaption();
                        if (!this.nftType)
                            return;
                        await this.configModel.initWallet();
                        this.btnSubmit.enabled = (0, index_23.isClientWalletConnected)() && this.state.isRpcWalletConnected();
                        // OswapTroll
                        if (this.nftType === 'ERC721' && !this.productId) {
                            this.lblTitle.caption = title;
                            if (!this.nftAddress)
                                return;
                            const oswapTroll = await this.nftMinterModel.fetchOswapTrollNftInfo(this.nftAddress);
                            if (!oswapTroll) {
                                this.pnlUnsupportedNetwork.visible = true;
                                this.pnlInputFields.visible = false;
                                return;
                            }
                            ;
                            const { price, cap, tokenAddress, nftBalance, token } = oswapTroll;
                            this.pnlInputFields.visible = true;
                            this.pnlUnsupportedNetwork.visible = false;
                            this.detailWrapper.visible = true;
                            this.onToggleDetail();
                            this.btnDetail.visible = true;
                            this.lbMarketplaceContract.caption = components_8.FormatUtils.truncateWalletAddress(this.state.getContractAddress('ProductMarketplace'));
                            this.lbNFTContract.caption = components_8.FormatUtils.truncateWalletAddress(this.nftAddress);
                            this.updateTokenAddress(tokenAddress);
                            this.pnlMintFee.visible = true;
                            this.lblMintFee.caption = `${(0, index_22.formatNumber)(price)} ${token?.symbol || ''}`;
                            this.lblSpotsRemaining.caption = this.i18n.get('$hurry_only_nfts_left', { cap: `${cap}` });
                            //this.pnlQty.visible = true;
                            this.pnlSubscriptionPeriod.visible = false;
                            this.edtQty.readOnly = true;
                            this.edtQty.value = '1';
                            this.lbOrderTotal.caption = `${(0, index_22.formatNumber)(price, 6)} ${token?.symbol || ''}`;
                            this.pnlTokenInput.visible = false;
                            this.imgUri.visible = false;
                            this.determineBtnSubmitCaption();
                            return;
                        }
                        //this.edtQty.readOnly = false;
                        this.edtQty.readOnly = true;
                        await this.nftMinterModel.fetchProductInfo(this.productId, type, isDataUpdated);
                        const { productInfo, tokenAmountIn } = this.nftMinterModel;
                        if (productInfo) {
                            const { token, price, nftId, priceDuration, uri } = productInfo;
                            this.pnlInputFields.visible = true;
                            this.pnlUnsupportedNetwork.visible = false;
                            const productPrice = eth_wallet_8.Utils.fromDecimals(price, token.decimals).toFixed();
                            (!this.lblRef.isConnected) && await this.lblRef.ready();
                            if (type === index_21.ProductType.Buy || type === index_21.ProductType.Subscription) {
                                this.detailWrapper.visible = true;
                                this.onToggleDetail();
                                this.btnDetail.visible = true;
                                this.lbMarketplaceContract.caption = components_8.FormatUtils.truncateWalletAddress(this.state.getContractAddress('ProductMarketplace'));
                                this.lbNFTContract.caption = components_8.FormatUtils.truncateWalletAddress(this.nftAddress);
                                this.updateTokenAddress(token.address);
                                this.pnlMintFee.visible = true;
                                const days = Math.ceil((priceDuration?.toNumber() || 0) / 86400);
                                const duration = type === index_21.ProductType.Subscription ? days > 1 ? this.i18n.get('$for_days', { days: `${days}` }) : this.i18n.get('$per_day') : '';
                                this.lblMintFee.caption = `${productPrice ? (0, index_22.formatNumber)(productPrice) : ""} ${token?.symbol || ""}${duration}`;
                                this.lblTitle.caption = title;
                                this.lblRef.caption = '$smart_contract';
                                this.updateSpotsRemaining();
                                this.tokenInput.inputReadOnly = true;
                                this.pnlQty.visible = false;
                                this.pnlSubscriptionPeriod.visible = type === index_21.ProductType.Subscription;
                                if (isDataUpdated && type === index_21.ProductType.Subscription) {
                                    this.chkCustomStartDate.checked = false;
                                    this.edtStartDate.value = this.isRenewal && this.renewalDate ? (0, components_8.moment)(this.renewalDate * 1000) : (0, components_8.moment)();
                                    this.edtStartDate.enabled = false;
                                    this.pnlCustomStartDate.visible = !this.isRenewal;
                                    this.lblStartDate.caption = this.isRenewal ? this.edtStartDate.value.format('DD/MM/YYYY hh:mm A') : "Now";
                                    this.lblStartDate.visible = true;
                                    const rule = discountRuleId ? this.nftMinterModel.discountRules.find(rule => rule.id === discountRuleId) : null;
                                    const isExpired = rule && rule.endTime && rule.endTime < (0, components_8.moment)().unix();
                                    if (isExpired)
                                        this.configModel.discountRuleId = undefined;
                                    if (rule && !isExpired) {
                                        if (!this.isRenewal && rule.startTime && rule.startTime > this.edtStartDate.value.unix()) {
                                            this.edtStartDate.value = (0, components_8.moment)(rule.startTime * 1000);
                                        }
                                        this.edtDuration.value = rule.minDuration.gt(0) ? rule.minDuration.div(86400).toNumber() : 1;
                                        this.comboDurationUnit.selectedItem = DurationUnits[0];
                                        this.nftMinterModel.discountApplied = rule;
                                        this._updateEndDate();
                                        this._updateTotalAmount();
                                        if (this.approvalModelAction) {
                                            this.approvalModelAction.checkAllowance(token, tokenAmountIn);
                                        }
                                    }
                                    else {
                                        this.edtDuration.value = Math.ceil((priceDuration?.toNumber() || 0) / 86400);
                                        this.onDurationChanged();
                                    }
                                }
                                //this.pnlQty.visible = true;
                                this.pnlTokenInput.visible = false;
                                if (uri) {
                                    this.imgUri.visible = true;
                                    this.imgUri.url = uri;
                                }
                                else {
                                    this.imgUri.visible = false;
                                }
                                this.edtQty.value = '1';
                                if (type !== index_21.ProductType.Subscription)
                                    await this.onQtyChanged();
                            }
                            else {
                                this.detailWrapper.visible = false;
                                this.btnDetail.visible = false;
                                this.pnlMintFee.visible = false;
                                this.lblTitle.caption = title || '$make_a_contribution';
                                this.lblTitle.visible = true;
                                this.lblRef.caption = '$all_proceeds_will_go_to_following_vetted_wallet_address';
                                this.tokenInput.inputReadOnly = false;
                                this.pnlQty.visible = false;
                                this.pnlTokenInput.visible = true;
                                this.imgUri.visible = false;
                                this.edtQty.value = "";
                                this.lbOrderTotal.caption = "0";
                            }
                            this.tokenInput.value = "";
                            this.pnlAddress.visible = type === index_21.ProductType.DonateToOwner || type === index_21.ProductType.DonateToEveryone;
                            (!this.lblAddress.isConnected) && await this.lblAddress.ready();
                            this.lblAddress.caption = this.contractAddress || "";
                            this.tokenInput.token = token?.address === index_22.nullAddress ? {
                                ...token,
                                isNative: true,
                                address: undefined
                            } : token;
                            await this.updateTokenBalance();
                        }
                        else {
                            this.pnlInputFields.visible = false;
                            this.pnlUnsupportedNetwork.visible = true;
                        }
                        this.determineBtnSubmitCaption();
                    }
                    finally {
                        this.hideLoading();
                    }
                });
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
            this.initModels();
        }
        addBlock(blocknote, executeFn, callbackFn) {
            const blockType = 'nftMinter';
            const moduleData = {
                name: '@scom/scom-nft-minter',
                localPath: 'scom-nft-minter'
            };
            const nftMinterRegex = /https:\/\/widget.noto.fan\/(#!\/)?scom\/scom-nft-minter\/\S+/g;
            function getData(href) {
                const widgetData = (0, scom_blocknote_sdk_1.parseUrl)(href);
                if (widgetData) {
                    const { module, properties } = widgetData;
                    if (module.localPath === moduleData.localPath)
                        return { ...properties };
                }
                return false;
            }
            const NftMinterBlock = blocknote.createBlockSpec({
                type: blockType,
                propSchema: {
                    ...blocknote.defaultProps,
                    productId: { default: 0 },
                    name: { default: '' },
                    title: { default: '' },
                    nftType: { default: '', values: ['ERC721', 'ERC1155'] },
                    chainId: { default: undefined },
                    nftAddress: { default: '' },
                    productType: { default: 'Buy' },
                    erc1155Index: { default: undefined },
                    tokenToMint: { default: '' },
                    isCustomMintToken: { default: false },
                    customMintToken: { default: '' },
                    duration: { default: 0 },
                    perPeriodPrice: { default: 0 },
                    oneTimePrice: { default: 0 },
                    maxQty: { default: 0 },
                    paymentModel: { default: 'OneTimePurchase' },
                    durationInDays: { default: 0 },
                    priceDuration: { default: 0 },
                    txnMaxQty: { default: 0 },
                    uri: { default: '' },
                    recipient: { default: '' },
                    recipients: { default: [] },
                    logoUrl: { default: '' },
                    description: { default: '' },
                    link: { default: '' },
                    discountRuleId: { default: 0 },
                    commissions: { default: [] },
                    referrer: { default: '' },
                    chainSpecificProperties: { default: {} },
                    defaultChainId: { default: 0 },
                    wallets: { default: [] },
                    networks: { default: [] }
                },
                content: "none"
            }, {
                render: (block) => {
                    const wrapper = new components_8.Panel();
                    const props = JSON.parse(JSON.stringify(block.props));
                    const customElm = new ScomNftMinter_1(wrapper, { ...props });
                    if (typeof callbackFn === "function") {
                        callbackFn(customElm, block);
                    }
                    wrapper.appendChild(customElm);
                    return {
                        dom: wrapper
                    };
                },
                parseFn: () => {
                    return [
                        {
                            tag: `div[data-content-type="${blockType}"]`,
                            node: blockType
                        },
                        {
                            tag: "a",
                            getAttrs: (element) => {
                                if (typeof element === "string") {
                                    return false;
                                }
                                const href = element.getAttribute('href');
                                if (href)
                                    return getData(href);
                                return false;
                            },
                            priority: 408,
                            node: blockType
                        },
                        {
                            tag: "p",
                            getAttrs: (element) => {
                                if (typeof element === "string") {
                                    return false;
                                }
                                const child = element.firstChild;
                                if (child?.nodeName === 'A' && child.getAttribute('href')) {
                                    const href = child.getAttribute('href');
                                    return getData(href);
                                }
                                return false;
                            },
                            priority: 409,
                            node: blockType
                        }
                    ];
                },
                toExternalHTML: (block, editor) => {
                    const link = document.createElement("a");
                    const url = (0, scom_blocknote_sdk_1.getWidgetEmbedUrl)({
                        type: blockType,
                        props: { ...(block.props || {}) }
                    }, moduleData);
                    link.setAttribute("href", url);
                    link.textContent = blockType;
                    const wrapper = document.createElement("p");
                    wrapper.appendChild(link);
                    return { dom: wrapper };
                },
                pasteRules: [
                    {
                        find: nftMinterRegex,
                        handler(props) {
                            const { state, chain, range } = props;
                            const textContent = state.doc.resolve(range.from).nodeAfter?.textContent;
                            const widgetData = (0, scom_blocknote_sdk_1.parseUrl)(textContent);
                            if (!widgetData)
                                return null;
                            const { properties } = widgetData;
                            chain().BNUpdateBlock(state.selection.from, {
                                type: blockType,
                                props: {
                                    ...properties
                                },
                            }).setTextSelection(range.from + 1);
                        }
                    }
                ]
            });
            const NftMinterSlashItem = {
                name: "NFT Minter",
                execute: (editor) => {
                    const block = {
                        type: blockType,
                        props: data_json_2.default.defaultBuilderData
                    };
                    if (typeof executeFn === 'function') {
                        executeFn(editor, block);
                    }
                },
                aliases: [blockType, "widget"],
                group: "Widget",
                icon: { name: 'gavel' },
                hint: "Insert a NFT minter widget"
            };
            return {
                block: NftMinterBlock,
                slashItem: NftMinterSlashItem,
                moduleData
            };
        }
        removeRpcWalletEvents() {
            this.configModel.removeRpcWalletEvents();
        }
        onHide() {
            this.containerDapp.onHide();
            this.removeRpcWalletEvents();
        }
        initModels() {
            if (!this.state) {
                this.state = new index_23.State(data_json_2.default);
            }
            if (!this.nftMinterModel) {
                this.nftMinterModel = new model_1.NFTMinterModel(this, this.state, {
                    updateSubmitButton: async (submitting) => this.updateSubmitButton(submitting),
                    onMintedNft: (oswapTroll) => {
                        if (oswapTroll) {
                            this.lblSpotsRemaining.caption = this.i18n.get('$hurry_only_nfts_left', { cap: (0, index_22.formatNumber)(oswapTroll.cap, 0) });
                        }
                        this.updateSubmitButton(false);
                        if (this.onMintedNFT)
                            this.onMintedNFT();
                    },
                    onDonated: async () => {
                        await this.updateTokenBalance();
                    },
                    onSubscribed: () => {
                        this.updateSpotsRemaining();
                        if (this.onMintedNFT)
                            this.onMintedNFT();
                    },
                    onBoughtProduct: async () => {
                        await this.updateTokenBalance();
                        this.updateSpotsRemaining();
                        if (this.onMintedNFT)
                            this.onMintedNFT();
                    },
                    showTxStatusModal: (status, content, exMessage) => this.showTxStatusModal(status, content, exMessage),
                    closeTxStatusModal: () => {
                        if (this.txStatusModal)
                            this.txStatusModal.closeModal();
                    },
                });
            }
            if (!this.configModel) {
                this.configModel = new model_1.ConfigModel(this.state, this, {
                    updateUIBySetData: () => this.updateUIBySetData(),
                    refreshWidget: (isDataUpdated) => this.refreshWidget(isDataUpdated),
                    refreshDappContainer: () => this.refreshDappContainer(),
                    setContaiterTag: (value) => this.setContaiterTag(value),
                    updateTheme: () => this.updateTheme(),
                    onChainChanged: () => this.onChainChanged(),
                    onWalletConnected: () => this.onWalletConnected(),
                    connectWallet: () => this.connectWallet(),
                    showTxStatusModal: (status, content, exMessage) => this.showTxStatusModal(status, content, exMessage)
                });
            }
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get chainId() {
            return this.configModel.chainId;
        }
        get rpcWallet() {
            return this.configModel.rpcWallet;
        }
        get nftType() {
            return this.configModel.nftType;
        }
        get nftAddress() {
            return this.configModel.nftAddress;
        }
        get newPrice() {
            return this.configModel.newPrice;
        }
        get newMaxQty() {
            return this.configModel.newMaxQty;
        }
        get newTxnMaxQty() {
            return this.configModel.newTxnMaxQty;
        }
        get recipient() {
            return this.configModel.recipient;
        }
        get link() {
            return this.configModel.link;
        }
        set link(value) {
            this.configModel.link = value;
        }
        get oswapTrollInfo() {
            return this.nftMinterModel.oswapTrollInfo;
        }
        get productInfo() {
            return this.nftMinterModel.productInfo;
        }
        get productId() {
            return this.configModel.productId;
        }
        get productType() {
            return this.configModel.productType;
        }
        set productType(value) {
            this.configModel.productType = value;
        }
        get name() {
            return this.configModel.name;
        }
        set name(value) {
            this.configModel.name = value;
        }
        get description() {
            return this.configModel.description;
        }
        set description(value) {
            this.configModel.description = value;
        }
        get logoUrl() {
            return this.configModel.logoUrl;
        }
        set logoUrl(value) {
            this.configModel.logoUrl = value;
        }
        get commissions() {
            return this.configModel.commissions;
        }
        set commissions(value) {
            this.configModel.commissions = value;
        }
        get chainSpecificProperties() {
            return this.configModel.chainSpecificProperties;
        }
        set chainSpecificProperties(value) {
            this.configModel.chainSpecificProperties = value;
        }
        get wallets() {
            return this.configModel.wallets;
        }
        set wallets(value) {
            this.configModel.wallets = value;
        }
        get networks() {
            return this.configModel.networks;
        }
        set networks(value) {
            this.configModel.networks = value;
        }
        get showHeader() {
            return this.configModel.showHeader;
        }
        set showHeader(value) {
            this.configModel.showHeader = value;
        }
        get defaultChainId() {
            return this.configModel.defaultChainId;
        }
        set defaultChainId(value) {
            this.configModel.defaultChainId = value;
        }
        get isRenewal() {
            return this.nftMinterModel.isRenewal;
        }
        set isRenewal(value) {
            this.nftMinterModel.isRenewal = value;
        }
        get renewalDate() {
            return this._renewalDate;
        }
        set renewalDate(value) {
            this._renewalDate = value;
            if (this.productInfo) {
                this.edtStartDate.value = value > 0 ? (0, components_8.moment)(value * 1000) : (0, components_8.moment)();
                this.onDurationChanged();
            }
        }
        get discountApplied() {
            return this.nftMinterModel.discountApplied;
        }
        async onSetupPage() {
            if (this.state.isRpcWalletConnected())
                await this.initApprovalAction();
        }
        getConfigurators(type, readonly, isPocily) {
            this.initModels();
            return this.configModel.getConfigurators(type, readonly, isPocily);
        }
        showLoading() {
            this.pnlLoading.visible = true;
            this.gridMain.visible = false;
        }
        hideLoading() {
            this.pnlLoading.visible = false;
            this.gridMain.visible = true;
        }
        async getData() {
            return this.configModel.getData();
        }
        async setData(data) {
            await this.configModel.setData(data);
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            this.configModel.setTag(value);
        }
        setContaiterTag(value) {
            if (this.containerDapp)
                this.containerDapp.setTag(value);
        }
        updateStyle(name, value) {
            if (value) {
                this.style.setProperty(name, value);
            }
            else {
                this.style.removeProperty(name);
            }
        }
        updateTheme() {
            const themeVar = this.containerDapp?.theme || 'dark';
            this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
            this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
            this.updateStyle('--input-font_color', this.tag[themeVar]?.inputFontColor);
            this.updateStyle('--input-background', this.tag[themeVar]?.inputBackgroundColor);
            this.updateStyle('--colors-primary-main', this.tag[themeVar]?.buttonBackgroundColor);
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
        async getProductInfo() {
            const info = await this.nftMinterModel.getProductInfo(this.productId);
            return info;
        }
        updateTokenAddress(address) {
            const isNativeToken = !address || address === index_22.nullAddress || !address.startsWith('0x');
            if (isNativeToken) {
                const network = this.state.getNetworkInfo(this.chainId);
                this.lbToken.caption = this.i18n.get('$native_token', { chainName: network?.chainName || '' });
                this.lbToken.textDecoration = 'none';
                this.lbToken.font = { size: '1rem', color: Theme.text.primary };
                this.lbToken.style.textAlign = 'right';
                this.lbToken.classList.remove(index_css_4.linkStyle);
                this.lbToken.onClick = () => { };
            }
            else {
                this.lbToken.caption = components_8.FormatUtils.truncateWalletAddress(address);
                this.lbToken.textDecoration = 'underline';
                this.lbToken.font = { size: '1rem', color: Theme.colors.primary.main };
                this.lbToken.classList.add(index_css_4.linkStyle);
                this.lbToken.onClick = () => this.onViewToken();
            }
            this.iconCopyToken.visible = !isNativeToken;
        }
        updateSpotsRemaining() {
            if (this.productId >= 0) {
                this.lblSpotsRemaining.caption = this.i18n.get('$hurry_only_nfts_left', { cap: (0, index_22.formatNumber)(this.productInfo.quantity, 0) });
            }
            else {
                this.lblSpotsRemaining.caption = "";
            }
        }
        onToggleDetail() {
            const isExpanding = this.detailWrapper.visible;
            this.detailWrapper.visible = !isExpanding;
            this.btnDetail.caption = isExpanding ? '$more_information' : '$hide_information';
            this.btnDetail.rightIcon.name = isExpanding ? 'caret-down' : 'caret-up';
        }
        onViewMarketplaceContract() {
            this.state.viewExplorerByAddress(this.chainId, this.state.getContractAddress('ProductMarketplace') || "");
        }
        onViewNFTContract() {
            this.state.viewExplorerByAddress(this.chainId, this.nftAddress);
        }
        onViewToken() {
            const token = this.nftType === 'ERC721' && !this.productId ? this.oswapTrollInfo.token : this.productInfo.token;
            this.state.viewExplorerByAddress(this.chainId, token.address || token.symbol);
        }
        updateCopyIcon(icon) {
            if (icon.name === 'check')
                return;
            icon.name = 'check';
            icon.fill = Theme.colors.success.main;
            setTimeout(() => {
                icon.fill = Theme.text.primary;
                icon.name = 'copy';
            }, 1600);
        }
        onCopyMarketplaceContract(target) {
            components_8.application.copyToClipboard(this.state.getContractAddress('ProductMarketplace') || "");
            this.updateCopyIcon(target);
        }
        onCopyNFTContract(target) {
            components_8.application.copyToClipboard(this.nftAddress);
            this.updateCopyIcon(target);
        }
        onCopyToken(target) {
            const token = this.nftType === 'ERC721' && !this.productId ? this.oswapTrollInfo.token : this.productInfo.token;
            components_8.application.copyToClipboard(token.address || token.symbol);
            this.updateCopyIcon(target);
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
                        this.btnApprove.visible = (0, index_23.isClientWalletConnected)() && this.state.isRpcWalletConnected();
                        this.btnSubmit.visible = !this.btnApprove.visible;
                        this.btnSubmit.enabled = false;
                        if (!this.isApproving) {
                            this.btnApprove.rightIcon.visible = false;
                            this.btnApprove.caption = '$approve';
                        }
                        this.btnApprove.enabled = true;
                        this.isApproving = false;
                    },
                    onToBePaid: async (token) => {
                        this.btnApprove.visible = false;
                        this.btnSubmit.visible = true;
                        this.isApproving = false;
                        const isSubscription = this.configModel.productType === index_21.ProductType.Subscription;
                        const duration = Number(this.edtDuration.value) || 0;
                        this.btnSubmit.enabled = new eth_wallet_8.BigNumber(this.nftMinterModel.tokenAmountIn).gt(0) && (!isSubscription || Number.isInteger(duration));
                        this.determineBtnSubmitCaption();
                    },
                    onApproving: async (token, receipt) => {
                        this.isApproving = true;
                        this.btnApprove.rightIcon.spin = true;
                        this.btnApprove.rightIcon.visible = true;
                        this.btnApprove.caption = `${this.i18n.get('$approving')} ${token?.symbol || ''}`;
                        this.btnSubmit.visible = false;
                        if (receipt) {
                            this.showTxStatusModal('success', receipt);
                        }
                    },
                    onApproved: async (token) => {
                        this.btnApprove.rightIcon.visible = false;
                        this.btnApprove.caption = '$approve';
                        this.isApproving = false;
                        this.btnSubmit.visible = true;
                        this.btnSubmit.enabled = true;
                    },
                    onApprovingError: async (token, err) => {
                        this.showTxStatusModal('error', err);
                        this.btnApprove.caption = '$approve';
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
                if (this.productInfo?.token?.address !== index_22.nullAddress && this.nftMinterModel.tokenAmountIn) {
                    this.approvalModelAction.checkAllowance(this.productInfo.token, this.nftMinterModel.tokenAmountIn);
                }
            }
        }
        updateContractAddress() {
            if (this.approvalModelAction) {
                if (this.configModel.referrer) {
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
            const balance = await this.nftMinterModel.getTokenBalance(token);
            this.lblBalance.caption = `${(0, index_22.formatNumber)(balance)} ${symbol}`;
        }
        updateSubmitButton(submitting) {
            this.btnSubmit.rightIcon.spin = submitting;
            this.btnSubmit.rightIcon.visible = submitting;
        }
        determineBtnSubmitCaption() {
            if (!(0, index_23.isClientWalletConnected)()) {
                this.btnSubmit.caption = '$connect_wallet';
                this.btnSubmit.enabled = true;
            }
            else if (!this.state.isRpcWalletConnected()) {
                this.btnSubmit.caption = '$switch_network';
                this.btnSubmit.enabled = true;
            }
            else if (this.nftType === 'ERC721' && !this.productId) {
                this.btnSubmit.caption = this.nftMinterModel.cap ? "$mint" : '$out_of_stock';
                this.btnSubmit.enabled = !!this.nftMinterModel.cap;
            }
            else if (this.productType === index_21.ProductType.Buy) {
                this.btnSubmit.caption = '$mint';
            }
            else if (this.productType === index_21.ProductType.Subscription) {
                this.btnSubmit.caption = this.isRenewal ? '$renew_subscription' : '$subscribe';
            }
            else {
                this.btnSubmit.caption = '$submit';
            }
        }
        async onApprove() {
            if (this.nftType === 'ERC721' && !this.productId) {
                const { price, token } = this.oswapTrollInfo;
                // const contractAddress = this.state.getExplorerByAddress(this.chainId, this.nftAddress);
                const contractAddress = this.state.getContractAddress('ProductMarketplace');
                const tokenAddress = this.state.getExplorerByAddress(this.chainId, token.address);
                this.showTxStatusModal('warning', this.i18n.get('$confirming'), this.i18n.get('$to_contract_with_token', { address: contractAddress, token: tokenAddress }));
                await this.approvalModelAction.doApproveAction(token, price.toFixed());
            }
            else {
                this.showTxStatusModal('warning', this.i18n.get('$approving'));
                await this.approvalModelAction.doApproveAction(this.productInfo.token, this.nftMinterModel.tokenAmountIn);
            }
        }
        async onQtyChanged() {
            const qty = Number(this.edtQty.value);
            const { token, price } = this.productInfo || {};
            const commissions = this.configModel.commissions;
            if (qty === 0) {
                this.nftMinterModel.updateTokenAmountIn(0, []);
                this.tokenInput.value = '0';
                this.lbOrderTotal.caption = `0 ${token?.symbol || ''}`;
            }
            else {
                this.nftMinterModel.updateTokenAmountIn(qty, commissions);
                const productPrice = eth_wallet_8.Utils.fromDecimals(price, token.decimals);
                const amount = productPrice.times(qty);
                this.tokenInput.value = amount.toFixed();
                const commissionFee = this.state.embedderCommissionFee;
                const total = amount.plus(amount.times(commissionFee));
                this.lbOrderTotal.caption = `${(0, index_22.formatNumber)(total, 6)} ${token?.symbol || ''}`;
            }
            if (this.productInfo && this.state.isRpcWalletConnected()) {
                if (token?.address !== index_22.nullAddress) {
                    this.approvalModelAction.checkAllowance(token, this.nftMinterModel.tokenAmountIn);
                }
                else {
                    this.btnSubmit.enabled = new eth_wallet_8.BigNumber(this.nftMinterModel.tokenAmountIn).gt(0);
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
                this.nftMinterModel.updateTokenAmountIn(0, []);
                this.tokenInput.value = '0';
            }
            else {
                this.nftMinterModel.updateTokenAmountIn(amount, this.configModel.commissions);
            }
            amount = Number(this.tokenInput.value);
            const commissionFee = this.state.embedderCommissionFee;
            const total = new eth_wallet_8.BigNumber(amount).plus(new eth_wallet_8.BigNumber(amount).times(commissionFee));
            const token = this.productInfo?.token;
            this.lbOrderTotal.caption = `${(0, index_22.formatNumber)(total, 6)} ${token?.symbol || ''}`;
            if (token && this.state.isRpcWalletConnected() && token?.address !== index_22.nullAddress) {
                if (token?.address !== index_22.nullAddress) {
                    this.approvalModelAction.checkAllowance(token, this.nftMinterModel.tokenAmountIn);
                }
                else {
                    this.btnSubmit.enabled = new eth_wallet_8.BigNumber(this.nftMinterModel.tokenAmountIn).gt(0);
                    this.determineBtnSubmitCaption();
                }
            }
            else {
                this.determineBtnSubmitCaption();
            }
        }
        async doSubmitAction() {
            const days = this.getDurationInDays();
            if (!this.isRenewal && !this.chkCustomStartDate.checked) {
                this.edtStartDate.value = (0, components_8.moment)();
            }
            const recipient = this.comboRecipient.selectedItem?.value;
            await this.nftMinterModel.doSubmitAction(this.configModel, this.tokenInput.token, this.tokenInput.value, this.edtQty.value, this.edtStartDate.value, this.edtDuration.value, days, recipient);
        }
        async onSubmit() {
            if (!(0, index_23.isClientWalletConnected)()) {
                this.connectWallet();
                return;
            }
            if (!this.state.isRpcWalletConnected()) {
                const clientWallet = eth_wallet_8.Wallet.getClientInstance();
                await clientWallet.switchNetwork(this.chainId);
                return;
            }
            if (this.nftType === 'ERC721' && !this.productId) {
                const contractAddress = this.state.getExplorerByAddress(this.chainId, this.nftAddress);
                const tokenAddress = this.state.getExplorerByAddress(this.chainId, this.oswapTrollInfo.token.address);
                this.showTxStatusModal('warning', this.i18n.get('$confirming'), this.i18n.get('$to_contract_with_token', { address: contractAddress, token: tokenAddress }));
            }
            else {
                this.showTxStatusModal('warning', this.i18n.get('$confirming'));
            }
            this.approvalModelAction.doPayAction();
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
            const dateFormat = 'YYYY-MM-DD hh:mm A';
            if (!this.edtStartDate.value) {
                this.lblEndDate.caption = '-';
                return;
            }
            const startDate = (0, components_8.moment)(this.edtStartDate.value.format(dateFormat), dateFormat);
            const unit = (this.comboDurationUnit.selectedItem?.value || DurationUnits[0].value);
            const duration = Number(this.edtDuration.value) || 0;
            this.lblEndDate.caption = startDate.add(duration, unit).format('DD/MM/YYYY hh:mm A');
        }
        _updateDiscount() {
            const duration = Number(this.edtDuration.value) || 0;
            const days = this.getDurationInDays();
            this.nftMinterModel.updateDiscount(duration, this.edtStartDate.value, days);
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
                    this.lblDiscount.caption = `${this.i18n.get('$discount')} (${this.discountApplied.discountPercentage}%)`;
                    this.pnlDiscount.visible = true;
                }
                else if (this.discountApplied.fixedPrice.gt(0)) {
                    basePrice = this.discountApplied.fixedPrice;
                    this.lblDiscount.caption = "$discount";
                    this.pnlDiscount.visible = true;
                }
            }
            const pricePerDay = basePrice.div(this.productInfo.priceDuration.div(86400));
            const days = this.getDurationInDays();
            const amountRaw = pricePerDay.times(days);
            const amount = eth_wallet_8.Utils.fromDecimals(amountRaw, this.productInfo.token.decimals);
            this.nftMinterModel.updateTokenAmountIn(0, [], amount.toFixed());
            if (this.discountApplied) {
                const discountAmountRaw = price.minus(basePrice).div(this.productInfo.priceDuration.div(86400)).times(days);
                const discountAmount = eth_wallet_8.Utils.fromDecimals(discountAmountRaw, this.productInfo.token.decimals);
                this.lblDiscountAmount.caption = `-${(0, index_22.formatNumber)(discountAmount, 6)} ${this.productInfo.token?.symbol || ''}`;
            }
            this.lbOrderTotal.caption = `${(0, index_22.formatNumber)(amount, 6)} ${this.productInfo.token?.symbol || ''}`;
        }
        onStartDateChanged() {
            this.lblStartDate.caption = this.edtStartDate.value.format('DD/MM/YYYY hh:mm A');
            this._updateEndDate();
            this._updateDiscount();
        }
        onDurationChanged() {
            this._updateEndDate();
            this._updateDiscount();
            this._updateTotalAmount();
            if (this.approvalModelAction) {
                const { productInfo, tokenAmountIn } = this.nftMinterModel;
                this.approvalModelAction.checkAllowance(productInfo.token, tokenAmountIn);
            }
        }
        onDurationUnitChanged() {
            this._updateEndDate();
            this._updateDiscount();
            this._updateTotalAmount();
            if (this.approvalModelAction) {
                const { productInfo, tokenAmountIn } = this.nftMinterModel;
                this.approvalModelAction.checkAllowance(productInfo.token, tokenAmountIn);
            }
        }
        handleCustomCheckboxChange() {
            const isChecked = this.chkCustomStartDate.checked;
            this.edtStartDate.enabled = isChecked;
            const now = (0, components_8.moment)();
            if (isChecked) {
                if (this.edtStartDate.value.isBefore(now)) {
                    this.edtStartDate.value = now;
                }
                this.lblStartDate.caption = this.edtStartDate.value.format('DD/MM/YYYY hh:mm A');
                this.edtStartDate.minDate = now;
            }
            else {
                this.edtStartDate.value = now;
                this.lblStartDate.caption = "$now";
                this._updateEndDate();
            }
        }
        async init() {
            this.i18n.init({ ...index_24.mainJson });
            super.init();
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
                const recipients = this.getAttribute('recipients', true);
                const chainSpecificProperties = this.getAttribute('chainSpecificProperties', true);
                const networks = this.getAttribute('networks', true);
                const wallets = this.getAttribute('wallets', true);
                const showHeader = this.getAttribute('showHeader', true);
                const defaultChainId = this.getAttribute('defaultChainId', true);
                const tokenToMint = this.getAttribute('tokenToMint', true);
                const customMintToken = this.getAttribute('customMintToken', true);
                const perPeriodPrice = this.getAttribute('perPeriodPrice', true);
                const oneTimePrice = this.getAttribute('oneTimePrice', true);
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
                    perPeriodPrice,
                    oneTimePrice,
                    maxQty,
                    txnMaxQty,
                    description,
                    logoUrl,
                    recipients,
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
                        this.$render("i-stack", { id: "pnlLoading", direction: "vertical", height: "100%", alignItems: "center", justifyContent: "center", padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, visible: false },
                            this.$render("i-panel", { class: 'spinner' })),
                        this.$render("i-grid-layout", { id: "gridMain", width: '100%', height: '100%', templateColumns: ['1fr'] },
                            this.$render("i-stack", { direction: 'vertical', padding: { top: '1.5rem', bottom: '1.25rem', left: '1.25rem', right: '1.5rem' }, alignItems: "center" },
                                this.$render("i-stack", { direction: 'vertical', width: "100%", maxWidth: 600, gap: '0.5rem' },
                                    this.$render("i-vstack", { class: "text-center", gap: "0.5rem" },
                                        this.$render("i-image", { id: 'imgLogo', height: 100, border: { radius: 4 } }),
                                        this.$render("i-label", { id: 'lblTitle', font: { bold: true, size: '1.5rem' } }),
                                        this.$render("i-markdown", { id: 'markdownViewer', class: index_css_4.markdownStyle, width: '100%', height: '100%', margin: { bottom: '0.563rem' } })),
                                    this.$render("i-vstack", { gap: "0.5rem", id: "pnlInputFields" },
                                        this.$render("i-image", { visible: false, id: "imgUri", width: 280, maxWidth: "100%", height: "auto", maxHeight: 150, margin: { top: 4, bottom: 16, left: 'auto', right: 'auto' } }),
                                        this.$render("i-hstack", { id: 'pnlQty', width: "100%", justifyContent: "space-between", alignItems: 'center', gap: "0.5rem", lineHeight: 1.5, visible: false },
                                            this.$render("i-label", { caption: '$quantity', font: { bold: true, size: '1rem' } }),
                                            this.$render("i-panel", { width: "50%" },
                                                this.$render("i-input", { id: 'edtQty', height: 35, width: "100%", onChanged: this.onQtyChanged.bind(this), class: index_css_4.inputStyle, inputType: 'number', font: { size: '1rem' }, border: { radius: 4, style: 'none' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' } }))),
                                        this.$render("i-stack", { id: 'pnlRecipient', width: '100%', direction: "horizontal", alignItems: "center", justifyContent: "space-between", gap: 10 },
                                            this.$render("i-label", { caption: "$wallet_address_to_receive_nft", stack: { shrink: '0' }, font: { bold: true, size: '1rem' } }),
                                            this.$render("i-combo-box", { id: "comboRecipient", height: 36, width: "100%", icon: { width: 14, height: 14, name: 'angle-down', fill: Theme.divider }, border: { width: 1, style: 'solid', color: Theme.divider, radius: 5 } })),
                                        this.$render("i-stack", { id: "pnlSubscriptionPeriod", direction: "vertical", width: "100%", gap: "0.5rem", visible: false },
                                            this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 10 },
                                                this.$render("i-label", { caption: "$start_date", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-label", { id: "lblStartDate", font: { size: '1rem' } })),
                                            this.$render("i-stack", { id: "pnlCustomStartDate", direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 10, visible: false },
                                                this.$render("i-checkbox", { id: "chkCustomStartDate", height: "auto", caption: "Custom", onChanged: this.handleCustomCheckboxChange }),
                                                this.$render("i-panel", { width: "50%" },
                                                    this.$render("i-datepicker", { id: 'edtStartDate', height: 36, width: "100%", type: "dateTime", dateTimeFormat: "DD/MM/YYYY hh:mm A", placeholder: "dd/mm/yyyy hh:mm A", background: { color: Theme.input.background }, font: { size: '1rem' }, border: { radius: "0.375rem" }, onChanged: this.onStartDateChanged }))),
                                            this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 10 },
                                                this.$render("i-label", { caption: "$duration", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-stack", { direction: "horizontal", width: "50%", alignItems: "center", gap: "0.5rem" },
                                                    this.$render("i-panel", { width: "50%" },
                                                        this.$render("i-input", { id: 'edtDuration', height: 36, width: "100%", class: index_css_4.inputStyle, inputType: 'number', font: { size: '1rem' }, border: { radius: 4, style: 'none' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }, onChanged: this.onDurationChanged })),
                                                    this.$render("i-panel", { width: "50%" },
                                                        this.$render("i-combo-box", { id: "comboDurationUnit", height: 36, width: "100%", icon: { width: 14, height: 14, name: 'angle-down', fill: Theme.divider }, border: { width: 1, style: 'solid', color: Theme.divider, radius: 5 }, items: DurationUnits, selectedItem: DurationUnits[0], onChanged: this.onDurationUnitChanged })))),
                                            this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 10 },
                                                this.$render("i-label", { caption: "$end_date", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-label", { id: "lblEndDate", font: { size: '1rem' } }))),
                                        this.$render("i-stack", { id: 'pnlMintFee', direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 10 },
                                            this.$render("i-label", { caption: '$base_price', font: { bold: true, size: '1rem' } }),
                                            this.$render("i-label", { id: 'lblMintFee', font: { size: '1rem' } })),
                                        this.$render("i-stack", { id: "pnlDiscount", direction: "horizontal", width: "100%", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", lineHeight: 1.5, visible: false },
                                            this.$render("i-label", { id: "lblDiscount", caption: "Discount", font: { bold: true, size: '1rem' } }),
                                            this.$render("i-label", { id: "lblDiscountAmount", font: { size: '1rem' } })),
                                        this.$render("i-hstack", { width: "100%", justifyContent: "space-between", alignItems: 'center', gap: "0.5rem", lineHeight: 1.5 },
                                            this.$render("i-hstack", { verticalAlignment: 'center', gap: "0.5rem" },
                                                this.$render("i-label", { id: "lbOrderTotalTitle", caption: '$total', font: { bold: true, size: '1rem' } }),
                                                this.$render("i-icon", { id: "iconOrderTotal", name: "question-circle", fill: Theme.text.secondary, width: 20, height: 20 })),
                                            this.$render("i-label", { id: 'lbOrderTotal', font: { size: '1rem' }, caption: "0" })),
                                        this.$render("i-vstack", { id: "pnlTokenInput", gap: '0.25rem', margin: { bottom: '1rem' }, visible: false },
                                            this.$render("i-hstack", { horizontalAlignment: 'space-between', verticalAlignment: 'center', gap: "0.5rem" },
                                                this.$render("i-label", { caption: "$your_donation", font: { weight: 500, size: '1rem' } }),
                                                this.$render("i-hstack", { horizontalAlignment: 'end', verticalAlignment: 'center', gap: "0.5rem", opacity: 0.6 },
                                                    this.$render("i-label", { caption: '$balance', font: { size: '1rem' } }),
                                                    this.$render("i-label", { id: 'lblBalance', font: { size: '1rem' }, caption: "0.00" }))),
                                            this.$render("i-stack", { direction: "horizontal", overflow: "hidden", background: { color: Theme.input.background }, font: { color: Theme.input.fontColor }, height: 56, width: "50%", margin: { left: 'auto', right: 'auto' }, alignItems: "center", border: { radius: 16, width: '2px', style: 'solid', color: 'transparent' } },
                                                this.$render("i-scom-token-input", { id: "tokenInput", tokenReadOnly: true, isBtnMaxShown: false, isCommonShown: false, isBalanceShown: false, isSortBalanceShown: false, class: index_css_4.tokenSelectionStyle, padding: { left: '11px' }, font: { size: '1.25rem' }, width: "100%", height: "100%", placeholder: "0.00", modalStyles: {
                                                        maxHeight: '50vh'
                                                    }, onSelectToken: this.selectToken, onInputAmountChanged: this.onAmountChanged }))),
                                        this.$render("i-hstack", { horizontalAlignment: 'center' },
                                            this.$render("i-label", { id: "lblSpotsRemaining", font: { bold: true, size: '1rem', color: Theme.text.primary }, lineHeight: 1.5 })),
                                        this.$render("i-button", { id: "btnDetail", caption: "$more_information", rightIcon: { width: 10, height: 16, margin: { left: 5 }, fill: Theme.text.primary, name: 'caret-down' }, background: { color: 'transparent' }, border: { width: 1, style: 'solid', color: Theme.text.primary, radius: 8 }, width: 280, maxWidth: "100%", height: 36, margin: { top: 4, bottom: 16, left: 'auto', right: 'auto' }, onClick: this.onToggleDetail, visible: false }),
                                        this.$render("i-hstack", { id: "detailWrapper", horizontalAlignment: "space-between", gap: 10, visible: false, wrap: "wrap" },
                                            this.$render("i-hstack", { width: "100%", justifyContent: "space-between", gap: "0.5rem", lineHeight: 1.5 },
                                                this.$render("i-label", { caption: "$marketplace_contract_address", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-hstack", { gap: "0.25rem", verticalAlignment: "center", maxWidth: "calc(100% - 75px)" },
                                                    this.$render("i-label", { id: "lbMarketplaceContract", font: { size: '1rem', color: Theme.colors.primary.main }, textDecoration: "underline", class: index_css_4.linkStyle, onClick: this.onViewMarketplaceContract }),
                                                    this.$render("i-icon", { fill: Theme.text.primary, name: "copy", width: 16, height: 16, onClick: this.onCopyMarketplaceContract, cursor: "pointer" }))),
                                            this.$render("i-hstack", { width: "100%", justifyContent: "space-between", gap: "0.5rem", lineHeight: 1.5 },
                                                this.$render("i-label", { caption: "$nft_contract_address", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-hstack", { gap: "0.25rem", verticalAlignment: "center", maxWidth: "calc(100% - 75px)" },
                                                    this.$render("i-label", { id: "lbNFTContract", font: { size: '1rem', color: Theme.colors.primary.main }, textDecoration: "underline", class: index_css_4.linkStyle, onClick: this.onViewNFTContract }),
                                                    this.$render("i-icon", { fill: Theme.text.primary, name: "copy", width: 16, height: 16, onClick: this.onCopyNFTContract, cursor: "pointer" }))),
                                            this.$render("i-hstack", { width: "100%", justifyContent: "space-between", gap: "0.5rem", lineHeight: 1.5 },
                                                this.$render("i-label", { caption: "$token_used_for_payment", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-hstack", { gap: "0.25rem", verticalAlignment: "center", maxWidth: "calc(100% - 75px)" },
                                                    this.$render("i-label", { id: "lbToken", font: { size: '1rem', color: Theme.colors.primary.main }, textDecoration: "underline", class: index_css_4.linkStyle, onClick: this.onViewToken }),
                                                    this.$render("i-icon", { id: "iconCopyToken", visible: false, fill: Theme.text.primary, name: "copy", width: 16, height: 16, onClick: this.onCopyToken, cursor: "pointer" })))),
                                        this.$render("i-vstack", { horizontalAlignment: "center", verticalAlignment: 'center', gap: "8px", width: "100%", margin: { top: '0.5rem' } },
                                            this.$render("i-button", { id: "btnApprove", width: '100%', caption: "$approve", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText, bold: true }, rightIcon: { visible: false, fill: Theme.colors.primary.contrastText }, background: { color: Theme.background.gradient }, border: { radius: 12 }, visible: false, onClick: this.onApprove.bind(this) }),
                                            this.$render("i-button", { id: 'btnSubmit', width: '100%', caption: '$submit', padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText, bold: true }, rightIcon: { visible: false, fill: Theme.colors.primary.contrastText }, background: { color: Theme.background.gradient }, border: { radius: 12 }, onClick: this.onSubmit.bind(this), enabled: false })),
                                        this.$render("i-vstack", { id: "pnlAddress", gap: '0.25rem', margin: { top: '1rem' } },
                                            this.$render("i-label", { id: 'lblRef', font: { size: '0.875rem' }, opacity: 0.5 }),
                                            this.$render("i-label", { id: 'lblAddress', font: { size: '0.875rem' }, overflowWrap: 'anywhere' }))),
                                    this.$render("i-vstack", { id: 'pnlUnsupportedNetwork', visible: false, horizontalAlignment: 'center' },
                                        this.$render("i-label", { caption: '$this_network_or_this_token_is_not_supported', font: { size: '1.5rem' } })),
                                    this.$render("i-hstack", { id: 'pnlLink', visible: false, verticalAlignment: 'center', gap: '0.25rem' },
                                        this.$render("i-label", { caption: '$details_here', font: { size: '1rem' } }),
                                        this.$render("i-label", { id: 'lblLink', font: { size: '1rem' } }))))),
                        this.$render("i-scom-wallet-modal", { id: "mdWallet", wallets: [] }),
                        this.$render("i-scom-tx-status-modal", { id: "txStatusModal" })))));
        }
    };
    ScomNftMinter = ScomNftMinter_1 = __decorate([
        components_8.customModule,
        (0, components_8.customElements)('i-scom-nft-minter')
    ], ScomNftMinter);
    exports.default = ScomNftMinter;
});
