# @scom/scom-nft-minter

The `i-scom-nft-minter` is a widget designed to facilitate the creation and management of NFTs (Non-Fungible Tokens) on various blockchain networks. This widget supports both ERC721 and ERC1155 standards, allowing users to mint, manage, and interact with NFTs seamlessly.

## Features

- **Multi-Chain Support**: Compatible with multiple blockchain networks.
- **ERC721 and ERC1155 Standards**: Supports both popular NFT standards.
- **Customizable Properties**: Easily configure properties such as name, title, NFT type, chain ID, and more.
- **User-Friendly Interface**: Intuitive UI for managing NFTs.
- **Integration with Wallets**: Connects with various wallet plugins for seamless transactions.
- **Dynamic Configuration**: Supports dynamic configuration and customization through embedded data.

## Installation

Follow the steps below to install and set up the Scom NFT Minter widget.

### Step 1: Install packages

Run the following command to install the necessary packages:

```sh
docker-compose up install
```

### Step 2: Build and bundle library

Build and bundle the library using the command:

```sh
docker-compose up build
```

### Test

#### Step 3: Install test packages

Install the packages required for testing:

```sh
docker-compose up installTest
```

#### Step 4: Build and run tests

Build the library and run the tests using the command:

```sh
docker-compose up test
```

Access the dev server via [http://localhost:8080/](http://localhost:8080/)

## Usage
To use the Scom NFT Minter Widget in your project, import it and include it in your component as follows:

```tsx
render() {
    return (
        <i-panel>           
            <i-scom-nft-minter
                id="nftMinter"
                nftType={'ERC1155'}
                nftAddress="0xDB301a9Ef98843376C835aFB41608d6A319e138D"
                tokenToMint={nullAddress} //Native token
                recipients={["0x0000000000000000000000000000000000000000", "0x1111111111111111111111111111111111111111"]}
                erc1155Index={1}
                chainId={43113}
                networks={[
                {
                    chainId: 43113
                }
                ]}
                defaultChainId={43113}
                wallets={[{ name: 'metamask' }]}
          />
        </i-panel>
    )
}
```
```