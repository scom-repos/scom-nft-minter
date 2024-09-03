import { nullAddress } from "./utils/index";

export default {
    "infuraId": "adc596bf88b648e2a8902bc9093930c5",
    "contractInfo": {
        "97": {
            "ProductMarketplace": {
                "address": "0x93e684ad2AEE178e23675fbE5bA88c3e4e7467f4"
            },
            "OneTimePurchaseNFT": {
                "address": "0x5aE9c7f08572D52e2DB8508B502D767A1ECf21Bf"
            },
            "SubscriptionNFTFactory": {
                "address": "0x0055e4edb49425A29784Bd9a7986F5b56dcc8f6b"
            },
            "Promotion": {
                "address": "0x13d23201a8A6661881d701E1cF56A30A8eb0aE90"
            },
            "Commission": {
                "address": "0x7c3D10BEF2768519A605c64dfB59ec46791E59FD"
            },
            "Proxy": {
                "address": "0x9602cB9A782babc72b1b6C96E050273F631a6870"
            },
        },
        "43113": {
            "ProductMarketplace": {
                "address": "0xeC3747eAbf71D4BDF15Abb70398C04B642363D10"
            },
            "OneTimePurchaseNFT": {
                "address": "0x404eeCC44F7aFc1f7561b2A9bC475513206D4b15"
            },
            "SubscriptionNFTFactory": {
                "address": "0x9231761Bd5f32c8f6465d82168BAdaB109D23290"
            },
            "Promotion": {
                "address": "0x22786FF4E595f1B517242549ec1D263e62dc6F26"
            },
            "Commission": {
                "address": "0x7EcBbE9C35B280840633C4D53b4c32CC0c46827e"
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