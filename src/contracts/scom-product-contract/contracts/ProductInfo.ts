import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./ProductInfo.json";
export interface IBuyParams {to:string;productId:number|BigNumber;quantity:number|BigNumber;amountIn:number|BigNumber}
export interface IBuyEthParams {to:string;productId:number|BigNumber;quantity:number|BigNumber}
export interface IDecrementInventoryParams {productId:number|BigNumber;decrement:number|BigNumber}
export interface IDonateParams {donor:string;donee:string;productId:number|BigNumber;amountIn:number|BigNumber}
export interface IDonateEthParams {donor:string;donee:string;productId:number|BigNumber}
export interface IIncrementInventoryParams {productId:number|BigNumber;increment:number|BigNumber}
export interface INewProductParams {productType:number|BigNumber;uri:string;quantity:number|BigNumber;price:number|BigNumber;maxQuantity:number|BigNumber;maxPrice:number|BigNumber;token:string}
export interface IOwnersProductsParams {param1:string;param2:number|BigNumber}
export interface IUpdateProductPriceParams {productId:number|BigNumber;price:number|BigNumber}
export interface IUpdateProductUriParams {productId:number|BigNumber;uri:string}
export class ProductInfo extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(nft:string, options?: TransactionOptions): Promise<string>{
        return this.__deploy([nft], options);
    }
    parseBuyEvent(receipt: TransactionReceipt): ProductInfo.BuyEvent[]{
        return this.parseEvents(receipt, "Buy").map(e=>this.decodeBuyEvent(e));
    }
    decodeBuyEvent(event: Event): ProductInfo.BuyEvent{
        let result = event.data;
        return {
            sender: result.sender,
            recipient: result.recipient,
            productId: new BigNumber(result.productId),
            quantity: new BigNumber(result.quantity),
            amountIn: new BigNumber(result.amountIn),
            _event: event
        };
    }
    parseDecrementInventoryEvent(receipt: TransactionReceipt): ProductInfo.DecrementInventoryEvent[]{
        return this.parseEvents(receipt, "DecrementInventory").map(e=>this.decodeDecrementInventoryEvent(e));
    }
    decodeDecrementInventoryEvent(event: Event): ProductInfo.DecrementInventoryEvent{
        let result = event.data;
        return {
            sender: result.sender,
            productId: new BigNumber(result.productId),
            decrement: new BigNumber(result.decrement),
            _event: event
        };
    }
    parseDonateEvent(receipt: TransactionReceipt): ProductInfo.DonateEvent[]{
        return this.parseEvents(receipt, "Donate").map(e=>this.decodeDonateEvent(e));
    }
    decodeDonateEvent(event: Event): ProductInfo.DonateEvent{
        let result = event.data;
        return {
            donor: result.donor,
            donee: result.donee,
            productId: new BigNumber(result.productId),
            amountIn: new BigNumber(result.amountIn),
            _event: event
        };
    }
    parseIncrementInventoryEvent(receipt: TransactionReceipt): ProductInfo.IncrementInventoryEvent[]{
        return this.parseEvents(receipt, "IncrementInventory").map(e=>this.decodeIncrementInventoryEvent(e));
    }
    decodeIncrementInventoryEvent(event: Event): ProductInfo.IncrementInventoryEvent{
        let result = event.data;
        return {
            sender: result.sender,
            productId: new BigNumber(result.productId),
            increment: new BigNumber(result.increment),
            _event: event
        };
    }
    parseNewProductEvent(receipt: TransactionReceipt): ProductInfo.NewProductEvent[]{
        return this.parseEvents(receipt, "NewProduct").map(e=>this.decodeNewProductEvent(e));
    }
    decodeNewProductEvent(event: Event): ProductInfo.NewProductEvent{
        let result = event.data;
        return {
            productId: new BigNumber(result.productId),
            owner: result.owner,
            _event: event
        };
    }
    parseUpdateProductPriceEvent(receipt: TransactionReceipt): ProductInfo.UpdateProductPriceEvent[]{
        return this.parseEvents(receipt, "UpdateProductPrice").map(e=>this.decodeUpdateProductPriceEvent(e));
    }
    decodeUpdateProductPriceEvent(event: Event): ProductInfo.UpdateProductPriceEvent{
        let result = event.data;
        return {
            sender: result.sender,
            productId: new BigNumber(result.productId),
            price: new BigNumber(result.price),
            _event: event
        };
    }
    parseUpdateProductStatusEvent(receipt: TransactionReceipt): ProductInfo.UpdateProductStatusEvent[]{
        return this.parseEvents(receipt, "UpdateProductStatus").map(e=>this.decodeUpdateProductStatusEvent(e));
    }
    decodeUpdateProductStatusEvent(event: Event): ProductInfo.UpdateProductStatusEvent{
        let result = event.data;
        return {
            sender: result.sender,
            productId: new BigNumber(result.productId),
            status: new BigNumber(result.status),
            _event: event
        };
    }
    parseUpdateProductUriEvent(receipt: TransactionReceipt): ProductInfo.UpdateProductUriEvent[]{
        return this.parseEvents(receipt, "UpdateProductUri").map(e=>this.decodeUpdateProductUriEvent(e));
    }
    decodeUpdateProductUriEvent(event: Event): ProductInfo.UpdateProductUriEvent{
        let result = event.data;
        return {
            sender: result.sender,
            productId: new BigNumber(result.productId),
            uri: result.uri,
            _event: event
        };
    }
    activateProduct: {
        (productId:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (productId:number|BigNumber, options?: TransactionOptions) => Promise<void>;
        txData: (productId:number|BigNumber, options?: TransactionOptions) => Promise<string>;
    }
    buy: {
        (params: IBuyParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IBuyParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IBuyParams, options?: TransactionOptions) => Promise<string>;
    }
    buyEth: {
        (params: IBuyEthParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IBuyEthParams, options?: number|BigNumber|TransactionOptions) => Promise<void>;
        txData: (params: IBuyEthParams, options?: number|BigNumber|TransactionOptions) => Promise<string>;
    }
    deactivateProduct: {
        (productId:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (productId:number|BigNumber, options?: TransactionOptions) => Promise<void>;
        txData: (productId:number|BigNumber, options?: TransactionOptions) => Promise<string>;
    }
    decrementInventory: {
        (params: IDecrementInventoryParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IDecrementInventoryParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IDecrementInventoryParams, options?: TransactionOptions) => Promise<string>;
    }
    donate: {
        (params: IDonateParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IDonateParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IDonateParams, options?: TransactionOptions) => Promise<string>;
    }
    donateEth: {
        (params: IDonateEthParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IDonateEthParams, options?: number|BigNumber|TransactionOptions) => Promise<void>;
        txData: (params: IDonateEthParams, options?: number|BigNumber|TransactionOptions) => Promise<string>;
    }
    incrementInventory: {
        (params: IIncrementInventoryParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IIncrementInventoryParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IIncrementInventoryParams, options?: TransactionOptions) => Promise<string>;
    }
    newProduct: {
        (params: INewProductParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: INewProductParams, options?: TransactionOptions) => Promise<BigNumber>;
        txData: (params: INewProductParams, options?: TransactionOptions) => Promise<string>;
    }
    nft: {
        (options?: TransactionOptions): Promise<string>;
    }
    ownersProducts: {
        (params: IOwnersProductsParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    ownersProductsLength: {
        (owner:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    productCount: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    productOwner: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<string>;
    }
    products: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<{productType:BigNumber,productId:BigNumber,uri:string,quantity:BigNumber,price:BigNumber,maxQuantity:BigNumber,maxPrice:BigNumber,token:string,status:BigNumber}>;
    }
    updateProductPrice: {
        (params: IUpdateProductPriceParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IUpdateProductPriceParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IUpdateProductPriceParams, options?: TransactionOptions) => Promise<string>;
    }
    updateProductUri: {
        (params: IUpdateProductUriParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IUpdateProductUriParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IUpdateProductUriParams, options?: TransactionOptions) => Promise<string>;
    }
    private assign(){
        let nft_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('nft',[],options);
            return result;
        }
        this.nft = nft_call
        let ownersProductsParams = (params: IOwnersProductsParams) => [params.param1,this.wallet.utils.toString(params.param2)];
        let ownersProducts_call = async (params: IOwnersProductsParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('ownersProducts',ownersProductsParams(params),options);
            return new BigNumber(result);
        }
        this.ownersProducts = ownersProducts_call
        let ownersProductsLength_call = async (owner:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('ownersProductsLength',[owner],options);
            return new BigNumber(result);
        }
        this.ownersProductsLength = ownersProductsLength_call
        let productCount_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('productCount',[],options);
            return new BigNumber(result);
        }
        this.productCount = productCount_call
        let productOwner_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('productOwner',[this.wallet.utils.toString(param1)],options);
            return result;
        }
        this.productOwner = productOwner_call
        let products_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<{productType:BigNumber,productId:BigNumber,uri:string,quantity:BigNumber,price:BigNumber,maxQuantity:BigNumber,maxPrice:BigNumber,token:string,status:BigNumber}> => {
            let result = await this.call('products',[this.wallet.utils.toString(param1)],options);
            return {
                productType: new BigNumber(result.productType),
                productId: new BigNumber(result.productId),
                uri: result.uri,
                quantity: new BigNumber(result.quantity),
                price: new BigNumber(result.price),
                maxQuantity: new BigNumber(result.maxQuantity),
                maxPrice: new BigNumber(result.maxPrice),
                token: result.token,
                status: new BigNumber(result.status)
            };
        }
        this.products = products_call
        let activateProduct_send = async (productId:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('activateProduct',[this.wallet.utils.toString(productId)],options);
            return result;
        }
        let activateProduct_call = async (productId:number|BigNumber, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('activateProduct',[this.wallet.utils.toString(productId)],options);
            return;
        }
        let activateProduct_txData = async (productId:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('activateProduct',[this.wallet.utils.toString(productId)],options);
            return result;
        }
        this.activateProduct = Object.assign(activateProduct_send, {
            call:activateProduct_call
            , txData:activateProduct_txData
        });
        let buyParams = (params: IBuyParams) => [params.to,this.wallet.utils.toString(params.productId),this.wallet.utils.toString(params.quantity),this.wallet.utils.toString(params.amountIn)];
        let buy_send = async (params: IBuyParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('buy',buyParams(params),options);
            return result;
        }
        let buy_call = async (params: IBuyParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('buy',buyParams(params),options);
            return;
        }
        let buy_txData = async (params: IBuyParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('buy',buyParams(params),options);
            return result;
        }
        this.buy = Object.assign(buy_send, {
            call:buy_call
            , txData:buy_txData
        });
        let buyEthParams = (params: IBuyEthParams) => [params.to,this.wallet.utils.toString(params.productId),this.wallet.utils.toString(params.quantity)];
        let buyEth_send = async (params: IBuyEthParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('buyEth',buyEthParams(params),options);
            return result;
        }
        let buyEth_call = async (params: IBuyEthParams, options?: number|BigNumber|TransactionOptions): Promise<void> => {
            let result = await this.call('buyEth',buyEthParams(params),options);
            return;
        }
        let buyEth_txData = async (params: IBuyEthParams, options?: number|BigNumber|TransactionOptions): Promise<string> => {
            let result = await this.txData('buyEth',buyEthParams(params),options);
            return result;
        }
        this.buyEth = Object.assign(buyEth_send, {
            call:buyEth_call
            , txData:buyEth_txData
        });
        let deactivateProduct_send = async (productId:number|BigNumber, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('deactivateProduct',[this.wallet.utils.toString(productId)],options);
            return result;
        }
        let deactivateProduct_call = async (productId:number|BigNumber, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('deactivateProduct',[this.wallet.utils.toString(productId)],options);
            return;
        }
        let deactivateProduct_txData = async (productId:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('deactivateProduct',[this.wallet.utils.toString(productId)],options);
            return result;
        }
        this.deactivateProduct = Object.assign(deactivateProduct_send, {
            call:deactivateProduct_call
            , txData:deactivateProduct_txData
        });
        let decrementInventoryParams = (params: IDecrementInventoryParams) => [this.wallet.utils.toString(params.productId),this.wallet.utils.toString(params.decrement)];
        let decrementInventory_send = async (params: IDecrementInventoryParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('decrementInventory',decrementInventoryParams(params),options);
            return result;
        }
        let decrementInventory_call = async (params: IDecrementInventoryParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('decrementInventory',decrementInventoryParams(params),options);
            return;
        }
        let decrementInventory_txData = async (params: IDecrementInventoryParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('decrementInventory',decrementInventoryParams(params),options);
            return result;
        }
        this.decrementInventory = Object.assign(decrementInventory_send, {
            call:decrementInventory_call
            , txData:decrementInventory_txData
        });
        let donateParams = (params: IDonateParams) => [params.donor,params.donee,this.wallet.utils.toString(params.productId),this.wallet.utils.toString(params.amountIn)];
        let donate_send = async (params: IDonateParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('donate',donateParams(params),options);
            return result;
        }
        let donate_call = async (params: IDonateParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('donate',donateParams(params),options);
            return;
        }
        let donate_txData = async (params: IDonateParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('donate',donateParams(params),options);
            return result;
        }
        this.donate = Object.assign(donate_send, {
            call:donate_call
            , txData:donate_txData
        });
        let donateEthParams = (params: IDonateEthParams) => [params.donor,params.donee,this.wallet.utils.toString(params.productId)];
        let donateEth_send = async (params: IDonateEthParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('donateEth',donateEthParams(params),options);
            return result;
        }
        let donateEth_call = async (params: IDonateEthParams, options?: number|BigNumber|TransactionOptions): Promise<void> => {
            let result = await this.call('donateEth',donateEthParams(params),options);
            return;
        }
        let donateEth_txData = async (params: IDonateEthParams, options?: number|BigNumber|TransactionOptions): Promise<string> => {
            let result = await this.txData('donateEth',donateEthParams(params),options);
            return result;
        }
        this.donateEth = Object.assign(donateEth_send, {
            call:donateEth_call
            , txData:donateEth_txData
        });
        let incrementInventoryParams = (params: IIncrementInventoryParams) => [this.wallet.utils.toString(params.productId),this.wallet.utils.toString(params.increment)];
        let incrementInventory_send = async (params: IIncrementInventoryParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('incrementInventory',incrementInventoryParams(params),options);
            return result;
        }
        let incrementInventory_call = async (params: IIncrementInventoryParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('incrementInventory',incrementInventoryParams(params),options);
            return;
        }
        let incrementInventory_txData = async (params: IIncrementInventoryParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('incrementInventory',incrementInventoryParams(params),options);
            return result;
        }
        this.incrementInventory = Object.assign(incrementInventory_send, {
            call:incrementInventory_call
            , txData:incrementInventory_txData
        });
        let newProductParams = (params: INewProductParams) => [this.wallet.utils.toString(params.productType),params.uri,this.wallet.utils.toString(params.quantity),this.wallet.utils.toString(params.price),this.wallet.utils.toString(params.maxQuantity),this.wallet.utils.toString(params.maxPrice),params.token];
        let newProduct_send = async (params: INewProductParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('newProduct',newProductParams(params),options);
            return result;
        }
        let newProduct_call = async (params: INewProductParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('newProduct',newProductParams(params),options);
            return new BigNumber(result);
        }
        let newProduct_txData = async (params: INewProductParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('newProduct',newProductParams(params),options);
            return result;
        }
        this.newProduct = Object.assign(newProduct_send, {
            call:newProduct_call
            , txData:newProduct_txData
        });
        let updateProductPriceParams = (params: IUpdateProductPriceParams) => [this.wallet.utils.toString(params.productId),this.wallet.utils.toString(params.price)];
        let updateProductPrice_send = async (params: IUpdateProductPriceParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('updateProductPrice',updateProductPriceParams(params),options);
            return result;
        }
        let updateProductPrice_call = async (params: IUpdateProductPriceParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('updateProductPrice',updateProductPriceParams(params),options);
            return;
        }
        let updateProductPrice_txData = async (params: IUpdateProductPriceParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('updateProductPrice',updateProductPriceParams(params),options);
            return result;
        }
        this.updateProductPrice = Object.assign(updateProductPrice_send, {
            call:updateProductPrice_call
            , txData:updateProductPrice_txData
        });
        let updateProductUriParams = (params: IUpdateProductUriParams) => [this.wallet.utils.toString(params.productId),params.uri];
        let updateProductUri_send = async (params: IUpdateProductUriParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('updateProductUri',updateProductUriParams(params),options);
            return result;
        }
        let updateProductUri_call = async (params: IUpdateProductUriParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('updateProductUri',updateProductUriParams(params),options);
            return;
        }
        let updateProductUri_txData = async (params: IUpdateProductUriParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('updateProductUri',updateProductUriParams(params),options);
            return result;
        }
        this.updateProductUri = Object.assign(updateProductUri_send, {
            call:updateProductUri_call
            , txData:updateProductUri_txData
        });
    }
}
export module ProductInfo{
    export interface BuyEvent {sender:string,recipient:string,productId:BigNumber,quantity:BigNumber,amountIn:BigNumber,_event:Event}
    export interface DecrementInventoryEvent {sender:string,productId:BigNumber,decrement:BigNumber,_event:Event}
    export interface DonateEvent {donor:string,donee:string,productId:BigNumber,amountIn:BigNumber,_event:Event}
    export interface IncrementInventoryEvent {sender:string,productId:BigNumber,increment:BigNumber,_event:Event}
    export interface NewProductEvent {productId:BigNumber,owner:string,_event:Event}
    export interface UpdateProductPriceEvent {sender:string,productId:BigNumber,price:BigNumber,_event:Event}
    export interface UpdateProductStatusEvent {sender:string,productId:BigNumber,status:BigNumber,_event:Event}
    export interface UpdateProductUriEvent {sender:string,productId:BigNumber,uri:string,_event:Event}
}