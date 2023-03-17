import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./ERC1155.json";
export interface IBalanceOfParams {account:string;id:number|BigNumber}
export interface IBalanceOfBatchParams {accounts:string[];ids:(number|BigNumber)[]}
export interface IIsApprovedForAllParams {account:string;operator:string}
export interface ISafeBatchTransferFromParams {from:string;to:string;ids:(number|BigNumber)[];amounts:(number|BigNumber)[];data:string}
export interface ISafeTransferFromParams {from:string;to:string;id:number|BigNumber;amount:number|BigNumber;data:string}
export interface ISetApprovalForAllParams {operator:string;approved:boolean}
export class ERC1155 extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(uri:string, options?: TransactionOptions): Promise<string>{
        return this.__deploy([uri], options);
    }
    parseApprovalForAllEvent(receipt: TransactionReceipt): ERC1155.ApprovalForAllEvent[]{
        return this.parseEvents(receipt, "ApprovalForAll").map(e=>this.decodeApprovalForAllEvent(e));
    }
    decodeApprovalForAllEvent(event: Event): ERC1155.ApprovalForAllEvent{
        let result = event.data;
        return {
            account: result.account,
            operator: result.operator,
            approved: result.approved,
            _event: event
        };
    }
    parseTransferBatchEvent(receipt: TransactionReceipt): ERC1155.TransferBatchEvent[]{
        return this.parseEvents(receipt, "TransferBatch").map(e=>this.decodeTransferBatchEvent(e));
    }
    decodeTransferBatchEvent(event: Event): ERC1155.TransferBatchEvent{
        let result = event.data;
        return {
            operator: result.operator,
            from: result.from,
            to: result.to,
            ids: result.ids.map(e=>new BigNumber(e)),
            values: result.values.map(e=>new BigNumber(e)),
            _event: event
        };
    }
    parseTransferSingleEvent(receipt: TransactionReceipt): ERC1155.TransferSingleEvent[]{
        return this.parseEvents(receipt, "TransferSingle").map(e=>this.decodeTransferSingleEvent(e));
    }
    decodeTransferSingleEvent(event: Event): ERC1155.TransferSingleEvent{
        let result = event.data;
        return {
            operator: result.operator,
            from: result.from,
            to: result.to,
            id: new BigNumber(result.id),
            value: new BigNumber(result.value),
            _event: event
        };
    }
    parseURIEvent(receipt: TransactionReceipt): ERC1155.URIEvent[]{
        return this.parseEvents(receipt, "URI").map(e=>this.decodeURIEvent(e));
    }
    decodeURIEvent(event: Event): ERC1155.URIEvent{
        let result = event.data;
        return {
            value: result.value,
            id: new BigNumber(result.id),
            _event: event
        };
    }
    balanceOf: {
        (params: IBalanceOfParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    balanceOfBatch: {
        (params: IBalanceOfBatchParams, options?: TransactionOptions): Promise<BigNumber[]>;
    }
    isApprovedForAll: {
        (params: IIsApprovedForAllParams, options?: TransactionOptions): Promise<boolean>;
    }
    safeBatchTransferFrom: {
        (params: ISafeBatchTransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISafeBatchTransferFromParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISafeBatchTransferFromParams, options?: TransactionOptions) => Promise<string>;
    }
    safeTransferFrom: {
        (params: ISafeTransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISafeTransferFromParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISafeTransferFromParams, options?: TransactionOptions) => Promise<string>;
    }
    setApprovalForAll: {
        (params: ISetApprovalForAllParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ISetApprovalForAllParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: ISetApprovalForAllParams, options?: TransactionOptions) => Promise<string>;
    }
    supportsInterface: {
        (interfaceId:string, options?: TransactionOptions): Promise<boolean>;
    }
    uri: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<string>;
    }
    private assign(){
        let balanceOfParams = (params: IBalanceOfParams) => [params.account,this.wallet.utils.toString(params.id)];
        let balanceOf_call = async (params: IBalanceOfParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('balanceOf',balanceOfParams(params),options);
            return new BigNumber(result);
        }
        this.balanceOf = balanceOf_call
        let balanceOfBatchParams = (params: IBalanceOfBatchParams) => [params.accounts,this.wallet.utils.toString(params.ids)];
        let balanceOfBatch_call = async (params: IBalanceOfBatchParams, options?: TransactionOptions): Promise<BigNumber[]> => {
            let result = await this.call('balanceOfBatch',balanceOfBatchParams(params),options);
            return result.map(e=>new BigNumber(e));
        }
        this.balanceOfBatch = balanceOfBatch_call
        let isApprovedForAllParams = (params: IIsApprovedForAllParams) => [params.account,params.operator];
        let isApprovedForAll_call = async (params: IIsApprovedForAllParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('isApprovedForAll',isApprovedForAllParams(params),options);
            return result;
        }
        this.isApprovedForAll = isApprovedForAll_call
        let supportsInterface_call = async (interfaceId:string, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('supportsInterface',[interfaceId],options);
            return result;
        }
        this.supportsInterface = supportsInterface_call
        let uri_call = async (param1:number|BigNumber, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('uri',[this.wallet.utils.toString(param1)],options);
            return result;
        }
        this.uri = uri_call
        let safeBatchTransferFromParams = (params: ISafeBatchTransferFromParams) => [params.from,params.to,this.wallet.utils.toString(params.ids),this.wallet.utils.toString(params.amounts),this.wallet.utils.stringToBytes(params.data)];
        let safeBatchTransferFrom_send = async (params: ISafeBatchTransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('safeBatchTransferFrom',safeBatchTransferFromParams(params),options);
            return result;
        }
        let safeBatchTransferFrom_call = async (params: ISafeBatchTransferFromParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('safeBatchTransferFrom',safeBatchTransferFromParams(params),options);
            return;
        }
        let safeBatchTransferFrom_txData = async (params: ISafeBatchTransferFromParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('safeBatchTransferFrom',safeBatchTransferFromParams(params),options);
            return result;
        }
        this.safeBatchTransferFrom = Object.assign(safeBatchTransferFrom_send, {
            call:safeBatchTransferFrom_call
            , txData:safeBatchTransferFrom_txData
        });
        let safeTransferFromParams = (params: ISafeTransferFromParams) => [params.from,params.to,this.wallet.utils.toString(params.id),this.wallet.utils.toString(params.amount),this.wallet.utils.stringToBytes(params.data)];
        let safeTransferFrom_send = async (params: ISafeTransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('safeTransferFrom',safeTransferFromParams(params),options);
            return result;
        }
        let safeTransferFrom_call = async (params: ISafeTransferFromParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('safeTransferFrom',safeTransferFromParams(params),options);
            return;
        }
        let safeTransferFrom_txData = async (params: ISafeTransferFromParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('safeTransferFrom',safeTransferFromParams(params),options);
            return result;
        }
        this.safeTransferFrom = Object.assign(safeTransferFrom_send, {
            call:safeTransferFrom_call
            , txData:safeTransferFrom_txData
        });
        let setApprovalForAllParams = (params: ISetApprovalForAllParams) => [params.operator,params.approved];
        let setApprovalForAll_send = async (params: ISetApprovalForAllParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('setApprovalForAll',setApprovalForAllParams(params),options);
            return result;
        }
        let setApprovalForAll_call = async (params: ISetApprovalForAllParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('setApprovalForAll',setApprovalForAllParams(params),options);
            return;
        }
        let setApprovalForAll_txData = async (params: ISetApprovalForAllParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('setApprovalForAll',setApprovalForAllParams(params),options);
            return result;
        }
        this.setApprovalForAll = Object.assign(setApprovalForAll_send, {
            call:setApprovalForAll_call
            , txData:setApprovalForAll_txData
        });
    }
}
export module ERC1155{
    export interface ApprovalForAllEvent {account:string,operator:string,approved:boolean,_event:Event}
    export interface TransferBatchEvent {operator:string,from:string,to:string,ids:BigNumber[],values:BigNumber[],_event:Event}
    export interface TransferSingleEvent {operator:string,from:string,to:string,id:BigNumber,value:BigNumber,_event:Event}
    export interface URIEvent {value:string,id:BigNumber,_event:Event}
}