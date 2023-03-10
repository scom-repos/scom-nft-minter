var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@pageblock-nft-minter/main/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tokenSelectionStyle = exports.inputGroupStyle = exports.inputStyle = exports.markdownStyle = exports.imageStyle = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    // Styles.Theme.defaultTheme.background.modal = "#fff";
    // Styles.Theme.applyTheme(Styles.Theme.defaultTheme);
    exports.imageStyle = components_1.Styles.style({
        $nest: {
            '&>img': {
                maxWidth: 'unset',
                maxHeight: 'unset',
                borderRadius: 4
            }
        }
    });
    exports.markdownStyle = components_1.Styles.style({
        overflowWrap: 'break-word'
    });
    exports.inputStyle = components_1.Styles.style({
        $nest: {
            '> input': {
                background: 'transparent',
                border: 0,
                padding: '0.25rem 0.5rem',
                textAlign: 'right',
                color: Theme.input.fontColor
            }
        }
    });
    exports.inputGroupStyle = components_1.Styles.style({
        border: '2px solid transparent',
        background: 'linear-gradient(#232B5A, #232B5A), linear-gradient(254.8deg, #E75B66 -8.08%, #B52082 84.35%)',
        backgroundOrigin: 'border-box !important',
        backgroundClip: 'content-box, border-box !important',
        borderRadius: 16
    });
    exports.tokenSelectionStyle = components_1.Styles.style({
        $nest: {
            'i-button.token-button': {
                justifyContent: 'start'
            }
        }
    });
});
define("@pageblock-nft-minter/main/API.ts", ["require", "exports", "@ijstech/eth-wallet", "@pageblock-nft-minter/interface", "@scom/scom-product-contract", "@scom/scom-commission-proxy-contract", "@pageblock-nft-minter/store", "@pageblock-nft-minter/utils"], function (require, exports, eth_wallet_1, interface_1, scom_product_contract_1, scom_commission_proxy_contract_1, store_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.donate = exports.buyProduct = exports.getProxyTokenAmountIn = exports.newProduct = exports.getNFTBalance = exports.getProductInfo = void 0;
    async function getProductInfo(productId) {
        let productInfoAddress = store_1.getContractAddress('ProductInfo');
        const wallet = eth_wallet_1.Wallet.getInstance();
        const productInfo = new scom_product_contract_1.Contracts.ProductInfo(wallet, productInfoAddress);
        const product = await productInfo.products(productId);
        return product;
    }
    exports.getProductInfo = getProductInfo;
    async function getNFTBalance(productId) {
        let productInfoAddress = store_1.getContractAddress('ProductInfo');
        const wallet = eth_wallet_1.Wallet.getInstance();
        const productInfo = new scom_product_contract_1.Contracts.ProductInfo(wallet, productInfoAddress);
        const nftAddress = await productInfo.nft();
        const product1155 = new scom_product_contract_1.Contracts.Product1155(wallet, nftAddress);
        const nftBalance = await product1155.balanceOf({
            account: wallet.address,
            id: productId
        });
        return nftBalance;
    }
    exports.getNFTBalance = getNFTBalance;
    async function newProduct(productType, qty, maxQty, price, maxPrice, token, callback, confirmationCallback) {
        let productInfoAddress = store_1.getContractAddress('ProductInfo');
        const wallet = eth_wallet_1.Wallet.getInstance();
        const productInfo = new scom_product_contract_1.Contracts.ProductInfo(wallet, productInfoAddress);
        utils_1.registerSendTxEvents({
            transactionHash: callback,
            confirmation: confirmationCallback
        });
        const tokenDecimals = (token === null || token === void 0 ? void 0 : token.decimals) || 18;
        let productTypeCode;
        switch (productType) {
            case interface_1.ProductType.Buy:
                productTypeCode = 0;
                break;
            case interface_1.ProductType.DonateToOwner:
                productTypeCode = 1;
                break;
            case interface_1.ProductType.DonateToEveryone:
                productTypeCode = 2;
                break;
        }
        let receipt = await productInfo.newProduct({
            productType: productTypeCode,
            uri: '',
            quantity: qty,
            maxQuantity: maxQty,
            maxPrice: eth_wallet_1.Utils.toDecimals(maxPrice, tokenDecimals),
            price: eth_wallet_1.Utils.toDecimals(price, tokenDecimals),
            token: (token === null || token === void 0 ? void 0 : token.address) || ""
        });
        let productId;
        if (receipt) {
            let event = productInfo.parseNewProductEvent(receipt)[0];
            productId = event === null || event === void 0 ? void 0 : event.productId.toNumber();
        }
        return {
            receipt,
            productId
        };
    }
    exports.newProduct = newProduct;
    function getProxyTokenAmountIn(productPrice, quantity, commissions) {
        const amount = new eth_wallet_1.BigNumber(productPrice).isZero() ? new eth_wallet_1.BigNumber(quantity) : new eth_wallet_1.BigNumber(productPrice).times(quantity);
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
    async function buyProduct(productId, quantity, amountIn, commissions, token, callback, confirmationCallback) {
        let proxyAddress = store_1.getContractAddress('Proxy');
        let productInfoAddress = store_1.getContractAddress('ProductInfo');
        const wallet = eth_wallet_1.Wallet.getInstance();
        const proxy = new scom_commission_proxy_contract_1.Contracts.Proxy(wallet, proxyAddress);
        const productInfo = new scom_product_contract_1.Contracts.ProductInfo(wallet, productInfoAddress);
        const product = await productInfo.products(productId);
        const amount = product.price.times(quantity);
        const _commissions = (commissions || []).map(v => {
            return {
                to: v.walletAddress,
                amount: amount.times(v.share)
            };
        });
        const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)) : new eth_wallet_1.BigNumber(0);
        let receipt;
        try {
            if (token === null || token === void 0 ? void 0 : token.address) {
                utils_1.registerSendTxEvents({
                    transactionHash: callback,
                    confirmation: confirmationCallback
                });
                if (commissionsAmount.isZero) {
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
                utils_1.registerSendTxEvents({
                    transactionHash: callback,
                    confirmation: confirmationCallback
                });
                if (commissionsAmount.isZero) {
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
    async function donate(productId, donateTo, amountIn, commissions, token, callback, confirmationCallback) {
        let proxyAddress = store_1.getContractAddress('Proxy');
        let productInfoAddress = store_1.getContractAddress('ProductInfo');
        const wallet = eth_wallet_1.Wallet.getInstance();
        const proxy = new scom_commission_proxy_contract_1.Contracts.Proxy(wallet, proxyAddress);
        const productInfo = new scom_product_contract_1.Contracts.ProductInfo(wallet, productInfoAddress);
        const tokenDecimals = (token === null || token === void 0 ? void 0 : token.decimals) || 18;
        const amount = eth_wallet_1.Utils.toDecimals(amountIn, tokenDecimals);
        const _commissions = (commissions || []).map(v => {
            return {
                to: v.walletAddress,
                amount: amount.times(v.share)
            };
        });
        const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)) : new eth_wallet_1.BigNumber(0);
        let receipt;
        try {
            if (token === null || token === void 0 ? void 0 : token.address) {
                utils_1.registerSendTxEvents({
                    transactionHash: callback,
                    confirmation: confirmationCallback
                });
                if (commissionsAmount.isZero) {
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
                utils_1.registerSendTxEvents({
                    transactionHash: callback,
                    confirmation: confirmationCallback
                });
                if (commissionsAmount.isZero) {
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
});
define("@pageblock-nft-minter/main", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@pageblock-nft-minter/interface", "@pageblock-nft-minter/utils", "@pageblock-nft-minter/store", "@pageblock-nft-minter/wallet", "@pageblock-nft-minter/main/index.css.ts", "@pageblock-nft-minter/main/API.ts"], function (require, exports, components_2, eth_wallet_2, interface_2, utils_2, store_2, wallet_1, index_css_1, API_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    let Main = class Main extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this._oldData = {};
            this._data = {};
            this.isApproving = false;
            this.oldTag = {};
            this.tag = {};
            this.defaultEdit = true;
            this.onWalletConnect = async (connected) => {
                let chainId = wallet_1.getChainId();
                if (connected && !chainId) {
                    this.onSetupPage(true);
                }
                else {
                    this.onSetupPage(connected);
                }
                if (connected) {
                    await this.updateTokenBalance();
                }
            };
            this.onChainChanged = async () => {
                this.onSetupPage(true);
                await this.updateTokenBalance();
            };
            this.updateTokenBalance = async () => {
                if (!this._data.token)
                    return;
                try {
                    let chainId = wallet_1.getChainId();
                    const _tokenList = store_2.getTokenList(chainId);
                    const token = _tokenList.find(t => { var _a, _b; return (t.address && t.address == ((_a = this._data.token) === null || _a === void 0 ? void 0 : _a.address)) || (t.symbol == ((_b = this._data.token) === null || _b === void 0 ? void 0 : _b.symbol)); });
                    const symbol = (token === null || token === void 0 ? void 0 : token.symbol) || '';
                    this.lblBalance.caption = token ? `${(await utils_2.getTokenBalance(token)).toFixed(2)} ${symbol}` : `0 ${symbol}`;
                }
                catch (_a) { }
            };
            this.newProduct = async (callback, confirmationCallback) => {
                if (this._data.productId >= 0)
                    return;
                const result = await API_1.newProduct(this._data.productType, this._data.qty, this._data.maxOrderQty, this._data.price, this._data.maxPrice, this._data.token, callback, confirmationCallback);
                this._productId = this._data.productId = result.productId;
            };
            this.updateSpotsRemaining = async () => {
                var _a, _b, _c;
                if (this._data.productId >= 0) {
                    const product = await API_1.getProductInfo(this._data.productId);
                    this.lblSpotsRemaining.caption = `${product.quantity.toFixed()}/${(_a = this._data.qty) !== null && _a !== void 0 ? _a : 0}`;
                }
                else {
                    this.lblSpotsRemaining.caption = `${(_b = this._data.qty) !== null && _b !== void 0 ? _b : 0}/${(_c = this._data.qty) !== null && _c !== void 0 ? _c : 0}`;
                }
            };
            this.buyToken = async (quantity) => {
                if (this._data.productId === undefined || this._data.productId === null)
                    return;
                const callback = (error, receipt) => {
                    if (error) {
                        this.mdAlert.message = {
                            status: 'error',
                            content: error.message
                        };
                        this.mdAlert.showModal();
                    }
                };
                if (this._data.productType == interface_2.ProductType.DonateToOwner || this._data.productType == interface_2.ProductType.DonateToEveryone) {
                    await API_1.donate(this._data.productId, this._data.donateTo, this.edtAmount.value, this._data.commissions, this._data.token, callback, async () => {
                        await this.updateTokenBalance();
                    });
                }
                else if (this._data.productType == interface_2.ProductType.Buy) {
                    await API_1.buyProduct(this._data.productId, quantity, '0', this._data.commissions, this._data.token, callback, async () => {
                        await this.updateTokenBalance();
                        await this.updateSpotsRemaining();
                    });
                }
            };
            if (options) {
                store_2.setDataFromSCConfig(options);
            }
            this.$eventBus = components_2.application.EventBus;
            this.registerEvent();
        }
        registerEvent() {
            this.$eventBus.register(this, "isWalletConnected" /* IsWalletConnected */, () => this.onWalletConnect(true));
            this.$eventBus.register(this, "IsWalletDisconnected" /* IsWalletDisconnected */, () => this.onWalletConnect(false));
            this.$eventBus.register(this, "chainChanged" /* chainChanged */, this.onChainChanged);
        }
        async onSetupPage(isWalletConnected) {
            if (isWalletConnected) {
                await this.initApprovalAction();
            }
        }
        getActions() {
            const actions = [
                {
                    name: 'Settings',
                    icon: 'cog',
                    command: (builder, userInputData) => {
                        return {
                            execute: async () => {
                                this._oldData = Object.assign({}, this._data);
                                if (userInputData.name != undefined)
                                    this._data.name = userInputData.name;
                                if (userInputData.productType != undefined)
                                    this._data.productType = userInputData.productType;
                                if (userInputData.productId != undefined)
                                    this._data.productId = userInputData.productId;
                                if (userInputData.donateTo != undefined)
                                    this._data.donateTo = userInputData.donateTo;
                                if (userInputData.logo != undefined)
                                    this._data.logo = userInputData.logo;
                                if (userInputData.description != undefined)
                                    this._data.description = userInputData.description;
                                if (userInputData.link != undefined)
                                    this._data.link = userInputData.link;
                                if (userInputData.chainId != undefined)
                                    this._data.chainId = userInputData.chainId;
                                if (userInputData.price != undefined)
                                    this._data.price = userInputData.price;
                                if (userInputData.maxPrice != undefined)
                                    this._data.maxPrice = userInputData.maxPrice;
                                if (userInputData.maxOrderQty != undefined)
                                    this._data.maxOrderQty = userInputData.maxOrderQty;
                                if (userInputData.qty != undefined)
                                    this._data.qty = userInputData.qty;
                                if (userInputData.token != undefined)
                                    this._data.token = userInputData.token;
                                this._productId = this._data.productId;
                                this.configDApp.data = this._data;
                                this.refreshDApp();
                                await this.newProduct((error, receipt) => {
                                    if (error) {
                                        this.mdAlert.message = {
                                            status: 'error',
                                            content: error.message
                                        };
                                        this.mdAlert.showModal();
                                    }
                                }, this.updateSpotsRemaining);
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this._data);
                            },
                            undo: () => {
                                this._data = Object.assign({}, this._oldData);
                                this._productId = this._data.productId;
                                this.configDApp.data = this._data;
                                this.refreshDApp();
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this._data);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: {
                        type: 'object',
                        properties: {
                            // "name": {
                            //   type: 'string'
                            // },
                            // "productType": {
                            //   type: 'string'
                            // },
                            "donateTo": {
                                type: 'string',
                                default: eth_wallet_2.Wallet.getClientInstance().address,
                                format: "wallet-address"
                            },
                            // "productId": {
                            //   type: 'number'
                            // },
                            "logo": {
                                type: 'string',
                                format: 'data-url'
                            },
                            "description": {
                                type: 'string',
                                format: 'multi'
                            },
                            "link": {
                                type: 'string'
                            },
                            // "chainId": {
                            //   type: 'number'
                            // },
                            // "token": {
                            //   type: 'object'
                            // },
                            // "price": {
                            //   type: 'string'
                            // },
                            // "maxPrice": {
                            //   type: 'string'
                            // },
                            // "maxOrderQty": {
                            //   type: 'number'
                            // },
                            // "qty": {
                            //   type: 'number'
                            // }
                        }
                    }
                },
                {
                    name: 'Theme Settings',
                    icon: 'palette',
                    command: (builder, userInputData) => {
                        return {
                            execute: async () => {
                                if (!userInputData)
                                    return;
                                this.oldTag = Object.assign({}, this.tag);
                                if (builder)
                                    builder.setTag(userInputData);
                                // this.setTag(userInputData);
                            },
                            undo: () => {
                                if (!userInputData)
                                    return;
                                this.tag = Object.assign({}, this.oldTag);
                                if (builder)
                                    builder.setTag(this.tag);
                                // this.setTag(this.oldTag);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: {
                        type: 'object',
                        properties: {
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
                        }
                    }
                }
            ];
            return actions;
        }
        getData() {
            return this._data;
        }
        async setData(data) {
            this._data = data;
            this._productId = data.productId;
            this.configDApp.data = data;
            if (this.approvalModelAction) {
                let contractAddress;
                if (!this._data.commissions || this._data.commissions.length == 0) {
                    contractAddress = store_2.getContractAddress('ProductInfo');
                }
                else {
                    contractAddress = store_2.getContractAddress('Proxy');
                }
                this.approvalModelAction.setSpenderAddress(contractAddress);
            }
            this.refreshDApp();
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            const newValue = value || {};
            for (let prop in newValue) {
                if (newValue.hasOwnProperty(prop))
                    this.tag[prop] = newValue[prop];
            }
            this.updateTheme();
        }
        updateStyle(name, value) {
            value ?
                this.style.setProperty(name, value) :
                this.style.removeProperty(name);
        }
        updateTheme() {
            var _a, _b, _c, _d, _e;
            this.updateStyle('--text-primary', (_a = this.tag) === null || _a === void 0 ? void 0 : _a.fontColor);
            this.updateStyle('--background-main', (_b = this.tag) === null || _b === void 0 ? void 0 : _b.backgroundColor);
            this.updateStyle('--input-font_color', (_c = this.tag) === null || _c === void 0 ? void 0 : _c.inputFontColor);
            this.updateStyle('--input-background', (_d = this.tag) === null || _d === void 0 ? void 0 : _d.inputBackgroundColor);
            this.updateStyle('--colors-primary-main', (_e = this.tag) === null || _e === void 0 ? void 0 : _e.buttonBackgroundColor);
        }
        async edit() {
            this.gridDApp.visible = false;
            this.configDApp.visible = true;
        }
        async preview() {
            this.gridDApp.visible = true;
            this.configDApp.visible = false;
            this._data = this.configDApp.data;
            this._data.chainId = this._data.token ? wallet_1.getChainId() : undefined;
            this._data.productId = this._productId;
            this._data.maxPrice = this._data.maxPrice || '0';
            this.refreshDApp();
        }
        async confirm() {
            return new Promise(async (resolve, reject) => {
                await this.preview();
                await this.newProduct((error, receipt) => {
                    if (error) {
                        this.mdAlert.message = {
                            status: 'error',
                            content: error.message
                        };
                        this.mdAlert.showModal();
                        reject(error);
                    }
                }, this.updateSpotsRemaining);
                if (!this._productId) {
                    reject(new Error('productId missing'));
                }
                resolve();
            });
        }
        async discard() {
            this.gridDApp.visible = true;
            this.configDApp.visible = false;
        }
        async config() { }
        validate() {
            const data = this.configDApp.data;
            if (!data ||
                !data.token ||
                !data.name ||
                data.maxOrderQty === undefined ||
                data.maxOrderQty === null ||
                data.price === undefined ||
                data.price === null ||
                data.qty === undefined ||
                data.qty === null) {
                this.mdAlert.message = {
                    status: 'error',
                    content: 'Required field is missing.'
                };
                this.mdAlert.showModal();
                return false;
            }
            return true;
        }
        async refreshDApp() {
            var _a, _b, _c;
            this._type = this._data.productType;
            if ((_a = this._data.logo) === null || _a === void 0 ? void 0 : _a.startsWith('ipfs://')) {
                const ipfsGatewayUrl = store_2.getIPFSGatewayUrl();
                this.imgLogo.url = this._data.logo.replace('ipfs://', ipfsGatewayUrl);
            }
            else {
                this.imgLogo.url = this._data.logo;
            }
            this.markdownViewer.load(this._data.description || '');
            this.pnlLink.visible = !!this._data.link;
            this.lblLink.caption = this._data.link || '';
            this.lblLink.link.href = this._data.link;
            if (this._type === interface_2.ProductType.Buy) {
                this.lblTitle.caption = `Mint Fee: ${(_b = this._data.price) !== null && _b !== void 0 ? _b : ""} ${((_c = this._data.token) === null || _c === void 0 ? void 0 : _c.symbol) || ""}`;
                this.btnSubmit.caption = 'Mint';
                this.lblRef.caption = 'smart contract:';
                if (this._data.chainId !== null && this._data.chainId !== undefined) {
                    this.lblBlockchain.caption = store_2.getNetworkName(this._data.chainId) || this._data.chainId.toString();
                }
                else {
                    this.lblBlockchain.caption = "";
                }
                await this.updateSpotsRemaining();
                this.gridTokenInput.visible = false;
            }
            else {
                this.lblTitle.caption = new eth_wallet_2.BigNumber(this._data.price).isZero() ? 'Make a Contributon' : '';
                this.btnSubmit.caption = 'Submit';
                this.lblRef.caption = new eth_wallet_2.BigNumber(this._data.price).isZero() ? 'All proceeds will go to following vetted wallet address:' : '';
                this.gridTokenInput.visible = true;
            }
            this.edtQty.value = "";
            this.edtAmount.value = "";
            this.pnlSpotsRemaining.visible = new eth_wallet_2.BigNumber(this._data.price).gt(0);
            this.pnlBlockchain.visible = new eth_wallet_2.BigNumber(this._data.price).gt(0);
            this.pnlQty.visible = new eth_wallet_2.BigNumber(this._data.price).gt(0) && this._data.maxOrderQty > 1;
            this.lblAddress.caption = store_2.getContractAddress('ProductInfo');
            // this.tokenSelection.readonly = this._data.token ? true : new BigNumber(this._data.price).gt(0);
            this.tokenSelection.chainId = this._data.chainId;
            this.tokenSelection.token = this._data.token;
            this.updateTokenBalance();
            // this.lblBalance.caption = (await getTokenBalance(this._data.token)).toFixed(2);
        }
        async init() {
            super.init();
            await this.initWalletData();
            await this.onSetupPage(wallet_1.isWalletConnected());
            if (!this.tag || (typeof this.tag === 'object' && !Object.keys(this.tag).length)) {
                const defaultTag = {
                    inputFontColor: '#ffffff',
                    inputBackgroundColor: 'linear-gradient(#232B5A, #232B5A), linear-gradient(254.8deg, #E75B66 -8.08%, #B52082 84.35%)',
                    fontColor: '#323232',
                    backgroundColor: '#DBDBDB'
                };
                this.setTag(defaultTag);
                const toolbar = this.parentElement.closest('ide-toolbar');
                if (toolbar)
                    toolbar.setTag(defaultTag);
                const element = this.parentElement.closest('sc-page-viewer-page-element');
                if (element) {
                    element.style.setProperty('--text-primary', defaultTag.fontColor);
                    element.style.setProperty('--background-main', defaultTag.backgroundColor);
                    element.style.setProperty('--input-font_color', defaultTag.inputFontColor);
                    element.style.setProperty('--input-background', defaultTag.inputBackgroundColor);
                }
            }
        }
        async initWalletData() {
            const selectedProvider = localStorage.getItem('walletProvider');
            const isValidProvider = Object.values(eth_wallet_2.WalletPlugin).includes(selectedProvider);
            if (wallet_1.hasWallet() && isValidProvider) {
                await wallet_1.connectWallet(selectedProvider);
            }
        }
        async initApprovalAction() {
            if (!this.approvalModelAction) {
                const proxyAddress = store_2.getContractAddress('Proxy');
                this.approvalModelAction = utils_2.getERC20ApprovalModelAction(proxyAddress, {
                    sender: this,
                    payAction: async () => {
                        await this.doSubmitAction();
                    },
                    onToBeApproved: async (token) => {
                        this.btnApprove.visible = true;
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
                        this.isApproving = false;
                        this.btnSubmit.enabled = new eth_wallet_2.BigNumber(this.tokenAmountIn).gt(0);
                    },
                    onApproving: async (token, receipt) => {
                        this.isApproving = true;
                        this.btnApprove.rightIcon.spin = true;
                        this.btnApprove.rightIcon.visible = true;
                        this.btnApprove.caption = `Approving ${token.symbol}`;
                        this.btnSubmit.visible = false;
                        if (receipt) {
                            this.mdAlert.message = {
                                status: 'success',
                                content: receipt
                            };
                            this.mdAlert.showModal();
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
                        this.mdAlert.message = {
                            status: 'error',
                            content: err.message
                        };
                        this.mdAlert.showModal();
                        this.btnApprove.caption = 'Approve';
                        this.btnApprove.rightIcon.visible = false;
                    },
                    onPaying: async (receipt) => {
                        if (receipt) {
                            this.mdAlert.message = {
                                status: 'success',
                                content: receipt
                            };
                            this.mdAlert.showModal();
                            this.btnSubmit.enabled = false;
                            this.btnSubmit.rightIcon.visible = true;
                        }
                    },
                    onPaid: async (receipt) => {
                        this.btnSubmit.rightIcon.visible = false;
                    },
                    onPayingError: async (err) => {
                        this.mdAlert.message = {
                            status: 'error',
                            content: err.message
                        };
                        this.mdAlert.showModal();
                    }
                });
            }
        }
        async selectToken(token) {
            const symbol = (token === null || token === void 0 ? void 0 : token.symbol) || '';
            this.lblBalance.caption = `${(await utils_2.getTokenBalance(token)).toFixed(2)} ${symbol}`;
        }
        updateSubmitButton(submitting) {
            this.btnSubmit.rightIcon.spin = submitting;
            this.btnSubmit.rightIcon.visible = submitting;
        }
        onApprove() {
            this.mdAlert.message = {
                status: 'warning',
                content: 'Approving'
            };
            this.mdAlert.showModal();
            this.approvalModelAction.doApproveAction(this._data.token, this.tokenAmountIn);
        }
        async onQtyChanged() {
            const qty = Number(this.edtQty.value);
            if (qty === 0) {
                this.tokenAmountIn = '0';
            }
            else {
                this.tokenAmountIn = API_1.getProxyTokenAmountIn(this._data.price, qty, this._data.commissions);
            }
            this.approvalModelAction.checkAllowance(this._data.token, this.tokenAmountIn);
        }
        async onAmountChanged() {
            const amount = Number(this.edtAmount.value);
            if (amount === 0) {
                this.tokenAmountIn = '0';
            }
            else {
                this.tokenAmountIn = API_1.getProxyTokenAmountIn(this._data.price, amount, this._data.commissions);
            }
            this.approvalModelAction.checkAllowance(this._data.token, this.tokenAmountIn);
        }
        async doSubmitAction() {
            var _a;
            if (!this._data || !this._productId)
                return;
            this.updateSubmitButton(true);
            const chainId = wallet_1.getChainId();
            if ((this._type === interface_2.ProductType.DonateToOwner || this._type === interface_2.ProductType.DonateToEveryone) && !this.tokenSelection.token) {
                this.mdAlert.message = {
                    status: 'error',
                    content: 'Token Required'
                };
                this.mdAlert.showModal();
                this.updateSubmitButton(false);
                return;
            }
            if (this._type === interface_2.ProductType.Buy && chainId !== this._data.chainId) {
                this.mdAlert.message = {
                    status: 'error',
                    content: 'Unsupported Network'
                };
                this.mdAlert.showModal();
                this.updateSubmitButton(false);
                return;
            }
            const balance = await utils_2.getTokenBalance(this._type === interface_2.ProductType.Buy ? this._data.token : this.tokenSelection.token);
            if (this._type === interface_2.ProductType.Buy) {
                if (this.edtQty.value && Number(this.edtQty.value) > this._data.maxOrderQty) {
                    this.mdAlert.message = {
                        status: 'error',
                        content: 'Quantity Greater Than Max Quantity'
                    };
                    this.mdAlert.showModal();
                    this.updateSubmitButton(false);
                    return;
                }
                if (this._data.maxOrderQty > 1 && (!this.edtQty.value || !Number.isInteger(Number(this.edtQty.value)))) {
                    this.mdAlert.message = {
                        status: 'error',
                        content: 'Invalid Quantity'
                    };
                    this.mdAlert.showModal();
                    this.updateSubmitButton(false);
                    return;
                }
                const requireQty = this._data.maxOrderQty > 1 && this.edtQty.value ? Number(this.edtQty.value) : 1;
                if (this._data.productId >= 0) {
                    const product = await API_1.getProductInfo(this._data.productId);
                    if (product.quantity.lt(requireQty)) {
                        this.mdAlert.message = {
                            status: 'error',
                            content: 'Out of stock'
                        };
                        this.mdAlert.showModal();
                        this.updateSubmitButton(false);
                        return;
                    }
                }
                const maxOrderQty = new eth_wallet_2.BigNumber((_a = this._data.maxOrderQty) !== null && _a !== void 0 ? _a : 0);
                if (maxOrderQty.minus(requireQty).lt(0)) {
                    this.mdAlert.message = {
                        status: 'error',
                        content: 'Over Maximum Order Quantity'
                    };
                    this.mdAlert.showModal();
                    this.updateSubmitButton(false);
                    return;
                }
                const amount = new eth_wallet_2.BigNumber(this._data.price).times(requireQty);
                if (balance.lt(amount)) {
                    this.mdAlert.message = {
                        status: 'error',
                        content: `Insufficient ${this.tokenSelection.token.symbol} Balance`
                    };
                    this.mdAlert.showModal();
                    this.updateSubmitButton(false);
                    return;
                }
                await this.buyToken(requireQty);
            }
            else {
                if (!this.edtAmount.value) {
                    this.mdAlert.message = {
                        status: 'error',
                        content: 'Amount Required'
                    };
                    this.mdAlert.showModal();
                    this.updateSubmitButton(false);
                    return;
                }
                if (balance.lt(this.edtAmount.value)) {
                    this.mdAlert.message = {
                        status: 'error',
                        content: `Insufficient ${this.tokenSelection.token.symbol} Balance`
                    };
                    this.mdAlert.showModal();
                    this.updateSubmitButton(false);
                    return;
                }
                await this.buyToken(1);
            }
            this.updateSubmitButton(false);
        }
        async onSubmit() {
            this.mdAlert.message = {
                status: 'warning',
                content: 'Confirming'
            };
            this.mdAlert.showModal();
            this.approvalModelAction.doPayAction();
        }
        render() {
            return (this.$render("i-panel", { background: { color: Theme.background.main } },
                this.$render("i-grid-layout", { id: 'gridDApp', width: '100%', height: '100%', templateColumns: ['repeat(2, 1fr)'], padding: { bottom: '1.563rem' } },
                    this.$render("i-vstack", { padding: { top: '0.5rem', bottom: '0.5rem', left: '5.25rem', right: '5.25rem' } },
                        this.$render("i-hstack", { margin: { bottom: '1.25rem' } },
                            this.$render("i-image", { id: 'imgLogo', class: index_css_1.imageStyle, height: 100 })),
                        this.$render("i-markdown", { id: 'markdownViewer', class: index_css_1.markdownStyle, width: '100%', height: '100%', margin: { bottom: '0.563rem' } }),
                        this.$render("i-hstack", { id: 'pnlLink', visible: false, verticalAlignment: 'center', gap: '0.25rem' },
                            this.$render("i-label", { caption: 'Details here: ', font: { size: '1rem' } }),
                            this.$render("i-label", { id: 'lblLink', font: { size: '1rem' } }))),
                    this.$render("i-vstack", { gap: "0.5rem", padding: { top: '1.75rem', bottom: '0.5rem', left: '0.5rem', right: '5.25rem' }, verticalAlignment: 'space-between' },
                        this.$render("i-vstack", { class: "text-center", margin: { bottom: '0.25rem' } },
                            this.$render("i-label", { id: 'lblTitle', font: { bold: true, size: '1.5rem' } }),
                            this.$render("i-label", { caption: "I don't have a digital wallet", link: { href: 'https://metamask.io/' }, opacity: 0.6, font: { size: '1rem' } })),
                        this.$render("i-hstack", { id: 'pnlSpotsRemaining', visible: false, gap: '0.25rem' },
                            this.$render("i-label", { caption: 'Spots Remaining:', font: { bold: true, size: '0.875rem' } }),
                            this.$render("i-label", { id: 'lblSpotsRemaining', font: { size: '0.875rem' } })),
                        this.$render("i-hstack", { id: 'pnlBlockchain', visible: false, gap: '0.25rem' },
                            this.$render("i-label", { caption: 'Blockchain:', font: { bold: true, size: '0.875rem' } }),
                            this.$render("i-label", { id: 'lblBlockchain', font: { size: '0.875rem' } })),
                        this.$render("i-vstack", { gap: '0.5rem' },
                            this.$render("i-vstack", { gap: '0.25rem' },
                                this.$render("i-hstack", { id: 'pnlQty', visible: false, horizontalAlignment: 'end', verticalAlignment: 'center', gap: "0.5rem" },
                                    this.$render("i-label", { caption: 'Qty', font: { size: '0.875rem' } }),
                                    this.$render("i-input", { id: 'edtQty', onChanged: this.onQtyChanged.bind(this), class: index_css_1.inputStyle, inputType: 'number', font: { size: '0.875rem' }, border: { radius: 4 } })),
                                this.$render("i-hstack", { horizontalAlignment: 'space-between', verticalAlignment: 'center', gap: "0.5rem" },
                                    this.$render("i-label", { caption: "Your donation", font: { weight: 500, size: '1rem' } }),
                                    this.$render("i-hstack", { horizontalAlignment: 'end', verticalAlignment: 'center', gap: "0.5rem", opacity: 0.6 },
                                        this.$render("i-label", { caption: 'Balance:', font: { size: '1rem' } }),
                                        this.$render("i-label", { id: 'lblBalance', font: { size: '1rem' } }))),
                                this.$render("i-grid-layout", { id: 'gridTokenInput', templateColumns: ['60%', 'auto'], overflow: "hidden", background: { color: Theme.input.background }, font: { color: Theme.input.fontColor }, height: 56, verticalAlignment: "center", class: index_css_1.inputGroupStyle },
                                    this.$render("nft-minter-token-selection", { id: 'tokenSelection', class: index_css_1.tokenSelectionStyle, background: { color: 'transparent' }, width: "100%", readonly: true, onSelectToken: this.selectToken.bind(this) }),
                                    this.$render("i-input", { id: "edtAmount", width: '100%', height: '100%', minHeight: 40, class: index_css_1.inputStyle, inputType: 'number', font: { size: '1.25rem' }, opacity: 0.3, onChanged: this.onAmountChanged.bind(this) })),
                                this.$render("i-vstack", { horizontalAlignment: "center", verticalAlignment: 'center', gap: "8px", margin: { top: '0.75rem' } },
                                    this.$render("i-button", { id: "btnApprove", width: '100%', caption: "Approve", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText, bold: true }, rightIcon: { visible: false, fill: Theme.colors.primary.contrastText }, border: { radius: 12 }, visible: false, onClick: this.onApprove.bind(this) }),
                                    this.$render("i-button", { id: 'btnSubmit', width: '100%', caption: 'Submit', padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText, bold: true }, rightIcon: { visible: false, fill: Theme.colors.primary.contrastText }, background: { color: Theme.background.gradient }, border: { radius: 12 }, onClick: this.onSubmit.bind(this), enabled: false }))),
                            this.$render("i-vstack", { gap: '0.25rem', margin: { top: '1rem' } },
                                this.$render("i-label", { id: 'lblRef', font: { size: '0.875rem' }, opacity: 0.5 }),
                                this.$render("i-label", { id: 'lblAddress', font: { size: '0.875rem' }, overflowWrap: 'anywhere' })),
                            this.$render("i-label", { caption: 'Terms & Condition', font: { size: '0.875rem' }, link: { href: 'https://docs.scom.dev/' }, opacity: 0.6, margin: { top: '1rem' } })))),
                this.$render("nft-minter-config", { id: 'configDApp', visible: false }),
                this.$render("nft-minter-alert", { id: 'mdAlert' })));
        }
    };
    Main = __decorate([
        components_2.customModule
    ], Main);
    exports.default = Main;
});
