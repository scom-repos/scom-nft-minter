import { BigNumber, IMulticallContractCall, Utils, Wallet } from '@ijstech/eth-wallet';
import { ProductType, ICommissionInfo, IProductInfo } from './interface/index';
import { Contracts as ProductContracts } from '@scom/scom-product-contract';
import { Contracts as ProxyContracts } from '@scom/scom-commission-proxy-contract';
import { Contracts as OswapNftContracts } from "@scom/oswap-troll-nft-contract";
import { getTokenInfo, nullAddress, registerSendTxEvents } from './utils/index';
import { ITokenObject, tokenStore } from '@scom/scom-token-list';
import { State } from './store/index';
import getNetworkList from '@scom/scom-network-list';

async function getProductInfo(state: State, erc1155Index: number):Promise<IProductInfo> {
    let productInfoAddress = state.getContractAddress('ProductInfo');
    if (!productInfoAddress) return null;
    try {
        const wallet = state.getRpcWallet();
        const productInfo = new ProductContracts.ProductInfo(wallet, productInfoAddress);
        const product = await productInfo.products(erc1155Index);
        const chainId = wallet.chainId;
        if (product.token && product.token === nullAddress) {
            let net = getNetworkList().find(net=>net.chainId===chainId);
            return {
                ...product,
                token:{
                    chainId:wallet.chainId,
                    address:product.token,
                    decimals:net.nativeCurrency.decimals,
                    symbol:net.nativeCurrency.symbol,
                    name:net.nativeCurrency.symbol,
                }
            };
        }
        const _tokenList = tokenStore.getTokenList(chainId);
        let token: ITokenObject = _tokenList.find(token => product.token && token.address && token.address.toLowerCase() === product.token.toLowerCase());
        if (!token && product.token) {
            token = await getTokenInfo(product.token, chainId);
        }
        return {
            ...product,
            token
        };
    } catch {
        return null;
    }
}

async function getProductOwner(state: State, erc1155Index: number) {
    let productInfoAddress = state.getContractAddress('ProductInfo');
    if (!productInfoAddress) return null;
    try {
        const wallet = state.getRpcWallet();
        const productInfo = new ProductContracts.ProductInfo(wallet, productInfoAddress);
        const owner = await productInfo.productOwner(erc1155Index);
        return owner;
    } catch {
        return null;
    }
}

async function getNFTBalance(state: State, erc1155Index: number) {
    let product1155Address = state.getContractAddress('Product1155');
    if (!product1155Address) return null;
    try {
        const wallet = state.getRpcWallet();
        const product1155 = new ProductContracts.Product1155(wallet, product1155Address);
        const nftBalance = await product1155.balanceOf({ account: wallet.address, id: erc1155Index });
        return nftBalance.toFixed();
    } catch {
        return null;
    }
}

async function newProduct(
    productInfoAddress: string,

    productType: ProductType,
    qty: number,// max quantity of this nft can be exist at anytime
    maxQty: number, // max quantity for one buy() txn
    price: string,
    maxPrice: string, //for donation only, no max price when it is 0
    tokenAddress: string,//Native token 0x0000000000000000000000000000000000000000
    tokenDecimals: number,
    callback?: any,
    confirmationCallback?: any
) {
    const wallet = Wallet.getClientInstance();
    const productInfo = new ProductContracts.ProductInfo(wallet, productInfoAddress);
    registerSendTxEvents({
        transactionHash: callback,
        confirmation: confirmationCallback
    });
    let productTypeCode: number;
    switch (productType) {
        case ProductType.Buy:
            productTypeCode = 0;
            break;
        case ProductType.DonateToOwner:
            productTypeCode = 1;
            break;
        case ProductType.DonateToEveryone:
            productTypeCode = 2;
            break;
    }
    let receipt = await productInfo.newProduct({
        productType: productTypeCode,
        uri: '',
        quantity: qty,
        maxQuantity: maxQty,
        maxPrice: Utils.toDecimals(maxPrice, tokenDecimals),
        price: Utils.toDecimals(price, tokenDecimals),
        token: tokenAddress
    });
    let productId;
    if (receipt) {
        let event = productInfo.parseNewProductEvent(receipt)[0];
        productId = event?.productId.toNumber();
    }
    return {
        receipt,
        productId
    };
}

