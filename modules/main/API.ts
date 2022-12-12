import { BigNumber, Utils, Wallet } from '@ijstech/eth-wallet';
import { ICommissionInfo, ITokenObject } from '@modules/interface';
import { Contracts as ProductContracts } from '@scom/product-contract';
import { Contracts as ProxyContracts } from '@scom/commission-proxy';
import { getContractAddress } from '@modules/store';
import { registerSendTxEvents } from '@modules/utils';

async function getProductInfo(productId: number) {
    let productInfoAddress = getContractAddress('ProductInfo');
    const wallet = Wallet.getInstance();
    const productInfo = new ProductContracts.ProductInfo(wallet, productInfoAddress);
    const product = await productInfo.products(productId);
    return product;
}

async function getNFTBalance(productId: number) {
    let productInfoAddress = getContractAddress('ProductInfo');
    const wallet = Wallet.getInstance();
    const productInfo = new ProductContracts.ProductInfo(wallet, productInfoAddress);
    const nftAddress = await productInfo.nft();
    const product1155 = new ProductContracts.Product1155(wallet, nftAddress);
    const nftBalance = await product1155.balanceOf({ 
        account: wallet.address, 
        id: productId
    });
    return nftBalance;
}

async function newProduct(
    qty: number,
    maxQty: number,
    price: string,
    maxPrice: string,
    token?: ITokenObject,
    callback?: any,
    confirmationCallback?: any
) {
    let productInfoAddress = getContractAddress('ProductInfo');
    const wallet = Wallet.getInstance();
    const productInfo = new ProductContracts.ProductInfo(wallet, productInfoAddress);
    registerSendTxEvents({
        transactionHash: callback,
        confirmation: confirmationCallback
    });
    const tokenDecimals = token?.decimals || 18;
    let receipt = await productInfo.newProduct({
        ipfsCid: '',
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
    productId: number,
    quantity: number,
    amountIn: string,
    commissions: ICommissionInfo[],
    token?: ITokenObject,
    callback?: any,
    confirmationCallback?: any
) {
    let proxyAddress = getContractAddress('Proxy');
    let productInfoAddress = getContractAddress('ProductInfo');
    const wallet = Wallet.getInstance();
    const proxy = new ProxyContracts.Proxy(wallet, proxyAddress);
    const productInfo = new ProductContracts.ProductInfo(wallet, productInfoAddress);
    const product = await productInfo.products(productId);
    const isDonation = product.price.isZero();
    const tokenDecimals = token?.decimals || 18;
    const amount = isDonation ? Utils.toDecimals(amountIn, tokenDecimals) : product.price.times(quantity);
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
            registerSendTxEvents({
                transactionHash: callback,
                confirmation: confirmationCallback
            });
            receipt = await proxy.tokenIn({
                target: productInfoAddress,
                tokensIn,
                data: txData
            });
        } else {
            const txData = await productInfo.buyEth.txData({
                productId: productId,
                quantity,
                to: wallet.address
            }, amount);
            registerSendTxEvents({
                transactionHash: callback,
                confirmation: confirmationCallback
            });
            receipt = await proxy.ethIn({
                target: productInfoAddress,
                commissions: _commissions,
                data: txData
            }, amount.plus(commissionsAmount));
        }
    }
    catch(err) {
        console.error(err);
    }
    return receipt;
}

export {
    getProductInfo,
    getNFTBalance,
    newProduct,
    getProxyTokenAmountIn,
    buyProduct
}