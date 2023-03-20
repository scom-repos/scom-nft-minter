var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    exports.ProductType = void 0;
    var ProductType;
    (function (ProductType) {
        ProductType["Buy"] = "Buy";
        ProductType["DonateToOwner"] = "DonateToOwner";
        ProductType["DonateToEveryone"] = "DonateToEveryone";
    })(ProductType = exports.ProductType || (exports.ProductType = {}));
    ;
});
define("@scom/scom-nft-minter/utils/token.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerSendTxEvents = exports.getTokenBalance = exports.getERC20Amount = void 0;
    const getERC20Amount = async (wallet, tokenAddress, decimals) => {
        try {
            let erc20 = new eth_wallet_1.Erc20(wallet, tokenAddress, decimals);
            return await erc20.balance;
        }
        catch (_a) {
            return new eth_wallet_1.BigNumber(0);
        }
    };
    exports.getERC20Amount = getERC20Amount;
    const getTokenBalance = async (token) => {
        const wallet = eth_wallet_1.Wallet.getInstance();
        let balance = new eth_wallet_1.BigNumber(0);
        if (!token)
            return balance;
        if (token.address) {
            balance = await exports.getERC20Amount(wallet, token.address, token.decimals);
        }
        else {
            balance = await wallet.balance;
        }
        return balance;
    };
    exports.getTokenBalance = getTokenBalance;
    const registerSendTxEvents = (sendTxEventHandlers) => {
        const wallet = eth_wallet_1.Wallet.getClientInstance();
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
define("@scom/scom-nft-minter/utils/approvalModel.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-nft-minter/utils/token.ts"], function (require, exports, eth_wallet_2, token_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getERC20ApprovalModelAction = exports.getERC20Allowance = exports.ApprovalStatus = void 0;
    class ERC20ApprovalModel {
        constructor(options) {
            this.options = {
                sender: null,
                spenderAddress: '',
                payAction: async () => { },
                onToBeApproved: async (token) => { },
                onToBePaid: async (token) => { },
                onApproving: async (token, receipt, data) => { },
                onApproved: async (token, data) => { },
                onPaying: async (receipt, data) => { },
                onPaid: async (data) => { },
                onApprovingError: async (token, err) => { },
                onPayingError: async (err) => { }
            };
            this.setSpenderAddress = (value) => {
                this.options.spenderAddress = value;
            };
            this.checkAllowance = async (token, inputAmount) => {
                let allowance = await exports.getERC20Allowance(token, this.options.spenderAddress);
                if (!allowance) {
                    await this.options.onToBePaid.bind(this.options.sender)(token);
                }
                else if (new eth_wallet_2.BigNumber(inputAmount).gt(allowance)) {
                    await this.options.onToBeApproved.bind(this.options.sender)(token);
                }
                else {
                    await this.options.onToBePaid.bind(this.options.sender)(token);
                }
            };
            this.doApproveAction = async (token, inputAmount, data) => {
                const txHashCallback = async (err, receipt) => {
                    if (err) {
                        await this.options.onApprovingError.bind(this.options.sender)(token, err);
                    }
                    else {
                        await this.options.onApproving.bind(this.options.sender)(token, receipt, data);
                    }
                };
                const confirmationCallback = async (receipt) => {
                    await this.options.onApproved.bind(this.options.sender)(token, data);
                    await this.checkAllowance(token, inputAmount);
                };
                approveERC20Max(token, this.options.spenderAddress, txHashCallback, confirmationCallback);
            };
            this.doPayAction = async (data) => {
                const txHashCallback = async (err, receipt) => {
                    if (err) {
                        await this.options.onPayingError.bind(this.options.sender)(err);
                    }
                    else {
                        await this.options.onPaying.bind(this.options.sender)(receipt, data);
                    }
                };
                const confirmationCallback = async (receipt) => {
                    await this.options.onPaid.bind(this.options.sender)(data);
                };
                token_1.registerSendTxEvents({
                    transactionHash: txHashCallback,
                    confirmation: confirmationCallback
                });
                await this.options.payAction.bind(this.options.sender)();
            };
            this.getAction = () => {
                return {
                    setSpenderAddress: this.setSpenderAddress,
                    doApproveAction: this.doApproveAction,
                    doPayAction: this.doPayAction,
                    checkAllowance: this.checkAllowance
                };
            };
            this.options = options;
        }
    }
    var ApprovalStatus;
    (function (ApprovalStatus) {
        ApprovalStatus[ApprovalStatus["TO_BE_APPROVED"] = 0] = "TO_BE_APPROVED";
        ApprovalStatus[ApprovalStatus["APPROVING"] = 1] = "APPROVING";
        ApprovalStatus[ApprovalStatus["NONE"] = 2] = "NONE";
    })(ApprovalStatus = exports.ApprovalStatus || (exports.ApprovalStatus = {}));
    const approveERC20Max = async (token, spenderAddress, callback, confirmationCallback) => {
        let wallet = eth_wallet_2.Wallet.getInstance();
        let amount = new eth_wallet_2.BigNumber(2).pow(256).minus(1);
        let erc20 = new eth_wallet_2.Contracts.ERC20(wallet, token.address);
        token_1.registerSendTxEvents({
            transactionHash: callback,
            confirmation: confirmationCallback
        });
        let receipt = await erc20.approve({
            spender: spenderAddress,
            amount
        });
        return receipt;
    };
    const getERC20Allowance = async (token, spenderAddress) => {
        if (!token || !token.address)
            return null;
        let wallet = eth_wallet_2.Wallet.getInstance();
        let erc20 = new eth_wallet_2.Contracts.ERC20(wallet, token.address);
        let allowance = await erc20.allowance({
            owner: wallet.address,
            spender: spenderAddress
        });
        return allowance;
    };
    exports.getERC20Allowance = getERC20Allowance;
    const getERC20ApprovalModelAction = (spenderAddress, options) => {
        const approvalOptions = Object.assign(Object.assign({}, options), { spenderAddress });
        const approvalModel = new ERC20ApprovalModel(approvalOptions);
        const approvalModelAction = approvalModel.getAction();
        return approvalModelAction;
    };
    exports.getERC20ApprovalModelAction = getERC20ApprovalModelAction;
});
define("@scom/scom-nft-minter/utils/index.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-nft-minter/utils/token.ts", "@scom/scom-nft-minter/utils/approvalModel.ts"], function (require, exports, eth_wallet_3, token_2, approvalModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getERC20ApprovalModelAction = exports.getERC20Allowance = exports.ApprovalStatus = exports.registerSendTxEvents = exports.getTokenBalance = exports.getERC20Amount = exports.formatNumberWithSeparators = exports.formatNumber = void 0;
    const formatNumber = (value, decimals) => {
        let val = value;
        const minValue = '0.0000001';
        if (typeof value === 'string') {
            val = new eth_wallet_3.BigNumber(value).toNumber();
        }
        else if (typeof value === 'object') {
            val = value.toNumber();
        }
        if (val != 0 && new eth_wallet_3.BigNumber(val).lt(minValue)) {
            return `<${minValue}`;
        }
        return exports.formatNumberWithSeparators(val, decimals || 4);
    };
    exports.formatNumber = formatNumber;
    const formatNumberWithSeparators = (value, precision) => {
        if (!value)
            value = 0;
        if (precision) {
            let outputStr = '';
            if (value >= 1) {
                outputStr = value.toLocaleString('en-US', { maximumFractionDigits: precision });
            }
            else {
                outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
            }
            if (outputStr.length > 18) {
                outputStr = outputStr.substr(0, 18) + '...';
            }
            return outputStr;
        }
        else {
            return value.toLocaleString('en-US');
        }
    };
    exports.formatNumberWithSeparators = formatNumberWithSeparators;
    Object.defineProperty(exports, "getERC20Amount", { enumerable: true, get: function () { return token_2.getERC20Amount; } });
    Object.defineProperty(exports, "getTokenBalance", { enumerable: true, get: function () { return token_2.getTokenBalance; } });
    Object.defineProperty(exports, "registerSendTxEvents", { enumerable: true, get: function () { return token_2.registerSendTxEvents; } });
    Object.defineProperty(exports, "ApprovalStatus", { enumerable: true, get: function () { return approvalModel_1.ApprovalStatus; } });
    Object.defineProperty(exports, "getERC20Allowance", { enumerable: true, get: function () { return approvalModel_1.getERC20Allowance; } });
    Object.defineProperty(exports, "getERC20ApprovalModelAction", { enumerable: true, get: function () { return approvalModel_1.getERC20ApprovalModelAction; } });
});
define("@scom/scom-nft-minter/store/tokens/mainnet/avalanche.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Avalanche = void 0;
    ///<amd-module name='@scom/scom-nft-minter/store/tokens/mainnet/avalanche.ts'/> 
    exports.Tokens_Avalanche = [
        {
            "address": "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
            "name": "Wrapped AVAX",
            "symbol": "WAVAX",
            "decimals": 18,
            "isCommon": true,
            "isWETH": true
        },
        {
            "name": "OpenSwap",
            "symbol": "OSWAP",
            "address": "0xb32aC3C79A94aC1eb258f3C830bBDbc676483c93",
            "decimals": 18,
            "isCommon": true
        },
        { "address": "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664", "name": "USD Coin", "symbol": "USDC.e", "decimals": 6, "isCommon": true },
        {
            "address": "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
            "name": "Wrapped Ether",
            "symbol": "WETH.e",
            "decimals": 18,
            "isCommon": true
        },
        { "address": "0xc7198437980c041c805A1EDcbA50c1Ce5db95118", "name": "Tether USD", "symbol": "USDT.e", "decimals": 6, "isCommon": true },
        { "address": "0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5", "name": "BENQI", "symbol": "QI", "decimals": 18 },
        { "address": "0x60781C2586D68229fde47564546784ab3fACA982", "name": "Pangolin", "symbol": "PNG", "decimals": 18 },
        {
            "address": "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
            "name": "Dai Stablecoin",
            "symbol": "DAI.e",
            "decimals": 18,
            "isCommon": true
        },
        { "address": "0xd1c3f94DE7e5B45fa4eDBBA472491a9f4B166FC4", "name": "Avalaunch", "symbol": "XAVA", "decimals": 18 },
        { "address": "0x130966628846BFd36ff31a822705796e8cb8C18D", "name": "Magic Internet Money", "symbol": "MIM", "decimals": 18 },
        { "address": "0x50b7545627a5162F82A992c33b87aDc75187B218", "name": "Wrapped BTC", "symbol": "WBTC.e", "decimals": 8 },
        { "address": "0x5947BB275c521040051D82396192181b413227A3", "name": "Chainlink Token", "symbol": "LINK.e", "decimals": 18 },
        { "address": "0xD24C2Ad096400B6FBcd2ad8B24E7acBc21A1da64", "name": "Frax", "symbol": "FRAX", "decimals": 18 },
        { "address": "0x4f60a160D8C2DDdaAfe16FCC57566dB84D674BD6", "name": "Jewels", "symbol": "JEWEL", "decimals": 18 },
        { "address": "0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7", "name": "Yak Token", "symbol": "YAK", "decimals": 18 },
        { "address": "0x214DB107654fF987AD859F34125307783fC8e387", "name": "Frax Share", "symbol": "FXS", "decimals": 18 },
        { "address": "0x1C20E891Bab6b1727d14Da358FAe2984Ed9B59EB", "name": "TrueUSD", "symbol": "TUSD", "decimals": 18 },
        { "address": "0xCE1bFFBD5374Dac86a2893119683F4911a2F7814", "name": "Spell Token", "symbol": "SPELL", "decimals": 18 },
        { "address": "0xe896CDeaAC9615145c0cA09C8Cd5C25bced6384c", "name": "PenguinToken", "symbol": "PEFI", "decimals": 18 },
        { "address": "0x346A59146b9b4a77100D369a3d18E8007A9F46a6", "name": "AVAI", "symbol": "AVAI", "decimals": 18 },
        { "address": "0x321E7092a180BB43555132ec53AaA65a5bF84251", "name": "Governance OHM", "symbol": "gOHM", "decimals": 18 },
        { "address": "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd", "name": "JoeToken", "symbol": "JOE", "decimals": 18 },
        { "address": "0xdef1fac7Bf08f173D286BbBDcBeeADe695129840", "name": "Cerby Token", "symbol": "CERBY", "decimals": 18 },
        { "address": "0x63682bDC5f875e9bF69E201550658492C9763F89", "name": "Betswap.gg", "symbol": "BSGG", "decimals": 18 },
        { "address": "0x57319d41F71E81F3c65F2a47CA4e001EbAFd4F33", "name": "JoeBar", "symbol": "xJOE", "decimals": 18 },
        { "address": "0xe0Ce60AF0850bF54072635e66E79Df17082A1109", "name": "Ice Token", "symbol": "ICE", "decimals": 18 },
        { "address": "0x3Ee97d514BBef95a2f110e6B9b73824719030f7a", "name": "Staked Spell Token", "symbol": "sSPELL", "decimals": 18 },
        { "address": "0xCDEB5641dC5BF05845317B00643A713CCC3b22e6", "name": "Huobi", "symbol": "HT", "decimals": 18 },
        { "address": "0xA56B1b9f4e5A1A1e0868F5Fd4352ce7CdF0C2A4F", "name": "Matic", "symbol": "MATIC", "decimals": 18 },
        { "address": "0xF873633DF9D5cDd62BB1f402499CC470a72A02D7", "name": "MoonRiver", "symbol": "MOVR", "decimals": 18 },
        { "address": "0xA384Bc7Cdc0A93e686da9E7B8C0807cD040F4E0b", "name": "WOWSwap", "symbol": "WOW", "decimals": 18 },
        { "address": "0x0da67235dD5787D67955420C84ca1cEcd4E5Bb3b", "name": "Wrapped Memo", "symbol": "wMEMO", "decimals": 18 },
        { "address": "0xb54f16fB19478766A268F172C9480f8da1a7c9C3", "name": "Time", "symbol": "TIME", "decimals": 18 },
        { "address": "0x37B608519F91f70F2EeB0e5Ed9AF4061722e4F76", "name": "SushiToken", "symbol": "SUSHI", "decimals": 18 },
        { "address": "0x63a72806098Bd3D9520cC43356dD78afe5D386D9", "name": "Aave Token", "symbol": "AAVE", "decimals": 18 }
    ];
});
define("@scom/scom-nft-minter/store/tokens/mainnet/ethereum.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Ethereuem = void 0;
    ///<amd-module name='@scom/scom-nft-minter/store/tokens/mainnet/ethereum.ts'/> 
    exports.Tokens_Ethereuem = [
        {
            "address": "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
            "name": "Aave",
            "symbol": "AAVE",
            "decimals": 18
        },
        {
            "address": "0xfF20817765cB7f73d4bde2e66e067E58D11095C2",
            "name": "Amp",
            "symbol": "AMP",
            "decimals": 18
        },
        {
            "name": "Aragon Network Token",
            "address": "0x960b236A07cf122663c4303350609A66A7B288C0",
            "symbol": "ANT",
            "decimals": 18
        },
        {
            "name": "Balancer",
            "address": "0xba100000625a3754423978a60c9317c58a424e3D",
            "symbol": "BAL",
            "decimals": 18
        },
        {
            "address": "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55",
            "name": "Band Protocol",
            "symbol": "BAND",
            "decimals": 18
        },
        {
            "name": "Bancor Network Token",
            "address": "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
            "symbol": "BNT",
            "decimals": 18
        },
        {
            "name": "Compound",
            "address": "0xc00e94Cb662C3520282E6f5717214004A7f26888",
            "symbol": "COMP",
            "decimals": 18
        },
        {
            "name": "Curve DAO Token",
            "address": "0xD533a949740bb3306d119CC777fa900bA034cd52",
            "symbol": "CRV",
            "decimals": 18
        },
        {
            "address": "0x41e5560054824eA6B0732E656E3Ad64E20e94E45",
            "name": "Civic",
            "symbol": "CVC",
            "decimals": 8
        },
        {
            "name": "Dai Stablecoin",
            "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            "symbol": "DAI",
            "decimals": 18,
            "isCommon": true
        },
        {
            "address": "0x0AbdAce70D3790235af448C88547603b945604ea",
            "name": "district0x",
            "symbol": "DNT",
            "decimals": 18
        },
        {
            "name": "Gnosis Token",
            "address": "0x6810e776880C02933D47DB1b9fc05908e5386b96",
            "symbol": "GNO",
            "decimals": 18
        },
        {
            "address": "0xc944E90C64B2c07662A292be6244BDf05Cda44a7",
            "name": "The Graph",
            "symbol": "GRT",
            "decimals": 18
        },
        {
            "address": "0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC",
            "name": "Keep Network",
            "symbol": "KEEP",
            "decimals": 18
        },
        {
            "name": "Kyber Network Crystal",
            "address": "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
            "symbol": "KNC",
            "decimals": 18
        },
        {
            "name": "ChainLink Token",
            "address": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
            "symbol": "LINK",
            "decimals": 18
        },
        {
            "name": "Loom Network",
            "address": "0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0",
            "symbol": "LOOM",
            "decimals": 18
        },
        {
            "name": "LoopringCoin V2",
            "address": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
            "symbol": "LRC",
            "decimals": 18
        },
        {
            "address": "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
            "name": "Decentraland",
            "symbol": "MANA",
            "decimals": 18
        },
        {
            "name": "Maker",
            "address": "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
            "symbol": "MKR",
            "decimals": 18
        },
        {
            "address": "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892",
            "name": "Melon",
            "symbol": "MLN",
            "decimals": 18
        },
        {
            "name": "Numeraire",
            "address": "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671",
            "symbol": "NMR",
            "decimals": 18
        },
        {
            "address": "0x4fE83213D56308330EC302a8BD641f1d0113A4Cc",
            "name": "NuCypher",
            "symbol": "NU",
            "decimals": 18
        },
        {
            "name": "Orchid",
            "address": "0x4575f41308EC1483f3d399aa9a2826d74Da13Deb",
            "symbol": "OXT",
            "decimals": 18
        },
        {
            "name": "Republic Token",
            "address": "0x408e41876cCCDC0F92210600ef50372656052a38",
            "symbol": "REN",
            "decimals": 18
        },
        {
            "name": "Reputation Augur v1",
            "address": "0x1985365e9f78359a9B6AD760e32412f4a445E862",
            "symbol": "REP",
            "decimals": 18
        },
        {
            "name": "Reputation Augur v2",
            "address": "0x221657776846890989a759BA2973e427DfF5C9bB",
            "symbol": "REPv2",
            "decimals": 18
        },
        {
            "name": "Synthetix Network Token",
            "address": "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
            "symbol": "SNX",
            "decimals": 18
        },
        {
            "name": "Storj Token",
            "address": "0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC",
            "symbol": "STORJ",
            "decimals": 8
        },
        {
            "address": "0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa",
            "name": "tBTC",
            "symbol": "TBTC",
            "decimals": 18
        },
        {
            "name": "UMA Voting Token v1",
            "address": "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
            "symbol": "UMA",
            "decimals": 18
        },
        {
            "name": "Uniswap",
            "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
            "symbol": "UNI",
            "decimals": 18
        },
        {
            "name": "USDCoin",
            "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            "symbol": "USDC",
            "decimals": 6,
            "isCommon": true
        },
        {
            "name": "Tether USD",
            "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            "symbol": "USDT",
            "decimals": 6,
            "isCommon": true
        },
        {
            "name": "Wrapped BTC",
            "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
            "symbol": "WBTC",
            "decimals": 8,
            "isCommon": true
        },
        {
            "address": "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
            "name": "yearn finance",
            "symbol": "YFI",
            "decimals": 18
        },
        {
            "name": "0x Protocol Token",
            "address": "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
            "symbol": "ZRX",
            "decimals": 18
        },
        {
            "name": "openANX Token",
            "address": "0x701C244b988a513c945973dEFA05de933b23Fe1D",
            "symbol": "OAX",
            "decimals": 18
        },
        {
            "name": "Wrapped Ether",
            "symbol": "WETH",
            "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            "decimals": 18,
            "isCommon": true,
            "isWETH": true
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/mainnet/polygon.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Polygon = void 0;
    ///<amd-module name='@scom/scom-nft-minter/store/tokens/mainnet/polygon.ts'/> 
    exports.Tokens_Polygon = [
        {
            "address": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
            "name": "Wrapped Matic",
            "symbol": "WMATIC",
            "decimals": 18,
            "isCommon": true,
            "isWETH": true
        },
        { "address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", "name": "Wrapped Ether", "symbol": "WETH", "decimals": 18 },
        { "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", "name": "USD Coin (PoS)", "symbol": "USDC", "decimals": 6, "isCommon": true },
        { "address": "0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683", "name": "SAND", "symbol": "SAND", "decimals": 18 },
        { "address": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", "name": "(PoS) Tether USD", "symbol": "USDT", "decimals": 6 },
        { "address": "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", "name": "(PoS) Wrapped BTC", "symbol": "WBTC", "decimals": 8 },
        { "address": "0xa3Fa99A148fA48D14Ed51d610c367C61876997F1", "name": "miMATIC", "symbol": "miMATIC", "decimals": 18 },
        {
            "address": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
            "name": "(PoS) Dai Stablecoin",
            "symbol": "DAI",
            "decimals": 18,
            "isCommon": true
        },
        { "address": "0x831753DD7087CaC61aB5644b308642cc1c33Dc13", "name": "Quickswap", "symbol": "QUICK", "decimals": 18 },
        { "address": "0xdF7837DE1F2Fa4631D716CF2502f8b230F1dcc32", "name": "Telcoin (PoS)", "symbol": "TEL", "decimals": 2 },
        { "address": "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7", "name": "Aavegotchi GHST Token (PoS)", "symbol": "GHST", "decimals": 18 },
        { "address": "0x580A84C73811E1839F75d86d75d88cCa0c241fF4", "name": "Qi Dao", "symbol": "QI", "decimals": 18 },
        { "address": "0xE5417Af564e4bFDA1c483642db72007871397896", "name": "Gains Network", "symbol": "GNS", "decimals": 18 },
        { "address": "0xD6DF932A45C0f255f85145f286eA0b292B21C90B", "name": "Aave (PoS)", "symbol": "AAVE", "decimals": 18, "isCommon": true },
        { "address": "0xc6C855AD634dCDAd23e64DA71Ba85b8C51E5aD7c", "name": "Decentral Games ICE", "symbol": "ICE", "decimals": 18 },
        { "address": "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39", "name": "ChainLink Token", "symbol": "LINK", "decimals": 18 },
        { "address": "0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b", "name": "Avalanche Token", "symbol": "AVAX", "decimals": 18 },
        { "address": "0xB85517b87BF64942adf3A0B9E4c71E4Bc5Caa4e5", "name": "Fantom Token", "symbol": "FTM", "decimals": 18 },
        { "address": "0x229b1b6C23ff8953D663C4cBB519717e323a0a84", "name": "BLOK", "symbol": "BLOK", "decimals": 18 }
    ];
});
define("@scom/scom-nft-minter/store/tokens/mainnet/bsc.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_BSC = void 0;
    ///<amd-module name='@scom/scom-nft-minter/store/tokens/mainnet/bsc.ts'/> 
    exports.Tokens_BSC = [
        {
            "name": "OpenSwap",
            "symbol": "OSWAP",
            "address": "0xb32aC3C79A94aC1eb258f3C830bBDbc676483c93",
            "decimals": 18,
            "isCommon": true
        },
        {
            "name": "PancakeSwap Token",
            "symbol": "CAKE",
            "address": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
            "decimals": 18
        },
        {
            "name": "Cardano Token",
            "symbol": "ADA",
            "address": "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",
            "decimals": 18
        },
        {
            "name": "AdEx Network",
            "symbol": "ADX",
            "address": "0x6bfF4Fb161347ad7de4A625AE5aa3A1CA7077819",
            "decimals": 18
        },
        {
            "name": "My Neigbor Alice",
            "symbol": "ALICE",
            "address": "0xAC51066d7bEC65Dc4589368da368b212745d63E8",
            "decimals": 6
        },
        {
            "name": "AlpaToken",
            "symbol": "ALPA",
            "address": "0xc5E6689C9c8B02be7C49912Ef19e79cF24977f03",
            "decimals": 18
        },
        {
            "name": "Alpaca",
            "symbol": "ALPACA",
            "address": "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F",
            "decimals": 18
        },
        {
            "name": "AlphaToken",
            "symbol": "ALPHA",
            "address": "0xa1faa113cbE53436Df28FF0aEe54275c13B40975",
            "decimals": 18
        },
        {
            "name": "Ampleforth",
            "symbol": "AMPL",
            "address": "0xDB021b1B247fe2F1fa57e0A87C748Cc1E321F07F",
            "decimals": 9
        },
        {
            "name": "Ankr",
            "symbol": "ANKR",
            "address": "0xf307910A4c7bbc79691fD374889b36d8531B08e3",
            "decimals": 18
        },
        {
            "name": "anyMTLX",
            "symbol": "anyMTLX",
            "address": "0x5921DEE8556c4593EeFCFad3CA5e2f618606483b",
            "decimals": 18
        },
        {
            "name": "APYSwap",
            "symbol": "APYS",
            "address": "0x37dfACfaeDA801437Ff648A1559d73f4C40aAcb7",
            "decimals": 18
        },
        {
            "name": "ARPA",
            "symbol": "ARPA",
            "address": "0x6F769E65c14Ebd1f68817F5f1DcDb61Cfa2D6f7e",
            "decimals": 18
        },
        {
            "name": "ARIVA",
            "symbol": "ARV",
            "address": "0x6679eB24F59dFe111864AEc72B443d1Da666B360",
            "decimals": 8
        },
        {
            "name": "AS Roma",
            "symbol": "ASR",
            "address": "0x80D5f92C2c8C682070C95495313dDB680B267320",
            "decimals": 2
        },
        {
            "name": "Automata",
            "symbol": "ATA",
            "address": "0xA2120b9e674d3fC3875f415A7DF52e382F141225",
            "decimals": 18
        },
        {
            "name": "Atletico de Madrid",
            "symbol": "ATM",
            "address": "0x25E9d05365c867E59C1904E7463Af9F312296f9E",
            "decimals": 2
        },
        {
            "name": "Cosmos Token",
            "symbol": "ATOM",
            "address": "0x0Eb3a705fc54725037CC9e008bDede697f62F335",
            "decimals": 18
        },
        {
            "name": "AUTOv2",
            "symbol": "AUTO",
            "address": "0xa184088a740c695E156F91f5cC086a06bb78b827",
            "decimals": 18
        },
        {
            "name": "Axie Infinity Shard",
            "symbol": "AXS",
            "address": "0x715D400F88C167884bbCc41C5FeA407ed4D2f8A0",
            "decimals": 18
        },
        {
            "name": "BabyCake",
            "symbol": "BABYCAKE",
            "address": "0xdB8D30b74bf098aF214e862C90E647bbB1fcC58c",
            "decimals": 18
        },
        {
            "name": "Bakery Token",
            "symbol": "BAKE",
            "address": "0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5",
            "decimals": 18
        },
        {
            "name": "AllianceBlock",
            "symbol": "bALBT",
            "address": "0x72fAa679E1008Ad8382959FF48E392042A8b06f7",
            "decimals": 18
        },
        {
            "name": "BAND Protocol Token",
            "symbol": "BAND",
            "address": "0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18",
            "decimals": 18
        },
        {
            "name": "Basic Attention Token",
            "symbol": "BAT",
            "address": "0x101d82428437127bF1608F699CD651e6Abf9766E",
            "decimals": 18
        },
        {
            "name": "bBADGER",
            "symbol": "bBADGER",
            "address": "0x1F7216fdB338247512Ec99715587bb97BBf96eae",
            "decimals": 18
        },
        {
            "name": "Conflux",
            "symbol": "bCFX",
            "address": "0x045c4324039dA91c52C55DF5D785385Aab073DcF",
            "decimals": 18
        },
        {
            "name": "Bitcoin Cash Token",
            "symbol": "BCH",
            "address": "0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf",
            "decimals": 18
        },
        {
            "name": "bDIGG",
            "symbol": "bDIGG",
            "address": "0x5986D5c77c65e5801a5cAa4fAE80089f870A71dA",
            "decimals": 18
        },
        {
            "name": "bDollar",
            "symbol": "BDO",
            "address": "0x190b589cf9Fb8DDEabBFeae36a813FFb2A702454",
            "decimals": 18
        },
        {
            "name": "Bella Protocol",
            "symbol": "BEL",
            "address": "0x8443f091997f06a61670B735ED92734F5628692F",
            "decimals": 18
        },
        {
            "name": "Belt",
            "symbol": "BELT",
            "address": "0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f",
            "decimals": 18
        },
        {
            "name": "Beta Finance",
            "symbol": "BETA",
            "address": "0xBe1a001FE942f96Eea22bA08783140B9Dcc09D28",
            "decimals": 18
        },
        {
            "name": "Beacon ETH",
            "symbol": "BETH",
            "address": "0x250632378E573c6Be1AC2f97Fcdf00515d0Aa91B",
            "decimals": 18
        },
        {
            "name": "b.earnfi",
            "symbol": "BFI",
            "address": "0x81859801b01764D4f0Fa5E64729f5a6C3b91435b",
            "decimals": 18
        },
        {
            "name": "Beefy.finance",
            "symbol": "BIFI",
            "address": "0xCa3F508B8e4Dd382eE878A314789373D80A5190A",
            "decimals": 18
        },
        {
            "name": "BLINk",
            "symbol": "BLK",
            "address": "0x63870A18B6e42b01Ef1Ad8A2302ef50B7132054F",
            "decimals": 6
        },
        {
            "name": "Binamon",
            "symbol": "BMON",
            "address": "0x08ba0619b1e7A582E0BCe5BBE9843322C954C340",
            "decimals": 18
        },
        {
            "name": "Multiplier",
            "symbol": "bMXX",
            "address": "0x4131b87F74415190425ccD873048C708F8005823",
            "decimals": 18
        },
        {
            "name": "Bondly",
            "symbol": "BONDLY",
            "address": "0x5D0158A5c3ddF47d4Ea4517d8DB0D76aA2e87563",
            "decimals": 18
        },
        {
            "name": "OPEN Governance Token",
            "symbol": "bOPEN",
            "address": "0xF35262a9d427F96d2437379eF090db986eaE5d42",
            "decimals": 18
        },
        {
            "name": "BoringDAO",
            "symbol": "BORING",
            "address": "0xffEecbf8D7267757c2dc3d13D730E97E15BfdF7F",
            "decimals": 18
        },
        {
            "name": "BunnyPark",
            "symbol": "BP",
            "address": "0xACB8f52DC63BB752a51186D1c55868ADbFfEe9C1",
            "decimals": 18
        },
        {
            "name": "ROOBEE",
            "symbol": "bROOBEE",
            "address": "0xE64F5Cb844946C1F102Bd25bBD87a5aB4aE89Fbe",
            "decimals": 18
        },
        {
            "name": "Berry",
            "symbol": "BRY",
            "address": "0xf859Bf77cBe8699013d6Dbc7C2b926Aaf307F830",
            "decimals": 18
        },
        {
            "name": "BSC Ecosystem Defi blue chips",
            "symbol": "BSCDEFI",
            "address": "0x40E46dE174dfB776BB89E04dF1C47d8a66855EB3",
            "decimals": 18
        },
        {
            "name": "BSCPad",
            "symbol": "BSCPAD",
            "address": "0x5A3010d4d8D3B5fB49f8B6E57FB9E48063f16700",
            "decimals": 18
        },
        {
            "name": "BSCEX",
            "symbol": "BSCX",
            "address": "0x5Ac52EE5b2a633895292Ff6d8A89bB9190451587",
            "decimals": 18
        },
        {
            "name": "Binance Pegged Bitcoin",
            "symbol": "BTCB",
            "address": "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
            "decimals": 18
        },
        {
            "name": "Standard BTC Hashrate Token",
            "symbol": "BTCST",
            "address": "0x78650B139471520656b9E7aA7A5e9276814a38e9",
            "decimals": 17
        },
        {
            "name": "Bittrue",
            "symbol": "BTR",
            "address": "0x5a16E8cE8cA316407c6E6307095dc9540a8D62B3",
            "decimals": 18
        },
        {
            "name": "Bittorrent",
            "symbol": "BTT",
            "address": "0x8595F9dA7b868b1822194fAEd312235E43007b49",
            "decimals": 18
        },
        {
            "name": "Bunny Token",
            "symbol": "BUNNY",
            "address": "0xC9849E6fdB743d08fAeE3E34dd2D1bc69EA11a51",
            "decimals": 18
        },
        {
            "name": "Burger Swap",
            "symbol": "BURGER",
            "address": "0xAe9269f27437f0fcBC232d39Ec814844a51d6b8f",
            "decimals": 18
        },
        {
            "name": "Binance Pegged BUSD",
            "symbol": "BUSD",
            "address": "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
            "decimals": 18,
            "isCommon": true
        },
        {
            "name": "BUX",
            "symbol": "BUX",
            "address": "0x211FfbE424b90e25a15531ca322adF1559779E45",
            "decimals": 18
        },
        {
            "name": "Coin98",
            "symbol": "C98",
            "address": "0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6",
            "decimals": 18
        },
        {
            "name": "CanYaCoin",
            "symbol": "CAN",
            "address": "0x007EA5C0Ea75a8DF45D288a4debdD5bb633F9e56",
            "decimals": 18
        },
        {
            "name": "CryptoArt.ai",
            "symbol": "CART",
            "address": "0x5C8C8D560048F34E5f7f8ad71f2f81a89DBd273e",
            "decimals": 18
        },
        {
            "name": "ChainGuardians",
            "symbol": "CGG",
            "address": "0x1613957159E9B0ac6c80e824F7Eea748a32a0AE2",
            "decimals": 18
        },
        {
            "name": "Tranchess",
            "symbol": "CHESS",
            "address": "0x20de22029ab63cf9A7Cf5fEB2b737Ca1eE4c82A6",
            "decimals": 18
        },
        {
            "name": "Chromia",
            "symbol": "CHR",
            "address": "0xf9CeC8d50f6c8ad3Fb6dcCEC577e05aA32B224FE",
            "decimals": 6
        },
        {
            "name": "Compound Finance",
            "symbol": "COMP",
            "address": "0x52CE071Bd9b1C4B00A0b92D298c512478CaD67e8",
            "decimals": 18
        },
        {
            "name": "Contentos",
            "symbol": "COS",
            "address": "0x96Dd399F9c3AFda1F194182F71600F1B65946501",
            "decimals": 18
        },
        {
            "name": "Cream",
            "symbol": "CREAM",
            "address": "0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888",
            "decimals": 18
        },
        {
            "name": "CertiK Token",
            "symbol": "CTK",
            "address": "0xA8c2B8eec3d368C0253ad3dae65a5F2BBB89c929",
            "decimals": 6
        },
        {
            "name": "Concentrated Voting Power",
            "symbol": "CVP",
            "address": "0x5Ec3AdBDae549Dce842e24480Eb2434769e22B2E",
            "decimals": 18
        },
        {
            "name": "Cyclone",
            "symbol": "CYC",
            "address": "0x810EE35443639348aDbbC467b33310d2AB43c168",
            "decimals": 18
        },
        {
            "name": "Binance Pegged DAI",
            "symbol": "DAI",
            "address": "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
            "decimals": 18,
            "isCommon": true
        },
        {
            "name": "Dego.Finance",
            "symbol": "DEGO",
            "address": "0x3FdA9383A84C05eC8f7630Fe10AdF1fAC13241CC",
            "decimals": 18
        },
        {
            "name": "Deri",
            "symbol": "DERI",
            "address": "0xe60eaf5A997DFAe83739e035b005A33AfdCc6df5",
            "decimals": 18
        },
        {
            "name": "DeXe",
            "symbol": "DEXE",
            "address": "0x039cB485212f996A9DBb85A9a75d898F94d38dA6",
            "decimals": 18
        },
        {
            "name": "DefiDollar DAO",
            "symbol": "DFD",
            "address": "0x9899a98b222fCb2f3dbee7dF45d943093a4ff9ff",
            "decimals": 18
        },
        {
            "name": "DFuture",
            "symbol": "DFT",
            "address": "0x42712dF5009c20fee340B245b510c0395896cF6e",
            "decimals": 18
        },
        {
            "name": "Decentral Games",
            "symbol": "DG",
            "address": "0x9Fdc3ae5c814b79dcA2556564047C5e7e5449C19",
            "decimals": 18
        },
        {
            "name": "Ditto",
            "symbol": "DITTO",
            "address": "0x233d91A0713155003fc4DcE0AFa871b508B3B715",
            "decimals": 9
        },
        {
            "name": "Dodo",
            "symbol": "DODO",
            "address": "0x67ee3Cb086F8a16f34beE3ca72FAD36F7Db929e2",
            "decimals": 18
        },
        {
            "name": "Dogecoin",
            "symbol": "DOGE",
            "address": "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
            "decimals": 8
        },
        {
            "name": "Dopple Finance",
            "symbol": "DOP",
            "address": "0x844FA82f1E54824655470970F7004Dd90546bB28",
            "decimals": 18
        },
        {
            "name": "Polkadot Token",
            "symbol": "DOT",
            "address": "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402",
            "decimals": 18
        },
        {
            "name": "Dusk",
            "symbol": "DUSK",
            "address": "0xB2BD0749DBE21f623d9BABa856D3B0f0e1BFEc9C",
            "decimals": 18
        },
        {
            "name": "Dvision Network",
            "symbol": "DVI",
            "address": "0x758FB037A375F17c7e195CC634D77dA4F554255B",
            "decimals": 18
        },
        {
            "name": "Elrond",
            "symbol": "EGLD",
            "address": "0xbF7c81FFF98BbE61B40Ed186e4AfD6DDd01337fe",
            "decimals": 18
        },
        {
            "name": "EOS Token",
            "symbol": "EOS",
            "address": "0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6",
            "decimals": 18
        },
        {
            "name": "Ellipsis",
            "symbol": "EPS",
            "address": "0xA7f552078dcC247C2684336020c03648500C6d9F",
            "decimals": 18
        },
        {
            "name": "Binance Pegged ETH",
            "symbol": "ETH",
            "address": "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
            "decimals": 18
        },
        {
            "name": "Easy V2",
            "symbol": "EZ",
            "address": "0x5512014efa6Cd57764Fa743756F7a6Ce3358cC83",
            "decimals": 18
        },
        {
            "name": "Filecoin",
            "symbol": "FIL",
            "address": "0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153",
            "decimals": 18
        },
        {
            "name": "Refinable",
            "symbol": "FINE",
            "address": "0x4e6415a5727ea08aAE4580057187923aeC331227",
            "decimals": 18
        },
        {
            "name": "ForTube",
            "symbol": "FOR",
            "address": "0x658A109C5900BC6d2357c87549B651670E5b0539",
            "decimals": 18
        },
        {
            "name": "Formation Finance",
            "symbol": "FORM",
            "address": "0x25A528af62e56512A19ce8c3cAB427807c28CC19",
            "decimals": 18
        },
        {
            "name": "fry.world",
            "symbol": "FRIES",
            "address": "0x393B312C01048b3ed2720bF1B090084C09e408A1",
            "decimals": 18
        },
        {
            "name": "Frontier Token",
            "symbol": "FRONT",
            "address": "0x928e55daB735aa8260AF3cEDadA18B5f70C72f1b",
            "decimals": 18
        },
        {
            "name": "Fuel",
            "symbol": "FUEL",
            "address": "0x2090c8295769791ab7A3CF1CC6e0AA19F35e441A",
            "decimals": 18
        },
        {
            "name": "GreenTrust",
            "symbol": "GNT",
            "address": "0xF750A26EB0aCf95556e8529E72eD530f3b60f348",
            "decimals": 18
        },
        {
            "name": "Gourmet Galaxy",
            "symbol": "GUM",
            "address": "0xc53708664b99DF348dd27C3Ac0759d2DA9c40462",
            "decimals": 18
        },
        {
            "name": "Hacken",
            "symbol": "HAI",
            "address": "0xaA9E582e5751d703F85912903bacADdFed26484C",
            "decimals": 8
        },
        {
            "name": "Hakka Finance",
            "symbol": "HAKKA",
            "address": "0x1D1eb8E8293222e1a29d2C0E4cE6C0Acfd89AaaC",
            "decimals": 18
        },
        {
            "name": "HARD",
            "symbol": "HARD",
            "address": "0xf79037F6f6bE66832DE4E7516be52826BC3cBcc4",
            "decimals": 6
        },
        {
            "name": "Helmet.insure",
            "symbol": "Helmet",
            "address": "0x948d2a81086A075b3130BAc19e4c6DEe1D2E3fE8",
            "decimals": 18
        },
        {
            "name": "MetaHero",
            "symbol": "HERO",
            "address": "0xD40bEDb44C081D2935eebA6eF5a3c8A31A1bBE13",
            "decimals": 18
        },
        {
            "name": "StepHero",
            "symbol": "HERO",
            "address": "0xE8176d414560cFE1Bf82Fd73B986823B89E4F545",
            "decimals": 18
        },
        {
            "name": "Hedget",
            "symbol": "HGET",
            "address": "0xC7d8D35EBA58a0935ff2D5a33Df105DD9f071731",
            "decimals": 6
        },
        {
            "name": "Hoo",
            "symbol": "HOO",
            "address": "0xE1d1F66215998786110Ba0102ef558b22224C016",
            "decimals": 8
        },
        {
            "name": "Hot Cross Token",
            "symbol": "HOTCROSS",
            "address": "0x4FA7163E153419E0E1064e418dd7A99314Ed27b6",
            "decimals": 18
        },
        {
            "name": "Hotbit",
            "symbol": "HTB",
            "address": "0x4e840AADD28DA189B9906674B4Afcb77C128d9ea",
            "decimals": 18
        },
        {
            "name": "HYFI",
            "symbol": "HYFI",
            "address": "0x9a319b959e33369C5eaA494a770117eE3e585318",
            "decimals": 18
        },
        {
            "name": "Horizon Protocol",
            "symbol": "HZN",
            "address": "0xC0eFf7749b125444953ef89682201Fb8c6A917CD",
            "decimals": 18
        },
        {
            "name": "Impossible Finance",
            "symbol": "IF",
            "address": "0xB0e1fc65C1a741b4662B813eB787d369b8614Af1",
            "decimals": 18
        },
        {
            "name": "Injective Protocol",
            "symbol": "INJ",
            "address": "0xa2B726B1145A4773F68593CF171187d8EBe4d495",
            "decimals": 18
        },
        {
            "name": "IoTeX",
            "symbol": "IOTX",
            "address": "0x9678E42ceBEb63F23197D726B29b1CB20d0064E5",
            "decimals": 18
        },
        {
            "name": "Itam",
            "symbol": "ITAM",
            "address": "0x04C747b40Be4D535fC83D09939fb0f626F32800B",
            "decimals": 18
        },
        {
            "name": "Juggernaut Finance",
            "symbol": "JGN",
            "address": "0xC13B7a43223BB9Bf4B69BD68Ab20ca1B79d81C75",
            "decimals": 18
        },
        {
            "name": "Juventus",
            "symbol": "JUV",
            "address": "0xC40C9A843E1c6D01b7578284a9028854f6683b1B",
            "decimals": 2
        },
        {
            "name": "Kalmar",
            "symbol": "KALM",
            "address": "0x4BA0057f784858a48fe351445C672FF2a3d43515",
            "decimals": 18
        },
        {
            "name": "KAVA",
            "symbol": "KAVA",
            "address": "0x5F88AB06e8dfe89DF127B2430Bba4Af600866035",
            "decimals": 6
        },
        {
            "name": "Kattana",
            "symbol": "KTN",
            "address": "0xDAe6c2A48BFAA66b43815c5548b10800919c993E",
            "decimals": 18
        },
        {
            "name": "Qian Governance Token",
            "symbol": "KUN",
            "address": "0x1A2fb0Af670D0234c2857FaD35b789F8Cb725584",
            "decimals": 18
        },
        {
            "name": "FC Lazio Fan Token",
            "symbol": "LAZIO",
            "address": "0x77d547256A2cD95F32F67aE0313E450Ac200648d",
            "decimals": 8
        },
        {
            "name": "Lien",
            "symbol": "LIEN",
            "address": "0x5d684ADaf3FcFe9CFb5ceDe3abf02F0Cdd1012E3",
            "decimals": 8
        },
        {
            "name": "Lightning",
            "symbol": "LIGHT",
            "address": "0x037838b556d9c9d654148a284682C55bB5f56eF4",
            "decimals": 18
        },
        {
            "name": "Linear Finance",
            "symbol": "LINA",
            "address": "0x762539b45A1dCcE3D36d080F74d1AED37844b878",
            "decimals": 18
        },
        {
            "name": "ChainLink Token",
            "symbol": "LINK",
            "address": "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD",
            "decimals": 18
        },
        {
            "name": "Litentry",
            "symbol": "LIT",
            "address": "0xb59490aB09A0f526Cc7305822aC65f2Ab12f9723",
            "decimals": 18
        },
        {
            "name": "Lympo Market Token",
            "symbol": "LMT",
            "address": "0x9617857E191354dbEA0b714d78Bc59e57C411087",
            "decimals": 18
        },
        {
            "name": "Litecoin Token",
            "symbol": "LTC",
            "address": "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94",
            "decimals": 18
        },
        {
            "name": "LTO Network",
            "symbol": "LTO",
            "address": "0x857B222Fc79e1cBBf8Ca5f78CB133d1b7CF34BBd",
            "decimals": 18
        },
        {
            "name": "lUSD",
            "symbol": "lUSD",
            "address": "0x23e8a70534308a4AAF76fb8C32ec13d17a3BD89e",
            "decimals": 18
        },
        {
            "name": "Mirror AMZN Token",
            "symbol": "mAMZN",
            "address": "0x3947B992DC0147D2D89dF0392213781b04B25075",
            "decimals": 18
        },
        {
            "name": "Unmarshal",
            "symbol": "MARSH",
            "address": "0x2FA5dAF6Fe0708fBD63b1A7D1592577284f52256",
            "decimals": 18
        },
        {
            "name": "Mask Network",
            "symbol": "MASK",
            "address": "0x2eD9a5C8C13b93955103B9a7C167B67Ef4d568a3",
            "decimals": 18
        },
        {
            "name": "Math",
            "symbol": "MATH",
            "address": "0xF218184Af829Cf2b0019F8E6F0b2423498a36983",
            "decimals": 18
        },
        {
            "name": "Mobox",
            "symbol": "MBOX",
            "address": "0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377",
            "decimals": 18
        },
        {
            "name": "MCDEX",
            "symbol": "MCB",
            "address": "0x5fE80d2CD054645b9419657d3d10d26391780A7B",
            "decimals": 18
        },
        {
            "name": "Mirror COIN",
            "symbol": "mCOIN",
            "address": "0x49022089e78a8D46Ec87A3AF86a1Db6c189aFA6f",
            "decimals": 18
        },
        {
            "name": "MacaronSwap",
            "symbol": "MCRN",
            "address": "0xacb2d47827C9813AE26De80965845D80935afd0B",
            "decimals": 18
        },
        {
            "name": "Mirror GOOGL Token",
            "symbol": "mGOOGL",
            "address": "0x62D71B23bF15218C7d2D7E48DBbD9e9c650B173f",
            "decimals": 18
        },
        {
            "name": "Mirror Finance",
            "symbol": "MIR",
            "address": "0x5B6DcF557E2aBE2323c48445E8CC948910d8c2c9",
            "decimals": 18
        },
        {
            "name": "Mix",
            "symbol": "MIX",
            "address": "0xB67754f5b4C704A24d2db68e661b2875a4dDD197",
            "decimals": 18
        },
        {
            "name": "Mirror NFLX Token",
            "symbol": "mNFLX",
            "address": "0xa04F060077D90Fe2647B61e4dA4aD1F97d6649dc",
            "decimals": 18
        },
        {
            "name": "Meter",
            "symbol": "MTRG",
            "address": "0xBd2949F67DcdC549c6Ebe98696449Fa79D988A9F",
            "decimals": 18
        },
        {
            "name": "Mirror TSLA Token",
            "symbol": "mTSLA",
            "address": "0xF215A127A196e3988C09d052e16BcFD365Cd7AA3",
            "decimals": 18
        },
        {
            "name": "MX Token",
            "symbol": "MX",
            "address": "0x9F882567A62a5560d147d64871776EeA72Df41D3",
            "decimals": 18
        },
        {
            "name": "NAOS Finance",
            "symbol": "NAOS",
            "address": "0x758d08864fB6cCE3062667225ca10b8F00496cc2",
            "decimals": 18
        },
        {
            "name": "NAR Token",
            "symbol": "NAR",
            "address": "0xA1303E6199b319a891b79685F0537D289af1FC83",
            "decimals": 18
        },
        {
            "name": "APENFT",
            "symbol": "NFT",
            "address": "0x1fC9004eC7E5722891f5f38baE7678efCB11d34D",
            "decimals": 6
        },
        {
            "name": "Nerve Finance",
            "symbol": "NRV",
            "address": "0x42F6f551ae042cBe50C739158b4f0CAC0Edb9096",
            "decimals": 18
        },
        {
            "name": "Nuls",
            "symbol": "NULS",
            "address": "0x8CD6e29d3686d24d3C2018CEe54621eA0f89313B",
            "decimals": 8
        },
        {
            "name": "NerveNetwork",
            "symbol": "NVT",
            "address": "0xf0E406c49C63AbF358030A299C0E00118C4C6BA5",
            "decimals": 8
        },
        {
            "name": "Nyanswop Token",
            "symbol": "NYA",
            "address": "0xbFa0841F7a90c4CE6643f651756EE340991F99D5",
            "decimals": 18
        },
        {
            "name": "O3 Swap",
            "symbol": "O3",
            "address": "0xEe9801669C6138E84bD50dEB500827b776777d28",
            "decimals": 18
        },
        {
            "name": "Oddz",
            "symbol": "ODDZ",
            "address": "0xCD40F2670CF58720b694968698A5514e924F742d",
            "decimals": 18
        },
        {
            "name": "OG",
            "symbol": "OG",
            "address": "0xf05E45aD22150677a017Fbd94b84fBB63dc9b44c",
            "decimals": 2
        },
        {
            "name": "Oin Finance",
            "symbol": "OIN",
            "address": "0x658E64FFcF40D240A43D52CA9342140316Ae44fA",
            "decimals": 8
        },
        {
            "name": "Harmony One",
            "symbol": "ONE",
            "address": "0x03fF0ff224f904be3118461335064bB48Df47938",
            "decimals": 18
        },
        {
            "name": "BigOne Token",
            "symbol": "ONE",
            "address": "0x04BAf95Fd4C52fd09a56D840bAEe0AB8D7357bf0",
            "decimals": 18
        },
        {
            "name": "Ontology Token",
            "symbol": "ONT",
            "address": "0xFd7B3A77848f1C2D67E05E54d78d174a0C850335",
            "decimals": 18
        },
        {
            "name": "The Orbs Network",
            "symbol": "ORBS",
            "address": "0xeBd49b26169e1b52c04cFd19FCf289405dF55F80",
            "decimals": 18
        },
        {
            "name": "pBTC",
            "symbol": "pBTC",
            "address": "0xeD28A457A5A76596ac48d87C0f577020F6Ea1c4C",
            "decimals": 18
        },
        {
            "name": "PolyCrowns",
            "symbol": "pCWS",
            "address": "0xbcf39F0EDDa668C58371E519AF37CA705f2bFcbd",
            "decimals": 18
        },
        {
            "name": "Perlin X",
            "symbol": "PERL",
            "address": "0x0F9E4D49f25de22c2202aF916B681FBB3790497B",
            "decimals": 18
        },
        {
            "name": "Phala Network",
            "symbol": "PHA",
            "address": "0x0112e557d400474717056C4e6D40eDD846F38351",
            "decimals": 18
        },
        {
            "name": "Polkamon",
            "symbol": "PMON",
            "address": "0x1796ae0b0fa4862485106a0de9b654eFE301D0b2",
            "decimals": 18
        },
        {
            "name": "PNT",
            "symbol": "PNT",
            "address": "0xdaacB0Ab6Fb34d24E8a67BfA14BF4D95D4C7aF92",
            "decimals": 18
        },
        {
            "name": "pTokens OPEN",
            "symbol": "pOPEN",
            "address": "0xaBaE871B7E3b67aEeC6B46AE9FE1A91660AadAC5",
            "decimals": 18
        },
        {
            "name": "Moonpot",
            "symbol": "POTS",
            "address": "0x3Fcca8648651E5b974DD6d3e50F61567779772A8",
            "decimals": 18
        },
        {
            "name": "Prometeus",
            "symbol": "PROM",
            "address": "0xaF53d56ff99f1322515E54FdDE93FF8b3b7DAFd5",
            "decimals": 18
        },
        {
            "name": "Prosper",
            "symbol": "PROS",
            "address": "0xEd8c8Aa8299C10f067496BB66f8cC7Fb338A3405",
            "decimals": 18
        },
        {
            "name": "Paris Saint-Germain",
            "symbol": "PSG",
            "address": "0xBc5609612b7C44BEf426De600B5fd1379DB2EcF1",
            "decimals": 2
        },
        {
            "name": "Qubit Token",
            "symbol": "QBT",
            "address": "0x17B7163cf1Dbd286E262ddc68b553D899B93f526",
            "decimals": 18
        },
        {
            "name": "QuarkChain Token",
            "symbol": "QKC",
            "address": "0xA1434F1FC3F437fa33F7a781E041961C0205B5Da",
            "decimals": 18
        },
        {
            "name": "QIAN second generation dollar",
            "symbol": "QSD",
            "address": "0x07AaA29E63FFEB2EBf59B33eE61437E1a91A3bb2",
            "decimals": 18
        },
        {
            "name": "QUSD Stablecoin",
            "symbol": "QUSD",
            "address": "0xb8C540d00dd0Bf76ea12E4B4B95eFC90804f924E",
            "decimals": 18
        },
        {
            "name": "Rabbit Finance",
            "symbol": "RABBIT",
            "address": "0x95a1199EBA84ac5f19546519e287d43D2F0E1b41",
            "decimals": 18
        },
        {
            "name": "Ramp DEFI",
            "symbol": "RAMP",
            "address": "0x8519EA49c997f50cefFa444d240fB655e89248Aa",
            "decimals": 18
        },
        {
            "name": "Reef",
            "symbol": "REEF",
            "address": "0xF21768cCBC73Ea5B6fd3C687208a7c2def2d966e",
            "decimals": 18
        },
        {
            "name": "renBTC",
            "symbol": "renBTC",
            "address": "0xfCe146bF3146100cfe5dB4129cf6C82b0eF4Ad8c",
            "decimals": 8
        },
        {
            "name": "renDOGE",
            "symbol": "renDOGE",
            "address": "0xc3fEd6eB39178A541D274e6Fc748d48f0Ca01CC3",
            "decimals": 8
        },
        {
            "name": "renZEC",
            "symbol": "renZEC",
            "address": "0x695FD30aF473F2960e81Dc9bA7cB67679d35EDb7",
            "decimals": 8
        },
        {
            "name": "REVV",
            "symbol": "REVV",
            "address": "0x833F307aC507D47309fD8CDD1F835BeF8D702a93",
            "decimals": 18
        },
        {
            "name": "RFOX",
            "symbol": "RFOX",
            "address": "0x0a3A21356793B49154Fd3BbE91CBc2A16c0457f5",
            "decimals": 18
        },
        {
            "name": "Rangers Protocol",
            "symbol": "RPG",
            "address": "0xc2098a8938119A52B1F7661893c0153A6CB116d5",
            "decimals": 18
        },
        {
            "name": "rUSD",
            "symbol": "rUSD",
            "address": "0x07663837218A003e66310a01596af4bf4e44623D",
            "decimals": 18
        },
        {
            "name": "SafeMoon",
            "symbol": "SAFEMOON",
            "address": "0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3",
            "decimals": 9
        },
        {
            "name": "bDollar Share",
            "symbol": "sBDO",
            "address": "0x0d9319565be7f53CeFE84Ad201Be3f40feAE2740",
            "decimals": 18
        },
        {
            "name": "SafePal Token",
            "symbol": "SFP",
            "address": "0xD41FDb03Ba84762dD66a0af1a6C8540FF1ba5dfb",
            "decimals": 18
        },
        {
            "name": "Seedify",
            "symbol": "SFUND",
            "address": "0x477bC8d23c634C154061869478bce96BE6045D12",
            "decimals": 18
        },
        {
            "name": "CryptoBlades Skill Token",
            "symbol": "SKILL",
            "address": "0x154A9F9cbd3449AD22FDaE23044319D6eF2a1Fab",
            "decimals": 18
        },
        {
            "name": "SPARTAN PROTOCOL TOKEN",
            "symbol": "SPARTA",
            "address": "0x3910db0600eA925F63C36DdB1351aB6E2c6eb102",
            "decimals": 18
        },
        {
            "name": "Splintershards",
            "symbol": "SPS",
            "address": "0x1633b7157e7638C4d6593436111Bf125Ee74703F",
            "decimals": 18
        },
        {
            "name": "StableXSwap",
            "symbol": "STAX",
            "address": "0x0Da6Ed8B13214Ff28e9Ca979Dd37439e8a88F6c4",
            "decimals": 18
        },
        {
            "name": "Sushi",
            "symbol": "SUSHI",
            "address": "0x947950BcC74888a40Ffa2593C5798F11Fc9124C4",
            "decimals": 18
        },
        {
            "name": "Suterusu",
            "symbol": "SUTER",
            "address": "0x4CfbBdfBd5BF0814472fF35C72717Bd095ADa055",
            "decimals": 18
        },
        {
            "name": "Swampy",
            "symbol": "SWAMP",
            "address": "0xc5A49b4CBe004b6FD55B30Ba1dE6AC360FF9765d",
            "decimals": 18
        },
        {
            "name": "SWGToken",
            "symbol": "SWG",
            "address": "0xe792f64C582698b8572AAF765bDC426AC3aEfb6B",
            "decimals": 18
        },
        {
            "name": "Swingby",
            "symbol": "SWINGBY",
            "address": "0x71DE20e0C4616E7fcBfDD3f875d568492cBE4739",
            "decimals": 18
        },
        {
            "name": "Switcheo",
            "symbol": "SWTH",
            "address": "0x250b211EE44459dAd5Cd3bCa803dD6a7EcB5d46C",
            "decimals": 8
        },
        {
            "name": "Swipe",
            "symbol": "SXP",
            "address": "0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A",
            "decimals": 18
        },
        {
            "name": "Tau Bitcoin",
            "symbol": "tBTC",
            "address": "0x2cD1075682b0FCCaADd0Ca629e138E64015Ba11c",
            "decimals": 9
        },
        {
            "name": "Tau DOGE",
            "symbol": "tDOGE",
            "address": "0xe550a593d09FBC8DCD557b5C88Cea6946A8b404A",
            "decimals": 8
        },
        {
            "name": "Tenet",
            "symbol": "TEN",
            "address": "0xdFF8cb622790b7F92686c722b02CaB55592f152C",
            "decimals": 18
        },
        {
            "name": "TitanSwap",
            "symbol": "TITAN",
            "address": "0xe898EDc43920F357A93083F1d4460437dE6dAeC2",
            "decimals": 18
        },
        {
            "name": "TokoCrypto",
            "symbol": "TKO",
            "address": "0x9f589e3eabe42ebC94A44727b3f3531C0c877809",
            "decimals": 18
        },
        {
            "name": "Alien Worlds",
            "symbol": "TLM",
            "address": "0x2222227E22102Fe3322098e4CBfE18cFebD57c95",
            "decimals": 4
        },
        {
            "name": "Telos",
            "symbol": "TLOS",
            "address": "0xb6C53431608E626AC81a9776ac3e999c5556717c",
            "decimals": 18
        },
        {
            "name": "TokenPocket",
            "symbol": "TPT",
            "address": "0xECa41281c24451168a37211F0bc2b8645AF45092",
            "decimals": 4
        },
        {
            "name": "Unitrade",
            "symbol": "TRADE",
            "address": "0x7af173F350D916358AF3e218Bdf2178494Beb748",
            "decimals": 18
        },
        {
            "name": "Tron",
            "symbol": "TRX",
            "address": "0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B",
            "decimals": 18
        },
        {
            "name": "True USD",
            "symbol": "TUSD",
            "address": "0x14016E85a25aeb13065688cAFB43044C2ef86784",
            "decimals": 18
        },
        {
            "name": "Trust Wallet",
            "symbol": "TWT",
            "address": "0x4B0F1812e5Df2A09796481Ff14017e6005508003",
            "decimals": 18
        },
        {
            "name": "Tixl",
            "symbol": "TXL",
            "address": "0x1FFD0b47127fdd4097E54521C9E2c7f0D66AafC5",
            "decimals": 18
        },
        {
            "name": "UpBots",
            "symbol": "UBXT",
            "address": "0xBbEB90cFb6FAFa1F69AA130B7341089AbeEF5811",
            "decimals": 18
        },
        {
            "name": "Unifi Token",
            "symbol": "UNFI",
            "address": "0x728C5baC3C3e370E372Fc4671f9ef6916b814d8B",
            "decimals": 18
        },
        {
            "name": "Uniswap",
            "symbol": "UNI",
            "address": "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1",
            "decimals": 18
        },
        {
            "name": "Binance Pegged USD Coin",
            "symbol": "USDC",
            "address": "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
            "decimals": 18
        },
        {
            "name": "Binance Pegged USDT",
            "symbol": "USDT",
            "address": "0x55d398326f99059fF775485246999027B3197955",
            "decimals": 18,
            "isCommon": true
        },
        {
            "name": "USDX",
            "symbol": "USDX",
            "address": "0x1203355742e76875154C0D13eB81DCD7711dC7d9",
            "decimals": 6
        },
        {
            "name": "UST Token",
            "symbol": "UST",
            "address": "0x23396cF899Ca06c4472205fC903bDB4de249D6fC",
            "decimals": 18
        },
        {
            "name": "VAI Stablecoin",
            "symbol": "VAI",
            "address": "0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7",
            "decimals": 18
        },
        {
            "name": "Venus Reward Token",
            "symbol": "VRT",
            "address": "0x5F84ce30DC3cF7909101C69086c50De191895883",
            "decimals": 18
        },
        {
            "name": "Yieldwatch",
            "symbol": "WATCH",
            "address": "0x7A9f28EB62C791422Aa23CeAE1dA9C847cBeC9b0",
            "decimals": 18
        },
        {
            "name": "Wault",
            "symbol": "WAULTx",
            "address": "0xB64E638E60D154B43f660a6BF8fD8a3b249a6a21",
            "decimals": 18
        },
        {
            "name": "WBNB Token",
            "symbol": "WBNB",
            "address": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            "decimals": 18,
            "isCommon": true,
            "isWETH": true
        },
        {
            "name": "BitWell Token",
            "symbol": "WELL",
            "address": "0xf07a32Eb035b786898c00bB1C64d8c6F8E7a46D5",
            "decimals": 18
        },
        {
            "name": "WaultSwap",
            "symbol": "WEX",
            "address": "0xa9c41A46a6B3531d28d5c32F6633dd2fF05dFB90",
            "decimals": 18
        },
        {
            "name": "WINk",
            "symbol": "WIN",
            "address": "0xaeF0d72a118ce24feE3cD1d43d383897D05B4e99",
            "decimals": 18
        },
        {
            "name": "Wrapped MASS",
            "symbol": "WMASS",
            "address": "0x7e396BfC8a2f84748701167c2d622F041A1D7a17",
            "decimals": 8
        },
        {
            "name": "Wootrade",
            "symbol": "WOO",
            "address": "0x4691937a7508860F876c9c0a2a617E7d9E945D4B",
            "decimals": 18
        },
        {
            "name": "Wall Street Games",
            "symbol": "WSG",
            "address": "0xA58950F05FeA2277d2608748412bf9F802eA4901",
            "decimals": 18
        },
        {
            "name": "Soteria",
            "symbol": "wSOTE",
            "address": "0x541E619858737031A1244A5d0Cd47E5ef480342c",
            "decimals": 18
        },
        {
            "name": "Xcademy",
            "symbol": "XCAD",
            "address": "0x431e0cD023a32532BF3969CddFc002c00E98429d",
            "decimals": 18
        },
        {
            "name": "Exeedme",
            "symbol": "XED",
            "address": "0x5621b5A3f4a8008c4CCDd1b942B121c8B1944F1f",
            "decimals": 18
        },
        {
            "name": "XEND",
            "symbol": "XEND",
            "address": "0x4a080377f83D669D7bB83B3184a8A5E61B500608",
            "decimals": 18
        },
        {
            "name": "xMARK",
            "symbol": "xMARK",
            "address": "0x26A5dFab467d4f58fB266648CAe769503CEC9580",
            "decimals": 9
        },
        {
            "name": "XRP Token",
            "symbol": "XRP",
            "address": "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",
            "decimals": 18
        },
        {
            "name": "Tezos Token",
            "symbol": "XTZ",
            "address": "0x16939ef78684453bfDFb47825F8a5F714f12623a",
            "decimals": 18
        },
        {
            "name": "Venus Token",
            "symbol": "XVS",
            "address": "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63",
            "decimals": 18
        },
        {
            "name": "yearn.finance",
            "symbol": "YFI",
            "address": "0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e",
            "decimals": 18
        },
        {
            "name": "YFII.finance Token",
            "symbol": "YFII",
            "address": "0x7F70642d88cf1C4a3a7abb072B53B929b653edA5",
            "decimals": 18
        },
        {
            "name": "Zcash Token",
            "symbol": "ZEC",
            "address": "0x1Ba42e5193dfA8B03D15dd1B86a3113bbBEF8Eeb",
            "decimals": 18
        },
        {
            "name": "ZeroSwapToken",
            "symbol": "ZEE",
            "address": "0x44754455564474A89358B2C2265883DF993b12F0",
            "decimals": 18
        },
        {
            "name": "Zilliqa",
            "symbol": "ZIL",
            "address": "0xb86AbCb37C3A4B64f74f59301AFF131a1BEcC787",
            "decimals": 12
        },
        {
            "name": "openANX Token",
            "symbol": "OAX",
            "address": "0x31720B2276Df3b3B757B55845d17Eea184d4fc8f",
            "decimals": 18
        },
        {
            "name": "Impossible Decentralized Incubator Access Token",
            "symbol": "IDIA",
            "address": "0x0b15Ddf19D47E6a86A56148fb4aFFFc6929BcB89",
            "decimals": 18
        },
        {
            "name": "Biswap",
            "symbol": "BSW",
            "address": "0x965F527D9159dCe6288a2219DB51fc6Eef120dD1",
            "decimals": 18
        },
        {
            "name": "OpenSwap Booster - IDIA Series #1",
            "symbol": "bqIDIA1",
            "address": "0x46c5BC0656301c3DFb8EF8fc44CfBF89ef121348",
            "decimals": 18
        },
        {
            "name": "OGS",
            "symbol": "OGS",
            "address": "0x416947e6Fc78F158fd9B775fA846B72d768879c2",
            "decimals": 18
        },
        {
            "name": "dummy BVR",
            "symbol": "dBVR",
            "address": "0x16C5e51BFa38a6dD109bcc4921a92AEF13B14Ed9",
            "decimals": 18
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/mainnet/fantom.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Fantom = void 0;
    ///<amd-module name='@scom/scom-nft-minter/store/tokens/mainnet/fantom.ts'/> 
    exports.Tokens_Fantom = [
        {
            "address": "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
            "name": "Wrapped Fantom",
            "symbol": "WFTM",
            "decimals": 18,
            "isCommon": true,
            "isWETH": true
        },
        { "address": "0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7", "name": "TOMB", "symbol": "TOMB", "decimals": 18 },
        { "address": "0x4cdF39285D7Ca8eB3f090fDA0C069ba5F4145B37", "name": "TSHARE", "symbol": "TSHARE", "decimals": 18 },
        { "address": "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", "name": "USD Coin", "symbol": "USDC", "decimals": 6, "isCommon": true },
        { "address": "0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE", "name": "SpookyToken", "symbol": "BOO", "decimals": 18 },
        { "address": "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E", "name": "Dai Stablecoin", "symbol": "DAI", "decimals": 18 },
        { "address": "0x74b23882a30290451A17c44f4F05243b6b58C76d", "name": "Ethereum", "symbol": "ETH", "decimals": 18 },
        { "address": "0x321162Cd933E2Be498Cd2267a90534A804051b11", "name": "Bitcoin", "symbol": "BTC", "decimals": 8 },
        { "address": "0x049d68029688eAbF473097a2fC38ef61633A3C7A", "name": "Frapped USDT", "symbol": "fUSDT", "decimals": 6 },
        { "address": "0x82f0B8B456c1A451378467398982d4834b6829c1", "name": "Magic Internet Money", "symbol": "MIM", "decimals": 18 },
        { "address": "0xe0654C8e6fd4D733349ac7E09f6f23DA256bF475", "name": "Scream", "symbol": "SCREAM", "decimals": 18 },
        { "address": "0x5602df4A94eB6C680190ACCFA2A475621E0ddBdc", "name": "Spartacus", "symbol": "SPA", "decimals": 9 },
        { "address": "0xd8321AA83Fb0a4ECd6348D4577431310A6E0814d", "name": "Geist.Finance Protocol Token", "symbol": "GEIST", "decimals": 18 },
        { "address": "0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454", "name": "Binance", "symbol": "BNB", "decimals": 18 },
        { "address": "0x5C4FDfc5233f935f20D2aDbA572F770c2E377Ab0", "name": "Hector", "symbol": "HEC", "decimals": 9 },
        { "address": "0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8", "name": "ChainLink", "symbol": "LINK", "decimals": 18 },
        { "address": "0x9879aBDea01a879644185341F7aF7d8343556B7a", "name": "TrueUSD", "symbol": "TUSD", "decimals": 18 },
        { "address": "0xfB98B335551a418cD0737375a2ea0ded62Ea213b", "name": "miMATIC", "symbol": "miMATIC", "decimals": 18 },
        { "address": "0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC", "name": "Sushi", "symbol": "SUSHI", "decimals": 18 },
        { "address": "0xdDcb3fFD12750B45d32E084887fdf1aABAb34239", "name": "Anyswap", "symbol": "ANY", "decimals": 18 },
        { "address": "0x511D35c52a3C244E7b8bd92c0C297755FbD89212", "name": "Avalanche", "symbol": "AVAX", "decimals": 18 },
        { "address": "0x468003B688943977e6130F4F68F23aad939a1040", "name": "Spell Token", "symbol": "SPELL", "decimals": 18 },
        { "address": "0x5Cc61A78F164885776AA610fb0FE1257df78E59B", "name": "SpiritSwap Token", "symbol": "SPIRIT", "decimals": 18 },
        { "address": "0x10b620b2dbAC4Faa7D7FFD71Da486f5D44cd86f9", "name": "Liquid Driver", "symbol": "LQDR", "decimals": 18 },
        { "address": "0xdc301622e621166BD8E82f2cA0A26c13Ad0BE355", "name": "Frax", "symbol": "FRAX", "decimals": 18 }
    ];
});
define("@scom/scom-nft-minter/store/tokens/mainnet/cronos.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Cronos = void 0;
    ///<amd-module name='@scom/scom-nft-minter/store/tokens/mainnet/cronos.ts'/> 
    exports.Tokens_Cronos = [
        {
            "address": "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
            "name": "WCRO",
            "symbol": "WCRO",
            "decimals": 18,
            "isCommon": true,
            "isWETH": true
        },
        {
            "address": "0xe44Fd7fCb2b1581822D0c862B68222998a0c299a",
            "name": "WETH",
            "symbol": "WCRO",
            "decimals": 18,
            "isCommon": true
        },
        {
            "address": "0x062E66477Faf219F25D27dCED647BF57C3107d52",
            "name": "WBTC",
            "symbol": "WBTC",
            "decimals": 8,
            "isCommon": true
        },
        {
            "address": "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
            "name": "USDC",
            "symbol": "USDC",
            "decimals": 6,
            "isCommon": true
        },
        {
            "address": "0x66e428c3f67a68878562e79A0234c1F83c208770",
            "name": "USDT",
            "symbol": "USDT",
            "decimals": 6,
            "isCommon": true
        },
        {
            "address": "0xF2001B145b43032AAF5Ee2884e456CCd805F677D",
            "name": "DAI",
            "symbol": "DAI",
            "decimals": 18,
            "isCommon": true
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/mainnet/index.ts", ["require", "exports", "@scom/scom-nft-minter/store/tokens/mainnet/avalanche.ts", "@scom/scom-nft-minter/store/tokens/mainnet/ethereum.ts", "@scom/scom-nft-minter/store/tokens/mainnet/polygon.ts", "@scom/scom-nft-minter/store/tokens/mainnet/bsc.ts", "@scom/scom-nft-minter/store/tokens/mainnet/fantom.ts", "@scom/scom-nft-minter/store/tokens/mainnet/cronos.ts"], function (require, exports, avalanche_1, ethereum_1, polygon_1, bsc_1, fantom_1, cronos_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Cronos = exports.Tokens_Fantom = exports.Tokens_BSC = exports.Tokens_Polygon = exports.Tokens_Ethereuem = exports.Tokens_Avalanche = void 0;
    Object.defineProperty(exports, "Tokens_Avalanche", { enumerable: true, get: function () { return avalanche_1.Tokens_Avalanche; } });
    Object.defineProperty(exports, "Tokens_Ethereuem", { enumerable: true, get: function () { return ethereum_1.Tokens_Ethereuem; } });
    Object.defineProperty(exports, "Tokens_Polygon", { enumerable: true, get: function () { return polygon_1.Tokens_Polygon; } });
    Object.defineProperty(exports, "Tokens_BSC", { enumerable: true, get: function () { return bsc_1.Tokens_BSC; } });
    Object.defineProperty(exports, "Tokens_Fantom", { enumerable: true, get: function () { return fantom_1.Tokens_Fantom; } });
    Object.defineProperty(exports, "Tokens_Cronos", { enumerable: true, get: function () { return cronos_1.Tokens_Cronos; } });
});
define("@scom/scom-nft-minter/store/tokens/testnet/kovan.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Kovan = void 0;
    ///<amd-module name='@scom/scom-nft-minter/store/tokens/testnet/kovan.ts'/> 
    exports.Tokens_Kovan = [
        {
            "name": "Wrapped ETH",
            "address": "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
            "symbol": "WETH",
            "decimals": 18,
            "isCommon": true,
            "isWETH": true
        },
        {
            "name": "USDC",
            "address": "0xe7EB1b3f0b7f287a93c34A313552974669C425B6",
            "symbol": "USDC",
            "decimals": 6,
            "isCommon": true
        },
        {
            "name": "USDT",
            "address": "0xDcdAFd9461c2df544F6E2165481E8174e45fEbD8",
            "symbol": "USDT",
            "decimals": 6,
            "isCommon": true,
            "isVaultToken": true
        },
        {
            "name": "DAI",
            "address": "0x25b061e0fcBB2Fbe38A5e669957eFF3DFE03d28f",
            "symbol": "DAI",
            "decimals": 18
        },
        {
            "name": "openANX Token",
            "address": "0xbe01a8e3F1E3841ccbf6eeEB09215A3a3bdBe336",
            "symbol": "OAX",
            "decimals": 18
        },
        {
            "name": "CAKE",
            "address": "0x5f33463E584D7D2Caa50b597984F0C4512A79aaf",
            "symbol": "CAKE",
            "decimals": 18
        },
        {
            "name": "Uniswap",
            "symbol": "UNI",
            "address": "0xB409C977546d60BFBcd235Bb6cDfB71b1364e509",
            "decimals": 18
        },
        {
            "name": "OpenSwap",
            "address": "0x28A6a9079fA8e041179cD13F4652af2B315b6fd8",
            "symbol": "OSWAP",
            "decimals": 18
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/testnet/bsc-testnet.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_BSC_Testnet = void 0;
    ///<amd-module name='@scom/scom-nft-minter/store/tokens/testnet/bsc-testnet.ts'/> 
    exports.Tokens_BSC_Testnet = [
        {
            "name": "Wrapped BNB",
            "address": "0xae13d989dac2f0debff460ac112a837c89baa7cd",
            "symbol": "WBNB",
            "decimals": 18,
            "isCommon": true,
            "isWETH": true
        },
        {
            "name": "USDT",
            "address": "0x29386B60e0A9A1a30e1488ADA47256577ca2C385",
            "symbol": "USDT",
            "decimals": 6,
            "isCommon": true
        },
        {
            "name": "BUSD Token",
            "symbol": "BUSD",
            "address": "0xDe9334C157968320f26e449331D6544b89bbD00F",
            "decimals": 18,
            "isCommon": true
        },
        {
            "name": "USDC",
            "address": "0x278B02d1b60AcD3334682F0dcF29AECcc62b28B3",
            "symbol": "USDC",
            "decimals": 18
        },
        {
            "name": "DAI",
            "address": "0xB78DAa2F1A2de8270a5641f052FaFC4b2b3ea3B1",
            "symbol": "DAI",
            "decimals": 18
        },
        {
            "name": "openANX Token",
            "address": "0x8677048f3eD472610514bA6EF6Ec2f03b550eBdB",
            "symbol": "OAX",
            "decimals": 18
        },
        {
            "name": "CAKE",
            "address": "0xEF899e45461F4614655AEe012ec69ae12F97F81e",
            "symbol": "CAKE",
            "decimals": 18
        },
        {
            "name": "BakeryToken",
            "address": "0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5",
            "symbol": "BAKE",
            "decimals": 18
        },
        {
            "name": "Polkadot Token",
            "symbol": "DOT",
            "address": "0x6679b8031519fA81fE681a93e98cdddA5aafa95b",
            "decimals": 18
        },
        {
            "name": "Impossible Finance",
            "symbol": "IF",
            "address": "0x3245fD889abe511A7d57643905368F8Ec8fd4A92",
            "decimals": 18
        },
        {
            "name": "Coin98",
            "symbol": "C98",
            "address": "0x5EB137B421AE7Be6Ce26C3dE7c828c475C9a69b1",
            "decimals": 18
        },
        {
            "name": "Impossible Decentralized Incubator Access Token",
            "symbol": "IDIA",
            "address": "0x52423B7F0769d0365EbdD79342ce167eB9C29AE2",
            "decimals": 18
        },
        {
            "name": "OpenSwap",
            "address": "0x45eee762aaeA4e5ce317471BDa8782724972Ee19",
            "symbol": "OSWAP",
            "decimals": 18,
            "isCommon": true
        },
        {
            "name": "mOpenSwap",
            "address": "0xC2C76387eB1cd15f2f55D2463b5AAd6fca062EB1",
            "symbol": "mOSWAP",
            "decimals": 18
        },
        {
            "name": "Project",
            "address": "0x100c8C9eFCb56A253d5A82059647A2adEFDC984A",
            "symbol": "PRO",
            "decimals": 18
        },
        {
            "name": "mProject",
            "address": "0x05039f76eB9Dcb6aB49b4D5860980e32f976e17b",
            "symbol": "mPRO",
            "decimals": 18
        },
        {
            "name": "mIDIA",
            "address": "0x18CE3F88De23DC2A72f3aDDeB048caa01059E9f3",
            "symbol": "mIDIA",
            "decimals": 18
        },
        {
            "name": "Testing",
            "address": "0xc9E10b2a33631c1F9b185Df07198591d507CcE20",
            "symbol": "TS",
            "decimals": 18
        },
        {
            "name": "tokenT",
            "address": "0xb79aA5c1730Ad78dD958f05fD87022aeF3e50721",
            "symbol": "TT",
            "decimals": 18
        },
        {
            "name": "JetSwap Token",
            "address": "0x8839903E0D698e5976C39E34bDED66F7B9a1b8c9",
            "symbol": "WINGS",
            "decimals": 18
        },
        {
            "name": "dummy BVR",
            "address": "0x9DbD7024804a2a6131BE7C8dE7A7773c5c119419",
            "symbol": "dBVR",
            "decimals": 18
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/testnet/fuji.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Fuji = void 0;
    ///<amd-module name='@scom/scom-nft-minter/store/tokens/testnet/fuji.ts'/> 
    exports.Tokens_Fuji = [
        {
            "name": "Wrapped AVAX",
            "address": "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
            "symbol": "WAVAX",
            "decimals": 18,
            "isCommon": true,
            "isWETH": true
        },
        {
            "name": "Pangolin",
            "address": "0x6d0A79756774c7cbac6Ce5c5e3b0f40b0ccCcB20",
            "symbol": "PNG",
            "decimals": 18
        },
        {
            "name": "OpenSwap",
            "address": "0x78d9D80E67bC80A11efbf84B7c8A65Da51a8EF3C",
            "symbol": "OSWAP",
            "decimals": 18,
            "isCommon": true
        },
        {
            "name": "Tether USD",
            "address": "0xb9C31Ea1D475c25E58a1bE1a46221db55E5A7C6e",
            "symbol": "USDT.e",
            "decimals": 6
        },
        {
            "name": "HakuSwap Token",
            "address": "0x2093f387FA92d3963A4Bc8Fd8E4f88cD82c0d14A",
            "symbol": "HAKU",
            "decimals": 18
        },
        {
            "name": "Snowball",
            "address": "0xF319e2f610462F846d6e93F51CdC862EEFF2a554",
            "symbol": "SNOB",
            "decimals": 18
        },
        {
            "name": "TEDDY",
            "address": "0x7B635b81920F2C9B7a217DD898BeC9F6D309470D",
            "symbol": "TEDDY",
            "decimals": 18
        },
        {
            "name": "AxialToken",
            "address": "0x57b8a194230ef402584130B1eD31d2C4682d7a71",
            "symbol": "AXIAL",
            "decimals": 18
        },
        {
            "name": "USDC",
            "address": "0xA269756ccf60766FB311BeE71c07F53Af1d15bDE",
            "symbol": "USDC",
            "decimals": 6
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/testnet/mumbai.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Mumbai = void 0;
    ///<amd-module name='@scom/scom-nft-minter/store/tokens/testnet/mumbai.ts'/> 
    exports.Tokens_Mumbai = [
        {
            "name": "USDT",
            "address": "0xF6Bf7c1213fdCe4AA92e7c91865cD586891B9cF6",
            "symbol": "USDT",
            "decimals": 6,
            "isCommon": true
        },
        {
            "name": "OpenSwap",
            "address": "0xA9d603421e2777b8BEa685272611A01fF3bc6523",
            "symbol": "OSWAP",
            "decimals": 18,
            "isCommon": true
        },
        {
            "name": "Wrapped MATIC",
            "address": "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
            "symbol": "WMATIC",
            "decimals": 18,
            "isCommon": true,
            "isWETH": true
        },
        {
            "name": "USDC",
            "address": "0x87a86a498E50D9cb81cE7B4682Db90eDB32A2A01",
            "symbol": "USDC",
            "decimals": 6
        },
        {
            "name": "Tidal Token",
            "address": "0xE4c020c5B74A44cf21549C36E8762Da77FAaf134",
            "symbol": "TIDAL",
            "decimals": 18
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/testnet/fantom-testnet.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Fantom_Testnet = void 0;
    ///<amd-module name='@scom/scom-nft-minter/store/tokens/testnet/fantom-testnet.ts'/> 
    exports.Tokens_Fantom_Testnet = [
        {
            "address": "0xf1277d1Ed8AD466beddF92ef448A132661956621",
            "decimals": 18,
            "name": "Wrapped Fantom",
            "symbol": "WFTM",
            "isWETH": true
        },
        {
            "name": "OpenSwap",
            "address": "0xDe0399014ED809e0E5976D391013dEd315c6B778",
            "symbol": "OSWAP",
            "decimals": 18,
            "isCommon": true
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/testnet/amino.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Amino = void 0;
    ///<amd-module name='@scom/scom-nft-minter/store/tokens/testnet/amino.ts'/> 
    exports.Tokens_Amino = [
        {
            "name": "USDT",
            "address": "0x28A6a9079fA8e041179cD13F4652af2B315b6fd8",
            "symbol": "USDT",
            "decimals": 18
        },
        {
            "name": "CAKE",
            "address": "0x8dc927D1c259A2EdA099712eAFB57509aD4164b7",
            "symbol": "CAKE",
            "decimals": 18
        },
        {
            "name": "BUSD",
            "address": "0x5d3e849B757afD8500b0F514933eEb55a92EB757",
            "symbol": "BUSD",
            "decimals": 18
        },
        {
            "name": "Wrapped ACT",
            "address": "0xBB04C4927A05Cf7d3e329E6333658D48A9313356",
            "symbol": "WACT",
            "decimals": 18,
            "isCommon": true,
            "isWETH": true
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/testnet/aminoX-testnet.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_AminoXTestnet = void 0;
    ///<amd-module name='@scom/scom-nft-minter/store/tokens/testnet/aminoX-testnet.ts'/> 
    exports.Tokens_AminoXTestnet = [
        {
            "name": "OpenSwap",
            "address": "0xA0AF68AB35fa4618b57C1A7CFc07A8caa0cBf07E",
            "symbol": "OSWAP",
            "decimals": 18,
            "isCommon": true
        },
        {
            "name": "Tether USD",
            "address": "0xFFfffffF8d2EE523a2206206994597c13D831EC7",
            "symbol": "USDT",
            "decimals": 6,
            "isCommon": true
        },
        {
            "name": "DAI Stablecoin",
            "address": "0xFFFffffFE89094c44da98B954eEDEac495271D0f",
            "symbol": "DAI",
            "decimals": 18,
            "isCommon": true
        },
        {
            "name": "Wrapped ACT",
            "address": "0xCb5e100fdF7d24f25865fa85673D9bD6Bb4674ab",
            "symbol": "WACT",
            "decimals": 18,
            "isCommon": true,
            "isWETH": true
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/testnet/cronos-testnet.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Cronos_Testnet = void 0;
    ///<amd-module name='@scom/scom-nft-minter/store/tokens/testnet/cronos-testnet.ts'/> 
    exports.Tokens_Cronos_Testnet = [
        {
            "address": "0x6a3173618859C7cd40fAF6921b5E9eB6A76f1fD4",
            "name": "Wrapped CRO",
            "symbol": "WCRO",
            "decimals": 18,
            "isCommon": true,
            "isWETH": true
        },
        {
            "name": "WETH",
            "address": "0x796135E94527c38433e9c42f4Cd91ca931E5e6A6",
            "symbol": "WETH",
            "decimals": 18,
            "isCommon": true
        },
        {
            "name": "WBTC",
            "address": "0xEE200f25d7B1B9518AC944fd60b113d39bee209c",
            "symbol": "WBTC",
            "decimals": 8,
            "isCommon": true
        },
        {
            "name": "USDC",
            "address": "0x25f0965F285F03d6F6B3B21c8EC3367412Fd0ef6",
            "symbol": "USDC",
            "decimals": 6,
            "isCommon": true
        },
        {
            "name": "USDT",
            "address": "0xa144617Afd9205AF1ceDE3Cc671da1a409A82c5a",
            "symbol": "USDT",
            "decimals": 6,
            "isCommon": true
        },
        {
            "name": "DAI",
            "address": "0x8662A8111daEC7570a1bDF3dbd3E163d41563904",
            "symbol": "DAI",
            "decimals": 18,
            "isCommon": true
        },
        {
            "name": "OSWAP",
            "address": "0xA09d20Bac0A83b0d1454a2B3BA7A39D55ca00628",
            "symbol": "OSWAP",
            "decimals": 18,
            "isCommon": true
        }
    ];
});
define("@scom/scom-nft-minter/store/tokens/testnet/index.ts", ["require", "exports", "@scom/scom-nft-minter/store/tokens/testnet/kovan.ts", "@scom/scom-nft-minter/store/tokens/testnet/bsc-testnet.ts", "@scom/scom-nft-minter/store/tokens/testnet/fuji.ts", "@scom/scom-nft-minter/store/tokens/testnet/mumbai.ts", "@scom/scom-nft-minter/store/tokens/testnet/fantom-testnet.ts", "@scom/scom-nft-minter/store/tokens/testnet/amino.ts", "@scom/scom-nft-minter/store/tokens/testnet/aminoX-testnet.ts", "@scom/scom-nft-minter/store/tokens/testnet/cronos-testnet.ts"], function (require, exports, kovan_1, bsc_testnet_1, fuji_1, mumbai_1, fantom_testnet_1, amino_1, aminoX_testnet_1, cronos_testnet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tokens_Cronos_Testnet = exports.Tokens_AminoXTestnet = exports.Tokens_Amino = exports.Tokens_Fantom_Testnet = exports.Tokens_Mumbai = exports.Tokens_Fuji = exports.Tokens_BSC_Testnet = exports.Tokens_Kovan = void 0;
    Object.defineProperty(exports, "Tokens_Kovan", { enumerable: true, get: function () { return kovan_1.Tokens_Kovan; } });
    Object.defineProperty(exports, "Tokens_BSC_Testnet", { enumerable: true, get: function () { return bsc_testnet_1.Tokens_BSC_Testnet; } });
    Object.defineProperty(exports, "Tokens_Fuji", { enumerable: true, get: function () { return fuji_1.Tokens_Fuji; } });
    Object.defineProperty(exports, "Tokens_Mumbai", { enumerable: true, get: function () { return mumbai_1.Tokens_Mumbai; } });
    Object.defineProperty(exports, "Tokens_Fantom_Testnet", { enumerable: true, get: function () { return fantom_testnet_1.Tokens_Fantom_Testnet; } });
    Object.defineProperty(exports, "Tokens_Amino", { enumerable: true, get: function () { return amino_1.Tokens_Amino; } });
    Object.defineProperty(exports, "Tokens_AminoXTestnet", { enumerable: true, get: function () { return aminoX_testnet_1.Tokens_AminoXTestnet; } });
    Object.defineProperty(exports, "Tokens_Cronos_Testnet", { enumerable: true, get: function () { return cronos_testnet_1.Tokens_Cronos_Testnet; } });
});
define("@scom/scom-nft-minter/store/tokens/index.ts", ["require", "exports", "@scom/scom-nft-minter/store/tokens/mainnet/index.ts", "@scom/scom-nft-minter/store/tokens/testnet/index.ts"], function (require, exports, index_1, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DefaultTokens = exports.ChainNativeTokenByChainId = exports.DefaultERC20Tokens = void 0;
    const DefaultERC20Tokens = {
        1: index_1.Tokens_Ethereuem,
        25: index_1.Tokens_Cronos,
        42: index_2.Tokens_Kovan,
        56: index_1.Tokens_BSC,
        97: index_2.Tokens_BSC_Testnet,
        137: index_1.Tokens_Polygon,
        338: index_2.Tokens_Cronos_Testnet,
        31337: index_2.Tokens_Amino,
        80001: index_2.Tokens_Mumbai,
        43113: index_2.Tokens_Fuji,
        43114: index_1.Tokens_Avalanche,
        250: index_1.Tokens_Fantom,
        4002: index_2.Tokens_Fantom_Testnet,
        13370: index_2.Tokens_AminoXTestnet
    };
    exports.DefaultERC20Tokens = DefaultERC20Tokens;
    const ChainNativeTokenByChainId = {
        1: { address: undefined, decimals: 18, symbol: "ETH", name: 'ETH', isNative: true },
        25: { address: undefined, decimals: 18, symbol: "CRO", name: 'CRO', isNative: true },
        42: { address: undefined, decimals: 18, symbol: "ETH", name: 'ETH', isNative: true },
        56: { address: undefined, decimals: 18, symbol: "BNB", name: 'BNB', isNative: true },
        97: { address: undefined, decimals: 18, symbol: "BNB", name: 'BNB', isNative: true },
        137: { address: undefined, decimals: 18, symbol: "MATIC", name: 'MATIC', isNative: true },
        338: { address: undefined, decimals: 18, symbol: "TCRO", name: 'TCRO', isNative: true },
        31337: { address: undefined, decimals: 18, symbol: "ACT", name: 'ACT', isNative: true },
        80001: { address: undefined, decimals: 18, symbol: "MATIC", name: 'MATIC', isNative: true },
        43114: { address: undefined, decimals: 18, symbol: "AVAX", name: 'AVAX', isNative: true },
        43113: { address: undefined, decimals: 18, symbol: "AVAX", name: 'AVAX', isNative: true },
        250: { address: undefined, decimals: 18, symbol: "FTM", name: 'FTM', isNative: true },
        4002: { address: undefined, decimals: 18, symbol: "FTM", name: 'FTM', isNative: true },
        13370: { address: undefined, decimals: 18, symbol: "ACT", name: 'ACT', isNative: true }, //Amino X Testnet
    };
    exports.ChainNativeTokenByChainId = ChainNativeTokenByChainId;
    const DefaultTokens = Object.keys(ChainNativeTokenByChainId).reduce((result, key) => {
        result[Number(key)] = [...DefaultERC20Tokens[Number(key)], ChainNativeTokenByChainId[Number(key)]];
        return result;
    }, {});
    exports.DefaultTokens = DefaultTokens;
});
define("@scom/scom-nft-minter/store/index.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-nft-minter/store/tokens/index.ts", "@scom/scom-nft-minter/store/tokens/index.ts"], function (require, exports, eth_wallet_4, index_3, index_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getContractAddress = exports.getCommissionFee = exports.getIPFSGatewayUrl = exports.setIPFSGatewayUrl = exports.setDataFromSCConfig = exports.state = exports.getNetworkName = exports.getTokenList = void 0;
    const getTokenList = (chainId) => {
        const tokenList = [...index_3.DefaultTokens[chainId]];
        return tokenList;
    };
    exports.getTokenList = getTokenList;
    const Networks = {
        1: 'Ethereuem',
        25: 'Cronos Mainnet',
        42: 'Kovan Test Network',
        56: 'Binance Smart Chain',
        97: 'BSC Testnet',
        137: 'Polygon',
        338: 'Cronos Testnet',
        31337: 'Amino Testnet',
        80001: 'Mumbai',
        43113: 'Avalanche FUJI C-Chain',
        43114: 'Avalanche Mainnet C-Chain',
        250: 'Fantom Opera',
        4002: 'Fantom Testnet',
        13370: 'AminoX Testnet'
    };
    const getNetworkName = (chainId) => {
        return Networks[chainId] || "";
    };
    exports.getNetworkName = getNetworkName;
    exports.state = {
        contractInfoByChain: {},
        ipfsGatewayUrl: "",
        commissionFee: "0"
    };
    const setDataFromSCConfig = (options) => {
        if (options.contractInfo) {
            setContractInfo(options.contractInfo);
        }
        if (options.ipfsGatewayUrl) {
            exports.setIPFSGatewayUrl(options.ipfsGatewayUrl);
        }
        if (options.commissionFee) {
            setCommissionFee(options.commissionFee);
        }
    };
    exports.setDataFromSCConfig = setDataFromSCConfig;
    const setContractInfo = (data) => {
        exports.state.contractInfoByChain = data;
    };
    const getContractInfo = (chainId) => {
        return exports.state.contractInfoByChain[chainId];
    };
    const setIPFSGatewayUrl = (url) => {
        exports.state.ipfsGatewayUrl = url;
    };
    exports.setIPFSGatewayUrl = setIPFSGatewayUrl;
    const getIPFSGatewayUrl = () => {
        return exports.state.ipfsGatewayUrl;
    };
    exports.getIPFSGatewayUrl = getIPFSGatewayUrl;
    const setCommissionFee = (fee) => {
        exports.state.commissionFee = fee;
    };
    const getCommissionFee = () => {
        return exports.state.commissionFee;
    };
    exports.getCommissionFee = getCommissionFee;
    const getContractAddress = (type) => {
        var _a;
        const chainId = eth_wallet_4.Wallet.getInstance().chainId;
        const contracts = getContractInfo(chainId) || {};
        return (_a = contracts[type]) === null || _a === void 0 ? void 0 : _a.address;
    };
    exports.getContractAddress = getContractAddress;
    __exportStar(index_4, exports);
});
define("@scom/scom-nft-minter/wallet/walletList.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.walletList = void 0;
    exports.walletList = [
        {
            name: eth_wallet_5.WalletPlugin.MetaMask,
            displayName: 'MetaMask',
            img: 'metamask'
        },
        {
            name: eth_wallet_5.WalletPlugin.TrustWallet,
            displayName: 'Trust Wallet',
            img: 'trustwallet'
        },
        {
            name: eth_wallet_5.WalletPlugin.BinanceChainWallet,
            displayName: 'Binance Chain Wallet',
            img: 'binanceChainWallet'
        },
        {
            name: eth_wallet_5.WalletPlugin.WalletConnect,
            displayName: 'WalletConnect',
            iconFile: 'walletconnect'
        }
    ];
});
define("@scom/scom-nft-minter/wallet/index.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-nft-minter/wallet/walletList.ts"], function (require, exports, components_1, eth_wallet_6, walletList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getChainId = exports.hasWallet = exports.connectWallet = exports.isWalletConnected = void 0;
    const defaultChainId = 1;
    function isWalletConnected() {
        const wallet = eth_wallet_6.Wallet.getClientInstance();
        return wallet.isConnected;
    }
    exports.isWalletConnected = isWalletConnected;
    async function connectWallet(walletPlugin, eventHandlers) {
        let wallet = eth_wallet_6.Wallet.getClientInstance();
        const walletOptions = '';
        let providerOptions = walletOptions[walletPlugin];
        if (!wallet.chainId) {
            wallet.chainId = defaultChainId;
        }
        await wallet.connect(walletPlugin, {
            onAccountChanged: (account) => {
                var _a, _b;
                if (eventHandlers && eventHandlers.accountsChanged) {
                    eventHandlers.accountsChanged(account);
                }
                const connected = !!account;
                if (connected) {
                    localStorage.setItem('walletProvider', ((_b = (_a = eth_wallet_6.Wallet.getClientInstance()) === null || _a === void 0 ? void 0 : _a.clientSideProvider) === null || _b === void 0 ? void 0 : _b.walletPlugin) || '');
                }
                components_1.application.EventBus.dispatch("isWalletConnected" /* IsWalletConnected */, connected);
            },
            onChainChanged: (chainIdHex) => {
                const chainId = Number(chainIdHex);
                if (eventHandlers && eventHandlers.chainChanged) {
                    eventHandlers.chainChanged(chainId);
                }
                components_1.application.EventBus.dispatch("chainChanged" /* chainChanged */, chainId);
            }
        }, providerOptions);
        return wallet;
    }
    exports.connectWallet = connectWallet;
    const hasWallet = () => {
        let hasWallet = false;
        for (let wallet of walletList_1.walletList) {
            if (eth_wallet_6.Wallet.isInstalled(wallet.name)) {
                hasWallet = true;
                break;
            }
        }
        return hasWallet;
    };
    exports.hasWallet = hasWallet;
    const getChainId = () => {
        const wallet = eth_wallet_6.Wallet.getInstance();
        return isWalletConnected() ? wallet.chainId : defaultChainId;
    };
    exports.getChainId = getChainId;
});
define("@scom/scom-nft-minter/config/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.textareaStyle = void 0;
    exports.textareaStyle = components_2.Styles.style({
        $nest: {
            'textarea': {
                border: 'none',
                outline: 'none'
            }
        }
    });
});
define("@scom/scom-nft-minter/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_3.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    const TokenFolderName = {
        1: "ethereum",
        25: "cronos",
        42: "kovan",
        56: "bsc",
        97: "bsc-testnet",
        137: "polygon",
        338: "cronos-testnet",
        31337: "amino",
        80001: "mumbai",
        43113: "fuji",
        43114: "avalanche",
        250: "fantom",
        4002: "fantom-testnet",
        13370: "aminox-testnet"
    };
    function tokenPath(tokenObj, chainId) {
        var _a;
        const pathPrefix = 'img/tokens';
        if (tokenObj && chainId && chainId >= 0) {
            let folderName = TokenFolderName[chainId];
            let fileName = (!tokenObj.isNative ? (_a = tokenObj === null || tokenObj === void 0 ? void 0 : tokenObj.address) === null || _a === void 0 ? void 0 : _a.toLowerCase() : tokenObj.symbol) + '.png';
            return fullPath(`${pathPrefix}/${folderName}/${fileName}`);
        }
        else {
            return fullPath(`${pathPrefix}/Custom.png`);
        }
    }
    exports.default = {
        logo: fullPath('img/logo.svg'),
        fullPath,
        tokenPath
    };
});
define("@scom/scom-nft-minter/token-selection/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.modalStyle = exports.tokenStyle = exports.buttonStyle = exports.scrollbarStyle = void 0;
    const Theme = components_4.Styles.Theme.ThemeVars;
    exports.scrollbarStyle = components_4.Styles.style({
        $nest: {
            '&::-webkit-scrollbar-track': {
                borderRadius: '12px',
                border: '1px solid transparent',
                backgroundColor: 'unset'
            },
            '&::-webkit-scrollbar': {
                width: '8px',
                backgroundColor: 'unset'
            },
            '&::-webkit-scrollbar-thumb': {
                borderRadius: '12px',
                background: '#d3d3d3 0% 0% no-repeat padding-box'
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: '#bababa 0% 0% no-repeat padding-box'
            }
        }
    });
    exports.buttonStyle = components_4.Styles.style({
        boxShadow: 'none'
    });
    exports.tokenStyle = components_4.Styles.style({
        $nest: {
            '&:hover': {
                background: Theme.action.hover
            }
        }
    });
    exports.modalStyle = components_4.Styles.style({
        $nest: {
            '.modal': {
                padding: 0,
                paddingBottom: '1rem',
                borderRadius: 8
            }
        }
    });
});
define("@scom/scom-nft-minter/token-selection/index.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-nft-minter/store/index.ts", "@scom/scom-nft-minter/assets.ts", "@scom/scom-nft-minter/wallet/index.ts", "@scom/scom-nft-minter/token-selection/index.css.ts"], function (require, exports, components_5, index_5, assets_1, index_6, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TokenSelection = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    const fallBackUrl = assets_1.default.tokenPath();
    ;
    let TokenSelection = class TokenSelection extends components_5.Module {
        constructor(parent, options) {
            super(parent, options);
            this._readonly = false;
            this.isInited = false;
            this.sortToken = (a, b, asc) => {
                const _symbol1 = a.symbol.toLowerCase();
                const _symbol2 = b.symbol.toLowerCase();
                if (_symbol1 < _symbol2) {
                    return -1;
                }
                if (_symbol1 > _symbol2) {
                    return 1;
                }
                return 0;
            };
            this.selectToken = (token) => {
                if (!this.enabled || this._readonly)
                    return;
                this.token = token;
                this.updateTokenButton(token);
                this.mdTokenSelection.visible = false;
                if (this.onSelectToken)
                    this.onSelectToken(token);
            };
            this.$eventBus = components_5.application.EventBus;
            this.registerEvent();
        }
        ;
        get token() {
            return this._token;
        }
        set token(value) {
            this._token = value;
            this.updateTokenButton(value);
        }
        get chainId() {
            return this._chainId;
        }
        set chainId(value) {
            this._chainId = value;
        }
        get readonly() {
            return this._readonly;
        }
        set readonly(value) {
            if (this._readonly != value) {
                this._readonly = value;
                this.btnTokens.style.cursor = this._readonly ? 'unset' : '';
                this.btnTokens.rightIcon.visible = !this._readonly;
            }
        }
        onSetup(init) {
            if (!this.isInited)
                this.init();
            this.renderTokenItems();
            if (init && this.token && !this.readonly) {
                const chainId = index_6.getChainId();
                const _tokenList = index_5.getTokenList(chainId);
                const token = _tokenList.find(t => { var _a, _b; return (t.address && t.address == ((_a = this.token) === null || _a === void 0 ? void 0 : _a.address)) || (t.symbol == ((_b = this.token) === null || _b === void 0 ? void 0 : _b.symbol)); });
                if (!token) {
                    this.token = undefined;
                }
            }
            if (this.token) {
                this.updateTokenButton(this.token);
            }
        }
        registerEvent() {
            this.$eventBus.register(this, "isWalletConnected" /* IsWalletConnected */, () => this.onSetup());
            this.$eventBus.register(this, "IsWalletDisconnected" /* IsWalletDisconnected */, () => this.onSetup());
            this.$eventBus.register(this, "chainChanged" /* chainChanged */, () => this.onSetup(true));
        }
        get tokenList() {
            const chainId = index_6.getChainId();
            const _tokenList = index_5.getTokenList(chainId);
            return _tokenList.map((token) => {
                const tokenObject = Object.assign({}, token);
                const nativeToken = index_5.ChainNativeTokenByChainId[chainId];
                if (token.symbol === nativeToken.symbol) {
                    Object.assign(tokenObject, { isNative: true });
                }
                if (!index_6.isWalletConnected()) {
                    Object.assign(tokenObject, {
                        balance: 0,
                    });
                }
                return tokenObject;
            }).sort(this.sortToken);
        }
        renderTokenItems() {
            this.gridTokenList.clearInnerHTML();
            const _tokenList = this.tokenList;
            if (_tokenList.length) {
                const tokenItems = _tokenList.map((token) => this.renderToken(token));
                this.gridTokenList.append(...tokenItems);
            }
            else {
                this.gridTokenList.append(this.$render("i-label", { margin: { top: '1rem', bottom: '1rem' }, caption: 'No tokens found' }));
            }
        }
        renderToken(token) {
            const chainId = index_6.getChainId();
            const tokenIconPath = assets_1.default.tokenPath(token, chainId);
            return (this.$render("i-hstack", { width: '100%', class: `pointer ${index_css_1.tokenStyle}`, verticalAlignment: 'center', padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, border: { radius: 5 }, gap: '0.5rem', onClick: () => this.selectToken(token) },
                this.$render("i-image", { width: 36, height: 36, url: tokenIconPath, fallbackUrl: fallBackUrl }),
                this.$render("i-vstack", { gap: '0.25rem' },
                    this.$render("i-label", { font: { size: '0.875rem', bold: true }, caption: token.symbol }),
                    this.$render("i-label", { font: { size: '0.75rem' }, caption: token.name }))));
        }
        updateTokenButton(token) {
            const chainId = this.chainId || index_6.getChainId();
            if (token) {
                const tokenIconPath = assets_1.default.tokenPath(token, chainId);
                const icon = new components_5.Icon(this.btnTokens, {
                    width: 28,
                    height: 28,
                    image: {
                        url: tokenIconPath,
                        fallBackUrl: fallBackUrl
                    }
                });
                this.btnTokens.icon = icon;
                this.btnTokens.caption = token.symbol;
                this.btnTokens.font = { bold: true, color: Theme.input.fontColor };
            }
            else {
                this.btnTokens.icon = undefined;
                this.btnTokens.caption = 'Select a token';
                this.btnTokens.font = { bold: false, color: Theme.input.fontColor };
            }
        }
        showTokenModal() {
            if (!this.enabled || this._readonly)
                return;
            this.mdTokenSelection.visible = true;
            this.gridTokenList.scrollTop = 0;
        }
        closeTokenModal() {
            this.mdTokenSelection.visible = false;
        }
        init() {
            super.init();
            this.readonly = this.getAttribute('readonly', true, false);
            this.isInited = true;
        }
        render() {
            return (this.$render("i-panel", null,
                this.$render("i-button", { id: 'btnTokens', class: `${index_css_1.buttonStyle} token-button`, width: '100%', height: 40, caption: 'Select a token', rightIcon: { width: 14, height: 14, name: 'angle-down' }, border: { radius: 0 }, background: { color: 'transparent' }, font: { color: Theme.input.fontColor }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }, onClick: this.showTokenModal.bind(this) }),
                this.$render("i-modal", { id: 'mdTokenSelection', class: index_css_1.modalStyle, width: 400 },
                    this.$render("i-hstack", { horizontalAlignment: 'space-between', verticalAlignment: 'center', padding: { top: '1rem', bottom: '1rem' }, border: { bottom: { width: 1, style: 'solid', color: '#f1f1f1' } }, margin: { bottom: '1rem', left: '1rem', right: '1rem' }, gap: 4 },
                        this.$render("i-label", { caption: 'Select a token', font: { size: '1.125rem', bold: true } }),
                        this.$render("i-icon", { width: 24, height: 24, class: 'pointer', name: 'times', fill: Theme.colors.primary.main, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.25rem', right: '0.25rem' }, onClick: this.closeTokenModal.bind(this) })),
                    this.$render("i-grid-layout", { id: 'gridTokenList', class: index_css_1.scrollbarStyle, maxHeight: '45vh', columnsPerRow: 1, overflow: { y: 'auto' }, padding: { bottom: '0.5rem', left: '0.5rem', right: '0.5rem' } }))));
        }
    };
    TokenSelection = __decorate([
        components_5.customElements('nft-minter-token-selection')
    ], TokenSelection);
    exports.TokenSelection = TokenSelection;
});
define("@scom/scom-nft-minter/config/index.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-nft-minter/interface/index.tsx", "@scom/scom-nft-minter/config/index.css.ts", "@ijstech/eth-wallet", "@scom/scom-nft-minter/utils/index.ts"], function (require, exports, components_6, index_7, index_css_2, eth_wallet_7, index_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_6.Styles.Theme.ThemeVars;
    const ComboProductTypeItems = [
        {
            value: index_7.ProductType.Buy,
            label: 'Buy'
        },
        {
            value: index_7.ProductType.DonateToOwner,
            label: 'Donate To Owner'
        },
        {
            value: index_7.ProductType.DonateToEveryone,
            label: 'Donate To Everyone'
        }
    ];
    let Config = class Config extends components_6.Module {
        constructor() {
            super(...arguments);
            this.commissionsTableColumns = [
                {
                    title: 'Wallet Address',
                    fieldName: 'walletAddress',
                    key: 'walletAddress'
                },
                {
                    title: 'Share',
                    fieldName: 'share',
                    key: 'share',
                    onRenderCell: function (source, columnData, rowData) {
                        return index_8.formatNumber(new eth_wallet_7.BigNumber(columnData).times(100).toFixed(), 4) + '%';
                    }
                },
                {
                    title: '',
                    fieldName: '',
                    key: '',
                    textAlign: 'center',
                    onRenderCell: async (source, data, rowData) => {
                        const icon = new components_6.Icon(undefined, {
                            name: "times",
                            fill: "#f7d063",
                            height: 18,
                            width: 18
                        });
                        icon.onClick = async (source) => {
                            const index = this.commissionInfoList.findIndex(v => v.walletAddress == rowData.walletAddress);
                            if (index >= 0) {
                                this.commissionInfoList.splice(index, 1);
                                this.tableCommissions.data = this.commissionInfoList;
                            }
                        };
                        return icon;
                    }
                }
            ];
        }
        async init() {
            super.init();
            this.commissionInfoList = [];
            this.onComboProductTypeChanged();
        }
        get data() {
            const config = {
                name: this.edtName.value || "",
                productType: this.comboProductType.selectedItem.value,
                description: this.edtDescription.value || "",
                link: this.edtLink.value || ""
            };
            if (this.edtPrice.value) {
                config.price = this.edtPrice.value;
            }
            if (this.edtMaxPrice.value) {
                config.maxPrice = this.edtMaxPrice.value;
            }
            const qty = Number(this.edtQty.value);
            if (this.edtQty.value && Number.isInteger(qty)) {
                config.qty = qty;
            }
            const maxOrderQty = Number(this.edtMaxOrderQty.value);
            if (this.edtMaxOrderQty.value && Number.isInteger(maxOrderQty)) {
                config.maxOrderQty = maxOrderQty;
            }
            if (this._logo) {
                config.logo = this._logo;
            }
            if (this.tokenSelection.token) {
                config.token = this.tokenSelection.token;
            }
            config.commissions = this.tableCommissions.data || [];
            return config;
        }
        set data(config) {
            this.uploadLogo.clear();
            if (config.logo) {
                this.uploadLogo.preview(config.logo);
            }
            this.edtName.value = config.name || "";
            this.comboProductType.selectedItem = ComboProductTypeItems.find(v => v.value == config.productType);
            this.onComboProductTypeChanged();
            this._logo = config.logo;
            this.edtLink.value = config.link || "";
            this.edtPrice.value = config.price || "";
            this.edtMaxPrice.value = config.maxPrice || "";
            this.edtMaxOrderQty.value = config.maxOrderQty || "";
            this.edtQty.value = config.qty || "";
            this.edtDescription.value = config.description || "";
            this.tokenSelection.token = config.token;
            this.tableCommissions.data = config.commissions || [];
            this.onMarkdownChanged();
        }
        async onChangeFile(source, files) {
            this._logo = files.length ? await this.uploadLogo.toBase64(files[0]) : undefined;
        }
        onRemove(source, file) {
            this._logo = undefined;
        }
        onMarkdownChanged() {
            this.markdownViewer.load(this.edtDescription.value || "");
        }
        onComboProductTypeChanged() {
            const selectedItem = this.comboProductType.selectedItem;
            if (selectedItem.value == index_7.ProductType.Buy) {
                this.edtMaxOrderQty.enabled = true;
                this.edtPrice.enabled = true;
                this.edtMaxPrice.enabled = false;
                this.edtMaxPrice.value = '0';
                this.edtMaxOrderQty.value = '';
                this.edtPrice.value = '';
            }
            else {
                this.edtMaxOrderQty.enabled = false;
                this.edtPrice.enabled = false;
                this.edtMaxPrice.enabled = true;
                this.edtMaxPrice.value = '';
                this.edtMaxOrderQty.value = '1';
                this.edtPrice.value = '0';
            }
        }
        onAddCommissionClicked() {
            this.modalAddCommission.visible = true;
        }
        onConfirmCommissionClicked() {
            if (!this.inputWalletAddress.value || !this.inputShare.value)
                return;
            this.modalAddCommission.visible = false;
            this.commissionInfoList.push({
                walletAddress: this.inputWalletAddress.value,
                share: new eth_wallet_7.BigNumber(this.inputShare.value).div(100).toFixed()
            });
            this.tableCommissions.data = this.commissionInfoList;
            this.inputWalletAddress.value = '';
            this.inputShare.value = '';
        }
        render() {
            return (this.$render("i-vstack", { gap: '0.5rem', padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                this.$render("i-label", { caption: 'Dapp Type:' }),
                this.$render("i-combo-box", { id: 'comboProductType', width: '100%', icon: { width: 14, height: 14, name: 'angle-down' }, items: ComboProductTypeItems, selectedItem: ComboProductTypeItems[0], onChanged: this.onComboProductTypeChanged.bind(this) }),
                this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                    this.$render("i-label", { caption: 'Name' }),
                    this.$render("i-label", { caption: "*", font: { color: Theme.colors.error.main } })),
                this.$render("i-input", { id: 'edtName', width: '100%' }),
                this.$render("i-label", { caption: 'Logo:' }),
                this.$render("i-upload", { id: 'uploadLogo', margin: { top: 8, bottom: 0 }, accept: 'image/*', draggable: true, caption: 'Drag and drop image here', showFileList: false, onChanged: this.onChangeFile.bind(this), onRemoved: this.onRemove.bind(this) }),
                this.$render("i-label", { caption: 'Descriptions:' }),
                this.$render("i-grid-layout", { templateColumns: ['50%', '50%'] },
                    this.$render("i-input", { id: 'edtDescription', class: index_css_2.textareaStyle, width: '100%', height: '100%', display: 'flex', stack: { grow: '1' }, resize: "none", inputType: 'textarea', font: { size: Theme.typography.fontSize, name: Theme.typography.fontFamily }, onChanged: this.onMarkdownChanged.bind(this) }),
                    this.$render("i-markdown", { id: 'markdownViewer', width: '100%', height: '100%', padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' } })),
                this.$render("i-label", { caption: 'Link:' }),
                this.$render("i-input", { id: 'edtLink', width: '100%' }),
                this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                    this.$render("i-label", { caption: 'Token' }),
                    this.$render("i-label", { caption: "*", font: { color: Theme.colors.error.main } })),
                this.$render("nft-minter-token-selection", { id: 'tokenSelection', width: '100%', background: { color: Theme.input.background }, border: { width: 1, style: 'solid', color: Theme.divider } }),
                this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                    this.$render("i-label", { caption: 'Price' }),
                    this.$render("i-label", { caption: "*", font: { color: Theme.colors.error.main } })),
                this.$render("i-input", { id: 'edtPrice', width: '100%', inputType: 'number' }),
                this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                    this.$render("i-label", { caption: 'Max Price' })),
                this.$render("i-input", { id: 'edtMaxPrice', width: '100%', inputType: 'number' }),
                this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                    this.$render("i-label", { caption: 'Qty' }),
                    this.$render("i-label", { caption: "*", font: { color: Theme.colors.error.main } })),
                this.$render("i-input", { id: 'edtQty', width: '100%', inputType: 'number' }),
                this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                    this.$render("i-label", { caption: 'Max Order Qty' }),
                    this.$render("i-label", { caption: "*", font: { color: Theme.colors.error.main } })),
                this.$render("i-input", { id: 'edtMaxOrderQty', width: '100%', inputType: 'number' }),
                this.$render("i-hstack", { gap: 4, verticalAlignment: "center", horizontalAlignment: "space-between" },
                    this.$render("i-label", { caption: 'Commissions' }),
                    this.$render("i-button", { caption: "Add", padding: { top: '0.4rem', bottom: '0.4rem', left: '2rem', right: '2rem' }, onClick: this.onAddCommissionClicked.bind(this) })),
                this.$render("i-table", { id: 'tableCommissions', data: this.commissionInfoList, columns: this.commissionsTableColumns }),
                this.$render("i-modal", { id: 'modalAddCommission', maxWidth: '500px', closeIcon: { name: 'times-circle' } },
                    this.$render("i-grid-layout", { width: '100%', verticalAlignment: 'center', gap: { row: 5 }, padding: { top: '1rem', bottom: '1rem', left: '2rem', right: '2rem' }, templateColumns: ['1fr', '1fr'], templateRows: ['auto', 'auto', 'auto', 'auto'], templateAreas: [
                            ['title', 'title'],
                            ["lbWalletAddress", "walletAddress"],
                            ["lbShare", "share"],
                            ['btnConfirm', 'btnConfirm']
                        ] },
                        this.$render("i-hstack", { width: '100%', horizontalAlignment: 'center', grid: { area: 'title' }, padding: { bottom: '1rem' } },
                            this.$render("i-label", { caption: "Add Commission" })),
                        this.$render("i-label", { caption: "Wallet Address", grid: { area: 'lbWalletAddress' } }),
                        this.$render("i-input", { id: 'inputWalletAddress', grid: { area: 'walletAddress' }, width: '100%' }),
                        this.$render("i-label", { caption: "Share", grid: { area: 'lbShare' } }),
                        this.$render("i-hstack", { verticalAlignment: "center", grid: { area: 'share' }, width: '100%' },
                            this.$render("i-input", { id: 'inputShare' }),
                            this.$render("i-label", { caption: "%" })),
                        this.$render("i-hstack", { width: '100%', horizontalAlignment: 'center', grid: { area: 'btnConfirm' }, padding: { top: '1rem' } },
                            this.$render("i-button", { caption: "Confirm", padding: { top: '0.4rem', bottom: '0.4rem', left: '2rem', right: '2rem' }, onClick: this.onConfirmCommissionClicked.bind(this) }))))));
        }
    };
    Config = __decorate([
        components_6.customModule,
        components_6.customElements("nft-minter-config")
    ], Config);
    exports.default = Config;
});
define("@scom/scom-nft-minter/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tokenSelectionStyle = exports.inputGroupStyle = exports.inputStyle = exports.markdownStyle = exports.imageStyle = void 0;
    const Theme = components_7.Styles.Theme.ThemeVars;
    // Styles.Theme.defaultTheme.background.modal = "#fff";
    // Styles.Theme.applyTheme(Styles.Theme.defaultTheme);
    exports.imageStyle = components_7.Styles.style({
        $nest: {
            '&>img': {
                maxWidth: 'unset',
                maxHeight: 'unset',
                borderRadius: 4
            }
        }
    });
    exports.markdownStyle = components_7.Styles.style({
        overflowWrap: 'break-word'
    });
    exports.inputStyle = components_7.Styles.style({
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
    exports.inputGroupStyle = components_7.Styles.style({
        border: '2px solid transparent',
        background: 'linear-gradient(#232B5A, #232B5A), linear-gradient(254.8deg, #E75B66 -8.08%, #B52082 84.35%)',
        backgroundOrigin: 'border-box !important',
        backgroundClip: 'content-box, border-box !important',
        borderRadius: 16
    });
    exports.tokenSelectionStyle = components_7.Styles.style({
        $nest: {
            'i-button.token-button': {
                justifyContent: 'start'
            }
        }
    });
});
define("@scom/scom-nft-minter/alert/index.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Alert = void 0;
    const Theme = components_8.Styles.Theme.ThemeVars;
    ;
    let Alert = class Alert extends components_8.Module {
        get message() {
            return this._message;
        }
        set message(value) {
            this._message = value;
            this.mdAlert.onClose = this._message.onClose;
        }
        get iconName() {
            if (this.message.status === 'error')
                return 'times';
            else if (this.message.status === 'warning')
                return 'exclamation';
            else if (this.message.status === 'success')
                return 'check';
            else
                return 'spinner';
        }
        get color() {
            if (this.message.status === 'error')
                return Theme.colors.error.main;
            else if (this.message.status === 'warning')
                return Theme.colors.warning.main;
            else if (this.message.status === 'success')
                return Theme.colors.success.main;
            else
                return Theme.colors.primary.main;
        }
        closeModal() {
            this.mdAlert.visible = false;
        }
        showModal() {
            this.renderUI();
            this.mdAlert.visible = true;
        }
        renderUI() {
            this.pnlMain.clearInnerHTML();
            const content = this.renderContent();
            const border = this.message.status === 'loading' ? {} : { border: { width: 2, style: 'solid', color: this.color, radius: '50%' } };
            this.pnlMain.appendChild(this.$render("i-vstack", { horizontalAlignment: "center", gap: "1.75rem" },
                this.$render("i-icon", Object.assign({ width: 55, height: 55, name: this.iconName, fill: this.color, padding: { top: "0.6rem", bottom: "0.6rem", left: "0.6rem", right: "0.6rem" }, spin: this.message.status === 'loading' }, border)),
                content,
                this.$render("i-button", { padding: { top: "0.5rem", bottom: "0.5rem", left: "2rem", right: "2rem" }, caption: "Close", font: { color: Theme.colors.primary.contrastText }, onClick: this.closeModal.bind(this) })));
        }
        renderContent() {
            if (!this.message.title && !this.message.content)
                return [];
            const lblTitle = this.message.title ? this.$render("i-label", { caption: this.message.title, font: { size: '1.25rem', bold: true } }) : [];
            const lblContent = this.message.content ? this.$render("i-label", { caption: this.message.content, overflowWrap: 'anywhere' }) : [];
            return (this.$render("i-vstack", { class: "text-center", horizontalAlignment: "center", gap: "0.75rem", lineHeight: 1.5 },
                lblTitle,
                lblContent));
        }
        render() {
            return (this.$render("i-modal", { id: "mdAlert", maxWidth: "400px", maxHeight: "300px" },
                this.$render("i-panel", { id: "pnlMain", width: "100%", padding: { top: "1rem", bottom: "1.5rem", left: "1rem", right: "1rem" } })));
        }
    };
    Alert = __decorate([
        components_8.customElements('nft-minter-alert')
    ], Alert);
    exports.Alert = Alert;
    ;
});
define("@scom/scom-nft-minter/contracts/scom-product-contract/contracts/@openzeppelin/contracts/token/ERC1155/ERC1155.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/contracts/scom-product-contract/contracts/@openzeppelin/contracts/token/ERC1155/ERC1155.json.ts'/> 
    exports.default = {
        "abi": [
            { "inputs": [{ "internalType": "string", "name": "uri_", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "TransferBatch", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "TransferSingle", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "URI", "type": "event" },
            { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }], "name": "balanceOfBatch", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "uri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }
        ],
        "bytecode": "60806040523480156200001157600080fd5b5060405162001d5238038062001d5283398101604081905262000034916200006e565b6200003f8162000046565b506200029e565b6002620000548282620001d2565b5050565b634e487b7160e01b600052604160045260246000fd5b600060208083850312156200008257600080fd5b82516001600160401b03808211156200009a57600080fd5b818501915085601f830112620000af57600080fd5b815181811115620000c457620000c462000058565b604051601f8201601f19908116603f01168101908382118183101715620000ef57620000ef62000058565b8160405282815288868487010111156200010857600080fd5b600093505b828410156200012c57848401860151818501870152928501926200010d565b600086848301015280965050505050505092915050565b600181811c908216806200015857607f821691505b6020821081036200017957634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620001cd57600081815260208120601f850160051c81016020861015620001a85750805b601f850160051c820191505b81811015620001c957828155600101620001b4565b5050505b505050565b81516001600160401b03811115620001ee57620001ee62000058565b6200020681620001ff845462000143565b846200017f565b602080601f8311600181146200023e5760008415620002255750858301515b600019600386901b1c1916600185901b178555620001c9565b600085815260208120601f198616915b828110156200026f578886015182559484019460019091019084016200024e565b50858210156200028e5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b611aa480620002ae6000396000f3fe608060405234801561001057600080fd5b50600436106100875760003560e01c80634e1273f41161005b5780634e1273f41461010a578063a22cb4651461012a578063e985e9c51461013d578063f242432a1461018657600080fd5b8062fdd58e1461008c57806301ffc9a7146100b25780630e89341c146100d55780632eb2c2d6146100f5575b600080fd5b61009f61009a366004611261565b610199565b6040519081526020015b60405180910390f35b6100c56100c03660046112bc565b610279565b60405190151581526020016100a9565b6100e86100e33660046112e0565b61035c565b6040516100a9919061135d565b610108610103366004611511565b6103f0565b005b61011d6101183660046115bb565b6104b9565b6040516100a991906116c1565b6101086101383660046116d4565b610611565b6100c561014b366004611710565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205460ff1690565b610108610194366004611743565b610620565b600073ffffffffffffffffffffffffffffffffffffffff8316610243576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201527f616c6964206f776e65720000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b5060008181526020818152604080832073ffffffffffffffffffffffffffffffffffffffff861684529091529020545b92915050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167fd9b67a2600000000000000000000000000000000000000000000000000000000148061030c57507fffffffff0000000000000000000000000000000000000000000000000000000082167f0e89341c00000000000000000000000000000000000000000000000000000000145b8061027357507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff00000000000000000000000000000000000000000000000000000000831614610273565b60606002805461036b906117a8565b80601f0160208091040260200160405190810160405280929190818152602001828054610397906117a8565b80156103e45780601f106103b9576101008083540402835291602001916103e4565b820191906000526020600020905b8154815290600101906020018083116103c757829003601f168201915b50505050509050919050565b73ffffffffffffffffffffffffffffffffffffffff85163314806104195750610419853361014b565b6104a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f766564000000000000000000000000000000000000606482015260840161023a565b6104b285858585856106e2565b5050505050565b6060815183511461054c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e67746860448201527f206d69736d617463680000000000000000000000000000000000000000000000606482015260840161023a565b6000835167ffffffffffffffff81111561056857610568611370565b604051908082528060200260200182016040528015610591578160200160208202803683370190505b50905060005b8451811015610609576105dc8582815181106105b5576105b56117fb565b60200260200101518583815181106105cf576105cf6117fb565b6020026020010151610199565b8282815181106105ee576105ee6117fb565b602090810291909101015261060281611859565b9050610597565b509392505050565b61061c338383610a1c565b5050565b73ffffffffffffffffffffffffffffffffffffffff85163314806106495750610649853361014b565b6106d5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f766564000000000000000000000000000000000000606482015260840161023a565b6104b28585858585610b6f565b8151835114610773576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060448201527f6d69736d61746368000000000000000000000000000000000000000000000000606482015260840161023a565b73ffffffffffffffffffffffffffffffffffffffff8416610816576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f20616460448201527f6472657373000000000000000000000000000000000000000000000000000000606482015260840161023a565b3360005b8451811015610987576000858281518110610837576108376117fb565b602002602001015190506000858381518110610855576108556117fb565b6020908102919091018101516000848152808352604080822073ffffffffffffffffffffffffffffffffffffffff8e168352909352919091205490915081811015610922576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201527f72207472616e7366657200000000000000000000000000000000000000000000606482015260840161023a565b60008381526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8e8116855292528083208585039055908b1682528120805484929061096c908490611891565b925050819055505050508061098090611859565b905061081a565b508473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb87876040516109fe9291906118a4565b60405180910390a4610a14818787878787610dad565b505050505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610ad7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c2073746174757360448201527f20666f722073656c660000000000000000000000000000000000000000000000606482015260840161023a565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8416610c12576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f20616460448201527f6472657373000000000000000000000000000000000000000000000000000000606482015260840161023a565b336000610c1e85611040565b90506000610c2b85611040565b905060008681526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8c16845290915290205485811015610ceb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201527f72207472616e7366657200000000000000000000000000000000000000000000606482015260840161023a565b60008781526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8d8116855292528083208985039055908a16825281208054889290610d35908490611891565b9091555050604080518881526020810188905273ffffffffffffffffffffffffffffffffffffffff808b16928c821692918816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4610da2848a8a8a8a8a61108b565b505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff84163b15610a14576040517fbc197c8100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063bc197c8190610e2490899089908890889088906004016118d2565b6020604051808303816000875af1925050508015610e7d575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201909252610e7a9181019061193d565b60015b610f6657610e8961195a565b806308c379a003610edc5750610e9d611976565b80610ea85750610ede565b806040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161023a919061135d565b505b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e2d4552433131353560448201527f526563656976657220696d706c656d656e746572000000000000000000000000606482015260840161023a565b7fffffffff0000000000000000000000000000000000000000000000000000000081167fbc197c810000000000000000000000000000000000000000000000000000000014611037576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a6563746560448201527f6420746f6b656e73000000000000000000000000000000000000000000000000606482015260840161023a565b50505050505050565b6040805160018082528183019092526060916000919060208083019080368337019050509050828160008151811061107a5761107a6117fb565b602090810291909101015292915050565b73ffffffffffffffffffffffffffffffffffffffff84163b15610a14576040517ff23a6e6100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063f23a6e61906111029089908990889088908890600401611a1e565b6020604051808303816000875af192505050801561115b575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526111589181019061193d565b60015b61116757610e8961195a565b7fffffffff0000000000000000000000000000000000000000000000000000000081167ff23a6e610000000000000000000000000000000000000000000000000000000014611037576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a6563746560448201527f6420746f6b656e73000000000000000000000000000000000000000000000000606482015260840161023a565b803573ffffffffffffffffffffffffffffffffffffffff8116811461125c57600080fd5b919050565b6000806040838503121561127457600080fd5b61127d83611238565b946020939093013593505050565b7fffffffff00000000000000000000000000000000000000000000000000000000811681146112b957600080fd5b50565b6000602082840312156112ce57600080fd5b81356112d98161128b565b9392505050565b6000602082840312156112f257600080fd5b5035919050565b6000815180845260005b8181101561131f57602081850181015186830182015201611303565b5060006020828601015260207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f83011685010191505092915050565b6020815260006112d960208301846112f9565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116810181811067ffffffffffffffff821117156113e3576113e3611370565b6040525050565b600067ffffffffffffffff82111561140457611404611370565b5060051b60200190565b600082601f83011261141f57600080fd5b8135602061142c826113ea565b604051611439828261139f565b83815260059390931b850182019282810191508684111561145957600080fd5b8286015b84811015611474578035835291830191830161145d565b509695505050505050565b600082601f83011261149057600080fd5b813567ffffffffffffffff8111156114aa576114aa611370565b6040516114df60207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f850116018261139f565b8181528460208386010111156114f457600080fd5b816020850160208301376000918101602001919091529392505050565b600080600080600060a0868803121561152957600080fd5b61153286611238565b945061154060208701611238565b9350604086013567ffffffffffffffff8082111561155d57600080fd5b61156989838a0161140e565b9450606088013591508082111561157f57600080fd5b61158b89838a0161140e565b935060808801359150808211156115a157600080fd5b506115ae8882890161147f565b9150509295509295909350565b600080604083850312156115ce57600080fd5b823567ffffffffffffffff808211156115e657600080fd5b818501915085601f8301126115fa57600080fd5b81356020611607826113ea565b604051611614828261139f565b83815260059390931b850182019282810191508984111561163457600080fd5b948201945b838610156116595761164a86611238565b82529482019490820190611639565b9650508601359250508082111561166f57600080fd5b5061167c8582860161140e565b9150509250929050565b600081518084526020808501945080840160005b838110156116b65781518752958201959082019060010161169a565b509495945050505050565b6020815260006112d96020830184611686565b600080604083850312156116e757600080fd5b6116f083611238565b91506020830135801515811461170557600080fd5b809150509250929050565b6000806040838503121561172357600080fd5b61172c83611238565b915061173a60208401611238565b90509250929050565b600080600080600060a0868803121561175b57600080fd5b61176486611238565b945061177260208701611238565b93506040860135925060608601359150608086013567ffffffffffffffff81111561179c57600080fd5b6115ae8882890161147f565b600181811c908216806117bc57607f821691505b6020821081036117f5577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361188a5761188a61182a565b5060010190565b808201808211156102735761027361182a565b6040815260006118b76040830185611686565b82810360208401526118c98185611686565b95945050505050565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525060a0604083015261190b60a0830186611686565b828103606084015261191d8186611686565b9050828103608084015261193181856112f9565b98975050505050505050565b60006020828403121561194f57600080fd5b81516112d98161128b565b600060033d11156119735760046000803e5060005160e01c5b90565b600060443d10156119845790565b6040517ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc803d016004833e81513d67ffffffffffffffff81602484011181841117156119d257505050505090565b82850191508151818111156119ea5750505050505090565b843d8701016020828501011115611a045750505050505090565b611a136020828601018761139f565b509095945050505050565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525084604083015283606083015260a06080830152611a6360a08301846112f9565b97965050505050505056fea26469706673582212203a69c1a68f227678251609f269752d54393fc99a72e821c3351a79331c15f77164736f6c63430008110033"
    };
});
define("@scom/scom-nft-minter/contracts/scom-product-contract/contracts/@openzeppelin/contracts/token/ERC1155/ERC1155.ts", ["require", "exports", "@ijstech/eth-contract", "@scom/scom-nft-minter/contracts/scom-product-contract/contracts/@openzeppelin/contracts/token/ERC1155/ERC1155.json.ts"], function (require, exports, eth_contract_1, ERC1155_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ERC1155 = void 0;
    class ERC1155 extends eth_contract_1.Contract {
        constructor(wallet, address) {
            super(wallet, address, ERC1155_json_1.default.abi, ERC1155_json_1.default.bytecode);
            this.assign();
        }
        deploy(uri, options) {
            return this.__deploy([uri], options);
        }
        parseApprovalForAllEvent(receipt) {
            return this.parseEvents(receipt, "ApprovalForAll").map(e => this.decodeApprovalForAllEvent(e));
        }
        decodeApprovalForAllEvent(event) {
            let result = event.data;
            return {
                account: result.account,
                operator: result.operator,
                approved: result.approved,
                _event: event
            };
        }
        parseTransferBatchEvent(receipt) {
            return this.parseEvents(receipt, "TransferBatch").map(e => this.decodeTransferBatchEvent(e));
        }
        decodeTransferBatchEvent(event) {
            let result = event.data;
            return {
                operator: result.operator,
                from: result.from,
                to: result.to,
                ids: result.ids.map(e => new eth_contract_1.BigNumber(e)),
                values: result.values.map(e => new eth_contract_1.BigNumber(e)),
                _event: event
            };
        }
        parseTransferSingleEvent(receipt) {
            return this.parseEvents(receipt, "TransferSingle").map(e => this.decodeTransferSingleEvent(e));
        }
        decodeTransferSingleEvent(event) {
            let result = event.data;
            return {
                operator: result.operator,
                from: result.from,
                to: result.to,
                id: new eth_contract_1.BigNumber(result.id),
                value: new eth_contract_1.BigNumber(result.value),
                _event: event
            };
        }
        parseURIEvent(receipt) {
            return this.parseEvents(receipt, "URI").map(e => this.decodeURIEvent(e));
        }
        decodeURIEvent(event) {
            let result = event.data;
            return {
                value: result.value,
                id: new eth_contract_1.BigNumber(result.id),
                _event: event
            };
        }
        assign() {
            let balanceOfParams = (params) => [params.account, this.wallet.utils.toString(params.id)];
            let balanceOf_call = async (params, options) => {
                let result = await this.call('balanceOf', balanceOfParams(params), options);
                return new eth_contract_1.BigNumber(result);
            };
            this.balanceOf = balanceOf_call;
            let balanceOfBatchParams = (params) => [params.accounts, this.wallet.utils.toString(params.ids)];
            let balanceOfBatch_call = async (params, options) => {
                let result = await this.call('balanceOfBatch', balanceOfBatchParams(params), options);
                return result.map(e => new eth_contract_1.BigNumber(e));
            };
            this.balanceOfBatch = balanceOfBatch_call;
            let isApprovedForAllParams = (params) => [params.account, params.operator];
            let isApprovedForAll_call = async (params, options) => {
                let result = await this.call('isApprovedForAll', isApprovedForAllParams(params), options);
                return result;
            };
            this.isApprovedForAll = isApprovedForAll_call;
            let supportsInterface_call = async (interfaceId, options) => {
                let result = await this.call('supportsInterface', [interfaceId], options);
                return result;
            };
            this.supportsInterface = supportsInterface_call;
            let uri_call = async (param1, options) => {
                let result = await this.call('uri', [this.wallet.utils.toString(param1)], options);
                return result;
            };
            this.uri = uri_call;
            let safeBatchTransferFromParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.ids), this.wallet.utils.toString(params.amounts), this.wallet.utils.stringToBytes(params.data)];
            let safeBatchTransferFrom_send = async (params, options) => {
                let result = await this.send('safeBatchTransferFrom', safeBatchTransferFromParams(params), options);
                return result;
            };
            let safeBatchTransferFrom_call = async (params, options) => {
                let result = await this.call('safeBatchTransferFrom', safeBatchTransferFromParams(params), options);
                return;
            };
            let safeBatchTransferFrom_txData = async (params, options) => {
                let result = await this.txData('safeBatchTransferFrom', safeBatchTransferFromParams(params), options);
                return result;
            };
            this.safeBatchTransferFrom = Object.assign(safeBatchTransferFrom_send, {
                call: safeBatchTransferFrom_call,
                txData: safeBatchTransferFrom_txData
            });
            let safeTransferFromParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.id), this.wallet.utils.toString(params.amount), this.wallet.utils.stringToBytes(params.data)];
            let safeTransferFrom_send = async (params, options) => {
                let result = await this.send('safeTransferFrom', safeTransferFromParams(params), options);
                return result;
            };
            let safeTransferFrom_call = async (params, options) => {
                let result = await this.call('safeTransferFrom', safeTransferFromParams(params), options);
                return;
            };
            let safeTransferFrom_txData = async (params, options) => {
                let result = await this.txData('safeTransferFrom', safeTransferFromParams(params), options);
                return result;
            };
            this.safeTransferFrom = Object.assign(safeTransferFrom_send, {
                call: safeTransferFrom_call,
                txData: safeTransferFrom_txData
            });
            let setApprovalForAllParams = (params) => [params.operator, params.approved];
            let setApprovalForAll_send = async (params, options) => {
                let result = await this.send('setApprovalForAll', setApprovalForAllParams(params), options);
                return result;
            };
            let setApprovalForAll_call = async (params, options) => {
                let result = await this.call('setApprovalForAll', setApprovalForAllParams(params), options);
                return;
            };
            let setApprovalForAll_txData = async (params, options) => {
                let result = await this.txData('setApprovalForAll', setApprovalForAllParams(params), options);
                return result;
            };
            this.setApprovalForAll = Object.assign(setApprovalForAll_send, {
                call: setApprovalForAll_call,
                txData: setApprovalForAll_txData
            });
        }
    }
    exports.ERC1155 = ERC1155;
    ERC1155._abi = ERC1155_json_1.default.abi;
});
define("@scom/scom-nft-minter/contracts/scom-product-contract/contracts/@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/contracts/scom-product-contract/contracts/@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.json.ts'/> 
    exports.default = {
        "abi": [
            { "inputs": [{ "internalType": "string", "name": "uri", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "TransferBatch", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "TransferSingle", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "URI", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" },
            { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "MINTER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "PAUSER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }], "name": "balanceOfBatch", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "burnBatch", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getRoleMember", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleMemberCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "mintBatch", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "uri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }
        ],
        "bytecode": "60806040523480156200001157600080fd5b5060405162003deb38038062003deb83398101604081905262000034916200023a565b806200004081620000b7565b506005805460ff1916905562000058600033620000c9565b620000847f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633620000c9565b620000b07f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33620000c9565b5062000469565b6004620000c582826200039d565b5050565b620000c58282620000e682826200011260201b62000e8b1760201c565b60008281526001602090815260409091206200010d91839062000f7b620001b2821b17901c565b505050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16620000c5576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556200016e3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000620001c9836001600160a01b038416620001d2565b90505b92915050565b60008181526001830160205260408120546200021b57508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155620001cc565b506000620001cc565b634e487b7160e01b600052604160045260246000fd5b600060208083850312156200024e57600080fd5b82516001600160401b03808211156200026657600080fd5b818501915085601f8301126200027b57600080fd5b81518181111562000290576200029062000224565b604051601f8201601f19908116603f01168101908382118183101715620002bb57620002bb62000224565b816040528281528886848701011115620002d457600080fd5b600093505b82841015620002f85784840186015181850187015292850192620002d9565b600086848301015280965050505050505092915050565b600181811c908216806200032457607f821691505b6020821081036200034557634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200010d57600081815260208120601f850160051c81016020861015620003745750805b601f850160051c820191505b81811015620003955782815560010162000380565b505050505050565b81516001600160401b03811115620003b957620003b962000224565b620003d181620003ca84546200030f565b846200034b565b602080601f831160018114620004095760008415620003f05750858301515b600019600386901b1c1916600185901b17855562000395565b600085815260208120601f198616915b828110156200043a5788860151825594840194600190910190840162000419565b5085821015620004595787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b61397280620004796000396000f3fe608060405234801561001057600080fd5b50600436106101a25760003560e01c8063731133e9116100ee578063ca15c87311610097578063e63ab1e911610071578063e63ab1e9146103c6578063e985e9c5146103ed578063f242432a14610436578063f5298aca1461044957600080fd5b8063ca15c87314610379578063d53913931461038c578063d547741f146103b357600080fd5b806391d14854116100c857806391d148541461031a578063a217fddf1461035e578063a22cb4651461036657600080fd5b8063731133e9146102c75780638456cb59146102da5780639010d07c146102e257600080fd5b80632f2ff15d116101505780634e1273f41161012a5780634e1273f4146102895780635c975abb146102a95780636b20c454146102b457600080fd5b80632f2ff15d1461025b57806336568abe1461026e5780633f4ba83a1461028157600080fd5b80631f7fdffa116101815780631f7fdffa14610210578063248a9ca3146102255780632eb2c2d61461024857600080fd5b8062fdd58e146101a757806301ffc9a7146101cd5780630e89341c146101f0575b600080fd5b6101ba6101b5366004612e46565b61045c565b6040519081526020015b60405180910390f35b6101e06101db366004612e9e565b61053e565b60405190151581526020016101c4565b6102036101fe366004612ebb565b610549565b6040516101c49190612f42565b61022361021e3660046130f6565b6105dd565b005b6101ba610233366004612ebb565b60009081526020819052604090206001015490565b61022361025636600461318f565b6106a5565b610223610269366004613239565b61076e565b61022361027c366004613239565b610798565b61022361084b565b61029c610297366004613265565b61090b565b6040516101c4919061336b565b60055460ff166101e0565b6102236102c236600461337e565b610a63565b6102236102d53660046133f2565b610b23565b610223610be5565b6102f56102f0366004613447565b610ca3565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016101c4565b6101e0610328366004613239565b60009182526020828152604080842073ffffffffffffffffffffffffffffffffffffffff93909316845291905290205460ff1690565b6101ba600081565b610223610374366004613469565b610cc2565b6101ba610387366004612ebb565b610ccd565b6101ba7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b6102236103c1366004613239565b610ce4565b6101ba7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b6101e06103fb3660046134a5565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260036020908152604080832093909416825291909152205460ff1690565b6102236104443660046134cf565b610d09565b610223610457366004613534565b610dcb565b600073ffffffffffffffffffffffffffffffffffffffff8316610506576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201527f616c6964206f776e65720000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b50600081815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff861684529091529020545b92915050565b600061053882610f9d565b60606004805461055890613567565b80601f016020809104026020016040519081016040528092919081815260200182805461058490613567565b80156105d15780601f106105a6576101008083540402835291602001916105d1565b820191906000526020600020905b8154815290600101906020018083116105b457829003601f168201915b50505050509050919050565b6106077f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633610328565b610693576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603860248201527f455243313135355072657365744d696e7465725061757365723a206d7573742060448201527f68617665206d696e74657220726f6c6520746f206d696e74000000000000000060648201526084016104fd565b61069f8484848461103f565b50505050565b73ffffffffffffffffffffffffffffffffffffffff85163314806106ce57506106ce85336103fb565b61075a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f76656400000000000000000000000000000000000060648201526084016104fd565b61076785858585856112c8565b5050505050565b60008281526020819052604090206001015461078981611613565b6107938383611620565b505050565b73ffffffffffffffffffffffffffffffffffffffff8116331461083d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c66000000000000000000000000000000000060648201526084016104fd565b6108478282611642565b5050565b6108757f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33610328565b610901576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603b60248201527f455243313135355072657365744d696e7465725061757365723a206d7573742060448201527f686176652070617573657220726f6c6520746f20756e7061757365000000000060648201526084016104fd565b610909611664565b565b6060815183511461099e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e67746860448201527f206d69736d61746368000000000000000000000000000000000000000000000060648201526084016104fd565b6000835167ffffffffffffffff8111156109ba576109ba612f55565b6040519080825280602002602001820160405280156109e3578160200160208202803683370190505b50905060005b8451811015610a5b57610a2e858281518110610a0757610a076135ba565b6020026020010151858381518110610a2157610a216135ba565b602002602001015161045c565b828281518110610a4057610a406135ba565b6020908102919091010152610a5481613618565b90506109e9565b509392505050565b73ffffffffffffffffffffffffffffffffffffffff8316331480610a8c5750610a8c83336103fb565b610b18576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f76656400000000000000000000000000000000000060648201526084016104fd565b6107938383836116e1565b610b4d7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633610328565b610bd9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603860248201527f455243313135355072657365744d696e7465725061757365723a206d7573742060448201527f68617665206d696e74657220726f6c6520746f206d696e74000000000000000060648201526084016104fd565b61069f84848484611a1d565b610c0f7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33610328565b610c9b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603960248201527f455243313135355072657365744d696e7465725061757365723a206d7573742060448201527f686176652070617573657220726f6c6520746f2070617573650000000000000060648201526084016104fd565b610909611b9f565b6000828152600160205260408120610cbb9083611bfa565b9392505050565b610847338383611c06565b600081815260016020526040812061053890611d59565b600082815260208190526040902060010154610cff81611613565b6107938383611642565b73ffffffffffffffffffffffffffffffffffffffff8516331480610d325750610d3285336103fb565b610dbe576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f76656400000000000000000000000000000000000060648201526084016104fd565b6107678585858585611d63565b73ffffffffffffffffffffffffffffffffffffffff8316331480610df45750610df483336103fb565b610e80576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f76656400000000000000000000000000000000000060648201526084016104fd565b610793838383611fb3565b60008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915290205460ff166108475760008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff85168452909152902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166001179055610f1d3390565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000610cbb8373ffffffffffffffffffffffffffffffffffffffff84166121d5565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167fd9b67a2600000000000000000000000000000000000000000000000000000000148061103057507fffffffff0000000000000000000000000000000000000000000000000000000082167f0e89341c00000000000000000000000000000000000000000000000000000000145b80610538575061053882612224565b73ffffffffffffffffffffffffffffffffffffffff84166110e2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f455243313135353a206d696e7420746f20746865207a65726f2061646472657360448201527f730000000000000000000000000000000000000000000000000000000000000060648201526084016104fd565b8151835114611173576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060448201527f6d69736d6174636800000000000000000000000000000000000000000000000060648201526084016104fd565b336111838160008787878761227a565b60005b8451811015611239578381815181106111a1576111a16135ba565b6020026020010151600260008784815181106111bf576111bf6135ba565b6020026020010151815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546112219190613650565b9091555081905061123181613618565b915050611186565b508473ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb87876040516112b1929190613663565b60405180910390a461076781600087878787612288565b8151835114611359576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060448201527f6d69736d6174636800000000000000000000000000000000000000000000000060648201526084016104fd565b73ffffffffffffffffffffffffffffffffffffffff84166113fc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f20616460448201527f647265737300000000000000000000000000000000000000000000000000000060648201526084016104fd565b3361140b81878787878761227a565b60005b845181101561157e57600085828151811061142b5761142b6135ba565b602002602001015190506000858381518110611449576114496135ba565b602090810291909101810151600084815260028352604080822073ffffffffffffffffffffffffffffffffffffffff8e168352909352919091205490915081811015611517576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201527f72207472616e736665720000000000000000000000000000000000000000000060648201526084016104fd565b600083815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8e8116855292528083208585039055908b16825281208054849290611563908490613650565b925050819055505050508061157790613618565b905061140e565b508473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb87876040516115f5929190613663565b60405180910390a461160b818787878787612288565b505050505050565b61161d8133612512565b50565b61162a8282610e8b565b60008281526001602052604090206107939082610f7b565b61164c82826125ca565b60008281526001602052604090206107939082612681565b61166c6126a3565b600580547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390a1565b73ffffffffffffffffffffffffffffffffffffffff8316611784576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f455243313135353a206275726e2066726f6d20746865207a65726f206164647260448201527f657373000000000000000000000000000000000000000000000000000000000060648201526084016104fd565b8051825114611815576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060448201527f6d69736d6174636800000000000000000000000000000000000000000000000060648201526084016104fd565b60003390506118388185600086866040518060200160405280600081525061227a565b60005b8351811015611989576000848281518110611858576118586135ba565b602002602001015190506000848381518110611876576118766135ba565b602090810291909101810151600084815260028352604080822073ffffffffffffffffffffffffffffffffffffffff8c168352909352919091205490915081811015611943576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f455243313135353a206275726e20616d6f756e7420657863656564732062616c60448201527f616e63650000000000000000000000000000000000000000000000000000000060648201526084016104fd565b600092835260026020908152604080852073ffffffffffffffffffffffffffffffffffffffff8b168652909152909220910390558061198181613618565b91505061183b565b50600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8686604051611a01929190613663565b60405180910390a460408051602081019091526000905261069f565b73ffffffffffffffffffffffffffffffffffffffff8416611ac0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f455243313135353a206d696e7420746f20746865207a65726f2061646472657360448201527f730000000000000000000000000000000000000000000000000000000000000060648201526084016104fd565b336000611acc8561270f565b90506000611ad98561270f565b9050611aea8360008985858961227a565b600086815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8b16845290915281208054879290611b29908490613650565b9091555050604080518781526020810187905273ffffffffffffffffffffffffffffffffffffffff808a1692600092918716917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4611b968360008989898961275a565b50505050505050565b611ba7612907565b600580547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586116b73390565b6000610cbb8383612974565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603611cc1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c2073746174757360448201527f20666f722073656c66000000000000000000000000000000000000000000000060648201526084016104fd565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526003602090815260408083209487168084529482529182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6000610538825490565b73ffffffffffffffffffffffffffffffffffffffff8416611e06576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f20616460448201527f647265737300000000000000000000000000000000000000000000000000000060648201526084016104fd565b336000611e128561270f565b90506000611e1f8561270f565b9050611e2f83898985858961227a565b600086815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8c16845290915290205485811015611eef576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201527f72207472616e736665720000000000000000000000000000000000000000000060648201526084016104fd565b600087815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8d8116855292528083208985039055908a16825281208054889290611f3b908490613650565b9091555050604080518881526020810188905273ffffffffffffffffffffffffffffffffffffffff808b16928c821692918816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4611fa8848a8a8a8a8a61275a565b505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff8316612056576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f455243313135353a206275726e2066726f6d20746865207a65726f206164647260448201527f657373000000000000000000000000000000000000000000000000000000000060648201526084016104fd565b3360006120628461270f565b9050600061206f8461270f565b905061208f8387600085856040518060200160405280600081525061227a565b600085815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8a1684529091529020548481101561214e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f455243313135353a206275726e20616d6f756e7420657863656564732062616c60448201527f616e63650000000000000000000000000000000000000000000000000000000060648201526084016104fd565b600086815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8b81168086529184528285208a8703905582518b81529384018a90529092908816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4604080516020810190915260009052611b96565b600081815260018301602052604081205461221c57508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610538565b506000610538565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f5a05180f00000000000000000000000000000000000000000000000000000000148061053857506105388261299e565b61160b868686868686612a35565b73ffffffffffffffffffffffffffffffffffffffff84163b1561160b576040517fbc197c8100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063bc197c81906122ff9089908990889088908890600401613691565b6020604051808303816000875af1925050508015612358575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201909252612355918101906136fc565b60015b61244157612364613719565b806308c379a0036123b75750612378613735565b8061238357506123b9565b806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104fd9190612f42565b505b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e2d4552433131353560448201527f526563656976657220696d706c656d656e74657200000000000000000000000060648201526084016104fd565b7fffffffff0000000000000000000000000000000000000000000000000000000081167fbc197c810000000000000000000000000000000000000000000000000000000014611b96576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a6563746560448201527f6420746f6b656e7300000000000000000000000000000000000000000000000060648201526084016104fd565b60008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915290205460ff166108475761255081612ac8565b61255b836020612ae7565b60405160200161256c9291906137dd565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0818403018152908290527f08c379a00000000000000000000000000000000000000000000000000000000082526104fd91600401612f42565b60008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915290205460ff16156108475760008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516808552925280832080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000610cbb8373ffffffffffffffffffffffffffffffffffffffff8416612d2a565b60055460ff16610909576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f5061757361626c653a206e6f742070617573656400000000000000000000000060448201526064016104fd565b60408051600180825281830190925260609160009190602080830190803683370190505090508281600081518110612749576127496135ba565b602090810291909101015292915050565b73ffffffffffffffffffffffffffffffffffffffff84163b1561160b576040517ff23a6e6100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063f23a6e61906127d1908990899088908890889060040161385e565b6020604051808303816000875af192505050801561282a575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201909252612827918101906136fc565b60015b61283657612364613719565b7fffffffff0000000000000000000000000000000000000000000000000000000081167ff23a6e610000000000000000000000000000000000000000000000000000000014611b96576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a6563746560448201527f6420746f6b656e7300000000000000000000000000000000000000000000000060648201526084016104fd565b60055460ff1615610909576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f5061757361626c653a207061757365640000000000000000000000000000000060448201526064016104fd565b600082600001828154811061298b5761298b6135ba565b9060005260206000200154905092915050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f7965db0b00000000000000000000000000000000000000000000000000000000148061053857507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff00000000000000000000000000000000000000000000000000000000831614610538565b60055460ff161561160b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602c60248201527f455243313135355061757361626c653a20746f6b656e207472616e736665722060448201527f7768696c6520706175736564000000000000000000000000000000000000000060648201526084016104fd565b606061053873ffffffffffffffffffffffffffffffffffffffff831660145b60606000612af68360026138ae565b612b01906002613650565b67ffffffffffffffff811115612b1957612b19612f55565b6040519080825280601f01601f191660200182016040528015612b43576020820181803683370190505b5090507f300000000000000000000000000000000000000000000000000000000000000081600081518110612b7a57612b7a6135ba565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f780000000000000000000000000000000000000000000000000000000000000081600181518110612bdd57612bdd6135ba565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053506000612c198460026138ae565b612c24906001613650565b90505b6001811115612cc1577f303132333435363738396162636465660000000000000000000000000000000085600f1660108110612c6557612c656135ba565b1a60f81b828281518110612c7b57612c7b6135ba565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060049490941c93612cba816138c5565b9050612c27565b508315610cbb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016104fd565b60008181526001830160205260408120548015612e13576000612d4e6001836138fa565b8554909150600090612d62906001906138fa565b9050818114612dc7576000866000018281548110612d8257612d826135ba565b9060005260206000200154905080876000018481548110612da557612da56135ba565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080612dd857612dd861390d565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610538565b6000915050610538565b803573ffffffffffffffffffffffffffffffffffffffff81168114612e4157600080fd5b919050565b60008060408385031215612e5957600080fd5b612e6283612e1d565b946020939093013593505050565b7fffffffff000000000000000000000000000000000000000000000000000000008116811461161d57600080fd5b600060208284031215612eb057600080fd5b8135610cbb81612e70565b600060208284031215612ecd57600080fd5b5035919050565b60005b83811015612eef578181015183820152602001612ed7565b50506000910152565b60008151808452612f10816020860160208601612ed4565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b602081526000610cbb6020830184612ef8565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116810181811067ffffffffffffffff82111715612fc857612fc8612f55565b6040525050565b600067ffffffffffffffff821115612fe957612fe9612f55565b5060051b60200190565b600082601f83011261300457600080fd5b8135602061301182612fcf565b60405161301e8282612f84565b83815260059390931b850182019282810191508684111561303e57600080fd5b8286015b848110156130595780358352918301918301613042565b509695505050505050565b600082601f83011261307557600080fd5b813567ffffffffffffffff81111561308f5761308f612f55565b6040516130c460207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8501160182612f84565b8181528460208386010111156130d957600080fd5b816020850160208301376000918101602001919091529392505050565b6000806000806080858703121561310c57600080fd5b61311585612e1d565b9350602085013567ffffffffffffffff8082111561313257600080fd5b61313e88838901612ff3565b9450604087013591508082111561315457600080fd5b61316088838901612ff3565b9350606087013591508082111561317657600080fd5b5061318387828801613064565b91505092959194509250565b600080600080600060a086880312156131a757600080fd5b6131b086612e1d565b94506131be60208701612e1d565b9350604086013567ffffffffffffffff808211156131db57600080fd5b6131e789838a01612ff3565b945060608801359150808211156131fd57600080fd5b61320989838a01612ff3565b9350608088013591508082111561321f57600080fd5b5061322c88828901613064565b9150509295509295909350565b6000806040838503121561324c57600080fd5b8235915061325c60208401612e1d565b90509250929050565b6000806040838503121561327857600080fd5b823567ffffffffffffffff8082111561329057600080fd5b818501915085601f8301126132a457600080fd5b813560206132b182612fcf565b6040516132be8282612f84565b83815260059390931b85018201928281019150898411156132de57600080fd5b948201945b83861015613303576132f486612e1d565b825294820194908201906132e3565b9650508601359250508082111561331957600080fd5b5061332685828601612ff3565b9150509250929050565b600081518084526020808501945080840160005b8381101561336057815187529582019590820190600101613344565b509495945050505050565b602081526000610cbb6020830184613330565b60008060006060848603121561339357600080fd5b61339c84612e1d565b9250602084013567ffffffffffffffff808211156133b957600080fd5b6133c587838801612ff3565b935060408601359150808211156133db57600080fd5b506133e886828701612ff3565b9150509250925092565b6000806000806080858703121561340857600080fd5b61341185612e1d565b93506020850135925060408501359150606085013567ffffffffffffffff81111561343b57600080fd5b61318387828801613064565b6000806040838503121561345a57600080fd5b50508035926020909101359150565b6000806040838503121561347c57600080fd5b61348583612e1d565b91506020830135801515811461349a57600080fd5b809150509250929050565b600080604083850312156134b857600080fd5b6134c183612e1d565b915061325c60208401612e1d565b600080600080600060a086880312156134e757600080fd5b6134f086612e1d565b94506134fe60208701612e1d565b93506040860135925060608601359150608086013567ffffffffffffffff81111561352857600080fd5b61322c88828901613064565b60008060006060848603121561354957600080fd5b61355284612e1d565b95602085013595506040909401359392505050565b600181811c9082168061357b57607f821691505b6020821081036135b4577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203613649576136496135e9565b5060010190565b80820180821115610538576105386135e9565b6040815260006136766040830185613330565b82810360208401526136888185613330565b95945050505050565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525060a060408301526136ca60a0830186613330565b82810360608401526136dc8186613330565b905082810360808401526136f08185612ef8565b98975050505050505050565b60006020828403121561370e57600080fd5b8151610cbb81612e70565b600060033d11156137325760046000803e5060005160e01c5b90565b600060443d10156137435790565b6040517ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc803d016004833e81513d67ffffffffffffffff816024840111818411171561379157505050505090565b82850191508151818111156137a95750505050505090565b843d87010160208285010111156137c35750505050505090565b6137d260208286010187612f84565b509095945050505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351613815816017850160208801612ed4565b7f206973206d697373696e6720726f6c65200000000000000000000000000000006017918401918201528351613852816028840160208801612ed4565b01602801949350505050565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525084604083015283606083015260a060808301526138a360a0830184612ef8565b979650505050505050565b8082028115828204841417610538576105386135e9565b6000816138d4576138d46135e9565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0190565b81810381811115610538576105386135e9565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fdfea2646970667358221220ad39224007a916a397a0b800540ef00822029487a714691edf0abc2c3f53d32764736f6c63430008110033"
    };
});
define("@scom/scom-nft-minter/contracts/scom-product-contract/contracts/@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.ts", ["require", "exports", "@ijstech/eth-contract", "@scom/scom-nft-minter/contracts/scom-product-contract/contracts/@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.json.ts"], function (require, exports, eth_contract_2, ERC1155PresetMinterPauser_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ERC1155PresetMinterPauser = void 0;
    class ERC1155PresetMinterPauser extends eth_contract_2.Contract {
        constructor(wallet, address) {
            super(wallet, address, ERC1155PresetMinterPauser_json_1.default.abi, ERC1155PresetMinterPauser_json_1.default.bytecode);
            this.assign();
        }
        deploy(uri, options) {
            return this.__deploy([uri], options);
        }
        parseApprovalForAllEvent(receipt) {
            return this.parseEvents(receipt, "ApprovalForAll").map(e => this.decodeApprovalForAllEvent(e));
        }
        decodeApprovalForAllEvent(event) {
            let result = event.data;
            return {
                account: result.account,
                operator: result.operator,
                approved: result.approved,
                _event: event
            };
        }
        parsePausedEvent(receipt) {
            return this.parseEvents(receipt, "Paused").map(e => this.decodePausedEvent(e));
        }
        decodePausedEvent(event) {
            let result = event.data;
            return {
                account: result.account,
                _event: event
            };
        }
        parseRoleAdminChangedEvent(receipt) {
            return this.parseEvents(receipt, "RoleAdminChanged").map(e => this.decodeRoleAdminChangedEvent(e));
        }
        decodeRoleAdminChangedEvent(event) {
            let result = event.data;
            return {
                role: result.role,
                previousAdminRole: result.previousAdminRole,
                newAdminRole: result.newAdminRole,
                _event: event
            };
        }
        parseRoleGrantedEvent(receipt) {
            return this.parseEvents(receipt, "RoleGranted").map(e => this.decodeRoleGrantedEvent(e));
        }
        decodeRoleGrantedEvent(event) {
            let result = event.data;
            return {
                role: result.role,
                account: result.account,
                sender: result.sender,
                _event: event
            };
        }
        parseRoleRevokedEvent(receipt) {
            return this.parseEvents(receipt, "RoleRevoked").map(e => this.decodeRoleRevokedEvent(e));
        }
        decodeRoleRevokedEvent(event) {
            let result = event.data;
            return {
                role: result.role,
                account: result.account,
                sender: result.sender,
                _event: event
            };
        }
        parseTransferBatchEvent(receipt) {
            return this.parseEvents(receipt, "TransferBatch").map(e => this.decodeTransferBatchEvent(e));
        }
        decodeTransferBatchEvent(event) {
            let result = event.data;
            return {
                operator: result.operator,
                from: result.from,
                to: result.to,
                ids: result.ids.map(e => new eth_contract_2.BigNumber(e)),
                values: result.values.map(e => new eth_contract_2.BigNumber(e)),
                _event: event
            };
        }
        parseTransferSingleEvent(receipt) {
            return this.parseEvents(receipt, "TransferSingle").map(e => this.decodeTransferSingleEvent(e));
        }
        decodeTransferSingleEvent(event) {
            let result = event.data;
            return {
                operator: result.operator,
                from: result.from,
                to: result.to,
                id: new eth_contract_2.BigNumber(result.id),
                value: new eth_contract_2.BigNumber(result.value),
                _event: event
            };
        }
        parseURIEvent(receipt) {
            return this.parseEvents(receipt, "URI").map(e => this.decodeURIEvent(e));
        }
        decodeURIEvent(event) {
            let result = event.data;
            return {
                value: result.value,
                id: new eth_contract_2.BigNumber(result.id),
                _event: event
            };
        }
        parseUnpausedEvent(receipt) {
            return this.parseEvents(receipt, "Unpaused").map(e => this.decodeUnpausedEvent(e));
        }
        decodeUnpausedEvent(event) {
            let result = event.data;
            return {
                account: result.account,
                _event: event
            };
        }
        assign() {
            let DEFAULT_ADMIN_ROLE_call = async (options) => {
                let result = await this.call('DEFAULT_ADMIN_ROLE', [], options);
                return result;
            };
            this.DEFAULT_ADMIN_ROLE = DEFAULT_ADMIN_ROLE_call;
            let MINTER_ROLE_call = async (options) => {
                let result = await this.call('MINTER_ROLE', [], options);
                return result;
            };
            this.MINTER_ROLE = MINTER_ROLE_call;
            let PAUSER_ROLE_call = async (options) => {
                let result = await this.call('PAUSER_ROLE', [], options);
                return result;
            };
            this.PAUSER_ROLE = PAUSER_ROLE_call;
            let balanceOfParams = (params) => [params.account, this.wallet.utils.toString(params.id)];
            let balanceOf_call = async (params, options) => {
                let result = await this.call('balanceOf', balanceOfParams(params), options);
                return new eth_contract_2.BigNumber(result);
            };
            this.balanceOf = balanceOf_call;
            let balanceOfBatchParams = (params) => [params.accounts, this.wallet.utils.toString(params.ids)];
            let balanceOfBatch_call = async (params, options) => {
                let result = await this.call('balanceOfBatch', balanceOfBatchParams(params), options);
                return result.map(e => new eth_contract_2.BigNumber(e));
            };
            this.balanceOfBatch = balanceOfBatch_call;
            let getRoleAdmin_call = async (role, options) => {
                let result = await this.call('getRoleAdmin', [this.wallet.utils.stringToBytes32(role)], options);
                return result;
            };
            this.getRoleAdmin = getRoleAdmin_call;
            let getRoleMemberParams = (params) => [this.wallet.utils.stringToBytes32(params.role), this.wallet.utils.toString(params.index)];
            let getRoleMember_call = async (params, options) => {
                let result = await this.call('getRoleMember', getRoleMemberParams(params), options);
                return result;
            };
            this.getRoleMember = getRoleMember_call;
            let getRoleMemberCount_call = async (role, options) => {
                let result = await this.call('getRoleMemberCount', [this.wallet.utils.stringToBytes32(role)], options);
                return new eth_contract_2.BigNumber(result);
            };
            this.getRoleMemberCount = getRoleMemberCount_call;
            let hasRoleParams = (params) => [this.wallet.utils.stringToBytes32(params.role), params.account];
            let hasRole_call = async (params, options) => {
                let result = await this.call('hasRole', hasRoleParams(params), options);
                return result;
            };
            this.hasRole = hasRole_call;
            let isApprovedForAllParams = (params) => [params.account, params.operator];
            let isApprovedForAll_call = async (params, options) => {
                let result = await this.call('isApprovedForAll', isApprovedForAllParams(params), options);
                return result;
            };
            this.isApprovedForAll = isApprovedForAll_call;
            let paused_call = async (options) => {
                let result = await this.call('paused', [], options);
                return result;
            };
            this.paused = paused_call;
            let supportsInterface_call = async (interfaceId, options) => {
                let result = await this.call('supportsInterface', [interfaceId], options);
                return result;
            };
            this.supportsInterface = supportsInterface_call;
            let uri_call = async (param1, options) => {
                let result = await this.call('uri', [this.wallet.utils.toString(param1)], options);
                return result;
            };
            this.uri = uri_call;
            let burnParams = (params) => [params.account, this.wallet.utils.toString(params.id), this.wallet.utils.toString(params.value)];
            let burn_send = async (params, options) => {
                let result = await this.send('burn', burnParams(params), options);
                return result;
            };
            let burn_call = async (params, options) => {
                let result = await this.call('burn', burnParams(params), options);
                return;
            };
            let burn_txData = async (params, options) => {
                let result = await this.txData('burn', burnParams(params), options);
                return result;
            };
            this.burn = Object.assign(burn_send, {
                call: burn_call,
                txData: burn_txData
            });
            let burnBatchParams = (params) => [params.account, this.wallet.utils.toString(params.ids), this.wallet.utils.toString(params.values)];
            let burnBatch_send = async (params, options) => {
                let result = await this.send('burnBatch', burnBatchParams(params), options);
                return result;
            };
            let burnBatch_call = async (params, options) => {
                let result = await this.call('burnBatch', burnBatchParams(params), options);
                return;
            };
            let burnBatch_txData = async (params, options) => {
                let result = await this.txData('burnBatch', burnBatchParams(params), options);
                return result;
            };
            this.burnBatch = Object.assign(burnBatch_send, {
                call: burnBatch_call,
                txData: burnBatch_txData
            });
            let grantRoleParams = (params) => [this.wallet.utils.stringToBytes32(params.role), params.account];
            let grantRole_send = async (params, options) => {
                let result = await this.send('grantRole', grantRoleParams(params), options);
                return result;
            };
            let grantRole_call = async (params, options) => {
                let result = await this.call('grantRole', grantRoleParams(params), options);
                return;
            };
            let grantRole_txData = async (params, options) => {
                let result = await this.txData('grantRole', grantRoleParams(params), options);
                return result;
            };
            this.grantRole = Object.assign(grantRole_send, {
                call: grantRole_call,
                txData: grantRole_txData
            });
            let mintParams = (params) => [params.to, this.wallet.utils.toString(params.id), this.wallet.utils.toString(params.amount), this.wallet.utils.stringToBytes(params.data)];
            let mint_send = async (params, options) => {
                let result = await this.send('mint', mintParams(params), options);
                return result;
            };
            let mint_call = async (params, options) => {
                let result = await this.call('mint', mintParams(params), options);
                return;
            };
            let mint_txData = async (params, options) => {
                let result = await this.txData('mint', mintParams(params), options);
                return result;
            };
            this.mint = Object.assign(mint_send, {
                call: mint_call,
                txData: mint_txData
            });
            let mintBatchParams = (params) => [params.to, this.wallet.utils.toString(params.ids), this.wallet.utils.toString(params.amounts), this.wallet.utils.stringToBytes(params.data)];
            let mintBatch_send = async (params, options) => {
                let result = await this.send('mintBatch', mintBatchParams(params), options);
                return result;
            };
            let mintBatch_call = async (params, options) => {
                let result = await this.call('mintBatch', mintBatchParams(params), options);
                return;
            };
            let mintBatch_txData = async (params, options) => {
                let result = await this.txData('mintBatch', mintBatchParams(params), options);
                return result;
            };
            this.mintBatch = Object.assign(mintBatch_send, {
                call: mintBatch_call,
                txData: mintBatch_txData
            });
            let pause_send = async (options) => {
                let result = await this.send('pause', [], options);
                return result;
            };
            let pause_call = async (options) => {
                let result = await this.call('pause', [], options);
                return;
            };
            let pause_txData = async (options) => {
                let result = await this.txData('pause', [], options);
                return result;
            };
            this.pause = Object.assign(pause_send, {
                call: pause_call,
                txData: pause_txData
            });
            let renounceRoleParams = (params) => [this.wallet.utils.stringToBytes32(params.role), params.account];
            let renounceRole_send = async (params, options) => {
                let result = await this.send('renounceRole', renounceRoleParams(params), options);
                return result;
            };
            let renounceRole_call = async (params, options) => {
                let result = await this.call('renounceRole', renounceRoleParams(params), options);
                return;
            };
            let renounceRole_txData = async (params, options) => {
                let result = await this.txData('renounceRole', renounceRoleParams(params), options);
                return result;
            };
            this.renounceRole = Object.assign(renounceRole_send, {
                call: renounceRole_call,
                txData: renounceRole_txData
            });
            let revokeRoleParams = (params) => [this.wallet.utils.stringToBytes32(params.role), params.account];
            let revokeRole_send = async (params, options) => {
                let result = await this.send('revokeRole', revokeRoleParams(params), options);
                return result;
            };
            let revokeRole_call = async (params, options) => {
                let result = await this.call('revokeRole', revokeRoleParams(params), options);
                return;
            };
            let revokeRole_txData = async (params, options) => {
                let result = await this.txData('revokeRole', revokeRoleParams(params), options);
                return result;
            };
            this.revokeRole = Object.assign(revokeRole_send, {
                call: revokeRole_call,
                txData: revokeRole_txData
            });
            let safeBatchTransferFromParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.ids), this.wallet.utils.toString(params.amounts), this.wallet.utils.stringToBytes(params.data)];
            let safeBatchTransferFrom_send = async (params, options) => {
                let result = await this.send('safeBatchTransferFrom', safeBatchTransferFromParams(params), options);
                return result;
            };
            let safeBatchTransferFrom_call = async (params, options) => {
                let result = await this.call('safeBatchTransferFrom', safeBatchTransferFromParams(params), options);
                return;
            };
            let safeBatchTransferFrom_txData = async (params, options) => {
                let result = await this.txData('safeBatchTransferFrom', safeBatchTransferFromParams(params), options);
                return result;
            };
            this.safeBatchTransferFrom = Object.assign(safeBatchTransferFrom_send, {
                call: safeBatchTransferFrom_call,
                txData: safeBatchTransferFrom_txData
            });
            let safeTransferFromParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.id), this.wallet.utils.toString(params.amount), this.wallet.utils.stringToBytes(params.data)];
            let safeTransferFrom_send = async (params, options) => {
                let result = await this.send('safeTransferFrom', safeTransferFromParams(params), options);
                return result;
            };
            let safeTransferFrom_call = async (params, options) => {
                let result = await this.call('safeTransferFrom', safeTransferFromParams(params), options);
                return;
            };
            let safeTransferFrom_txData = async (params, options) => {
                let result = await this.txData('safeTransferFrom', safeTransferFromParams(params), options);
                return result;
            };
            this.safeTransferFrom = Object.assign(safeTransferFrom_send, {
                call: safeTransferFrom_call,
                txData: safeTransferFrom_txData
            });
            let setApprovalForAllParams = (params) => [params.operator, params.approved];
            let setApprovalForAll_send = async (params, options) => {
                let result = await this.send('setApprovalForAll', setApprovalForAllParams(params), options);
                return result;
            };
            let setApprovalForAll_call = async (params, options) => {
                let result = await this.call('setApprovalForAll', setApprovalForAllParams(params), options);
                return;
            };
            let setApprovalForAll_txData = async (params, options) => {
                let result = await this.txData('setApprovalForAll', setApprovalForAllParams(params), options);
                return result;
            };
            this.setApprovalForAll = Object.assign(setApprovalForAll_send, {
                call: setApprovalForAll_call,
                txData: setApprovalForAll_txData
            });
            let unpause_send = async (options) => {
                let result = await this.send('unpause', [], options);
                return result;
            };
            let unpause_call = async (options) => {
                let result = await this.call('unpause', [], options);
                return;
            };
            let unpause_txData = async (options) => {
                let result = await this.txData('unpause', [], options);
                return result;
            };
            this.unpause = Object.assign(unpause_send, {
                call: unpause_call,
                txData: unpause_txData
            });
        }
    }
    exports.ERC1155PresetMinterPauser = ERC1155PresetMinterPauser;
    ERC1155PresetMinterPauser._abi = ERC1155PresetMinterPauser_json_1.default.abi;
});
define("@scom/scom-nft-minter/contracts/scom-product-contract/contracts/ERC20.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/contracts/scom-product-contract/contracts/ERC20.json.ts'/> 
    exports.default = {
        "abi": [
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" },
            { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }
        ],
        "bytecode": "60c0604052601360809081527f536f6c6964697479206279204578616d706c650000000000000000000000000060a05260039061003c9082610127565b506040805180820190915260078152660a69e9884b28ab60cb1b60208201526004906100689082610127565b506005805460ff1916601217905534801561008257600080fd5b506101e6565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806100b257607f821691505b6020821081036100d257634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561012257600081815260208120601f850160051c810160208610156100ff5750805b601f850160051c820191505b8181101561011e5782815560010161010b565b5050505b505050565b81516001600160401b0381111561014057610140610088565b6101548161014e845461009e565b846100d8565b602080601f83116001811461018957600084156101715750858301515b600019600386901b1c1916600185901b17855561011e565b600085815260208120601f198616915b828110156101b857888601518255948401946001909101908401610199565b50858210156101d65787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b610803806101f56000396000f3fe608060405234801561001057600080fd5b50600436106100c95760003560e01c806342966c6811610081578063a0712d681161005b578063a0712d6814610195578063a9059cbb146101a8578063dd62ed3e146101bb57600080fd5b806342966c681461015857806370a082311461016d57806395d89b411461018d57600080fd5b806318160ddd116100b257806318160ddd1461010f57806323b872dd14610126578063313ce5671461013957600080fd5b806306fdde03146100ce578063095ea7b3146100ec575b600080fd5b6100d66101e6565b6040516100e391906105bc565b60405180910390f35b6100ff6100fa366004610651565b610274565b60405190151581526020016100e3565b61011860005481565b6040519081526020016100e3565b6100ff61013436600461067b565b6102ee565b6005546101469060ff1681565b60405160ff90911681526020016100e3565b61016b6101663660046106b7565b61041c565b005b61011861017b3660046106d0565b60016020526000908152604090205481565b6100d6610494565b61016b6101a33660046106b7565b6104a1565b6100ff6101b6366004610651565b610512565b6101186101c93660046106f2565b600260209081526000928352604080842090915290825290205481565b600380546101f390610725565b80601f016020809104026020016040519081016040528092919081815260200182805461021f90610725565b801561026c5780601f106102415761010080835404028352916020019161026c565b820191906000526020600020905b81548152906001019060200180831161024f57829003601f168201915b505050505081565b33600081815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925906102dc9086815260200190565b60405180910390a35060015b92915050565b73ffffffffffffffffffffffffffffffffffffffff831660009081526002602090815260408083203384529091528120805483919083906103309084906107a7565b909155505073ffffffffffffffffffffffffffffffffffffffff84166000908152600160205260408120805484929061036a9084906107a7565b909155505073ffffffffffffffffffffffffffffffffffffffff8316600090815260016020526040812080548492906103a49084906107ba565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161040a91815260200190565b60405180910390a35060019392505050565b336000908152600160205260408120805483929061043b9084906107a7565b925050819055508060008082825461045391906107a7565b909155505060405181815260009033907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906020015b60405180910390a350565b600480546101f390610725565b33600090815260016020526040812080548392906104c09084906107ba565b92505081905550806000808282546104d891906107ba565b909155505060405181815233906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602001610489565b336000908152600160205260408120805483919083906105339084906107a7565b909155505073ffffffffffffffffffffffffffffffffffffffff83166000908152600160205260408120805484929061056d9084906107ba565b909155505060405182815273ffffffffffffffffffffffffffffffffffffffff84169033907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906020016102dc565b600060208083528351808285015260005b818110156105e9578581018301518582016040015282016105cd565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8301168501019250505092915050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461064c57600080fd5b919050565b6000806040838503121561066457600080fd5b61066d83610628565b946020939093013593505050565b60008060006060848603121561069057600080fd5b61069984610628565b92506106a760208501610628565b9150604084013590509250925092565b6000602082840312156106c957600080fd5b5035919050565b6000602082840312156106e257600080fd5b6106eb82610628565b9392505050565b6000806040838503121561070557600080fd5b61070e83610628565b915061071c60208401610628565b90509250929050565b600181811c9082168061073957607f821691505b602082108103610772577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b818103818111156102e8576102e8610778565b808201808211156102e8576102e861077856fea2646970667358221220bcc05a525455acc68add672b8fb992365882b911f8c95c10983e6c7fcc8919a064736f6c63430008110033"
    };
});
define("@scom/scom-nft-minter/contracts/scom-product-contract/contracts/ERC20.ts", ["require", "exports", "@ijstech/eth-contract", "@scom/scom-nft-minter/contracts/scom-product-contract/contracts/ERC20.json.ts"], function (require, exports, eth_contract_3, ERC20_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ERC20 = void 0;
    class ERC20 extends eth_contract_3.Contract {
        constructor(wallet, address) {
            super(wallet, address, ERC20_json_1.default.abi, ERC20_json_1.default.bytecode);
            this.assign();
        }
        deploy(options) {
            return this.__deploy([], options);
        }
        parseApprovalEvent(receipt) {
            return this.parseEvents(receipt, "Approval").map(e => this.decodeApprovalEvent(e));
        }
        decodeApprovalEvent(event) {
            let result = event.data;
            return {
                owner: result.owner,
                spender: result.spender,
                value: new eth_contract_3.BigNumber(result.value),
                _event: event
            };
        }
        parseTransferEvent(receipt) {
            return this.parseEvents(receipt, "Transfer").map(e => this.decodeTransferEvent(e));
        }
        decodeTransferEvent(event) {
            let result = event.data;
            return {
                from: result.from,
                to: result.to,
                value: new eth_contract_3.BigNumber(result.value),
                _event: event
            };
        }
        assign() {
            let allowanceParams = (params) => [params.param1, params.param2];
            let allowance_call = async (params, options) => {
                let result = await this.call('allowance', allowanceParams(params), options);
                return new eth_contract_3.BigNumber(result);
            };
            this.allowance = allowance_call;
            let balanceOf_call = async (param1, options) => {
                let result = await this.call('balanceOf', [param1], options);
                return new eth_contract_3.BigNumber(result);
            };
            this.balanceOf = balanceOf_call;
            let decimals_call = async (options) => {
                let result = await this.call('decimals', [], options);
                return new eth_contract_3.BigNumber(result);
            };
            this.decimals = decimals_call;
            let name_call = async (options) => {
                let result = await this.call('name', [], options);
                return result;
            };
            this.name = name_call;
            let symbol_call = async (options) => {
                let result = await this.call('symbol', [], options);
                return result;
            };
            this.symbol = symbol_call;
            let totalSupply_call = async (options) => {
                let result = await this.call('totalSupply', [], options);
                return new eth_contract_3.BigNumber(result);
            };
            this.totalSupply = totalSupply_call;
            let approveParams = (params) => [params.spender, this.wallet.utils.toString(params.amount)];
            let approve_send = async (params, options) => {
                let result = await this.send('approve', approveParams(params), options);
                return result;
            };
            let approve_call = async (params, options) => {
                let result = await this.call('approve', approveParams(params), options);
                return result;
            };
            let approve_txData = async (params, options) => {
                let result = await this.txData('approve', approveParams(params), options);
                return result;
            };
            this.approve = Object.assign(approve_send, {
                call: approve_call,
                txData: approve_txData
            });
            let burn_send = async (amount, options) => {
                let result = await this.send('burn', [this.wallet.utils.toString(amount)], options);
                return result;
            };
            let burn_call = async (amount, options) => {
                let result = await this.call('burn', [this.wallet.utils.toString(amount)], options);
                return;
            };
            let burn_txData = async (amount, options) => {
                let result = await this.txData('burn', [this.wallet.utils.toString(amount)], options);
                return result;
            };
            this.burn = Object.assign(burn_send, {
                call: burn_call,
                txData: burn_txData
            });
            let mint_send = async (amount, options) => {
                let result = await this.send('mint', [this.wallet.utils.toString(amount)], options);
                return result;
            };
            let mint_call = async (amount, options) => {
                let result = await this.call('mint', [this.wallet.utils.toString(amount)], options);
                return;
            };
            let mint_txData = async (amount, options) => {
                let result = await this.txData('mint', [this.wallet.utils.toString(amount)], options);
                return result;
            };
            this.mint = Object.assign(mint_send, {
                call: mint_call,
                txData: mint_txData
            });
            let transferParams = (params) => [params.recipient, this.wallet.utils.toString(params.amount)];
            let transfer_send = async (params, options) => {
                let result = await this.send('transfer', transferParams(params), options);
                return result;
            };
            let transfer_call = async (params, options) => {
                let result = await this.call('transfer', transferParams(params), options);
                return result;
            };
            let transfer_txData = async (params, options) => {
                let result = await this.txData('transfer', transferParams(params), options);
                return result;
            };
            this.transfer = Object.assign(transfer_send, {
                call: transfer_call,
                txData: transfer_txData
            });
            let transferFromParams = (params) => [params.sender, params.recipient, this.wallet.utils.toString(params.amount)];
            let transferFrom_send = async (params, options) => {
                let result = await this.send('transferFrom', transferFromParams(params), options);
                return result;
            };
            let transferFrom_call = async (params, options) => {
                let result = await this.call('transferFrom', transferFromParams(params), options);
                return result;
            };
            let transferFrom_txData = async (params, options) => {
                let result = await this.txData('transferFrom', transferFromParams(params), options);
                return result;
            };
            this.transferFrom = Object.assign(transferFrom_send, {
                call: transferFrom_call,
                txData: transferFrom_txData
            });
        }
    }
    exports.ERC20 = ERC20;
    ERC20._abi = ERC20_json_1.default.abi;
});
define("@scom/scom-nft-minter/contracts/scom-product-contract/contracts/Product1155.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/contracts/scom-product-contract/contracts/Product1155.json.ts'/> 
    exports.default = {
        "abi": [
            { "inputs": [{ "internalType": "string", "name": "_templateURI", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "TransferBatch", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "TransferSingle", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "URI", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" },
            { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "MINTER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "PAUSER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }], "name": "balanceOfBatch", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "burnBatch", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getRoleMember", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleMemberCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "mintBatch", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "string", "name": "_uri", "type": "string" }], "name": "setTemplateURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "string", "name": "_uri", "type": "string" }], "name": "setURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "templateURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "uri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }
        ],
        "bytecode": "60806040523480156200001157600080fd5b50604051620045d3380380620045d3833981016040819052620000349162000518565b604080516020810190915260008152806200004f81620000da565b506005805460ff1916905562000067600033620000ec565b620000937f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633620000ec565b620000bf7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33620000ec565b50805115620000d357620000d381620000f8565b506200084e565b6004620000e882826200065e565b5050565b620000e8828262000118565b6000620001058162000156565b60066200011383826200065e565b505050565b6200012f82826200016560201b6200105f1760201c565b6000828152600160209081526040909120620001139183906200114f62000205821b17901c565b62000162813362000225565b50565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16620000e8576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620001c13390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60006200021c836001600160a01b038416620002be565b90505b92915050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16620000e85762000264816200031060201b620011711760201c565b6200027a8360206200119062000323821b17811c565b6040516020016200028d9291906200072a565b60408051601f198184030181529082905262461bcd60e51b8252620002b591600401620007a3565b60405180910390fd5b600081815260018301602052604081205462000307575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556200021f565b5060006200021f565b60606200021f6001600160a01b03831660145b6060600062000334836002620007ee565b6200034190600262000808565b6001600160401b038111156200035b576200035b620004dc565b6040519080825280601f01601f19166020018201604052801562000386576020820181803683370190505b509050600360fc1b81600081518110620003a457620003a46200081e565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110620003d657620003d66200081e565b60200101906001600160f81b031916908160001a9053506000620003fc846002620007ee565b6200040990600162000808565b90505b60018111156200048b576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106200044157620004416200081e565b1a60f81b8282815181106200045a576200045a6200081e565b60200101906001600160f81b031916908160001a90535060049490941c93620004838162000834565b90506200040c565b5083156200021c5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401620002b5565b634e487b7160e01b600052604160045260246000fd5b60005b838110156200050f578181015183820152602001620004f5565b50506000910152565b6000602082840312156200052b57600080fd5b81516001600160401b03808211156200054357600080fd5b818401915084601f8301126200055857600080fd5b8151818111156200056d576200056d620004dc565b604051601f8201601f19908116603f01168101908382118183101715620005985762000598620004dc565b81604052828152876020848701011115620005b257600080fd5b620005c5836020830160208801620004f2565b979650505050505050565b600181811c90821680620005e557607f821691505b6020821081036200060657634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200011357600081815260208120601f850160051c81016020861015620006355750805b601f850160051c820191505b81811015620006565782815560010162000641565b505050505050565b81516001600160401b038111156200067a576200067a620004dc565b62000692816200068b8454620005d0565b846200060c565b602080601f831160018114620006ca5760008415620006b15750858301515b600019600386901b1c1916600185901b17855562000656565b600085815260208120601f198616915b82811015620006fb57888601518255948401946001909101908401620006da565b50858210156200071a5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835162000764816017850160208801620004f2565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835162000797816028840160208801620004f2565b01602801949350505050565b6020815260008251806020840152620007c4816040850160208701620004f2565b601f01601f19169190910160400192915050565b634e487b7160e01b600052601160045260246000fd5b80820281158282048414176200021f576200021f620007d8565b808201808211156200021f576200021f620007d8565b634e487b7160e01b600052603260045260246000fd5b600081620008465762000846620007d8565b506000190190565b613d75806200085e6000396000f3fe608060405234801561001057600080fd5b50600436106101c35760003560e01c80638456cb59116100f9578063d539139311610097578063e985e9c511610071578063e985e9c514610434578063f242432a1461047d578063f5298aca14610490578063f923e8c3146104a357600080fd5b8063d5391393146103d3578063d547741f146103fa578063e63ab1e91461040d57600080fd5b806391d14854116100d357806391d1485414610361578063a217fddf146103a5578063a22cb465146103ad578063ca15c873146103c057600080fd5b80638456cb591461030e578063862440e2146103165780639010d07c1461032957600080fd5b80632f2ff15d116101665780634e1273f4116101405780634e1273f4146102bd5780635c975abb146102dd5780636b20c454146102e8578063731133e9146102fb57600080fd5b80632f2ff15d1461028f57806336568abe146102a25780633f4ba83a146102b557600080fd5b80631f7fdffa116101a25780631f7fdffa14610231578063248a9ca31461024657806324d88785146102695780632eb2c2d61461027c57600080fd5b8062fdd58e146101c857806301ffc9a7146101ee5780630e89341c14610211575b600080fd5b6101db6101d636600461306f565b6104ab565b6040519081526020015b60405180910390f35b6102016101fc3660046130c7565b61058d565b60405190151581526020016101e5565b61022461021f3660046130e4565b610598565b6040516101e5919061316b565b61024461023f36600461331f565b6106d8565b005b6101db6102543660046130e4565b60009081526020819052604090206001015490565b6102446102773660046133b8565b6107a0565b61024461028a3660046133f5565b6107bc565b61024461029d36600461349f565b610885565b6102446102b036600461349f565b6108aa565b61024461095d565b6102d06102cb3660046134cb565b610a1d565b6040516101e591906135d1565b60055460ff16610201565b6102446102f63660046135e4565b610b75565b610244610309366004613658565b610c35565b610244610cf7565b6102446103243660046136ad565b610db5565b61033c6103373660046136ea565b610de9565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016101e5565b61020161036f36600461349f565b60009182526020828152604080842073ffffffffffffffffffffffffffffffffffffffff93909316845291905290205460ff1690565b6101db600081565b6102446103bb36600461370c565b610e08565b6101db6103ce3660046130e4565b610e13565b6101db7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b61024461040836600461349f565b610e2a565b6101db7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b610201610442366004613748565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260036020908152604080832093909416825291909152205460ff1690565b61024461048b366004613772565b610e4f565b61024461049e3660046137d7565b610f11565b610224610fd1565b600073ffffffffffffffffffffffffffffffffffffffff8316610555576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201527f616c6964206f776e65720000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b50600081815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff861684529091529020545b92915050565b6000610587826113d3565b6000818152600760205260408120805460609291906105b69061380a565b80601f01602080910402602001604051908101604052809291908181526020018280546105e29061380a565b801561062f5780601f106106045761010080835404028352916020019161062f565b820191906000526020600020905b81548152906001019060200180831161061257829003601f168201915b5050505050905080516000146106455792915050565b600680546106529061380a565b80601f016020809104026020016040519081016040528092919081815260200182805461067e9061380a565b80156106cb5780601f106106a0576101008083540402835291602001916106cb565b820191906000526020600020905b8154815290600101906020018083116106ae57829003601f168201915b5050505050915050919050565b6107027f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a63361036f565b61078e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603860248201527f455243313135355072657365744d696e7465725061757365723a206d7573742060448201527f68617665206d696e74657220726f6c6520746f206d696e740000000000000000606482015260840161054c565b61079a84848484611475565b50505050565b60006107ab816116fe565b60066107b783826138a3565b505050565b73ffffffffffffffffffffffffffffffffffffffff85163314806107e557506107e58533610442565b610871576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f766564000000000000000000000000000000000000606482015260840161054c565b61087e858585858561170b565b5050505050565b6000828152602081905260409020600101546108a0816116fe565b6107b78383611a56565b73ffffffffffffffffffffffffffffffffffffffff8116331461094f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c660000000000000000000000000000000000606482015260840161054c565b6109598282611a78565b5050565b6109877f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a3361036f565b610a13576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603b60248201527f455243313135355072657365744d696e7465725061757365723a206d7573742060448201527f686176652070617573657220726f6c6520746f20756e70617573650000000000606482015260840161054c565b610a1b611a9a565b565b60608151835114610ab0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e67746860448201527f206d69736d617463680000000000000000000000000000000000000000000000606482015260840161054c565b6000835167ffffffffffffffff811115610acc57610acc61317e565b604051908082528060200260200182016040528015610af5578160200160208202803683370190505b50905060005b8451811015610b6d57610b40858281518110610b1957610b196139bd565b6020026020010151858381518110610b3357610b336139bd565b60200260200101516104ab565b828281518110610b5257610b526139bd565b6020908102919091010152610b6681613a1b565b9050610afb565b509392505050565b73ffffffffffffffffffffffffffffffffffffffff8316331480610b9e5750610b9e8333610442565b610c2a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f766564000000000000000000000000000000000000606482015260840161054c565b6107b7838383611b17565b610c5f7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a63361036f565b610ceb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603860248201527f455243313135355072657365744d696e7465725061757365723a206d7573742060448201527f68617665206d696e74657220726f6c6520746f206d696e740000000000000000606482015260840161054c565b61079a84848484611e53565b610d217f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a3361036f565b610dad576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603960248201527f455243313135355072657365744d696e7465725061757365723a206d7573742060448201527f686176652070617573657220726f6c6520746f20706175736500000000000000606482015260840161054c565b610a1b611fd5565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6610ddf816116fe565b6107b78383612030565b6000828152600160205260408120610e019083612085565b9392505050565b610959338383612091565b6000818152600160205260408120610587906121e4565b600082815260208190526040902060010154610e45816116fe565b6107b78383611a78565b73ffffffffffffffffffffffffffffffffffffffff8516331480610e785750610e788533610442565b610f04576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f766564000000000000000000000000000000000000606482015260840161054c565b61087e85858585856121ee565b73ffffffffffffffffffffffffffffffffffffffff8316331480610f3a5750610f3a8333610442565b610fc6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201527f6572206f7220617070726f766564000000000000000000000000000000000000606482015260840161054c565b6107b783838361243e565b60068054610fde9061380a565b80601f016020809104026020016040519081016040528092919081815260200182805461100a9061380a565b80156110575780601f1061102c57610100808354040283529160200191611057565b820191906000526020600020905b81548152906001019060200180831161103a57829003601f168201915b505050505081565b60008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915290205460ff166109595760008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff85168452909152902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660011790556110f13390565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000610e018373ffffffffffffffffffffffffffffffffffffffff8416612660565b606061058773ffffffffffffffffffffffffffffffffffffffff831660145b6060600061119f836002613a53565b6111aa906002613a6a565b67ffffffffffffffff8111156111c2576111c261317e565b6040519080825280601f01601f1916602001820160405280156111ec576020820181803683370190505b5090507f300000000000000000000000000000000000000000000000000000000000000081600081518110611223576112236139bd565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f780000000000000000000000000000000000000000000000000000000000000081600181518110611286576112866139bd565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060006112c2846002613a53565b6112cd906001613a6a565b90505b600181111561136a577f303132333435363738396162636465660000000000000000000000000000000085600f166010811061130e5761130e6139bd565b1a60f81b828281518110611324576113246139bd565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060049490941c9361136381613a7d565b90506112d0565b508315610e01576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161054c565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167fd9b67a2600000000000000000000000000000000000000000000000000000000148061146657507fffffffff0000000000000000000000000000000000000000000000000000000082167f0e89341c00000000000000000000000000000000000000000000000000000000145b806105875750610587826126af565b73ffffffffffffffffffffffffffffffffffffffff8416611518576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f455243313135353a206d696e7420746f20746865207a65726f2061646472657360448201527f7300000000000000000000000000000000000000000000000000000000000000606482015260840161054c565b81518351146115a9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060448201527f6d69736d61746368000000000000000000000000000000000000000000000000606482015260840161054c565b336115b981600087878787612705565b60005b845181101561166f578381815181106115d7576115d76139bd565b6020026020010151600260008784815181106115f5576115f56139bd565b6020026020010151815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546116579190613a6a565b9091555081905061166781613a1b565b9150506115bc565b508473ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb87876040516116e7929190613ab2565b60405180910390a461087e81600087878787612713565b611708813361299d565b50565b815183511461179c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060448201527f6d69736d61746368000000000000000000000000000000000000000000000000606482015260840161054c565b73ffffffffffffffffffffffffffffffffffffffff841661183f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f20616460448201527f6472657373000000000000000000000000000000000000000000000000000000606482015260840161054c565b3361184e818787878787612705565b60005b84518110156119c157600085828151811061186e5761186e6139bd565b60200260200101519050600085838151811061188c5761188c6139bd565b602090810291909101810151600084815260028352604080822073ffffffffffffffffffffffffffffffffffffffff8e16835290935291909120549091508181101561195a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201527f72207472616e7366657200000000000000000000000000000000000000000000606482015260840161054c565b600083815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8e8116855292528083208585039055908b168252812080548492906119a6908490613a6a565b92505081905550505050806119ba90613a1b565b9050611851565b508473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051611a38929190613ab2565b60405180910390a4611a4e818787878787612713565b505050505050565b611a60828261105f565b60008281526001602052604090206107b7908261114f565b611a828282612a55565b60008281526001602052604090206107b79082612b0c565b611aa2612b2e565b600580547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390a1565b73ffffffffffffffffffffffffffffffffffffffff8316611bba576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f455243313135353a206275726e2066726f6d20746865207a65726f206164647260448201527f6573730000000000000000000000000000000000000000000000000000000000606482015260840161054c565b8051825114611c4b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060448201527f6d69736d61746368000000000000000000000000000000000000000000000000606482015260840161054c565b6000339050611c6e81856000868660405180602001604052806000815250612705565b60005b8351811015611dbf576000848281518110611c8e57611c8e6139bd565b602002602001015190506000848381518110611cac57611cac6139bd565b602090810291909101810151600084815260028352604080822073ffffffffffffffffffffffffffffffffffffffff8c168352909352919091205490915081811015611d79576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f455243313135353a206275726e20616d6f756e7420657863656564732062616c60448201527f616e636500000000000000000000000000000000000000000000000000000000606482015260840161054c565b600092835260026020908152604080852073ffffffffffffffffffffffffffffffffffffffff8b1686529091529092209103905580611db781613a1b565b915050611c71565b50600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8686604051611e37929190613ab2565b60405180910390a460408051602081019091526000905261079a565b73ffffffffffffffffffffffffffffffffffffffff8416611ef6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f455243313135353a206d696e7420746f20746865207a65726f2061646472657360448201527f7300000000000000000000000000000000000000000000000000000000000000606482015260840161054c565b336000611f0285612b9a565b90506000611f0f85612b9a565b9050611f2083600089858589612705565b600086815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8b16845290915281208054879290611f5f908490613a6a565b9091555050604080518781526020810187905273ffffffffffffffffffffffffffffffffffffffff808a1692600092918716917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4611fcc83600089898989612be5565b50505050505050565b611fdd612d92565b600580547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258611aed3390565b600082815260076020526040902061204882826138a3565b50817f6bb7ff708619ba0610cba295a58592e0451dee2622938c8755667688daf3529b82604051612079919061316b565b60405180910390a25050565b6000610e018383612dff565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361214c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c2073746174757360448201527f20666f722073656c660000000000000000000000000000000000000000000000606482015260840161054c565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526003602090815260408083209487168084529482529182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6000610587825490565b73ffffffffffffffffffffffffffffffffffffffff8416612291576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f20616460448201527f6472657373000000000000000000000000000000000000000000000000000000606482015260840161054c565b33600061229d85612b9a565b905060006122aa85612b9a565b90506122ba838989858589612705565b600086815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8c1684529091529020548581101561237a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201527f72207472616e7366657200000000000000000000000000000000000000000000606482015260840161054c565b600087815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8d8116855292528083208985039055908a168252812080548892906123c6908490613a6a565b9091555050604080518881526020810188905273ffffffffffffffffffffffffffffffffffffffff808b16928c821692918816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4612433848a8a8a8a8a612be5565b505050505050505050565b73ffffffffffffffffffffffffffffffffffffffff83166124e1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f455243313135353a206275726e2066726f6d20746865207a65726f206164647260448201527f6573730000000000000000000000000000000000000000000000000000000000606482015260840161054c565b3360006124ed84612b9a565b905060006124fa84612b9a565b905061251a83876000858560405180602001604052806000815250612705565b600085815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8a168452909152902054848110156125d9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f455243313135353a206275726e20616d6f756e7420657863656564732062616c60448201527f616e636500000000000000000000000000000000000000000000000000000000606482015260840161054c565b600086815260026020908152604080832073ffffffffffffffffffffffffffffffffffffffff8b81168086529184528285208a8703905582518b81529384018a90529092908816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4604080516020810190915260009052611fcc565b60008181526001830160205260408120546126a757508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610587565b506000610587565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f5a05180f000000000000000000000000000000000000000000000000000000001480610587575061058782612e29565b611a4e868686868686612ec0565b73ffffffffffffffffffffffffffffffffffffffff84163b15611a4e576040517fbc197c8100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063bc197c819061278a9089908990889088908890600401613ae0565b6020604051808303816000875af19250505080156127e3575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526127e091810190613b4b565b60015b6128cc576127ef613b68565b806308c379a0036128425750612803613b84565b8061280e5750612844565b806040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161054c919061316b565b505b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e2d4552433131353560448201527f526563656976657220696d706c656d656e746572000000000000000000000000606482015260840161054c565b7fffffffff0000000000000000000000000000000000000000000000000000000081167fbc197c810000000000000000000000000000000000000000000000000000000014611fcc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a6563746560448201527f6420746f6b656e73000000000000000000000000000000000000000000000000606482015260840161054c565b60008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915290205460ff16610959576129db81611171565b6129e6836020611190565b6040516020016129f7929190613c2c565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0818403018152908290527f08c379a000000000000000000000000000000000000000000000000000000000825261054c9160040161316b565b60008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915290205460ff16156109595760008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516808552925280832080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000610e018373ffffffffffffffffffffffffffffffffffffffff8416612f53565b60055460ff16610a1b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f5061757361626c653a206e6f7420706175736564000000000000000000000000604482015260640161054c565b60408051600180825281830190925260609160009190602080830190803683370190505090508281600081518110612bd457612bd46139bd565b602090810291909101015292915050565b73ffffffffffffffffffffffffffffffffffffffff84163b15611a4e576040517ff23a6e6100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063f23a6e6190612c5c9089908990889088908890600401613cad565b6020604051808303816000875af1925050508015612cb5575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201909252612cb291810190613b4b565b60015b612cc1576127ef613b68565b7fffffffff0000000000000000000000000000000000000000000000000000000081167ff23a6e610000000000000000000000000000000000000000000000000000000014611fcc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f455243313135353a204552433131353552656365697665722072656a6563746560448201527f6420746f6b656e73000000000000000000000000000000000000000000000000606482015260840161054c565b60055460ff1615610a1b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f5061757361626c653a2070617573656400000000000000000000000000000000604482015260640161054c565b6000826000018281548110612e1657612e166139bd565b9060005260206000200154905092915050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f7965db0b00000000000000000000000000000000000000000000000000000000148061058757507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff00000000000000000000000000000000000000000000000000000000831614610587565b60055460ff1615611a4e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602c60248201527f455243313135355061757361626c653a20746f6b656e207472616e736665722060448201527f7768696c65207061757365640000000000000000000000000000000000000000606482015260840161054c565b6000818152600183016020526040812054801561303c576000612f77600183613cfd565b8554909150600090612f8b90600190613cfd565b9050818114612ff0576000866000018281548110612fab57612fab6139bd565b9060005260206000200154905080876000018481548110612fce57612fce6139bd565b6000918252602080832090910192909255918252600188019052604090208390555b855486908061300157613001613d10565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610587565b6000915050610587565b803573ffffffffffffffffffffffffffffffffffffffff8116811461306a57600080fd5b919050565b6000806040838503121561308257600080fd5b61308b83613046565b946020939093013593505050565b7fffffffff000000000000000000000000000000000000000000000000000000008116811461170857600080fd5b6000602082840312156130d957600080fd5b8135610e0181613099565b6000602082840312156130f657600080fd5b5035919050565b60005b83811015613118578181015183820152602001613100565b50506000910152565b600081518084526131398160208601602086016130fd565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b602081526000610e016020830184613121565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116810181811067ffffffffffffffff821117156131f1576131f161317e565b6040525050565b600067ffffffffffffffff8211156132125761321261317e565b5060051b60200190565b600082601f83011261322d57600080fd5b8135602061323a826131f8565b60405161324782826131ad565b83815260059390931b850182019282810191508684111561326757600080fd5b8286015b84811015613282578035835291830191830161326b565b509695505050505050565b600082601f83011261329e57600080fd5b813567ffffffffffffffff8111156132b8576132b861317e565b6040516132ed60207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f85011601826131ad565b81815284602083860101111561330257600080fd5b816020850160208301376000918101602001919091529392505050565b6000806000806080858703121561333557600080fd5b61333e85613046565b9350602085013567ffffffffffffffff8082111561335b57600080fd5b6133678883890161321c565b9450604087013591508082111561337d57600080fd5b6133898883890161321c565b9350606087013591508082111561339f57600080fd5b506133ac8782880161328d565b91505092959194509250565b6000602082840312156133ca57600080fd5b813567ffffffffffffffff8111156133e157600080fd5b6133ed8482850161328d565b949350505050565b600080600080600060a0868803121561340d57600080fd5b61341686613046565b945061342460208701613046565b9350604086013567ffffffffffffffff8082111561344157600080fd5b61344d89838a0161321c565b9450606088013591508082111561346357600080fd5b61346f89838a0161321c565b9350608088013591508082111561348557600080fd5b506134928882890161328d565b9150509295509295909350565b600080604083850312156134b257600080fd5b823591506134c260208401613046565b90509250929050565b600080604083850312156134de57600080fd5b823567ffffffffffffffff808211156134f657600080fd5b818501915085601f83011261350a57600080fd5b81356020613517826131f8565b60405161352482826131ad565b83815260059390931b850182019282810191508984111561354457600080fd5b948201945b838610156135695761355a86613046565b82529482019490820190613549565b9650508601359250508082111561357f57600080fd5b5061358c8582860161321c565b9150509250929050565b600081518084526020808501945080840160005b838110156135c6578151875295820195908201906001016135aa565b509495945050505050565b602081526000610e016020830184613596565b6000806000606084860312156135f957600080fd5b61360284613046565b9250602084013567ffffffffffffffff8082111561361f57600080fd5b61362b8783880161321c565b9350604086013591508082111561364157600080fd5b5061364e8682870161321c565b9150509250925092565b6000806000806080858703121561366e57600080fd5b61367785613046565b93506020850135925060408501359150606085013567ffffffffffffffff8111156136a157600080fd5b6133ac8782880161328d565b600080604083850312156136c057600080fd5b82359150602083013567ffffffffffffffff8111156136de57600080fd5b61358c8582860161328d565b600080604083850312156136fd57600080fd5b50508035926020909101359150565b6000806040838503121561371f57600080fd5b61372883613046565b91506020830135801515811461373d57600080fd5b809150509250929050565b6000806040838503121561375b57600080fd5b61376483613046565b91506134c260208401613046565b600080600080600060a0868803121561378a57600080fd5b61379386613046565b94506137a160208701613046565b93506040860135925060608601359150608086013567ffffffffffffffff8111156137cb57600080fd5b6134928882890161328d565b6000806000606084860312156137ec57600080fd5b6137f584613046565b95602085013595506040909401359392505050565b600181811c9082168061381e57607f821691505b602082108103613857577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b601f8211156107b757600081815260208120601f850160051c810160208610156138845750805b601f850160051c820191505b81811015611a4e57828155600101613890565b815167ffffffffffffffff8111156138bd576138bd61317e565b6138d1816138cb845461380a565b8461385d565b602080601f83116001811461392457600084156138ee5750858301515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600386901b1c1916600185901b178555611a4e565b6000858152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08616915b8281101561397157888601518255948401946001909101908401613952565b50858210156139ad57878501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b5050505050600190811b01905550565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203613a4c57613a4c6139ec565b5060010190565b8082028115828204841417610587576105876139ec565b80820180821115610587576105876139ec565b600081613a8c57613a8c6139ec565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0190565b604081526000613ac56040830185613596565b8281036020840152613ad78185613596565b95945050505050565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525060a06040830152613b1960a0830186613596565b8281036060840152613b2b8186613596565b90508281036080840152613b3f8185613121565b98975050505050505050565b600060208284031215613b5d57600080fd5b8151610e0181613099565b600060033d1115613b815760046000803e5060005160e01c5b90565b600060443d1015613b925790565b6040517ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc803d016004833e81513d67ffffffffffffffff8160248401118184111715613be057505050505090565b8285019150815181811115613bf85750505050505090565b843d8701016020828501011115613c125750505050505090565b613c21602082860101876131ad565b509095945050505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351613c648160178501602088016130fd565b7f206973206d697373696e6720726f6c65200000000000000000000000000000006017918401918201528351613ca18160288401602088016130fd565b01602801949350505050565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525084604083015283606083015260a06080830152613cf260a0830184613121565b979650505050505050565b81810381811115610587576105876139ec565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fdfea2646970667358221220b6abd5545083ebba2cdb868df2657cd95ed7046c718bb199c0c5d1fc317e48ae64736f6c63430008110033"
    };
});
define("@scom/scom-nft-minter/contracts/scom-product-contract/contracts/Product1155.ts", ["require", "exports", "@ijstech/eth-contract", "@scom/scom-nft-minter/contracts/scom-product-contract/contracts/Product1155.json.ts"], function (require, exports, eth_contract_4, Product1155_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Product1155 = void 0;
    class Product1155 extends eth_contract_4.Contract {
        constructor(wallet, address) {
            super(wallet, address, Product1155_json_1.default.abi, Product1155_json_1.default.bytecode);
            this.assign();
        }
        deploy(templateURI, options) {
            return this.__deploy([templateURI], options);
        }
        parseApprovalForAllEvent(receipt) {
            return this.parseEvents(receipt, "ApprovalForAll").map(e => this.decodeApprovalForAllEvent(e));
        }
        decodeApprovalForAllEvent(event) {
            let result = event.data;
            return {
                account: result.account,
                operator: result.operator,
                approved: result.approved,
                _event: event
            };
        }
        parsePausedEvent(receipt) {
            return this.parseEvents(receipt, "Paused").map(e => this.decodePausedEvent(e));
        }
        decodePausedEvent(event) {
            let result = event.data;
            return {
                account: result.account,
                _event: event
            };
        }
        parseRoleAdminChangedEvent(receipt) {
            return this.parseEvents(receipt, "RoleAdminChanged").map(e => this.decodeRoleAdminChangedEvent(e));
        }
        decodeRoleAdminChangedEvent(event) {
            let result = event.data;
            return {
                role: result.role,
                previousAdminRole: result.previousAdminRole,
                newAdminRole: result.newAdminRole,
                _event: event
            };
        }
        parseRoleGrantedEvent(receipt) {
            return this.parseEvents(receipt, "RoleGranted").map(e => this.decodeRoleGrantedEvent(e));
        }
        decodeRoleGrantedEvent(event) {
            let result = event.data;
            return {
                role: result.role,
                account: result.account,
                sender: result.sender,
                _event: event
            };
        }
        parseRoleRevokedEvent(receipt) {
            return this.parseEvents(receipt, "RoleRevoked").map(e => this.decodeRoleRevokedEvent(e));
        }
        decodeRoleRevokedEvent(event) {
            let result = event.data;
            return {
                role: result.role,
                account: result.account,
                sender: result.sender,
                _event: event
            };
        }
        parseTransferBatchEvent(receipt) {
            return this.parseEvents(receipt, "TransferBatch").map(e => this.decodeTransferBatchEvent(e));
        }
        decodeTransferBatchEvent(event) {
            let result = event.data;
            return {
                operator: result.operator,
                from: result.from,
                to: result.to,
                ids: result.ids.map(e => new eth_contract_4.BigNumber(e)),
                values: result.values.map(e => new eth_contract_4.BigNumber(e)),
                _event: event
            };
        }
        parseTransferSingleEvent(receipt) {
            return this.parseEvents(receipt, "TransferSingle").map(e => this.decodeTransferSingleEvent(e));
        }
        decodeTransferSingleEvent(event) {
            let result = event.data;
            return {
                operator: result.operator,
                from: result.from,
                to: result.to,
                id: new eth_contract_4.BigNumber(result.id),
                value: new eth_contract_4.BigNumber(result.value),
                _event: event
            };
        }
        parseURIEvent(receipt) {
            return this.parseEvents(receipt, "URI").map(e => this.decodeURIEvent(e));
        }
        decodeURIEvent(event) {
            let result = event.data;
            return {
                value: result.value,
                id: new eth_contract_4.BigNumber(result.id),
                _event: event
            };
        }
        parseUnpausedEvent(receipt) {
            return this.parseEvents(receipt, "Unpaused").map(e => this.decodeUnpausedEvent(e));
        }
        decodeUnpausedEvent(event) {
            let result = event.data;
            return {
                account: result.account,
                _event: event
            };
        }
        assign() {
            let DEFAULT_ADMIN_ROLE_call = async (options) => {
                let result = await this.call('DEFAULT_ADMIN_ROLE', [], options);
                return result;
            };
            this.DEFAULT_ADMIN_ROLE = DEFAULT_ADMIN_ROLE_call;
            let MINTER_ROLE_call = async (options) => {
                let result = await this.call('MINTER_ROLE', [], options);
                return result;
            };
            this.MINTER_ROLE = MINTER_ROLE_call;
            let PAUSER_ROLE_call = async (options) => {
                let result = await this.call('PAUSER_ROLE', [], options);
                return result;
            };
            this.PAUSER_ROLE = PAUSER_ROLE_call;
            let balanceOfParams = (params) => [params.account, this.wallet.utils.toString(params.id)];
            let balanceOf_call = async (params, options) => {
                let result = await this.call('balanceOf', balanceOfParams(params), options);
                return new eth_contract_4.BigNumber(result);
            };
            this.balanceOf = balanceOf_call;
            let balanceOfBatchParams = (params) => [params.accounts, this.wallet.utils.toString(params.ids)];
            let balanceOfBatch_call = async (params, options) => {
                let result = await this.call('balanceOfBatch', balanceOfBatchParams(params), options);
                return result.map(e => new eth_contract_4.BigNumber(e));
            };
            this.balanceOfBatch = balanceOfBatch_call;
            let getRoleAdmin_call = async (role, options) => {
                let result = await this.call('getRoleAdmin', [this.wallet.utils.stringToBytes32(role)], options);
                return result;
            };
            this.getRoleAdmin = getRoleAdmin_call;
            let getRoleMemberParams = (params) => [this.wallet.utils.stringToBytes32(params.role), this.wallet.utils.toString(params.index)];
            let getRoleMember_call = async (params, options) => {
                let result = await this.call('getRoleMember', getRoleMemberParams(params), options);
                return result;
            };
            this.getRoleMember = getRoleMember_call;
            let getRoleMemberCount_call = async (role, options) => {
                let result = await this.call('getRoleMemberCount', [this.wallet.utils.stringToBytes32(role)], options);
                return new eth_contract_4.BigNumber(result);
            };
            this.getRoleMemberCount = getRoleMemberCount_call;
            let hasRoleParams = (params) => [this.wallet.utils.stringToBytes32(params.role), params.account];
            let hasRole_call = async (params, options) => {
                let result = await this.call('hasRole', hasRoleParams(params), options);
                return result;
            };
            this.hasRole = hasRole_call;
            let isApprovedForAllParams = (params) => [params.account, params.operator];
            let isApprovedForAll_call = async (params, options) => {
                let result = await this.call('isApprovedForAll', isApprovedForAllParams(params), options);
                return result;
            };
            this.isApprovedForAll = isApprovedForAll_call;
            let paused_call = async (options) => {
                let result = await this.call('paused', [], options);
                return result;
            };
            this.paused = paused_call;
            let supportsInterface_call = async (interfaceId, options) => {
                let result = await this.call('supportsInterface', [interfaceId], options);
                return result;
            };
            this.supportsInterface = supportsInterface_call;
            let templateURI_call = async (options) => {
                let result = await this.call('templateURI', [], options);
                return result;
            };
            this.templateURI = templateURI_call;
            let uri_call = async (id, options) => {
                let result = await this.call('uri', [this.wallet.utils.toString(id)], options);
                return result;
            };
            this.uri = uri_call;
            let burnParams = (params) => [params.account, this.wallet.utils.toString(params.id), this.wallet.utils.toString(params.value)];
            let burn_send = async (params, options) => {
                let result = await this.send('burn', burnParams(params), options);
                return result;
            };
            let burn_call = async (params, options) => {
                let result = await this.call('burn', burnParams(params), options);
                return;
            };
            let burn_txData = async (params, options) => {
                let result = await this.txData('burn', burnParams(params), options);
                return result;
            };
            this.burn = Object.assign(burn_send, {
                call: burn_call,
                txData: burn_txData
            });
            let burnBatchParams = (params) => [params.account, this.wallet.utils.toString(params.ids), this.wallet.utils.toString(params.values)];
            let burnBatch_send = async (params, options) => {
                let result = await this.send('burnBatch', burnBatchParams(params), options);
                return result;
            };
            let burnBatch_call = async (params, options) => {
                let result = await this.call('burnBatch', burnBatchParams(params), options);
                return;
            };
            let burnBatch_txData = async (params, options) => {
                let result = await this.txData('burnBatch', burnBatchParams(params), options);
                return result;
            };
            this.burnBatch = Object.assign(burnBatch_send, {
                call: burnBatch_call,
                txData: burnBatch_txData
            });
            let grantRoleParams = (params) => [this.wallet.utils.stringToBytes32(params.role), params.account];
            let grantRole_send = async (params, options) => {
                let result = await this.send('grantRole', grantRoleParams(params), options);
                return result;
            };
            let grantRole_call = async (params, options) => {
                let result = await this.call('grantRole', grantRoleParams(params), options);
                return;
            };
            let grantRole_txData = async (params, options) => {
                let result = await this.txData('grantRole', grantRoleParams(params), options);
                return result;
            };
            this.grantRole = Object.assign(grantRole_send, {
                call: grantRole_call,
                txData: grantRole_txData
            });
            let mintParams = (params) => [params.to, this.wallet.utils.toString(params.id), this.wallet.utils.toString(params.amount), this.wallet.utils.stringToBytes(params.data)];
            let mint_send = async (params, options) => {
                let result = await this.send('mint', mintParams(params), options);
                return result;
            };
            let mint_call = async (params, options) => {
                let result = await this.call('mint', mintParams(params), options);
                return;
            };
            let mint_txData = async (params, options) => {
                let result = await this.txData('mint', mintParams(params), options);
                return result;
            };
            this.mint = Object.assign(mint_send, {
                call: mint_call,
                txData: mint_txData
            });
            let mintBatchParams = (params) => [params.to, this.wallet.utils.toString(params.ids), this.wallet.utils.toString(params.amounts), this.wallet.utils.stringToBytes(params.data)];
            let mintBatch_send = async (params, options) => {
                let result = await this.send('mintBatch', mintBatchParams(params), options);
                return result;
            };
            let mintBatch_call = async (params, options) => {
                let result = await this.call('mintBatch', mintBatchParams(params), options);
                return;
            };
            let mintBatch_txData = async (params, options) => {
                let result = await this.txData('mintBatch', mintBatchParams(params), options);
                return result;
            };
            this.mintBatch = Object.assign(mintBatch_send, {
                call: mintBatch_call,
                txData: mintBatch_txData
            });
            let pause_send = async (options) => {
                let result = await this.send('pause', [], options);
                return result;
            };
            let pause_call = async (options) => {
                let result = await this.call('pause', [], options);
                return;
            };
            let pause_txData = async (options) => {
                let result = await this.txData('pause', [], options);
                return result;
            };
            this.pause = Object.assign(pause_send, {
                call: pause_call,
                txData: pause_txData
            });
            let renounceRoleParams = (params) => [this.wallet.utils.stringToBytes32(params.role), params.account];
            let renounceRole_send = async (params, options) => {
                let result = await this.send('renounceRole', renounceRoleParams(params), options);
                return result;
            };
            let renounceRole_call = async (params, options) => {
                let result = await this.call('renounceRole', renounceRoleParams(params), options);
                return;
            };
            let renounceRole_txData = async (params, options) => {
                let result = await this.txData('renounceRole', renounceRoleParams(params), options);
                return result;
            };
            this.renounceRole = Object.assign(renounceRole_send, {
                call: renounceRole_call,
                txData: renounceRole_txData
            });
            let revokeRoleParams = (params) => [this.wallet.utils.stringToBytes32(params.role), params.account];
            let revokeRole_send = async (params, options) => {
                let result = await this.send('revokeRole', revokeRoleParams(params), options);
                return result;
            };
            let revokeRole_call = async (params, options) => {
                let result = await this.call('revokeRole', revokeRoleParams(params), options);
                return;
            };
            let revokeRole_txData = async (params, options) => {
                let result = await this.txData('revokeRole', revokeRoleParams(params), options);
                return result;
            };
            this.revokeRole = Object.assign(revokeRole_send, {
                call: revokeRole_call,
                txData: revokeRole_txData
            });
            let safeBatchTransferFromParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.ids), this.wallet.utils.toString(params.amounts), this.wallet.utils.stringToBytes(params.data)];
            let safeBatchTransferFrom_send = async (params, options) => {
                let result = await this.send('safeBatchTransferFrom', safeBatchTransferFromParams(params), options);
                return result;
            };
            let safeBatchTransferFrom_call = async (params, options) => {
                let result = await this.call('safeBatchTransferFrom', safeBatchTransferFromParams(params), options);
                return;
            };
            let safeBatchTransferFrom_txData = async (params, options) => {
                let result = await this.txData('safeBatchTransferFrom', safeBatchTransferFromParams(params), options);
                return result;
            };
            this.safeBatchTransferFrom = Object.assign(safeBatchTransferFrom_send, {
                call: safeBatchTransferFrom_call,
                txData: safeBatchTransferFrom_txData
            });
            let safeTransferFromParams = (params) => [params.from, params.to, this.wallet.utils.toString(params.id), this.wallet.utils.toString(params.amount), this.wallet.utils.stringToBytes(params.data)];
            let safeTransferFrom_send = async (params, options) => {
                let result = await this.send('safeTransferFrom', safeTransferFromParams(params), options);
                return result;
            };
            let safeTransferFrom_call = async (params, options) => {
                let result = await this.call('safeTransferFrom', safeTransferFromParams(params), options);
                return;
            };
            let safeTransferFrom_txData = async (params, options) => {
                let result = await this.txData('safeTransferFrom', safeTransferFromParams(params), options);
                return result;
            };
            this.safeTransferFrom = Object.assign(safeTransferFrom_send, {
                call: safeTransferFrom_call,
                txData: safeTransferFrom_txData
            });
            let setApprovalForAllParams = (params) => [params.operator, params.approved];
            let setApprovalForAll_send = async (params, options) => {
                let result = await this.send('setApprovalForAll', setApprovalForAllParams(params), options);
                return result;
            };
            let setApprovalForAll_call = async (params, options) => {
                let result = await this.call('setApprovalForAll', setApprovalForAllParams(params), options);
                return;
            };
            let setApprovalForAll_txData = async (params, options) => {
                let result = await this.txData('setApprovalForAll', setApprovalForAllParams(params), options);
                return result;
            };
            this.setApprovalForAll = Object.assign(setApprovalForAll_send, {
                call: setApprovalForAll_call,
                txData: setApprovalForAll_txData
            });
            let setTemplateURI_send = async (uri, options) => {
                let result = await this.send('setTemplateURI', [uri], options);
                return result;
            };
            let setTemplateURI_call = async (uri, options) => {
                let result = await this.call('setTemplateURI', [uri], options);
                return;
            };
            let setTemplateURI_txData = async (uri, options) => {
                let result = await this.txData('setTemplateURI', [uri], options);
                return result;
            };
            this.setTemplateURI = Object.assign(setTemplateURI_send, {
                call: setTemplateURI_call,
                txData: setTemplateURI_txData
            });
            let setURIParams = (params) => [this.wallet.utils.toString(params.id), params.uri];
            let setURI_send = async (params, options) => {
                let result = await this.send('setURI', setURIParams(params), options);
                return result;
            };
            let setURI_call = async (params, options) => {
                let result = await this.call('setURI', setURIParams(params), options);
                return;
            };
            let setURI_txData = async (params, options) => {
                let result = await this.txData('setURI', setURIParams(params), options);
                return result;
            };
            this.setURI = Object.assign(setURI_send, {
                call: setURI_call,
                txData: setURI_txData
            });
            let unpause_send = async (options) => {
                let result = await this.send('unpause', [], options);
                return result;
            };
            let unpause_call = async (options) => {
                let result = await this.call('unpause', [], options);
                return;
            };
            let unpause_txData = async (options) => {
                let result = await this.txData('unpause', [], options);
                return result;
            };
            this.unpause = Object.assign(unpause_send, {
                call: unpause_call,
                txData: unpause_txData
            });
        }
    }
    exports.Product1155 = Product1155;
    Product1155._abi = Product1155_json_1.default.abi;
});
define("@scom/scom-nft-minter/contracts/scom-product-contract/contracts/ProductInfo.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/contracts/scom-product-contract/contracts/ProductInfo.json.ts'/> 
    exports.default = {
        "abi": [
            { "inputs": [{ "internalType": "contract Product1155", "name": "_nft", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "quantity", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "name": "Buy", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "decrement", "type": "uint256" }], "name": "DecrementInventory", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "donor", "type": "address" }, { "indexed": true, "internalType": "address", "name": "donee", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "name": "Donate", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "increment", "type": "uint256" }], "name": "IncrementInventory", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }], "name": "NewProduct", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }], "name": "UpdateProductPrice", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" }, { "indexed": false, "internalType": "enum ProductInfo.ProductStatus", "name": "status", "type": "uint8" }], "name": "UpdateProductStatus", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "uri", "type": "string" }], "name": "UpdateProductUri", "type": "event" },
            { "inputs": [{ "internalType": "uint256", "name": "productId", "type": "uint256" }], "name": "activateProduct", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "productId", "type": "uint256" }, { "internalType": "uint256", "name": "quantity", "type": "uint256" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "name": "buy", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "productId", "type": "uint256" }, { "internalType": "uint256", "name": "quantity", "type": "uint256" }], "name": "buyEth", "outputs": [], "stateMutability": "payable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "productId", "type": "uint256" }], "name": "deactivateProduct", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "productId", "type": "uint256" }, { "internalType": "uint256", "name": "decrement", "type": "uint256" }], "name": "decrementInventory", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "donor", "type": "address" }, { "internalType": "address", "name": "donee", "type": "address" }, { "internalType": "uint256", "name": "productId", "type": "uint256" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "name": "donate", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "donor", "type": "address" }, { "internalType": "address", "name": "donee", "type": "address" }, { "internalType": "uint256", "name": "productId", "type": "uint256" }], "name": "donateEth", "outputs": [], "stateMutability": "payable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "productId", "type": "uint256" }, { "internalType": "uint256", "name": "increment", "type": "uint256" }], "name": "incrementInventory", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "enum ProductInfo.ProductType", "name": "productType", "type": "uint8" }, { "internalType": "string", "name": "uri", "type": "string" }, { "internalType": "uint256", "name": "quantity", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "uint256", "name": "maxQuantity", "type": "uint256" }, { "internalType": "uint256", "name": "maxPrice", "type": "uint256" }, { "internalType": "contract IERC20", "name": "token", "type": "address" }], "name": "newProduct", "outputs": [{ "internalType": "uint256", "name": "productId", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [], "name": "nft", "outputs": [{ "internalType": "contract Product1155", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "ownersProducts", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "ownersProductsLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "productCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "productOwner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "products", "outputs": [{ "internalType": "enum ProductInfo.ProductType", "name": "productType", "type": "uint8" }, { "internalType": "uint256", "name": "productId", "type": "uint256" }, { "internalType": "string", "name": "uri", "type": "string" }, { "internalType": "uint256", "name": "quantity", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "uint256", "name": "maxQuantity", "type": "uint256" }, { "internalType": "uint256", "name": "maxPrice", "type": "uint256" }, { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "enum ProductInfo.ProductStatus", "name": "status", "type": "uint8" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "productId", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }], "name": "updateProductPrice", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "productId", "type": "uint256" }, { "internalType": "string", "name": "uri", "type": "string" }], "name": "updateProductUri", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
        ],
        "bytecode": "60a06040523480156200001157600080fd5b50604051620033b1380380620033b183398101604081905262000034916200004b565b60016000556001600160a01b03166080526200007d565b6000602082840312156200005e57600080fd5b81516001600160a01b03811681146200007657600080fd5b9392505050565b6080516132ee620000c360003960008181610210015281816107780152818161099101528181610dd90152818161124d015281816116bc0152611b2f01526132ee6000f3fe60806040526004361061010e5760003560e01c8063722caa31116100a5578063c7f939b011610074578063e89b5d4b11610059578063e89b5d4b14610358578063fd77e5de14610378578063fe3d07e41461039857600080fd5b8063c7f939b014610322578063e0f6ef871461034257600080fd5b8063722caa31146102775780637acc0b201461028a5780639c3bddb2146102bf5780639cac76b4146102df57600080fd5b80632f35944f116100e15780632f35944f146101be57806332f662f6146101de57806347ccca02146101fe5780635d3642221461025757600080fd5b80631622dbe414610113578063248e598114610135578063249e948c1461018b5780632e4394b9146101ab575b600080fd5b34801561011f57600080fd5b5061013361012e366004612a4b565b6103b8565b005b34801561014157600080fd5b50610178610150366004612a86565b73ffffffffffffffffffffffffffffffffffffffff1660009081526003602052604090205490565b6040519081526020015b60405180910390f35b34801561019757600080fd5b506101336101a6366004612af3565b61083a565b6101336101b9366004612b3f565b610a54565b3480156101ca57600080fd5b506101336101d9366004612b80565b610ead565b3480156101ea57600080fd5b506101336101f9366004612bc6565b611309565b34801561020a57600080fd5b506102327f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610182565b34801561026357600080fd5b50610178610272366004612bdf565b61144b565b610133610285366004612c73565b611775565b34801561029657600080fd5b506102aa6102a5366004612bc6565b611bdb565b60405161018299989796959493929190612d59565b3480156102cb57600080fd5b506101336102da366004612ddc565b611cdd565b3480156102eb57600080fd5b506102326102fa366004612bc6565b60026020526000908152604090205473ffffffffffffffffffffffffffffffffffffffff1681565b34801561032e57600080fd5b5061017861033d366004612dfe565b611e2c565b34801561034e57600080fd5b5061017860015481565b34801561036457600080fd5b50610133610373366004612ddc565b611e5d565b34801561038457600080fd5b50610133610393366004612bc6565b61201e565b3480156103a457600080fd5b506101336103b3366004612ddc565b612161565b6103c0612390565b600083815260046020526040812090815460ff1660028111156103e5576103e5612ca8565b14610451576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f696e76616c69642070726f64756374207479706500000000000000000000000060448201526064015b60405180910390fd5b80600301548311156104bf576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f6f7574206f662073746f636b00000000000000000000000000000000000000006044820152606401610448565b6001600782015474010000000000000000000000000000000000000000900460ff1660018111156104f2576104f2612ca8565b14610559576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f70726f64756374206e6f742061637469766500000000000000000000000000006044820152606401610448565b600781015473ffffffffffffffffffffffffffffffffffffffff166105da576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f696e76616c696420746f6b656e207479706500000000000000000000000000006044820152606401610448565b60008311610644576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f696e76616c6964207175616e74697479000000000000000000000000000000006044820152606401610448565b80600501548311156106b2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f6d6178207175616e7469747920657863656564656400000000000000000000006044820152606401610448565b8281600401546106c29190612e59565b9150828160030160008282546106d89190612e76565b909155505060008481526002602052604090205460078201546107179173ffffffffffffffffffffffffffffffffffffffff9182169133911685612403565b6040517f731133e900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8681166004830152602482018690526044820185905260806064830152600060848301527f0000000000000000000000000000000000000000000000000000000000000000169063731133e99060a401600060405180830381600087803b1580156107bc57600080fd5b505af11580156107d0573d6000803e3d6000fd5b5050604080518681526020810186905287935073ffffffffffffffffffffffffffffffffffffffff8916925033917ef93dbdb72854b6b6fb35433086556f2635fc83c37080c667496fecfa650fb491015b60405180910390a4506108346001600055565b50505050565b600083815260026020526040902054839073ffffffffffffffffffffffffffffffffffffffff1633146108c9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f6e6f742066726f6d206f776e65720000000000000000000000000000000000006044820152606401610448565b600084815260046020526040902060018101548514610944576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f70726f647563744964206e6f74206d61746368000000000000000000000000006044820152606401610448565b60028101610953848683612f59565b506040517f862440e200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169063862440e2906109ca908890889088906004016130bd565b600060405180830381600087803b1580156109e457600080fd5b505af11580156109f8573d6000803e3d6000fd5b50505050843373ffffffffffffffffffffffffffffffffffffffff167f8940ef451459d1d04bf74a7480cb7ad72fb21ce3ffe39f3f31e0a3d88ba80b918686604051610a459291906130e0565b60405180910390a35050505050565b610a5c612390565b60008181526004602052604090206001815460ff166002811115610a8257610a82612ca8565b1480610aa357506002815460ff166002811115610aa157610aa1612ca8565b145b610b09576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f696e76616c69642070726f6475637420747970650000000000000000000000006044820152606401610448565b6000816003015411610b77576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f6f7574206f662073746f636b00000000000000000000000000000000000000006044820152606401610448565b6001600782015474010000000000000000000000000000000000000000900460ff166001811115610baa57610baa612ca8565b14610c11576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f70726f64756374206e6f742061637469766500000000000000000000000000006044820152606401610448565b600781015473ffffffffffffffffffffffffffffffffffffffff1615610c93576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f696e76616c696420746f6b656e207479706500000000000000000000000000006044820152606401610448565b60068101541580610ca8575080600601543411155b610d0e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f6d617820707269636520657863656564656400000000000000000000000000006044820152606401610448565b6001815460ff166002811115610d2657610d26612ca8565b03610d535760008281526002602052604090205473ffffffffffffffffffffffffffffffffffffffff1692505b6001816003016000828254610d689190612e76565b90915550610d7890508334612498565b6040517f731133e900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8581166004830152602482018490526001604483015260806064830152600060848301527f0000000000000000000000000000000000000000000000000000000000000000169063731133e99060a401600060405180830381600087803b158015610e1d57600080fd5b505af1158015610e31573d6000803e3d6000fd5b50505050818373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167f5d4fda7240a3bcd7170980bb222c3df7a119c03f3fe98a939ac6e85948b584a034604051610e9591815260200190565b60405180910390a450610ea86001600055565b505050565b610eb5612390565b60008281526004602052604090206001815460ff166002811115610edb57610edb612ca8565b1480610efc57506002815460ff166002811115610efa57610efa612ca8565b145b610f62576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f696e76616c69642070726f6475637420747970650000000000000000000000006044820152606401610448565b6000816003015411610fd0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f6f7574206f662073746f636b00000000000000000000000000000000000000006044820152606401610448565b6001600782015474010000000000000000000000000000000000000000900460ff16600181111561100357611003612ca8565b1461106a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f70726f64756374206e6f742061637469766500000000000000000000000000006044820152606401610448565b600781015473ffffffffffffffffffffffffffffffffffffffff166110eb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f696e76616c696420746f6b656e207479706500000000000000000000000000006044820152606401610448565b60068101541580611100575080600601548211155b611166576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f6d617820707269636520657863656564656400000000000000000000000000006044820152606401610448565b6001815460ff16600281111561117e5761117e612ca8565b036111ab5760008381526002602052604090205473ffffffffffffffffffffffffffffffffffffffff1693505b60018160030160008282546111c09190612e76565b909155505060078101546111ec9073ffffffffffffffffffffffffffffffffffffffff16868685612403565b6040517f731133e900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8681166004830152602482018590526001604483015260806064830152600060848301527f0000000000000000000000000000000000000000000000000000000000000000169063731133e99060a401600060405180830381600087803b15801561129157600080fd5b505af11580156112a5573d6000803e3d6000fd5b50505050828473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff167f5d4fda7240a3bcd7170980bb222c3df7a119c03f3fe98a939ac6e85948b584a08560405161082191815260200190565b600081815260026020526040902054819073ffffffffffffffffffffffffffffffffffffffff163314611398576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f6e6f742066726f6d206f776e65720000000000000000000000000000000000006044820152606401610448565b600082815260046020526040812090600782015474010000000000000000000000000000000000000000900460ff1660018111156113d8576113d8612ca8565b1461143f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f70726f64756374206e6f7420696e6163746976650000000000000000000000006044820152606401610448565b610ea8818460016125f2565b600060016000815461145c906130f4565b91905081905590506040518061012001604052808a600281111561148257611482612ca8565b815260200182815260200189898080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152505050908252506020810188905260408101879052606081018690526080810185905273ffffffffffffffffffffffffffffffffffffffff841660a082015260c0016001905260008281526004602052604090208151815482907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016600183600281111561154f5761154f612ca8565b02179055506020820151600182015560408201516002820190611572908261312c565b50606082015160038201556080820151600482015560a0820151600582015560c0820151600682015560e082015160078201805473ffffffffffffffffffffffffffffffffffffffff9092167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178255610100850151927fffffffffffffffffffffff00000000000000000000000000000000000000000016177401000000000000000000000000000000000000000083600181111561163757611637612ca8565b02179055505050600081815260026020908152604080832080547fffffffffffffffffffffffff0000000000000000000000000000000000000000163390811790915583526003825280832080546001810182559084529190922001829055517f862440e20000000000000000000000000000000000000000000000000000000081527f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff169063862440e29061170a9084908c908c906004016130bd565b600060405180830381600087803b15801561172457600080fd5b505af1158015611738573d6000803e3d6000fd5b50506040513392508391507f4f3181d227c647e281efabfa1e1ee55cc982f3d8ab6d495bf054aa0ff3083d6f90600090a398975050505050505050565b61177d612390565b600082815260046020526040812090815460ff1660028111156117a2576117a2612ca8565b14611809576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f696e76616c69642070726f6475637420747970650000000000000000000000006044820152606401610448565b8060030154821115611877576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f6f7574206f662073746f636b00000000000000000000000000000000000000006044820152606401610448565b6001600782015474010000000000000000000000000000000000000000900460ff1660018111156118aa576118aa612ca8565b14611911576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f70726f64756374206e6f742061637469766500000000000000000000000000006044820152606401610448565b600781015473ffffffffffffffffffffffffffffffffffffffff1615611993576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f696e76616c696420746f6b656e207479706500000000000000000000000000006044820152606401610448565b600082116119fd576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f696e76616c6964207175616e74697479000000000000000000000000000000006044820152606401610448565b8060050154821115611a6b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f6d6178207175616e7469747920657863656564656400000000000000000000006044820152606401610448565b818160040154611a7b9190612e59565b3414611a8657600080fd5b81816003016000828254611a9a9190612e76565b9091555050600083815260026020526040902054611ace9073ffffffffffffffffffffffffffffffffffffffff1634612498565b6040517f731133e900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8581166004830152602482018590526044820184905260806064830152600060848301527f0000000000000000000000000000000000000000000000000000000000000000169063731133e99060a401600060405180830381600087803b158015611b7357600080fd5b505af1158015611b87573d6000803e3d6000fd5b50506040805185815234602082015286935073ffffffffffffffffffffffffffffffffffffffff8816925033917ef93dbdb72854b6b6fb35433086556f2635fc83c37080c667496fecfa650fb49101610e95565b60046020526000908152604090208054600182015460028301805460ff909316939192611c0790612eb8565b80601f0160208091040260200160405190810160405280929190818152602001828054611c3390612eb8565b8015611c805780601f10611c5557610100808354040283529160200191611c80565b820191906000526020600020905b815481529060010190602001808311611c6357829003601f168201915b505050600384015460048501546005860154600687015460079097015495969295919450925073ffffffffffffffffffffffffffffffffffffffff81169060ff740100000000000000000000000000000000000000009091041689565b600082815260026020526040902054829073ffffffffffffffffffffffffffffffffffffffff163314611d6c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f6e6f742066726f6d206f776e65720000000000000000000000000000000000006044820152606401610448565b600083815260046020526040902060018101548414611de7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f70726f647563744964206e6f74206d61746368000000000000000000000000006044820152606401610448565b60048101839055604051838152849033907f5c2a0216ef065f0b55e400f83a524a1ee63ec0459436d6241763135efcce0b1e906020015b60405180910390a350505050565b60036020528160005260406000208181548110611e4857600080fd5b90600052602060002001600091509150505481565b600082815260026020526040902054829073ffffffffffffffffffffffffffffffffffffffff163314611eec576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f6e6f742066726f6d206f776e65720000000000000000000000000000000000006044820152606401610448565b60008211611f56576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f696e76616c6964207175616e74697479000000000000000000000000000000006044820152606401610448565b600083815260046020526040902060018101548414611fd1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f70726f647563744964206e6f74206d61746368000000000000000000000000006044820152606401610448565b82816003016000828254611fe59190613246565b9091555050604051838152849033907f198f35366637579d7bd48a95cb88e93e65c4ed73893c9bd112e963de5a38ea2390602001611e1e565b600081815260026020526040902054819073ffffffffffffffffffffffffffffffffffffffff1633146120ad576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f6e6f742066726f6d206f776e65720000000000000000000000000000000000006044820152606401610448565b60008281526004602052604090206001600782015474010000000000000000000000000000000000000000900460ff1660018111156120ee576120ee612ca8565b14612155576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f70726f64756374206e6f742061637469766500000000000000000000000000006044820152606401610448565b610ea8818460006125f2565b600082815260026020526040902054829073ffffffffffffffffffffffffffffffffffffffff1633146121f0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f6e6f742066726f6d206f776e65720000000000000000000000000000000000006044820152606401610448565b6000821161225a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f696e76616c6964207175616e74697479000000000000000000000000000000006044820152606401610448565b6000838152600460205260409020600181015484146122d5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f70726f647563744964206e6f74206d61746368000000000000000000000000006044820152606401610448565b8281600301541015612343576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f6f7574206f662073746f636b00000000000000000000000000000000000000006044820152606401610448565b828160030160008282546123579190612e76565b9091555050604051838152849033907f187b120007f9c42564635b2cc3ffc1135c876c28d721d43d3c948e005af6e8a990602001611e1e565b6002600054036123fc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610448565b6002600055565b6040805173ffffffffffffffffffffffffffffffffffffffff85811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f23b872dd0000000000000000000000000000000000000000000000000000000017905261083490859061270b565b80471015612502576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e63650000006044820152606401610448565b60008273ffffffffffffffffffffffffffffffffffffffff168260405160006040518083038185875af1925050503d806000811461255c576040519150601f19603f3d011682016040523d82523d6000602084013e612561565b606091505b5050905080610ea8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d617920686176652072657665727465640000000000006064820152608401610448565b8183600101541461265f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601360248201527f70726f647563744964206e6f74206d61746368000000000000000000000000006044820152606401610448565b6007830180548291907fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff16740100000000000000000000000000000000000000008360018111156126b2576126b2612ca8565b0217905550813373ffffffffffffffffffffffffffffffffffffffff167f08011185cddd29033a347051cfccf2ce17fbf2a30e0815f91142ad61cd37ee21836040516126fe9190613259565b60405180910390a3505050565b600061276d826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff166128179092919063ffffffff16565b805190915015610ea8578080602001905181019061278b9190613267565b610ea8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608401610448565b6060612826848460008561282e565b949350505050565b6060824710156128c0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401610448565b6000808673ffffffffffffffffffffffffffffffffffffffff1685876040516128e99190613289565b60006040518083038185875af1925050503d8060008114612926576040519150601f19603f3d011682016040523d82523d6000602084013e61292b565b606091505b509150915061293c87838387612947565b979650505050505050565b606083156129dd5782516000036129d65773ffffffffffffffffffffffffffffffffffffffff85163b6129d6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610448565b5081612826565b61282683838151156129f25781518083602001fd5b806040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161044891906132a5565b73ffffffffffffffffffffffffffffffffffffffff81168114612a4857600080fd5b50565b60008060008060808587031215612a6157600080fd5b8435612a6c81612a26565b966020860135965060408601359560600135945092505050565b600060208284031215612a9857600080fd5b8135612aa381612a26565b9392505050565b60008083601f840112612abc57600080fd5b50813567ffffffffffffffff811115612ad457600080fd5b602083019150836020828501011115612aec57600080fd5b9250929050565b600080600060408486031215612b0857600080fd5b83359250602084013567ffffffffffffffff811115612b2657600080fd5b612b3286828701612aaa565b9497909650939450505050565b600080600060608486031215612b5457600080fd5b8335612b5f81612a26565b92506020840135612b6f81612a26565b929592945050506040919091013590565b60008060008060808587031215612b9657600080fd5b8435612ba181612a26565b93506020850135612bb181612a26565b93969395505050506040820135916060013590565b600060208284031215612bd857600080fd5b5035919050565b60008060008060008060008060e0898b031215612bfb57600080fd5b883560038110612c0a57600080fd5b9750602089013567ffffffffffffffff811115612c2657600080fd5b612c328b828c01612aaa565b90985096505060408901359450606089013593506080890135925060a0890135915060c0890135612c6281612a26565b809150509295985092959890939650565b600080600060608486031215612c8857600080fd5b8335612c9381612a26565b95602085013595506040909401359392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60005b83811015612cf2578181015183820152602001612cda565b50506000910152565b60008151808452612d13816020860160208601612cd7565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b60028110612d5557612d55612ca8565b9052565b600061012060038c10612d6e57612d6e612ca8565b8b83528a6020840152806040840152612d898184018b612cfb565b9150508760608301528660808301528560a08301528460c083015273ffffffffffffffffffffffffffffffffffffffff841660e0830152612dce610100830184612d45565b9a9950505050505050505050565b60008060408385031215612def57600080fd5b50508035926020909101359150565b60008060408385031215612e1157600080fd5b8235612e1c81612a26565b946020939093013593505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8082028115828204841417612e7057612e70612e2a565b92915050565b81810381811115612e7057612e70612e2a565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600181811c90821680612ecc57607f821691505b602082108103612f05577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b601f821115610ea857600081815260208120601f850160051c81016020861015612f325750805b601f850160051c820191505b81811015612f5157828155600101612f3e565b505050505050565b67ffffffffffffffff831115612f7157612f71612e89565b612f8583612f7f8354612eb8565b83612f0b565b6000601f841160018114612fd75760008515612fa15750838201355b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600387901b1c1916600186901b17835561306d565b6000838152602090207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0861690835b828110156130265786850135825560209485019460019092019101613006565b5086821015613061577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88860031b161c19848701351681555b505060018560011b0183555b5050505050565b8183528181602085013750600060208284010152600060207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f840116840101905092915050565b8381526040602082015260006130d7604083018486613074565b95945050505050565b602081526000612826602083018486613074565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361312557613125612e2a565b5060010190565b815167ffffffffffffffff81111561314657613146612e89565b61315a816131548454612eb8565b84612f0b565b602080601f8311600181146131ad57600084156131775750858301515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600386901b1c1916600185901b178555612f51565b6000858152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08616915b828110156131fa578886015182559484019460019091019084016131db565b508582101561323657878501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b5050505050600190811b01905550565b80820180821115612e7057612e70612e2a565b60208101612e708284612d45565b60006020828403121561327957600080fd5b81518015158114612aa357600080fd5b6000825161329b818460208701612cd7565b9190910192915050565b602081526000612aa36020830184612cfb56fea26469706673582212202d1d4e09a641048f2cbb81734bb87ed1dc133cec1bc460092332111dbfc6bd3c64736f6c63430008110033"
    };
});
define("@scom/scom-nft-minter/contracts/scom-product-contract/contracts/ProductInfo.ts", ["require", "exports", "@ijstech/eth-contract", "@scom/scom-nft-minter/contracts/scom-product-contract/contracts/ProductInfo.json.ts"], function (require, exports, eth_contract_5, ProductInfo_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProductInfo = void 0;
    class ProductInfo extends eth_contract_5.Contract {
        constructor(wallet, address) {
            super(wallet, address, ProductInfo_json_1.default.abi, ProductInfo_json_1.default.bytecode);
            this.assign();
        }
        deploy(nft, options) {
            return this.__deploy([nft], options);
        }
        parseBuyEvent(receipt) {
            return this.parseEvents(receipt, "Buy").map(e => this.decodeBuyEvent(e));
        }
        decodeBuyEvent(event) {
            let result = event.data;
            return {
                sender: result.sender,
                recipient: result.recipient,
                productId: new eth_contract_5.BigNumber(result.productId),
                quantity: new eth_contract_5.BigNumber(result.quantity),
                amountIn: new eth_contract_5.BigNumber(result.amountIn),
                _event: event
            };
        }
        parseDecrementInventoryEvent(receipt) {
            return this.parseEvents(receipt, "DecrementInventory").map(e => this.decodeDecrementInventoryEvent(e));
        }
        decodeDecrementInventoryEvent(event) {
            let result = event.data;
            return {
                sender: result.sender,
                productId: new eth_contract_5.BigNumber(result.productId),
                decrement: new eth_contract_5.BigNumber(result.decrement),
                _event: event
            };
        }
        parseDonateEvent(receipt) {
            return this.parseEvents(receipt, "Donate").map(e => this.decodeDonateEvent(e));
        }
        decodeDonateEvent(event) {
            let result = event.data;
            return {
                donor: result.donor,
                donee: result.donee,
                productId: new eth_contract_5.BigNumber(result.productId),
                amountIn: new eth_contract_5.BigNumber(result.amountIn),
                _event: event
            };
        }
        parseIncrementInventoryEvent(receipt) {
            return this.parseEvents(receipt, "IncrementInventory").map(e => this.decodeIncrementInventoryEvent(e));
        }
        decodeIncrementInventoryEvent(event) {
            let result = event.data;
            return {
                sender: result.sender,
                productId: new eth_contract_5.BigNumber(result.productId),
                increment: new eth_contract_5.BigNumber(result.increment),
                _event: event
            };
        }
        parseNewProductEvent(receipt) {
            return this.parseEvents(receipt, "NewProduct").map(e => this.decodeNewProductEvent(e));
        }
        decodeNewProductEvent(event) {
            let result = event.data;
            return {
                productId: new eth_contract_5.BigNumber(result.productId),
                owner: result.owner,
                _event: event
            };
        }
        parseUpdateProductPriceEvent(receipt) {
            return this.parseEvents(receipt, "UpdateProductPrice").map(e => this.decodeUpdateProductPriceEvent(e));
        }
        decodeUpdateProductPriceEvent(event) {
            let result = event.data;
            return {
                sender: result.sender,
                productId: new eth_contract_5.BigNumber(result.productId),
                price: new eth_contract_5.BigNumber(result.price),
                _event: event
            };
        }
        parseUpdateProductStatusEvent(receipt) {
            return this.parseEvents(receipt, "UpdateProductStatus").map(e => this.decodeUpdateProductStatusEvent(e));
        }
        decodeUpdateProductStatusEvent(event) {
            let result = event.data;
            return {
                sender: result.sender,
                productId: new eth_contract_5.BigNumber(result.productId),
                status: new eth_contract_5.BigNumber(result.status),
                _event: event
            };
        }
        parseUpdateProductUriEvent(receipt) {
            return this.parseEvents(receipt, "UpdateProductUri").map(e => this.decodeUpdateProductUriEvent(e));
        }
        decodeUpdateProductUriEvent(event) {
            let result = event.data;
            return {
                sender: result.sender,
                productId: new eth_contract_5.BigNumber(result.productId),
                uri: result.uri,
                _event: event
            };
        }
        assign() {
            let nft_call = async (options) => {
                let result = await this.call('nft', [], options);
                return result;
            };
            this.nft = nft_call;
            let ownersProductsParams = (params) => [params.param1, this.wallet.utils.toString(params.param2)];
            let ownersProducts_call = async (params, options) => {
                let result = await this.call('ownersProducts', ownersProductsParams(params), options);
                return new eth_contract_5.BigNumber(result);
            };
            this.ownersProducts = ownersProducts_call;
            let ownersProductsLength_call = async (owner, options) => {
                let result = await this.call('ownersProductsLength', [owner], options);
                return new eth_contract_5.BigNumber(result);
            };
            this.ownersProductsLength = ownersProductsLength_call;
            let productCount_call = async (options) => {
                let result = await this.call('productCount', [], options);
                return new eth_contract_5.BigNumber(result);
            };
            this.productCount = productCount_call;
            let productOwner_call = async (param1, options) => {
                let result = await this.call('productOwner', [this.wallet.utils.toString(param1)], options);
                return result;
            };
            this.productOwner = productOwner_call;
            let products_call = async (param1, options) => {
                let result = await this.call('products', [this.wallet.utils.toString(param1)], options);
                return {
                    productType: new eth_contract_5.BigNumber(result.productType),
                    productId: new eth_contract_5.BigNumber(result.productId),
                    uri: result.uri,
                    quantity: new eth_contract_5.BigNumber(result.quantity),
                    price: new eth_contract_5.BigNumber(result.price),
                    maxQuantity: new eth_contract_5.BigNumber(result.maxQuantity),
                    maxPrice: new eth_contract_5.BigNumber(result.maxPrice),
                    token: result.token,
                    status: new eth_contract_5.BigNumber(result.status)
                };
            };
            this.products = products_call;
            let activateProduct_send = async (productId, options) => {
                let result = await this.send('activateProduct', [this.wallet.utils.toString(productId)], options);
                return result;
            };
            let activateProduct_call = async (productId, options) => {
                let result = await this.call('activateProduct', [this.wallet.utils.toString(productId)], options);
                return;
            };
            let activateProduct_txData = async (productId, options) => {
                let result = await this.txData('activateProduct', [this.wallet.utils.toString(productId)], options);
                return result;
            };
            this.activateProduct = Object.assign(activateProduct_send, {
                call: activateProduct_call,
                txData: activateProduct_txData
            });
            let buyParams = (params) => [params.to, this.wallet.utils.toString(params.productId), this.wallet.utils.toString(params.quantity), this.wallet.utils.toString(params.amountIn)];
            let buy_send = async (params, options) => {
                let result = await this.send('buy', buyParams(params), options);
                return result;
            };
            let buy_call = async (params, options) => {
                let result = await this.call('buy', buyParams(params), options);
                return;
            };
            let buy_txData = async (params, options) => {
                let result = await this.txData('buy', buyParams(params), options);
                return result;
            };
            this.buy = Object.assign(buy_send, {
                call: buy_call,
                txData: buy_txData
            });
            let buyEthParams = (params) => [params.to, this.wallet.utils.toString(params.productId), this.wallet.utils.toString(params.quantity)];
            let buyEth_send = async (params, options) => {
                let result = await this.send('buyEth', buyEthParams(params), options);
                return result;
            };
            let buyEth_call = async (params, options) => {
                let result = await this.call('buyEth', buyEthParams(params), options);
                return;
            };
            let buyEth_txData = async (params, options) => {
                let result = await this.txData('buyEth', buyEthParams(params), options);
                return result;
            };
            this.buyEth = Object.assign(buyEth_send, {
                call: buyEth_call,
                txData: buyEth_txData
            });
            let deactivateProduct_send = async (productId, options) => {
                let result = await this.send('deactivateProduct', [this.wallet.utils.toString(productId)], options);
                return result;
            };
            let deactivateProduct_call = async (productId, options) => {
                let result = await this.call('deactivateProduct', [this.wallet.utils.toString(productId)], options);
                return;
            };
            let deactivateProduct_txData = async (productId, options) => {
                let result = await this.txData('deactivateProduct', [this.wallet.utils.toString(productId)], options);
                return result;
            };
            this.deactivateProduct = Object.assign(deactivateProduct_send, {
                call: deactivateProduct_call,
                txData: deactivateProduct_txData
            });
            let decrementInventoryParams = (params) => [this.wallet.utils.toString(params.productId), this.wallet.utils.toString(params.decrement)];
            let decrementInventory_send = async (params, options) => {
                let result = await this.send('decrementInventory', decrementInventoryParams(params), options);
                return result;
            };
            let decrementInventory_call = async (params, options) => {
                let result = await this.call('decrementInventory', decrementInventoryParams(params), options);
                return;
            };
            let decrementInventory_txData = async (params, options) => {
                let result = await this.txData('decrementInventory', decrementInventoryParams(params), options);
                return result;
            };
            this.decrementInventory = Object.assign(decrementInventory_send, {
                call: decrementInventory_call,
                txData: decrementInventory_txData
            });
            let donateParams = (params) => [params.donor, params.donee, this.wallet.utils.toString(params.productId), this.wallet.utils.toString(params.amountIn)];
            let donate_send = async (params, options) => {
                let result = await this.send('donate', donateParams(params), options);
                return result;
            };
            let donate_call = async (params, options) => {
                let result = await this.call('donate', donateParams(params), options);
                return;
            };
            let donate_txData = async (params, options) => {
                let result = await this.txData('donate', donateParams(params), options);
                return result;
            };
            this.donate = Object.assign(donate_send, {
                call: donate_call,
                txData: donate_txData
            });
            let donateEthParams = (params) => [params.donor, params.donee, this.wallet.utils.toString(params.productId)];
            let donateEth_send = async (params, options) => {
                let result = await this.send('donateEth', donateEthParams(params), options);
                return result;
            };
            let donateEth_call = async (params, options) => {
                let result = await this.call('donateEth', donateEthParams(params), options);
                return;
            };
            let donateEth_txData = async (params, options) => {
                let result = await this.txData('donateEth', donateEthParams(params), options);
                return result;
            };
            this.donateEth = Object.assign(donateEth_send, {
                call: donateEth_call,
                txData: donateEth_txData
            });
            let incrementInventoryParams = (params) => [this.wallet.utils.toString(params.productId), this.wallet.utils.toString(params.increment)];
            let incrementInventory_send = async (params, options) => {
                let result = await this.send('incrementInventory', incrementInventoryParams(params), options);
                return result;
            };
            let incrementInventory_call = async (params, options) => {
                let result = await this.call('incrementInventory', incrementInventoryParams(params), options);
                return;
            };
            let incrementInventory_txData = async (params, options) => {
                let result = await this.txData('incrementInventory', incrementInventoryParams(params), options);
                return result;
            };
            this.incrementInventory = Object.assign(incrementInventory_send, {
                call: incrementInventory_call,
                txData: incrementInventory_txData
            });
            let newProductParams = (params) => [this.wallet.utils.toString(params.productType), params.uri, this.wallet.utils.toString(params.quantity), this.wallet.utils.toString(params.price), this.wallet.utils.toString(params.maxQuantity), this.wallet.utils.toString(params.maxPrice), params.token];
            let newProduct_send = async (params, options) => {
                let result = await this.send('newProduct', newProductParams(params), options);
                return result;
            };
            let newProduct_call = async (params, options) => {
                let result = await this.call('newProduct', newProductParams(params), options);
                return new eth_contract_5.BigNumber(result);
            };
            let newProduct_txData = async (params, options) => {
                let result = await this.txData('newProduct', newProductParams(params), options);
                return result;
            };
            this.newProduct = Object.assign(newProduct_send, {
                call: newProduct_call,
                txData: newProduct_txData
            });
            let updateProductPriceParams = (params) => [this.wallet.utils.toString(params.productId), this.wallet.utils.toString(params.price)];
            let updateProductPrice_send = async (params, options) => {
                let result = await this.send('updateProductPrice', updateProductPriceParams(params), options);
                return result;
            };
            let updateProductPrice_call = async (params, options) => {
                let result = await this.call('updateProductPrice', updateProductPriceParams(params), options);
                return;
            };
            let updateProductPrice_txData = async (params, options) => {
                let result = await this.txData('updateProductPrice', updateProductPriceParams(params), options);
                return result;
            };
            this.updateProductPrice = Object.assign(updateProductPrice_send, {
                call: updateProductPrice_call,
                txData: updateProductPrice_txData
            });
            let updateProductUriParams = (params) => [this.wallet.utils.toString(params.productId), params.uri];
            let updateProductUri_send = async (params, options) => {
                let result = await this.send('updateProductUri', updateProductUriParams(params), options);
                return result;
            };
            let updateProductUri_call = async (params, options) => {
                let result = await this.call('updateProductUri', updateProductUriParams(params), options);
                return;
            };
            let updateProductUri_txData = async (params, options) => {
                let result = await this.txData('updateProductUri', updateProductUriParams(params), options);
                return result;
            };
            this.updateProductUri = Object.assign(updateProductUri_send, {
                call: updateProductUri_call,
                txData: updateProductUri_txData
            });
        }
    }
    exports.ProductInfo = ProductInfo;
    ProductInfo._abi = ProductInfo_json_1.default.abi;
});
define("@scom/scom-nft-minter/contracts/scom-product-contract/contracts/index.ts", ["require", "exports", "@scom/scom-nft-minter/contracts/scom-product-contract/contracts/@openzeppelin/contracts/token/ERC1155/ERC1155.ts", "@scom/scom-nft-minter/contracts/scom-product-contract/contracts/@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.ts", "@scom/scom-nft-minter/contracts/scom-product-contract/contracts/ERC20.ts", "@scom/scom-nft-minter/contracts/scom-product-contract/contracts/Product1155.ts", "@scom/scom-nft-minter/contracts/scom-product-contract/contracts/ProductInfo.ts"], function (require, exports, ERC1155_1, ERC1155PresetMinterPauser_1, ERC20_1, Product1155_1, ProductInfo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProductInfo = exports.Product1155 = exports.ERC20 = exports.ERC1155PresetMinterPauser = exports.ERC1155 = void 0;
    Object.defineProperty(exports, "ERC1155", { enumerable: true, get: function () { return ERC1155_1.ERC1155; } });
    Object.defineProperty(exports, "ERC1155PresetMinterPauser", { enumerable: true, get: function () { return ERC1155PresetMinterPauser_1.ERC1155PresetMinterPauser; } });
    Object.defineProperty(exports, "ERC20", { enumerable: true, get: function () { return ERC20_1.ERC20; } });
    Object.defineProperty(exports, "Product1155", { enumerable: true, get: function () { return Product1155_1.Product1155; } });
    Object.defineProperty(exports, "ProductInfo", { enumerable: true, get: function () { return ProductInfo_1.ProductInfo; } });
});
define("@scom/scom-nft-minter/contracts/scom-product-contract/index.ts", ["require", "exports", "@scom/scom-nft-minter/contracts/scom-product-contract/contracts/index.ts", "@ijstech/eth-wallet"], function (require, exports, Contracts, eth_wallet_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onProgress = exports.deploy = exports.DefaultDeployOptions = exports.Contracts = void 0;
    exports.Contracts = Contracts;
    ;
    ;
    var progressHandler;
    exports.DefaultDeployOptions = {
        deployERC20: false,
        initSupply: '10000000000000000000000',
        templateURI: ''
    };
    function progress(msg) {
        if (typeof (progressHandler) == 'function') {
            progressHandler(msg);
        }
        ;
    }
    async function deploy(wallet, options) {
        var _a;
        let erc20Address;
        if (options.deployERC20) {
            let erc20 = new Contracts.ERC20(wallet);
            progress('Deploy ERC20');
            erc20Address = await erc20.deploy();
            progress('ERC20 deployed ' + erc20Address);
            if (options && options.initSupply) {
                progress('Mint initial supply ' + options.initSupply);
                let value = new eth_wallet_8.BigNumber(options.initSupply);
                let result = await erc20.mint(value);
                progress('Transaction # ' + result.transactionHash);
            }
            ;
        }
        let product1155 = new Contracts.Product1155(wallet);
        progress('Deploy Product1155');
        let product1155Address = await product1155.deploy((_a = options === null || options === void 0 ? void 0 : options.templateURI) !== null && _a !== void 0 ? _a : "");
        progress('Product1155 deployed ' + product1155Address);
        let productInfo = new Contracts.ProductInfo(wallet);
        progress('Deploy ProductInfo');
        let productInfoAddress = await productInfo.deploy(product1155.address);
        progress('ProductInfo deployed ' + productInfoAddress);
        progress('Grant Minter Role');
        let minterRole = await product1155.MINTER_ROLE();
        await product1155.grantRole({ role: minterRole, account: productInfoAddress });
        return {
            erc20: erc20Address,
            product1155: product1155Address,
            productInfo: productInfoAddress
        };
    }
    exports.deploy = deploy;
    ;
    function onProgress(handler) {
        progressHandler = handler;
    }
    exports.onProgress = onProgress;
    ;
    exports.default = {
        Contracts,
        deploy,
        DefaultDeployOptions: exports.DefaultDeployOptions,
        onProgress
    };
});
define("@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/Proxy.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/Proxy.json.ts'/> 
    exports.default = {
        "abi": [
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "AddCommission", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Claim", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Skim", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "target", "type": "address" }, { "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TransferBack", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "target", "type": "address" }, { "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "commissions", "type": "uint256" }], "name": "TransferForward", "type": "event" },
            { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "contract IERC20[]", "name": "tokens", "type": "address[]" }], "name": "claimMultiple", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [], "name": "claimantIdCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "contract IERC20", "name": "", "type": "address" }], "name": "claimantIds", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "claimantsInfo", "outputs": [{ "internalType": "address", "name": "claimant", "type": "address" }, { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }, { "components": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "internalType": "struct Proxy.Commission[]", "name": "commissions", "type": "tuple[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "ethIn", "outputs": [], "stateMutability": "payable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "claimant", "type": "address" }, { "internalType": "contract IERC20", "name": "token", "type": "address" }], "name": "getClaimantBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "fromId", "type": "uint256" }, { "internalType": "uint256", "name": "count", "type": "uint256" }], "name": "getClaimantsInfo", "outputs": [{ "components": [{ "internalType": "address", "name": "claimant", "type": "address" }, { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }], "internalType": "struct Proxy.ClaimantInfo[]", "name": "claimantInfoList", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "name": "lastBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }, { "components": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bool", "name": "directTransfer", "type": "bool" }, { "components": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "internalType": "struct Proxy.Commission[]", "name": "commissions", "type": "tuple[]" }], "internalType": "struct Proxy.TokensIn[]", "name": "tokensIn", "type": "tuple[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "contract IERC20[]", "name": "tokensOut", "type": "address[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "proxyCall", "outputs": [], "stateMutability": "payable", "type": "function" },
            { "inputs": [{ "internalType": "contract IERC20[]", "name": "tokens", "type": "address[]" }], "name": "skim", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }, { "components": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bool", "name": "directTransfer", "type": "bool" }, { "components": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "internalType": "struct Proxy.Commission[]", "name": "commissions", "type": "tuple[]" }], "internalType": "struct Proxy.TokensIn", "name": "tokensIn", "type": "tuple" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "tokenIn", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "stateMutability": "payable", "type": "receive" }
        ],
        "bytecode": "608060405234801561001057600080fd5b50612571806100206000396000f3fe6080604052600436106100cb5760003560e01c8063b60c164c11610074578063d3b7d4c31161004e578063d3b7d4c31461027c578063ee42d3a31461029c578063f303ad6e146102c957600080fd5b8063b60c164c146101b1578063c0da918d146101d1578063d2ef8464146101f157600080fd5b806373d8690f116100a557806373d8690f1461014257806383e40a5114610155578063b316d7141461019b57600080fd5b806301417e7b146100d7578063188ff72b146100ec5780631e83409a1461012257600080fd5b366100d257005b600080fd5b6100ea6100e5366004611f7a565b6102e9565b005b3480156100f857600080fd5b5061010c610107366004612027565b610493565b6040516101199190612049565b60405180910390f35b34801561012e57600080fd5b506100ea61013d3660046120bb565b610677565b6100ea610150366004612124565b610683565b34801561016157600080fd5b5061018d6101703660046121df565b600360209081526000928352604080842090915290825290205481565b604051908152602001610119565b3480156101a757600080fd5b5061018d60005481565b3480156101bd57600080fd5b506100ea6101cc366004612218565b610e18565b3480156101dd57600080fd5b506100ea6101ec36600461225a565b611000565b3480156101fd57600080fd5b5061024961020c3660046122d8565b600260208190526000918252604090912080546001820154919092015473ffffffffffffffffffffffffffffffffffffffff928316929091169083565b6040805173ffffffffffffffffffffffffffffffffffffffff948516815293909216602084015290820152606001610119565b34801561028857600080fd5b5061018d6102973660046121df565b611361565b3480156102a857600080fd5b5061018d6102b73660046120bb565b60016020526000908152604090205481565b3480156102d557600080fd5b506100ea6102e4366004612218565b6113aa565b600082815b818110156103bb5736868683818110610309576103096122f1565b9050604002019050806020013584610321919061234f565b935061033f61033360208301836120bb565b600083602001356113f7565b7fe3576de866d95e30a6b102b256dc468ead824ef133838792dc1813c3786414ef61036d60208301836120bb565b6040805173ffffffffffffffffffffffffffffffffffffffff909216825260006020838101919091528401359082015260600160405180910390a150806103b381612362565b9150506102ee565b5060006103c8833461239a565b600080805260016020527fa6eef7e35abe7026729641147f7915573c7e97b47efa546f5f6e3230263bcb498054929350859290919061040890849061234f565b9091555050604080513381526020810183905290810184905260009073ffffffffffffffffffffffffffffffffffffffff8916907f0e25509c2c6fc37a8844100a9a4c5b2b038bd5daaf09d216161eb8574ad4878b9060600160405180910390a3600080855186602001848b5af180600003610488573d6000803e3d6000fd5b503d6000803e3d6000f35b60606000831180156104a757506000548311155b610512576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600d60248201527f6f7574206f6620626f756e64730000000000000000000000000000000000000060448201526064015b60405180910390fd5b60006001610520848661234f565b61052a919061239a565b90506000548111156105525750600054610544848261239a565b61054f90600161234f565b92505b8267ffffffffffffffff81111561056b5761056b611ea0565b6040519080825280602002602001820160405280156105d457816020015b60408051606081018252600080825260208083018290529282015282527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9092019101816105895790505b5091508360005b8481101561066e576000828152600260208181526040928390208351606081018552815473ffffffffffffffffffffffffffffffffffffffff90811682526001830154169281019290925290910154918101919091528451859083908110610645576106456122f1565b60200260200101819052508161065a90612362565b91508061066681612362565b9150506105db565b50505092915050565b6106808161151c565b50565b846000805b82811015610b5b57368989838181106106a3576106a36122f1565b90506020028101906106b591906123ad565b90506000806106c760608401846123eb565b9050905060005b818110156107c057366106e460608601866123eb565b838181106106f4576106f46122f1565b905060400201905080602001358461070c919061234f565b935061073561071e60208301836120bb565b61072b60208801886120bb565b83602001356113f7565b7fe3576de866d95e30a6b102b256dc468ead824ef133838792dc1813c3786414ef61076360208301836120bb565b61077060208801886120bb565b6040805173ffffffffffffffffffffffffffffffffffffffff9384168152929091166020838101919091528401359082015260600160405180910390a150806107b881612362565b9150506106ce565b50600090506107d382602085013561239a565b905081600160006107e760208701876120bb565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610830919061234f565b909155506000905061084560208501856120bb565b73ffffffffffffffffffffffffffffffffffffffff160361093d5784156108c8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601a60248201527f6d6f7265207468616e206f6e6520455448207472616e736665720000000000006044820152606401610509565b82602001353414610935576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f45544820616d6f756e74206e6f74206d617463686564000000000000000000006044820152606401610509565b809450610adb565b61094d6060840160408501612461565b15610a0c57600061096a61096460208601866120bb565b8461164a565b90508281146109d5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f636f6d6d697373696f6e20616d6f756e74206e6f74206d6174636865640000006044820152606401610509565b610a06338f846109e860208901896120bb565b73ffffffffffffffffffffffffffffffffffffffff169291906117a0565b50610adb565b6000610a28610a1e60208601866120bb565b856020013561164a565b905083602001358114610a97576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f616d6f756e74206e6f74206d61746368656400000000000000000000000000006044820152606401610509565b610ac78e6000610aaa60208801886120bb565b73ffffffffffffffffffffffffffffffffffffffff16919061187c565b610ad98e83610aaa60208801886120bb565b505b610ae860208401846120bb565b604080513381526020810184905290810184905273ffffffffffffffffffffffffffffffffffffffff918216918f16907f0e25509c2c6fc37a8844100a9a4c5b2b038bd5daaf09d216161eb8574ad4878b9060600160405180910390a35050508080610b5390612362565b915050610688565b50600080845185602001848d5af180600003610b7b573d6000803e3d6000fd5b5083915060005b8281101561048857600080878784818110610b9f57610b9f6122f1565b9050602002016020810190610bb491906120bb565b73ffffffffffffffffffffffffffffffffffffffff1603610c15576000805260016020527fa6eef7e35abe7026729641147f7915573c7e97b47efa546f5f6e3230263bcb4954610c04904761239a565b9050610c108882611a03565b610d87565b60016000888885818110610c2b57610c2b6122f1565b9050602002016020810190610c4091906120bb565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054878784818110610c8d57610c8d6122f1565b9050602002016020810190610ca291906120bb565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015273ffffffffffffffffffffffffffffffffffffffff91909116906370a0823190602401602060405180830381865afa158015610d0e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d32919061247e565b610d3c919061239a565b9050610d878882898986818110610d5557610d556122f1565b9050602002016020810190610d6a91906120bb565b73ffffffffffffffffffffffffffffffffffffffff169190611b0d565b868683818110610d9957610d996122f1565b9050602002016020810190610dae91906120bb565b6040805173ffffffffffffffffffffffffffffffffffffffff8b8116825260208201859052928316928e16917fc2534859c9972270c16d5b4255d200f9a0385f9a6ce3add96c0427ff9fc70f93910160405180910390a35080610e1081612362565b915050610b82565b8060005b81811015610ffa57600080858584818110610e3957610e396122f1565b9050602002016020810190610e4e91906120bb565b905073ffffffffffffffffffffffffffffffffffffffff8116610eb4576000805260016020527fa6eef7e35abe7026729641147f7915573c7e97b47efa546f5f6e3230263bcb4954479250610ea3908361239a565b9150610eaf3383611a03565b610f98565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015273ffffffffffffffffffffffffffffffffffffffff8216906370a0823190602401602060405180830381865afa158015610f1e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f42919061247e565b73ffffffffffffffffffffffffffffffffffffffff8216600090815260016020526040902054909250610f75908361239a565b9150610f9873ffffffffffffffffffffffffffffffffffffffff82163384611b0d565b604051828152339073ffffffffffffffffffffffffffffffffffffffff8316907f2ae72b44f59d038340fca5739135a1d51fc5ab720bb02d983e4c5ff4119ca7b89060200160405180910390a350508080610ff290612362565b915050610e1c565b50505050565b8160008061101160608401846123eb565b9050905060005b81811015611100573661102e60608601866123eb565b8381811061103e5761103e6122f1565b9050604002019050806020013584611056919061234f565b935061107561106860208301836120bb565b61072b60208a018a6120bb565b7fe3576de866d95e30a6b102b256dc468ead824ef133838792dc1813c3786414ef6110a360208301836120bb565b6110b060208a018a6120bb565b6040805173ffffffffffffffffffffffffffffffffffffffff9384168152929091166020838101919091528401359082015260600160405180910390a150806110f881612362565b915050611018565b50600061111183602086013561239a565b9050826001600061112560208801886120bb565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461116e919061234f565b9091555061118490506060850160408601612461565b156112255760006111a161119b60208701876120bb565b8561164a565b905083811461120c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f636f6d6d697373696f6e20616d6f756e74206e6f74206d6174636865640000006044820152606401610509565b61121f3389846109e860208a018a6120bb565b506112d7565b600061124161123760208701876120bb565b866020013561164a565b9050846020013581146112b0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f616d6f756e74206e6f74206d61746368656400000000000000000000000000006044820152606401610509565b6112c3886000610aaa60208901896120bb565b6112d58883610aaa60208901896120bb565b505b6112e460208501856120bb565b604080513381526020810184905290810185905273ffffffffffffffffffffffffffffffffffffffff918216918916907f0e25509c2c6fc37a8844100a9a4c5b2b038bd5daaf09d216161eb8574ad4878b9060600160405180910390a360008086518760200160008b5af180600003610488573d6000803e3d6000fd5b73ffffffffffffffffffffffffffffffffffffffff8083166000908152600360209081526040808320938516835292815282822054825260029081905291902001545b92915050565b8060005b81811015610ffa576113e58484838181106113cb576113cb6122f1565b90506020020160208101906113e091906120bb565b61151c565b806113ef81612362565b9150506113ae565b73ffffffffffffffffffffffffffffffffffffffff8084166000908152600360209081526040808320938616835292905290812054908190036114f057600080815461144290612362565b909155506040805160608101825273ffffffffffffffffffffffffffffffffffffffff80871680835286821660208085018281528587018981526000805481526002808552898220985189549089167fffffffffffffffffffffffff0000000000000000000000000000000000000000918216178a55935160018a01805491909916941693909317909655519501949094558254918352600384528483209083529092529190912055610ffa565b6000818152600260208190526040822001805484929061151190849061234f565b909155505050505050565b33600090815260036020908152604080832073ffffffffffffffffffffffffffffffffffffffff858116808652918452828520548086526002808652848720855160608101875281548516815260018083015490951681890152910180548287018190529088905593875291909452918420805493949293919283926115a390849061239a565b909155505073ffffffffffffffffffffffffffffffffffffffff84166115d2576115cd3382611a03565b6115f3565b6115f373ffffffffffffffffffffffffffffffffffffffff85163383611b0d565b6040805173ffffffffffffffffffffffffffffffffffffffff861681526020810183905233917f70eb43c4a8ae8c40502dcf22436c509c28d6ff421cf07c491be56984bd987068910160405180910390a250505050565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015260009073ffffffffffffffffffffffffffffffffffffffff8416906370a0823190602401602060405180830381865afa1580156116b7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116db919061247e565b90506116ff73ffffffffffffffffffffffffffffffffffffffff84163330856117a0565b6040517f70a08231000000000000000000000000000000000000000000000000000000008152306004820152819073ffffffffffffffffffffffffffffffffffffffff8516906370a0823190602401602060405180830381865afa15801561176b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061178f919061247e565b611799919061239a565b9392505050565b60405173ffffffffffffffffffffffffffffffffffffffff80851660248301528316604482015260648101829052610ffa9085907f23b872dd00000000000000000000000000000000000000000000000000000000906084015b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152611b63565b80158061191c57506040517fdd62ed3e00000000000000000000000000000000000000000000000000000000815230600482015273ffffffffffffffffffffffffffffffffffffffff838116602483015284169063dd62ed3e90604401602060405180830381865afa1580156118f6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061191a919061247e565b155b6119a8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527f20746f206e6f6e2d7a65726f20616c6c6f77616e6365000000000000000000006064820152608401610509565b60405173ffffffffffffffffffffffffffffffffffffffff83166024820152604481018290526119fe9084907f095ea7b300000000000000000000000000000000000000000000000000000000906064016117fa565b505050565b6040805160008082526020820190925273ffffffffffffffffffffffffffffffffffffffff8416908390604051611a3a91906124bb565b60006040518083038185875af1925050503d8060008114611a77576040519150601f19603f3d011682016040523d82523d6000602084013e611a7c565b606091505b50509050806119fe576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f5472616e7366657248656c7065723a204554485f5452414e534645525f46414960448201527f4c454400000000000000000000000000000000000000000000000000000000006064820152608401610509565b60405173ffffffffffffffffffffffffffffffffffffffff83166024820152604481018290526119fe9084907fa9059cbb00000000000000000000000000000000000000000000000000000000906064016117fa565b6000611bc5826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff16611c6f9092919063ffffffff16565b8051909150156119fe5780806020019051810190611be391906124cd565b6119fe576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608401610509565b6060611c7e8484600085611c86565b949350505050565b606082471015611d18576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401610509565b6000808673ffffffffffffffffffffffffffffffffffffffff168587604051611d4191906124bb565b60006040518083038185875af1925050503d8060008114611d7e576040519150601f19603f3d011682016040523d82523d6000602084013e611d83565b606091505b5091509150611d9487838387611d9f565b979650505050505050565b60608315611e35578251600003611e2e5773ffffffffffffffffffffffffffffffffffffffff85163b611e2e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610509565b5081611c7e565b611c7e8383815115611e4a5781518083602001fd5b806040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161050991906124ea565b73ffffffffffffffffffffffffffffffffffffffff8116811461068057600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600082601f830112611ee057600080fd5b813567ffffffffffffffff80821115611efb57611efb611ea0565b604051601f83017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f01168101908282118183101715611f4157611f41611ea0565b81604052838152866020858801011115611f5a57600080fd5b836020870160208301376000602085830101528094505050505092915050565b60008060008060608587031215611f9057600080fd5b8435611f9b81611e7e565b9350602085013567ffffffffffffffff80821115611fb857600080fd5b818701915087601f830112611fcc57600080fd5b813581811115611fdb57600080fd5b8860208260061b8501011115611ff057600080fd5b60208301955080945050604087013591508082111561200e57600080fd5b5061201b87828801611ecf565b91505092959194509250565b6000806040838503121561203a57600080fd5b50508035926020909101359150565b602080825282518282018190526000919060409081850190868401855b828110156120ae578151805173ffffffffffffffffffffffffffffffffffffffff90811686528782015116878601528501518585015260609093019290850190600101612066565b5091979650505050505050565b6000602082840312156120cd57600080fd5b813561179981611e7e565b60008083601f8401126120ea57600080fd5b50813567ffffffffffffffff81111561210257600080fd5b6020830191508360208260051b850101111561211d57600080fd5b9250929050565b600080600080600080600060a0888a03121561213f57600080fd5b873561214a81611e7e565b9650602088013567ffffffffffffffff8082111561216757600080fd5b6121738b838c016120d8565b909850965060408a0135915061218882611e7e565b9094506060890135908082111561219e57600080fd5b6121aa8b838c016120d8565b909550935060808a01359150808211156121c357600080fd5b506121d08a828b01611ecf565b91505092959891949750929550565b600080604083850312156121f257600080fd5b82356121fd81611e7e565b9150602083013561220d81611e7e565b809150509250929050565b6000806020838503121561222b57600080fd5b823567ffffffffffffffff81111561224257600080fd5b61224e858286016120d8565b90969095509350505050565b60008060006060848603121561226f57600080fd5b833561227a81611e7e565b9250602084013567ffffffffffffffff8082111561229757600080fd5b90850190608082880312156122ab57600080fd5b909250604085013590808211156122c157600080fd5b506122ce86828701611ecf565b9150509250925092565b6000602082840312156122ea57600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b808201808211156113a4576113a4612320565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361239357612393612320565b5060010190565b818103818111156113a4576113a4612320565b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff818336030181126123e157600080fd5b9190910192915050565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe184360301811261242057600080fd5b83018035915067ffffffffffffffff82111561243b57600080fd5b6020019150600681901b360382131561211d57600080fd5b801515811461068057600080fd5b60006020828403121561247357600080fd5b813561179981612453565b60006020828403121561249057600080fd5b5051919050565b60005b838110156124b257818101518382015260200161249a565b50506000910152565b600082516123e1818460208701612497565b6000602082840312156124df57600080fd5b815161179981612453565b6020815260008251806020840152612509816040850160208701612497565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016919091016040019291505056fea2646970667358221220f508b1a2c41fe6f4d6b5ecc5632e0d04dc599d2fcd35dd9fb7e1454e8e5c0c5a64736f6c63430008110033"
    };
});
define("@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/Proxy.ts", ["require", "exports", "@ijstech/eth-contract", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/Proxy.json.ts"], function (require, exports, eth_contract_6, Proxy_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Proxy = void 0;
    class Proxy extends eth_contract_6.Contract {
        constructor(wallet, address) {
            super(wallet, address, Proxy_json_1.default.abi, Proxy_json_1.default.bytecode);
            this.assign();
        }
        deploy(options) {
            return this.__deploy([], options);
        }
        parseAddCommissionEvent(receipt) {
            return this.parseEvents(receipt, "AddCommission").map(e => this.decodeAddCommissionEvent(e));
        }
        decodeAddCommissionEvent(event) {
            let result = event.data;
            return {
                to: result.to,
                token: result.token,
                amount: new eth_contract_6.BigNumber(result.amount),
                _event: event
            };
        }
        parseClaimEvent(receipt) {
            return this.parseEvents(receipt, "Claim").map(e => this.decodeClaimEvent(e));
        }
        decodeClaimEvent(event) {
            let result = event.data;
            return {
                from: result.from,
                token: result.token,
                amount: new eth_contract_6.BigNumber(result.amount),
                _event: event
            };
        }
        parseSkimEvent(receipt) {
            return this.parseEvents(receipt, "Skim").map(e => this.decodeSkimEvent(e));
        }
        decodeSkimEvent(event) {
            let result = event.data;
            return {
                token: result.token,
                to: result.to,
                amount: new eth_contract_6.BigNumber(result.amount),
                _event: event
            };
        }
        parseTransferBackEvent(receipt) {
            return this.parseEvents(receipt, "TransferBack").map(e => this.decodeTransferBackEvent(e));
        }
        decodeTransferBackEvent(event) {
            let result = event.data;
            return {
                target: result.target,
                token: result.token,
                sender: result.sender,
                amount: new eth_contract_6.BigNumber(result.amount),
                _event: event
            };
        }
        parseTransferForwardEvent(receipt) {
            return this.parseEvents(receipt, "TransferForward").map(e => this.decodeTransferForwardEvent(e));
        }
        decodeTransferForwardEvent(event) {
            let result = event.data;
            return {
                target: result.target,
                token: result.token,
                sender: result.sender,
                amount: new eth_contract_6.BigNumber(result.amount),
                commissions: new eth_contract_6.BigNumber(result.commissions),
                _event: event
            };
        }
        assign() {
            let claimantIdCount_call = async (options) => {
                let result = await this.call('claimantIdCount', [], options);
                return new eth_contract_6.BigNumber(result);
            };
            this.claimantIdCount = claimantIdCount_call;
            let claimantIdsParams = (params) => [params.param1, params.param2];
            let claimantIds_call = async (params, options) => {
                let result = await this.call('claimantIds', claimantIdsParams(params), options);
                return new eth_contract_6.BigNumber(result);
            };
            this.claimantIds = claimantIds_call;
            let claimantsInfo_call = async (param1, options) => {
                let result = await this.call('claimantsInfo', [this.wallet.utils.toString(param1)], options);
                return {
                    claimant: result.claimant,
                    token: result.token,
                    balance: new eth_contract_6.BigNumber(result.balance)
                };
            };
            this.claimantsInfo = claimantsInfo_call;
            let getClaimantBalanceParams = (params) => [params.claimant, params.token];
            let getClaimantBalance_call = async (params, options) => {
                let result = await this.call('getClaimantBalance', getClaimantBalanceParams(params), options);
                return new eth_contract_6.BigNumber(result);
            };
            this.getClaimantBalance = getClaimantBalance_call;
            let getClaimantsInfoParams = (params) => [this.wallet.utils.toString(params.fromId), this.wallet.utils.toString(params.count)];
            let getClaimantsInfo_call = async (params, options) => {
                let result = await this.call('getClaimantsInfo', getClaimantsInfoParams(params), options);
                return (result.map(e => ({
                    claimant: e.claimant,
                    token: e.token,
                    balance: new eth_contract_6.BigNumber(e.balance)
                })));
            };
            this.getClaimantsInfo = getClaimantsInfo_call;
            let lastBalance_call = async (param1, options) => {
                let result = await this.call('lastBalance', [param1], options);
                return new eth_contract_6.BigNumber(result);
            };
            this.lastBalance = lastBalance_call;
            let claim_send = async (token, options) => {
                let result = await this.send('claim', [token], options);
                return result;
            };
            let claim_call = async (token, options) => {
                let result = await this.call('claim', [token], options);
                return;
            };
            let claim_txData = async (token, options) => {
                let result = await this.txData('claim', [token], options);
                return result;
            };
            this.claim = Object.assign(claim_send, {
                call: claim_call,
                txData: claim_txData
            });
            let claimMultiple_send = async (tokens, options) => {
                let result = await this.send('claimMultiple', [tokens], options);
                return result;
            };
            let claimMultiple_call = async (tokens, options) => {
                let result = await this.call('claimMultiple', [tokens], options);
                return;
            };
            let claimMultiple_txData = async (tokens, options) => {
                let result = await this.txData('claimMultiple', [tokens], options);
                return result;
            };
            this.claimMultiple = Object.assign(claimMultiple_send, {
                call: claimMultiple_call,
                txData: claimMultiple_txData
            });
            let ethInParams = (params) => [params.target, params.commissions.map(e => ([e.to, this.wallet.utils.toString(e.amount)])), this.wallet.utils.stringToBytes(params.data)];
            let ethIn_send = async (params, options) => {
                let result = await this.send('ethIn', ethInParams(params), options);
                return result;
            };
            let ethIn_call = async (params, options) => {
                let result = await this.call('ethIn', ethInParams(params), options);
                return;
            };
            let ethIn_txData = async (params, options) => {
                let result = await this.txData('ethIn', ethInParams(params), options);
                return result;
            };
            this.ethIn = Object.assign(ethIn_send, {
                call: ethIn_call,
                txData: ethIn_txData
            });
            let proxyCallParams = (params) => [params.target, params.tokensIn.map(e => ([e.token, this.wallet.utils.toString(e.amount), e.directTransfer, e.commissions.map(e => ([e.to, this.wallet.utils.toString(e.amount)]))])), params.to, params.tokensOut, this.wallet.utils.stringToBytes(params.data)];
            let proxyCall_send = async (params, options) => {
                let result = await this.send('proxyCall', proxyCallParams(params), options);
                return result;
            };
            let proxyCall_call = async (params, options) => {
                let result = await this.call('proxyCall', proxyCallParams(params), options);
                return;
            };
            let proxyCall_txData = async (params, options) => {
                let result = await this.txData('proxyCall', proxyCallParams(params), options);
                return result;
            };
            this.proxyCall = Object.assign(proxyCall_send, {
                call: proxyCall_call,
                txData: proxyCall_txData
            });
            let skim_send = async (tokens, options) => {
                let result = await this.send('skim', [tokens], options);
                return result;
            };
            let skim_call = async (tokens, options) => {
                let result = await this.call('skim', [tokens], options);
                return;
            };
            let skim_txData = async (tokens, options) => {
                let result = await this.txData('skim', [tokens], options);
                return result;
            };
            this.skim = Object.assign(skim_send, {
                call: skim_call,
                txData: skim_txData
            });
            let tokenInParams = (params) => [params.target, [params.tokensIn.token, this.wallet.utils.toString(params.tokensIn.amount), params.tokensIn.directTransfer, params.tokensIn.commissions.map(e => ([e.to, this.wallet.utils.toString(e.amount)]))], this.wallet.utils.stringToBytes(params.data)];
            let tokenIn_send = async (params, options) => {
                let result = await this.send('tokenIn', tokenInParams(params), options);
                return result;
            };
            let tokenIn_call = async (params, options) => {
                let result = await this.call('tokenIn', tokenInParams(params), options);
                return;
            };
            let tokenIn_txData = async (params, options) => {
                let result = await this.txData('tokenIn', tokenInParams(params), options);
                return result;
            };
            this.tokenIn = Object.assign(tokenIn_send, {
                call: tokenIn_call,
                txData: tokenIn_txData
            });
        }
    }
    exports.Proxy = Proxy;
    Proxy._abi = Proxy_json_1.default.abi;
});
define("@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/ProxyV2.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/ProxyV2.json.ts'/> 
    exports.default = {
        "abi": [
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "AddCommission", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Claim", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Skim", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "target", "type": "address" }, { "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TransferBack", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "target", "type": "address" }, { "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "commissions", "type": "uint256" }], "name": "TransferForward", "type": "event" },
            { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "contract IERC20[]", "name": "tokens", "type": "address[]" }], "name": "claimMultiple", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [], "name": "claimantIdCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "contract IERC20", "name": "", "type": "address" }], "name": "claimantIds", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "claimantsInfo", "outputs": [{ "internalType": "address", "name": "claimant", "type": "address" }, { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }, { "components": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "internalType": "struct ProxyV2.Commission[]", "name": "commissions", "type": "tuple[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "ethIn", "outputs": [], "stateMutability": "payable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "claimant", "type": "address" }, { "internalType": "contract IERC20", "name": "token", "type": "address" }], "name": "getClaimantBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "fromId", "type": "uint256" }, { "internalType": "uint256", "name": "count", "type": "uint256" }], "name": "getClaimantsInfo", "outputs": [{ "components": [{ "internalType": "address", "name": "claimant", "type": "address" }, { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }], "internalType": "struct ProxyV2.ClaimantInfo[]", "name": "claimantInfoList", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "name": "lastBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }, { "components": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bool", "name": "directTransfer", "type": "bool" }, { "components": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "internalType": "struct ProxyV2.Commission[]", "name": "commissions", "type": "tuple[]" }, { "internalType": "uint256", "name": "totalCommissions", "type": "uint256" }], "internalType": "struct ProxyV2.TokensIn[]", "name": "tokensIn", "type": "tuple[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "contract IERC20[]", "name": "tokensOut", "type": "address[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "proxyCall", "outputs": [], "stateMutability": "payable", "type": "function" },
            { "inputs": [{ "internalType": "contract IERC20[]", "name": "tokens", "type": "address[]" }], "name": "skim", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }, { "components": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bool", "name": "directTransfer", "type": "bool" }, { "components": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "internalType": "struct ProxyV2.Commission[]", "name": "commissions", "type": "tuple[]" }, { "internalType": "uint256", "name": "totalCommissions", "type": "uint256" }], "internalType": "struct ProxyV2.TokensIn", "name": "tokensIn", "type": "tuple" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "tokenIn", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "stateMutability": "payable", "type": "receive" }
        ],
        "bytecode": "608060405234801561001057600080fd5b506125ab806100206000396000f3fe6080604052600436106100cb5760003560e01c8063b60c164c11610074578063ee42d3a31161004e578063ee42d3a31461027c578063f303ad6e146102a9578063fddaea46146102c957600080fd5b8063b60c164c146101b1578063d2ef8464146101d1578063d3b7d4c31461025c57600080fd5b80637c93df2b116100a55780637c93df2b1461014257806383e40a5114610155578063b316d7141461019b57600080fd5b806301417e7b146100d7578063188ff72b146100ec5780631e83409a1461012257600080fd5b366100d257005b600080fd5b6100ea6100e5366004611fb4565b6102e9565b005b3480156100f857600080fd5b5061010c610107366004612061565b610493565b6040516101199190612083565b60405180910390f35b34801561012e57600080fd5b506100ea61013d3660046120f5565b610677565b6100ea61015036600461215e565b610683565b34801561016157600080fd5b5061018d610170366004612219565b600360209081526000928352604080842090915290825290205481565b604051908152602001610119565b3480156101a757600080fd5b5061018d60005481565b3480156101bd57600080fd5b506100ea6101cc366004612252565b610e3d565b3480156101dd57600080fd5b506102296101ec366004612294565b600260208190526000918252604090912080546001820154919092015473ffffffffffffffffffffffffffffffffffffffff928316929091169083565b6040805173ffffffffffffffffffffffffffffffffffffffff948516815293909216602084015290820152606001610119565b34801561026857600080fd5b5061018d610277366004612219565b611025565b34801561028857600080fd5b5061018d6102973660046120f5565b60016020526000908152604090205481565b3480156102b557600080fd5b506100ea6102c4366004612252565b61106e565b3480156102d557600080fd5b506100ea6102e43660046122ad565b6110bb565b600082815b818110156103bb57368686838181106103095761030961232b565b90506040020190508060200135846103219190612389565b935061033f61033360208301836120f5565b60008360200135611431565b7fe3576de866d95e30a6b102b256dc468ead824ef133838792dc1813c3786414ef61036d60208301836120f5565b6040805173ffffffffffffffffffffffffffffffffffffffff909216825260006020838101919091528401359082015260600160405180910390a150806103b38161239c565b9150506102ee565b5060006103c883346123d4565b600080805260016020527fa6eef7e35abe7026729641147f7915573c7e97b47efa546f5f6e3230263bcb4980549293508592909190610408908490612389565b9091555050604080513381526020810183905290810184905260009073ffffffffffffffffffffffffffffffffffffffff8916907f0e25509c2c6fc37a8844100a9a4c5b2b038bd5daaf09d216161eb8574ad4878b9060600160405180910390a3600080855186602001848b5af180600003610488573d6000803e3d6000fd5b503d6000803e3d6000f35b60606000831180156104a757506000548311155b610512576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600d60248201527f6f7574206f6620626f756e64730000000000000000000000000000000000000060448201526064015b60405180910390fd5b600060016105208486612389565b61052a91906123d4565b9050600054811115610552575060005461054484826123d4565b61054f906001612389565b92505b8267ffffffffffffffff81111561056b5761056b611eda565b6040519080825280602002602001820160405280156105d457816020015b60408051606081018252600080825260208083018290529282015282527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9092019101816105895790505b5091508360005b8481101561066e576000828152600260208181526040928390208351606081018552815473ffffffffffffffffffffffffffffffffffffffff908116825260018301541692810192909252909101549181019190915284518590839081106106455761064561232b565b60200260200101819052508161065a9061239c565b9150806106668161239c565b9150506105db565b50505092915050565b61068081611556565b50565b846000805b82811015610b8057368989838181106106a3576106a361232b565b90506020028101906106b591906123e7565b90506000806106c76060840184612425565b9050905060005b818110156107c057366106e46060860186612425565b838181106106f4576106f461232b565b905060400201905080602001358461070c9190612389565b935061073561071e60208301836120f5565b61072b60208801886120f5565b8360200135611431565b7fe3576de866d95e30a6b102b256dc468ead824ef133838792dc1813c3786414ef61076360208301836120f5565b61077060208801886120f5565b6040805173ffffffffffffffffffffffffffffffffffffffff9384168152929091166020838101919091528401359082015260600160405180910390a150806107b88161239c565b9150506106ce565b5060009050816001826107d660208701876120f5565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461081f9190612389565b909155506000905061083460208501856120f5565b73ffffffffffffffffffffffffffffffffffffffff160361093c5784156108b7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601a60248201527f6d6f7265207468616e206f6e6520455448207472616e736665720000000000006044820152606401610509565b82602001353414610924576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f45544820616d6f756e74206e6f74206d617463686564000000000000000000006044820152606401610509565b6109328260208501356123d4565b9050809450610b00565b61094c606084016040850161249b565b15610a2457600061096d61096360208601866120f5565b8560800135611684565b9050828110156109d9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f636f6d6d697373696f6e20616d6f756e74206e6f74206d6174636865640000006044820152606401610509565b6109eb608085013560208601356123d4565b9150610a1e338f84610a0060208901896120f5565b73ffffffffffffffffffffffffffffffffffffffff169291906117da565b50610b00565b6000610a40610a3660208601866120f5565b8560200135611684565b90508360200135811015610ab0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f616d6f756e74206e6f74206d61746368656400000000000000000000000000006044820152606401610509565b610aba83826123d4565b9150610aec8e6000610acf60208801886120f5565b73ffffffffffffffffffffffffffffffffffffffff1691906118b6565b610afe8e83610acf60208801886120f5565b505b610b0d60208401846120f5565b604080513381526020810184905290810184905273ffffffffffffffffffffffffffffffffffffffff918216918f16907f0e25509c2c6fc37a8844100a9a4c5b2b038bd5daaf09d216161eb8574ad4878b9060600160405180910390a35050508080610b789061239c565b915050610688565b50600080845185602001848d5af180600003610ba0573d6000803e3d6000fd5b5083915060005b8281101561048857600080878784818110610bc457610bc461232b565b9050602002016020810190610bd991906120f5565b73ffffffffffffffffffffffffffffffffffffffff1603610c3a576000805260016020527fa6eef7e35abe7026729641147f7915573c7e97b47efa546f5f6e3230263bcb4954610c2990476123d4565b9050610c358882611a3d565b610dac565b60016000888885818110610c5057610c5061232b565b9050602002016020810190610c6591906120f5565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054878784818110610cb257610cb261232b565b9050602002016020810190610cc791906120f5565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015273ffffffffffffffffffffffffffffffffffffffff91909116906370a0823190602401602060405180830381865afa158015610d33573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d5791906124b8565b610d6191906123d4565b9050610dac8882898986818110610d7a57610d7a61232b565b9050602002016020810190610d8f91906120f5565b73ffffffffffffffffffffffffffffffffffffffff169190611b47565b868683818110610dbe57610dbe61232b565b9050602002016020810190610dd391906120f5565b6040805173ffffffffffffffffffffffffffffffffffffffff8b8116825260208201859052928316928e16917fc2534859c9972270c16d5b4255d200f9a0385f9a6ce3add96c0427ff9fc70f93910160405180910390a35080610e358161239c565b915050610ba7565b8060005b8181101561101f57600080858584818110610e5e57610e5e61232b565b9050602002016020810190610e7391906120f5565b905073ffffffffffffffffffffffffffffffffffffffff8116610ed9576000805260016020527fa6eef7e35abe7026729641147f7915573c7e97b47efa546f5f6e3230263bcb4954479250610ec890836123d4565b9150610ed43383611a3d565b610fbd565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015273ffffffffffffffffffffffffffffffffffffffff8216906370a0823190602401602060405180830381865afa158015610f43573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f6791906124b8565b73ffffffffffffffffffffffffffffffffffffffff8216600090815260016020526040902054909250610f9a90836123d4565b9150610fbd73ffffffffffffffffffffffffffffffffffffffff82163384611b47565b604051828152339073ffffffffffffffffffffffffffffffffffffffff8316907f2ae72b44f59d038340fca5739135a1d51fc5ab720bb02d983e4c5ff4119ca7b89060200160405180910390a3505080806110179061239c565b915050610e41565b50505050565b73ffffffffffffffffffffffffffffffffffffffff8083166000908152600360209081526040808320938516835292815282822054825260029081905291902001545b92915050565b8060005b8181101561101f576110a984848381811061108f5761108f61232b565b90506020020160208101906110a491906120f5565b611556565b806110b38161239c565b915050611072565b816000806110cc6060840184612425565b9050905060005b818110156111bb57366110e96060860186612425565b838181106110f9576110f961232b565b90506040020190508060200135846111119190612389565b935061113061112360208301836120f5565b61072b60208a018a6120f5565b7fe3576de866d95e30a6b102b256dc468ead824ef133838792dc1813c3786414ef61115e60208301836120f5565b61116b60208a018a6120f5565b6040805173ffffffffffffffffffffffffffffffffffffffff9384168152929091166020838101919091528401359082015260600160405180910390a150806111b38161239c565b9150506110d3565b506000826001826111cf60208801886120f5565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546112189190612389565b9091555061122e9050606085016040860161249b565b156112e857600061124f61124560208701876120f5565b8660800135611684565b9050838110156112bb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f636f6d6d697373696f6e20616d6f756e74206e6f74206d6174636865640000006044820152606401610509565b6112cd608086013560208701356123d4565b91506112e2338984610a0060208a018a6120f5565b506113a7565b60006113046112fa60208701876120f5565b8660200135611684565b90508460200135811015611374576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f616d6f756e74206e6f74206d61746368656400000000000000000000000000006044820152606401610509565b61137e84826123d4565b9150611393886000610acf60208901896120f5565b6113a58883610acf60208901896120f5565b505b6113b460208501856120f5565b604080513381526020810184905290810185905273ffffffffffffffffffffffffffffffffffffffff918216918916907f0e25509c2c6fc37a8844100a9a4c5b2b038bd5daaf09d216161eb8574ad4878b9060600160405180910390a360008086518760200160008b5af180600003610488573d6000803e3d6000fd5b73ffffffffffffffffffffffffffffffffffffffff80841660009081526003602090815260408083209386168352929052908120549081900361152a57600080815461147c9061239c565b909155506040805160608101825273ffffffffffffffffffffffffffffffffffffffff80871680835286821660208085018281528587018981526000805481526002808552898220985189549089167fffffffffffffffffffffffff0000000000000000000000000000000000000000918216178a55935160018a0180549190991694169390931790965551950194909455825491835260038452848320908352909252919091205561101f565b6000818152600260208190526040822001805484929061154b908490612389565b909155505050505050565b33600090815260036020908152604080832073ffffffffffffffffffffffffffffffffffffffff858116808652918452828520548086526002808652848720855160608101875281548516815260018083015490951681890152910180548287018190529088905593875291909452918420805493949293919283926115dd9084906123d4565b909155505073ffffffffffffffffffffffffffffffffffffffff841661160c576116073382611a3d565b61162d565b61162d73ffffffffffffffffffffffffffffffffffffffff85163383611b47565b6040805173ffffffffffffffffffffffffffffffffffffffff861681526020810183905233917f70eb43c4a8ae8c40502dcf22436c509c28d6ff421cf07c491be56984bd987068910160405180910390a250505050565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015260009073ffffffffffffffffffffffffffffffffffffffff8416906370a0823190602401602060405180830381865afa1580156116f1573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061171591906124b8565b905061173973ffffffffffffffffffffffffffffffffffffffff84163330856117da565b6040517f70a08231000000000000000000000000000000000000000000000000000000008152306004820152819073ffffffffffffffffffffffffffffffffffffffff8516906370a0823190602401602060405180830381865afa1580156117a5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117c991906124b8565b6117d391906123d4565b9392505050565b60405173ffffffffffffffffffffffffffffffffffffffff8085166024830152831660448201526064810182905261101f9085907f23b872dd00000000000000000000000000000000000000000000000000000000906084015b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152611b9d565b80158061195657506040517fdd62ed3e00000000000000000000000000000000000000000000000000000000815230600482015273ffffffffffffffffffffffffffffffffffffffff838116602483015284169063dd62ed3e90604401602060405180830381865afa158015611930573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061195491906124b8565b155b6119e2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527f20746f206e6f6e2d7a65726f20616c6c6f77616e6365000000000000000000006064820152608401610509565b60405173ffffffffffffffffffffffffffffffffffffffff8316602482015260448101829052611a389084907f095ea7b30000000000000000000000000000000000000000000000000000000090606401611834565b505050565b6040805160008082526020820190925273ffffffffffffffffffffffffffffffffffffffff8416908390604051611a7491906124f5565b60006040518083038185875af1925050503d8060008114611ab1576040519150601f19603f3d011682016040523d82523d6000602084013e611ab6565b606091505b5050905080611a38576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f5472616e7366657248656c7065723a204554485f5452414e534645525f46414960448201527f4c454400000000000000000000000000000000000000000000000000000000006064820152608401610509565b60405173ffffffffffffffffffffffffffffffffffffffff8316602482015260448101829052611a389084907fa9059cbb0000000000000000000000000000000000000000000000000000000090606401611834565b6000611bff826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff16611ca99092919063ffffffff16565b805190915015611a385780806020019051810190611c1d9190612507565b611a38576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608401610509565b6060611cb88484600085611cc0565b949350505050565b606082471015611d52576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401610509565b6000808673ffffffffffffffffffffffffffffffffffffffff168587604051611d7b91906124f5565b60006040518083038185875af1925050503d8060008114611db8576040519150601f19603f3d011682016040523d82523d6000602084013e611dbd565b606091505b5091509150611dce87838387611dd9565b979650505050505050565b60608315611e6f578251600003611e685773ffffffffffffffffffffffffffffffffffffffff85163b611e68576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610509565b5081611cb8565b611cb88383815115611e845781518083602001fd5b806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105099190612524565b73ffffffffffffffffffffffffffffffffffffffff8116811461068057600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600082601f830112611f1a57600080fd5b813567ffffffffffffffff80821115611f3557611f35611eda565b604051601f83017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f01168101908282118183101715611f7b57611f7b611eda565b81604052838152866020858801011115611f9457600080fd5b836020870160208301376000602085830101528094505050505092915050565b60008060008060608587031215611fca57600080fd5b8435611fd581611eb8565b9350602085013567ffffffffffffffff80821115611ff257600080fd5b818701915087601f83011261200657600080fd5b81358181111561201557600080fd5b8860208260061b850101111561202a57600080fd5b60208301955080945050604087013591508082111561204857600080fd5b5061205587828801611f09565b91505092959194509250565b6000806040838503121561207457600080fd5b50508035926020909101359150565b602080825282518282018190526000919060409081850190868401855b828110156120e8578151805173ffffffffffffffffffffffffffffffffffffffff908116865287820151168786015285015185850152606090930192908501906001016120a0565b5091979650505050505050565b60006020828403121561210757600080fd5b81356117d381611eb8565b60008083601f84011261212457600080fd5b50813567ffffffffffffffff81111561213c57600080fd5b6020830191508360208260051b850101111561215757600080fd5b9250929050565b600080600080600080600060a0888a03121561217957600080fd5b873561218481611eb8565b9650602088013567ffffffffffffffff808211156121a157600080fd5b6121ad8b838c01612112565b909850965060408a013591506121c282611eb8565b909450606089013590808211156121d857600080fd5b6121e48b838c01612112565b909550935060808a01359150808211156121fd57600080fd5b5061220a8a828b01611f09565b91505092959891949750929550565b6000806040838503121561222c57600080fd5b823561223781611eb8565b9150602083013561224781611eb8565b809150509250929050565b6000806020838503121561226557600080fd5b823567ffffffffffffffff81111561227c57600080fd5b61228885828601612112565b90969095509350505050565b6000602082840312156122a657600080fd5b5035919050565b6000806000606084860312156122c257600080fd5b83356122cd81611eb8565b9250602084013567ffffffffffffffff808211156122ea57600080fd5b9085019060a082880312156122fe57600080fd5b9092506040850135908082111561231457600080fd5b5061232186828701611f09565b9150509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b808201808211156110685761106861235a565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036123cd576123cd61235a565b5060010190565b818103818111156110685761106861235a565b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6183360301811261241b57600080fd5b9190910192915050565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe184360301811261245a57600080fd5b83018035915067ffffffffffffffff82111561247557600080fd5b6020019150600681901b360382131561215757600080fd5b801515811461068057600080fd5b6000602082840312156124ad57600080fd5b81356117d38161248d565b6000602082840312156124ca57600080fd5b5051919050565b60005b838110156124ec5781810151838201526020016124d4565b50506000910152565b6000825161241b8184602087016124d1565b60006020828403121561251957600080fd5b81516117d38161248d565b60208152600082518060208401526125438160408501602087016124d1565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016919091016040019291505056fea26469706673582212209cca70a9576e9493198c65a6086f463ebf4f83feb8872306feb8c98fcff97b4b64736f6c63430008110033"
    };
});
define("@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/ProxyV2.ts", ["require", "exports", "@ijstech/eth-contract", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/ProxyV2.json.ts"], function (require, exports, eth_contract_7, ProxyV2_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProxyV2 = void 0;
    class ProxyV2 extends eth_contract_7.Contract {
        constructor(wallet, address) {
            super(wallet, address, ProxyV2_json_1.default.abi, ProxyV2_json_1.default.bytecode);
            this.assign();
        }
        deploy(options) {
            return this.__deploy([], options);
        }
        parseAddCommissionEvent(receipt) {
            return this.parseEvents(receipt, "AddCommission").map(e => this.decodeAddCommissionEvent(e));
        }
        decodeAddCommissionEvent(event) {
            let result = event.data;
            return {
                to: result.to,
                token: result.token,
                amount: new eth_contract_7.BigNumber(result.amount),
                _event: event
            };
        }
        parseClaimEvent(receipt) {
            return this.parseEvents(receipt, "Claim").map(e => this.decodeClaimEvent(e));
        }
        decodeClaimEvent(event) {
            let result = event.data;
            return {
                from: result.from,
                token: result.token,
                amount: new eth_contract_7.BigNumber(result.amount),
                _event: event
            };
        }
        parseSkimEvent(receipt) {
            return this.parseEvents(receipt, "Skim").map(e => this.decodeSkimEvent(e));
        }
        decodeSkimEvent(event) {
            let result = event.data;
            return {
                token: result.token,
                to: result.to,
                amount: new eth_contract_7.BigNumber(result.amount),
                _event: event
            };
        }
        parseTransferBackEvent(receipt) {
            return this.parseEvents(receipt, "TransferBack").map(e => this.decodeTransferBackEvent(e));
        }
        decodeTransferBackEvent(event) {
            let result = event.data;
            return {
                target: result.target,
                token: result.token,
                sender: result.sender,
                amount: new eth_contract_7.BigNumber(result.amount),
                _event: event
            };
        }
        parseTransferForwardEvent(receipt) {
            return this.parseEvents(receipt, "TransferForward").map(e => this.decodeTransferForwardEvent(e));
        }
        decodeTransferForwardEvent(event) {
            let result = event.data;
            return {
                target: result.target,
                token: result.token,
                sender: result.sender,
                amount: new eth_contract_7.BigNumber(result.amount),
                commissions: new eth_contract_7.BigNumber(result.commissions),
                _event: event
            };
        }
        assign() {
            let claimantIdCount_call = async (options) => {
                let result = await this.call('claimantIdCount', [], options);
                return new eth_contract_7.BigNumber(result);
            };
            this.claimantIdCount = claimantIdCount_call;
            let claimantIdsParams = (params) => [params.param1, params.param2];
            let claimantIds_call = async (params, options) => {
                let result = await this.call('claimantIds', claimantIdsParams(params), options);
                return new eth_contract_7.BigNumber(result);
            };
            this.claimantIds = claimantIds_call;
            let claimantsInfo_call = async (param1, options) => {
                let result = await this.call('claimantsInfo', [this.wallet.utils.toString(param1)], options);
                return {
                    claimant: result.claimant,
                    token: result.token,
                    balance: new eth_contract_7.BigNumber(result.balance)
                };
            };
            this.claimantsInfo = claimantsInfo_call;
            let getClaimantBalanceParams = (params) => [params.claimant, params.token];
            let getClaimantBalance_call = async (params, options) => {
                let result = await this.call('getClaimantBalance', getClaimantBalanceParams(params), options);
                return new eth_contract_7.BigNumber(result);
            };
            this.getClaimantBalance = getClaimantBalance_call;
            let getClaimantsInfoParams = (params) => [this.wallet.utils.toString(params.fromId), this.wallet.utils.toString(params.count)];
            let getClaimantsInfo_call = async (params, options) => {
                let result = await this.call('getClaimantsInfo', getClaimantsInfoParams(params), options);
                return (result.map(e => ({
                    claimant: e.claimant,
                    token: e.token,
                    balance: new eth_contract_7.BigNumber(e.balance)
                })));
            };
            this.getClaimantsInfo = getClaimantsInfo_call;
            let lastBalance_call = async (param1, options) => {
                let result = await this.call('lastBalance', [param1], options);
                return new eth_contract_7.BigNumber(result);
            };
            this.lastBalance = lastBalance_call;
            let claim_send = async (token, options) => {
                let result = await this.send('claim', [token], options);
                return result;
            };
            let claim_call = async (token, options) => {
                let result = await this.call('claim', [token], options);
                return;
            };
            let claim_txData = async (token, options) => {
                let result = await this.txData('claim', [token], options);
                return result;
            };
            this.claim = Object.assign(claim_send, {
                call: claim_call,
                txData: claim_txData
            });
            let claimMultiple_send = async (tokens, options) => {
                let result = await this.send('claimMultiple', [tokens], options);
                return result;
            };
            let claimMultiple_call = async (tokens, options) => {
                let result = await this.call('claimMultiple', [tokens], options);
                return;
            };
            let claimMultiple_txData = async (tokens, options) => {
                let result = await this.txData('claimMultiple', [tokens], options);
                return result;
            };
            this.claimMultiple = Object.assign(claimMultiple_send, {
                call: claimMultiple_call,
                txData: claimMultiple_txData
            });
            let ethInParams = (params) => [params.target, params.commissions.map(e => ([e.to, this.wallet.utils.toString(e.amount)])), this.wallet.utils.stringToBytes(params.data)];
            let ethIn_send = async (params, options) => {
                let result = await this.send('ethIn', ethInParams(params), options);
                return result;
            };
            let ethIn_call = async (params, options) => {
                let result = await this.call('ethIn', ethInParams(params), options);
                return;
            };
            let ethIn_txData = async (params, options) => {
                let result = await this.txData('ethIn', ethInParams(params), options);
                return result;
            };
            this.ethIn = Object.assign(ethIn_send, {
                call: ethIn_call,
                txData: ethIn_txData
            });
            let proxyCallParams = (params) => [params.target, params.tokensIn.map(e => ([e.token, this.wallet.utils.toString(e.amount), e.directTransfer, e.commissions.map(e => ([e.to, this.wallet.utils.toString(e.amount)])), this.wallet.utils.toString(e.totalCommissions)])), params.to, params.tokensOut, this.wallet.utils.stringToBytes(params.data)];
            let proxyCall_send = async (params, options) => {
                let result = await this.send('proxyCall', proxyCallParams(params), options);
                return result;
            };
            let proxyCall_call = async (params, options) => {
                let result = await this.call('proxyCall', proxyCallParams(params), options);
                return;
            };
            let proxyCall_txData = async (params, options) => {
                let result = await this.txData('proxyCall', proxyCallParams(params), options);
                return result;
            };
            this.proxyCall = Object.assign(proxyCall_send, {
                call: proxyCall_call,
                txData: proxyCall_txData
            });
            let skim_send = async (tokens, options) => {
                let result = await this.send('skim', [tokens], options);
                return result;
            };
            let skim_call = async (tokens, options) => {
                let result = await this.call('skim', [tokens], options);
                return;
            };
            let skim_txData = async (tokens, options) => {
                let result = await this.txData('skim', [tokens], options);
                return result;
            };
            this.skim = Object.assign(skim_send, {
                call: skim_call,
                txData: skim_txData
            });
            let tokenInParams = (params) => [params.target, [params.tokensIn.token, this.wallet.utils.toString(params.tokensIn.amount), params.tokensIn.directTransfer, params.tokensIn.commissions.map(e => ([e.to, this.wallet.utils.toString(e.amount)])), this.wallet.utils.toString(params.tokensIn.totalCommissions)], this.wallet.utils.stringToBytes(params.data)];
            let tokenIn_send = async (params, options) => {
                let result = await this.send('tokenIn', tokenInParams(params), options);
                return result;
            };
            let tokenIn_call = async (params, options) => {
                let result = await this.call('tokenIn', tokenInParams(params), options);
                return;
            };
            let tokenIn_txData = async (params, options) => {
                let result = await this.txData('tokenIn', tokenInParams(params), options);
                return result;
            };
            this.tokenIn = Object.assign(tokenIn_send, {
                call: tokenIn_call,
                txData: tokenIn_txData
            });
        }
    }
    exports.ProxyV2 = ProxyV2;
    ProxyV2._abi = ProxyV2_json_1.default.abi;
});
define("@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/index.ts", ["require", "exports", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/Proxy.ts", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/ProxyV2.ts"], function (require, exports, Proxy_1, ProxyV2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProxyV2 = exports.Proxy = void 0;
    Object.defineProperty(exports, "Proxy", { enumerable: true, get: function () { return Proxy_1.Proxy; } });
    Object.defineProperty(exports, "ProxyV2", { enumerable: true, get: function () { return ProxyV2_1.ProxyV2; } });
});
define("@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/index.ts", ["require", "exports", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/index.ts"], function (require, exports, Contracts) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onProgress = exports.deploy = exports.DefaultDeployOptions = exports.Contracts = void 0;
    exports.Contracts = Contracts;
    ;
    ;
    var progressHandler;
    exports.DefaultDeployOptions = {
        version: 'V1'
    };
    function progress(msg) {
        if (typeof (progressHandler) == 'function') {
            progressHandler(msg);
        }
        ;
    }
    async function deploy(wallet, options) {
        progress('Contracts deployment start');
        let proxy;
        if (options.version == 'V2') {
            proxy = new Contracts.ProxyV2(wallet);
        }
        else {
            proxy = new Contracts.Proxy(wallet);
        }
        progress('Deploy Proxy');
        await proxy.deploy();
        progress('Proxy deployed ' + proxy.address);
        progress('Contracts deployment finished');
        return {
            proxy: proxy.address
        };
    }
    exports.deploy = deploy;
    ;
    function onProgress(handler) {
        progressHandler = handler;
    }
    exports.onProgress = onProgress;
    ;
    exports.default = {
        Contracts,
        deploy,
        DefaultDeployOptions: exports.DefaultDeployOptions,
        onProgress
    };
});
define("@scom/scom-nft-minter/API.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-nft-minter/interface/index.tsx", "@scom/scom-nft-minter/contracts/scom-product-contract/index.ts", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/index.ts", "@scom/scom-nft-minter/store/index.ts", "@scom/scom-nft-minter/utils/index.ts"], function (require, exports, eth_wallet_9, index_9, index_10, index_11, index_12, index_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.donate = exports.buyProduct = exports.getProxyTokenAmountIn = exports.newProduct = exports.getNFTBalance = exports.getProductInfo = void 0;
    async function getProductInfo(productId) {
        let productInfoAddress = index_12.getContractAddress('ProductInfo');
        const wallet = eth_wallet_9.Wallet.getInstance();
        const productInfo = new index_10.Contracts.ProductInfo(wallet, productInfoAddress);
        const product = await productInfo.products(productId);
        return product;
    }
    exports.getProductInfo = getProductInfo;
    async function getNFTBalance(productId) {
        let productInfoAddress = index_12.getContractAddress('ProductInfo');
        const wallet = eth_wallet_9.Wallet.getInstance();
        const productInfo = new index_10.Contracts.ProductInfo(wallet, productInfoAddress);
        const nftAddress = await productInfo.nft();
        const product1155 = new index_10.Contracts.Product1155(wallet, nftAddress);
        const nftBalance = await product1155.balanceOf({
            account: wallet.address,
            id: productId
        });
        return nftBalance;
    }
    exports.getNFTBalance = getNFTBalance;
    async function newProduct(productType, qty, maxQty, price, maxPrice, token, callback, confirmationCallback) {
        let productInfoAddress = index_12.getContractAddress('ProductInfo');
        const wallet = eth_wallet_9.Wallet.getInstance();
        const productInfo = new index_10.Contracts.ProductInfo(wallet, productInfoAddress);
        index_13.registerSendTxEvents({
            transactionHash: callback,
            confirmation: confirmationCallback
        });
        const tokenDecimals = (token === null || token === void 0 ? void 0 : token.decimals) || 18;
        let productTypeCode;
        switch (productType) {
            case index_9.ProductType.Buy:
                productTypeCode = 0;
                break;
            case index_9.ProductType.DonateToOwner:
                productTypeCode = 1;
                break;
            case index_9.ProductType.DonateToEveryone:
                productTypeCode = 2;
                break;
        }
        let receipt = await productInfo.newProduct({
            productType: productTypeCode,
            uri: '',
            quantity: qty,
            maxQuantity: maxQty,
            maxPrice: eth_wallet_9.Utils.toDecimals(maxPrice, tokenDecimals),
            price: eth_wallet_9.Utils.toDecimals(price, tokenDecimals),
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
        const amount = new eth_wallet_9.BigNumber(productPrice).isZero() ? new eth_wallet_9.BigNumber(quantity) : new eth_wallet_9.BigNumber(productPrice).times(quantity);
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
        let proxyAddress = index_12.getContractAddress('Proxy');
        let productInfoAddress = index_12.getContractAddress('ProductInfo');
        const wallet = eth_wallet_9.Wallet.getInstance();
        const proxy = new index_11.Contracts.Proxy(wallet, proxyAddress);
        const productInfo = new index_10.Contracts.ProductInfo(wallet, productInfoAddress);
        const product = await productInfo.products(productId);
        const amount = product.price.times(quantity);
        const _commissions = (commissions || []).map(v => {
            return {
                to: v.walletAddress,
                amount: amount.times(v.share)
            };
        });
        const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)) : new eth_wallet_9.BigNumber(0);
        let receipt;
        try {
            if (token === null || token === void 0 ? void 0 : token.address) {
                index_13.registerSendTxEvents({
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
                index_13.registerSendTxEvents({
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
    async function donate(productId, donateTo, amountIn, commissions, token, callback, confirmationCallback) {
        let proxyAddress = index_12.getContractAddress('Proxy');
        let productInfoAddress = index_12.getContractAddress('ProductInfo');
        const wallet = eth_wallet_9.Wallet.getInstance();
        const proxy = new index_11.Contracts.Proxy(wallet, proxyAddress);
        const productInfo = new index_10.Contracts.ProductInfo(wallet, productInfoAddress);
        const tokenDecimals = (token === null || token === void 0 ? void 0 : token.decimals) || 18;
        const amount = eth_wallet_9.Utils.toDecimals(amountIn, tokenDecimals);
        const _commissions = (commissions || []).map(v => {
            return {
                to: v.walletAddress,
                amount: amount.times(v.share)
            };
        });
        const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)) : new eth_wallet_9.BigNumber(0);
        let receipt;
        try {
            if (token === null || token === void 0 ? void 0 : token.address) {
                index_13.registerSendTxEvents({
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
                index_13.registerSendTxEvents({
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
});
define("@scom/scom-nft-minter/scconfig.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/scconfig.json.ts'/> 
    exports.default = {
        "env": "testnet",
        "logo": "logo",
        "main": "@pageblock-nft-minter/main",
        "assets": "@pageblock-nft-minter/assets",
        "moduleDir": "modules",
        "modules": {
            "@pageblock-nft-minter/assets": {
                "path": "assets"
            },
            "@pageblock-nft-minter/interface": {
                "path": "interface"
            },
            "@pageblock-nft-minter/utils": {
                "path": "utils"
            },
            "@pageblock-nft-minter/store": {
                "path": "store"
            },
            "@pageblock-nft-minter/wallet": {
                "path": "wallet"
            },
            "@pageblock-nft-minter/token-selection": {
                "path": "token-selection"
            },
            "@pageblock-nft-minter/alert": {
                "path": "alert"
            },
            "@pageblock-nft-minter/config": {
                "path": "config"
            },
            "@pageblock-nft-minter/main": {
                "path": "main"
            }
        },
        "dependencies": {
            "@ijstech/eth-contract": "*",
            "@scom/scom-product-contract": "*",
            "@scom/scom-commission-proxy-contract": "*"
        },
        "ipfsGatewayUrl": "https://ipfs.scom.dev/ipfs/",
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
                }
            }
        },
        "commissionFee": "0.01"
    };
});
define("@scom/scom-nft-minter", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-nft-minter/interface/index.tsx", "@scom/scom-nft-minter/utils/index.ts", "@scom/scom-nft-minter/store/index.ts", "@scom/scom-nft-minter/wallet/index.ts", "@scom/scom-nft-minter/index.css.ts", "@scom/scom-nft-minter/API.ts", "@scom/scom-nft-minter/scconfig.json.ts"], function (require, exports, components_9, eth_wallet_10, index_14, index_15, index_16, index_17, index_css_3, API_1, scconfig_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_9.Styles.Theme.ThemeVars;
    let ScomNftMinter = class ScomNftMinter extends components_9.Module {
        constructor(parent, options) {
            super(parent, options);
            this._oldData = {};
            this._data = {};
            this.isApproving = false;
            this.oldTag = {};
            this.tag = {};
            this.defaultEdit = true;
            this.onWalletConnect = async (connected) => {
                let chainId = index_17.getChainId();
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
                    let chainId = index_17.getChainId();
                    const _tokenList = index_16.getTokenList(chainId);
                    const token = _tokenList.find(t => { var _a, _b; return (t.address && t.address == ((_a = this._data.token) === null || _a === void 0 ? void 0 : _a.address)) || (t.symbol == ((_b = this._data.token) === null || _b === void 0 ? void 0 : _b.symbol)); });
                    const symbol = (token === null || token === void 0 ? void 0 : token.symbol) || '';
                    this.lblBalance.caption = token ? `${(await index_15.getTokenBalance(token)).toFixed(2)} ${symbol}` : `0 ${symbol}`;
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
                if (this._data.productType == index_14.ProductType.DonateToOwner || this._data.productType == index_14.ProductType.DonateToEveryone) {
                    await API_1.donate(this._data.productId, this._data.donateTo, this.edtAmount.value, this._data.commissions, this._data.token, callback, async () => {
                        await this.updateTokenBalance();
                    });
                }
                else if (this._data.productType == index_14.ProductType.Buy) {
                    await API_1.buyProduct(this._data.productId, quantity, '0', this._data.commissions, this._data.token, callback, async () => {
                        await this.updateTokenBalance();
                        await this.updateSpotsRemaining();
                    });
                }
            };
            index_16.setDataFromSCConfig(scconfig_json_1.default);
            this.$eventBus = components_9.application.EventBus;
            this.registerEvent();
        }
        async init() {
            var _a;
            this.isReadyCallbackQueued = true;
            super.init();
            await this.initWalletData();
            await this.onSetupPage(index_17.isWalletConnected());
            if (!this.tag || (typeof this.tag === 'object' && !Object.keys(this.tag).length)) {
                const defaultTag = {
                    inputFontColor: '#ffffff',
                    inputBackgroundColor: 'linear-gradient(#232B5A, #232B5A), linear-gradient(254.8deg, #E75B66 -8.08%, #B52082 84.35%)',
                    fontColor: '#323232',
                    backgroundColor: '#DBDBDB'
                };
                this.setTag(defaultTag);
                if (this.parentElement) {
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
            this._data.chainId = this.getAttribute('chainId', true);
            this._data.donateTo = this.getAttribute('donateTo', true);
            this._data.link = this.getAttribute('link', true);
            this._data.feeTo = this.getAttribute('feeTo', true);
            this._data.maxOrderQty = this.getAttribute('maxOrderQty', true);
            this._data.maxPrice = this.getAttribute('maxPrice', true);
            this._data.price = this.getAttribute('price', true);
            this._data.qty = this.getAttribute('qty', true);
            const tokenAddress = this.getAttribute('tokenAddress', true);
            if (tokenAddress) {
                this._data.token = (_a = index_16.DefaultTokens[this.chainId]) === null || _a === void 0 ? void 0 : _a.find(t => { var _a; return ((_a = t.address) === null || _a === void 0 ? void 0 : _a.toLowerCase()) == tokenAddress.toLowerCase(); });
            }
            this._data.productId = this.getAttribute('productId', true);
            this._data.productType = this.getAttribute('productType', true);
            this._data.name = this.getAttribute('name', true);
            this._data.description = this.getAttribute('description', true);
            this._data.hideDescription = this.getAttribute('hideDescription', true);
            this._data.logo = this.getAttribute('logo', true);
            const commissionFee = index_16.getCommissionFee();
            this.lbOrderTotalTitle.caption = `Total (+${new eth_wallet_10.BigNumber(commissionFee).times(100)}% Commission Fee)`;
            if (new eth_wallet_10.BigNumber(commissionFee).gt(0) && this._data.feeTo != undefined) {
                this._data.commissions = [{
                        walletAddress: this._data.feeTo,
                        share: commissionFee
                    }];
            }
            this._productId = this._data.productId;
            if (this.approvalModelAction) {
                if (!this._data.commissions || this._data.commissions.length == 0) {
                    this.contractAddress = index_16.getContractAddress('ProductInfo');
                }
                else {
                    this.contractAddress = index_16.getContractAddress('Proxy');
                }
                this.approvalModelAction.setSpenderAddress(this.contractAddress);
            }
            await this.refreshDApp();
            this.isReadyCallbackQueued = false;
            this.executeReadyCallback();
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get chainId() {
            var _a;
            return (_a = this._data.chainId) !== null && _a !== void 0 ? _a : 0;
        }
        set chainId(value) {
            this._data.chainId = value;
        }
        get donateTo() {
            var _a;
            return (_a = this._data.donateTo) !== null && _a !== void 0 ? _a : '';
        }
        set donateTo(value) {
            this._data.donateTo = value;
        }
        get link() {
            var _a;
            return (_a = this._data.link) !== null && _a !== void 0 ? _a : '';
        }
        set link(value) {
            this._data.link = value;
        }
        get feeTo() {
            var _a;
            return (_a = this._data.feeTo) !== null && _a !== void 0 ? _a : '';
        }
        set feeTo(value) {
            this._data.feeTo = value;
        }
        get maxOrderQty() {
            var _a;
            return (_a = this._data.maxOrderQty) !== null && _a !== void 0 ? _a : 0;
        }
        set maxOrderQty(value) {
            this._data.maxOrderQty = value;
        }
        get maxPrice() {
            var _a;
            return (_a = this._data.maxPrice) !== null && _a !== void 0 ? _a : "0";
        }
        set maxPrice(value) {
            this._data.maxPrice = value;
        }
        get price() {
            var _a;
            return (_a = this._data.price) !== null && _a !== void 0 ? _a : "0";
        }
        set price(value) {
            this._data.price = value;
        }
        get qty() {
            var _a;
            return (_a = this._data.qty) !== null && _a !== void 0 ? _a : 0;
        }
        set qty(value) {
            this._data.qty = value;
        }
        get tokenAddress() {
            var _a, _b;
            return (_b = (_a = this._data.token) === null || _a === void 0 ? void 0 : _a.address) !== null && _b !== void 0 ? _b : '';
        }
        set tokenAddress(value) {
            var _a;
            this._data.token = (_a = index_16.DefaultTokens[this.chainId]) === null || _a === void 0 ? void 0 : _a.find(t => { var _a; return ((_a = t.address) === null || _a === void 0 ? void 0 : _a.toLowerCase()) == value.toLowerCase(); });
        }
        get productId() {
            var _a;
            return (_a = this._data.productId) !== null && _a !== void 0 ? _a : 0;
        }
        set productId(value) {
            this._data.productId = value;
        }
        get productType() {
            var _a;
            return (_a = this._data.productType) !== null && _a !== void 0 ? _a : index_14.ProductType.Buy;
        }
        set productType(value) {
            this._data.productType = value;
        }
        get name() {
            var _a;
            return (_a = this._data.name) !== null && _a !== void 0 ? _a : '';
        }
        set name(value) {
            this._data.name = value;
        }
        get description() {
            var _a;
            return (_a = this._data.description) !== null && _a !== void 0 ? _a : '';
        }
        set description(value) {
            this._data.description = value;
        }
        get hideDescription() {
            var _a;
            return (_a = this._data.hideDescription) !== null && _a !== void 0 ? _a : false;
        }
        set hideDescription(value) {
            this._data.hideDescription = value;
        }
        get logo() {
            var _a;
            return (_a = this._data.logo) !== null && _a !== void 0 ? _a : '';
        }
        set logo(value) {
            this._data.logo = value;
        }
        get commissions() {
            var _a;
            return (_a = this._data.commissions) !== null && _a !== void 0 ? _a : [];
        }
        set commissions(value) {
            this._data.commissions = value;
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
        getEmbedderActions() {
            const propertiesSchema = {
                type: 'object',
                properties: {
                    "chainId": {
                        title: 'Chain ID',
                        type: 'number',
                        readOnly: true
                    },
                    "feeTo": {
                        type: 'string',
                        default: eth_wallet_10.Wallet.getClientInstance().address,
                        format: "wallet-address"
                    }
                }
            };
            if (!this._data.hideDescription) {
                propertiesSchema.properties['description'] = {
                    type: 'string',
                    format: 'multi'
                };
                propertiesSchema.properties['logo'] = {
                    type: 'string',
                    format: 'data-url'
                };
            }
            const themeSchema = {
                type: 'object',
                properties: {
                    backgroundColor: {
                        type: 'string',
                        format: 'color',
                        readOnly: true
                    },
                    fontColor: {
                        type: 'string',
                        format: 'color',
                        readOnly: true
                    },
                    inputBackgroundColor: {
                        type: 'string',
                        format: 'color',
                        readOnly: true
                    },
                    inputFontColor: {
                        type: 'string',
                        format: 'color',
                        readOnly: true
                    }
                }
            };
            return this._getActions(propertiesSchema, themeSchema);
        }
        getActions() {
            const propertiesSchema = {
                type: 'object',
                properties: {
                    // "name": {
                    //   type: 'string'
                    // },
                    // "productType": {
                    //   type: 'string'
                    // },
                    // "chainId": {
                    //   title: 'Chain ID',
                    //   type: 'number'
                    // },    
                    // "token": {
                    //   type: 'object'
                    // },            
                    "donateTo": {
                        type: 'string',
                        default: eth_wallet_10.Wallet.getClientInstance().address,
                        format: "wallet-address"
                    },
                    // "productId": {
                    //   type: 'number'
                    // },
                    "link": {
                        type: 'string'
                    },
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
            };
            if (!this._data.hideDescription) {
                propertiesSchema.properties['description'] = {
                    type: 'string',
                    format: 'multi'
                };
                propertiesSchema.properties['logo'] = {
                    type: 'string',
                    format: 'data-url'
                };
            }
            const themeSchema = {
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
            };
            return this._getActions(propertiesSchema, themeSchema);
        }
        _getActions(propertiesSchema, themeSchema) {
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
                                const commissionFee = index_16.getCommissionFee();
                                if (new eth_wallet_10.BigNumber(commissionFee).gt(0) && userInputData.feeTo != undefined) {
                                    this._data.feeTo = userInputData.feeTo;
                                    this._data.commissions = [{
                                            walletAddress: userInputData.feeTo,
                                            share: commissionFee
                                        }];
                                }
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
                    userInputDataSchema: propertiesSchema
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
                                else
                                    this.setTag(userInputData);
                                // this.setTag(userInputData);
                            },
                            undo: () => {
                                if (!userInputData)
                                    return;
                                this.tag = Object.assign({}, this.oldTag);
                                if (builder)
                                    builder.setTag(this.tag);
                                else
                                    this.setTag(this.oldTag);
                                // this.setTag(this.oldTag);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: themeSchema
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
            const commissionFee = index_16.getCommissionFee();
            this.lbOrderTotalTitle.caption = `Total (+${new eth_wallet_10.BigNumber(commissionFee).times(100)}% Commission Fee)`;
            if (new eth_wallet_10.BigNumber(commissionFee).gt(0) && this._data.feeTo != undefined) {
                this._data.commissions = [{
                        walletAddress: this._data.feeTo,
                        share: commissionFee
                    }];
            }
            if (this.approvalModelAction) {
                if (!this._data.commissions || this._data.commissions.length == 0) {
                    this.contractAddress = index_16.getContractAddress('ProductInfo');
                }
                else {
                    this.contractAddress = index_16.getContractAddress('Proxy');
                }
                this.approvalModelAction.setSpenderAddress(this.contractAddress);
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
            this._data.chainId = this._data.token ? index_17.getChainId() : undefined;
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
            if (this._data.hideDescription) {
                this.pnlDescription.visible = false;
                this.gridDApp.templateColumns = ['1fr'];
                this.imgLogo2.visible = true;
            }
            else {
                this.pnlDescription.visible = true;
                this.gridDApp.templateColumns = ['repeat(2, 1fr)'];
                this.imgLogo2.visible = false;
            }
            if ((_a = this._data.logo) === null || _a === void 0 ? void 0 : _a.startsWith('ipfs://')) {
                const ipfsGatewayUrl = index_16.getIPFSGatewayUrl();
                this.imgLogo.url = this.imgLogo2.url = this._data.logo.replace('ipfs://', ipfsGatewayUrl);
            }
            else {
                this.imgLogo.url = this.imgLogo2.url = this._data.logo;
            }
            this.markdownViewer.load(this._data.description || '');
            this.pnlLink.visible = !!this._data.link;
            this.lblLink.caption = this._data.link || '';
            this.lblLink.link.href = this._data.link;
            if (this._type === index_14.ProductType.Buy) {
                this.lblTitle.caption = `Mint Fee: ${(_b = this._data.price) !== null && _b !== void 0 ? _b : ""} ${((_c = this._data.token) === null || _c === void 0 ? void 0 : _c.symbol) || ""}`;
                this.btnSubmit.caption = 'Mint';
                this.lblRef.caption = 'smart contract:';
                if (this._data.chainId !== null && this._data.chainId !== undefined) {
                    this.lblBlockchain.caption = index_16.getNetworkName(this._data.chainId) || this._data.chainId.toString();
                }
                else {
                    this.lblBlockchain.caption = "";
                }
                await this.updateSpotsRemaining();
                this.gridTokenInput.visible = false;
            }
            else {
                this.lblTitle.caption = new eth_wallet_10.BigNumber(this._data.price).isZero() ? 'Make a Contributon' : '';
                this.btnSubmit.caption = 'Submit';
                this.lblRef.caption = new eth_wallet_10.BigNumber(this._data.price).isZero() ? 'All proceeds will go to following vetted wallet address:' : '';
                this.gridTokenInput.visible = true;
            }
            this.edtQty.value = "";
            this.edtAmount.value = "";
            this.lbOrderTotal.caption = "0";
            this.pnlSpotsRemaining.visible = new eth_wallet_10.BigNumber(this._data.price).gt(0);
            this.pnlBlockchain.visible = new eth_wallet_10.BigNumber(this._data.price).gt(0);
            this.pnlQty.visible = new eth_wallet_10.BigNumber(this._data.price).gt(0) && this._data.maxOrderQty > 1;
            this.lblAddress.caption = this.contractAddress;
            // this.tokenSelection.readonly = this._data.token ? true : new BigNumber(this._data.price).gt(0);
            this.tokenSelection.chainId = this._data.chainId;
            this.tokenSelection.token = this._data.token;
            this.updateTokenBalance();
            // this.lblBalance.caption = (await getTokenBalance(this._data.token)).toFixed(2);
        }
        async initWalletData() {
            const selectedProvider = localStorage.getItem('walletProvider');
            const isValidProvider = Object.values(eth_wallet_10.WalletPlugin).includes(selectedProvider);
            if (index_17.hasWallet() && isValidProvider) {
                await index_17.connectWallet(selectedProvider);
            }
        }
        async initApprovalAction() {
            if (!this.approvalModelAction) {
                this.contractAddress = index_16.getContractAddress('Proxy');
                this.approvalModelAction = index_15.getERC20ApprovalModelAction(this.contractAddress, {
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
                        this.btnSubmit.enabled = new eth_wallet_10.BigNumber(this.tokenAmountIn).gt(0);
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
            this.lblBalance.caption = `${(await index_15.getTokenBalance(token)).toFixed(2)} ${symbol}`;
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
            const commissionFee = index_16.getCommissionFee();
            const total = new eth_wallet_10.BigNumber(amount).plus(new eth_wallet_10.BigNumber(amount).times(commissionFee));
            this.lbOrderTotal.caption = `${total} ${this._data.token.symbol}`;
            this.approvalModelAction.checkAllowance(this._data.token, this.tokenAmountIn);
        }
        async doSubmitAction() {
            var _a;
            if (!this._data || !this._productId)
                return;
            this.updateSubmitButton(true);
            const chainId = index_17.getChainId();
            if ((this._type === index_14.ProductType.DonateToOwner || this._type === index_14.ProductType.DonateToEveryone) && !this.tokenSelection.token) {
                this.mdAlert.message = {
                    status: 'error',
                    content: 'Token Required'
                };
                this.mdAlert.showModal();
                this.updateSubmitButton(false);
                return;
            }
            if (this._type === index_14.ProductType.Buy && chainId !== this._data.chainId) {
                this.mdAlert.message = {
                    status: 'error',
                    content: 'Unsupported Network'
                };
                this.mdAlert.showModal();
                this.updateSubmitButton(false);
                return;
            }
            const balance = await index_15.getTokenBalance(this._type === index_14.ProductType.Buy ? this._data.token : this.tokenSelection.token);
            if (this._type === index_14.ProductType.Buy) {
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
                const maxOrderQty = new eth_wallet_10.BigNumber((_a = this._data.maxOrderQty) !== null && _a !== void 0 ? _a : 0);
                if (maxOrderQty.minus(requireQty).lt(0)) {
                    this.mdAlert.message = {
                        status: 'error',
                        content: 'Over Maximum Order Quantity'
                    };
                    this.mdAlert.showModal();
                    this.updateSubmitButton(false);
                    return;
                }
                const amount = new eth_wallet_10.BigNumber(this._data.price).times(requireQty);
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
                    this.$render("i-vstack", { id: "pnlDescription", padding: { top: '0.5rem', bottom: '0.5rem', left: '5.25rem', right: '5.25rem' } },
                        this.$render("i-hstack", { margin: { bottom: '1.25rem' } },
                            this.$render("i-image", { id: 'imgLogo', class: index_css_3.imageStyle, height: 100 })),
                        this.$render("i-markdown", { id: 'markdownViewer', class: index_css_3.markdownStyle, width: '100%', height: '100%', margin: { bottom: '0.563rem' } })),
                    this.$render("i-vstack", { gap: "0.5rem", padding: { top: '1.75rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, verticalAlignment: 'space-between' },
                        this.$render("i-vstack", { class: "text-center", margin: { bottom: '0.25rem' } },
                            this.$render("i-image", { id: 'imgLogo2', class: index_css_3.imageStyle, height: 100 }),
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
                                    this.$render("i-input", { id: 'edtQty', onChanged: this.onQtyChanged.bind(this), class: index_css_3.inputStyle, inputType: 'number', font: { size: '0.875rem' }, border: { radius: 4 } })),
                                this.$render("i-hstack", { horizontalAlignment: 'space-between', verticalAlignment: 'center', gap: "0.5rem" },
                                    this.$render("i-label", { caption: "Your donation", font: { weight: 500, size: '1rem' } }),
                                    this.$render("i-hstack", { horizontalAlignment: 'end', verticalAlignment: 'center', gap: "0.5rem", opacity: 0.6 },
                                        this.$render("i-label", { caption: 'Balance:', font: { size: '1rem' } }),
                                        this.$render("i-label", { id: 'lblBalance', font: { size: '1rem' } }))),
                                this.$render("i-grid-layout", { id: 'gridTokenInput', templateColumns: ['60%', 'auto'], overflow: "hidden", background: { color: Theme.input.background }, font: { color: Theme.input.fontColor }, height: 56, verticalAlignment: "center", class: index_css_3.inputGroupStyle },
                                    this.$render("nft-minter-token-selection", { id: 'tokenSelection', class: index_css_3.tokenSelectionStyle, background: { color: 'transparent' }, width: "100%", readonly: true, onSelectToken: this.selectToken.bind(this) }),
                                    this.$render("i-input", { id: "edtAmount", width: '100%', height: '100%', minHeight: 40, class: index_css_3.inputStyle, inputType: 'number', font: { size: '1.25rem' }, opacity: 0.3, onChanged: this.onAmountChanged.bind(this) })),
                                this.$render("i-vstack", { horizontalAlignment: "center", verticalAlignment: 'center', gap: "8px", margin: { top: '0.75rem' } },
                                    this.$render("i-button", { id: "btnApprove", width: '100%', caption: "Approve", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText, bold: true }, rightIcon: { visible: false, fill: Theme.colors.primary.contrastText }, border: { radius: 12 }, visible: false, onClick: this.onApprove.bind(this) }),
                                    this.$render("i-button", { id: 'btnSubmit', width: '100%', caption: 'Submit', padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText, bold: true }, rightIcon: { visible: false, fill: Theme.colors.primary.contrastText }, background: { color: Theme.background.gradient }, border: { radius: 12 }, onClick: this.onSubmit.bind(this), enabled: false }))),
                            this.$render("i-hstack", { horizontalAlignment: "space-between", verticalAlignment: 'center' },
                                this.$render("i-label", { id: "lbOrderTotalTitle", caption: 'Total', font: { size: '1rem' } }),
                                this.$render("i-label", { id: 'lbOrderTotal', font: { size: '1rem' }, caption: "0" })),
                            this.$render("i-vstack", { gap: '0.25rem', margin: { top: '1rem' } },
                                this.$render("i-label", { id: 'lblRef', font: { size: '0.875rem' }, opacity: 0.5 }),
                                this.$render("i-label", { id: 'lblAddress', font: { size: '0.875rem' }, overflowWrap: 'anywhere' })),
                            this.$render("i-label", { caption: 'Terms & Condition', font: { size: '0.875rem' }, link: { href: 'https://docs.scom.dev/' }, opacity: 0.6, margin: { top: '1rem' } }))),
                    this.$render("i-hstack", { id: 'pnlLink', visible: false, verticalAlignment: 'center', gap: '0.25rem', padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' } },
                        this.$render("i-label", { caption: 'Details here: ', font: { size: '1rem' } }),
                        this.$render("i-label", { id: 'lblLink', font: { size: '1rem' } }))),
                this.$render("nft-minter-config", { id: 'configDApp', visible: false }),
                this.$render("nft-minter-alert", { id: 'mdAlert' })));
        }
    };
    ScomNftMinter = __decorate([
        components_9.customModule,
        components_9.customElements('i-scom-nft-minter')
    ], ScomNftMinter);
    exports.default = ScomNftMinter;
});
