export default {
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
    },   
    "defaultExistingNft": { //existing custom721 or custom1155
        "chainId": 97,
        "nftType":"ERC1155",
        "nftAddress":"0xa5CDA5D7F379145b97B47aD1c2d78f827C053D91",
        "erc1155Index":1
    },
    "defaultCreate1155Index": {

    },
    "defaultOswapTroll": { //existing custom721 or custom1155
        "chainId": 97,
        "nftType":"ERC721",
        "nftAddress":"0x946985e7C43Ed2fc7985e89a49A251D52d824122",
    },
}