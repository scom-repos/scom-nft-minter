import { Utils, Wallet } from '@ijstech/eth-wallet';
import { ITokenObject } from '@modules/interface';
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
    price: string,
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
    let receipt = await productInfo.newProduct({
        ipfsCid: '',
        quantity: qty,
        maxQuantity: 0, //FIXME
        price: Utils.toDecimals(price, token?.decimals || 18),
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

async function buyProduct(productId: number, quantity: number, token?: ITokenObject) {
    let proxyAddress = getContractAddress('Proxy');
    let productInfoAddress = getContractAddress('ProductInfo');
    const tokenDecimals = token?.decimals || 18;
    const commissions = []; //FIXME
    // const commissions = [
    //     { to: '', amount: Utils.toDecimals(1.0, tokenDecimals) },
    //     { to: '', amount: Utils.toDecimals(1.5, tokenDecimals) }
    // ]; 
    const wallet = Wallet.getInstance();
    const proxy = new ProxyContracts.Proxy(wallet, proxyAddress);
    const productInfo = new ProductContracts.ProductInfo(wallet, productInfoAddress);
    const product = await productInfo.products(productId);
    const amount = product.price.times(quantity);
    const commissionsAmount = commissions.map(v => v.amount).reduce((a, b) => a.plus(b));
    let receipt;
    if (token?.address) {
        const txData = await productInfo.buy.txData({
            productId: productId,
            quantity: quantity,
            to: wallet.address
        });
        const tokensIn =
        {
            token: token.address,
            amount: amount.plus(commissionsAmount),
            directTransfer: false,
            commissions: commissions
        };
        receipt = await proxy.tokenIn({
            target: productInfoAddress,
            tokensIn,
            data: txData
        });
    } else {
        const txData = await productInfo.buyEth.txData({
            productId: productId,
            quantity: quantity,
            to: wallet.address
        }, amount);
        receipt = await proxy.ethIn({
            target: productInfoAddress,
            commissions,
            data: txData
        }, amount.plus(commissionsAmount));
    }
    return receipt;
}

export {
    getProductInfo,
    getNFTBalance,
    newProduct,
    buyProduct
}