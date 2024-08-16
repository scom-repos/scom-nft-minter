import ScomNetworkPicker from "@scom/scom-network-picker";
import ScomTokenInput, { CUSTOM_TOKEN } from "@scom/scom-token-input";
import { Input } from "@ijstech/components";
import { formInputStyle } from "./index.css";
import { ITokenObject } from "@scom/scom-token-list";
import { nullAddress } from "./utils/index";
import { State, SupportedERC20Tokens } from "./store/index";
import { ScomNftMinterFieldUpdate } from "./component";

const chainIds = [1, 56, 137, 250, 97, 80001, 43113, 43114];
const networks = chainIds.map(v => { return { chainId: v } });

const getSupportedTokens = (chainId: number) => {
    return SupportedERC20Tokens[chainId] || [];
}


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
}

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
}

export function getBuilderSchema() {
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
    }
}

function getProjectOwnerSchema(isDonation?: boolean) {
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
            erc1155Index: {//for 1155 only
                type: 'integer',
                title: 'Index',
                tooltip: 'The index of your NFT inside the ERC1155 contract',
                minimum: 1,
            },

            tokenToMint: {//for 1155 new index only
                type: 'string',
                title: 'Currency',
                tooltip: 'Token to mint the NFT',
            },
            priceToMint: {//for 1155 new index only
                type: 'number',
                tooltip: 'Amount of token to mint the NFT',
            },
            maxQty: {//for 1155 new index only
                type: 'integer',
                title: 'Max Subscription Allowed',
                tooltip: 'Max quantity of this NFT existing',
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
    }
}

//1155NewIndex
export function getProjectOwnerSchema1() {
    return {
        dataSchema: {
            type: 'object',
            properties: {
                chainId: {
                    type: 'number',
                    title: 'Chain',
                    enum: chainIds,
                    required: true
                },
                tokenToMint: {
                    type: 'string',
                    title: 'Currency',
                    tooltip: 'Token to mint the NFT',
                    required: true
                },
                customMintToken: {
                    type: 'string',
                    title: 'Currency Address',
                    tooltip: 'Token address to mint the NFT',
                    required: true
                },
                priceToMint: {
                    type: 'number',
                    tooltip: 'Amount of token to mint the NFT',
                    required: true
                },
                maxQty: {
                    type: 'integer',
                    title: 'Max Subscription Allowed',
                    tooltip: 'Max quantity of this NFT existing',
                    minimum: 1,
                    required: true
                },
                uri: {
                    type: 'string',
                    title: 'URI',
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
                                                const: CUSTOM_TOKEN.address
                                            }
                                        }
                                    }
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/priceToMint',
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/maxQty',
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/uri',
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        customControls() {
            return getCustomControls(true);
        }
    }
}

//existing custom721 or custom1155
export function getProjectOwnerSchema2(state: State, functions: { connectWallet: any, showTxStatusModal: any, refreshUI: any }) {
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
                    required: true
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
                    required: true
                },
                erc1155Index: {//for 1155 only
                    type: 'integer',
                    title: 'Index',
                    tooltip: 'The index of your NFT inside the ERC1155 contract',
                    minimum: 1,
                },
                newPrice: {
                    type: 'number',
                    title: 'Update Price To',
                },
                newUri: {
                    type: 'string',
                    title: 'Update URI To',
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
                                },
                            ]
                        }
                    ]
                },
            ]
        },
        customControls() {
            return {
                '#/properties/chainId': {
                    render: () => {
                        const networkPicker = new ScomNetworkPicker(undefined, {
                            type: 'combobox',
                            networks
                        });
                        return networkPicker;
                    },
                    getData: (control: ScomNetworkPicker) => {
                        return control.selectedNetwork?.chainId;
                    },
                    setData: async (control: ScomNetworkPicker, value: number) => {
                        await control.ready();
                        control.setNetworkByChainId(value);
                    }
                },
                '#/properties/newPrice': {
                    render: () => {
                        const fieldUpdate = new ScomNftMinterFieldUpdate(undefined, {
                            refreshUI: () => functions.refreshUI(),
                            connectWallet: () => functions.connectWallet(),
                            showTxStatusModal: (status: 'warning' | 'success' | 'error', content?: string | Error) => functions.showTxStatusModal(status, content),
                            state,
                            value: ''
                        });
                        return fieldUpdate;
                    },
                    getData: (control: ScomNftMinterFieldUpdate) => {
                        if (control.value == 0) return 0;
                        return control.value ? Number(control.value) : '';
                    },
                    setData: async (control: ScomNftMinterFieldUpdate, value: number) => {
                        await control.ready();
                        control.value = '';
                    }
                },
                '#/properties/newUri': {
                    render: () => {
                        const fieldUpdate = new ScomNftMinterFieldUpdate(undefined, {
                            isUri: true,
                            refreshUI: () => functions.refreshUI(),
                            connectWallet: () => functions.connectWallet(),
                            showTxStatusModal: (status: 'warning' | 'success' | 'error', content?: string | Error) => functions.showTxStatusModal(status, content),
                            state,
                            value: ''
                        });
                        return fieldUpdate;
                    },
                    getData: (control: ScomNftMinterFieldUpdate) => {
                        return control.value;
                    },
                    setData: async (control: ScomNftMinterFieldUpdate, value: number) => {
                        await control.ready();
                        control.value = '';
                    }
                }
            }
        }
    }
}

