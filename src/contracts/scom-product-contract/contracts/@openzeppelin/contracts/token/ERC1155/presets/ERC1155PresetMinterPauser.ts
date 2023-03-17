import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./ERC1155PresetMinterPauser.json";
export interface IBalanceOfParams {account:string;id:number|BigNumber}
export interface IBalanceOfBatchParams {accounts:string[];ids:(number|BigNumber)[]}
export interface IBurnParams {account:string;id:number|BigNumber;value:number|BigNumber}
export interface IBurnBatchParams {account:string;ids:(number|BigNumber)[];values:(number|BigNumber)[]}
export interface IGetRoleMemberParams {role:string;index:number|BigNumber}
export interface IGrantRoleParams {role:string;account:string}
export interface IHasRoleParams {role:string;account:string}
export interface IIsApprovedForAllParams {account:string;operator:string}
export interface IMintParams {to:string;id:number|BigNumber;amount:number|BigNumber;data:string}
export interface IMintBatchParams {to:string;ids:(number|BigNumber)[];amounts:(number|BigNumber)[];data:string}
export interface IRenounceRoleParams {role:string;account:string}
export interface IRevokeRoleParams {role:string;account:string}
export interface ISafeBatchTransferFromParams {from:string;to:string;ids:(number|BigNumber)[];amounts:(number|BigNumber)[];data:string}
export interface ISafeTransferFromParams {from:string;to:string;id:number|BigNumber;amount:number|BigNumber;data:string}
export interface ISetApprovalForAllParams {operator:string;approved:boolean}
export class ERC1155PresetMinterPauser extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(uri:string, options?: TransactionOptions): Promise<string>{
        return this.__deploy([uri], options);
    }
    parseApprovalForAllEvent(receipt: TransactionReceipt): ERC1155PresetMinterPauser.ApprovalForAllEvent[]{
        return this.parseEvents(receipt, "ApprovalForAll").map(e=>this.decodeApprovalForAllEvent(e));
    }
    decodeApprovalForAllEvent(event: Event): ERC1155PresetMinterPauser.ApprovalForAllEvent{
        let result = event.data;
        return {
            account: result.account,
            operator: result.operator,
            approved: result.approved,
            _event: event
        };
    }
    parsePausedEvent(receipt: TransactionReceipt): ERC1155PresetMinterPauser.PausedEvent[]{
        return this.parseEvents(receipt, "Paused").map(e=>this.decodePausedEvent(e));
    }
    decodePausedEvent(event: Event): ERC1155PresetMinterPauser.PausedEvent{
        let result = event.data;
        return {
            account: result.account,
            _event: event
        };
    }
    parseRoleAdminChangedEvent(receipt: TransactionReceipt): ERC1155PresetMinterPauser.RoleAdminChangedEvent[]{
        return this.parseEvents(receipt, "RoleAdminChanged").map(e=>this.decodeRoleAdminChangedEvent(e));
    }
    decodeRoleAdminChangedEvent(event: Event): ERC1155PresetMinterPauser.RoleAdminChangedEvent{
        let result = event.data;
        return {
            role: result.role,
            previousAdminRole: result.previousAdminRole,
            newAdminRole: result.newAdminRole,
            _event: event
        };
    }
    parseRoleGrantedEvent(receipt: TransactionReceipt): ERC1155PresetMinterPauser.RoleGrantedEvent[]{
        return this.parseEvents(receipt, "RoleGranted").map(e=>this.decodeRoleGrantedEvent(e));
    }
    decodeRoleGrantedEvent(event: Event): ERC1155PresetMinterPauser.RoleGrantedEvent{
        let result = event.data;
        return {
            role: result.role,
            account: result.account,
            sender: result.sender,
            _event: event
        };
    }
    parseRoleRevokedEvent(receipt: TransactionReceipt): ERC1155PresetMinterPauser.RoleRevokedEvent[]{
        return this.parseEvents(receipt, "RoleRevoked").map(e=>this.decodeRoleRevokedEvent(e));
    }
    decodeRoleRevokedEvent(event: Event): ERC1155PresetMinterPauser.RoleRevokedEvent{
        let result = event.data;
        return {
            role: result.role,
            account: result.account,
            sender: result.sender,
            _event: event
        };
    }
    parseTransferBatchEvent(receipt: TransactionReceipt): ERC1155PresetMinterPauser.TransferBatchEvent[]{
        return this.parseEvents(receipt, "TransferBatch").map(e=>this.decodeTransferBatchEvent(e));
    }
    decodeTransferBatchEvent(event: Event): ERC1155PresetMinterPauser.TransferBatchEvent{
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
    parseTransferSingleEvent(receipt: TransactionReceipt): ERC1155PresetMinterPauser.TransferSingleEvent[]{
        return this.parseEvents(receipt, "TransferSingle").map(e=>this.decodeTransferSingleEvent(e));
    }
    decodeTransferSingleEvent(event: Event): ERC1155PresetMinterPauser.TransferSingleEvent{
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
    parseURIEvent(receipt: TransactionReceipt): ERC1155PresetMinterPauser.URIEvent[]{
        return this.parseEvents(receipt, "URI").map(e=>this.decodeURIEvent(e));
    }
    decodeURIEvent(event: Event): ERC1155PresetMinterPauser.URIEvent{
        let result = event.data;
        return {
            value: result.value,
            id: new BigNumber(result.id),
            _event: event
        };
    }
    parseUnpausedEvent(receipt: TransactionReceipt): ERC1155PresetMinterPauser.UnpausedEvent[]{
        return this.parseEvents(receipt, "Unpaused").map(e=>this.decodeUnpausedEvent(e));
    }
    decodeUnpausedEvent(event: Event): ERC1155PresetMinterPauser.UnpausedEvent{
        let result = event.data;
        return {
            account: result.account,
            _event: event
        };
    }
    DEFAULT_ADMIN_ROLE: {
        (options?: TransactionOptions): Promise<string>;
    }
    MINTER_ROLE: {
        (options?: TransactionOptions): Promise<string>;
    }
    PAUSER_ROLE: {
        (options?: TransactionOptions): Promise<string>;
    }
    balanceOf: {
        (params: IBalanceOfParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    balanceOfBatch: {
        (params: IBalanceOfBatchParams, options?: TransactionOptions): Promise<BigNumber[]>;
    }
    burn: {
        (params: IBurnParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IBurnParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IBurnParams, options?: TransactionOptions) => Promise<string>;
    }
    burnBatch: {
        (params: IBurnBatchParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IBurnBatchParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IBurnBatchParams, options?: TransactionOptions) => Promise<string>;
    }
    getRoleAdmin: {
        (role:string, options?: TransactionOptions): Promise<string>;
    }
    getRoleMember: {
        (params: IGetRoleMemberParams, options?: TransactionOptions): Promise<string>;
    }
    getRoleMemberCount: {
        (role:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    grantRole: {
        (params: IGrantRoleParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IGrantRoleParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IGrantRoleParams, options?: TransactionOptions) => Promise<string>;
    }
    hasRole: {
        (params: IHasRoleParams, options?: TransactionOptions): Promise<boolean>;
    }
    isApprovedForAll: {
        (params: IIsApprovedForAllParams, options?: TransactionOptions): Promise<boolean>;
    }
    mint: {
        (params: IMintParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IMintParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IMintParams, options?: TransactionOptions) => Promise<string>;
    }
    mintBatch: {
        (params: IMintBatchParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IMintBatchParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IMintBatchParams, options?: TransactionOptions) => Promise<string>;
    }
    pause: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    paused: {
        (options?: TransactionOptions): Promise<boolean>;
    }
    renounceRole: {
        (params: IRenounceRoleParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRenounceRoleParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRenounceRoleParams, options?: TransactionOptions) => Promise<string>;
    }
    revokeRole: {
        (params: IRevokeRoleParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRevokeRoleParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRevokeRoleParams, options?: TransactionOptions) => Promise<string>;
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
    unpause: {
        (options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (options?: TransactionOptions) => Promise<void>;
        txData: (options?: TransactionOptions) => Promise<string>;
    }
    uri: {
        (param1:number|BigNumber, options?: TransactionOptions): Promise<string>;
    }
    private assign(){
        let DEFAULT_ADMIN_ROLE_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('DEFAULT_ADMIN_ROLE',[],options);
            return result;
        }
        this.DEFAULT_ADMIN_ROLE = DEFAULT_ADMIN_ROLE_call
        let MINTER_ROLE_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('MINTER_ROLE',[],options);
            return result;
        }
        this.MINTER_ROLE = MINTER_ROLE_call
        let PAUSER_ROLE_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('PAUSER_ROLE',[],options);
            return result;
        }
        this.PAUSER_ROLE = PAUSER_ROLE_call
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
        let getRoleAdmin_call = async (role:string, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('getRoleAdmin',[this.wallet.utils.stringToBytes32(role)],options);
            return result;
        }
        this.getRoleAdmin = getRoleAdmin_call
        let getRoleMemberParams = (params: IGetRoleMemberParams) => [this.wallet.utils.stringToBytes32(params.role),this.wallet.utils.toString(params.index)];
        let getRoleMember_call = async (params: IGetRoleMemberParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.call('getRoleMember',getRoleMemberParams(params),options);
            return result;
        }
        this.getRoleMember = getRoleMember_call
        let getRoleMemberCount_call = async (role:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('getRoleMemberCount',[this.wallet.utils.stringToBytes32(role)],options);
            return new BigNumber(result);
        }
        this.getRoleMemberCount = getRoleMemberCount_call
        let hasRoleParams = (params: IHasRoleParams) => [this.wallet.utils.stringToBytes32(params.role),params.account];
        let hasRole_call = async (params: IHasRoleParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('hasRole',hasRoleParams(params),options);
            return result;
        }
        this.hasRole = hasRole_call
        let isApprovedForAllParams = (params: IIsApprovedForAllParams) => [params.account,params.operator];
        let isApprovedForAll_call = async (params: IIsApprovedForAllParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('isApprovedForAll',isApprovedForAllParams(params),options);
            return result;
        }
        this.isApprovedForAll = isApprovedForAll_call
        let paused_call = async (options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('paused',[],options);
            return result;
        }
        this.paused = paused_call
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
        let burnParams = (params: IBurnParams) => [params.account,this.wallet.utils.toString(params.id),this.wallet.utils.toString(params.value)];
        let burn_send = async (params: IBurnParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('burn',burnParams(params),options);
            return result;
        }
        let burn_call = async (params: IBurnParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('burn',burnParams(params),options);
            return;
        }
        let burn_txData = async (params: IBurnParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('burn',burnParams(params),options);
            return result;
        }
        this.burn = Object.assign(burn_send, {
            call:burn_call
            , txData:burn_txData
        });
        let burnBatchParams = (params: IBurnBatchParams) => [params.account,this.wallet.utils.toString(params.ids),this.wallet.utils.toString(params.values)];
        let burnBatch_send = async (params: IBurnBatchParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('burnBatch',burnBatchParams(params),options);
            return result;
        }
        let burnBatch_call = async (params: IBurnBatchParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('burnBatch',burnBatchParams(params),options);
            return;
        }
        let burnBatch_txData = async (params: IBurnBatchParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('burnBatch',burnBatchParams(params),options);
            return result;
        }
        this.burnBatch = Object.assign(burnBatch_send, {
            call:burnBatch_call
            , txData:burnBatch_txData
        });
        let grantRoleParams = (params: IGrantRoleParams) => [this.wallet.utils.stringToBytes32(params.role),params.account];
        let grantRole_send = async (params: IGrantRoleParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('grantRole',grantRoleParams(params),options);
            return result;
        }
        let grantRole_call = async (params: IGrantRoleParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('grantRole',grantRoleParams(params),options);
            return;
        }
        let grantRole_txData = async (params: IGrantRoleParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('grantRole',grantRoleParams(params),options);
            return result;
        }
        this.grantRole = Object.assign(grantRole_send, {
            call:grantRole_call
            , txData:grantRole_txData
        });
        let mintParams = (params: IMintParams) => [params.to,this.wallet.utils.toString(params.id),this.wallet.utils.toString(params.amount),this.wallet.utils.stringToBytes(params.data)];
        let mint_send = async (params: IMintParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('mint',mintParams(params),options);
            return result;
        }
        let mint_call = async (params: IMintParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('mint',mintParams(params),options);
            return;
        }
        let mint_txData = async (params: IMintParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('mint',mintParams(params),options);
            return result;
        }
        this.mint = Object.assign(mint_send, {
            call:mint_call
            , txData:mint_txData
        });
        let mintBatchParams = (params: IMintBatchParams) => [params.to,this.wallet.utils.toString(params.ids),this.wallet.utils.toString(params.amounts),this.wallet.utils.stringToBytes(params.data)];
        let mintBatch_send = async (params: IMintBatchParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('mintBatch',mintBatchParams(params),options);
            return result;
        }
        let mintBatch_call = async (params: IMintBatchParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('mintBatch',mintBatchParams(params),options);
            return;
        }
        let mintBatch_txData = async (params: IMintBatchParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('mintBatch',mintBatchParams(params),options);
            return result;
        }
        this.mintBatch = Object.assign(mintBatch_send, {
            call:mintBatch_call
            , txData:mintBatch_txData
        });
        let pause_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('pause',[],options);
            return result;
        }
        let pause_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('pause',[],options);
            return;
        }
        let pause_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('pause',[],options);
            return result;
        }
        this.pause = Object.assign(pause_send, {
            call:pause_call
            , txData:pause_txData
        });
        let renounceRoleParams = (params: IRenounceRoleParams) => [this.wallet.utils.stringToBytes32(params.role),params.account];
        let renounceRole_send = async (params: IRenounceRoleParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('renounceRole',renounceRoleParams(params),options);
            return result;
        }
        let renounceRole_call = async (params: IRenounceRoleParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('renounceRole',renounceRoleParams(params),options);
            return;
        }
        let renounceRole_txData = async (params: IRenounceRoleParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('renounceRole',renounceRoleParams(params),options);
            return result;
        }
        this.renounceRole = Object.assign(renounceRole_send, {
            call:renounceRole_call
            , txData:renounceRole_txData
        });
        let revokeRoleParams = (params: IRevokeRoleParams) => [this.wallet.utils.stringToBytes32(params.role),params.account];
        let revokeRole_send = async (params: IRevokeRoleParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('revokeRole',revokeRoleParams(params),options);
            return result;
        }
        let revokeRole_call = async (params: IRevokeRoleParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('revokeRole',revokeRoleParams(params),options);
            return;
        }
        let revokeRole_txData = async (params: IRevokeRoleParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('revokeRole',revokeRoleParams(params),options);
            return result;
        }
        this.revokeRole = Object.assign(revokeRole_send, {
            call:revokeRole_call
            , txData:revokeRole_txData
        });
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
        let unpause_send = async (options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('unpause',[],options);
            return result;
        }
        let unpause_call = async (options?: TransactionOptions): Promise<void> => {
            let result = await this.call('unpause',[],options);
            return;
        }
        let unpause_txData = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('unpause',[],options);
            return result;
        }
        this.unpause = Object.assign(unpause_send, {
            call:unpause_call
            , txData:unpause_txData
        });
    }
}
export module ERC1155PresetMinterPauser{
    export interface ApprovalForAllEvent {account:string,operator:string,approved:boolean,_event:Event}
    export interface PausedEvent {account:string,_event:Event}
    export interface RoleAdminChangedEvent {role:string,previousAdminRole:string,newAdminRole:string,_event:Event}
    export interface RoleGrantedEvent {role:string,account:string,sender:string,_event:Event}
    export interface RoleRevokedEvent {role:string,account:string,sender:string,_event:Event}
    export interface TransferBatchEvent {operator:string,from:string,to:string,ids:BigNumber[],values:BigNumber[],_event:Event}
    export interface TransferSingleEvent {operator:string,from:string,to:string,id:BigNumber,value:BigNumber,_event:Event}
    export interface URIEvent {value:string,id:BigNumber,_event:Event}
    export interface UnpausedEvent {account:string,_event:Event}
}