import { BigNumber, Utils, Wallet } from '@ijstech/eth-wallet';
import { ProductType, ICommissionInfo } from './interface/index';
import { Contracts as ProductContracts } from '@scom/scom-product-contract';
import { Contracts as ProxyContracts } from '@scom/scom-commission-proxy-contract';
import { registerSendTxEvents } from './utils/index';
import { ITokenObject, tokenStore } from '@scom/scom-token-list';
import { State } from './store/index';

async function getProductInfo(state: State, productId: number) {
    let productInfoAddress = state.getContractAddress('ProductInfo');
    if (!productInfoAddress) return null;
    try {
        const wallet = state.getRpcWallet();
        const productInfo = new ProductContracts.ProductInfo(wallet, productInfoAddress);
        const product = await productInfo.products(productId);
        const chainId = wallet.chainId;
        const _tokenList = tokenStore.getTokenList(chainId);
        const token: any = _tokenList.find(token => product?.token && token?.address && token.address.toLowerCase() === product.token.toLowerCase());
        return {
            ...product,
            token
        };
    } catch {
        return null;
    }
}

async function newProduct(
    state: State,
    productType: ProductType,
    qty: number,
    maxQty: number,
    price: string,
    maxPrice: string,
    token?: ITokenObject,
    callback?: any,
    confirmationCallback?: any
) {
    let productInfoAddress = state.getContractAddress('ProductInfo');
    const wallet = Wallet.getClientInstance();
    const productInfo = new ProductContracts.ProductInfo(wallet, productInfoAddress);
    registerSendTxEvents({
        transactionHash: callback,
        confirmation: confirmationCallback
    });
    const tokenDecimals = token?.decimals || 18;
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
        token: token?.address || ""
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
        if (token?.address) {
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
                })
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

export {
    getProductInfo,
    newProduct,
    getProxyTokenAmountIn,
    buyProduct,
    donate
}