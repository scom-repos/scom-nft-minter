import ScomNetworkPicker from "@scom/scom-network-picker";

const chainIds = [1, 56, 137, 250, 97, 80001, 43113, 43114];
const networks = chainIds.map(v => { return { chainId: v } });
/**
enum NftType {
    ERC721='Custom ERC721 token',
    ERC1155='Custom ERC1155 token (existing index)',
    ERC1155NewIndex='Custom ERC1155 token (create new index)'
}  
 */


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
                title: 'Token Address',
                tooltip: 'token to mint the NFT',
            },
            priceToMint: {//for 1155 new index only
                type: 'number',
                tooltip: 'amount of token to mint the NFT',
            },
            maxQty: {//for 1155 new index only
                type: 'integer',
                title: 'Max Quantity',
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
                }
            }
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
                tokenToMint: {//for 1155 new index only
                    type: 'string',
                    title: 'Token Address',
                    tooltip: 'token to mint the NFT',
                    required: true
                },
                priceToMint: {//for 1155 new index only
                    type: 'number',
                    tooltip: 'amount of token to mint the NFT',
                    required: true
                },
                maxQty: {//for 1155 new index only
                    type: 'integer',
                    title: 'Max Quantity',
                    tooltip: 'Max quantity of this NFT existing',
                    minimum: 1,
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
                                    scope: '#/properties/tokenToMint',
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/priceToMint',
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/maxQty',
                                },
                            ]
                        }
                    ]
                }
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
                }
            }
        }
    }
}

//existing custom721 or custom1155
export function getProjectOwnerSchema2() {
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
                }
            }
        }
    }
}

export function getProjectOwnerSchema3(isDefault1155New:boolean) {
    return isDefault1155New?getProjectOwnerSchema1():getProjectOwnerSchema2();
}