import ScomNetworkPicker from "@scom/scom-network-picker";

const chainIds = [1, 56, 137, 250, 97, 80001, 43113, 43114];
const networks = chainIds.map(v => { return { chainId: v } });

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

export function getProjectOwnerSchema(isDonation?: boolean) {
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
            erc1155Index: {//for 1155 only
                type: 'integer',
                title: 'Index',
                tooltip: 'The index of your NFT inside the ERC1155 contract',
                minimum: 1,
            },

            token: {//for 1155 new index only
                type: 'string',
                title: 'Token Address',
                tooltip: 'token to mint the NFT',
            },
            price: {//for 1155 new index only
                type: 'number',
                tooltip: 'amount of token to mint the NFT',
            },
            maxQty: {//for 1155 new index only
                type: 'integer',
                title: 'Max Quantity',
                tooltip: 'Max quantity of this NFT existing',
                minimum: 1,
            },
            txnMaxQty: {//for 1155 new index only
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
                                    scope: '#/properties/token',
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
                                    scope: '#/properties/price',
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