async function newDefaultBuyProduct(
    productInfoAddress: string,

    qty: number,// max quantity of this nft can be exist at anytime
    //maxQty = qty
    //maxQty: number, // max quantity for one buy() txn
    price: string,
    tokenAddress: string,
    tokenDecimals: number,
    callback?: any,
    confirmationCallback?: any
) {
    //hard requirement for the contract
    if (
        !(//tokenAddress is a valid address &&
        new BigNumber(tokenDecimals).gt(0) &&
        new BigNumber(qty).gt(0)
        )
    ) {
        console.log("newDefaultBuyProduct() error! require tokenDecimals and qty > 0");
        return;
    }
    
    if (!new BigNumber(price).gt(0)) {
        //warn that it will be free to mint
        console.log("newDefaultBuyProduct() warning! price = 0");
    }
    return await newProduct(
        productInfoAddress,
        ProductType.Buy,
        qty,
        qty, //maxQty
        price,
        "0",
        tokenAddress,
        tokenDecimals,
        callback,
        confirmationCallback);
}

function getProxyTokenAmountIn(productPrice: string, quantity: number, commissions: ICommissionInfo[]) {
    const amount = new BigNumber(productPrice).isZero() ? new BigNumber(quantity) : new BigNumber(productPrice).times(quantity);
    if (!commissions || !commissions.length) {
        return amount.toFixed();
    }
    const _commissions = commissions.map(v => {
        return {
            to: v.walletAddress,
            amount: amount.times(v.share)
        }
    })
    const commissionsAmount = _commissions.map(v => v.amount).reduce((a, b) => a.plus(b));
    return amount.plus(commissionsAmount).toFixed();
}

async function buyProduct(
    state: State,
    productId: number,
    quantity: number,
    commissions: ICommissionInfo[],
    token: ITokenObject,
    callback?: any,
    confirmationCallback?: any
) {
    let proxyAddress = state.getContractAddress('Proxy');
    let productInfoAddress = state.getContractAddress('ProductInfo');
    const wallet = Wallet.getClientInstance();
    const proxy = new ProxyContracts.Proxy(wallet, proxyAddress);
    const productInfo = new ProductContracts.ProductInfo(wallet, productInfoAddress);
    const product = await productInfo.products(productId);
    const amount = product.price.times(quantity);
    const _commissions = (commissions || []).filter(v => v.chainId === state.getChainId()).map(v => {
        return {
            to: v.walletAddress,
            amount: amount.times(v.share)
        }
    })
    const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)) : new BigNumber(0);
    let receipt;
    try {
        if (token?.address && token?.address !== nullAddress) {
            registerSendTxEvents({
                transactionHash: callback,
                confirmation: confirmationCallback
            });
            if (commissionsAmount.isZero()) {
                receipt = await productInfo.buy({
                    productId: productId,
                    quantity: quantity,
                    amountIn: amount,
                    to: wallet.address
                })
            }
            else {
                const txData = await productInfo.buy.txData({
                    productId: productId,
                    quantity: quantity,
                    amountIn: amount,
                    to: wallet.address
                });
                const tokensIn =
                {
                    token: token.address,
                    amount: amount.plus(commissionsAmount),
                    directTransfer: false,
                    commissions: _commissions
                };
                receipt = await proxy.tokenIn({
                    target: productInfoAddress,
                    tokensIn,
                    data: txData
                });
            }
        } else {
            registerSendTxEvents({
                transactionHash: callback,
                confirmation: confirmationCallback
            });
            if (commissionsAmount.isZero()) {
                receipt = await productInfo.buyEth({
                    productId: productId,
                    quantity,
                    to: wallet.address
                }, amount)
            }
            else {
                const txData = await productInfo.buyEth.txData({
                    productId: productId,
                    quantity,
                    to: wallet.address
                }, amount);
                receipt = await proxy.ethIn({
                    target: productInfoAddress,
                    commissions: _commissions,
                    data: txData
                }, amount.plus(commissionsAmount));
            }
        }
    }
    catch (err) {
        console.error(err);
    }
    return receipt;
}

