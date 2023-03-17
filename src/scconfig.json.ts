export default {
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
}