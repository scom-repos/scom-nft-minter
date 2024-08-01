var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-nft-minter/interface/index.tsx", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProductType = void 0;
    var ProductType;
    (function (ProductType) {
        ProductType["Buy"] = "Buy";
        ProductType["DonateToOwner"] = "DonateToOwner";
        ProductType["DonateToEveryone"] = "DonateToEveryone";
    })(ProductType = exports.ProductType || (exports.ProductType = {}));
});
define("@scom/scom-nft-minter/store/index.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-network-list"], function (require, exports, components_1, eth_wallet_1, scom_network_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isClientWalletConnected = exports.getClientWallet = exports.State = void 0;
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
    exports.registerSendTxEvents = exports.getTokenBalance = exports.getERC20Amount = void 0;
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
        if (token.address) {
            balance = await (0, exports.getERC20Amount)(wallet, token.address, token.decimals);
        }
        else {
            balance = await wallet.balance;
        }
        return balance;
    };
    exports.getTokenBalance = getTokenBalance;
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
    exports.registerSendTxEvents = exports.getTokenBalance = exports.getERC20Amount = exports.getProxySelectors = exports.formatNumber = void 0;
    const formatNumber = (value, decimalFigures) => {
        if (typeof value === 'object') {
            value = value.toFixed();
        }
        const minValue = '0.0000001';
        return components_2.FormatUtils.formatNumber(value, { decimalFigures: decimalFigures !== undefined ? decimalFigures : 4, minValue });
    };
    exports.formatNumber = formatNumber;
    async function getProxySelectors(state, chainId) {
        const wallet = state.getRpcWallet();
        await wallet.init();
        if (wallet.chainId != chainId)
            await wallet.switchNetwork(chainId);
        let productInfoAddress = state.getContractAddress('ProductInfo');
        let contract = new scom_product_contract_1.Contracts.ProductInfo(wallet, productInfoAddress);
        let permittedProxyFunctions = [
            "buy",
            "buyEth",
            "donate",
            "donateEth"
        ];
        let selectors = permittedProxyFunctions
            .map(e => e + "(" + contract._abi.filter(f => f.name == e)[0].inputs.map(f => f.type).join(',') + ")")
            .map(e => wallet.soliditySha3(e).substring(0, 10))
            .map(e => contract.address.toLowerCase() + e.replace("0x", ""));
        return selectors;
    }
    exports.getProxySelectors = getProxySelectors;
    Object.defineProperty(exports, "getERC20Amount", { enumerable: true, get: function () { return token_1.getERC20Amount; } });
    Object.defineProperty(exports, "getTokenBalance", { enumerable: true, get: function () { return token_1.getTokenBalance; } });
    Object.defineProperty(exports, "registerSendTxEvents", { enumerable: true, get: function () { return token_1.registerSendTxEvents; } });
});
define("@scom/scom-nft-minter/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.linkStyle = exports.tokenSelectionStyle = exports.inputStyle = exports.markdownStyle = void 0;
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
});
define("@scom/scom-nft-minter/API.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-nft-minter/interface/index.tsx", "@scom/scom-product-contract", "@scom/scom-commission-proxy-contract", "@scom/oswap-troll-nft-contract", "@scom/scom-nft-minter/utils/index.ts", "@scom/scom-token-list"], function (require, exports, eth_wallet_3, index_1, scom_product_contract_2, scom_commission_proxy_contract_1, oswap_troll_nft_contract_1, index_2, scom_token_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mintOswapTrollNft = exports.fetchUserNftBalance = exports.fetchOswapTrollNftInfo = exports.donate = exports.buyProduct = exports.getProxyTokenAmountIn = exports.newDefaultBuyProduct = exports.newProduct = exports.getNFTBalance = exports.getProductInfo = void 0;
    async function getProductInfo(state, erc1155Index) {
        let productInfoAddress = state.getContractAddress('ProductInfo');
        if (!productInfoAddress)
            return null;
        try {
            const wallet = state.getRpcWallet();
            const productInfo = new scom_product_contract_2.Contracts.ProductInfo(wallet, productInfoAddress);
            const product = await productInfo.products(erc1155Index);
            const chainId = wallet.chainId;
            const _tokenList = scom_token_list_1.tokenStore.getTokenList(chainId);
            const token = _tokenList.find(token => product?.token && token?.address && token.address.toLowerCase() === product.token.toLowerCase());
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
    async function getNFTBalance(state, erc1155Index) {
        let product1155Address = state.getContractAddress('Product1155');
        if (!product1155Address)
            return null;
        try {
            const wallet = state.getRpcWallet();
            const product1155 = new scom_product_contract_2.Contracts.Product1155(wallet, product1155Address);
            const nftBalance = await product1155.balanceOf({ account: wallet.address, id: erc1155Index });
            return nftBalance.toFixed();
        }
        catch {
            return null;
        }
    }
    exports.getNFTBalance = getNFTBalance;
    async function newProduct(productInfoAddress, productType, qty, // max quantity of this nft can be exist at anytime
    maxQty, // max quantity for one buy() txn
    price, maxPrice, //for donation only, no max price when it is 0
    tokenAddress, tokenDecimals, callback, confirmationCallback) {
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        const productInfo = new scom_product_contract_2.Contracts.ProductInfo(wallet, productInfoAddress);
        (0, index_2.registerSendTxEvents)({
            transactionHash: callback,
            confirmation: confirmationCallback
        });
        let productTypeCode;
        switch (productType) {
            case index_1.ProductType.Buy:
                productTypeCode = 0;
                break;
            case index_1.ProductType.DonateToOwner:
                productTypeCode = 1;
                break;
            case index_1.ProductType.DonateToEveryone:
                productTypeCode = 2;
                break;
        }
        console.log({
            productType: productTypeCode,
            uri: '',
            quantity: qty,
            maxQuantity: maxQty,
            maxPrice: eth_wallet_3.Utils.toDecimals(maxPrice, tokenDecimals),
            price: eth_wallet_3.Utils.toDecimals(price, tokenDecimals),
            token: tokenAddress
        });
        let receipt = await productInfo.newProduct({
            productType: productTypeCode,
            uri: '',
            quantity: qty,
            maxQuantity: maxQty,
            maxPrice: eth_wallet_3.Utils.toDecimals(maxPrice, tokenDecimals),
            price: eth_wallet_3.Utils.toDecimals(price, tokenDecimals),
            token: tokenAddress
        });
        let productId;
        if (receipt) {
            let event = productInfo.parseNewProductEvent(receipt)[0];
            productId = event?.productId.toNumber();
        }
        return {
            receipt,
            productId
        };
    }
    exports.newProduct = newProduct;
    async function newDefaultBuyProduct(productInfoAddress, qty, // max quantity of this nft can be exist at anytime
    maxQty, // max quantity for one buy() txn
    price, tokenAddress, tokenDecimals, callback, confirmationCallback) {
        //hard requirement for the contract
        if (!( //tokenAddress is a valid address &&
        new eth_wallet_3.BigNumber(tokenDecimals).gt(0) &&
            new eth_wallet_3.BigNumber(qty).gt(0) &&
            new eth_wallet_3.BigNumber(maxQty).gt(0))) {
            return;
        }
        if (!new eth_wallet_3.BigNumber(price).gt(0)) {
            //warn that it will be free to mint
        }
        return await newProduct(productInfoAddress, index_1.ProductType.Buy, qty, maxQty, price, "0", tokenAddress, tokenDecimals, callback, confirmationCallback);
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
        let productInfoAddress = state.getContractAddress('ProductInfo');
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        const proxy = new scom_commission_proxy_contract_1.Contracts.Proxy(wallet, proxyAddress);
        const productInfo = new scom_product_contract_2.Contracts.ProductInfo(wallet, productInfoAddress);
        const product = await productInfo.products(productId);
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
            if (token?.address) {
                (0, index_2.registerSendTxEvents)({
                    transactionHash: callback,
                    confirmation: confirmationCallback
                });
                if (commissionsAmount.isZero()) {
                    receipt = await productInfo.buy({
                        productId: productId,
                        quantity: quantity,
                        amountIn: amount,
                        to: wallet.address
                    });
                }
                else {
                    const txData = await productInfo.buy.txData({
                        productId: productId,
                        quantity: quantity,
                        amountIn: amount,
                        to: wallet.address
                    });
                    const tokensIn = {
                        token: token.address,
                        amount: amount.plus(commissionsAmount),
                        directTransfer: false,
                        commissions: _commissions
                    };
                    receipt = await proxy.tokenIn({
                        target: productInfoAddress,
                        tokensIn,
                        data: txData
                    });
                }
            }
            else {
                (0, index_2.registerSendTxEvents)({
                    transactionHash: callback,
                    confirmation: confirmationCallback
                });
                if (commissionsAmount.isZero()) {
                    receipt = await productInfo.buyEth({
                        productId: productId,
                        quantity,
                        to: wallet.address
                    });
                }
                else {
                    const txData = await productInfo.buyEth.txData({
                        productId: productId,
                        quantity,
                        to: wallet.address
                    }, amount);
                    receipt = await proxy.ethIn({
                        target: productInfoAddress,
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
        let productInfoAddress = state.getContractAddress('ProductInfo');
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        const proxy = new scom_commission_proxy_contract_1.Contracts.Proxy(wallet, proxyAddress);
        const productInfo = new scom_product_contract_2.Contracts.ProductInfo(wallet, productInfoAddress);
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
            if (token?.address) {
                (0, index_2.registerSendTxEvents)({
                    transactionHash: callback,
                    confirmation: confirmationCallback
                });
                if (commissionsAmount.isZero()) {
                    receipt = await productInfo.donate({
                        donor: wallet.address,
                        donee: donateTo,
                        productId: productId,
                        amountIn: amount
                    });
                }
                else {
                    const txData = await productInfo.donate.txData({
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
                        target: productInfoAddress,
                        tokensIn,
                        data: txData
                    });
                }
            }
            else {
                (0, index_2.registerSendTxEvents)({
                    transactionHash: callback,
                    confirmation: confirmationCallback
                });
                if (commissionsAmount.isZero()) {
                    receipt = await productInfo.donateEth({
                        donor: wallet.address,
                        donee: donateTo,
                        productId: productId
                    });
                }
                else {
                    const txData = await productInfo.donateEth.txData({
                        donor: wallet.address,
                        donee: donateTo,
                        productId: productId
                    }, amount);
                    receipt = await proxy.ethIn({
                        target: productInfoAddress,
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
    //
    //    ERC721 and oswap troll nft 
    //
    async function fetchUserNftBalance(state, address) {
        if (!address)
            return null;
        try {
            const wallet = state.getRpcWallet();
            const erc721 = new scom_product_contract_2.Contracts.ERC721(wallet, address);
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
define("@scom/scom-nft-minter/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/data.json.ts'/> 
    exports.default = {
        "infuraId": "adc596bf88b648e2a8902bc9093930c5",
        "contractInfo": {
            "43113": {
                "ProductNFT": {
                    "address": "0xB50fb7AFfef05021a215Af71548305a8D1ABf582"
                },
                "ProductInfo": {
                    "address": "0x23066A700753c57dCb609CE45e06ac5a7BfDb64d"
                },
                "Proxy": {
                    "address": "0x7f1EAB0db83c02263539E3bFf99b638E61916B96"
                },
                "Product1155": {
                    "address": "0xB50fb7AFfef05021a215Af71548305a8D1ABf582"
                }
            },
            "97": {
                "ProductNFT": {
                    "address": "0xd638ce7b39e38C410E672eb409cb4813FD844771"
                },
                "ProductInfo": {
                    "address": "0xa5CDA5D7F379145b97B47aD1c2d78f827C053D91"
                },
                "Proxy": {
                    "address": "0x9602cB9A782babc72b1b6C96E050273F631a6870"
                },
                "Product1155": {
                    "address": "0xd638ce7b39e38C410E672eb409cb4813FD844771"
                }
            }
        },
        "embedderCommissionFee": "0",
        "defaultBuilderData": {
            // "name": "Donation Dapp",
            // "title": "Title",
            // "productType": "DonateToEveryone",
            // "description": "#### Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            // "link": "",
            // "hideDescription": true,
            // "logoUrl": "https://placehold.co/600x400?text=No+Image",
            // "chainSpecificProperties": {
            //     "97": {
            //         "productId": 1,
            //         "donateTo": "0xCE001a607402Bba038F404106CA6682fBb1108F6"
            //     },
            //     "43113": {
            //         "productId": 1,
            //         "donateTo": "0xCE001a607402Bba038F404106CA6682fBb1108F6"
            //     }
            // },
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
        }
    };
});
define("@scom/scom-nft-minter/formSchema.json.ts", ["require", "exports", "@scom/scom-network-picker"], function (require, exports, scom_network_picker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProjectOwnerSchema = exports.getBuilderSchema = void 0;
    const chainIds = [1, 56, 137, 250, 97, 80001, 43113, 43114];
    const networks = chainIds.map(v => { return { chainId: v }; });
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
                    required: true,
                    enum: [
                        'ERC721',
                        'ERC1155',
                        'ERC1155NewIndex' // for now it is always productType.buy
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
                    title: 'NFT Address',
                    required: true
                },
                erc1155Index: {
                    type: 'integer',
                    title: 'Index',
                    tooltip: 'The index of your NFT inside the ERC1155 contract',
                    minimum: 1,
                },
                tokenToMint: {
                    type: 'string',
                    title: 'Token Address',
                    tooltip: 'token to mint the NFT',
                },
                priceToMint: {
                    type: 'number',
                    tooltip: 'amount of token to mint the NFT',
                },
                maxQty: {
                    type: 'integer',
                    title: 'Max Quantity',
                    tooltip: 'Max quantity of this NFT existing',
                    minimum: 1,
                },
                txnMaxQty: {
                    type: 'integer',
                    title: 'Max Quantity per Mint',
                    tooltip: 'Max quantity for each transaction',
                    minimum: 1,
                },
                title: {
                    type: 'string',
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
                requiredQuantity: {
                    type: 'integer',
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
        };
        const donateElements = [];
        if (isDonation) {
            dataSchema.properties["donateTo"] = {
                type: 'string',
                format: 'wallet-address'
            };
            donateElements.push({
                type: 'Control',
                scope: '#/properties/donateTo',
            });
        }
        return {
            dataSchema: dataSchema,
            uiSchema: {
                type: 'Categorization',
                elements: [
                    {
                        type: 'Category',
                        label: 'Contract',
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
                                        scope: '#/properties/chainId'
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
                                        scope: '#/properties/tokenToMint',
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
                                    {
                                        type: 'Control',
                                        scope: '#/properties/priceToMint',
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
                                    {
                                        type: 'Control',
                                        scope: '#/properties/maxQty',
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
                                    ...donateElements,
                                ]
                            }
                        ]
                    },
                    {
                        type: 'Category',
                        label: 'Branding',
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
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/requiredQuantity'
                                    }
                                ]
                            }
                        ]
                    },
                    themeUISchema
                ]
            },
            customControls() {
                return {
                    '#/properties/chainId': {
                        render: () => {
                            const networkPicker = new scom_network_picker_1.default(undefined, {
                                type: 'combobox',
                                networks
                            });
                            return networkPicker;
                        },
                        getData: (control) => {
                            return control.selectedNetwork?.chainId;
                        },
                        setData: async (control, value) => {
                            await control.ready();
                            control.setNetworkByChainId(value);
                        }
                    }
                };
            }
        };
    }
    exports.getProjectOwnerSchema = getProjectOwnerSchema;
});
define("@scom/scom-nft-minter", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-nft-minter/interface/index.tsx", "@scom/scom-nft-minter/utils/index.ts", "@scom/scom-nft-minter/store/index.ts", "@scom/scom-nft-minter/index.css.ts", "@scom/scom-nft-minter/API.ts", "@scom/scom-nft-minter/data.json.ts", "@scom/scom-commission-fee-setup", "@scom/scom-token-list", "@scom/scom-nft-minter/formSchema.json.ts"], function (require, exports, components_4, eth_wallet_4, index_3, index_4, index_5, index_css_1, API_1, data_json_1, scom_commission_fee_setup_1, scom_token_list_2, formSchema_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomNftMinter = class ScomNftMinter extends components_4.Module {
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
            this.newProductId = {};
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
                    const symbol = token?.symbol || '';
                    this.lblBalance.caption = token ? `${(0, index_4.formatNumber)(await (0, index_4.getTokenBalance)(this.rpcWallet, token))} ${symbol}` : `0 ${symbol}`;
                }
                catch { }
            };
            this.newProduct = async () => {
                const contract = this.state.getContractAddress('Proxy');
                const maxQty = this.newMaxQty;
                const txnMaxQty = this.newTxnMaxQty;
                const price = new eth_wallet_4.BigNumber(this.newPrice).toFixed();
                if (this.nftType === 'ERC1155NewIndex' && contract && this.newToken && new eth_wallet_4.BigNumber(txnMaxQty).gt(0) && new eth_wallet_4.BigNumber(maxQty).gt(0)) {
                    if (this._data.productId >= 0) {
                        this._data.nftType = 'ERC1155';
                        return true;
                    }
                    ;
                    const { address, decimals } = this.newToken;
                    const data = {
                        contract,
                        maxQty,
                        txnMaxQty,
                        price,
                        address,
                        decimals
                    };
                    const key = JSON.stringify(data);
                    if (this.newProductId[key]) {
                        this._data.productId = this.newProductId[key];
                        this._data.nftType = 'ERC1155';
                        return true;
                    }
                    const callback = (err, receipt) => {
                        if (err) {
                            this.showTxStatusModal('error', err);
                        }
                    };
                    const confirmationCallback = async (receipt) => {
                    };
                    if (!(0, index_5.isClientWalletConnected)()) {
                        if (this.mdWallet) {
                            await components_4.application.loadPackage('@scom/scom-wallet-modal', '*');
                            this.mdWallet.networks = this.networks;
                            this.mdWallet.wallets = this.wallets;
                            this.mdWallet.showModal();
                        }
                        return false;
                    }
                    if (!this.state.isRpcWalletConnected()) {
                        const clientWallet = eth_wallet_4.Wallet.getClientInstance();
                        await clientWallet.switchNetwork(this.chainId);
                    }
                    try {
                        const result = await (0, API_1.newDefaultBuyProduct)(contract, maxQty, txnMaxQty, price, address, decimals, callback, confirmationCallback);
                        this.newProductId[key] = result.productId;
                        this._data.productId = result.productId;
                        this._data.nftType = 'ERC1155';
                    }
                    catch (error) {
                        this.showTxStatusModal('error', 'Cannot create new product!');
                        console.log('newProduct', error);
                    }
                }
                return true;
            };
            this.state = new index_5.State(data_json_1.default);
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
        get newToken() {
            const token = scom_token_list_2.tokenStore.getTokenList(this.chainId).find(v => v.address === this._data.token);
            return token;
        }
        get newPrice() {
            return this._data.price;
        }
        get newMaxQty() {
            return this._data.maxQty;
        }
        get newTxnMaxQty() {
            return this._data.txnMaxQty;
        }
        get donateTo() {
            return this._data.donateTo ?? this._data.chainSpecificProperties?.[this.chainId]?.donateTo ?? '';
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
            return this._data.productType ?? index_3.ProductType.Buy;
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
        async onSetupPage() {
            if (this.nftType === 'ERC1155NewIndex') {
                this._data.productId = undefined;
                await this.newProduct();
            }
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
                            const vstack = new components_4.VStack();
                            const config = new scom_commission_fee_setup_1.default(null, {
                                commissions: self._data.commissions,
                                fee: this.state.embedderCommissionFee,
                                networks: self._data.networks
                            });
                            const hstack = new components_4.HStack(null, {
                                verticalAlignment: 'center',
                            });
                            const button = new components_4.Button(hstack, {
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
                                const { name, title, productType, logoUrl, description, link, requiredQuantity, erc1155Index, nftType, chainId, nftAddress, chainSpecificProperties, defaultChainId, token, price, maxQty, txnMaxQty, ...themeSettings } = userInputData;
                                const generalSettings = {
                                    name,
                                    title,
                                    productType,
                                    logoUrl,
                                    description,
                                    link,
                                    requiredQuantity,
                                    erc1155Index,
                                    nftType,
                                    chainId,
                                    nftAddress,
                                    chainSpecificProperties,
                                    defaultChainId,
                                    token,
                                    price,
                                    maxQty,
                                    txnMaxQty,
                                };
                                Object.assign(this._data, generalSettings);
                                await this.resetRpcWallet();
                                if (builder?.setData)
                                    builder.setData(this._data);
                                this.refreshDApp();
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
                                this.refreshDApp();
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
        getProjectOwnerActions() {
            const isDonation = this._data.productType === index_3.ProductType.DonateToOwner || this._data.productType === index_3.ProductType.DonateToEveryone;
            const formSchema = (0, formSchema_json_1.getProjectOwnerSchema)(isDonation);
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
        getConfigurators() {
            let self = this;
            return [
                {
                    name: 'Project Owner Configurator',
                    target: 'Project Owners',
                    getProxySelectors: async (chainId) => {
                        const selectors = await (0, index_4.getProxySelectors)(this.state, chainId);
                        return selectors;
                    },
                    getActions: () => {
                        return this.getProjectOwnerActions();
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        await this.setData(data);
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
                        const defaultData = data_json_1.default.defaultBuilderData;
                        await this.setData({ ...defaultData, ...data });
                    },
                    setupData: async (data) => {
                        const defaultData = data_json_1.default.defaultBuilderData;
                        this._data = { ...defaultData, ...data };
                        if (this.nftType === 'ERC1155NewIndex') {
                            this._data.productId = undefined;
                            await this.resetRpcWallet();
                            let isCreated = await this.newProduct();
                            while (!isCreated) {
                                isCreated = await this.newProduct();
                            }
                        }
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
                        const actions = this.getProjectOwnerActions();
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
            const chainChangedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_4.Constants.RpcWalletEvent.ChainChanged, async (chainId) => {
                this.onChainChanged();
            });
            const connectedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_4.Constants.RpcWalletEvent.Connected, async (connected) => {
                this.onSetupPage();
                this.updateContractAddress();
                this.refreshDApp();
            });
            this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);
            const data = {
                defaultChainId: this._data.chainId || this.defaultChainId,
                wallets: this.wallets,
                networks: this.networks,
                showHeader: this.showHeader,
                rpcWalletId: rpcWallet.instanceId
            };
            if (this.containerDapp?.setData)
                this.containerDapp.setData(data);
        }
        async setData(data) {
            this._data = data;
            await this.resetRpcWallet();
            if (!this.tokenInput.isConnected)
                await this.tokenInput.ready();
            this.tokenInput.chainId = this.state.getChainId() ?? this.defaultChainId;
            await this.onSetupPage();
            const commissionFee = this.state.embedderCommissionFee;
            if (!this.lbOrderTotalTitle.isConnected)
                await this.lbOrderTotalTitle.ready();
            this.lbOrderTotalTitle.caption = `Total`;
            this.iconOrderTotal.tooltip.content = `A commission fee of ${new eth_wallet_4.BigNumber(commissionFee).times(100)}% will be applied to the amount you input.`;
            this.updateContractAddress();
            await this.refreshDApp();
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
        async initWallet() {
            try {
                await eth_wallet_4.Wallet.getClientInstance().init();
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
        async refreshDApp() {
            setTimeout(async () => {
                this._type = this.productType;
                await this.updateDAppUI(this._data);
                if (this.nftType !== 'ERC721' && (!this.productId || this.productId === 0))
                    return;
                await this.initWallet();
                this.btnSubmit.enabled = !(0, index_5.isClientWalletConnected)() || !this.state.isRpcWalletConnected();
                // OswapTroll
                if (this.nftType === 'ERC721') {
                    this.lblTitle.caption = this._data.title;
                    if (!this.nftAddress)
                        return;
                    const oswapTroll = await (0, API_1.fetchOswapTrollNftInfo)(this.state, this.nftAddress);
                    if (!oswapTroll) {
                        this.pnlUnsupportedNetwork.visible = true;
                        this.pnlInputFields.visible = false;
                        return;
                    }
                    ;
                    const nftBalance = await (0, API_1.fetchUserNftBalance)(this.state, this.nftAddress);
                    const { price, cap, tokenAddress } = oswapTroll;
                    const token = scom_token_list_2.tokenStore.getTokenList(this.chainId).find(v => v.address === tokenAddress);
                    this.pnlInputFields.visible = true;
                    this.pnlUnsupportedNetwork.visible = false;
                    this.detailWrapper.visible = true;
                    this.onToggleDetail();
                    this.btnDetail.visible = true;
                    this.erc1155Wrapper.visible = false;
                    this.lbContract.caption = components_4.FormatUtils.truncateWalletAddress(this.nftAddress);
                    this.lbToken.caption = components_4.FormatUtils.truncateWalletAddress(tokenAddress);
                    this.lbOwn.caption = (0, index_4.formatNumber)(nftBalance || 0, 0);
                    this.pnlMintFee.visible = true;
                    this.oswapTrollInfo = { token, price };
                    this.lblMintFee.caption = `${(0, index_4.formatNumber)(price)} ${token?.symbol || ''}`;
                    this.lblSpotsRemaining.caption = (0, index_4.formatNumber)(cap, 0);
                    this.cap = cap.toNumber();
                    this.pnlQty.visible = true;
                    this.edtQty.readOnly = true;
                    this.edtQty.value = '1';
                    this.lbOrderTotal.caption = `${(0, index_4.formatNumber)(price)} ${token?.symbol || ''}`;
                    this.pnlTokenInput.visible = false;
                    this.determineBtnSubmitCaption();
                    return;
                }
                this.edtQty.readOnly = false;
                this.productInfo = await (0, API_1.getProductInfo)(this.state, this.productId);
                if (this.productInfo) {
                    const token = this.productInfo.token;
                    this.pnlInputFields.visible = true;
                    this.pnlUnsupportedNetwork.visible = false;
                    const price = eth_wallet_4.Utils.fromDecimals(this.productInfo.price, token.decimals).toFixed();
                    (!this.lblRef.isConnected) && await this.lblRef.ready();
                    if (this._type === index_3.ProductType.Buy) {
                        const nftBalance = await (0, API_1.getNFTBalance)(this.state, this.productId);
                        this.detailWrapper.visible = true;
                        this.onToggleDetail();
                        this.btnDetail.visible = true;
                        this.erc1155Wrapper.visible = true;
                        this.lbERC1155Index.caption = `${this.productId}`;
                        this.lbContract.caption = components_4.FormatUtils.truncateWalletAddress(this.contractAddress);
                        this.lbToken.caption = token.address ? components_4.FormatUtils.truncateWalletAddress(token.address) : token.symbol;
                        this.lbOwn.caption = (0, index_4.formatNumber)(nftBalance, 0);
                        this.pnlMintFee.visible = true;
                        this.lblMintFee.caption = `${price ? (0, index_4.formatNumber)(price) : ""} ${token?.symbol || ""}`;
                        this.lblTitle.caption = this._data.title;
                        this.lblRef.caption = 'smart contract:';
                        this.updateSpotsRemaining();
                        this.tokenInput.inputReadOnly = true;
                        this.pnlQty.visible = true;
                        this.pnlTokenInput.visible = false;
                        if (this._data.requiredQuantity != null) {
                            let qty = Number(this._data.requiredQuantity);
                            if (nftBalance) {
                                this.edtQty.value = Math.max(qty - Number(nftBalance), 0);
                            }
                            else {
                                this.edtQty.value = qty;
                            }
                        }
                        else {
                            this.edtQty.value = "";
                        }
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
                        this.edtQty.value = "";
                        this.lbOrderTotal.caption = "0";
                    }
                    this.tokenInput.value = "";
                    this.pnlAddress.visible = this._type !== index_3.ProductType.Buy;
                    (!this.lblAddress.isConnected) && await this.lblAddress.ready();
                    this.lblAddress.caption = this.contractAddress;
                    this.tokenInput.token = token;
                    this.updateTokenBalance();
                }
                else {
                    this.pnlInputFields.visible = false;
                    this.pnlUnsupportedNetwork.visible = true;
                }
                this.determineBtnSubmitCaption();
            });
        }
        updateSpotsRemaining() {
            if (this.productId >= 0) {
                this.lblSpotsRemaining.caption = `${(0, index_4.formatNumber)(this.productInfo.quantity, 0)}`;
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
            this.state.viewExplorerByAddress(this.chainId, this.nftType === 'ERC721' ? this.nftAddress : this.contractAddress);
        }
        onViewToken() {
            const token = this.nftType === 'ERC721' ? this.oswapTrollInfo.token : this.productInfo.token;
            this.state.viewExplorerByAddress(this.chainId, token.address || token.symbol);
        }
        onCopyContract() {
            components_4.application.copyToClipboard(this.nftType === 'ERC721' ? this.nftAddress : this.contractAddress);
        }
        onCopyToken() {
            const token = this.nftType === 'ERC721' ? this.oswapTrollInfo.token : this.productInfo.token;
            components_4.application.copyToClipboard(token.address || token.symbol);
        }
        showTxStatusModal(status, content, exMessage) {
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
        }
        async initApprovalAction() {
            if (!this.approvalModelAction) {
                this.contractAddress = this.nftType === 'ERC721' ? this.nftAddress : this.state.getContractAddress('Proxy');
                this.approvalModelAction = await this.state.setApprovalModelAction({
                    sender: this,
                    payAction: async () => {
                        await this.doSubmitAction();
                    },
                    onToBeApproved: async (token) => {
                        this.btnApprove.visible = (0, index_5.isClientWalletConnected)() && this.state.isRpcWalletConnected();
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
                        this.btnSubmit.enabled = new eth_wallet_4.BigNumber(this.tokenAmountIn).gt(0);
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
                this.state.approvalModel.spenderAddress = this.contractAddress;
            }
        }
        updateContractAddress() {
            if (this.approvalModelAction) {
                if (this.nftType === 'ERC721') {
                    this.contractAddress = this.nftAddress;
                }
                else if (!this._data.commissions || this._data.commissions.length == 0 || !this._data.commissions.find(v => v.chainId == this.chainId)) {
                    this.contractAddress = this.state.getContractAddress('ProductInfo');
                }
                else {
                    this.contractAddress = this.state.getContractAddress('Proxy');
                }
                this.state.approvalModel.spenderAddress = this.contractAddress;
            }
        }
        async selectToken(token) {
            const symbol = token?.symbol || '';
            this.lblBalance.caption = `${(0, index_4.formatNumber)(await (0, index_4.getTokenBalance)(this.rpcWallet, token))} ${symbol}`;
        }
        updateSubmitButton(submitting) {
            this.btnSubmit.rightIcon.spin = submitting;
            this.btnSubmit.rightIcon.visible = submitting;
        }
        determineBtnSubmitCaption() {
            if (!(0, index_5.isClientWalletConnected)()) {
                this.btnSubmit.caption = 'Connect Wallet';
                this.btnSubmit.enabled = true;
            }
            else if (!this.state.isRpcWalletConnected()) {
                this.btnSubmit.caption = 'Switch Network';
                this.btnSubmit.enabled = true;
            }
            else if (this.nftType === 'ERC721') {
                this.btnSubmit.caption = this.cap ? 'Mint' : 'Out of stock';
                this.btnSubmit.enabled = !!this.cap;
            }
            else if (this._type === index_3.ProductType.Buy) {
                this.btnSubmit.caption = 'Mint';
            }
            else {
                this.btnSubmit.caption = 'Submit';
            }
        }
        onApprove() {
            if (this.nftType === 'ERC721') {
                const { price, token } = this.oswapTrollInfo;
                const contractAddress = this.state.getExplorerByAddress(this.chainId, this.nftAddress);
                const tokenAddress = this.state.getExplorerByAddress(this.chainId, token.address);
                this.showTxStatusModal('warning', 'Confirming', `to contract\n${contractAddress}\nwith token\n${tokenAddress}`);
                this.approvalModelAction.doApproveAction(token, price.toFixed());
            }
            else {
                this.showTxStatusModal('warning', `Approving`);
                this.approvalModelAction.doApproveAction(this.productInfo.token, this.tokenAmountIn);
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
                const price = eth_wallet_4.Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals);
                this.tokenAmountIn = (0, API_1.getProxyTokenAmountIn)(price.toFixed(), qty, this._data.commissions);
                const amount = price.times(qty);
                this.tokenInput.value = amount.toFixed();
                const commissionFee = this.state.embedderCommissionFee;
                const total = amount.plus(amount.times(commissionFee));
                this.lbOrderTotal.caption = `${(0, index_4.formatNumber)(total)} ${this.productInfo.token?.symbol || ''}`;
            }
            if (this.productInfo && this.state.isRpcWalletConnected())
                this.approvalModelAction.checkAllowance(this.productInfo.token, this.tokenAmountIn);
        }
        async onAmountChanged() {
            let amount = Number(this.tokenInput.value);
            if (amount === 0 || !this.productInfo) {
                this.tokenAmountIn = '0';
                this.tokenInput.value = '0';
            }
            else {
                const price = eth_wallet_4.Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals);
                this.tokenAmountIn = (0, API_1.getProxyTokenAmountIn)(price.toFixed(), amount, this._data.commissions);
            }
            amount = Number(this.tokenInput.value);
            const commissionFee = this.state.embedderCommissionFee;
            const total = new eth_wallet_4.BigNumber(amount).plus(new eth_wallet_4.BigNumber(amount).times(commissionFee));
            const token = this.productInfo?.token;
            this.lbOrderTotal.caption = `${(0, index_4.formatNumber)(total)} ${token?.symbol || ''}`;
            if (token && this.state.isRpcWalletConnected())
                this.approvalModelAction.checkAllowance(token, this.tokenAmountIn);
        }
        async doSubmitAction() {
            if (!this._data || (!this.productId && this.nftType !== 'ERC721'))
                return;
            this.updateSubmitButton(true);
            if ((this._type === index_3.ProductType.DonateToOwner || this._type === index_3.ProductType.DonateToEveryone) && !this.tokenInput.token) {
                this.showTxStatusModal('error', 'Token Required');
                this.updateSubmitButton(false);
                return;
            }
            // if (this._type === ProductType.Buy && chainId !== this._data.chainId) {
            //   this.showTxStatusModal('error', 'Unsupported Network');
            //   this.updateSubmitButton(false);
            //   return;
            // }
            if (this.nftType === 'ERC721') {
                const oswapTroll = await (0, API_1.fetchOswapTrollNftInfo)(this.state, this.nftAddress);
                if (!oswapTroll || oswapTroll.cap.lte(0)) {
                    this.showTxStatusModal('error', 'Out of stock');
                    this.updateSubmitButton(false);
                    return;
                }
                const token = this.oswapTrollInfo.token;
                const balance = await (0, index_4.getTokenBalance)(this.rpcWallet, token);
                if (oswapTroll.price.gt(balance)) {
                    this.showTxStatusModal('error', `Insufficient ${token.symbol} Balance`);
                    this.updateSubmitButton(false);
                    return;
                }
                await this.mintNft();
                return;
            }
            const token = this.productInfo.token;
            const balance = await (0, index_4.getTokenBalance)(this.rpcWallet, token);
            if (this._type === index_3.ProductType.Buy) {
                if (this.edtQty.value && new eth_wallet_4.BigNumber(this.edtQty.value).gt(this.productInfo.maxQuantity)) {
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
                    const product = await (0, API_1.getProductInfo)(this.state, this.productId);
                    if (product.quantity.lt(requireQty)) {
                        this.showTxStatusModal('error', 'Out of stock');
                        this.updateSubmitButton(false);
                        return;
                    }
                }
                const maxOrderQty = new eth_wallet_4.BigNumber(this.productInfo.maxQuantity ?? 0);
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
                await this.buyToken(1);
            }
            this.updateSubmitButton(false);
            if (this.txStatusModal)
                this.txStatusModal.closeModal();
        }
        async onSubmit() {
            if (!(0, index_5.isClientWalletConnected)()) {
                if (this.mdWallet) {
                    await components_4.application.loadPackage('@scom/scom-wallet-modal', '*');
                    this.mdWallet.networks = this.networks;
                    this.mdWallet.wallets = this.wallets;
                    this.mdWallet.showModal();
                }
                return;
            }
            if (!this.state.isRpcWalletConnected()) {
                const clientWallet = eth_wallet_4.Wallet.getClientInstance();
                await clientWallet.switchNetwork(this.chainId);
                return;
            }
            if (this.nftType === 'ERC721') {
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
                const oswapTroll = await (0, API_1.fetchOswapTrollNftInfo)(this.state, this.nftAddress);
                if (oswapTroll) {
                    this.lblSpotsRemaining.caption = (0, index_4.formatNumber)(oswapTroll.cap, 0);
                    this.cap = oswapTroll.cap.toNumber();
                }
                const nftBalance = await (0, API_1.fetchUserNftBalance)(this.state, this.nftAddress);
                this.lbOwn.caption = (0, index_4.formatNumber)(nftBalance || 0, 0);
                this.updateSubmitButton(false);
            };
            (0, index_4.registerSendTxEvents)({
                transactionHash: txHashCallback,
                confirmation: confirmationCallback
            });
            await (0, API_1.mintOswapTrollNft)(this.nftAddress, txHashCallback);
        }
        async buyToken(quantity) {
            if (this.productId === undefined || this.productId === null)
                return;
            const callback = (error, receipt) => {
                if (error) {
                    this.showTxStatusModal('error', error);
                }
            };
            const token = this.productInfo.token;
            if (this.productType == index_3.ProductType.DonateToOwner || this.productType == index_3.ProductType.DonateToEveryone) {
                await (0, API_1.donate)(this.state, this.productId, this.donateTo, this.tokenInput.value, this._data.commissions, token, callback, async () => {
                    await this.updateTokenBalance();
                });
            }
            else if (this.productType == index_3.ProductType.Buy) {
                await (0, API_1.buyProduct)(this.state, this.productId, quantity, this._data.commissions, token, callback, async () => {
                    await this.updateTokenBalance();
                    this.productInfo = await (0, API_1.getProductInfo)(this.state, this.productId);
                    const nftBalance = await (0, API_1.getNFTBalance)(this.state, this.productId);
                    this.lbOwn.caption = nftBalance;
                    this.updateSpotsRemaining();
                });
            }
        }
        async init() {
            super.init();
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                const link = this.getAttribute('link', true);
                const nftType = this.getAttribute('nftType', true);
                const chainId = this.getAttribute('chainId', true);
                const nftAddress = this.getAttribute('nftAddress', true);
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
                const requiredQuantity = this.getAttribute('requiredQuantity', true);
                const token = this.getAttribute('tokenToMint', true);
                const price = this.getAttribute('priceToMint', true);
                const maxQty = this.getAttribute('maxQty', true);
                const txnMaxQty = this.getAttribute('txnMaxQty', true);
                await this.setData({
                    nftType,
                    chainId,
                    nftAddress,
                    link,
                    productType,
                    name,
                    title,
                    chainSpecificProperties,
                    defaultChainId,
                    requiredQuantity,
                    token,
                    price,
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
                                        this.$render("i-markdown", { id: 'markdownViewer', class: index_css_1.markdownStyle, width: '100%', height: '100%', margin: { bottom: '0.563rem' } })),
                                    this.$render("i-vstack", { gap: "0.5rem", id: "pnlInputFields" },
                                        this.$render("i-hstack", { id: "detailWrapper", horizontalAlignment: "space-between", gap: 10, visible: false, wrap: "wrap" },
                                            this.$render("i-hstack", { id: "erc1155Wrapper", width: "100%", justifyContent: "space-between", visible: false, gap: "0.5rem", lineHeight: 1.5 },
                                                this.$render("i-label", { caption: "ERC1155 Index", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-label", { id: "lbERC1155Index", font: { size: '1rem' } })),
                                            this.$render("i-hstack", { width: "100%", justifyContent: "space-between", gap: "0.5rem", lineHeight: 1.5 },
                                                this.$render("i-label", { caption: "Contract Address", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-hstack", { gap: "0.25rem", verticalAlignment: "center", maxWidth: "calc(100% - 75px)" },
                                                    this.$render("i-label", { id: "lbContract", font: { size: '1rem', color: Theme.colors.primary.main }, textDecoration: "underline", class: index_css_1.linkStyle, onClick: this.onViewContract }),
                                                    this.$render("i-icon", { fill: Theme.text.primary, name: "copy", width: 16, height: 16, onClick: this.onCopyContract, cursor: "pointer" }))),
                                            this.$render("i-hstack", { width: "100%", justifyContent: "space-between", gap: "0.5rem", lineHeight: 1.5 },
                                                this.$render("i-label", { caption: "Token Address", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-hstack", { gap: "0.25rem", verticalAlignment: "center", maxWidth: "calc(100% - 75px)" },
                                                    this.$render("i-label", { id: "lbToken", font: { size: '1rem', color: Theme.colors.primary.main }, textDecoration: "underline", class: index_css_1.linkStyle, onClick: this.onViewToken }),
                                                    this.$render("i-icon", { fill: Theme.text.primary, name: "copy", width: 16, height: 16, onClick: this.onCopyToken, cursor: "pointer" }))),
                                            this.$render("i-hstack", { width: "100%", justifyContent: "space-between", gap: "0.5rem", lineHeight: 1.5 },
                                                this.$render("i-label", { caption: "Remaining", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-label", { id: "lblSpotsRemaining", font: { size: '1rem' } })),
                                            this.$render("i-hstack", { width: "100%", justifyContent: "space-between", gap: "0.5rem", lineHeight: 1.5 },
                                                this.$render("i-label", { caption: "You own", font: { bold: true, size: '1rem' } }),
                                                this.$render("i-label", { id: "lbOwn", font: { size: '1rem' } }))),
                                        this.$render("i-button", { id: "btnDetail", caption: "More Information", rightIcon: { width: 10, height: 16, margin: { left: 5 }, fill: Theme.text.primary, name: 'caret-down' }, background: { color: 'transparent' }, border: { width: 1, style: 'solid', color: Theme.text.primary, radius: 8 }, width: 300, maxWidth: "100%", height: 36, margin: { top: 4, bottom: 16, left: 'auto', right: 'auto' }, onClick: this.onToggleDetail, visible: false }),
                                        this.$render("i-hstack", { id: 'pnlMintFee', width: "100%", justifyContent: "space-between", visible: false, gap: '0.5rem', lineHeight: 1.5 },
                                            this.$render("i-label", { caption: 'Price', font: { bold: true, size: '1rem' } }),
                                            this.$render("i-label", { id: 'lblMintFee', font: { size: '1rem' } })),
                                        this.$render("i-hstack", { id: 'pnlQty', width: "100%", justifyContent: "space-between", alignItems: 'center', gap: "0.5rem", lineHeight: 1.5, visible: false },
                                            this.$render("i-label", { caption: 'Quantity', font: { bold: true, size: '1rem' } }),
                                            this.$render("i-panel", { width: "50%" },
                                                this.$render("i-input", { id: 'edtQty', height: 35, width: "100%", onChanged: this.onQtyChanged.bind(this), class: index_css_1.inputStyle, inputType: 'number', font: { size: '1rem' }, border: { radius: 4, style: 'none' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' } }))),
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
                                                this.$render("i-scom-token-input", { id: "tokenInput", tokenReadOnly: true, isBtnMaxShown: false, isCommonShown: false, isBalanceShown: false, isSortBalanceShown: false, class: index_css_1.tokenSelectionStyle, padding: { left: '11px' }, font: { size: '1.25rem' }, width: "100%", height: "100%", placeholder: "0.00", modalStyles: {
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
        components_4.customModule,
        (0, components_4.customElements)('i-scom-nft-minter')
    ], ScomNftMinter);
    exports.default = ScomNftMinter;
});
