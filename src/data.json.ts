import { nullAddress } from "./utils/index";

export default {
    "infuraId": "adc596bf88b648e2a8902bc9093930c5",
    "contractInfo": {
        "97": {
            "ProductMarketplace": {
                "address": "0x9FcD44B7e2eE6Cd05E72b18CEB8bF15D918BCd60"
            },
            "OneTimePurchaseNFT": {
                "address": "0x6061FDC4f37a77e9A7333aD4d575ea32eEc44eE0"
            },
            "SubscriptionNFTFactory": {
                "address": "0x40E83b8211338E204926E447C54477F7FCAB1cF8"
            },
            "Promotion": {
                "address": "0xC1074403b4893D8Fe6aaB93780398e5F67ba2Bf0"
            },
            "Proxy": {
                "address": "0x9602cB9A782babc72b1b6C96E050273F631a6870"
            },
        },
        "43113": {
            "ProductMarketplace": {
                "address": "0x3b97dF29d6B9518F96b8Bc19f4cfEaf7Ee88f412"
            },
            "OneTimePurchaseNFT": {
                "address": "0xcf43916aaBa8955A0e034Fd2741269eA421F6428"
            },
            "SubscriptionNFTFactory": {
                "address": "0xC6d85c98b4A1428337aB784B5932Da11B7a1A707"
            },
            "Promotion": {
                "address": "0x0E1C3B28Cba10dCeDa742Aa567c7D28C4932B81d"
            },
            "Proxy": {
                "address": "0x7f1EAB0db83c02263539E3bFf99b638E61916B96"
            },
        }
    },
    "embedderCommissionFee": "0",
    "defaultBuilderData": {
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
        "chainId": 43113,
        "nftType": "ERC1155",
        "nftAddress": "0xDB301a9Ef98843376C835aFB41608d6A319e138D",
        "erc1155Index": 1
    },
    "defaultCreate1155Index": {
        "chainId": 43113,
        "tokenToMint": nullAddress
    },
    "defaultOswapTroll": { //existing custom721 or custom1155
        "chainId": 43113,
        "nftType": "ERC721",
        "nftAddress": "0x390118aa8bde8c63f159a0d032dbdc8bed83ef42",
    },
}