export function getProjectOwnerSchema3(isDefault1155New: boolean, state: State, functions: { connectWallet: any, showTxStatusModal: any, refreshUI: any }) {
    return isDefault1155New ? getProjectOwnerSchema1() : getProjectOwnerSchema2(state, functions);
}

const getCustomControls = (isCustomToken?: boolean) => {
    let networkPicker: ScomNetworkPicker;
    let tokenInput: ScomTokenInput;
    let customTokenInput: Input;

    const controls = {
        '#/properties/chainId': {
            render: () => {
                networkPicker = new ScomNetworkPicker(undefined, {
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
            getData: (control: ScomNetworkPicker) => {
                return control.selectedNetwork?.chainId;
            },
            setData: async (control: ScomNetworkPicker, value: number) => {
                await control.ready();
                control.setNetworkByChainId(value);
                if (tokenInput && value !== tokenInput.chainId) {
                    const noChainId = !tokenInput.chainId;
                    tokenInput.chainId = value;
                    tokenInput.tokenDataListProp = getSupportedTokens(value);
                    if (noChainId && tokenInput.address) {
                        tokenInput.address = tokenInput.address;
                        tokenInput.onSelectToken(tokenInput.token);
                    } else {
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
                tokenInput = new ScomTokenInput(undefined, {
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
                    tokenInput.onSelectToken = (token: ITokenObject) => {
                        if (!token) {
                            customTokenInput.value = '';
                        } else {
                            const { address } = token;
                            const isCustomToken = address?.toLowerCase() === CUSTOM_TOKEN.address.toLowerCase();
                            if (!isCustomToken) {
                                customTokenInput.value = (address && address !== nullAddress) ? address : 'Native Token';
                                if (customTokenInput.value) (customTokenInput as any).onChanged();
                            } else {
                                customTokenInput.value = '';
                            }
                        }
                        if (isCustomToken && tokenInput.onChanged) {
                            tokenInput.onChanged(tokenInput.token);
                        }
                    }
                }
                return tokenInput;
            },
            getData: (control: ScomTokenInput) => {
                const value = (control.token?.address || control.token?.symbol);
                return value;
            },
            setData: async (control: ScomTokenInput, value: string, rowData: any) => {
                await control.ready();
                control.chainId = rowData?.chainId;
                control.address = value;
                if (isCustomToken && control.onChanged) {
                    control.onChanged(control.token);
                }
                if (customTokenInput) {
                    const isCustomToken = value?.toLowerCase() === CUSTOM_TOKEN.address.toLowerCase();
                    if (!isCustomToken) {
                        customTokenInput.value = (value && value !== nullAddress) ? value : 'Native Token';
                        if (customTokenInput.value) (customTokenInput as any).onChanged();
                    }
                }
            }
        }
    }

    if (isCustomToken) {
        controls['#/properties/customMintToken'] = {
            render: () => {
                customTokenInput = new Input(undefined, {
                    inputType: 'text',
                    height: '42px',
                    width: '100%'
                });
                customTokenInput.classList.add(formInputStyle);
                return customTokenInput;
            },
            getData: (control: Input) => {
                return control.value;
            },
            setData: async (control: Input, value: string) => {
                await control.ready();
                control.value = value;
                if (!value && tokenInput?.token) {
                    const address = tokenInput.address;
                    const isCustomToken = address?.toLowerCase() === CUSTOM_TOKEN.address.toLowerCase();
                    if (!isCustomToken) {
                        control.value = (address && address !== nullAddress) ? address : 'Native Token';
                    }
                }
            }
        };
    }

    return controls;
}