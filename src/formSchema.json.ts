const chainIds = [1, 56, 137, 250, 97, 80001, 43113, 43114];

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
                {
                    type: 'Category',
                    label: 'Theme',
                    elements: [
                        {
                            type: 'VerticalLayout',
                            elements: [
                                {
                                    type: 'Control',
                                    label: 'Dark',
                                    scope: '#/properties/dark'
                                },
                                {
                                    type: 'Control',
                                    label: 'Light',
                                    scope: '#/properties/light'
                                }
                            ]
                        }
                    ]
                }
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
            nftAddress:{
                type: 'string',
                title: 'NFT Address',
                minimum: 1,
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
                {
                    type: 'Category',
                    label: 'Theme',
                    elements: [
                        {
                            type: 'VerticalLayout',
                            elements: [
                                {
                                    type: 'Control',
                                    label: 'Dark',
                                    scope: '#/properties/dark'
                                },
                                {
                                    type: 'Control',
                                    label: 'Light',
                                    scope: '#/properties/light'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}