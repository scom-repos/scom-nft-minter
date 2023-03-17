import * as Contracts from './contracts/index';
export {Contracts};
import {IWallet, BigNumber} from '@ijstech/eth-wallet';

export interface IDeployOptions {
    deployERC20?: boolean;
    initSupply?: BigNumber.Value;
    templateURI?: string;
};
export interface IDeployResult {
    erc20?: string;
    product1155: string;
    productInfo: string;
};
var progressHandler: any;
export var DefaultDeployOptions: IDeployOptions = {
    deployERC20: false,
    initSupply: '10000000000000000000000',
    templateURI: ''
};
function progress(msg: string){
    if (typeof(progressHandler) == 'function'){
        progressHandler(msg);
    };
}
export async function deploy(wallet: IWallet, options?: IDeployOptions): Promise<IDeployResult>{
    let erc20Address;
    if (options.deployERC20) {
        let erc20 = new Contracts.ERC20(wallet);
        progress('Deploy ERC20');
        erc20Address = await erc20.deploy();
        progress('ERC20 deployed ' + erc20Address)
        if (options && options.initSupply){
            progress('Mint initial supply ' + options.initSupply)
            let value = new BigNumber(options.initSupply);
            let result = await erc20.mint(value);
            progress('Transaction # ' + result.transactionHash);
        };    
    }

    let product1155 = new Contracts.Product1155(wallet);
    progress('Deploy Product1155');
    let product1155Address = await product1155.deploy(options?.templateURI??"");
    progress('Product1155 deployed ' + product1155Address);
    
    let productInfo = new Contracts.ProductInfo(wallet);
    progress('Deploy ProductInfo');
    let productInfoAddress = await productInfo.deploy(product1155.address);
    progress('ProductInfo deployed ' + productInfoAddress);
    progress('Grant Minter Role')
    let minterRole = await product1155.MINTER_ROLE();
    await product1155.grantRole({ role: minterRole, account: productInfoAddress });
    return {
        erc20: erc20Address,
        product1155: product1155Address,
        productInfo: productInfoAddress
    };
};
export function onProgress(handler: any){
    progressHandler = handler;
};
export default {
    Contracts,
    deploy,
    DefaultDeployOptions,
    onProgress
};