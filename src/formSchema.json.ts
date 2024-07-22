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
                required: true,
                enum: [
                    'ERC721',
                    'ERC1155'
                ]
            },
            chainId: {
                type: 'number',
                enum: chainIds,
                required: true
            },
            nftAddress:{
                type: 'string',
                minimum: 1,
                required: true
            },
            productId: {//for 1155 only
                type: 'integer',
                minimum: 1,
            },
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
                    label: 'General',
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
                                    scope: '#/properties/productType'
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/productId'
                                },
                                ...donateElements,
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