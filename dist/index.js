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
define("@scom/scom-nft-minter/store/index.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet"], function (require, exports, components_1, eth_wallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isRpcWalletConnected = exports.isClientWalletConnected = exports.getClientWallet = exports.getRpcWallet = exports.getChainId = exports.initRpcWallet = exports.getContractAddress = exports.getEmbedderCommissionFee = exports.getIPFSGatewayUrl = exports.setIPFSGatewayUrl = exports.setDataFromSCConfig = exports.state = void 0;
    exports.state = {
        contractInfoByChain: {},
        ipfsGatewayUrl: "",
        embedderCommissionFee: "0",
        rpcWalletId: ""
    };
    const setDataFromSCConfig = (options) => {
        if (options.contractInfo) {
            setContractInfo(options.contractInfo);
        }
        if (options.ipfsGatewayUrl) {
            (0, exports.setIPFSGatewayUrl)(options.ipfsGatewayUrl);
        }
        if (options.embedderCommissionFee) {
            setEmbedderCommissionFee(options.embedderCommissionFee);
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
    const setEmbedderCommissionFee = (fee) => {
        exports.state.embedderCommissionFee = fee;
    };
    const getEmbedderCommissionFee = () => {
        return exports.state.embedderCommissionFee;
    };
    exports.getEmbedderCommissionFee = getEmbedderCommissionFee;
    const getContractAddress = (type) => {
        var _a;
        const chainId = getChainId();
        const contracts = getContractInfo(chainId) || {};
        return (_a = contracts[type]) === null || _a === void 0 ? void 0 : _a.address;
    };
    exports.getContractAddress = getContractAddress;
    function initRpcWallet(defaultChainId) {
        if (exports.state.rpcWalletId) {
            return exports.state.rpcWalletId;
        }
        const clientWallet = eth_wallet_1.Wallet.getClientInstance();
        const networkList = Object.values(components_1.application.store.networkMap);
        const instanceId = clientWallet.initRpcWallet({
            networks: networkList,
            defaultChainId,
            infuraId: components_1.application.store.infuraId,
            multicalls: components_1.application.store.multicalls
        });
        exports.state.rpcWalletId = instanceId;
        if (clientWallet.address) {
            const rpcWallet = eth_wallet_1.Wallet.getRpcWalletInstance(instanceId);
            rpcWallet.address = clientWallet.address;
        }
        return instanceId;
    }
    exports.initRpcWallet = initRpcWallet;
    function getChainId() {
        const rpcWallet = getRpcWallet();
        return rpcWallet === null || rpcWallet === void 0 ? void 0 : rpcWallet.chainId;
    }
    exports.getChainId = getChainId;
    function getRpcWallet() {
        return eth_wallet_1.Wallet.getRpcWalletInstance(exports.state.rpcWalletId);
    }
    exports.getRpcWallet = getRpcWallet;
    function getClientWallet() {
        return eth_wallet_1.Wallet.getClientInstance();
    }
    exports.getClientWallet = getClientWallet;
    function isClientWalletConnected() {
        const wallet = eth_wallet_1.Wallet.getClientInstance();
        return wallet.isConnected;
    }
    exports.isClientWalletConnected = isClientWalletConnected;
    function isRpcWalletConnected() {
        const wallet = getRpcWallet();
        return wallet === null || wallet === void 0 ? void 0 : wallet.isConnected;
    }
    exports.isRpcWalletConnected = isRpcWalletConnected;
});
define("@scom/scom-nft-minter/utils/token.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-nft-minter/store/index.ts"], function (require, exports, eth_wallet_2, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerSendTxEvents = exports.getTokenBalance = exports.getERC20Amount = void 0;
    const getERC20Amount = async (wallet, tokenAddress, decimals) => {
        try {
            let erc20 = new eth_wallet_2.Erc20(wallet, tokenAddress, decimals);
            return await erc20.balance;
        }
        catch (_a) {
            return new eth_wallet_2.BigNumber(0);
        }
    };
    exports.getERC20Amount = getERC20Amount;
    const getTokenBalance = async (token) => {
        const wallet = (0, index_1.getRpcWallet)();
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
define("@scom/scom-nft-minter/utils/approvalModel.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-nft-minter/utils/token.ts"], function (require, exports, eth_wallet_3, token_1) {
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
                let allowance = await (0, exports.getERC20Allowance)(token, this.options.spenderAddress);
                if (!allowance) {
                    await this.options.onToBePaid.bind(this.options.sender)(token);
                }
                else if (new eth_wallet_3.BigNumber(inputAmount).gt(allowance)) {
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
                (0, token_1.registerSendTxEvents)({
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
        let wallet = eth_wallet_3.Wallet.getInstance();
        let amount = new eth_wallet_3.BigNumber(2).pow(256).minus(1);
        let erc20 = new eth_wallet_3.Contracts.ERC20(wallet, token.address);
        (0, token_1.registerSendTxEvents)({
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
        let wallet = eth_wallet_3.Wallet.getInstance();
        let erc20 = new eth_wallet_3.Contracts.ERC20(wallet, token.address);
        let allowance = await erc20.allowance({
            owner: wallet.address,
            spender: spenderAddress
        });
        return eth_wallet_3.Utils.fromDecimals(allowance, token.decimals || 18);
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
define("@scom/scom-nft-minter/utils/index.ts", ["require", "exports", "@scom/scom-nft-minter/utils/token.ts", "@scom/scom-nft-minter/utils/approvalModel.ts"], function (require, exports, token_2, approvalModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getERC20ApprovalModelAction = exports.getERC20Allowance = exports.ApprovalStatus = exports.registerSendTxEvents = exports.getTokenBalance = exports.getERC20Amount = void 0;
    Object.defineProperty(exports, "getERC20Amount", { enumerable: true, get: function () { return token_2.getERC20Amount; } });
    Object.defineProperty(exports, "getTokenBalance", { enumerable: true, get: function () { return token_2.getTokenBalance; } });
    Object.defineProperty(exports, "registerSendTxEvents", { enumerable: true, get: function () { return token_2.registerSendTxEvents; } });
    Object.defineProperty(exports, "ApprovalStatus", { enumerable: true, get: function () { return approvalModel_1.ApprovalStatus; } });
    Object.defineProperty(exports, "getERC20Allowance", { enumerable: true, get: function () { return approvalModel_1.getERC20Allowance; } });
    Object.defineProperty(exports, "getERC20ApprovalModelAction", { enumerable: true, get: function () { return approvalModel_1.getERC20ApprovalModelAction; } });
});
define("@scom/scom-nft-minter/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tokenSelectionStyle = exports.inputGroupStyle = exports.inputStyle = exports.markdownStyle = exports.imageStyle = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    exports.imageStyle = components_2.Styles.style({
        $nest: {
            '&>img': {
                maxWidth: 'unset',
                maxHeight: 'unset',
                borderRadius: 4
            }
        }
    });
    exports.markdownStyle = components_2.Styles.style({
        color: Theme.text.primary,
        overflowWrap: 'break-word'
    });
    exports.inputStyle = components_2.Styles.style({
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
    exports.inputGroupStyle = components_2.Styles.style({
        border: '2px solid transparent',
        // background: 'linear-gradient(#232B5A, #232B5A), linear-gradient(254.8deg, #E75B66 -8.08%, #B52082 84.35%)',
        backgroundOrigin: 'border-box !important',
        backgroundClip: 'content-box, border-box !important',
        borderRadius: 16
    });
    exports.tokenSelectionStyle = components_2.Styles.style({
        $nest: {
            'i-vstack.custom-border > i-hstack': {
                display: 'none'
            },
            '#inputAmount': {
                fontSize: '1.25rem'
            },
            '#gridTokenInput': {
                height: '100%'
            },
            '.i-modal_header': {
                display: 'none'
            },
            '#gridTokenList': {
                maxHeight: '50vh',
                overflow: 'auto',
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
            '#pnlSortBalance': {
                $nest: {
                    '.icon-sort-up': {
                        top: 1
                    },
                    '.icon-sort-down': {
                        bottom: 1
                    },
                    'i-icon svg': {
                        fill: 'inherit'
                    }
                }
            }
        }
    });
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
    ERC1155._abi = ERC1155_json_1.default.abi;
    exports.ERC1155 = ERC1155;
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
    ERC1155PresetMinterPauser._abi = ERC1155PresetMinterPauser_json_1.default.abi;
    exports.ERC1155PresetMinterPauser = ERC1155PresetMinterPauser;
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
    ERC20._abi = ERC20_json_1.default.abi;
    exports.ERC20 = ERC20;
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
    Product1155._abi = Product1155_json_1.default.abi;
    exports.Product1155 = Product1155;
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
    ProductInfo._abi = ProductInfo_json_1.default.abi;
    exports.ProductInfo = ProductInfo;
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
define("@scom/scom-nft-minter/contracts/scom-product-contract/index.ts", ["require", "exports", "@scom/scom-nft-minter/contracts/scom-product-contract/contracts/index.ts", "@ijstech/eth-wallet"], function (require, exports, Contracts, eth_wallet_4) {
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
                let value = new eth_wallet_4.BigNumber(options.initSupply);
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
define("@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/Authorization.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/Authorization.json.ts'/> 
    exports.default = {
        "abi": [
            { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "user", "type": "address" }], "name": "Authorize", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "user", "type": "address" }], "name": "Deauthorize", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "user", "type": "address" }], "name": "StartOwnershipTransfer", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "user", "type": "address" }], "name": "TransferOwnership", "type": "event" },
            { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "deny", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isPermitted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "newOwner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "permit", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [], "name": "takeOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "newOwner_", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
        ],
        "bytecode": "608060405234801561001057600080fd5b50600080546001600160a01b031916331790556104e4806100326000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80639c52a7f11161005b5780639c52a7f114610109578063a2f55ae51461011c578063d4ee1d901461012f578063f2fde38b1461014f57600080fd5b80633fd8cc4e1461008257806360536172146100ba5780638da5cb5b146100c4575b600080fd5b6100a5610090366004610471565b60026020526000908152604090205460ff1681565b60405190151581526020015b60405180910390f35b6100c2610162565b005b6000546100e49073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100b1565b6100c2610117366004610471565b610290565b6100c261012a366004610471565b610337565b6001546100e49073ffffffffffffffffffffffffffffffffffffffff1681565b6100c261015d366004610471565b6103da565b60015473ffffffffffffffffffffffffffffffffffffffff16331461020d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f416374696f6e20706572666f726d656420627920756e617574686f72697a656460448201527f20616464726573732e0000000000000000000000000000000000000000000000606482015260840160405180910390fd5b600180546000805473ffffffffffffffffffffffffffffffffffffffff83167fffffffffffffffffffffffff000000000000000000000000000000000000000091821681179092559091169091556040519081527fcfaaa26691e16e66e73290fc725eee1a6b4e0e693a1640484937aac25ffb55a49060200160405180910390a1565b60005473ffffffffffffffffffffffffffffffffffffffff1633146102b457600080fd5b73ffffffffffffffffffffffffffffffffffffffff811660008181526002602090815260409182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905590519182527f79ede3839cd7a7d8bd77e97e5c890565fe4f76cdbbeaa364646e28a8695a788491015b60405180910390a150565b60005473ffffffffffffffffffffffffffffffffffffffff16331461035b57600080fd5b73ffffffffffffffffffffffffffffffffffffffff811660008181526002602090815260409182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016600117905590519182527f6d81a01b39982517ba331aeb4f387b0f9cc32334b65bb9a343a077973cf7adf5910161032c565b60005473ffffffffffffffffffffffffffffffffffffffff1633146103fe57600080fd5b600180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff83169081179091556040519081527f686a7ab184e6928ddedba810af7b443d6baa40bf32c4787ccd72c5b4b28cae1b9060200161032c565b60006020828403121561048357600080fd5b813573ffffffffffffffffffffffffffffffffffffffff811681146104a757600080fd5b939250505056fea264697066735822122033e2168c52e6ad7dba3a67ff5b9b8ef2f2aca308087efe2ebf7dfc9d5ef61bee64736f6c63430008110033"
    };
});
define("@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/Authorization.ts", ["require", "exports", "@ijstech/eth-contract", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/Authorization.json.ts"], function (require, exports, eth_contract_6, Authorization_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Authorization = void 0;
    class Authorization extends eth_contract_6.Contract {
        constructor(wallet, address) {
            super(wallet, address, Authorization_json_1.default.abi, Authorization_json_1.default.bytecode);
            this.assign();
        }
        deploy(options) {
            return this.__deploy([], options);
        }
        parseAuthorizeEvent(receipt) {
            return this.parseEvents(receipt, "Authorize").map(e => this.decodeAuthorizeEvent(e));
        }
        decodeAuthorizeEvent(event) {
            let result = event.data;
            return {
                user: result.user,
                _event: event
            };
        }
        parseDeauthorizeEvent(receipt) {
            return this.parseEvents(receipt, "Deauthorize").map(e => this.decodeDeauthorizeEvent(e));
        }
        decodeDeauthorizeEvent(event) {
            let result = event.data;
            return {
                user: result.user,
                _event: event
            };
        }
        parseStartOwnershipTransferEvent(receipt) {
            return this.parseEvents(receipt, "StartOwnershipTransfer").map(e => this.decodeStartOwnershipTransferEvent(e));
        }
        decodeStartOwnershipTransferEvent(event) {
            let result = event.data;
            return {
                user: result.user,
                _event: event
            };
        }
        parseTransferOwnershipEvent(receipt) {
            return this.parseEvents(receipt, "TransferOwnership").map(e => this.decodeTransferOwnershipEvent(e));
        }
        decodeTransferOwnershipEvent(event) {
            let result = event.data;
            return {
                user: result.user,
                _event: event
            };
        }
        assign() {
            let isPermitted_call = async (param1, options) => {
                let result = await this.call('isPermitted', [param1], options);
                return result;
            };
            this.isPermitted = isPermitted_call;
            let newOwner_call = async (options) => {
                let result = await this.call('newOwner', [], options);
                return result;
            };
            this.newOwner = newOwner_call;
            let owner_call = async (options) => {
                let result = await this.call('owner', [], options);
                return result;
            };
            this.owner = owner_call;
            let deny_send = async (user, options) => {
                let result = await this.send('deny', [user], options);
                return result;
            };
            let deny_call = async (user, options) => {
                let result = await this.call('deny', [user], options);
                return;
            };
            let deny_txData = async (user, options) => {
                let result = await this.txData('deny', [user], options);
                return result;
            };
            this.deny = Object.assign(deny_send, {
                call: deny_call,
                txData: deny_txData
            });
            let permit_send = async (user, options) => {
                let result = await this.send('permit', [user], options);
                return result;
            };
            let permit_call = async (user, options) => {
                let result = await this.call('permit', [user], options);
                return;
            };
            let permit_txData = async (user, options) => {
                let result = await this.txData('permit', [user], options);
                return result;
            };
            this.permit = Object.assign(permit_send, {
                call: permit_call,
                txData: permit_txData
            });
            let takeOwnership_send = async (options) => {
                let result = await this.send('takeOwnership', [], options);
                return result;
            };
            let takeOwnership_call = async (options) => {
                let result = await this.call('takeOwnership', [], options);
                return;
            };
            let takeOwnership_txData = async (options) => {
                let result = await this.txData('takeOwnership', [], options);
                return result;
            };
            this.takeOwnership = Object.assign(takeOwnership_send, {
                call: takeOwnership_call,
                txData: takeOwnership_txData
            });
            let transferOwnership_send = async (newOwner, options) => {
                let result = await this.send('transferOwnership', [newOwner], options);
                return result;
            };
            let transferOwnership_call = async (newOwner, options) => {
                let result = await this.call('transferOwnership', [newOwner], options);
                return;
            };
            let transferOwnership_txData = async (newOwner, options) => {
                let result = await this.txData('transferOwnership', [newOwner], options);
                return result;
            };
            this.transferOwnership = Object.assign(transferOwnership_send, {
                call: transferOwnership_call,
                txData: transferOwnership_txData
            });
        }
    }
    Authorization._abi = Authorization_json_1.default.abi;
    exports.Authorization = Authorization;
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
        "bytecode": "608060405234801561001057600080fd5b5061255a806100206000396000f3fe6080604052600436106100cb5760003560e01c8063b60c164c11610074578063d3b7d4c31161004e578063d3b7d4c31461027c578063ee42d3a31461029c578063f303ad6e146102c957600080fd5b8063b60c164c146101b1578063c0da918d146101d1578063d2ef8464146101f157600080fd5b806373d8690f116100a557806373d8690f1461014257806383e40a5114610155578063b316d7141461019b57600080fd5b806301417e7b146100d7578063188ff72b146100ec5780631e83409a1461012257600080fd5b366100d257005b600080fd5b6100ea6100e5366004611f63565b6102e9565b005b3480156100f857600080fd5b5061010c610107366004612010565b610493565b6040516101199190612032565b60405180910390f35b34801561012e57600080fd5b506100ea61013d3660046120a4565b610660565b6100ea61015036600461210d565b61066c565b34801561016157600080fd5b5061018d6101703660046121c8565b600360209081526000928352604080842090915290825290205481565b604051908152602001610119565b3480156101a757600080fd5b5061018d60005481565b3480156101bd57600080fd5b506100ea6101cc366004612201565b610e01565b3480156101dd57600080fd5b506100ea6101ec366004612243565b610fe9565b3480156101fd57600080fd5b5061024961020c3660046122c1565b600260208190526000918252604090912080546001820154919092015473ffffffffffffffffffffffffffffffffffffffff928316929091169083565b6040805173ffffffffffffffffffffffffffffffffffffffff948516815293909216602084015290820152606001610119565b34801561028857600080fd5b5061018d6102973660046121c8565b61134a565b3480156102a857600080fd5b5061018d6102b73660046120a4565b60016020526000908152604090205481565b3480156102d557600080fd5b506100ea6102e4366004612201565b611393565b600082815b818110156103bb5736868683818110610309576103096122da565b90506040020190508060200135846103219190612338565b935061033f61033360208301836120a4565b600083602001356113e0565b7fe3576de866d95e30a6b102b256dc468ead824ef133838792dc1813c3786414ef61036d60208301836120a4565b6040805173ffffffffffffffffffffffffffffffffffffffff909216825260006020838101919091528401359082015260600160405180910390a150806103b38161234b565b9150506102ee565b5060006103c88334612383565b600080805260016020527fa6eef7e35abe7026729641147f7915573c7e97b47efa546f5f6e3230263bcb4980549293508592909190610408908490612338565b9091555050604080513381526020810183905290810184905260009073ffffffffffffffffffffffffffffffffffffffff8916907f0e25509c2c6fc37a8844100a9a4c5b2b038bd5daaf09d216161eb8574ad4878b9060600160405180910390a3600080855186602001848b5af180600003610488573d6000803e3d6000fd5b503d6000803e3d6000f35b60606000831180156104a757506000548311155b610512576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600d60248201527f6f7574206f6620626f756e64730000000000000000000000000000000000000060448201526064015b60405180910390fd5b6000836000546105229190612383565b61052d906001612338565b90508083111561053b578092505b8267ffffffffffffffff81111561055457610554611e89565b6040519080825280602002602001820160405280156105bd57816020015b60408051606081018252600080825260208083018290529282015282527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9092019101816105725790505b5091508360005b84811015610657576000828152600260208181526040928390208351606081018552815473ffffffffffffffffffffffffffffffffffffffff9081168252600183015416928101929092529091015491810191909152845185908390811061062e5761062e6122da565b6020026020010181905250816106439061234b565b91508061064f8161234b565b9150506105c4565b50505092915050565b61066981611505565b50565b846000805b82811015610b44573689898381811061068c5761068c6122da565b905060200281019061069e9190612396565b90506000806106b060608401846123d4565b9050905060005b818110156107a957366106cd60608601866123d4565b838181106106dd576106dd6122da565b90506040020190508060200135846106f59190612338565b935061071e61070760208301836120a4565b61071460208801886120a4565b83602001356113e0565b7fe3576de866d95e30a6b102b256dc468ead824ef133838792dc1813c3786414ef61074c60208301836120a4565b61075960208801886120a4565b6040805173ffffffffffffffffffffffffffffffffffffffff9384168152929091166020838101919091528401359082015260600160405180910390a150806107a18161234b565b9150506106b7565b50600090506107bc826020850135612383565b905081600160006107d060208701876120a4565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546108199190612338565b909155506000905061082e60208501856120a4565b73ffffffffffffffffffffffffffffffffffffffff16036109265784156108b1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601a60248201527f6d6f7265207468616e206f6e6520455448207472616e736665720000000000006044820152606401610509565b8260200135341461091e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f45544820616d6f756e74206e6f74206d617463686564000000000000000000006044820152606401610509565b809450610ac4565b610936606084016040850161244a565b156109f557600061095361094d60208601866120a4565b84611633565b90508281146109be576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f636f6d6d697373696f6e20616d6f756e74206e6f74206d6174636865640000006044820152606401610509565b6109ef338f846109d160208901896120a4565b73ffffffffffffffffffffffffffffffffffffffff16929190611789565b50610ac4565b6000610a11610a0760208601866120a4565b8560200135611633565b905083602001358114610a80576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f616d6f756e74206e6f74206d61746368656400000000000000000000000000006044820152606401610509565b610ab08e6000610a9360208801886120a4565b73ffffffffffffffffffffffffffffffffffffffff169190611865565b610ac28e83610a9360208801886120a4565b505b610ad160208401846120a4565b604080513381526020810184905290810184905273ffffffffffffffffffffffffffffffffffffffff918216918f16907f0e25509c2c6fc37a8844100a9a4c5b2b038bd5daaf09d216161eb8574ad4878b9060600160405180910390a35050508080610b3c9061234b565b915050610671565b50600080845185602001848d5af180600003610b64573d6000803e3d6000fd5b5083915060005b8281101561048857600080878784818110610b8857610b886122da565b9050602002016020810190610b9d91906120a4565b73ffffffffffffffffffffffffffffffffffffffff1603610bfe576000805260016020527fa6eef7e35abe7026729641147f7915573c7e97b47efa546f5f6e3230263bcb4954610bed9047612383565b9050610bf988826119ec565b610d70565b60016000888885818110610c1457610c146122da565b9050602002016020810190610c2991906120a4565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054878784818110610c7657610c766122da565b9050602002016020810190610c8b91906120a4565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015273ffffffffffffffffffffffffffffffffffffffff91909116906370a0823190602401602060405180830381865afa158015610cf7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d1b9190612467565b610d259190612383565b9050610d708882898986818110610d3e57610d3e6122da565b9050602002016020810190610d5391906120a4565b73ffffffffffffffffffffffffffffffffffffffff169190611af6565b868683818110610d8257610d826122da565b9050602002016020810190610d9791906120a4565b6040805173ffffffffffffffffffffffffffffffffffffffff8b8116825260208201859052928316928e16917fc2534859c9972270c16d5b4255d200f9a0385f9a6ce3add96c0427ff9fc70f93910160405180910390a35080610df98161234b565b915050610b6b565b8060005b81811015610fe357600080858584818110610e2257610e226122da565b9050602002016020810190610e3791906120a4565b905073ffffffffffffffffffffffffffffffffffffffff8116610e9d576000805260016020527fa6eef7e35abe7026729641147f7915573c7e97b47efa546f5f6e3230263bcb4954479250610e8c9083612383565b9150610e9833836119ec565b610f81565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015273ffffffffffffffffffffffffffffffffffffffff8216906370a0823190602401602060405180830381865afa158015610f07573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f2b9190612467565b73ffffffffffffffffffffffffffffffffffffffff8216600090815260016020526040902054909250610f5e9083612383565b9150610f8173ffffffffffffffffffffffffffffffffffffffff82163384611af6565b604051828152339073ffffffffffffffffffffffffffffffffffffffff8316907f2ae72b44f59d038340fca5739135a1d51fc5ab720bb02d983e4c5ff4119ca7b89060200160405180910390a350508080610fdb9061234b565b915050610e05565b50505050565b81600080610ffa60608401846123d4565b9050905060005b818110156110e9573661101760608601866123d4565b83818110611027576110276122da565b905060400201905080602001358461103f9190612338565b935061105e61105160208301836120a4565b61071460208a018a6120a4565b7fe3576de866d95e30a6b102b256dc468ead824ef133838792dc1813c3786414ef61108c60208301836120a4565b61109960208a018a6120a4565b6040805173ffffffffffffffffffffffffffffffffffffffff9384168152929091166020838101919091528401359082015260600160405180910390a150806110e18161234b565b915050611001565b5060006110fa836020860135612383565b9050826001600061110e60208801886120a4565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546111579190612338565b9091555061116d9050606085016040860161244a565b1561120e57600061118a61118460208701876120a4565b85611633565b90508381146111f5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f636f6d6d697373696f6e20616d6f756e74206e6f74206d6174636865640000006044820152606401610509565b6112083389846109d160208a018a6120a4565b506112c0565b600061122a61122060208701876120a4565b8660200135611633565b905084602001358114611299576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f616d6f756e74206e6f74206d61746368656400000000000000000000000000006044820152606401610509565b6112ac886000610a9360208901896120a4565b6112be8883610a9360208901896120a4565b505b6112cd60208501856120a4565b604080513381526020810184905290810185905273ffffffffffffffffffffffffffffffffffffffff918216918916907f0e25509c2c6fc37a8844100a9a4c5b2b038bd5daaf09d216161eb8574ad4878b9060600160405180910390a360008086518760200160008b5af180600003610488573d6000803e3d6000fd5b73ffffffffffffffffffffffffffffffffffffffff8083166000908152600360209081526040808320938516835292815282822054825260029081905291902001545b92915050565b8060005b81811015610fe3576113ce8484838181106113b4576113b46122da565b90506020020160208101906113c991906120a4565b611505565b806113d88161234b565b915050611397565b73ffffffffffffffffffffffffffffffffffffffff8084166000908152600360209081526040808320938616835292905290812054908190036114d957600080815461142b9061234b565b909155506040805160608101825273ffffffffffffffffffffffffffffffffffffffff80871680835286821660208085018281528587018981526000805481526002808552898220985189549089167fffffffffffffffffffffffff0000000000000000000000000000000000000000918216178a55935160018a01805491909916941693909317909655519501949094558254918352600384528483209083529092529190912055610fe3565b600081815260026020819052604082200180548492906114fa908490612338565b909155505050505050565b33600090815260036020908152604080832073ffffffffffffffffffffffffffffffffffffffff8581168086529184528285205480865260028086528487208551606081018752815485168152600180830154909516818901529101805482870181905290889055938752919094529184208054939492939192839261158c908490612383565b909155505073ffffffffffffffffffffffffffffffffffffffff84166115bb576115b633826119ec565b6115dc565b6115dc73ffffffffffffffffffffffffffffffffffffffff85163383611af6565b6040805173ffffffffffffffffffffffffffffffffffffffff861681526020810183905233917f70eb43c4a8ae8c40502dcf22436c509c28d6ff421cf07c491be56984bd987068910160405180910390a250505050565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015260009073ffffffffffffffffffffffffffffffffffffffff8416906370a0823190602401602060405180830381865afa1580156116a0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116c49190612467565b90506116e873ffffffffffffffffffffffffffffffffffffffff8416333085611789565b6040517f70a08231000000000000000000000000000000000000000000000000000000008152306004820152819073ffffffffffffffffffffffffffffffffffffffff8516906370a0823190602401602060405180830381865afa158015611754573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117789190612467565b6117829190612383565b9392505050565b60405173ffffffffffffffffffffffffffffffffffffffff80851660248301528316604482015260648101829052610fe39085907f23b872dd00000000000000000000000000000000000000000000000000000000906084015b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152611b4c565b80158061190557506040517fdd62ed3e00000000000000000000000000000000000000000000000000000000815230600482015273ffffffffffffffffffffffffffffffffffffffff838116602483015284169063dd62ed3e90604401602060405180830381865afa1580156118df573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119039190612467565b155b611991576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527f20746f206e6f6e2d7a65726f20616c6c6f77616e6365000000000000000000006064820152608401610509565b60405173ffffffffffffffffffffffffffffffffffffffff83166024820152604481018290526119e79084907f095ea7b300000000000000000000000000000000000000000000000000000000906064016117e3565b505050565b6040805160008082526020820190925273ffffffffffffffffffffffffffffffffffffffff8416908390604051611a2391906124a4565b60006040518083038185875af1925050503d8060008114611a60576040519150601f19603f3d011682016040523d82523d6000602084013e611a65565b606091505b50509050806119e7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f5472616e7366657248656c7065723a204554485f5452414e534645525f46414960448201527f4c454400000000000000000000000000000000000000000000000000000000006064820152608401610509565b60405173ffffffffffffffffffffffffffffffffffffffff83166024820152604481018290526119e79084907fa9059cbb00000000000000000000000000000000000000000000000000000000906064016117e3565b6000611bae826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff16611c589092919063ffffffff16565b8051909150156119e75780806020019051810190611bcc91906124b6565b6119e7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608401610509565b6060611c678484600085611c6f565b949350505050565b606082471015611d01576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401610509565b6000808673ffffffffffffffffffffffffffffffffffffffff168587604051611d2a91906124a4565b60006040518083038185875af1925050503d8060008114611d67576040519150601f19603f3d011682016040523d82523d6000602084013e611d6c565b606091505b5091509150611d7d87838387611d88565b979650505050505050565b60608315611e1e578251600003611e175773ffffffffffffffffffffffffffffffffffffffff85163b611e17576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610509565b5081611c67565b611c678383815115611e335781518083602001fd5b806040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161050991906124d3565b73ffffffffffffffffffffffffffffffffffffffff8116811461066957600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600082601f830112611ec957600080fd5b813567ffffffffffffffff80821115611ee457611ee4611e89565b604051601f83017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f01168101908282118183101715611f2a57611f2a611e89565b81604052838152866020858801011115611f4357600080fd5b836020870160208301376000602085830101528094505050505092915050565b60008060008060608587031215611f7957600080fd5b8435611f8481611e67565b9350602085013567ffffffffffffffff80821115611fa157600080fd5b818701915087601f830112611fb557600080fd5b813581811115611fc457600080fd5b8860208260061b8501011115611fd957600080fd5b602083019550809450506040870135915080821115611ff757600080fd5b5061200487828801611eb8565b91505092959194509250565b6000806040838503121561202357600080fd5b50508035926020909101359150565b602080825282518282018190526000919060409081850190868401855b82811015612097578151805173ffffffffffffffffffffffffffffffffffffffff9081168652878201511687860152850151858501526060909301929085019060010161204f565b5091979650505050505050565b6000602082840312156120b657600080fd5b813561178281611e67565b60008083601f8401126120d357600080fd5b50813567ffffffffffffffff8111156120eb57600080fd5b6020830191508360208260051b850101111561210657600080fd5b9250929050565b600080600080600080600060a0888a03121561212857600080fd5b873561213381611e67565b9650602088013567ffffffffffffffff8082111561215057600080fd5b61215c8b838c016120c1565b909850965060408a0135915061217182611e67565b9094506060890135908082111561218757600080fd5b6121938b838c016120c1565b909550935060808a01359150808211156121ac57600080fd5b506121b98a828b01611eb8565b91505092959891949750929550565b600080604083850312156121db57600080fd5b82356121e681611e67565b915060208301356121f681611e67565b809150509250929050565b6000806020838503121561221457600080fd5b823567ffffffffffffffff81111561222b57600080fd5b612237858286016120c1565b90969095509350505050565b60008060006060848603121561225857600080fd5b833561226381611e67565b9250602084013567ffffffffffffffff8082111561228057600080fd5b908501906080828803121561229457600080fd5b909250604085013590808211156122aa57600080fd5b506122b786828701611eb8565b9150509250925092565b6000602082840312156122d357600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8082018082111561138d5761138d612309565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361237c5761237c612309565b5060010190565b8181038181111561138d5761138d612309565b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff818336030181126123ca57600080fd5b9190910192915050565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe184360301811261240957600080fd5b83018035915067ffffffffffffffff82111561242457600080fd5b6020019150600681901b360382131561210657600080fd5b801515811461066957600080fd5b60006020828403121561245c57600080fd5b81356117828161243c565b60006020828403121561247957600080fd5b5051919050565b60005b8381101561249b578181015183820152602001612483565b50506000910152565b600082516123ca818460208701612480565b6000602082840312156124c857600080fd5b81516117828161243c565b60208152600082518060208401526124f2816040850160208701612480565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016919091016040019291505056fea26469706673582212208741166fc231fb271ff0e49a5c08c7b28e738ee0db40a45e26ac068eacf5e10464736f6c63430008110033"
    };
});
define("@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/Proxy.ts", ["require", "exports", "@ijstech/eth-contract", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/Proxy.json.ts"], function (require, exports, eth_contract_7, Proxy_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Proxy = void 0;
    class Proxy extends eth_contract_7.Contract {
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
    Proxy._abi = Proxy_json_1.default.abi;
    exports.Proxy = Proxy;
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
define("@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/ProxyV2.ts", ["require", "exports", "@ijstech/eth-contract", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/ProxyV2.json.ts"], function (require, exports, eth_contract_8, ProxyV2_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProxyV2 = void 0;
    class ProxyV2 extends eth_contract_8.Contract {
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
                amount: new eth_contract_8.BigNumber(result.amount),
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
                amount: new eth_contract_8.BigNumber(result.amount),
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
                amount: new eth_contract_8.BigNumber(result.amount),
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
                amount: new eth_contract_8.BigNumber(result.amount),
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
                amount: new eth_contract_8.BigNumber(result.amount),
                commissions: new eth_contract_8.BigNumber(result.commissions),
                _event: event
            };
        }
        assign() {
            let claimantIdCount_call = async (options) => {
                let result = await this.call('claimantIdCount', [], options);
                return new eth_contract_8.BigNumber(result);
            };
            this.claimantIdCount = claimantIdCount_call;
            let claimantIdsParams = (params) => [params.param1, params.param2];
            let claimantIds_call = async (params, options) => {
                let result = await this.call('claimantIds', claimantIdsParams(params), options);
                return new eth_contract_8.BigNumber(result);
            };
            this.claimantIds = claimantIds_call;
            let claimantsInfo_call = async (param1, options) => {
                let result = await this.call('claimantsInfo', [this.wallet.utils.toString(param1)], options);
                return {
                    claimant: result.claimant,
                    token: result.token,
                    balance: new eth_contract_8.BigNumber(result.balance)
                };
            };
            this.claimantsInfo = claimantsInfo_call;
            let getClaimantBalanceParams = (params) => [params.claimant, params.token];
            let getClaimantBalance_call = async (params, options) => {
                let result = await this.call('getClaimantBalance', getClaimantBalanceParams(params), options);
                return new eth_contract_8.BigNumber(result);
            };
            this.getClaimantBalance = getClaimantBalance_call;
            let getClaimantsInfoParams = (params) => [this.wallet.utils.toString(params.fromId), this.wallet.utils.toString(params.count)];
            let getClaimantsInfo_call = async (params, options) => {
                let result = await this.call('getClaimantsInfo', getClaimantsInfoParams(params), options);
                return (result.map(e => ({
                    claimant: e.claimant,
                    token: e.token,
                    balance: new eth_contract_8.BigNumber(e.balance)
                })));
            };
            this.getClaimantsInfo = getClaimantsInfo_call;
            let lastBalance_call = async (param1, options) => {
                let result = await this.call('lastBalance', [param1], options);
                return new eth_contract_8.BigNumber(result);
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
    ProxyV2._abi = ProxyV2_json_1.default.abi;
    exports.ProxyV2 = ProxyV2;
});
define("@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/ProxyV3.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/ProxyV3.json.ts'/> 
    exports.default = {
        "abi": [
            { "inputs": [{ "internalType": "uint24", "name": "_protocolRate", "type": "uint24" }], "stateMutability": "nonpayable", "type": "constructor" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "commission", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "commissionBalance", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "protocolFee", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "protocolFeeBalance", "type": "uint256" }], "name": "AddCommission", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "admin", "type": "address" }], "name": "AddProjectAdmin", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "user", "type": "address" }], "name": "Authorize", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Claim", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "ClaimProtocolFee", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "user", "type": "address" }], "name": "Deauthorize", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "campaignId", "type": "uint256" }], "name": "NewCampaign", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256" }], "name": "NewProject", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "admin", "type": "address" }], "name": "RemoveProjectAdmin", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint24", "name": "protocolRate", "type": "uint24" }], "name": "SetProtocolRate", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Skim", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "balance", "type": "uint256" }], "name": "Stake", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "user", "type": "address" }], "name": "StartOwnershipTransfer", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "TakeoverProjectOwnership", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "target", "type": "address" }, { "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TransferBack", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "target", "type": "address" }, { "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TransferForward", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "user", "type": "address" }], "name": "TransferOwnership", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "TransferProjectOwnership", "type": "event" },
            { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "balance", "type": "uint256" }], "name": "Unstake", "type": "event" },
            { "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "internalType": "address", "name": "admin", "type": "address" }], "name": "addProjectAdmin", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "contract IERC20", "name": "", "type": "address" }], "name": "campaignAccumulatedCommission", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "contract IERC20[]", "name": "tokens", "type": "address[]" }], "name": "claimMultiple", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "contract IERC20[]", "name": "tokens", "type": "address[]" }], "name": "claimMultipleProtocolFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }], "name": "claimProtocolFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [], "name": "claimantIdCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "contract IERC20", "name": "", "type": "address" }], "name": "claimantIds", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "claimantsInfo", "outputs": [{ "internalType": "address", "name": "claimant", "type": "address" }, { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "deny", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }, { "internalType": "bool", "name": "returnArrays", "type": "bool" }], "name": "getCampaign", "outputs": [{ "components": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "internalType": "uint24", "name": "maxInputTokensInEachCall", "type": "uint24" }, { "internalType": "uint24", "name": "maxOutputTokensInEachCall", "type": "uint24" }, { "internalType": "bool", "name": "referrersRequireApproval", "type": "bool" }, { "internalType": "uint64", "name": "startDate", "type": "uint64" }, { "internalType": "uint64", "name": "endDate", "type": "uint64" }, { "internalType": "bytes24[]", "name": "targetAndSelectors", "type": "bytes24[]" }, { "internalType": "bool", "name": "acceptAnyInToken", "type": "bool" }, { "internalType": "bool", "name": "acceptAnyOutToken", "type": "bool" }, { "internalType": "contract IERC20[]", "name": "inTokens", "type": "address[]" }, { "internalType": "bool[]", "name": "directTransferInToken", "type": "bool[]" }, { "components": [{ "internalType": "uint24", "name": "rate", "type": "uint24" }, { "internalType": "bool", "name": "feeOnProjectOwner", "type": "bool" }, { "internalType": "uint256", "name": "capPerTransaction", "type": "uint256" }, { "internalType": "uint256", "name": "capPerCampaign", "type": "uint256" }], "internalType": "struct ProxyV3.CommissionTokenConfig[]", "name": "commissionInTokenConfig", "type": "tuple[]" }, { "internalType": "contract IERC20[]", "name": "outTokens", "type": "address[]" }, { "components": [{ "internalType": "uint24", "name": "rate", "type": "uint24" }, { "internalType": "bool", "name": "feeOnProjectOwner", "type": "bool" }, { "internalType": "uint256", "name": "capPerTransaction", "type": "uint256" }, { "internalType": "uint256", "name": "capPerCampaign", "type": "uint256" }], "internalType": "struct ProxyV3.CommissionTokenConfig[]", "name": "commissionOutTokenConfig", "type": "tuple[]" }, { "internalType": "address[]", "name": "referrers", "type": "address[]" }], "internalType": "struct ProxyV3.CampaignParams", "name": "campaign", "type": "tuple" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }, { "internalType": "uint256", "name": "targetAndSelectorsStart", "type": "uint256" }, { "internalType": "uint256", "name": "targetAndSelectorsLength", "type": "uint256" }, { "internalType": "uint256", "name": "referrersStart", "type": "uint256" }, { "internalType": "uint256", "name": "referrersLength", "type": "uint256" }], "name": "getCampaignArrayData1", "outputs": [{ "internalType": "bytes24[]", "name": "targetAndSelectors", "type": "bytes24[]" }, { "internalType": "address[]", "name": "referrers", "type": "address[]" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }, { "internalType": "uint256", "name": "inTokensStart", "type": "uint256" }, { "internalType": "uint256", "name": "inTokensLength", "type": "uint256" }, { "internalType": "uint256", "name": "outTokensStart", "type": "uint256" }, { "internalType": "uint256", "name": "outTokensLength", "type": "uint256" }], "name": "getCampaignArrayData2", "outputs": [{ "internalType": "contract IERC20[]", "name": "inTokens", "type": "address[]" }, { "internalType": "bool[]", "name": "directTransferInToken", "type": "bool[]" }, { "components": [{ "internalType": "uint24", "name": "rate", "type": "uint24" }, { "internalType": "bool", "name": "feeOnProjectOwner", "type": "bool" }, { "internalType": "uint256", "name": "capPerTransaction", "type": "uint256" }, { "internalType": "uint256", "name": "capPerCampaign", "type": "uint256" }], "internalType": "struct ProxyV3.CommissionTokenConfig[]", "name": "commissionInTokenConfig", "type": "tuple[]" }, { "internalType": "contract IERC20[]", "name": "outTokens", "type": "address[]" }, { "components": [{ "internalType": "uint24", "name": "rate", "type": "uint24" }, { "internalType": "bool", "name": "feeOnProjectOwner", "type": "bool" }, { "internalType": "uint256", "name": "capPerTransaction", "type": "uint256" }, { "internalType": "uint256", "name": "capPerCampaign", "type": "uint256" }], "internalType": "struct ProxyV3.CommissionTokenConfig[]", "name": "commissionOutTokenConfig", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }], "name": "getCampaignArrayLength", "outputs": [{ "internalType": "uint256", "name": "targetAndSelectorsLength", "type": "uint256" }, { "internalType": "uint256", "name": "inTokensLength", "type": "uint256" }, { "internalType": "uint256", "name": "outTokensLength", "type": "uint256" }, { "internalType": "uint256", "name": "referrersLength", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "claimant", "type": "address" }, { "internalType": "contract IERC20", "name": "token", "type": "address" }], "name": "getClaimantBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "fromId", "type": "uint256" }, { "internalType": "uint256", "name": "count", "type": "uint256" }], "name": "getClaimantsInfo", "outputs": [{ "components": [{ "internalType": "address", "name": "claimant", "type": "address" }, { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }], "internalType": "struct ProxyV3.ClaimantInfo[]", "name": "claimantInfoList", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }], "name": "getProject", "outputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "newOwner", "type": "address" }, { "internalType": "address[]", "name": "projectAdmins", "type": "address[]" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }], "name": "getProjectAdminsLength", "outputs": [{ "internalType": "uint256", "name": "length", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isPermitted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "name": "lastBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "components": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "internalType": "uint24", "name": "maxInputTokensInEachCall", "type": "uint24" }, { "internalType": "uint24", "name": "maxOutputTokensInEachCall", "type": "uint24" }, { "internalType": "bool", "name": "referrersRequireApproval", "type": "bool" }, { "internalType": "uint64", "name": "startDate", "type": "uint64" }, { "internalType": "uint64", "name": "endDate", "type": "uint64" }, { "internalType": "bytes24[]", "name": "targetAndSelectors", "type": "bytes24[]" }, { "internalType": "bool", "name": "acceptAnyInToken", "type": "bool" }, { "internalType": "bool", "name": "acceptAnyOutToken", "type": "bool" }, { "internalType": "contract IERC20[]", "name": "inTokens", "type": "address[]" }, { "internalType": "bool[]", "name": "directTransferInToken", "type": "bool[]" }, { "components": [{ "internalType": "uint24", "name": "rate", "type": "uint24" }, { "internalType": "bool", "name": "feeOnProjectOwner", "type": "bool" }, { "internalType": "uint256", "name": "capPerTransaction", "type": "uint256" }, { "internalType": "uint256", "name": "capPerCampaign", "type": "uint256" }], "internalType": "struct ProxyV3.CommissionTokenConfig[]", "name": "commissionInTokenConfig", "type": "tuple[]" }, { "internalType": "contract IERC20[]", "name": "outTokens", "type": "address[]" }, { "components": [{ "internalType": "uint24", "name": "rate", "type": "uint24" }, { "internalType": "bool", "name": "feeOnProjectOwner", "type": "bool" }, { "internalType": "uint256", "name": "capPerTransaction", "type": "uint256" }, { "internalType": "uint256", "name": "capPerCampaign", "type": "uint256" }], "internalType": "struct ProxyV3.CommissionTokenConfig[]", "name": "commissionOutTokenConfig", "type": "tuple[]" }, { "internalType": "address[]", "name": "referrers", "type": "address[]" }], "internalType": "struct ProxyV3.CampaignParams", "name": "params", "type": "tuple" }], "name": "newCampaign", "outputs": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [], "name": "newOwner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address[]", "name": "admins", "type": "address[]" }], "name": "newProject", "outputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "permit", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "name": "protocolFeeBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "protocolRate", "outputs": [{ "internalType": "uint24", "name": "", "type": "uint24" }], "stateMutability": "view", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }, { "internalType": "address", "name": "target", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "address", "name": "referrer", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "components": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "internalType": "struct ProxyV3.TokensIn[]", "name": "tokensIn", "type": "tuple[]" }, { "internalType": "contract IERC20[]", "name": "tokensOut", "type": "address[]" }], "name": "proxyCall", "outputs": [], "stateMutability": "payable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "internalType": "address", "name": "admin", "type": "address" }], "name": "removeProjectAdmin", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "uint24", "name": "newRate", "type": "uint24" }], "name": "setProtocolRate", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "contract IERC20[]", "name": "tokens", "type": "address[]" }], "name": "skim", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }], "name": "stakeETH", "outputs": [], "stateMutability": "payable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "internalType": "contract IERC20[]", "name": "token", "type": "address[]" }, { "internalType": "uint256[]", "name": "amount", "type": "uint256[]" }], "name": "stakeMultiple", "outputs": [], "stateMutability": "payable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "contract IERC20", "name": "", "type": "address" }], "name": "stakesBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
            { "inputs": [], "name": "takeOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }], "name": "takeoverProjectOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "address", "name": "newOwner_", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferProjectOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "unstake", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }], "name": "unstakeETH", "outputs": [], "stateMutability": "payable", "type": "function" },
            { "inputs": [{ "internalType": "uint256", "name": "projectId", "type": "uint256" }, { "internalType": "contract IERC20[]", "name": "token", "type": "address[]" }, { "internalType": "uint256[]", "name": "amount", "type": "uint256[]" }], "name": "unstakeMultiple", "outputs": [], "stateMutability": "payable", "type": "function" },
            { "stateMutability": "payable", "type": "receive" }
        ],
        "bytecode": "60806040523480156200001157600080fd5b5060405162005dd938038062005dd9833981016040819052620000349162000097565b600080546001600160a01b031916331790556003805462ffffff831662ffffff1990911681179091556040519081527ffe25e86988ec652fe5401545da69d35d6d22e8bcf8632c423f273264a656d22f9060200160405180910390a150620000c5565b600060208284031215620000aa57600080fd5b815162ffffff81168114620000be57600080fd5b9392505050565b615d0480620000d56000396000f3fe6080604052600436106102d55760003560e01c806399dd156611610179578063d3b7d4c3116100d6578063f0f3f2c81161008a578063f9492ad311610064578063f9492ad3146108bc578063f9738d42146108f4578063fec3e5531461091457600080fd5b8063f0f3f2c81461084d578063f2fde38b1461087c578063f303ad6e1461089c57600080fd5b8063dfecbd8e116100bb578063dfecbd8e146107d3578063e5e05bd7146107f3578063ee42d3a31461082057600080fd5b8063d3b7d4c314610793578063d4ee1d90146107b357600080fd5b8063b0d36ce81161012d578063b60c164c11610112578063b60c164c146106d7578063d224d9ec146106f7578063d2ef84641461072457600080fd5b8063b0d36ce8146106ae578063b316d714146106c157600080fd5b8063a2f55ae51161015e578063a2f55ae51461064e578063a5184fbf1461066e578063a8d369ff1461068e57600080fd5b806399dd1566146105fe5780639c52a7f11461062e57600080fd5b80633fd8cc4e116102325780636e9c931c116101e657806383e40a51116101c057806383e40a511461055657806384fee38e1461058e5780638da5cb5b146105c657600080fd5b80636e9c931c146105035780636ecc20da146105235780637eb140341461053657600080fd5b806351a7c7161161021757806351a7c716146104bb57806360536172146104db57806362d53403146104f057600080fd5b80633fd8cc4e1461044d5780634d3c5da11461048d57600080fd5b80631e83409a1161028957806332e879c71161026e57806332e879c7146103fa578063368e98521461041a5780633a8c874f1461043a57600080fd5b80631e83409a146103c7578063202c0cee146103e757600080fd5b806311e9ff02116102ba57806311e9ff021461033a5780631333af521461037a578063188ff72b1461039a57600080fd5b80630455f177146102e1578063068c53911461031857600080fd5b366102dc57005b600080fd5b3480156102ed57600080fd5b506103016102fc366004614e1d565b610945565b60405161030f929190614e9c565b60405180910390f35b34801561032457600080fd5b50610338610333366004614f3a565b610b85565b005b34801561034657600080fd5b5061035a610355366004614f6a565b610c1e565b60408051948552602085019390935291830152606082015260800161030f565b34801561038657600080fd5b50610338610395366004614f94565b610c6e565b3480156103a657600080fd5b506103ba6103b5366004614fb1565b610cd7565b60405161030f9190614fd3565b3480156103d357600080fd5b506103386103e2366004615038565b610e78565b6103386103f536600461521c565b610e84565b34801561040657600080fd5b506103386104153660046153a1565b61199e565b34801561042657600080fd5b50610338610435366004614f3a565b611a08565b6103386104483660046153e3565b611a97565b34801561045957600080fd5b5061047d610468366004615038565b60026020526000908152604090205460ff1681565b604051901515815260200161030f565b34801561049957600080fd5b506104ad6104a8366004614f6a565b611b5e565b60405190815260200161030f565b3480156104c757600080fd5b506103386104d636600461545d565b611b8d565b3480156104e757600080fd5b50610338611b98565b6103386104fe366004614f6a565b611c8e565b34801561050f57600080fd5b5061033861051e36600461545d565b611c9a565b610338610531366004614f6a565b611ca5565b34801561054257600080fd5b50610338610551366004614f6a565b611cb1565b34801561056257600080fd5b506104ad610571366004615495565b600d60209081526000928352604080842090915290825290205481565b34801561059a57600080fd5b506104ad6105a9366004614f3a565b600960209081526000928352604080842090915290825290205481565b3480156105d257600080fd5b506000546105e6906001600160a01b031681565b6040516001600160a01b03909116815260200161030f565b34801561060a57600080fd5b5060035461061a9062ffffff1681565b60405162ffffff909116815260200161030f565b34801561063a57600080fd5b50610338610649366004615038565b611dd5565b34801561065a57600080fd5b50610338610669366004615038565b611e5b565b34801561067a57600080fd5b506104ad6106893660046153a1565b611ee4565b34801561069a57600080fd5b506104ad6106a93660046154c3565b612043565b6103386106bc3660046153e3565b6129cc565b3480156106cd57600080fd5b506104ad600b5481565b3480156106e357600080fd5b506103386106f23660046153a1565b612a78565b34801561070357600080fd5b5061071761071236600461550d565b612c19565b60405161030f919061560d565b34801561073057600080fd5b5061076d61073f366004614f6a565b600c602052600090815260409020805460018201546002909201546001600160a01b03918216929091169083565b604080516001600160a01b0394851681529390921660208401529082015260600161030f565b34801561079f57600080fd5b506104ad6107ae366004615495565b613277565b3480156107bf57600080fd5b506001546105e6906001600160a01b031681565b3480156107df57600080fd5b506103386107ee366004614f3a565b6132b1565b3480156107ff57600080fd5b506104ad61080e366004615038565b60046020526000908152604090205481565b34801561082c57600080fd5b506104ad61083b366004615038565b60056020526000908152604090205481565b34801561085957600080fd5b5061086d610868366004614f6a565b6133a4565b60405161030f9392919061579a565b34801561088857600080fd5b50610338610897366004615038565b613494565b3480156108a857600080fd5b506103386108b73660046153a1565b613511565b3480156108c857600080fd5b506104ad6108d7366004614f3a565b600a60209081526000928352604080842090915290825290205481565b34801561090057600080fd5b5061033861090f366004615038565b61355e565b34801561092057600080fd5b5061093461092f366004614e1d565b61357e565b60405161030f9594939291906157cf565b60608060006007888154811061095d5761095d61583c565b90600052602060002090600c020190506000816002018054905088111561098657600282015497505b6002820154610995888a61589a565b11156109ae5760028201546109ab9089906158ad565b96505b8667ffffffffffffffff8111156109c7576109c7615055565b6040519080825280602002602001820160405280156109f0578160200160208202803683370190505b5093505b86811015610a7d5760028201610a0a898361589a565b81548110610a1a57610a1a61583c565b9060005260206000200160009054906101000a900460401b848281518110610a4457610a4461583c565b7fffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000909216602092830291909101909101526001016109f4565b50600a810154600090861115610a9557600a82015495505b600a820154610aa4868861589a565b1115610abd57600a820154610aba9087906158ad565b94505b8467ffffffffffffffff811115610ad657610ad6615055565b604051908082528060200260200182016040528015610aff578160200160208202803683370190505b5092505b84811015610b7957600a8201610b19878361589a565b81548110610b2957610b2961583c565b9060005260206000200160009054906101000a90046001600160a01b0316838281518110610b5957610b5961583c565b6001600160a01b0390921660209283029190910190910152600101610b03565b50509550959350505050565b600060068381548110610b9a57610b9a61583c565b6000918252602090912060049091020160018101549091506001600160a01b03163314610c0e5760405162461bcd60e51b815260206004820152600e60248201527f6e6f742066726f6d206f776e657200000000000000000000000000000000000060448201526064015b60405180910390fd5b610c19838284613ac0565b505050565b600080600080600060078681548110610c3957610c3961583c565b60009182526020909120600c90910201600281015460058201546006830154600a909301549199909850919650945092505050565b600380547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000001662ffffff83169081179091556040519081527ffe25e86988ec652fe5401545da69d35d6d22e8bcf8632c423f273264a656d22f906020015b60405180910390a150565b6060600083118015610ceb5750600b548311155b610d375760405162461bcd60e51b815260206004820152600d60248201527f6f7574206f6620626f756e6473000000000000000000000000000000000000006044820152606401610c05565b600083600b54610d4791906158ad565b610d5290600161589a565b905080831115610d60578092505b8267ffffffffffffffff811115610d7957610d79615055565b604051908082528060200260200182016040528015610de257816020015b60408051606081018252600080825260208083018290529282015282527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff909201910181610d975790505b5091508360005b84811015610e6f576000828152600c6020908152604091829020825160608101845281546001600160a01b0390811682526001830154169281019290925260020154918101919091528451859083908110610e4657610e4661583c565b602002602001018190525081610e5b906158c0565b915080610e67816158c0565b915050610de9565b50505092915050565b610e8181613b94565b50565b6007548710610ed55760405162461bcd60e51b815260206004820152601060248201527f696e76616c69642063616d706169676e000000000000000000000000000000006044820152606401610c05565b600060078881548110610eea57610eea61583c565b90600052602060002090600c020190508060030160008888610f0b906158f8565b60405160609290921b7fffffffffffffffffffffffffffffffffffffffff0000000000000000000000001660208301527fffffffff00000000000000000000000000000000000000000000000000000000166034820152603801604051602081830303815290604052610f7d90615948565b7fffffffffffffffffffffffffffffffffffffffffffffffff000000000000000016815260208101919091526040016000205460ff16610fff5760405162461bcd60e51b815260206004820152601460248201527f73656c6563746f72206e6f74206d6174636865640000000000000000000000006044820152606401610c05565b60018101544267010000000000000090910467ffffffffffffffff161180159061104a575060018101546f01000000000000000000000000000000900467ffffffffffffffff164211155b6110bc5760405162461bcd60e51b815260206004820152602860248201527f63616d706169676e206e6f74207374617274656420796574202f20616c72656160448201527f647920656e6465640000000000000000000000000000000000000000000000006064820152608401610c05565b60018101546601000000000000900460ff16158061112c5750600a8101541580159061112c57506001600160a01b0385166000818152600b83016020526040902054600a8301805490919081106111155761111561583c565b6000918252602090912001546001600160a01b0316145b6111785760405162461bcd60e51b815260206004820152600e60248201527f6e6f7420612072656665727265720000000000000000000000000000000000006044820152606401610c05565b825160018201546000919062ffffff168111156111d75760405162461bcd60e51b815260206004820152601760248201527f696e546f6b656e206c656e6774682065786365656465640000000000000000006044820152606401610c05565b60005b818110156114cb5760008682815181106111f6576111f661583c565b6020026020010151600001519050600082111561129557866112196001846158ad565b815181106112295761122961583c565b6020026020010151600001516001600160a01b0316816001600160a01b0316116112955760405162461bcd60e51b815260206004820152601f60248201527f696e20746f6b656e206e6f7420696e20617363656e64696e67206f72646572006044820152606401610c05565b600485015460ff16611325576001600160a01b03811660009081526008860160205260409020805462ffffff161515806112d7575080546301000000900460ff165b6113235760405162461bcd60e51b815260206004820152601660248201527f6e6f7420616e20616363657074656420746f6b656e73000000000000000000006044820152606401610c05565b505b60008783815181106113395761133961583c565b602002602001015160200151905060006001600160a01b0316826001600160a01b0316036114065784156113af5760405162461bcd60e51b815260206004820152601a60248201527f6d6f7265207468616e206f6e6520455448207472616e736665720000000000006044820152606401610c05565b8034146113fe5760405162461bcd60e51b815260206004820152601660248201527f45544820616d6f756e74206e6f74206d617463686564000000000000000000006044820152606401610c05565b809450611478565b6001600160a01b038216600090815260078701602052604090205460ff16156114435761143e6001600160a01b038316338e84613c8a565b611478565b61144d8282613d59565b90506114646001600160a01b0383168d6000613e88565b6114786001600160a01b0383168d83613e88565b60408051338152602081018390526001600160a01b0380851692908f16917fbe526fefdf314c4faee4a30e01b840fe0c1517bd7fc9295829eb6d8441e80b18910160405180910390a350506001016111da565b6000808a518b602001868e5af1806000036114ea573d6000803e3d6000fd5b5050835160018401549092506301000000900462ffffff1682111590506115535760405162461bcd60e51b815260206004820152601860248201527f6f7574546f6b656e206c656e67746820657863656564656400000000000000006044820152606401610c05565b6000805b828210156119485760008583815181106115735761157361583c565b60200260200101519050600083111561160a57856115926001856158ad565b815181106115a2576115a261583c565b60200260200101516001600160a01b0316816001600160a01b03161161160a5760405162461bcd60e51b815260206004820152601f60248201527f696e20746f6b656e206e6f7420696e20617363656e64696e67206f72646572006044820152606401610c05565b6004850154610100900460ff1661169f576001600160a01b03811660009081526009860160205260409020805462ffffff16151580611651575080546301000000900460ff165b61169d5760405162461bcd60e51b815260206004820152601660248201527f6e6f7420616e20616363657074656420746f6b656e73000000000000000000006044820152606401610c05565b505b60006001600160a01b0382166116f5576000805260056020527f05b8ccbb9d4d8fb16ea74ce3c29a41f1b461fbdaff4714a0d9a8eb05499746bc546116e490476158ad565b90506116f08982613fd6565b6117a8565b6001600160a01b038216600081815260056020526040908190205490517f70a082310000000000000000000000000000000000000000000000000000000081523060048201529091906370a0823190602401602060405180830381865afa158015611764573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117889190615994565b61179291906158ad565b90506117a86001600160a01b0383168a83614093565b8751831080156117e65750816001600160a01b03168884815181106117cf576117cf61583c565b6020026020010151600001516001600160a01b0316105b1561183f57611834868e8c60018c88815181106118055761180561583c565b6020026020010151600001518d89815181106118235761182361583c565b6020026020010151602001516140dc565b6001909201916117a8565b87518310801561187d5750816001600160a01b03168884815181106118665761186661583c565b6020026020010151600001516001600160a01b0316145b156118e1576118d6868e8c60018c888151811061189c5761189c61583c565b602002602001015160000151868e8a815181106118bb576118bb61583c565b6020026020010151602001516118d191906158ad565b6140dc565b6001909201916118f0565b6118f0868e8c600086866140dc565b604080516001600160a01b038b811682526020820184905280851692908f16917fc2534859c9972270c16d5b4255d200f9a0385f9a6ce3add96c0427ff9fc70f93910160405180910390a35050600190910190611557565b855181101561199157611989848c8a60018a868151811061196b5761196b61583c565b6020026020010151600001518b87815181106118235761182361583c565b600101611948565b5050503d6000803e3d6000f35b6000546001600160a01b031633146119b557600080fd5b8060005b81811015611a02576119f08484838181106119d6576119d661583c565b90506020020160208101906119eb9190615038565b614548565b806119fa816158c0565b9150506119b9565b50505050565b600060068381548110611a1d57611a1d61583c565b6000918252602090912060049091020160018101549091506001600160a01b03163314611a8c5760405162461bcd60e51b815260206004820152600e60248201527f6e6f742066726f6d206f776e65720000000000000000000000000000000000006044820152606401610c05565b610c198382846145f2565b82818114611ae75760405162461bcd60e51b815260206004820152601260248201527f6c656e677468206e6f74206d61746368656400000000000000000000000000006044820152606401610c05565b60005b81811015611b4357611b3b87878784818110611b0857611b0861583c565b9050602002016020810190611b1d9190615038565b868685818110611b2f57611b2f61583c565b905060200201356147fd565b600101611aea565b3415611b5557611b55876000346147fd565b50505050505050565b600060068281548110611b7357611b7361583c565b600091825260209091206002600490920201015492915050565b610c198383836148df565b6001546001600160a01b03163314611c185760405162461bcd60e51b815260206004820152602960248201527f416374696f6e20706572666f726d656420627920756e617574686f72697a656460448201527f20616464726573732e00000000000000000000000000000000000000000000006064820152608401610c05565b60018054600080546001600160a01b0383167fffffffffffffffffffffffff000000000000000000000000000000000000000091821681179092559091169091556040519081527fcfaaa26691e16e66e73290fc725eee1a6b4e0e693a1640484937aac25ffb55a49060200160405180910390a1565b610e81816000346148df565b610c198383836147fd565b610e81816000346147fd565b600060068281548110611cc657611cc661583c565b6000918252602090912060049091020160018101549091506001600160a01b03163314611d355760405162461bcd60e51b815260206004820152600e60248201527f6e6f742066726f6d206f776e65720000000000000000000000000000000000006044820152606401610c05565b8054611d4d90839083906001600160a01b03166145f2565b80547fffffffffffffffffffffffff0000000000000000000000000000000000000000908116331782556001808301805490921690915554611d9b90839083906001600160a01b0316613ac0565b60405133815282907fcae10d66f75f577faa75ec3d290ee81497368211d6817451dae38673b5ccf992906020015b60405180910390a25050565b6000546001600160a01b03163314611dec57600080fd5b6001600160a01b03811660008181526002602090815260409182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905590519182527f79ede3839cd7a7d8bd77e97e5c890565fe4f76cdbbeaa364646e28a8695a78849101610ccc565b6000546001600160a01b03163314611e7257600080fd5b6001600160a01b03811660008181526002602090815260409182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016600117905590519182527f6d81a01b39982517ba331aeb4f387b0f9cc32334b65bb9a343a077973cf7adf59101610ccc565b6006805460018101808355600083815291929083908110611f0757611f0761583c565b60009182526020808320600490920290910180547fffffffffffffffffffffffff00000000000000000000000000000000000000009081163390811783556002830180546001810182559086528486200180549092168117909155835260038101909152604082208290559150835b8082101561200f576000868684818110611f9257611f9261583c565b9050602002016020810190611fa79190615038565b600285018054600181810183556000928352602080842090920180546001600160a01b039095167fffffffffffffffffffffffff0000000000000000000000000000000000000000909516851790559282526003870190526040902093019283905550611f76565b60405184907fd78a25afe0b6160e2dc1fc71b2845c76cc268398d17be04665b78ba59b47440790600090a250505092915050565b6006546000908235106120985760405162461bcd60e51b815260206004820152601160248201527f496e76616c69642070726f6a65637449640000000000000000000000000000006044820152606401610c05565b600060068360000135815481106120b1576120b161583c565b60009182526020808320338085526004939093020160038101909152604090922054600283018054939450919281106120ec576120ec61583c565b6000918252602090912001546001600160a01b03161461214e5760405162461bcd60e51b815260206004820152601360248201527f6e6f7420612070726f6a6563742061646d696e000000000000000000000000006044820152606401610c05565b61215e60c0840160a085016159ad565b67ffffffffffffffff1661217860a08501608086016159ad565b67ffffffffffffffff1611156121d05760405162461bcd60e51b815260206004820152601560248201527f696e76616c69642063616d706169676e206461746500000000000000000000006044820152606401610c05565b600780548435600090815260086020908152604082208054600181810183559184529183209091018390558354018084558382529194509190849081106122195761221961583c565b60009182526020918290208635600c9092020190815591506122419060408601908601614f94565b6001820180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000001662ffffff929092169190911790556122876060850160408601614f94565b60018201805462ffffff929092166301000000027fffffffffffffffffffffffffffffffffffffffffffffffffffff000000ffffff9092169190911790556122d560808501606086016159d7565b6001820180549115156601000000000000027fffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffff90921691909117905561232160a08501608086016159ad565b60018201805467ffffffffffffffff92909216670100000000000000027fffffffffffffffffffffffffffffffffff0000000000000000ffffffffffffff90921691909117905561237860c0850160a086016159ad565b60018201805467ffffffffffffffff929092166f01000000000000000000000000000000027fffffffffffffffffff0000000000000000ffffffffffffffffffffffffffffff9092169190911790556000806123d760c08701876159f4565b91506123e8905060c08701876159f4565b6123f6916002860191614d28565b505b808210156124a557600160038401600061241560c08a018a6159f4565b868181106124255761242561583c565b905060200201602081019061243a9190615a5c565b7fffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000168152602081019190915260400160002080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055600191909101906123f8565b6124b6610100870160e088016159d7565b6004840180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169115159190911790556124f9610120870161010088016159d7565b600484018054911515610100027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff909216919091179055600091506125426101208701876159f4565b915061255490506101408701876159f4565b905081148015612572575061256d610160870187615a9e565b905081145b6125e45760405162461bcd60e51b815260206004820152602260248201527f696e20746f6b656e20636f6e666967206c656e677468206e6f74206d6174636860448201527f65640000000000000000000000000000000000000000000000000000000000006064820152608401610c05565b6125f26101208701876159f4565b612600916005860191614d9d565b505b8082101561274c576126186101408701876159f4565b838181106126285761262861583c565b905060200201602081019061263d91906159d7565b6007840160006126516101208a018a6159f4565b868181106126615761266161583c565b90506020020160208101906126769190615038565b6001600160a01b03168152602081019190915260400160002080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169115159190911790556126ca610160870187615a9e565b838181106126da576126da61583c565b905060800201836008016000888061012001906126f791906159f4565b868181106127075761270761583c565b905060200201602081019061271c9190615038565b6001600160a01b03168152602081019190915260400160002061273f8282615b06565b5050600190910190612602565b6000915061275e6101808701876159f4565b915061277090506101a0870187615a9e565b905081146127e65760405162461bcd60e51b815260206004820152602360248201527f6f757420746f6b656e20636f6e666967206c656e677468206e6f74206d61746360448201527f68656400000000000000000000000000000000000000000000000000000000006064820152608401610c05565b6127f46101808701876159f4565b612802916006860191614d9d565b505b8082101561289c5761281a6101a0870187615a9e565b8381811061282a5761282a61583c565b9050608002018360090160008880610180019061284791906159f4565b868181106128575761285761583c565b905060200201602081019061286c9190615038565b6001600160a01b03168152602081019190915260400160002061288f8282615b06565b5050600190910190612804565b600091506128ae6101c08701876159f4565b9150508015156128c460808801606089016159d7565b1515146129135760405162461bcd60e51b815260206004820152601860248201527f696e76616c696420726566657272657273206c656e67746800000000000000006044820152606401610c05565b6129216101c08701876159f4565b61292f91600a860191614d9d565b505b808210156129985781600b8401600061294e6101c08a018a6159f4565b8681811061295e5761295e61583c565b90506020020160208101906129739190615038565b6001600160a01b03168152602081019190915260400160002055600190910190612931565b60405185907ff91d5ca55c5415a1aa70a5dfde98765e180ec8b56375e3de9149ee89efc28f9d90600090a250505050919050565b82818114612a1c5760405162461bcd60e51b815260206004820152601260248201527f6c656e677468206e6f74206d61746368656400000000000000000000000000006044820152606401610c05565b60005b81811015611b5557612a7087878784818110612a3d57612a3d61583c565b9050602002016020810190612a529190615038565b868685818110612a6457612a6461583c565b905060200201356148df565b600101612a1f565b8060005b81811015611a0257600080858584818110612a9957612a9961583c565b9050602002016020810190612aae9190615038565b90506001600160a01b038116612b07576000805260056020527f05b8ccbb9d4d8fb16ea74ce3c29a41f1b461fbdaff4714a0d9a8eb05499746bc54479250612af690836158ad565b9150612b023383613fd6565b612bc4565b6040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526001600160a01b038216906370a0823190602401602060405180830381865afa158015612b64573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612b889190615994565b6001600160a01b038216600090815260056020526040902054909250612bae90836158ad565b9150612bc46001600160a01b0382163384614093565b60405182815233906001600160a01b038316907f2ae72b44f59d038340fca5739135a1d51fc5ab720bb02d983e4c5ff4119ca7b89060200160405180910390a350508080612c11906158c0565b915050612a7c565b612cb6604051806101e0016040528060008152602001600062ffffff168152602001600062ffffff168152602001600015158152602001600067ffffffffffffffff168152602001600067ffffffffffffffff168152602001606081526020016000151581526020016000151581526020016060815260200160608152602001606081526020016060815260200160608152602001606081525090565b600060078481548110612ccb57612ccb61583c565b6000918252602091829020600c9091020180548452600181015462ffffff8082169386019390935263010000008104909216604085015260ff6601000000000000830481161515606086015267ffffffffffffffff6701000000000000008404811660808701526f0100000000000000000000000000000090930490921660a08501526004810154808316151560e086015261010090819004909216151591840191909152905082156132705780600201805480602002602001604051908101604052809291908181526020018280548015612dec57602002820191906000526020600020905b815460401b7fffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000168152600190910190602001808311612db2575b505050505060c08301526005810180546040805160208084028201810190925282815260009390918390830182828015612e4f57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311612e31575b50505050508461012001819052508067ffffffffffffffff811115612e7657612e76615055565b604051908082528060200260200182016040528015612e9f578160200160208202803683370190505b506101408501528067ffffffffffffffff811115612ebf57612ebf615055565b604051908082528060200260200182016040528015612f2f57816020015b6040805160808101825260008082526020808301829052928201819052606082015282527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff909201910181612edd5790505b506101608501525b8082101561305a57826007016000846005018481548110612f5a57612f5a61583c565b60009182526020808320909101546001600160a01b03168352820192909252604001902054610140850151805160ff9092169184908110612f9d57612f9d61583c565b602002602001019015159081151581525050826008016000846005018481548110612fca57612fca61583c565b60009182526020808320909101546001600160a01b0316835282810193909352604091820190208151608081018352815462ffffff8116825260ff6301000000909104161515938101939093526001810154918301919091526002015460608201526101608501518051849081106130445761304461583c565b6020908102919091010152600190910190612f37565b505060068101805460408051602080840282018101909252828152600093909183908301828280156130b557602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311613097575b50505050508461018001819052508067ffffffffffffffff8111156130dc576130dc615055565b60405190808252806020026020018201604052801561314c57816020015b6040805160808101825260008082526020808301829052928201819052606082015282527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9092019101816130fa5790505b506101a08501525b80821015613207578260090160008460060184815481106131775761317761583c565b60009182526020808320909101546001600160a01b0316835282810193909352604091820190208151608081018352815462ffffff8116825260ff6301000000909104161515938101939093526001810154918301919091526002015460608201526101a08501518051849081106131f1576131f161583c565b6020908102919091010152600190910190613154565b82600a0180548060200260200160405190810160405280929190818152602001828054801561325f57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311613241575b5050505050846101c0018190525050505b5092915050565b6001600160a01b038083166000908152600d602090815260408083209385168352928152828220548252600c905220600201545b92915050565b6000600683815481106132c6576132c661583c565b6000918252602090912060049091020180549091506001600160a01b031633146133325760405162461bcd60e51b815260206004820152600e60248201527f6e6f742066726f6d206f776e65720000000000000000000000000000000000006044820152606401610c05565b6001810180547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b03841690811790915560405190815283907fd76f6b3fb9ea3802f0403d54d37db427cea79df08cd8817552eb23790d2b54919060200160405180910390a2505050565b60008060606000600685815481106133be576133be61583c565b600091825260209091206004909102018054600182015460028301546001600160a01b0392831697509116945090915067ffffffffffffffff81111561340657613406615055565b60405190808252806020026020018201604052801561342f578160200160208202803683370190505b506002820180546040805160208084028201810190925282815293955083018282801561348557602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311613467575b50505050509150509193909250565b6000546001600160a01b031633146134ab57600080fd5b600180547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0383169081179091556040519081527f686a7ab184e6928ddedba810af7b443d6baa40bf32c4787ccd72c5b4b28cae1b90602001610ccc565b8060005b81811015611a025761354c8484838181106135325761353261583c565b90506020020160208101906135479190615038565b613b94565b80613556816158c0565b915050613515565b6000546001600160a01b0316331461357557600080fd5b610e8181614548565b6060806060806060600060078b8154811061359b5761359b61583c565b90600052602060002090600c02019050600081600501805490508b11156135c45760058201549a505b60058201546135d38b8d61589a565b11156135ec5760058201546135e9908c906158ad565b99505b8967ffffffffffffffff81111561360557613605615055565b60405190808252806020026020018201604052801561362e578160200160208202803683370190505b5096508967ffffffffffffffff81111561364a5761364a615055565b604051908082528060200260200182016040528015613673578160200160208202803683370190505b5095508967ffffffffffffffff81111561368f5761368f615055565b6040519080825280602002602001820160405280156136ff57816020015b6040805160808101825260008082526020808301829052928201819052606082015282527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9092019101816136ad5790505b5094505b8981101561388a57600582016137198c8361589a565b815481106137295761372961583c565b9060005260206000200160009054906101000a90046001600160a01b03168782815181106137595761375961583c565b60200260200101906001600160a01b031690816001600160a01b0316815250508160070160008883815181106137915761379161583c565b60200260200101516001600160a01b03166001600160a01b0316815260200190815260200160002060009054906101000a900460ff168682815181106137d9576137d961583c565b6020026020010190151590811515815250508160080160008883815181106138035761380361583c565b6020908102919091018101516001600160a01b031682528181019290925260409081016000208151608081018352815462ffffff811682526301000000900460ff1615159381019390935260018101549183019190915260020154606082015285518690839081106138775761387761583c565b6020908102919091010152600101613703565b5060068101546000908911156138a257600682015498505b60068201546138b1898b61589a565b11156138ca5760068201546138c7908a906158ad565b97505b8767ffffffffffffffff8111156138e3576138e3615055565b60405190808252806020026020018201604052801561390c578160200160208202803683370190505b5093508767ffffffffffffffff81111561392857613928615055565b60405190808252806020026020018201604052801561399857816020015b6040805160808101825260008082526020808301829052928201819052606082015282527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9092019101816139465790505b5092505b87811015613ab157600682016139b28a8361589a565b815481106139c2576139c261583c565b9060005260206000200160009054906101000a90046001600160a01b03168482815181106139f2576139f261583c565b60200260200101906001600160a01b031690816001600160a01b031681525050816009016000858381518110613a2a57613a2a61583c565b6020908102919091018101516001600160a01b031682528181019290925260409081016000208151608081018352815462ffffff811682526301000000900460ff161515938101939093526001810154918301919091526002015460608201528351849083908110613a9e57613a9e61583c565b602090810291909101015260010161399c565b50509550955095509550959050565b6001600160a01b03811660008181526003840160205260409020546002840180549091908110613af257613af261583c565b6000918252602090912001546001600160a01b031614610c19576002820180546001600160a01b03831660008181526003860160209081526040808320859055600185018655948252812090920180547fffffffffffffffffffffffff00000000000000000000000000000000000000001682179055915185917f1c3cea70d3dcea4dc82722f4fb7300d19f76e272a8349e73a99780429f2c151691a3505050565b336000908152600d602090815260408083206001600160a01b0385811680865291845282852054808652600c85528386208451606081018652815484168152600182015490931683870152600201805483860181905290879055928652600590945291842080549394929391928392613c0e9084906158ad565b90915550506001600160a01b038416613c3057613c2b3382613fd6565b613c44565b613c446001600160a01b0385163383614093565b6040518181526001600160a01b0385169033907f70eb43c4a8ae8c40502dcf22436c509c28d6ff421cf07c491be56984bd9870689060200160405180910390a350505050565b6040516001600160a01b0380851660248301528316604482015260648101829052611a029085907f23b872dd00000000000000000000000000000000000000000000000000000000906084015b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152614a9c565b6040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526000906001600160a01b038416906370a0823190602401602060405180830381865afa158015613db9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613ddd9190615994565b9050613df46001600160a01b038416333085613c8a565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015281906001600160a01b038516906370a0823190602401602060405180830381865afa158015613e53573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613e779190615994565b613e8191906158ad565b9392505050565b801580613f1b57506040517fdd62ed3e0000000000000000000000000000000000000000000000000000000081523060048201526001600160a01b03838116602483015284169063dd62ed3e90604401602060405180830381865afa158015613ef5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190613f199190615994565b155b613f8d5760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527f20746f206e6f6e2d7a65726f20616c6c6f77616e6365000000000000000000006064820152608401610c05565b6040516001600160a01b038316602482015260448101829052610c199084907f095ea7b30000000000000000000000000000000000000000000000000000000090606401613cd7565b604080516000808252602082019092526001600160a01b0384169083906040516140009190615bc3565b60006040518083038185875af1925050503d806000811461403d576040519150601f19603f3d011682016040523d82523d6000602084013e614042565b606091505b5050905080610c195760405162461bcd60e51b815260206004820152601360248201527f4554485f5452414e534645525f4641494c4544000000000000000000000000006044820152606401610c05565b6040516001600160a01b038316602482015260448101829052610c199084907fa9059cbb0000000000000000000000000000000000000000000000000000000090606401613cd7565b600083614102576001600160a01b0383166000908152600988016020526040902061411d565b6001600160a01b038316600090815260088801602052604090205b805490915062ffffff1615611b555786548154620f4240906141449062ffffff1685615bdf565b61414e9190615bf6565b925081600101548311156141a45760405162461bcd60e51b815260206004820152600c60248201527f63617020657863656564656400000000000000000000000000000000000000006044820152606401610c05565b600354600090620f4240906141be9062ffffff1686615bdf565b6141c89190615bf6565b6001600160a01b0386166000908152600460205260408120805492935083929091906141f590849061589a565b9091555050825460009081906301000000900460ff16156142245785915061421d838361589a565b9050614234565b61422e83876158ad565b91508590505b60008481526009602090815260408083206001600160a01b038b1684529091529020548111156142a65760405162461bcd60e51b815260206004820152601560248201527f6e6f7420656e6f75676820636f6d6d697373696f6e00000000000000000000006044820152606401610c05565b60008481526009602090815260408083206001600160a01b038b16808552908352818420805486900390558d8452600a8352818420908452909152812080548392906142f390849061589a565b9091555050600285015460008b8152600a602090815260408083206001600160a01b038c16845290915290205411156143945760405162461bcd60e51b815260206004820152602560248201527f616363756d756c6174656420636f6d6d697373696f6e2065786365656465642060448201527f6c696d69740000000000000000000000000000000000000000000000000000006064820152608401610c05565b6001600160a01b03808a166000908152600d60209081526040808320938b168352929052908120549081900361447857600b600081546143d3906158c0565b90915550604080516060810182526001600160a01b03808d168083528b821660208085018281528587018a8152600b80546000908152600c8552898120985189549089167fffffffffffffffffffffffff0000000000000000000000000000000000000000918216178a55935160018a01805491909916941693909317909655516002909601959095559254918452600d83528484209084529091529190205561449f565b6000818152600c60205260408120600201805485929061449990849061589a565b90915550505b6000818152600c60209081526040808320600201546001600160a01b038c1684526004909252918290205491517fac98d1de12ec7e306f0033236185d2a9d904bb054995aa9987c7d5a6d7ff4c5792614532928e928d928992918b91906001600160a01b03968716815294909516602085015260408401929092526060830152608082015260a081019190915260c00190565b60405180910390a1505050505050505050505050565b6001600160a01b0381166000908152600460209081526040808320805490849055600590925282208054919283926145819084906158ad565b90915550506001600160a01b0382166145a35761459e3382613fd6565b6145b7565b6145b76001600160a01b0383163383614093565b816001600160a01b03167f6ec620dc21a80aff1281aac3592cbd6b0554bbf810aa4b75338ef3cc9ae1a66c82604051611dc991815260200190565b6001600160a01b0381166000818152600384016020526040902054600284018054919291839081106146265761462661583c565b6000918252602090912001546001600160a01b0316146146885760405162461bcd60e51b815260206004820152600c60248201527f6e6f7420616e2061646d696e00000000000000000000000000000000000000006044820152606401610c05565b600283015460009061469c906001906158ad565b90508082146147425760008460020182815481106146bc576146bc61583c565b6000918252602090912001546002860180546001600160a01b0390921692508291859081106146ed576146ed61583c565b600091825260208083209190910180547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0394851617905592909116815260038601909152604090208290555b8360020180548061475557614755615c31565b6000828152602080822083017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90810180547fffffffffffffffffffffffff00000000000000000000000000000000000000001690559092019092556001600160a01b03851680835260038701909152604080832083905551909187917fe76d77167882521e5d6872e780957ffd683d0e4710f4f159f4170fa42589387b9190a35050505050565b6001600160a01b03821615614819576148168282613d59565b90505b60008381526009602090815260408083206001600160a01b03861684529091528120805483929061484b90849061589a565b90915550506001600160a01b0382166000908152600560205260408120805483929061487890849061589a565b909155505060008381526009602090815260408083206001600160a01b038616808552908352928190205481518581529283015285917f507ac39eb33610191cd8fd54286e91c5cc464c262861643be3978f5a9f18ab0291015b60405180910390a3505050565b600683815481106148f2576148f261583c565b60009182526020909120600490910201546001600160a01b0316331461495a5760405162461bcd60e51b815260206004820152600e60248201527f6e6f742066726f6d206f776e65720000000000000000000000000000000000006044820152606401610c05565b60008381526009602090815260408083206001600160a01b03861684529091529020548111156149cc5760405162461bcd60e51b815260206004820152601760248201527f616d6f756e742065786365656465642062616c616e63650000000000000000006044820152606401610c05565b60008381526009602090815260408083206001600160a01b0386168452825280832080548590039055600590915281208054839290614a0c9084906158ad565b90915550506001600160a01b03821615614a3957614a346001600160a01b0383163383614093565b614a43565b614a433382613fd6565b60008381526009602090815260408083206001600160a01b038616808552908352928190205481518581529283015285917fc1e00202ee2c06861d326fc6374026b751863ff64218ccbaa38c3e603a8e72c291016148d2565b6000614af1826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316614b819092919063ffffffff16565b805190915015610c195780806020019051810190614b0f9190615c60565b610c195760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608401610c05565b6060614b908484600085614b98565b949350505050565b606082471015614c105760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401610c05565b600080866001600160a01b03168587604051614c2c9190615bc3565b60006040518083038185875af1925050503d8060008114614c69576040519150601f19603f3d011682016040523d82523d6000602084013e614c6e565b606091505b5091509150614c7f87838387614c8a565b979650505050505050565b60608315614cf9578251600003614cf2576001600160a01b0385163b614cf25760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610c05565b5081614b90565b614b908383815115614d0e5781518083602001fd5b8060405162461bcd60e51b8152600401610c059190615c7d565b828054828255906000526020600020908101928215614d8d579160200282015b82811115614d8d5781547fffffffffffffffff00000000000000000000000000000000000000000000000016833560401c178255602090920191600190910190614d48565b50614d99929150614e08565b5090565b828054828255906000526020600020908101928215614d8d579160200282015b82811115614d8d5781547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b03843516178255602090920191600190910190614dbd565b5b80821115614d995760008155600101614e09565b600080600080600060a08688031215614e3557600080fd5b505083359560208501359550604085013594606081013594506080013592509050565b600081518084526020808501945080840160005b83811015614e915781516001600160a01b031687529582019590820190600101614e6c565b509495945050505050565b604080825283519082018190526000906020906060840190828701845b82811015614ef75781517fffffffffffffffffffffffffffffffffffffffffffffffff00000000000000001684529284019290840190600101614eb9565b50505083810382850152614f0b8186614e58565b9695505050505050565b6001600160a01b0381168114610e8157600080fd5b8035614f3581614f15565b919050565b60008060408385031215614f4d57600080fd5b823591506020830135614f5f81614f15565b809150509250929050565b600060208284031215614f7c57600080fd5b5035919050565b62ffffff81168114610e8157600080fd5b600060208284031215614fa657600080fd5b8135613e8181614f83565b60008060408385031215614fc457600080fd5b50508035926020909101359150565b602080825282518282018190526000919060409081850190868401855b8281101561502b57815180516001600160a01b0390811686528782015116878601528501518585015260609093019290850190600101614ff0565b5091979650505050505050565b60006020828403121561504a57600080fd5b8135613e8181614f15565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040805190810167ffffffffffffffff811182821017156150a7576150a7615055565b60405290565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff811182821017156150f4576150f4615055565b604052919050565b600067ffffffffffffffff82111561511657615116615055565b5060051b60200190565b600082601f83011261513157600080fd5b81356020615146615141836150fc565b6150ad565b82815260069290921b8401810191818101908684111561516557600080fd5b8286015b848110156151ad57604081890312156151825760008081fd5b61518a615084565b813561519581614f15565b81528185013585820152835291830191604001615169565b509695505050505050565b600082601f8301126151c957600080fd5b813560206151d9615141836150fc565b82815260059290921b840181019181810190868411156151f857600080fd5b8286015b848110156151ad57803561520f81614f15565b83529183019183016151fc565b600080600080600080600060e0888a03121561523757600080fd5b8735965060208089013561524a81614f15565b9650604089013567ffffffffffffffff8082111561526757600080fd5b818b0191508b601f83011261527b57600080fd5b81358181111561528d5761528d615055565b6152bd847fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f840116016150ad565b8181528d858386010111156152d157600080fd5b8185850186830137600085838301015280995050506152f260608c01614f2a565b965061530060808c01614f2a565b955060a08b013592508083111561531657600080fd5b6153228c848d01615120565b945060c08b013592508083111561533857600080fd5b50506153468a828b016151b8565b91505092959891949750929550565b60008083601f84011261536757600080fd5b50813567ffffffffffffffff81111561537f57600080fd5b6020830191508360208260051b850101111561539a57600080fd5b9250929050565b600080602083850312156153b457600080fd5b823567ffffffffffffffff8111156153cb57600080fd5b6153d785828601615355565b90969095509350505050565b6000806000806000606086880312156153fb57600080fd5b85359450602086013567ffffffffffffffff8082111561541a57600080fd5b61542689838a01615355565b9096509450604088013591508082111561543f57600080fd5b5061544c88828901615355565b969995985093965092949392505050565b60008060006060848603121561547257600080fd5b83359250602084013561548481614f15565b929592945050506040919091013590565b600080604083850312156154a857600080fd5b82356154b381614f15565b91506020830135614f5f81614f15565b6000602082840312156154d557600080fd5b813567ffffffffffffffff8111156154ec57600080fd5b82016101e08185031215613e8157600080fd5b8015158114610e8157600080fd5b6000806040838503121561552057600080fd5b823591506020830135614f5f816154ff565b600081518084526020808501945080840160005b83811015614e915781517fffffffffffffffffffffffffffffffffffffffffffffffff00000000000000001687529582019590820190600101615546565b600081518084526020808501945080840160005b83811015614e91578151151587529582019590820190600101615598565b600081518084526020808501945080840160005b83811015614e91578151805162ffffff168852838101511515848901526040808201519089015260609081015190880152608090960195908201906001016155ca565b602081528151602082015260006020830151615630604084018262ffffff169052565b50604083015162ffffff81166060840152506060830151801515608084015250608083015167ffffffffffffffff811660a08401525060a083015167ffffffffffffffff811660c08401525060c08301516101e08060e0850152615698610200850183615532565b915060e08501516101006156af8187018315159052565b86015190506101206156c48682018315159052565b808701519150507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06101408187860301818801526157028584614e58565b9450808801519250506101608187860301818801526157218584615584565b94508088015192505061018081878603018188015261574085846155b6565b9450808801519250506101a081878603018188015261575f8584614e58565b9450808801519250506101c081878603018188015261577e85846155b6565b908801518782039092018488015293509050614f0b8382614e58565b60006001600160a01b038086168352808516602084015250606060408301526157c66060830184614e58565b95945050505050565b60a0815260006157e260a0830188614e58565b82810360208401526157f48188615584565b9050828103604084015261580881876155b6565b9050828103606084015261581c8186614e58565b9050828103608084015261583081856155b6565b98975050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b808201808211156132ab576132ab61586b565b818103818111156132ab576132ab61586b565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036158f1576158f161586b565b5060010190565b6000815160208301517fffffffff00000000000000000000000000000000000000000000000000000000808216935060048310156159405780818460040360031b1b83161693505b505050919050565b6000815160208301517fffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000808216935060188310156159405760189290920360031b82901b161692915050565b6000602082840312156159a657600080fd5b5051919050565b6000602082840312156159bf57600080fd5b813567ffffffffffffffff81168114613e8157600080fd5b6000602082840312156159e957600080fd5b8135613e81816154ff565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1843603018112615a2957600080fd5b83018035915067ffffffffffffffff821115615a4457600080fd5b6020019150600581901b360382131561539a57600080fd5b600060208284031215615a6e57600080fd5b81357fffffffffffffffffffffffffffffffffffffffffffffffff000000000000000081168114613e8157600080fd5b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1843603018112615ad357600080fd5b83018035915067ffffffffffffffff821115615aee57600080fd5b6020019150600781901b360382131561539a57600080fd5b8135615b1181614f83565b62ffffff811690508154817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000082161783556020840135615b50816154ff565b63ff00000081151560181b16837fffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000084161717845550505060408201356001820155606082013560028201555050565b60005b83811015615bba578181015183820152602001615ba2565b50506000910152565b60008251615bd5818460208701615b9f565b9190910192915050565b80820281158282048414176132ab576132ab61586b565b600082615c2c577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fd5b600060208284031215615c7257600080fd5b8151613e81816154ff565b6020815260008251806020840152615c9c816040850160208701615b9f565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016919091016040019291505056fea264697066735822122069cb384c254b82319b0190d00666733d0d1e9de81a2eadb8bbf807351132201d64736f6c63430008110033"
    };
});
define("@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/ProxyV3.ts", ["require", "exports", "@ijstech/eth-contract", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/ProxyV3.json.ts"], function (require, exports, eth_contract_9, ProxyV3_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProxyV3 = void 0;
    class ProxyV3 extends eth_contract_9.Contract {
        constructor(wallet, address) {
            super(wallet, address, ProxyV3_json_1.default.abi, ProxyV3_json_1.default.bytecode);
            this.assign();
        }
        deploy(protocolRate, options) {
            return this.__deploy([this.wallet.utils.toString(protocolRate)], options);
        }
        parseAddCommissionEvent(receipt) {
            return this.parseEvents(receipt, "AddCommission").map(e => this.decodeAddCommissionEvent(e));
        }
        decodeAddCommissionEvent(event) {
            let result = event.data;
            return {
                to: result.to,
                token: result.token,
                commission: new eth_contract_9.BigNumber(result.commission),
                commissionBalance: new eth_contract_9.BigNumber(result.commissionBalance),
                protocolFee: new eth_contract_9.BigNumber(result.protocolFee),
                protocolFeeBalance: new eth_contract_9.BigNumber(result.protocolFeeBalance),
                _event: event
            };
        }
        parseAddProjectAdminEvent(receipt) {
            return this.parseEvents(receipt, "AddProjectAdmin").map(e => this.decodeAddProjectAdminEvent(e));
        }
        decodeAddProjectAdminEvent(event) {
            let result = event.data;
            return {
                projectId: new eth_contract_9.BigNumber(result.projectId),
                admin: result.admin,
                _event: event
            };
        }
        parseAuthorizeEvent(receipt) {
            return this.parseEvents(receipt, "Authorize").map(e => this.decodeAuthorizeEvent(e));
        }
        decodeAuthorizeEvent(event) {
            let result = event.data;
            return {
                user: result.user,
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
                amount: new eth_contract_9.BigNumber(result.amount),
                _event: event
            };
        }
        parseClaimProtocolFeeEvent(receipt) {
            return this.parseEvents(receipt, "ClaimProtocolFee").map(e => this.decodeClaimProtocolFeeEvent(e));
        }
        decodeClaimProtocolFeeEvent(event) {
            let result = event.data;
            return {
                token: result.token,
                amount: new eth_contract_9.BigNumber(result.amount),
                _event: event
            };
        }
        parseDeauthorizeEvent(receipt) {
            return this.parseEvents(receipt, "Deauthorize").map(e => this.decodeDeauthorizeEvent(e));
        }
        decodeDeauthorizeEvent(event) {
            let result = event.data;
            return {
                user: result.user,
                _event: event
            };
        }
        parseNewCampaignEvent(receipt) {
            return this.parseEvents(receipt, "NewCampaign").map(e => this.decodeNewCampaignEvent(e));
        }
        decodeNewCampaignEvent(event) {
            let result = event.data;
            return {
                campaignId: new eth_contract_9.BigNumber(result.campaignId),
                _event: event
            };
        }
        parseNewProjectEvent(receipt) {
            return this.parseEvents(receipt, "NewProject").map(e => this.decodeNewProjectEvent(e));
        }
        decodeNewProjectEvent(event) {
            let result = event.data;
            return {
                projectId: new eth_contract_9.BigNumber(result.projectId),
                _event: event
            };
        }
        parseRemoveProjectAdminEvent(receipt) {
            return this.parseEvents(receipt, "RemoveProjectAdmin").map(e => this.decodeRemoveProjectAdminEvent(e));
        }
        decodeRemoveProjectAdminEvent(event) {
            let result = event.data;
            return {
                projectId: new eth_contract_9.BigNumber(result.projectId),
                admin: result.admin,
                _event: event
            };
        }
        parseSetProtocolRateEvent(receipt) {
            return this.parseEvents(receipt, "SetProtocolRate").map(e => this.decodeSetProtocolRateEvent(e));
        }
        decodeSetProtocolRateEvent(event) {
            let result = event.data;
            return {
                protocolRate: new eth_contract_9.BigNumber(result.protocolRate),
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
                amount: new eth_contract_9.BigNumber(result.amount),
                _event: event
            };
        }
        parseStakeEvent(receipt) {
            return this.parseEvents(receipt, "Stake").map(e => this.decodeStakeEvent(e));
        }
        decodeStakeEvent(event) {
            let result = event.data;
            return {
                projectId: new eth_contract_9.BigNumber(result.projectId),
                token: result.token,
                amount: new eth_contract_9.BigNumber(result.amount),
                balance: new eth_contract_9.BigNumber(result.balance),
                _event: event
            };
        }
        parseStartOwnershipTransferEvent(receipt) {
            return this.parseEvents(receipt, "StartOwnershipTransfer").map(e => this.decodeStartOwnershipTransferEvent(e));
        }
        decodeStartOwnershipTransferEvent(event) {
            let result = event.data;
            return {
                user: result.user,
                _event: event
            };
        }
        parseTakeoverProjectOwnershipEvent(receipt) {
            return this.parseEvents(receipt, "TakeoverProjectOwnership").map(e => this.decodeTakeoverProjectOwnershipEvent(e));
        }
        decodeTakeoverProjectOwnershipEvent(event) {
            let result = event.data;
            return {
                projectId: new eth_contract_9.BigNumber(result.projectId),
                newOwner: result.newOwner,
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
                amount: new eth_contract_9.BigNumber(result.amount),
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
                amount: new eth_contract_9.BigNumber(result.amount),
                _event: event
            };
        }
        parseTransferOwnershipEvent(receipt) {
            return this.parseEvents(receipt, "TransferOwnership").map(e => this.decodeTransferOwnershipEvent(e));
        }
        decodeTransferOwnershipEvent(event) {
            let result = event.data;
            return {
                user: result.user,
                _event: event
            };
        }
        parseTransferProjectOwnershipEvent(receipt) {
            return this.parseEvents(receipt, "TransferProjectOwnership").map(e => this.decodeTransferProjectOwnershipEvent(e));
        }
        decodeTransferProjectOwnershipEvent(event) {
            let result = event.data;
            return {
                projectId: new eth_contract_9.BigNumber(result.projectId),
                newOwner: result.newOwner,
                _event: event
            };
        }
        parseUnstakeEvent(receipt) {
            return this.parseEvents(receipt, "Unstake").map(e => this.decodeUnstakeEvent(e));
        }
        decodeUnstakeEvent(event) {
            let result = event.data;
            return {
                projectId: new eth_contract_9.BigNumber(result.projectId),
                token: result.token,
                amount: new eth_contract_9.BigNumber(result.amount),
                balance: new eth_contract_9.BigNumber(result.balance),
                _event: event
            };
        }
        assign() {
            let campaignAccumulatedCommissionParams = (params) => [this.wallet.utils.toString(params.param1), params.param2];
            let campaignAccumulatedCommission_call = async (params, options) => {
                let result = await this.call('campaignAccumulatedCommission', campaignAccumulatedCommissionParams(params), options);
                return new eth_contract_9.BigNumber(result);
            };
            this.campaignAccumulatedCommission = campaignAccumulatedCommission_call;
            let claimantIdCount_call = async (options) => {
                let result = await this.call('claimantIdCount', [], options);
                return new eth_contract_9.BigNumber(result);
            };
            this.claimantIdCount = claimantIdCount_call;
            let claimantIdsParams = (params) => [params.param1, params.param2];
            let claimantIds_call = async (params, options) => {
                let result = await this.call('claimantIds', claimantIdsParams(params), options);
                return new eth_contract_9.BigNumber(result);
            };
            this.claimantIds = claimantIds_call;
            let claimantsInfo_call = async (param1, options) => {
                let result = await this.call('claimantsInfo', [this.wallet.utils.toString(param1)], options);
                return {
                    claimant: result.claimant,
                    token: result.token,
                    balance: new eth_contract_9.BigNumber(result.balance)
                };
            };
            this.claimantsInfo = claimantsInfo_call;
            let getCampaignParams = (params) => [this.wallet.utils.toString(params.campaignId), params.returnArrays];
            let getCampaign_call = async (params, options) => {
                let result = await this.call('getCampaign', getCampaignParams(params), options);
                return ({
                    projectId: new eth_contract_9.BigNumber(result.projectId),
                    maxInputTokensInEachCall: new eth_contract_9.BigNumber(result.maxInputTokensInEachCall),
                    maxOutputTokensInEachCall: new eth_contract_9.BigNumber(result.maxOutputTokensInEachCall),
                    referrersRequireApproval: result.referrersRequireApproval,
                    startDate: new eth_contract_9.BigNumber(result.startDate),
                    endDate: new eth_contract_9.BigNumber(result.endDate),
                    targetAndSelectors: result.targetAndSelectors,
                    acceptAnyInToken: result.acceptAnyInToken,
                    acceptAnyOutToken: result.acceptAnyOutToken,
                    inTokens: result.inTokens,
                    directTransferInToken: result.directTransferInToken,
                    commissionInTokenConfig: result.commissionInTokenConfig.map(e => ({
                        rate: new eth_contract_9.BigNumber(e.rate),
                        feeOnProjectOwner: e.feeOnProjectOwner,
                        capPerTransaction: new eth_contract_9.BigNumber(e.capPerTransaction),
                        capPerCampaign: new eth_contract_9.BigNumber(e.capPerCampaign)
                    })),
                    outTokens: result.outTokens,
                    commissionOutTokenConfig: result.commissionOutTokenConfig.map(e => ({
                        rate: new eth_contract_9.BigNumber(e.rate),
                        feeOnProjectOwner: e.feeOnProjectOwner,
                        capPerTransaction: new eth_contract_9.BigNumber(e.capPerTransaction),
                        capPerCampaign: new eth_contract_9.BigNumber(e.capPerCampaign)
                    })),
                    referrers: result.referrers
                });
            };
            this.getCampaign = getCampaign_call;
            let getCampaignArrayData1Params = (params) => [this.wallet.utils.toString(params.campaignId), this.wallet.utils.toString(params.targetAndSelectorsStart), this.wallet.utils.toString(params.targetAndSelectorsLength), this.wallet.utils.toString(params.referrersStart), this.wallet.utils.toString(params.referrersLength)];
            let getCampaignArrayData1_call = async (params, options) => {
                let result = await this.call('getCampaignArrayData1', getCampaignArrayData1Params(params), options);
                return {
                    targetAndSelectors: result.targetAndSelectors,
                    referrers: result.referrers
                };
            };
            this.getCampaignArrayData1 = getCampaignArrayData1_call;
            let getCampaignArrayData2Params = (params) => [this.wallet.utils.toString(params.campaignId), this.wallet.utils.toString(params.inTokensStart), this.wallet.utils.toString(params.inTokensLength), this.wallet.utils.toString(params.outTokensStart), this.wallet.utils.toString(params.outTokensLength)];
            let getCampaignArrayData2_call = async (params, options) => {
                let result = await this.call('getCampaignArrayData2', getCampaignArrayData2Params(params), options);
                return {
                    inTokens: result.inTokens,
                    directTransferInToken: result.directTransferInToken,
                    commissionInTokenConfig: result.commissionInTokenConfig.map(e => ({
                        rate: new eth_contract_9.BigNumber(e.rate),
                        feeOnProjectOwner: e.feeOnProjectOwner,
                        capPerTransaction: new eth_contract_9.BigNumber(e.capPerTransaction),
                        capPerCampaign: new eth_contract_9.BigNumber(e.capPerCampaign)
                    })),
                    outTokens: result.outTokens,
                    commissionOutTokenConfig: result.commissionOutTokenConfig.map(e => ({
                        rate: new eth_contract_9.BigNumber(e.rate),
                        feeOnProjectOwner: e.feeOnProjectOwner,
                        capPerTransaction: new eth_contract_9.BigNumber(e.capPerTransaction),
                        capPerCampaign: new eth_contract_9.BigNumber(e.capPerCampaign)
                    }))
                };
            };
            this.getCampaignArrayData2 = getCampaignArrayData2_call;
            let getCampaignArrayLength_call = async (campaignId, options) => {
                let result = await this.call('getCampaignArrayLength', [this.wallet.utils.toString(campaignId)], options);
                return {
                    targetAndSelectorsLength: new eth_contract_9.BigNumber(result.targetAndSelectorsLength),
                    inTokensLength: new eth_contract_9.BigNumber(result.inTokensLength),
                    outTokensLength: new eth_contract_9.BigNumber(result.outTokensLength),
                    referrersLength: new eth_contract_9.BigNumber(result.referrersLength)
                };
            };
            this.getCampaignArrayLength = getCampaignArrayLength_call;
            let getClaimantBalanceParams = (params) => [params.claimant, params.token];
            let getClaimantBalance_call = async (params, options) => {
                let result = await this.call('getClaimantBalance', getClaimantBalanceParams(params), options);
                return new eth_contract_9.BigNumber(result);
            };
            this.getClaimantBalance = getClaimantBalance_call;
            let getClaimantsInfoParams = (params) => [this.wallet.utils.toString(params.fromId), this.wallet.utils.toString(params.count)];
            let getClaimantsInfo_call = async (params, options) => {
                let result = await this.call('getClaimantsInfo', getClaimantsInfoParams(params), options);
                return (result.map(e => ({
                    claimant: e.claimant,
                    token: e.token,
                    balance: new eth_contract_9.BigNumber(e.balance)
                })));
            };
            this.getClaimantsInfo = getClaimantsInfo_call;
            let getProject_call = async (projectId, options) => {
                let result = await this.call('getProject', [this.wallet.utils.toString(projectId)], options);
                return {
                    owner: result.owner,
                    newOwner: result.newOwner,
                    projectAdmins: result.projectAdmins
                };
            };
            this.getProject = getProject_call;
            let getProjectAdminsLength_call = async (projectId, options) => {
                let result = await this.call('getProjectAdminsLength', [this.wallet.utils.toString(projectId)], options);
                return new eth_contract_9.BigNumber(result);
            };
            this.getProjectAdminsLength = getProjectAdminsLength_call;
            let isPermitted_call = async (param1, options) => {
                let result = await this.call('isPermitted', [param1], options);
                return result;
            };
            this.isPermitted = isPermitted_call;
            let lastBalance_call = async (param1, options) => {
                let result = await this.call('lastBalance', [param1], options);
                return new eth_contract_9.BigNumber(result);
            };
            this.lastBalance = lastBalance_call;
            let newOwner_call = async (options) => {
                let result = await this.call('newOwner', [], options);
                return result;
            };
            this.newOwner = newOwner_call;
            let owner_call = async (options) => {
                let result = await this.call('owner', [], options);
                return result;
            };
            this.owner = owner_call;
            let protocolFeeBalance_call = async (param1, options) => {
                let result = await this.call('protocolFeeBalance', [param1], options);
                return new eth_contract_9.BigNumber(result);
            };
            this.protocolFeeBalance = protocolFeeBalance_call;
            let protocolRate_call = async (options) => {
                let result = await this.call('protocolRate', [], options);
                return new eth_contract_9.BigNumber(result);
            };
            this.protocolRate = protocolRate_call;
            let stakesBalanceParams = (params) => [this.wallet.utils.toString(params.param1), params.param2];
            let stakesBalance_call = async (params, options) => {
                let result = await this.call('stakesBalance', stakesBalanceParams(params), options);
                return new eth_contract_9.BigNumber(result);
            };
            this.stakesBalance = stakesBalance_call;
            let addProjectAdminParams = (params) => [this.wallet.utils.toString(params.projectId), params.admin];
            let addProjectAdmin_send = async (params, options) => {
                let result = await this.send('addProjectAdmin', addProjectAdminParams(params), options);
                return result;
            };
            let addProjectAdmin_call = async (params, options) => {
                let result = await this.call('addProjectAdmin', addProjectAdminParams(params), options);
                return;
            };
            let addProjectAdmin_txData = async (params, options) => {
                let result = await this.txData('addProjectAdmin', addProjectAdminParams(params), options);
                return result;
            };
            this.addProjectAdmin = Object.assign(addProjectAdmin_send, {
                call: addProjectAdmin_call,
                txData: addProjectAdmin_txData
            });
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
            let claimMultipleProtocolFee_send = async (tokens, options) => {
                let result = await this.send('claimMultipleProtocolFee', [tokens], options);
                return result;
            };
            let claimMultipleProtocolFee_call = async (tokens, options) => {
                let result = await this.call('claimMultipleProtocolFee', [tokens], options);
                return;
            };
            let claimMultipleProtocolFee_txData = async (tokens, options) => {
                let result = await this.txData('claimMultipleProtocolFee', [tokens], options);
                return result;
            };
            this.claimMultipleProtocolFee = Object.assign(claimMultipleProtocolFee_send, {
                call: claimMultipleProtocolFee_call,
                txData: claimMultipleProtocolFee_txData
            });
            let claimProtocolFee_send = async (token, options) => {
                let result = await this.send('claimProtocolFee', [token], options);
                return result;
            };
            let claimProtocolFee_call = async (token, options) => {
                let result = await this.call('claimProtocolFee', [token], options);
                return;
            };
            let claimProtocolFee_txData = async (token, options) => {
                let result = await this.txData('claimProtocolFee', [token], options);
                return result;
            };
            this.claimProtocolFee = Object.assign(claimProtocolFee_send, {
                call: claimProtocolFee_call,
                txData: claimProtocolFee_txData
            });
            let deny_send = async (user, options) => {
                let result = await this.send('deny', [user], options);
                return result;
            };
            let deny_call = async (user, options) => {
                let result = await this.call('deny', [user], options);
                return;
            };
            let deny_txData = async (user, options) => {
                let result = await this.txData('deny', [user], options);
                return result;
            };
            this.deny = Object.assign(deny_send, {
                call: deny_call,
                txData: deny_txData
            });
            let newCampaign_send = async (params, options) => {
                let result = await this.send('newCampaign', [[this.wallet.utils.toString(params.projectId), this.wallet.utils.toString(params.maxInputTokensInEachCall), this.wallet.utils.toString(params.maxOutputTokensInEachCall), params.referrersRequireApproval, this.wallet.utils.toString(params.startDate), this.wallet.utils.toString(params.endDate), params.targetAndSelectors, params.acceptAnyInToken, params.acceptAnyOutToken, params.inTokens, params.directTransferInToken, params.commissionInTokenConfig.map(e => ([this.wallet.utils.toString(e.rate), e.feeOnProjectOwner, this.wallet.utils.toString(e.capPerTransaction), this.wallet.utils.toString(e.capPerCampaign)])), params.outTokens, params.commissionOutTokenConfig.map(e => ([this.wallet.utils.toString(e.rate), e.feeOnProjectOwner, this.wallet.utils.toString(e.capPerTransaction), this.wallet.utils.toString(e.capPerCampaign)])), params.referrers]], options);
                return result;
            };
            let newCampaign_call = async (params, options) => {
                let result = await this.call('newCampaign', [[this.wallet.utils.toString(params.projectId), this.wallet.utils.toString(params.maxInputTokensInEachCall), this.wallet.utils.toString(params.maxOutputTokensInEachCall), params.referrersRequireApproval, this.wallet.utils.toString(params.startDate), this.wallet.utils.toString(params.endDate), params.targetAndSelectors, params.acceptAnyInToken, params.acceptAnyOutToken, params.inTokens, params.directTransferInToken, params.commissionInTokenConfig.map(e => ([this.wallet.utils.toString(e.rate), e.feeOnProjectOwner, this.wallet.utils.toString(e.capPerTransaction), this.wallet.utils.toString(e.capPerCampaign)])), params.outTokens, params.commissionOutTokenConfig.map(e => ([this.wallet.utils.toString(e.rate), e.feeOnProjectOwner, this.wallet.utils.toString(e.capPerTransaction), this.wallet.utils.toString(e.capPerCampaign)])), params.referrers]], options);
                return new eth_contract_9.BigNumber(result);
            };
            let newCampaign_txData = async (params, options) => {
                let result = await this.txData('newCampaign', [[this.wallet.utils.toString(params.projectId), this.wallet.utils.toString(params.maxInputTokensInEachCall), this.wallet.utils.toString(params.maxOutputTokensInEachCall), params.referrersRequireApproval, this.wallet.utils.toString(params.startDate), this.wallet.utils.toString(params.endDate), params.targetAndSelectors, params.acceptAnyInToken, params.acceptAnyOutToken, params.inTokens, params.directTransferInToken, params.commissionInTokenConfig.map(e => ([this.wallet.utils.toString(e.rate), e.feeOnProjectOwner, this.wallet.utils.toString(e.capPerTransaction), this.wallet.utils.toString(e.capPerCampaign)])), params.outTokens, params.commissionOutTokenConfig.map(e => ([this.wallet.utils.toString(e.rate), e.feeOnProjectOwner, this.wallet.utils.toString(e.capPerTransaction), this.wallet.utils.toString(e.capPerCampaign)])), params.referrers]], options);
                return result;
            };
            this.newCampaign = Object.assign(newCampaign_send, {
                call: newCampaign_call,
                txData: newCampaign_txData
            });
            let newProject_send = async (admins, options) => {
                let result = await this.send('newProject', [admins], options);
                return result;
            };
            let newProject_call = async (admins, options) => {
                let result = await this.call('newProject', [admins], options);
                return new eth_contract_9.BigNumber(result);
            };
            let newProject_txData = async (admins, options) => {
                let result = await this.txData('newProject', [admins], options);
                return result;
            };
            this.newProject = Object.assign(newProject_send, {
                call: newProject_call,
                txData: newProject_txData
            });
            let permit_send = async (user, options) => {
                let result = await this.send('permit', [user], options);
                return result;
            };
            let permit_call = async (user, options) => {
                let result = await this.call('permit', [user], options);
                return;
            };
            let permit_txData = async (user, options) => {
                let result = await this.txData('permit', [user], options);
                return result;
            };
            this.permit = Object.assign(permit_send, {
                call: permit_call,
                txData: permit_txData
            });
            let proxyCallParams = (params) => [this.wallet.utils.toString(params.campaignId), params.target, this.wallet.utils.stringToBytes(params.data), params.referrer, params.to, params.tokensIn.map(e => ([e.token, this.wallet.utils.toString(e.amount)])), params.tokensOut];
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
            let removeProjectAdminParams = (params) => [this.wallet.utils.toString(params.projectId), params.admin];
            let removeProjectAdmin_send = async (params, options) => {
                let result = await this.send('removeProjectAdmin', removeProjectAdminParams(params), options);
                return result;
            };
            let removeProjectAdmin_call = async (params, options) => {
                let result = await this.call('removeProjectAdmin', removeProjectAdminParams(params), options);
                return;
            };
            let removeProjectAdmin_txData = async (params, options) => {
                let result = await this.txData('removeProjectAdmin', removeProjectAdminParams(params), options);
                return result;
            };
            this.removeProjectAdmin = Object.assign(removeProjectAdmin_send, {
                call: removeProjectAdmin_call,
                txData: removeProjectAdmin_txData
            });
            let setProtocolRate_send = async (newRate, options) => {
                let result = await this.send('setProtocolRate', [this.wallet.utils.toString(newRate)], options);
                return result;
            };
            let setProtocolRate_call = async (newRate, options) => {
                let result = await this.call('setProtocolRate', [this.wallet.utils.toString(newRate)], options);
                return;
            };
            let setProtocolRate_txData = async (newRate, options) => {
                let result = await this.txData('setProtocolRate', [this.wallet.utils.toString(newRate)], options);
                return result;
            };
            this.setProtocolRate = Object.assign(setProtocolRate_send, {
                call: setProtocolRate_call,
                txData: setProtocolRate_txData
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
            let stakeParams = (params) => [this.wallet.utils.toString(params.projectId), params.token, this.wallet.utils.toString(params.amount)];
            let stake_send = async (params, options) => {
                let result = await this.send('stake', stakeParams(params), options);
                return result;
            };
            let stake_call = async (params, options) => {
                let result = await this.call('stake', stakeParams(params), options);
                return;
            };
            let stake_txData = async (params, options) => {
                let result = await this.txData('stake', stakeParams(params), options);
                return result;
            };
            this.stake = Object.assign(stake_send, {
                call: stake_call,
                txData: stake_txData
            });
            let stakeETH_send = async (projectId, options) => {
                let result = await this.send('stakeETH', [this.wallet.utils.toString(projectId)], options);
                return result;
            };
            let stakeETH_call = async (projectId, options) => {
                let result = await this.call('stakeETH', [this.wallet.utils.toString(projectId)], options);
                return;
            };
            let stakeETH_txData = async (projectId, options) => {
                let result = await this.txData('stakeETH', [this.wallet.utils.toString(projectId)], options);
                return result;
            };
            this.stakeETH = Object.assign(stakeETH_send, {
                call: stakeETH_call,
                txData: stakeETH_txData
            });
            let stakeMultipleParams = (params) => [this.wallet.utils.toString(params.projectId), params.token, this.wallet.utils.toString(params.amount)];
            let stakeMultiple_send = async (params, options) => {
                let result = await this.send('stakeMultiple', stakeMultipleParams(params), options);
                return result;
            };
            let stakeMultiple_call = async (params, options) => {
                let result = await this.call('stakeMultiple', stakeMultipleParams(params), options);
                return;
            };
            let stakeMultiple_txData = async (params, options) => {
                let result = await this.txData('stakeMultiple', stakeMultipleParams(params), options);
                return result;
            };
            this.stakeMultiple = Object.assign(stakeMultiple_send, {
                call: stakeMultiple_call,
                txData: stakeMultiple_txData
            });
            let takeOwnership_send = async (options) => {
                let result = await this.send('takeOwnership', [], options);
                return result;
            };
            let takeOwnership_call = async (options) => {
                let result = await this.call('takeOwnership', [], options);
                return;
            };
            let takeOwnership_txData = async (options) => {
                let result = await this.txData('takeOwnership', [], options);
                return result;
            };
            this.takeOwnership = Object.assign(takeOwnership_send, {
                call: takeOwnership_call,
                txData: takeOwnership_txData
            });
            let takeoverProjectOwnership_send = async (projectId, options) => {
                let result = await this.send('takeoverProjectOwnership', [this.wallet.utils.toString(projectId)], options);
                return result;
            };
            let takeoverProjectOwnership_call = async (projectId, options) => {
                let result = await this.call('takeoverProjectOwnership', [this.wallet.utils.toString(projectId)], options);
                return;
            };
            let takeoverProjectOwnership_txData = async (projectId, options) => {
                let result = await this.txData('takeoverProjectOwnership', [this.wallet.utils.toString(projectId)], options);
                return result;
            };
            this.takeoverProjectOwnership = Object.assign(takeoverProjectOwnership_send, {
                call: takeoverProjectOwnership_call,
                txData: takeoverProjectOwnership_txData
            });
            let transferOwnership_send = async (newOwner, options) => {
                let result = await this.send('transferOwnership', [newOwner], options);
                return result;
            };
            let transferOwnership_call = async (newOwner, options) => {
                let result = await this.call('transferOwnership', [newOwner], options);
                return;
            };
            let transferOwnership_txData = async (newOwner, options) => {
                let result = await this.txData('transferOwnership', [newOwner], options);
                return result;
            };
            this.transferOwnership = Object.assign(transferOwnership_send, {
                call: transferOwnership_call,
                txData: transferOwnership_txData
            });
            let transferProjectOwnershipParams = (params) => [this.wallet.utils.toString(params.projectId), params.newOwner];
            let transferProjectOwnership_send = async (params, options) => {
                let result = await this.send('transferProjectOwnership', transferProjectOwnershipParams(params), options);
                return result;
            };
            let transferProjectOwnership_call = async (params, options) => {
                let result = await this.call('transferProjectOwnership', transferProjectOwnershipParams(params), options);
                return;
            };
            let transferProjectOwnership_txData = async (params, options) => {
                let result = await this.txData('transferProjectOwnership', transferProjectOwnershipParams(params), options);
                return result;
            };
            this.transferProjectOwnership = Object.assign(transferProjectOwnership_send, {
                call: transferProjectOwnership_call,
                txData: transferProjectOwnership_txData
            });
            let unstakeParams = (params) => [this.wallet.utils.toString(params.projectId), params.token, this.wallet.utils.toString(params.amount)];
            let unstake_send = async (params, options) => {
                let result = await this.send('unstake', unstakeParams(params), options);
                return result;
            };
            let unstake_call = async (params, options) => {
                let result = await this.call('unstake', unstakeParams(params), options);
                return;
            };
            let unstake_txData = async (params, options) => {
                let result = await this.txData('unstake', unstakeParams(params), options);
                return result;
            };
            this.unstake = Object.assign(unstake_send, {
                call: unstake_call,
                txData: unstake_txData
            });
            let unstakeETH_send = async (projectId, options) => {
                let result = await this.send('unstakeETH', [this.wallet.utils.toString(projectId)], options);
                return result;
            };
            let unstakeETH_call = async (projectId, options) => {
                let result = await this.call('unstakeETH', [this.wallet.utils.toString(projectId)], options);
                return;
            };
            let unstakeETH_txData = async (projectId, options) => {
                let result = await this.txData('unstakeETH', [this.wallet.utils.toString(projectId)], options);
                return result;
            };
            this.unstakeETH = Object.assign(unstakeETH_send, {
                call: unstakeETH_call,
                txData: unstakeETH_txData
            });
            let unstakeMultipleParams = (params) => [this.wallet.utils.toString(params.projectId), params.token, this.wallet.utils.toString(params.amount)];
            let unstakeMultiple_send = async (params, options) => {
                let result = await this.send('unstakeMultiple', unstakeMultipleParams(params), options);
                return result;
            };
            let unstakeMultiple_call = async (params, options) => {
                let result = await this.call('unstakeMultiple', unstakeMultipleParams(params), options);
                return;
            };
            let unstakeMultiple_txData = async (params, options) => {
                let result = await this.txData('unstakeMultiple', unstakeMultipleParams(params), options);
                return result;
            };
            this.unstakeMultiple = Object.assign(unstakeMultiple_send, {
                call: unstakeMultiple_call,
                txData: unstakeMultiple_txData
            });
        }
    }
    ProxyV3._abi = ProxyV3_json_1.default.abi;
    exports.ProxyV3 = ProxyV3;
});
define("@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/index.ts", ["require", "exports", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/Authorization.ts", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/Proxy.ts", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/ProxyV2.ts", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/ProxyV3.ts"], function (require, exports, Authorization_1, Proxy_1, ProxyV2_1, ProxyV3_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProxyV3 = exports.ProxyV2 = exports.Proxy = exports.Authorization = void 0;
    Object.defineProperty(exports, "Authorization", { enumerable: true, get: function () { return Authorization_1.Authorization; } });
    Object.defineProperty(exports, "Proxy", { enumerable: true, get: function () { return Proxy_1.Proxy; } });
    Object.defineProperty(exports, "ProxyV2", { enumerable: true, get: function () { return ProxyV2_1.ProxyV2; } });
    Object.defineProperty(exports, "ProxyV3", { enumerable: true, get: function () { return ProxyV3_1.ProxyV3; } });
});
define("@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/index.ts", ["require", "exports", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/contracts/index.ts", "@ijstech/eth-wallet"], function (require, exports, Contracts, eth_wallet_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onProgress = exports.deploy = exports.DefaultDeployOptions = exports.Contracts = void 0;
    exports.Contracts = Contracts;
    ;
    ;
    var progressHandler;
    exports.DefaultDeployOptions = {
        version: 'V3',
        protocolRate: '0.01'
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
        if (options.version == 'V3') {
            proxy = new Contracts.ProxyV3(wallet);
            progress('Deploy Proxy');
            await proxy.deploy(eth_wallet_5.Utils.toDecimals(options.protocolRate, 6));
        }
        else {
            if (options.version == 'V2') {
                proxy = new Contracts.ProxyV2(wallet);
            }
            else {
                proxy = new Contracts.Proxy(wallet);
            }
            progress('Deploy Proxy');
            await proxy.deploy();
        }
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
define("@scom/scom-nft-minter/API.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/scom-nft-minter/interface/index.tsx", "@scom/scom-nft-minter/contracts/scom-product-contract/index.ts", "@scom/scom-nft-minter/contracts/scom-commission-proxy-contract/index.ts", "@scom/scom-nft-minter/store/index.ts", "@scom/scom-nft-minter/utils/index.ts", "@scom/scom-token-list"], function (require, exports, eth_wallet_6, index_2, index_3, index_4, index_5, index_6, scom_token_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.donate = exports.buyProduct = exports.getProxyTokenAmountIn = exports.newProduct = exports.getNFTBalance = exports.getProductInfo = void 0;
    async function getProductInfo(productId) {
        let productInfoAddress = (0, index_5.getContractAddress)('ProductInfo');
        if (!productInfoAddress)
            return null;
        try {
            const wallet = eth_wallet_6.Wallet.getInstance();
            const productInfo = new index_3.Contracts.ProductInfo(wallet, productInfoAddress);
            const product = await productInfo.products(productId);
            const chainId = wallet.chainId;
            const _tokenList = scom_token_list_1.tokenStore.getTokenList(chainId);
            const token = _tokenList.find(token => (product === null || product === void 0 ? void 0 : product.token) && (token === null || token === void 0 ? void 0 : token.address) && token.address.toLowerCase() === product.token.toLowerCase());
            return Object.assign(Object.assign({}, product), { token });
        }
        catch (_a) {
            return null;
        }
    }
    exports.getProductInfo = getProductInfo;
    async function getNFTBalance(productId) {
        let productInfoAddress = (0, index_5.getContractAddress)('ProductInfo');
        const wallet = eth_wallet_6.Wallet.getInstance();
        const productInfo = new index_3.Contracts.ProductInfo(wallet, productInfoAddress);
        const nftAddress = await productInfo.nft();
        const product1155 = new index_3.Contracts.Product1155(wallet, nftAddress);
        const nftBalance = await product1155.balanceOf({
            account: wallet.address,
            id: productId
        });
        return nftBalance;
    }
    exports.getNFTBalance = getNFTBalance;
    async function newProduct(productType, qty, maxQty, price, maxPrice, token, callback, confirmationCallback) {
        let productInfoAddress = (0, index_5.getContractAddress)('ProductInfo');
        const wallet = eth_wallet_6.Wallet.getClientInstance();
        const productInfo = new index_3.Contracts.ProductInfo(wallet, productInfoAddress);
        (0, index_6.registerSendTxEvents)({
            transactionHash: callback,
            confirmation: confirmationCallback
        });
        const tokenDecimals = (token === null || token === void 0 ? void 0 : token.decimals) || 18;
        let productTypeCode;
        switch (productType) {
            case index_2.ProductType.Buy:
                productTypeCode = 0;
                break;
            case index_2.ProductType.DonateToOwner:
                productTypeCode = 1;
                break;
            case index_2.ProductType.DonateToEveryone:
                productTypeCode = 2;
                break;
        }
        let receipt = await productInfo.newProduct({
            productType: productTypeCode,
            uri: '',
            quantity: qty,
            maxQuantity: maxQty,
            maxPrice: eth_wallet_6.Utils.toDecimals(maxPrice, tokenDecimals),
            price: eth_wallet_6.Utils.toDecimals(price, tokenDecimals),
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
        const amount = new eth_wallet_6.BigNumber(productPrice).isZero() ? new eth_wallet_6.BigNumber(quantity) : new eth_wallet_6.BigNumber(productPrice).times(quantity);
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
    async function buyProduct(productId, quantity, commissions, token, callback, confirmationCallback) {
        let proxyAddress = (0, index_5.getContractAddress)('Proxy');
        let productInfoAddress = (0, index_5.getContractAddress)('ProductInfo');
        const wallet = eth_wallet_6.Wallet.getClientInstance();
        const proxy = new index_4.Contracts.Proxy(wallet, proxyAddress);
        const productInfo = new index_3.Contracts.ProductInfo(wallet, productInfoAddress);
        const product = await productInfo.products(productId);
        const amount = product.price.times(quantity);
        const _commissions = (commissions || []).filter(v => v.chainId === (0, index_5.getChainId)()).map(v => {
            return {
                to: v.walletAddress,
                amount: amount.times(v.share)
            };
        });
        const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)) : new eth_wallet_6.BigNumber(0);
        let receipt;
        try {
            if (token === null || token === void 0 ? void 0 : token.address) {
                (0, index_6.registerSendTxEvents)({
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
                (0, index_6.registerSendTxEvents)({
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
        let proxyAddress = (0, index_5.getContractAddress)('Proxy');
        let productInfoAddress = (0, index_5.getContractAddress)('ProductInfo');
        const wallet = eth_wallet_6.Wallet.getClientInstance();
        const proxy = new index_4.Contracts.Proxy(wallet, proxyAddress);
        const productInfo = new index_3.Contracts.ProductInfo(wallet, productInfoAddress);
        const tokenDecimals = (token === null || token === void 0 ? void 0 : token.decimals) || 18;
        const amount = eth_wallet_6.Utils.toDecimals(amountIn, tokenDecimals);
        const _commissions = (commissions || []).map(v => {
            return {
                to: v.walletAddress,
                amount: amount.times(v.share)
            };
        });
        const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)) : new eth_wallet_6.BigNumber(0);
        let receipt;
        try {
            if (token === null || token === void 0 ? void 0 : token.address) {
                (0, index_6.registerSendTxEvents)({
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
                (0, index_6.registerSendTxEvents)({
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
define("@scom/scom-nft-minter/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/data.json.ts'/> 
    exports.default = {
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
                }
            }
        },
        "embedderCommissionFee": "0.01",
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
define("@scom/scom-nft-minter/formSchema.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-nft-minter/formSchema.json.ts'/> 
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
    exports.default = {
        general: {
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
                    logo: {
                        type: 'string',
                        format: 'data-cid'
                    },
                    logoUrl: {
                        type: 'string',
                        title: 'Logo URL'
                    },
                    link: {
                        type: 'string'
                    }
                }
            }
        },
        theme: {
            dataSchema: {
                type: 'object',
                properties: {
                    dark: {
                        type: 'object',
                        properties: theme
                    },
                    light: {
                        type: 'object',
                        properties: theme
                    }
                }
            }
        }
    };
});
define("@scom/scom-nft-minter", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-nft-minter/interface/index.tsx", "@scom/scom-nft-minter/utils/index.ts", "@scom/scom-nft-minter/store/index.ts", "@scom/scom-nft-minter/index.css.ts", "@scom/scom-nft-minter/API.ts", "@scom/scom-nft-minter/data.json.ts", "@scom/scom-commission-fee-setup", "@scom/scom-nft-minter/formSchema.json.ts"], function (require, exports, components_3, eth_wallet_7, index_7, index_8, index_9, index_css_1, API_1, data_json_1, scom_commission_fee_setup_1, formSchema_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_3.Styles.Theme.ThemeVars;
    let ScomNftMinter = class ScomNftMinter extends components_3.Module {
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
            this.clientEvents = [];
            this.onChainChanged = async () => {
                this.onSetupPage();
                this.updateContractAddress();
                this.refreshDApp();
            };
            this.updateTokenBalance = async () => {
                var _a;
                const token = (_a = this.productInfo) === null || _a === void 0 ? void 0 : _a.token;
                if (!token)
                    return;
                try {
                    const symbol = (token === null || token === void 0 ? void 0 : token.symbol) || '';
                    this.lblBalance.caption = token ? `${(await (0, index_8.getTokenBalance)(token)).toFixed(2)} ${symbol}` : `0 ${symbol}`;
                }
                catch (_b) { }
            };
            (0, index_9.setDataFromSCConfig)(data_json_1.default);
            this.$eventBus = components_3.application.EventBus;
            this.registerEvent();
        }
        onHide() {
            this.containerDapp.onHide();
            const rpcWallet = (0, index_9.getRpcWallet)();
            for (let event of this.rpcWalletEvents) {
                rpcWallet.unregisterWalletEvent(event);
            }
            this.rpcWalletEvents = [];
            for (let event of this.clientEvents) {
                event.unregister();
            }
            this.clientEvents = [];
        }
        async init() {
            this.isReadyCallbackQueued = true;
            super.init();
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                const link = this.getAttribute('link', true);
                const productType = this.getAttribute('productType', true);
                const name = this.getAttribute('name', true);
                const title = this.getAttribute('title', true);
                const description = this.getAttribute('description', true);
                const logo = this.getAttribute('logo', true);
                const logoUrl = this.getAttribute('logoUrl', true);
                const chainSpecificProperties = this.getAttribute('chainSpecificProperties', true);
                const networks = this.getAttribute('networks', true);
                const wallets = this.getAttribute('wallets', true);
                const showHeader = this.getAttribute('showHeader', true);
                const defaultChainId = this.getAttribute('defaultChainId', true);
                await this.setData({
                    link,
                    productType,
                    name,
                    title,
                    chainSpecificProperties,
                    defaultChainId,
                    description,
                    logo,
                    logoUrl,
                    networks,
                    wallets,
                    showHeader,
                });
            }
            this.isReadyCallbackQueued = false;
            this.executeReadyCallback();
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get donateTo() {
            var _a, _b, _c;
            return (_c = (_b = (_a = this._data.chainSpecificProperties) === null || _a === void 0 ? void 0 : _a[(0, index_9.getChainId)()]) === null || _b === void 0 ? void 0 : _b.donateTo) !== null && _c !== void 0 ? _c : '';
        }
        get link() {
            var _a;
            return (_a = this._data.link) !== null && _a !== void 0 ? _a : '';
        }
        set link(value) {
            this._data.link = value;
        }
        get productId() {
            var _a, _b, _c;
            return (_c = (_b = (_a = this._data.chainSpecificProperties) === null || _a === void 0 ? void 0 : _a[(0, index_9.getChainId)()]) === null || _b === void 0 ? void 0 : _b.productId) !== null && _c !== void 0 ? _c : 0;
        }
        get productType() {
            var _a;
            return (_a = this._data.productType) !== null && _a !== void 0 ? _a : index_7.ProductType.Buy;
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
        get logo() {
            var _a;
            return (_a = this._data.logo) !== null && _a !== void 0 ? _a : '';
        }
        set logo(value) {
            this._data.logo = value;
        }
        get logoUrl() {
            return this._data.logoUrl;
        }
        set logoUrl(value) {
            this._data.logoUrl = value;
        }
        get commissions() {
            var _a;
            return (_a = this._data.commissions) !== null && _a !== void 0 ? _a : [];
        }
        set commissions(value) {
            this._data.commissions = value;
        }
        get chainSpecificProperties() {
            var _a;
            return (_a = this._data.chainSpecificProperties) !== null && _a !== void 0 ? _a : {};
        }
        set chainSpecificProperties(value) {
            this._data.chainSpecificProperties = value;
        }
        get wallets() {
            var _a;
            return (_a = this._data.wallets) !== null && _a !== void 0 ? _a : [];
        }
        set wallets(value) {
            this._data.wallets = value;
        }
        get networks() {
            var _a;
            return (_a = this._data.networks) !== null && _a !== void 0 ? _a : [];
        }
        set networks(value) {
            this._data.networks = value;
        }
        get showHeader() {
            var _a;
            return (_a = this._data.showHeader) !== null && _a !== void 0 ? _a : true;
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
        registerEvent() {
            this.clientEvents.push(this.$eventBus.register(this, "chainChanged" /* EventId.chainChanged */, this.onChainChanged));
        }
        async onSetupPage() {
            await this.initApprovalAction();
        }
        _getActions(category) {
            let self = this;
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
                                _oldData = Object.assign({}, this._data);
                                let resultingData = Object.assign(Object.assign({}, self._data), { commissions: userInputData.commissions });
                                await self.setData(resultingData);
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this._data);
                            },
                            undo: async () => {
                                this._data = Object.assign({}, _oldData);
                                await self.setData(this._data);
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this._data);
                            },
                            redo: () => { }
                        };
                    },
                    customUI: {
                        render: (data, onConfirm) => {
                            const vstack = new components_3.VStack();
                            const config = new scom_commission_fee_setup_1.default(null, {
                                commissions: self._data.commissions,
                                fee: (0, index_9.getEmbedderCommissionFee)(),
                                networks: self._data.networks
                            });
                            const hstack = new components_3.HStack(null, {
                                verticalAlignment: 'center',
                            });
                            const button = new components_3.Button(hstack, {
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
                    name: 'Settings',
                    icon: 'cog',
                    command: (builder, userInputData) => {
                        let _oldData = {
                            wallets: [],
                            networks: [],
                            defaultChainId: 0
                        };
                        return {
                            execute: async () => {
                                _oldData = Object.assign({}, this._data);
                                Object.assign(this._data, {
                                    name: userInputData.name,
                                    title: userInputData.title,
                                    productType: userInputData.productType,
                                    logo: userInputData.logo,
                                    logoUrl: userInputData.logoUrl,
                                    description: userInputData.description,
                                    link: userInputData.link
                                });
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this._data);
                                this.refreshDApp();
                                // await this.newProduct((error: Error, receipt?: string) => {
                                //   if (error) {
                                //     this.showTxStatusModal('error', error);
                                //   }
                                // }, this.updateSpotsRemaining);
                            },
                            undo: () => {
                                this._data = Object.assign({}, _oldData);
                                this.refreshDApp();
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this._data);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: formSchema_json_1.default.general.dataSchema
                });
                actions.push({
                    name: 'Theme Settings',
                    icon: 'palette',
                    command: (builder, userInputData) => {
                        let oldTag = {};
                        return {
                            execute: async () => {
                                if (!userInputData)
                                    return;
                                oldTag = JSON.parse(JSON.stringify(this.tag));
                                if (builder)
                                    builder.setTag(userInputData);
                                else
                                    this.setTag(userInputData);
                                if (this.containerDapp)
                                    this.containerDapp.setTag(userInputData);
                            },
                            undo: () => {
                                if (!userInputData)
                                    return;
                                this.tag = JSON.parse(JSON.stringify(oldTag));
                                if (builder)
                                    builder.setTag(this.tag);
                                else
                                    this.setTag(this.tag);
                                if (this.containerDapp)
                                    this.containerDapp.setTag(this.tag);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: formSchema_json_1.default.theme.dataSchema
                });
            }
            return actions;
        }
        getConfigurators() {
            let self = this;
            return [
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: (category) => {
                        return this._getActions(category);
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        const defaultData = data_json_1.default.defaultBuilderData;
                        await this.setData(Object.assign(Object.assign({}, defaultData), data));
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
                            let resultingData = Object.assign(Object.assign({}, self._data), { commissions });
                            await self.setData(resultingData);
                        }
                    },
                    bindOnChanged: (element, callback) => {
                        element.onChanged = async (data) => {
                            let resultingData = Object.assign(Object.assign({}, self._data), data);
                            await self.setData(resultingData);
                            await callback(data);
                        };
                    },
                    getData: () => {
                        const fee = (0, index_9.getEmbedderCommissionFee)();
                        return Object.assign(Object.assign({}, this.getData()), { fee });
                    },
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
            var _a;
            this._data = data;
            const rpcWalletId = await (0, index_9.initRpcWallet)(this.defaultChainId);
            const rpcWallet = (0, index_9.getRpcWallet)();
            const event = rpcWallet.registerWalletEvent(this, eth_wallet_7.Constants.RpcWalletEvent.Connected, async (connected) => {
                this.onSetupPage();
                this.updateContractAddress();
                this.refreshDApp();
            });
            this.rpcWalletEvents.push(event);
            const dappData = {
                wallets: this.wallets,
                networks: this.networks,
                showHeader: this.showHeader,
                defaultChainId: this.defaultChainId,
                rpcWalletId: rpcWallet.instanceId
            };
            if ((_a = this.containerDapp) === null || _a === void 0 ? void 0 : _a.setData)
                this.containerDapp.setData(dappData);
            if (!this.tokenInput.isConnected)
                await this.tokenInput.ready();
            if (this.tokenInput.rpcWalletId !== rpcWallet.instanceId) {
                this.tokenInput.rpcWalletId = rpcWallet.instanceId;
            }
            await this.onSetupPage();
            const commissionFee = (0, index_9.getEmbedderCommissionFee)();
            if (!this.lbOrderTotalTitle.isConnected)
                await this.lbOrderTotalTitle.ready();
            this.lbOrderTotalTitle.caption = `Total`;
            this.iconOrderTotal.tooltip.content = `A commission fee of ${new eth_wallet_7.BigNumber(commissionFee).times(100)}% will be applied to the amount you input.`;
            this.updateContractAddress();
            await this.refreshDApp();
        }
        getTag() {
            return this.tag;
        }
        updateTag(type, value) {
            var _a;
            this.tag[type] = (_a = this.tag[type]) !== null && _a !== void 0 ? _a : {};
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
            var _a, _b, _c, _d, _e, _f;
            const themeVar = ((_a = this.containerDapp) === null || _a === void 0 ? void 0 : _a.theme) || 'dark';
            this.updateStyle('--text-primary', (_b = this.tag[themeVar]) === null || _b === void 0 ? void 0 : _b.fontColor);
            this.updateStyle('--background-main', (_c = this.tag[themeVar]) === null || _c === void 0 ? void 0 : _c.backgroundColor);
            this.updateStyle('--input-font_color', (_d = this.tag[themeVar]) === null || _d === void 0 ? void 0 : _d.inputFontColor);
            this.updateStyle('--input-background', (_e = this.tag[themeVar]) === null || _e === void 0 ? void 0 : _e.inputBackgroundColor);
            this.updateStyle('--colors-primary-main', (_f = this.tag[themeVar]) === null || _f === void 0 ? void 0 : _f.buttonBackgroundColor);
        }
        // private newProduct = async (callback?: any, confirmationCallback?: any) => {
        //   if (
        //     this._data.productId >= 0
        //   ) return;
        //   const result = await newProduct(
        //     this._data.productType,
        //     this._data.qty,
        //     this._data.maxOrderQty,
        //     this._data.price,
        //     this._data.maxPrice,
        //     this._data.token,
        //     callback,
        //     confirmationCallback
        //   );
        //   this._productId = this._data.productId = result.productId;
        // }
        async initWallet() {
            try {
                await eth_wallet_7.Wallet.getClientInstance().init();
                const rpcWallet = (0, index_9.getRpcWallet)();
                await rpcWallet.init();
            }
            catch (_a) { }
        }
        async updateDAppUI(data) {
            var _a;
            this.markdownViewer.load(data.description || '');
            this.pnlLink.visible = !!data.link;
            (!this.lblLink.isConnected) && await this.lblLink.ready();
            this.lblLink.caption = data.link || '';
            this.lblLink.link.href = data.link;
            if (data.logo) {
                this.imgLogo.url = (0, index_9.getIPFSGatewayUrl)() + data.logo;
            }
            else if ((_a = data.logoUrl) === null || _a === void 0 ? void 0 : _a.startsWith('ipfs://')) {
                const ipfsGatewayUrl = (0, index_9.getIPFSGatewayUrl)();
                this.imgLogo.url = data.logoUrl.replace('ipfs://', ipfsGatewayUrl);
            }
            else {
                this.imgLogo.url = data.logoUrl || "";
            }
            (!this.lblTitle.isConnected) && await this.lblTitle.ready();
            this.lblTitle.caption = data.title || '';
        }
        async refreshDApp() {
            setTimeout(async () => {
                this._type = this._data.productType;
                let tmpData = JSON.parse(JSON.stringify(this._data));
                if (!this._data.title && !this._data.description && !this._data.logo && !this._data.logoUrl && !this._data.link) {
                    Object.assign(tmpData, {
                        title: "Title",
                        description: "#### Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                        logoUrl: "https://placehold.co/600x400?text=No+Image"
                    });
                }
                await this.updateDAppUI(tmpData);
                if (!this.productId || this.productId === 0)
                    return;
                await this.initWallet();
                this.productInfo = await (0, API_1.getProductInfo)(this.productId);
                if (this.productInfo) {
                    const token = this.productInfo.token;
                    this.pnlInputFields.visible = true;
                    this.pnlUnsupportedNetwork.visible = false;
                    const price = eth_wallet_7.Utils.fromDecimals(this.productInfo.price, token.decimals).toFixed();
                    (!this.lblRef.isConnected) && await this.lblRef.ready();
                    if (this._type === index_7.ProductType.Buy) {
                        this.lblYouPay.caption = `You pay`;
                        this.pnlMintFee.visible = true;
                        this.lblMintFee.caption = `${price !== null && price !== void 0 ? price : ""} ${(token === null || token === void 0 ? void 0 : token.symbol) || ""}`;
                        this.lblTitle.caption = this._data.title;
                        this.btnSubmit.caption = 'Mint';
                        this.lblRef.caption = 'smart contract:';
                        this.updateSpotsRemaining();
                        // this.gridTokenInput.visible = false;
                        this.tokenInput.inputReadOnly = true;
                        this.pnlQty.visible = true;
                        this.pnlSpotsRemaining.visible = true;
                        this.pnlMaxQty.visible = true;
                        this.lblMaxQty.caption = this.productInfo.maxQuantity.toFixed();
                    }
                    else {
                        this.lblYouPay.caption = `Your donation`;
                        this.pnlMintFee.visible = false;
                        this.lblTitle.caption = this._data.title || 'Make a Contributon';
                        this.btnSubmit.caption = 'Submit';
                        this.lblRef.caption = 'All proceeds will go to following vetted wallet address:';
                        // this.gridTokenInput.visible = true;
                        this.tokenInput.inputReadOnly = false;
                        this.pnlQty.visible = false;
                        this.pnlSpotsRemaining.visible = false;
                        this.pnlMaxQty.visible = false;
                    }
                    this.edtQty.value = "";
                    this.tokenInput.value = "";
                    this.lbOrderTotal.caption = "0";
                    (!this.lblAddress.isConnected) && await this.lblAddress.ready();
                    this.lblAddress.caption = this.contractAddress;
                    // this.tokenInput.tokenReadOnly = this._data.token ? true : new BigNumber(price).gt(0);
                    this.tokenInput.token = token;
                    this.updateTokenBalance();
                    // this.lblBalance.caption = (await getTokenBalance(this._data.token)).toFixed(2);
                }
                else {
                    this.pnlInputFields.visible = false;
                    this.pnlUnsupportedNetwork.visible = true;
                }
            });
        }
        updateSpotsRemaining() {
            if (this.productId >= 0) {
                this.lblSpotsRemaining.caption = `${this.productInfo.quantity.toFixed()}`;
            }
            else {
                this.lblSpotsRemaining.caption = '';
            }
        }
        showTxStatusModal(status, content) {
            if (!this.txStatusModal)
                return;
            let params = { status };
            if (status === 'success') {
                params.txtHash = content;
            }
            else {
                params.content = content;
            }
            this.txStatusModal.message = Object.assign({}, params);
            this.txStatusModal.showModal();
        }
        async initApprovalAction() {
            if (!this.approvalModelAction) {
                this.contractAddress = (0, index_9.getContractAddress)('Proxy');
                this.approvalModelAction = (0, index_8.getERC20ApprovalModelAction)(this.contractAddress, {
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
                        this.btnSubmit.enabled = new eth_wallet_7.BigNumber(this.tokenAmountIn).gt(0);
                    },
                    onApproving: async (token, receipt) => {
                        this.isApproving = true;
                        this.btnApprove.rightIcon.spin = true;
                        this.btnApprove.rightIcon.visible = true;
                        this.btnApprove.caption = `Approving ${token.symbol}`;
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
                    },
                    onPayingError: async (err) => {
                        this.showTxStatusModal('error', err);
                    }
                });
            }
        }
        updateContractAddress() {
            if (this.approvalModelAction) {
                if (!this._data.commissions || this._data.commissions.length == 0 || !this._data.commissions.find(v => v.chainId == (0, index_9.getChainId)())) {
                    this.contractAddress = (0, index_9.getContractAddress)('ProductInfo');
                }
                else {
                    this.contractAddress = (0, index_9.getContractAddress)('Proxy');
                }
                this.approvalModelAction.setSpenderAddress(this.contractAddress);
            }
        }
        async selectToken(token) {
            const symbol = (token === null || token === void 0 ? void 0 : token.symbol) || '';
            this.lblBalance.caption = `${(await (0, index_8.getTokenBalance)(token)).toFixed(2)} ${symbol}`;
        }
        updateSubmitButton(submitting) {
            this.btnSubmit.rightIcon.spin = submitting;
            this.btnSubmit.rightIcon.visible = submitting;
        }
        onApprove() {
            this.showTxStatusModal('warning', 'Approving');
            this.approvalModelAction.doApproveAction(this.productInfo.token, this.tokenAmountIn);
        }
        async onQtyChanged() {
            var _a, _b;
            const qty = Number(this.edtQty.value);
            if (qty === 0) {
                this.tokenAmountIn = '0';
                this.tokenInput.value = '0';
                this.lbOrderTotal.caption = `0 ${((_a = this.productInfo.token) === null || _a === void 0 ? void 0 : _a.symbol) || ''}`;
            }
            else {
                this.tokenAmountIn = (0, API_1.getProxyTokenAmountIn)(this.productInfo.price.toFixed(), qty, this._data.commissions);
                const price = eth_wallet_7.Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals);
                const amount = price.times(qty);
                this.tokenInput.value = amount.toFixed();
                const commissionFee = (0, index_9.getEmbedderCommissionFee)();
                const total = amount.plus(amount.times(commissionFee));
                this.lbOrderTotal.caption = `${total} ${((_b = this.productInfo.token) === null || _b === void 0 ? void 0 : _b.symbol) || ''}`;
            }
            if (this.productInfo)
                this.approvalModelAction.checkAllowance(this.productInfo.token, this.tokenAmountIn);
        }
        async onAmountChanged() {
            var _a;
            let amount = Number(this.tokenInput.value);
            if (amount === 0 || !this.productInfo) {
                this.tokenAmountIn = '0';
                this.tokenInput.value = '0';
            }
            else {
                this.tokenAmountIn = (0, API_1.getProxyTokenAmountIn)(this.productInfo.price.toFixed(), amount, this._data.commissions);
            }
            amount = Number(this.tokenInput.value);
            const commissionFee = (0, index_9.getEmbedderCommissionFee)();
            const total = new eth_wallet_7.BigNumber(amount).plus(new eth_wallet_7.BigNumber(amount).times(commissionFee));
            const token = (_a = this.productInfo) === null || _a === void 0 ? void 0 : _a.token;
            this.lbOrderTotal.caption = `${total} ${(token === null || token === void 0 ? void 0 : token.symbol) || ''}`;
            token && this.approvalModelAction.checkAllowance(token, this.tokenAmountIn);
        }
        async doSubmitAction() {
            var _a;
            if (!this._data || !this.productId)
                return;
            this.updateSubmitButton(true);
            // const chainId = getChainId();
            if ((this._type === index_7.ProductType.DonateToOwner || this._type === index_7.ProductType.DonateToEveryone) && !this.tokenInput.token) {
                this.showTxStatusModal('error', 'Token Required');
                this.updateSubmitButton(false);
                return;
            }
            // if (this._type === ProductType.Buy && chainId !== this._data.chainId) {
            //   this.showTxStatusModal('error', 'Unsupported Network');
            //   this.updateSubmitButton(false);
            //   return;
            // }
            const token = this.productInfo.token;
            const balance = await (0, index_8.getTokenBalance)(token);
            if (this._type === index_7.ProductType.Buy) {
                if (this.edtQty.value && new eth_wallet_7.BigNumber(this.edtQty.value).gt(this.productInfo.maxQuantity)) {
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
                    const product = await (0, API_1.getProductInfo)(this.productId);
                    if (product.quantity.lt(requireQty)) {
                        this.showTxStatusModal('error', 'Out of stock');
                        this.updateSubmitButton(false);
                        return;
                    }
                }
                const maxOrderQty = new eth_wallet_7.BigNumber((_a = this.productInfo.maxQuantity) !== null && _a !== void 0 ? _a : 0);
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
        }
        async onSubmit() {
            this.showTxStatusModal('warning', 'Confirming');
            this.approvalModelAction.doPayAction();
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
            if (this._data.productType == index_7.ProductType.DonateToOwner || this._data.productType == index_7.ProductType.DonateToEveryone) {
                await (0, API_1.donate)(this.productId, this.donateTo, this.tokenInput.value, this._data.commissions, token, callback, async () => {
                    await this.updateTokenBalance();
                });
            }
            else if (this._data.productType == index_7.ProductType.Buy) {
                await (0, API_1.buyProduct)(this.productId, quantity, this._data.commissions, token, callback, async () => {
                    await this.updateTokenBalance();
                    this.updateSpotsRemaining();
                });
            }
        }
        render() {
            return (this.$render("i-panel", null,
                this.$render("i-scom-dapp-container", { id: "containerDapp" },
                    this.$render("i-panel", { background: { color: Theme.background.main } },
                        this.$render("i-grid-layout", { id: 'gridDApp', width: '100%', height: '100%', templateColumns: ['1fr'], padding: { bottom: '1.563rem' } },
                            this.$render("i-vstack", { gap: "0.5rem", padding: { top: '1.75rem', bottom: '1rem', left: '1rem', right: '1rem' }, verticalAlignment: 'space-between' },
                                this.$render("i-vstack", { class: "text-center", margin: { bottom: '0.25rem' }, gap: "0.5rem" },
                                    this.$render("i-image", { id: 'imgLogo', class: index_css_1.imageStyle, height: 100 }),
                                    this.$render("i-label", { id: 'lblTitle', font: { bold: true, size: '1.5rem' } }),
                                    this.$render("i-markdown", { id: 'markdownViewer', class: index_css_1.markdownStyle, width: '100%', height: '100%', margin: { bottom: '0.563rem' } })),
                                this.$render("i-hstack", { id: 'pnlMintFee', visible: false, gap: '0.25rem' },
                                    this.$render("i-label", { caption: 'Mint Fee:', font: { bold: true, size: '0.875rem' } }),
                                    this.$render("i-label", { id: 'lblMintFee', font: { size: '0.875rem' } })),
                                this.$render("i-hstack", { id: 'pnlSpotsRemaining', visible: false, gap: '0.25rem' },
                                    this.$render("i-label", { caption: 'Spots Remaining:', font: { bold: true, size: '0.875rem' } }),
                                    this.$render("i-label", { id: 'lblSpotsRemaining', font: { size: '0.875rem' } })),
                                this.$render("i-hstack", { id: 'pnlMaxQty', visible: false, gap: '0.25rem' },
                                    this.$render("i-label", { caption: 'Max Quantity per Order:', font: { bold: true, size: '0.875rem' } }),
                                    this.$render("i-label", { id: 'lblMaxQty', font: { size: '0.875rem' } })),
                                this.$render("i-vstack", { gap: '0.5rem' },
                                    this.$render("i-vstack", { gap: '0.5rem', id: 'pnlInputFields' },
                                        this.$render("i-vstack", { gap: '0.25rem', margin: { bottom: '1rem' } },
                                            this.$render("i-hstack", { id: 'pnlQty', visible: false, horizontalAlignment: 'center', verticalAlignment: 'center', gap: "0.5rem", width: "50%", margin: { top: '0.75rem', left: 'auto', right: 'auto' } },
                                                this.$render("i-label", { caption: 'Qty', font: { weight: 500, size: '1rem' } }),
                                                this.$render("i-input", { id: 'edtQty', onChanged: this.onQtyChanged.bind(this), class: index_css_1.inputStyle, inputType: 'number', font: { size: '0.875rem' }, border: { radius: 4 }, background: { color: Theme.input.background } })),
                                            this.$render("i-hstack", { horizontalAlignment: 'space-between', verticalAlignment: 'center', gap: "0.5rem" },
                                                this.$render("i-label", { id: "lblYouPay", font: { weight: 500, size: '1rem' } }),
                                                this.$render("i-hstack", { horizontalAlignment: 'end', verticalAlignment: 'center', gap: "0.5rem", opacity: 0.6 },
                                                    this.$render("i-label", { caption: 'Balance:', font: { size: '1rem' } }),
                                                    this.$render("i-label", { id: 'lblBalance', font: { size: '1rem' }, caption: "0.00" }))),
                                            this.$render("i-grid-layout", { id: 'gridTokenInput', templateColumns: ['100%'], overflow: "hidden", background: { color: Theme.input.background }, font: { color: Theme.input.fontColor }, height: 56, width: "50%", margin: { left: 'auto', right: 'auto' }, verticalAlignment: "center", class: index_css_1.inputGroupStyle },
                                                this.$render("i-scom-token-input", { id: "tokenInput", tokenReadOnly: true, isBtnMaxShown: false, isCommonShown: false, isBalanceShown: false, isSortBalanceShown: false, class: index_css_1.tokenSelectionStyle, width: "100%", height: "100%", placeholder: "0.00", onSelectToken: this.selectToken, onInputAmountChanged: this.onAmountChanged })),
                                            this.$render("i-vstack", { horizontalAlignment: "center", verticalAlignment: 'center', gap: "8px", width: "50%", margin: { top: '0.75rem', left: 'auto', right: 'auto' } },
                                                this.$render("i-button", { id: "btnApprove", width: '100%', caption: "Approve", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText, bold: true }, rightIcon: { visible: false, fill: Theme.colors.primary.contrastText }, border: { radius: 12 }, visible: false, onClick: this.onApprove.bind(this) }),
                                                this.$render("i-button", { id: 'btnSubmit', width: '100%', caption: 'Submit', padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, font: { size: '1rem', color: Theme.colors.primary.contrastText, bold: true }, rightIcon: { visible: false, fill: Theme.colors.primary.contrastText }, background: { color: Theme.background.gradient }, border: { radius: 12 }, onClick: this.onSubmit.bind(this), enabled: false }))),
                                        this.$render("i-hstack", { horizontalAlignment: "space-between", verticalAlignment: 'center' },
                                            this.$render("i-hstack", { verticalAlignment: 'center', gap: "0.5rem" },
                                                this.$render("i-label", { id: "lbOrderTotalTitle", caption: 'Total', font: { size: '1rem' } }),
                                                this.$render("i-icon", { id: "iconOrderTotal", name: "question-circle", fill: Theme.background.modal, width: 20, height: 20 })),
                                            this.$render("i-label", { id: 'lbOrderTotal', font: { size: '1rem' }, caption: "0" })),
                                        this.$render("i-vstack", { gap: '0.25rem', margin: { top: '1rem' } },
                                            this.$render("i-label", { id: 'lblRef', font: { size: '0.875rem' }, opacity: 0.5 }),
                                            this.$render("i-label", { id: 'lblAddress', font: { size: '0.875rem' }, overflowWrap: 'anywhere' }))),
                                    this.$render("i-vstack", { id: 'pnlUnsupportedNetwork', visible: false, horizontalAlignment: 'center' },
                                        this.$render("i-label", { caption: 'This network is not supported.', font: { size: '1.5rem' } })),
                                    this.$render("i-label", { caption: 'Terms & Condition', font: { size: '0.875rem' }, link: { href: 'https://docs.scom.dev/' }, opacity: 0.6, margin: { top: '1rem' } }))),
                            this.$render("i-hstack", { id: 'pnlLink', visible: false, verticalAlignment: 'center', gap: '0.25rem', padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' } },
                                this.$render("i-label", { caption: 'Details here: ', font: { size: '1rem' } }),
                                this.$render("i-label", { id: 'lblLink', font: { size: '1rem' } }))),
                        this.$render("i-scom-commission-fee-setup", { visible: false }),
                        this.$render("i-scom-tx-status-modal", { id: "txStatusModal" })))));
        }
    };
    ScomNftMinter = __decorate([
        components_3.customModule,
        (0, components_3.customElements)('i-scom-nft-minter')
    ], ScomNftMinter);
    exports.default = ScomNftMinter;
});
