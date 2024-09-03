import { BigNumber, IMulticallContractCall, Utils, Wallet } from '@ijstech/eth-wallet';
import { ProductType, ICommissionInfo, IProductInfo, IDiscountRule } from './interface/index';
import { Contracts as ProductContracts } from '@scom/scom-product-contract';
import { Contracts as ProxyContracts } from '@scom/scom-commission-proxy-contract';
import { Contracts as OswapNftContracts } from "@scom/oswap-troll-nft-contract";
import { getTokenInfo, nullAddress, registerSendTxEvents } from './utils/index';
import { ITokenObject, tokenStore } from '@scom/scom-token-list';
import { State } from './store/index';
import getNetworkList from '@scom/scom-network-list';

async function getProductInfo(state: State, productId: number):Promise<IProductInfo> {
    let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
    if (!productMarketplaceAddress) return null;
    try {
        const wallet = state.getRpcWallet();
        const productMarketplace = new ProductContracts.ProductMarketplace(wallet, productMarketplaceAddress);
        const product = await productMarketplace.products(productId);
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

async function getProductOwner(state: State, productId: number) {
    let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
    if (!productMarketplaceAddress) return null;
    try {
        const wallet = state.getRpcWallet();
        const productMarketplace = new ProductContracts.ProductMarketplace(wallet, productMarketplaceAddress);
        const owner = await productMarketplace.productOwner(productId);
        return owner;
    } catch {
        return null;
    }
}

async function getNFTBalance(state: State, productId: number) {
    let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
    if (!productMarketplaceAddress) return null;
    try {
        const wallet = state.getRpcWallet();
        const productMarketplace = new ProductContracts.ProductMarketplace(wallet, productMarketplaceAddress);
        const product = await productMarketplace.products(productId);
        let nftBalance: BigNumber;
        if (product.productType.eq(1)) {
            // Subscription
            const subscriptionNFT = new ProductContracts.SubscriptionNFT(wallet, product.nft);
            nftBalance = await subscriptionNFT.balanceOf(wallet.address);
        } else {
            let oneTimePurchaseNFTAddress = state.getContractAddress('OneTimePurchaseNFT');
            if (!oneTimePurchaseNFTAddress) return null;
            const oneTimePurchaseNFT = new ProductContracts.OneTimePurchaseNFT(wallet, oneTimePurchaseNFTAddress);
            nftBalance = await oneTimePurchaseNFT.balanceOf({ account: wallet.address, id: product.nftId });
        }
        return nftBalance.toFixed();
    } catch {
        return null;
    }
}

async function getProductId(state: State, nftAddress: string, nftId?: number) {
    let productId: number;
    try {
        const wallet = state.getRpcWallet();
        if (nftId != null) {
            const oneTimePurchaseNFT = new ProductContracts.OneTimePurchaseNFT(wallet, nftAddress);
            productId = (await oneTimePurchaseNFT.productIdByTokenId(nftId)).toNumber();
        } else {
            const subscriptionNFT = new ProductContracts.SubscriptionNFT(wallet, nftAddress);
            productId = (await subscriptionNFT.productId()).toNumber();
        }
    } catch {
        console.log("product id not found");
    }
    return productId;
}

function getProductIdFromEvent(productMarketplaceAddress: string, receipt: any) {
    let productId: number;
    try {
        const wallet = Wallet.getClientInstance();
        const productMarketplace = new ProductContracts.ProductMarketplace(wallet, productMarketplaceAddress);
        let event = productMarketplace.parseNewProductEvent(receipt)[0];
        productId = event?.productId.toNumber();
    } catch {
    }
    return productId;
}

async function getDiscountRules(state: State, productId: number) {
    let discountRules: IDiscountRule[] = [];
    let promotionAddress = state.getContractAddress('Promotion');
    if (!promotionAddress) return discountRules;
    try {
        const wallet = state.getRpcWallet();
        const promotion = new ProductContracts.Promotion(wallet, promotionAddress);
        const ruleCount = await promotion.getDiscountRuleCount(productId);
        let contractCalls: IMulticallContractCall[] = [];
        for (let i = 0; i < ruleCount.toNumber(); i++) {
            contractCalls.push({
                contract: promotion,
                methodName: 'discountRules',
                params: [productId, i],
                to: promotionAddress
            });
        }
        if (contractCalls.length === 0) return discountRules;
        const multicallResults = await wallet.doMulticall(contractCalls);
        for (let i = 0; i < multicallResults.length; i++) {
            const multicallResult = multicallResults[i];
            if (!multicallResult) continue;
            const discountRule = multicallResult;
            discountRules.push({
                id: discountRule.id.toNumber(),
                minDuration: discountRule.minDuration,
                discountPercentage: discountRule.discountPercentage.toNumber(),
                fixedPrice: Utils.fromDecimals(discountRule.fixedPrice),
                startTime: discountRule.startTime.toNumber(),
                endTime: discountRule.endTime.toNumber(),
                discountApplication: discountRule.discountApplication.toNumber()
            });
        }
    } catch (err) {
        console.error('failed to get discount rules');
    }
    return discountRules;
}

async function updateDiscountRules(
    state: State,
    productId: number,
    rules: IDiscountRule[],
    ruleIdsToDelete: number[] = [],
    callback?: any,
    confirmationCallback?: any
) {
    let promotionAddress = state.getContractAddress('Promotion');
    if (!promotionAddress) throw new Error('Promotion contract not found');
    const wallet = Wallet.getClientInstance();
    const promotion = new ProductContracts.Promotion(wallet, promotionAddress);
    registerSendTxEvents({
        transactionHash: callback,
        confirmation: confirmationCallback
    });
    let receipt = await promotion.updateDiscountRules({
        productId,
        rules: rules || [],
        ruleIdsToDelete
    });
    return receipt;
}

async function newProduct(
    productMarketplaceAddress: string,

    productType: ProductType,
    quantity: number,// max quantity of this nft can be exist at anytime
    maxQuantity: number, // max quantity for one buy() txn
    price: string,
    maxPrice: string, //for donation only, no max price when it is 0
    tokenAddress: string,//Native token 0x0000000000000000000000000000000000000000
    tokenDecimals: number,
    uri: string,
    //For Subscription
    nftName: string = '',
    nftSymbol: string = '',
    priceDuration: number = 0,
    callback?: any,
    confirmationCallback?: any
) {
    const wallet = Wallet.getClientInstance();
    const productMarketplace = new ProductContracts.ProductMarketplace(wallet, productMarketplaceAddress);
    registerSendTxEvents({
        transactionHash: callback,
        confirmation: confirmationCallback
    });
    let productTypeCode: number;
    switch (productType) {
        case ProductType.Buy:
            productTypeCode = 0;
            break;
        case ProductType.Subscription:
            productTypeCode = 1;
            break;
        case ProductType.DonateToOwner:
            productTypeCode = 2;
            break;
        case ProductType.DonateToEveryone:
            productTypeCode = 3;
            break;
    }
    let receipt = await productMarketplace.newProduct({
        productType: productTypeCode,
        uri: uri || '',
        quantity: quantity,
        maxQuantity: maxQuantity,
        maxPrice: Utils.toDecimals(maxPrice, tokenDecimals),
        price: Utils.toDecimals(price, tokenDecimals),
        token: tokenAddress,
        priceDuration: priceDuration,
        nftName: nftName,
        nftSymbol: nftSymbol
    });
    return receipt;
}

async function createSubscriptionNFT(
    productMarketplaceAddress: string,
    quantity: number,
    price: string,
    tokenAddress: string,
    tokenDecimals: number,
    uri: string,
    priceDuration: number = 0,
    callback?: any,
    confirmationCallback?: any
) {
    return await newProduct(
        productMarketplaceAddress,
        ProductType.Subscription,
        quantity,
        quantity,
        price,
        "0",
        tokenAddress,
        tokenDecimals,
        uri,
        '',
        '',
        priceDuration,
        callback,
        confirmationCallback
    );
}

async function newDefaultBuyProduct(
    productMarketplaceAddress: string,

    qty: number,// max quantity of this nft can be exist at anytime
    //maxQty = qty
    //maxQty: number, // max quantity for one buy() txn
    price: string,
    tokenAddress: string,
    tokenDecimals: number,
    uri: string,
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
        productMarketplaceAddress,
        ProductType.Buy,
        qty,
        qty, //maxQty
        price,
        "0",
        tokenAddress,
        tokenDecimals,
        uri,
        '',
        '',
        0,
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
    let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
    const wallet = Wallet.getClientInstance();
    const proxy = new ProxyContracts.Proxy(wallet, proxyAddress);
    const productMarketplace = new ProductContracts.ProductMarketplace(wallet, productMarketplaceAddress);
    const product = await productMarketplace.products(productId);
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
        registerSendTxEvents({
            transactionHash: callback,
            confirmation: confirmationCallback
        });
        if (token?.address && token?.address !== nullAddress) {
            if (commissionsAmount.isZero()) {
                receipt = await productMarketplace.buy({
                    productId: productId,
                    quantity: quantity,
                    to: wallet.address
                })
            }
            else {
                const txData = await productMarketplace.buy.txData({
                    productId: productId,
                    quantity: quantity,
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
                    target: productMarketplaceAddress,
                    tokensIn,
                    data: txData
                });
            }
        } else {
            if (commissionsAmount.isZero()) {
                receipt = await productMarketplace.buy({
                    productId: productId,
                    quantity,
                    to: wallet.address
                }, amount)
            }
            else {
                const txData = await productMarketplace.buy.txData({
                    productId: productId,
                    quantity,
                    to: wallet.address
                }, amount);
                receipt = await proxy.ethIn({
                    target: productMarketplaceAddress,
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
    let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
    const wallet = Wallet.getClientInstance();
    const proxy = new ProxyContracts.Proxy(wallet, proxyAddress);
    const productMarketplace = new ProductContracts.ProductMarketplace(wallet, productMarketplaceAddress);
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
        registerSendTxEvents({
            transactionHash: callback,
            confirmation: confirmationCallback
        });
        if (token?.address) {
            if (commissionsAmount.isZero()) {
                receipt = await productMarketplace.donate({
                    donor: wallet.address,
                    donee: donateTo,
                    productId: productId,
                    amountIn: amount
                });
            }
            else {
                const txData = await productMarketplace.donate.txData({
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
                    target: productMarketplaceAddress,
                    tokensIn,
                    data: txData
                });
            }
        } else {
            if (commissionsAmount.isZero()) {
                receipt = await productMarketplace.donate({
                    donor: wallet.address,
                    donee: donateTo,
                    productId: productId,
                    amountIn: 0
                }, { value: amount });
            }
            else {
                const txData = await productMarketplace.donate.txData({
                    donor: wallet.address,
                    donee: donateTo,
                    productId: productId,
                    amountIn: 0
                }, { value: amount });
                receipt = await proxy.ethIn({
                    target: productMarketplaceAddress,
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

async function subscribe(
    state: State,
    productId: number,
    startTime: number,
    duration: number,
    recipient: string,
    referrer: string,
    discountRuleId: number = 0,
    callback?: any,
    confirmationCallback?: any
) {
    let commissionAddress = state.getContractAddress('Commission');
    let productMarketplaceAddress = state.getContractAddress('ProductMarketplace');
    const wallet = Wallet.getClientInstance();
    const commission = new ProductContracts.Commission(wallet, commissionAddress);
    const productMarketplace = new ProductContracts.ProductMarketplace(wallet, productMarketplaceAddress);
    const product = await productMarketplace.products(productId);
    let basePrice: BigNumber = product.price;
    if (discountRuleId !== 0) {
        let promotionAddress = state.getContractAddress('Promotion');
        const promotion = new ProductContracts.Promotion(wallet, promotionAddress);
        const index = await promotion.discountRuleIdToIndex({ param1: productId, param2: discountRuleId });
        const rule = await promotion.discountRules({ param1: productId, param2: index });
        if (rule.discountPercentage.gt(0)) {
            const discount = product.price.times(rule.discountPercentage).div(100);
            basePrice = product.price.minus(discount);
        } else {
            basePrice = rule.fixedPrice;
        }
    }
    const amount = product.priceDuration.eq(duration) ? basePrice : basePrice.times(duration).div(product.priceDuration);
    let tokenInAmount: BigNumber;
    if (referrer) {
        let campaign = await commission.getCampaign({ campaignId: productId, returnArrays: true });
        if (campaign?.affiliates?.includes(referrer)) {
            const commissionRate = campaign.commissionRate;
            tokenInAmount = Utils.toDecimals(new BigNumber(amount).dividedBy(new BigNumber(1).minus(commissionRate))).decimalPlaces(0);
        }
    }
    let receipt;
    try {
        registerSendTxEvents({
            transactionHash: callback,
            confirmation: confirmationCallback
        });
        if (product.token === nullAddress) {
            if (!tokenInAmount || tokenInAmount.isZero()) {
                receipt = await productMarketplace.subscribe({
                    to: recipient || wallet.address,
                    productId: productId,
                    startTime: startTime,
                    duration: duration,
                    discountRuleId: discountRuleId
                }, amount)
            } else {
                const txData = await productMarketplace.subscribe.txData({
                    to: recipient || wallet.address,
                    productId: productId,
                    startTime: startTime,
                    duration: duration,
                    discountRuleId: discountRuleId
                }, amount);
                receipt = await commission.proxyCall({
                    affiliate: referrer,
                    campaignId: productId,
                    amount: tokenInAmount,
                    data: txData
                }, tokenInAmount);
            }
        } else {
            if (!tokenInAmount || tokenInAmount.isZero()) {
                receipt = await productMarketplace.subscribe({
                    to: recipient || wallet.address,
                    productId: productId,
                    startTime: startTime,
                    duration: duration,
                    discountRuleId: discountRuleId
                })
            } else {
                const txData = await productMarketplace.subscribe.txData({
                    to: recipient || wallet.address,
                    productId: productId,
                    startTime: startTime,
                    duration: duration,
                    discountRuleId: discountRuleId
                });
                receipt = await commission.proxyCall({
                    affiliate: referrer,
                    campaignId: productId,
                    amount: tokenInAmount,
                    data: txData
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
    return receipt;
}

async function updateProductUri(productMarketplaceAddress: string, productId: number | BigNumber, uri: string) {
    let wallet = Wallet.getClientInstance();
    const productMarketplace = new ProductContracts.ProductMarketplace(wallet, productMarketplaceAddress);
    const receipt = await productMarketplace.updateProductUri({ productId, uri });
    return receipt;
}

async function updateProductPrice(productMarketplaceAddress: string, productId: number | BigNumber, price: number | BigNumber, tokenDecimals: number) {
    let wallet = Wallet.getClientInstance();
    const productMarketplace = new ProductContracts.ProductMarketplace(wallet, productMarketplaceAddress);
    const receipt = await productMarketplace.updateProductPrice({ productId, price:BigNumber(price).shiftedBy(tokenDecimals) });
    return receipt;
}
//
//    ERC721 and oswap troll nft 
//
async function fetchUserNftBalance(state: State, address: string) {
    if (!address) return null;
    try {
        const wallet = state.getRpcWallet();
        const erc721 = new OswapNftContracts.ERC721(wallet, address);
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
    getProductId,
    getProductIdFromEvent,
    getDiscountRules,
    updateDiscountRules,
    newProduct,
    createSubscriptionNFT,
    newDefaultBuyProduct,
    getProxyTokenAmountIn,
    buyProduct,
    donate,
    subscribe,
    getProductOwner,
    updateProductUri,
    updateProductPrice,

    fetchOswapTrollNftInfo,
    fetchUserNftBalance,
    mintOswapTrollNft
}