async function donate(
    state: State,
    productId: number,
    donateTo: string,
    amountIn: string,
    commissions: ICommissionInfo[],
    token: ITokenObject,
    callback?: any,
    confirmationCallback?: any
) {
    let proxyAddress = state.getContractAddress('Proxy');
    let productInfoAddress = state.getContractAddress('ProductInfo');
    const wallet = Wallet.getClientInstance();
    const proxy = new ProxyContracts.Proxy(wallet, proxyAddress);
    const productInfo = new ProductContracts.ProductInfo(wallet, productInfoAddress);
    const tokenDecimals = token?.decimals || 18;
    const amount = Utils.toDecimals(amountIn, tokenDecimals);
    const _commissions = (commissions || []).map(v => {
        return {
            to: v.walletAddress,
            amount: amount.times(v.share)
        }
    })
    const commissionsAmount = _commissions.length ? _commissions.map(v => v.amount).reduce((a, b) => a.plus(b)) : new BigNumber(0);
    let receipt;
    try {
        if (token?.address) {
            registerSendTxEvents({
                transactionHash: callback,
                confirmation: confirmationCallback
            });
            if (commissionsAmount.isZero()) {
                receipt = await productInfo.donate({
                    donor: wallet.address,
                    donee: donateTo,
                    productId: productId,
                    amountIn: amount
                });
            }
            else {
                const txData = await productInfo.donate.txData({
                    donor: wallet.address,
                    donee: donateTo,
                    productId: productId,
                    amountIn: amount
                });
                const tokensIn =
                {
                    token: token.address,
                    amount: amount.plus(commissionsAmount),
                    directTransfer: false,
                    commissions: _commissions
                };
                receipt = await proxy.tokenIn({
                    target: productInfoAddress,
                    tokensIn,
                    data: txData
                });
            }
        } else {
            registerSendTxEvents({
                transactionHash: callback,
                confirmation: confirmationCallback
            });
            if (commissionsAmount.isZero()) {
                receipt = await productInfo.donateEth({
                    donor: wallet.address,
                    donee: donateTo,
                    productId: productId
                });
            }
            else {
                const txData = await productInfo.donateEth.txData({
                    donor: wallet.address,
                    donee: donateTo,
                    productId: productId
                }, amount);
                receipt = await proxy.ethIn({
                    target: productInfoAddress,
                    commissions: _commissions,
                    data: txData
                }, amount.plus(commissionsAmount));
            }
        }
    }
    catch (err) {
        console.error(err);
    }
    return receipt;
}

async function updateProductUri(productInfoAddress: string, productId: number | BigNumber, uri: string) {
    let wallet = Wallet.getClientInstance();
    const productInfo = new ProductContracts.ProductInfo(wallet, productInfoAddress);
    const receipt = await productInfo.updateProductUri({uri,productId});
    return receipt;
}

async function updateProductPrice(productInfoAddress: string, productId: number | BigNumber, price: number | BigNumber, tokenDecimals: number) {
    let wallet = Wallet.getClientInstance();
    const productInfo = new ProductContracts.ProductInfo(wallet, productInfoAddress);
    const receipt = await productInfo.updateProductPrice({price:BigNumber(price).shiftedBy(tokenDecimals),productId});
    return receipt;
}
//
//    ERC721 and oswap troll nft 
//
async function fetchUserNftBalance(state: State, address: string) {
    if (!address) return null;
    try {
        const wallet = state.getRpcWallet();
        const erc721 = new ProductContracts.ERC721(wallet, address);
        const nftBalance = await erc721.balanceOf(wallet.address);
        return nftBalance.toFixed();
    } catch {
        return null;
    }
}

async function mintOswapTrollNft(address: string, callback: (err: Error, receipt?: string) => void) {
    if (!address) return null;
    try {
        const wallet = Wallet.getClientInstance();
        const trollNft = new OswapNftContracts.TrollNFT(wallet, address);
        let calls: IMulticallContractCall[] = [
            {
                contract: trollNft,
                methodName: 'minimumStake',
                params: [],
                to: address
            },
            {
                contract: trollNft,
                methodName: 'protocolFee',
                params: [],
                to: address
            }
        ];
        let [stake, mintFee] = await wallet.doMulticall(calls) || [];
        const receipt = await trollNft.stake(mintFee.plus(stake));
        return receipt;
    } catch (e) {
        callback(e);
        return null;
    }
}

async function fetchOswapTrollNftInfo(state: State, address: string) {
    if (!address) return null;
    try {
        const wallet = state.getRpcWallet();
        const trollNft = new OswapNftContracts.TrollNFT(wallet, address);
        let calls: IMulticallContractCall[] = [
            {
                contract: trollNft,
                methodName: 'minimumStake',
                params: [],
                to: address
            },
            {
                contract: trollNft,
                methodName: 'cap',
                params: [],
                to: address
            },
            {
                contract: trollNft,
                methodName: 'totalSupply',
                params: [],
                to: address
            },
            {
                contract: trollNft,
                methodName: 'protocolFee',
                params: [],
                to: address
            },
            {
                contract: trollNft,
                methodName: 'stakeToken',
                params: [],
                to: address
            },
        ];
        let [stake, cap, totalSupply, mintFee, stakeToken] = await wallet.doMulticall(calls) || [];
        return {
            cap: cap.minus(totalSupply) as BigNumber,
            price: mintFee.plus(stake).shiftedBy(-18) as BigNumber,
            tokenAddress: stakeToken as string
        }
    } catch {
        return null;
    }
}

export {
    getProductInfo,
    getNFTBalance,
    newProduct,
    newDefaultBuyProduct,
    getProxyTokenAmountIn,
    buyProduct,
    donate,
    getProductOwner,
    updateProductUri,
    updateProductPrice,

    fetchOswapTrollNftInfo,
    fetchUserNftBalance,
    mintOswapTrollNft
}