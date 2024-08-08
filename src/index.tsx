import {
  Module,
  customModule,
  customElements,
  GridLayout,
  Markdown,
  Image,
  Label,
  Styles,
  HStack,
  Input,
  Button,
  Container,
  VStack,
  ControlElement,
  Icon,
  application,
  FormatUtils,
} from '@ijstech/components';
import { BigNumber, Constants, IERC20ApprovalAction, IEventBusRegistry, Utils, Wallet } from '@ijstech/eth-wallet';
import { IChainSpecificProperties, IEmbedData, INetworkConfig, IProductInfo, IWalletPlugin, ProductType } from './interface/index';
import { delay, formatNumber, getProxySelectors, getTokenBalance, registerSendTxEvents, nullAddress, getTokenInfo } from './utils/index';
import { State, isClientWalletConnected } from './store/index';
import { inputStyle, linkStyle, markdownStyle, tokenSelectionStyle } from './index.css';
import { buyProduct, donate, fetchOswapTrollNftInfo, fetchUserNftBalance, getNFTBalance, getProductInfo, getProxyTokenAmountIn, mintOswapTrollNft, newDefaultBuyProduct } from './API';
import configData from './data.json';
import ScomDappContainer from '@scom/scom-dapp-container';
import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
import { ITokenObject, tokenStore } from '@scom/scom-token-list';
import ScomTxStatusModal from '@scom/scom-tx-status-modal';
import ScomTokenInput from '@scom/scom-token-input';
import ScomWalletModal from '@scom/scom-wallet-modal';
import { getBuilderSchema, getProjectOwnerSchema3 as getProjectOwnerSchema } from './formSchema.json';

interface ScomNftMinterElement extends ControlElement {
  lazyLoad?: boolean;
  name?: string;
  nftType?: 'ERC721' | 'ERC1155' | '';
  chainId?: number;
  nftAddress?: string;

  //ERC1155
  erc1155Index?: number;
  productType?: 'Buy' | 'DonateToOwner' | 'DonateToEveryone';
  //ERC1155NewIndex
  tokenToMint?: string;
  isCustomMintToken?: boolean;
  customMintToken?: string;
  priceToMint?: string;
  maxQty?: number;
  txnMaxQty?: number;

  title?: string;
  description?: string;
  logoUrl?: string;
  link?: string;
  chainSpecificProperties?: Record<number, IChainSpecificProperties>;
  defaultChainId: number;
  wallets: IWalletPlugin[];
  networks: INetworkConfig[];
  showHeader?: boolean;
  requiredQuantity?: number;
  onMintedNFT?: () => void;
}

const Theme = Styles.Theme.ThemeVars;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-nft-minter"]: ScomNftMinterElement;
    }
  }
}

@customModule
@customElements('i-scom-nft-minter')
export default class ScomNftMinter extends Module {
  private state: State;
  private imgLogo: Image;
  private markdownViewer: Markdown;
  private pnlLink: HStack;
  private lblLink: Label;
  private lblTitle: Label;
  private pnlMintFee: HStack;
  private lblMintFee: Label;
  private lblSpotsRemaining: Label;
  private lbContract: Label;
  private lbToken: Label;
  private lbOwn: Label;
  private lbERC1155Index: Label;
  private pnlTokenInput: VStack;
  private pnlQty: HStack;
  private edtQty: Input;
  private lblBalance: Label;
  private btnSubmit: Button;
  private btnApprove: Button;
  private pnlAddress: VStack;
  private lblRef: Label;
  private lblAddress: Label;
  private tokenInput: ScomTokenInput;
  private txStatusModal: ScomTxStatusModal;
  private lbOrderTotal: Label;
  private lbOrderTotalTitle: Label;
  private iconOrderTotal: Icon;
  private pnlInputFields: VStack;
  private pnlUnsupportedNetwork: VStack;
  private containerDapp: ScomDappContainer;
  private mdWallet: ScomWalletModal;

  private productInfo: IProductInfo;
  private _type: ProductType | undefined;
  private _data: IEmbedData = {
    wallets: [],
    networks: [],
    defaultChainId: 0
  };
  private approvalModelAction: IERC20ApprovalAction;
  private isApproving: boolean = false;
  private tokenAmountIn: string;
  tag: any = {};
  defaultEdit: boolean = true;
  private contractAddress: string;
  private rpcWalletEvents: IEventBusRegistry[] = [];
  private cap: number;
  private oswapTrollInfo: { token: ITokenObject; price: BigNumber };
  private detailWrapper: HStack;
  private erc1155Wrapper: HStack;
  private btnDetail: Button;
  private isCancelCreate: boolean;
  public onMintedNFT: () => void;

  constructor(parent?: Container, options?: ScomNftMinterElement) {
    super(parent, options);
    this.state = new State(configData);
  }

  removeRpcWalletEvents() {
    const rpcWallet = this.rpcWallet;
    for (let event of this.rpcWalletEvents) {
      rpcWallet.unregisterWalletEvent(event);
    }
    this.rpcWalletEvents = [];
  }

  onHide() {
    this.containerDapp.onHide();
    this.removeRpcWalletEvents();
  }

  static async create(options?: ScomNftMinterElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  private get chainId() {
    return this.state.getChainId();
  }

  private get rpcWallet() {
    return this.state.getRpcWallet();
  }

  get nftType() {
    return this._data.nftType;
  }

  get nftAddress() {
    return this._data.nftAddress;
  }

  get newPrice() {
    return this._data.priceToMint;
  }

  get newMaxQty() {
    return this._data.maxQty;
  }

  get newTxnMaxQty() {
    return this._data.txnMaxQty;
  }

  get donateTo() {
    return this._data.donateTo ?? this._data.chainSpecificProperties?.[this.chainId]?.donateTo ?? '';
  }

  get link() {
    return this._data.link ?? '';
  }

  set link(value: string) {
    this._data.link = value;
  }

  get productId() {
    return this._data.erc1155Index ?? this._data.chainSpecificProperties?.[this.chainId]?.productId ?? 0;
  }

  get productType() {
    return this._data.productType ?? ProductType.Buy;
  }

  set productType(value: ProductType) {
    this._data.productType = value;
  }

  get name() {
    return this._data.name ?? '';
  }

  set name(value: string) {
    this._data.name = value;
  }

  get description() {
    return this._data.description ?? '';
  }

  set description(value: string) {
    this._data.description = value;
  }

  get logoUrl() {
    return this._data.logoUrl;
  }

  set logoUrl(value: string) {
    this._data.logoUrl = value;
  }

  get commissions() {
    return this._data.commissions ?? [];
  }

  set commissions(value: any) {
    this._data.commissions = value;
  }

  get chainSpecificProperties() {
    return this._data.chainSpecificProperties ?? {};
  }

  set chainSpecificProperties(value: any) {
    this._data.chainSpecificProperties = value;
  }

  get wallets() {
    return this._data.wallets ?? [];
  }
  set wallets(value: IWalletPlugin[]) {
    this._data.wallets = value;
  }

  get networks() {
    const nets = this._data.networks ?? configData.defaultBuilderData.networks;
    if (this._data.chainId && this.nftType === 'ERC721' && !nets.some(v => v.chainId === this._data.chainId)) {
      nets.push({ chainId: this._data.chainId });
    }
    return nets;
  }
  set networks(value: INetworkConfig[]) {
    this._data.networks = value;
  }

  get showHeader() {
    return this._data.showHeader ?? true;
  }
  set showHeader(value: boolean) {
    this._data.showHeader = value;
  }

  get defaultChainId() {
    return this._data.defaultChainId;
  }
  set defaultChainId(value: number) {
    this._data.defaultChainId = value;
  }

  private onChainChanged = async () => {
    this.tokenInput.chainId = this.state.getChainId();
    this.onSetupPage();
    this.updateContractAddress();
    this.refreshDApp();
  }

  private updateTokenBalance = async () => {
    const token = this.productInfo?.token;
    if (!token) return;
    try {
      const symbol = token.symbol || '';
      this.lblBalance.caption = `${formatNumber(await getTokenBalance(this.rpcWallet, token))} ${symbol}`;
    } catch { }
  }

  private async onSetupPage() {
    if (this.state.isRpcWalletConnected()) await this.initApprovalAction();
  }

  private getBuilderActions(category?: string) {
    let self = this;
    const formSchema = getBuilderSchema();
    const actions: any = [
      {
        name: 'Commissions',
        icon: 'dollar-sign',
        command: (builder: any, userInputData: any) => {
          let _oldData: IEmbedData = {
            wallets: [],
            networks: [],
            defaultChainId: 0
          };
          return {
            execute: async () => {
              _oldData = { ...this._data };
              let resultingData = {
                ...self._data,
                commissions: userInputData.commissions
              };
              await self.setData(resultingData);
              if (builder?.setData) builder.setData(this._data);
            },
            undo: async () => {
              this._data = { ..._oldData };
              await self.setData(this._data);
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        customUI: {
          render: (data?: any, onConfirm?: (result: boolean, data: any) => void) => {
            const vstack = new VStack();
            const config = new ScomCommissionFeeSetup(null, {
              commissions: self._data.commissions,
              fee: this.state.embedderCommissionFee,
              networks: self._data.networks
            });
            const hstack = new HStack(null, {
              verticalAlignment: 'center',
            });
            const button = new Button(hstack, {
              caption: 'Confirm',
              width: '100%',
              height: 40,
              font: { color: Theme.colors.primary.contrastText }
            });
            vstack.append(config);
            vstack.append(hstack);
            button.onClick = async () => {
              const commissions = config.commissions;
              if (onConfirm) onConfirm(true, { commissions });
            }
            return vstack;
          }
        }
      }
    ];

    if (category && category !== 'offers') {
      actions.push({
        name: 'Edit',
        icon: 'edit',
        command: (builder: any, userInputData: any) => {
          let oldData: IEmbedData = {
            wallets: [],
            networks: [],
            defaultChainId: 0
          };
          let oldTag = {};
          return {
            execute: async () => {
              oldData = JSON.parse(JSON.stringify(this._data));
              const {
                name,
                title,
                productType,
                logoUrl,
                description,
                link,
                requiredQuantity,
                erc1155Index,
                nftType,
                chainId,
                nftAddress,
                chainSpecificProperties,
                defaultChainId,
                tokenToMint,
                isCustomMintToken,
                customMintToken,
                priceToMint,
                maxQty,
                txnMaxQty,
                ...themeSettings
              } = userInputData;

              const generalSettings = {
                name,
                title,
                productType,
                logoUrl,
                description,
                link,
                requiredQuantity,
                erc1155Index,
                nftType,
                chainId,
                nftAddress,
                chainSpecificProperties,
                defaultChainId,
                tokenToMint,
                isCustomMintToken,
                customMintToken,
                priceToMint,
                maxQty,
                txnMaxQty,
              };

              Object.assign(this._data, generalSettings);
              await this.resetRpcWallet();
              if (builder?.setData) builder.setData(this._data);
              this.refreshDApp();

              oldTag = JSON.parse(JSON.stringify(this.tag));
              if (builder?.setTag) builder.setTag(themeSettings);
              else this.setTag(themeSettings);
              if (this.containerDapp) this.containerDapp.setTag(themeSettings);
            },
            undo: () => {
              this._data = JSON.parse(JSON.stringify(oldData));
              this.refreshDApp();
              if (builder?.setData) builder.setData(this._data);

              this.tag = JSON.parse(JSON.stringify(oldTag));
              if (builder?.setTag) builder.setTag(this.tag);
              else this.setTag(this.tag);
              if (this.containerDapp) this.containerDapp.setTag(this.tag);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: formSchema.dataSchema,
        userInputUISchema: formSchema.uiSchema
      });
    }
    return actions;
  }

  private getProjectOwnerActions(isDefault1155New: boolean) {
    //const isDonation = this._data.productType === ProductType.DonateToOwner || this._data.productType === ProductType.DonateToEveryone;
    const formSchema = getProjectOwnerSchema(isDefault1155New);
    const actions: any[] = [
      {
        name: 'Settings',
        userInputDataSchema: formSchema.dataSchema,
        userInputUISchema: formSchema.uiSchema,
        customControls: formSchema.customControls()
      }
    ];
    return actions;
  }

  getConfigurators(type?: 'new1155' | 'customNft') {
    let isNew1155 = (type && type === 'new1155');
    const { defaultBuilderData, defaultExistingNft, defaultCreate1155Index } = configData;
    const defaultData = isNew1155 ? defaultCreate1155Index : defaultExistingNft;

    let self = this;
    return [
      {
        name: 'Project Owner Configurator',
        target: 'Project Owners',
        getProxySelectors: async (chainId: number) => {
          const selectors = await getProxySelectors(this.state, chainId);
          return selectors;
        },
        getActions: () => {
          return this.getProjectOwnerActions(isNew1155);
        },
        getData: this.getData.bind(this),
        setData: async (data: IEmbedData) => {
          await this.setData({ ...defaultBuilderData, ...defaultData, ...data });
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: (category?: string) => {
          return this.getBuilderActions(category);
        },
        getData: this.getData.bind(this),
        setData: async (data: IEmbedData) => {
          const defaultData = configData.defaultBuilderData;
          await this.setData({ ...defaultData, ...data });
        },
        setupData: async (data: IEmbedData) => {
          const defaultData = configData.defaultBuilderData;
          this._data = { ...defaultBuilderData, ...defaultData, ...data };
          if (!this.nftType) {
            const contract = this.state.getContractAddress('ProductInfo');
            const maxQty = this.newMaxQty;
            if (!contract || new BigNumber(maxQty).lte(0)) {
              return false;
            }
            this._data.erc1155Index = undefined;
            this.isCancelCreate = false;
            await this.resetRpcWallet();
            await this.initWallet();
            await this.newProduct();
            while (!this._data.erc1155Index && !this.isCancelCreate) {
              await delay(2000);
              if (this.isCancelCreate) return;
              await this.newProduct();
            }
            return this._data.erc1155Index >= 0;
          }
          return true;
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Emdedder Configurator',
        target: 'Embedders',
        elementName: 'i-scom-commission-fee-setup',
        getLinkParams: () => {
          const commissions = self._data.commissions || [];
          return {
            data: window.btoa(JSON.stringify(commissions))
          }
        },
        setLinkParams: async (params: any) => {
          if (params.data) {
            const decodedString = window.atob(params.data);
            const commissions = JSON.parse(decodedString);
            let resultingData = {
              ...self._data,
              commissions
            };
            await self.setData(resultingData);
          }
        },
        bindOnChanged: (element: ScomCommissionFeeSetup, callback: (data: any) => Promise<void>) => {
          element.onChanged = async (data: any) => {
            let resultingData = {
              ...self._data,
              ...data
            };
            await self.setData(resultingData);
            await callback(data);
          }
        },
        getData: () => {
          const fee = this.state.embedderCommissionFee;
          return { ...this.getData(), fee }
        },
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Editor',
        target: 'Editor',
        getActions: (category?: string) => {
          const actions = this.getProjectOwnerActions(isNew1155);
          return actions;
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private getData() {
    return this._data;
  }

  private async resetRpcWallet() {
    this.removeRpcWalletEvents();
    const rpcWalletId = await this.state.initRpcWallet(this._data.chainId || this.defaultChainId);
    const rpcWallet = this.rpcWallet;
    const chainChangedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.ChainChanged, async (chainId: number) => {
      this.onChainChanged();
    });
    const connectedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.Connected, async (connected: boolean) => {
      this.onSetupPage();
      this.updateContractAddress();
      this.refreshDApp();
    });
    this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);

    const chainId = this._data.chainId;
    const data = {
      defaultChainId: chainId || this.defaultChainId,
      wallets: this.wallets,
      networks: chainId ? [{ chainId: chainId }] : this.networks,
      showHeader: this.showHeader,
      rpcWalletId: rpcWallet.instanceId
    }
    if (this.containerDapp?.setData) this.containerDapp.setData(data);
  }

  private async setData(data: IEmbedData) {
    this._data = data;
    await this.resetRpcWallet();
    if (!this.tokenInput.isConnected) await this.tokenInput.ready();
    this.tokenInput.chainId = this.state.getChainId() ?? this.defaultChainId;
    await this.onSetupPage();
    const commissionFee = this.state.embedderCommissionFee;
    if (!this.lbOrderTotalTitle.isConnected) await this.lbOrderTotalTitle.ready();
    this.lbOrderTotalTitle.caption = `You are going to pay`;
    this.iconOrderTotal.tooltip.content = `A commission fee of ${new BigNumber(commissionFee).times(100)}% will be applied to the amount you input.`;
    this.updateContractAddress();
    await this.refreshDApp();
  }

  private getTag() {
    return this.tag;
  }

  private updateTag(type: 'light' | 'dark', value: any) {
    this.tag[type] = this.tag[type] ?? {};
    for (let prop in value) {
      if (value.hasOwnProperty(prop))
        this.tag[type][prop] = value[prop];
    }
  }

  private async setTag(value: any) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop)) {
        if (prop === 'light' || prop === 'dark')
          this.updateTag(prop, newValue[prop]);
        else
          this.tag[prop] = newValue[prop];
      }
    }
    if (this.containerDapp)
      this.containerDapp.setTag(this.tag);
    this.updateTheme();
  }

  private updateStyle(name: string, value: any) {
    value ?
      this.style.setProperty(name, value) :
      this.style.removeProperty(name);
  }

  private updateTheme() {
    const themeVar = this.containerDapp?.theme || 'dark';
    this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
    this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
    this.updateStyle('--input-font_color', this.tag[themeVar]?.inputFontColor);
    this.updateStyle('--input-background', this.tag[themeVar]?.inputBackgroundColor);
    this.updateStyle('--colors-primary-main', this.tag[themeVar]?.buttonBackgroundColor);
  }

  private newProduct = async () => {
    let contract = this.state.getContractAddress('ProductInfo');
    const maxQty = this.newMaxQty;
    // const txnMaxQty = this.newTxnMaxQty;
    const price = new BigNumber(this.newPrice).toFixed();
    if ((!this.nftType) && contract && new BigNumber(maxQty).gt(0)) {
      if (this._data.erc1155Index >= 0) {
        this._data.nftType = 'ERC1155';
        return;
      };
      const callback = (err: Error, receipt?: string) => {
        if (err) {
          this.showTxStatusModal('error', err);
        }
      }
      const confirmationCallback = async (receipt: any) => {

      }
      if (!isClientWalletConnected()) {
        if (this.mdWallet) {
          await application.loadPackage('@scom/scom-wallet-modal', '*');
          this.mdWallet.networks = this.networks;
          this.mdWallet.wallets = this.wallets;
          this.mdWallet.showModal();
        }
        return;
      }
      if (!this.state.isRpcWalletConnected()) {
        const clientWallet = Wallet.getClientInstance();
        await clientWallet.switchNetwork(this.chainId);
        await delay(3000);
        contract = this.state.getContractAddress('ProductInfo');
      }
      try {
        const { isCustomMintToken, tokenToMint, customMintToken } = this._data;
        if ((isCustomMintToken && !customMintToken) || (!isCustomMintToken && !tokenToMint)) throw new Error("tokenToMint is missing");
        const tokenAddress = isCustomMintToken ? customMintToken : tokenToMint;
        if (tokenAddress === nullAddress || !tokenAddress.startsWith('0x')) {
          //pay native token
          const result = await newDefaultBuyProduct(
            contract,
            maxQty,
            price,
            nullAddress,
            18,
            callback,
            confirmationCallback
          );
          this._data.erc1155Index = result.productId;
          this._data.nftAddress = contract;
          this._data.nftType = 'ERC1155';
        } else { //pay erc20
          let token: ITokenObject;
          if (isCustomMintToken) {
            token = await getTokenInfo(tokenAddress, this.chainId);
          } else {
            token = tokenStore.getTokenList(this.chainId).find(v => v.address?.toLowerCase() === tokenAddress.toLowerCase());
          }
          if (!token) {
            this.showTxStatusModal('error', 'Invalid token!');
            this.isCancelCreate = true;
            return;
          }
          const result = await newDefaultBuyProduct(
            contract,
            maxQty,
            price,
            tokenAddress,
            token.decimals ?? 18,
            callback,
            confirmationCallback
          );
          this._data.erc1155Index = result.productId;
          this._data.nftAddress = contract;
          this._data.nftType = 'ERC1155';
        }
      } catch (error) {
        this.showTxStatusModal('error', 'Something went wrong creating new product!');
        this.isCancelCreate = true;
        console.log('newProduct', error);
      }
    }
  }

  private async initWallet() {
    try {
      await Wallet.getClientInstance().init();
      await this.rpcWallet.init();
    } catch { }
  }

  private async updateDAppUI(data: IEmbedData) {
    this.markdownViewer.visible = !!data.description;
    this.markdownViewer.load(data.description || '');
    this.pnlLink.visible = !!data.link;
    (!this.lblLink.isConnected) && await this.lblLink.ready();
    this.lblLink.caption = data.link || '';
    this.lblLink.link.href = data.link;
    this.imgLogo.visible = !!data.logoUrl;
    this.imgLogo.url = data.logoUrl || "";
    this.lblTitle.visible = !!data.title;
    (!this.lblTitle.isConnected) && await this.lblTitle.ready();
    this.lblTitle.caption = data.title || '';
  }

  private async refreshDApp() {
    setTimeout(async () => {
      this._type = this.productType;
      await this.updateDAppUI(this._data);
      if (this.nftType !== 'ERC721' && (!this.productId || this.productId === 0)) return;
      await this.initWallet();
      this.btnSubmit.enabled = !isClientWalletConnected() || !this.state.isRpcWalletConnected();
      // OswapTroll
      if (this.nftType === 'ERC721') {
        this.lblTitle.caption = this._data.title;
        if (!this.nftAddress) return;
        const oswapTroll = await fetchOswapTrollNftInfo(this.state, this.nftAddress);
        if (!oswapTroll) {
          this.pnlUnsupportedNetwork.visible = true;
          this.pnlInputFields.visible = false;
          return;
        };
        const nftBalance = isClientWalletConnected() ? await fetchUserNftBalance(this.state, this.nftAddress) : 0;
        const { price, cap, tokenAddress } = oswapTroll;
        const token = tokenStore.getTokenList(this.chainId).find(v => v.address === tokenAddress);
        this.pnlInputFields.visible = true;
        this.pnlUnsupportedNetwork.visible = false;
        this.detailWrapper.visible = true;
        this.onToggleDetail();
        this.btnDetail.visible = true;
        this.erc1155Wrapper.visible = false;
        this.lbContract.caption = FormatUtils.truncateWalletAddress(this.nftAddress);
        this.lbToken.caption = FormatUtils.truncateWalletAddress(tokenAddress);
        this.lbOwn.caption = formatNumber(nftBalance || 0, 0);
        this.pnlMintFee.visible = true;
        this.oswapTrollInfo = { token, price };
        this.lblMintFee.caption = `${formatNumber(price)} ${token?.symbol || ''}`;
        this.lblSpotsRemaining.caption = formatNumber(cap, 0);
        this.cap = cap.toNumber();
        //this.pnlQty.visible = true;
        this.edtQty.readOnly = true;
        this.edtQty.value = '1';
        this.lbOrderTotal.caption = `${formatNumber(price)} ${token?.symbol || ''}`;
        this.pnlTokenInput.visible = false;
        this.determineBtnSubmitCaption();
        return;
      }
      //this.edtQty.readOnly = false;
      this.edtQty.readOnly = true;
      this.productInfo = await getProductInfo(this.state, this.productId);
      if (this.productInfo) {
        const token = this.productInfo.token;
        this.pnlInputFields.visible = true;
        this.pnlUnsupportedNetwork.visible = false;
        const price = Utils.fromDecimals(this.productInfo.price, token.decimals).toFixed();
        (!this.lblRef.isConnected) && await this.lblRef.ready();
        if (this._type === ProductType.Buy) {
          const nftBalance = isClientWalletConnected() ? await getNFTBalance(this.state, this.productId) : 0;
          this.detailWrapper.visible = true;
          this.onToggleDetail();
          this.btnDetail.visible = true;
          this.erc1155Wrapper.visible = true;
          this.lbERC1155Index.caption = `${this.productId}`;
          this.lbContract.caption = FormatUtils.truncateWalletAddress(this.contractAddress || this.nftAddress);
          this.lbToken.caption = token.address ? FormatUtils.truncateWalletAddress(token.address) : token.symbol;
          this.lbOwn.caption = formatNumber(nftBalance, 0);
          this.pnlMintFee.visible = true;
          this.lblMintFee.caption = `${price ? formatNumber(price) : ""} ${token?.symbol || ""}`;
          this.lblTitle.caption = this._data.title;
          this.lblRef.caption = 'smart contract:';
          this.updateSpotsRemaining();
          this.tokenInput.inputReadOnly = true;
          this.pnlQty.visible = false;
          //this.pnlQty.visible = true;
          this.pnlTokenInput.visible = false;
          if (this._data.requiredQuantity != null) {
            let qty = Number(this._data.requiredQuantity);
            if (nftBalance) {
              this.edtQty.value = Math.max(qty - Number(nftBalance), 0);
            } else {
              this.edtQty.value = qty;
            }
          } else {
            this.edtQty.value = '1';
          }
          this.onQtyChanged();
        } else {
          this.detailWrapper.visible = false;
          this.btnDetail.visible = false;
          this.pnlMintFee.visible = false;
          this.lblTitle.caption = this._data.title || 'Make a Contributon';
          this.lblTitle.visible = true;
          this.lblRef.caption = 'All proceeds will go to following vetted wallet address:';
          this.tokenInput.inputReadOnly = false;
          this.pnlQty.visible = false;
          this.pnlTokenInput.visible = true;
          this.edtQty.value = "";
          this.lbOrderTotal.caption = "0";
        }
        this.tokenInput.value = "";
        this.pnlAddress.visible = this._type !== ProductType.Buy;
        (!this.lblAddress.isConnected) && await this.lblAddress.ready();
        this.lblAddress.caption = this.contractAddress || this.nftAddress;
        this.tokenInput.token = token?.address === nullAddress ? {
          ...token,
          isNative: true,
          address: undefined
        } : token;
        this.updateTokenBalance();
      }
      else {
        this.pnlInputFields.visible = false;
        this.pnlUnsupportedNetwork.visible = true;
      }
      this.determineBtnSubmitCaption();
    });
  }

  private updateSpotsRemaining() {
    if (this.productId >= 0) {
      this.lblSpotsRemaining.caption = `${formatNumber(this.productInfo.quantity, 0)}`;
    } else {
      this.lblSpotsRemaining.caption = '';
    }
  }

  private onToggleDetail() {
    const isExpanding = this.detailWrapper.visible;
    this.detailWrapper.visible = !isExpanding;
    this.btnDetail.caption = `${isExpanding ? 'More' : 'Hide'} Information`;
    this.btnDetail.rightIcon.name = isExpanding ? 'caret-down' : 'caret-up';
  }

  private onViewContract() {
    this.state.viewExplorerByAddress(this.chainId, this.nftType === 'ERC721' ? this.nftAddress : (this.contractAddress || this.nftAddress))
  }

  private onViewToken() {
    const token = this.nftType === 'ERC721' ? this.oswapTrollInfo.token : this.productInfo.token;
    this.state.viewExplorerByAddress(this.chainId, token.address || token.symbol);
  }

  private onCopyContract() {
    application.copyToClipboard(this.nftType === 'ERC721' ? this.nftAddress : (this.contractAddress || this.nftAddress));
  }

  private onCopyToken() {
    const token = this.nftType === 'ERC721' ? this.oswapTrollInfo.token : this.productInfo.token;
    application.copyToClipboard(token.address || token.symbol);
  }

  private showTxStatusModal(status: 'warning' | 'success' | 'error', content?: string | Error, exMessage?: string) {
    if (!this.txStatusModal) return;
    let params: any = { status };
    if (status === 'success') {
      params.txtHash = content;
    } else {
      params.content = content;
    }
    if (exMessage) {
      params.exMessage = exMessage;
    }
    this.txStatusModal.message = { ...params };
    this.txStatusModal.showModal();
  }

  private async initApprovalAction() {
    if (!this.approvalModelAction) {
      //this.contractAddress = this.nftType === 'ERC721' ? this.nftAddress : this.state.getContractAddress('Proxy');
      this.contractAddress = this.nftAddress;
      this.approvalModelAction = await this.state.setApprovalModelAction({
        sender: this,
        payAction: async () => {
          await this.doSubmitAction();
        },
        onToBeApproved: async (token: ITokenObject) => {
          this.btnApprove.visible = isClientWalletConnected() && this.state.isRpcWalletConnected();
          this.btnSubmit.visible = !this.btnApprove.visible;
          this.btnSubmit.enabled = false;
          if (!this.isApproving) {
            this.btnApprove.rightIcon.visible = false;
            this.btnApprove.caption = 'Approve';
          }
          this.btnApprove.enabled = true;
          this.isApproving = false;
        },
        onToBePaid: async (token: ITokenObject) => {
          this.btnApprove.visible = false;
          this.btnSubmit.visible = true;
          this.isApproving = false;
          this.btnSubmit.enabled = new BigNumber(this.tokenAmountIn).gt(0);
          this.determineBtnSubmitCaption();
        },
        onApproving: async (token: ITokenObject, receipt?: string) => {
          this.isApproving = true;
          this.btnApprove.rightIcon.spin = true;
          this.btnApprove.rightIcon.visible = true;
          this.btnApprove.caption = `Approving ${token?.symbol || ''}`;
          this.btnSubmit.visible = false;
          if (receipt) {
            this.showTxStatusModal('success', receipt);
          }
        },
        onApproved: async (token: ITokenObject) => {
          this.btnApprove.rightIcon.visible = false;
          this.btnApprove.caption = 'Approve';
          this.isApproving = false;
          this.btnSubmit.visible = true;
          this.btnSubmit.enabled = true;
        },
        onApprovingError: async (token: ITokenObject, err: Error) => {
          this.showTxStatusModal('error', err);
          this.btnApprove.caption = 'Approve';
          this.btnApprove.rightIcon.visible = false;
          this.isApproving = false;
          // this.isCancelCreate = true;
        },
        onPaying: async (receipt?: string) => {
          if (receipt) {
            this.showTxStatusModal('success', receipt);
            this.btnSubmit.enabled = false;
            this.btnSubmit.rightIcon.visible = true;
          }
        },
        onPaid: async (receipt?: any) => {
          this.btnSubmit.rightIcon.visible = false;
          if (this.txStatusModal) this.txStatusModal.closeModal();
        },
        onPayingError: async (err: Error) => {
          this.showTxStatusModal('error', err);
        }
      });
      this.state.approvalModel.spenderAddress = this.contractAddress;
    }
  }

  private updateContractAddress() {
    if (this.approvalModelAction) {
      //if (this.nftType === 'ERC721') {
      this.contractAddress = this.nftAddress;
      //}
      //else {//if (!this._data.commissions || this._data.commissions.length == 0 || !this._data.commissions.find(v => v.chainId == this.chainId)) {
      //  this.contractAddress = this.state.getContractAddress('ProductInfo');
      //}
      //else {
      //  this.contractAddress = this.state.getContractAddress('Proxy');
      //}
      this.state.approvalModel.spenderAddress = this.contractAddress;
    }
  }

  private async selectToken(token: ITokenObject) {
    const symbol = token?.symbol || '';
    this.lblBalance.caption = `${formatNumber(await getTokenBalance(this.rpcWallet, token))} ${symbol}`;
  }

  private updateSubmitButton(submitting: boolean) {
    this.btnSubmit.rightIcon.spin = submitting;
    this.btnSubmit.rightIcon.visible = submitting;
  }

  private determineBtnSubmitCaption() {
    if (!isClientWalletConnected()) {
      this.btnSubmit.caption = 'Connect Wallet';
      this.btnSubmit.enabled = true;
    }
    else if (!this.state.isRpcWalletConnected()) {
      this.btnSubmit.caption = 'Switch Network';
      this.btnSubmit.enabled = true;
    }
    else if (this.nftType === 'ERC721') {
      this.btnSubmit.caption = this.cap ? 'Mint' : 'Out of stock';
      this.btnSubmit.enabled = !!this.cap;
    }
    else if (this._type === ProductType.Buy) {
      this.btnSubmit.caption = 'Mint';
    }
    else {
      this.btnSubmit.caption = 'Submit';
    }
  }

  private async onApprove() {
    if (this.nftType === 'ERC721') {
      const { price, token } = this.oswapTrollInfo;
      const contractAddress = this.state.getExplorerByAddress(this.chainId, this.nftAddress);
      const tokenAddress = this.state.getExplorerByAddress(this.chainId, token.address);
      this.showTxStatusModal('warning', 'Confirming', `to contract\n${contractAddress}\nwith token\n${tokenAddress}`);
      await this.approvalModelAction.doApproveAction(token, price.toFixed());
    } else {
      this.showTxStatusModal('warning', `Approving`);
      await this.approvalModelAction.doApproveAction(this.productInfo.token, this.tokenAmountIn);
    }
  }

  private async onQtyChanged() {
    const qty = Number(this.edtQty.value);
    if (qty === 0) {
      this.tokenAmountIn = '0';
      this.tokenInput.value = '0';
      this.lbOrderTotal.caption = `0 ${this.productInfo.token?.symbol || ''}`;
    }
    else {
      const price = Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals);
      this.tokenAmountIn = getProxyTokenAmountIn(price.toFixed(), qty, this._data.commissions);
      const amount = price.times(qty);
      this.tokenInput.value = amount.toFixed();
      const commissionFee = this.state.embedderCommissionFee;
      const total = amount.plus(amount.times(commissionFee));
      this.lbOrderTotal.caption = `${formatNumber(total)} ${this.productInfo.token?.symbol || ''}`;
    }
    if (this.productInfo && this.state.isRpcWalletConnected()) {
      if (this.productInfo.token?.address !== nullAddress) {
        this.approvalModelAction.checkAllowance(this.productInfo.token, this.tokenAmountIn);
      } else {
        this.btnSubmit.enabled = new BigNumber(this.tokenAmountIn).gt(0);
        this.determineBtnSubmitCaption();
      }
    } else {
      this.determineBtnSubmitCaption();
    }
  }

  private async onAmountChanged() {
    let amount = Number(this.tokenInput.value);
    if (amount === 0 || !this.productInfo) {
      this.tokenAmountIn = '0';
      this.tokenInput.value = '0';
    }
    else {
      const price = Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals);
      this.tokenAmountIn = getProxyTokenAmountIn(price.toFixed(), amount, this._data.commissions);
    }
    amount = Number(this.tokenInput.value);
    const commissionFee = this.state.embedderCommissionFee;
    const total = new BigNumber(amount).plus(new BigNumber(amount).times(commissionFee));
    const token = this.productInfo?.token
    this.lbOrderTotal.caption = `${formatNumber(total)} ${token?.symbol || ''}`;
    if (token && this.state.isRpcWalletConnected() && token?.address !== nullAddress) {
      if (token?.address !== nullAddress) {
        this.approvalModelAction.checkAllowance(token, this.tokenAmountIn);
      } else {
        this.btnSubmit.enabled = new BigNumber(this.tokenAmountIn).gt(0);
        this.determineBtnSubmitCaption();
      }
    } else {
      this.determineBtnSubmitCaption();
    }
  }

  private async doSubmitAction() {
    if (!this._data || (!this.productId && this.nftType !== 'ERC721')) return;
    this.updateSubmitButton(true);
    if ((this._type === ProductType.DonateToOwner || this._type === ProductType.DonateToEveryone) && !this.tokenInput.token) {
      this.showTxStatusModal('error', 'Token Required');
      this.updateSubmitButton(false);
      return;
    }
    // if (this._type === ProductType.Buy && chainId !== this._data.chainId) {
    //   this.showTxStatusModal('error', 'Unsupported Network');
    //   this.updateSubmitButton(false);
    //   return;
    // }
    if (this.nftType === 'ERC721') {
      const oswapTroll = await fetchOswapTrollNftInfo(this.state, this.nftAddress);
      if (!oswapTroll || oswapTroll.cap.lte(0)) {
        this.showTxStatusModal('error', 'Out of stock');
        this.updateSubmitButton(false);
        return;
      }
      const token = this.oswapTrollInfo.token;
      const balance = await getTokenBalance(this.rpcWallet, token);
      if (oswapTroll.price.gt(balance)) {
        this.showTxStatusModal('error', `Insufficient ${token.symbol} Balance`);
        this.updateSubmitButton(false);
        return;
      }
      await this.mintNft();
      return;
    }
    const token = this.productInfo.token
    const balance = await getTokenBalance(this.rpcWallet, token);
    if (this._type === ProductType.Buy) {
      if (this.edtQty.value && new BigNumber(this.edtQty.value).gt(this.productInfo.maxQuantity)) {
        this.showTxStatusModal('error', 'Quantity Greater Than Max Quantity');
        this.updateSubmitButton(false);
        return;
      }
      if (this.productInfo.maxQuantity.gt(1) && (!this.edtQty.value || !Number.isInteger(Number(this.edtQty.value)))) {
        this.showTxStatusModal('error', 'Invalid Quantity');
        this.updateSubmitButton(false);
        return;
      }
      const requireQty = this.productInfo.maxQuantity.gt(1) && this.edtQty.value ? Number(this.edtQty.value) : 1;
      if (this.productId >= 0) {
        const product = await getProductInfo(this.state, this.productId);
        if (product.quantity.lt(requireQty)) {
          this.showTxStatusModal('error', 'Out of stock');
          this.updateSubmitButton(false);
          return;
        }
      }
      const maxOrderQty = new BigNumber(this.productInfo.maxQuantity ?? 0);
      if (maxOrderQty.minus(requireQty).lt(0)) {
        this.showTxStatusModal('error', 'Over Maximum Order Quantity');
        this.updateSubmitButton(false);
        return;
      }

      const amount = this.productInfo.price.times(requireQty).shiftedBy(-token.decimals);
      if (balance.lt(amount)) {
        this.showTxStatusModal('error', `Insufficient ${this.tokenInput.token.symbol} Balance`);
        this.updateSubmitButton(false);
        return;
      }
      await this.buyToken(requireQty);
    } else {
      if (!this.tokenInput.value) {
        this.showTxStatusModal('error', 'Amount Required');
        this.updateSubmitButton(false);
        return;
      }
      if (balance.lt(this.tokenInput.value)) {
        this.showTxStatusModal('error', `Insufficient ${this.tokenInput.token.symbol} Balance`);
        this.updateSubmitButton(false);
        return;
      }
      await this.buyToken(1);
    }
    this.updateSubmitButton(false);
    if (this.txStatusModal) this.txStatusModal.closeModal();
  }

  private async onSubmit() {
    if (!isClientWalletConnected()) {
      if (this.mdWallet) {
        await application.loadPackage('@scom/scom-wallet-modal', '*');
        this.mdWallet.networks = this.networks;
        this.mdWallet.wallets = this.wallets;
        this.mdWallet.showModal();
      }
      return;
    }
    if (!this.state.isRpcWalletConnected()) {
      const clientWallet = Wallet.getClientInstance();
      await clientWallet.switchNetwork(this.chainId);
      return;
    }
    if (this.nftType === 'ERC721') {
      const contractAddress = this.state.getExplorerByAddress(this.chainId, this.nftAddress);
      const tokenAddress = this.state.getExplorerByAddress(this.chainId, this.oswapTrollInfo.token.address);
      this.showTxStatusModal('warning', 'Confirming', `to contract\n${contractAddress}\nwith token\n${tokenAddress}`);
    } else {
      this.showTxStatusModal('warning', 'Confirming');
    }
    this.approvalModelAction.doPayAction();
  }

  private async mintNft() {
    const txHashCallback = (err: Error, receipt?: string) => {
      if (err) {
        this.showTxStatusModal('error', err);
        this.updateSubmitButton(false);
      }
    }
    const confirmationCallback = async (receipt: any) => {
      const oswapTroll = await fetchOswapTrollNftInfo(this.state, this.nftAddress);
      if (oswapTroll) {
        this.lblSpotsRemaining.caption = formatNumber(oswapTroll.cap, 0);
        this.cap = oswapTroll.cap.toNumber();
      }
      const nftBalance = await fetchUserNftBalance(this.state, this.nftAddress);
      this.lbOwn.caption = formatNumber(nftBalance || 0, 0);
      this.updateSubmitButton(false);
      if (this.onMintedNFT) this.onMintedNFT();
    }
    registerSendTxEvents({
      transactionHash: txHashCallback,
      confirmation: confirmationCallback
    });

    await mintOswapTrollNft(this.nftAddress, txHashCallback);
  }

  private async buyToken(quantity: number) {
    if (this.productId === undefined || this.productId === null) return;
    const callback = (error: Error, receipt?: string) => {
      if (error) {
        this.showTxStatusModal('error', error);
      }
    };
    const token = this.productInfo.token;
    if (this.productType == ProductType.DonateToOwner || this.productType == ProductType.DonateToEveryone) {
      await donate(this.state, this.productId, this.donateTo, this.tokenInput.value, this._data.commissions, token, callback,
        async () => {
          await this.updateTokenBalance();
        }
      );
    }
    else if (this.productType == ProductType.Buy) {
      await buyProduct(this.state, this.productId, quantity, this._data.commissions, token, callback,
        async () => {
          await this.updateTokenBalance();
          this.productInfo = await getProductInfo(this.state, this.productId);
          const nftBalance = await getNFTBalance(this.state, this.productId);
          this.lbOwn.caption = nftBalance;
          this.updateSpotsRemaining();
          if (this.onMintedNFT) this.onMintedNFT();
        }
      );
    }
  }

  async init() {
    super.init();
    this.onMintedNFT = this.getAttribute('onMintedNFT', true) || this.onMintedNFT;
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      const link = this.getAttribute('link', true);
      const nftType = this.getAttribute('nftType', true);
      const chainId = this.getAttribute('chainId', true);
      const nftAddress = this.getAttribute('nftAddress', true);
      const erc1155Index = this.getAttribute('erc1155Index', true);
      const productType = this.getAttribute('productType', true);
      const name = this.getAttribute('name', true);
      const title = this.getAttribute('title', true);
      const description = this.getAttribute('description', true);
      const logoUrl = this.getAttribute('logoUrl', true);
      const chainSpecificProperties = this.getAttribute('chainSpecificProperties', true);
      const networks = this.getAttribute('networks', true);
      const wallets = this.getAttribute('wallets', true);
      const showHeader = this.getAttribute('showHeader', true);
      const defaultChainId = this.getAttribute('defaultChainId', true);
      const requiredQuantity = this.getAttribute('requiredQuantity', true);
      const tokenToMint = this.getAttribute('tokenToMint', true);
      const isCustomMintToken = this.getAttribute('isCustomMintToken', true);
      const customMintToken = this.getAttribute('customMintToken', true);
      const priceToMint = this.getAttribute('priceToMint', true);
      const maxQty = this.getAttribute('maxQty', true);
      const txnMaxQty = this.getAttribute('txnMaxQty', true);
      await this.setData({
        nftType,
        chainId,
        nftAddress,
        erc1155Index,
        link,
        productType,
        name,
        title,
        chainSpecificProperties,
        defaultChainId,
        requiredQuantity,
        tokenToMint,
        isCustomMintToken,
        customMintToken,
        priceToMint,
        maxQty,
        txnMaxQty,
        description,
        logoUrl,
        networks,
        wallets,
        showHeader
      });
    }
    this.executeReadyCallback();
  }

  render() {
    return (
      <i-panel>
        <i-scom-dapp-container id="containerDapp">
          <i-panel background={{ color: Theme.background.main }}>
            <i-grid-layout
              width='100%'
              height='100%'
              templateColumns={['1fr']}
            >
              <i-stack direction='vertical' padding={{ top: '1.5rem', bottom: '1.25rem', left: '1.25rem', right: '1.5rem' }} alignItems="center">
                <i-stack direction='vertical' width="100%" maxWidth={600} gap='0.5rem'>
                  <i-vstack class="text-center" gap="0.5rem">
                    <i-image id='imgLogo' height={100} border={{ radius: 4 }}></i-image>
                    <i-label id='lblTitle' font={{ bold: true, size: '1.5rem' }}></i-label>
                    <i-markdown
                      id='markdownViewer'
                      class={markdownStyle}
                      width='100%'
                      height='100%'
                      margin={{ bottom: '0.563rem' }}
                    ></i-markdown>
                  </i-vstack>
                  <i-vstack gap="0.5rem" id="pnlInputFields">
                    <i-hstack id="detailWrapper" horizontalAlignment="space-between" gap={10} visible={false} wrap="wrap">
                      <i-hstack id="erc1155Wrapper" width="100%" justifyContent="space-between" visible={false} gap="0.5rem" lineHeight={1.5}>
                        <i-label caption="ERC1155 Index" font={{ bold: true, size: '1rem' }} />
                        <i-label id="lbERC1155Index" font={{ size: '1rem' }} />
                      </i-hstack>
                      <i-hstack width="100%" justifyContent="space-between" gap="0.5rem" lineHeight={1.5}>
                        <i-label caption="Contract Address" font={{ bold: true, size: '1rem' }} />
                        <i-hstack gap="0.25rem" verticalAlignment="center" maxWidth="calc(100% - 75px)">
                          <i-label id="lbContract" font={{ size: '1rem', color: Theme.colors.primary.main }} textDecoration="underline" class={linkStyle} onClick={this.onViewContract} />
                          <i-icon fill={Theme.text.primary} name="copy" width={16} height={16} onClick={this.onCopyContract} cursor="pointer" />
                        </i-hstack>
                      </i-hstack>
                      <i-hstack width="100%" justifyContent="space-between" gap="0.5rem" lineHeight={1.5}>
                        <i-label caption="Token Address" font={{ bold: true, size: '1rem' }} />
                        <i-hstack gap="0.25rem" verticalAlignment="center" maxWidth="calc(100% - 75px)">
                          <i-label id="lbToken" font={{ size: '1rem', color: Theme.colors.primary.main }} textDecoration="underline" class={linkStyle} onClick={this.onViewToken} />
                          <i-icon fill={Theme.text.primary} name="copy" width={16} height={16} onClick={this.onCopyToken} cursor="pointer" />
                        </i-hstack>
                      </i-hstack>
                      <i-hstack width="100%" justifyContent="space-between" gap="0.5rem" lineHeight={1.5}>
                        <i-label caption="Remaining" font={{ bold: true, size: '1rem' }} />
                        <i-label id="lblSpotsRemaining" font={{ size: '1rem' }} />
                      </i-hstack>
                      <i-hstack id='pnlMintFee' width="100%" justifyContent="space-between" visible={false} gap='0.5rem' lineHeight={1.5}>
                        <i-label caption='Price' font={{ bold: true, size: '1rem' }}></i-label>
                        <i-label id='lblMintFee' font={{ size: '1rem' }}></i-label>
                      </i-hstack>
                      <i-hstack width="100%" justifyContent="space-between" gap="0.5rem" lineHeight={1.5}>
                        <i-label caption="You own" font={{ bold: true, size: '1rem' }} />
                        <i-label id="lbOwn" font={{ size: '1rem' }} />
                      </i-hstack>
                    </i-hstack>
                    <i-button
                      id="btnDetail"
                      caption="More Information"
                      rightIcon={{ width: 10, height: 16, margin: { left: 5 }, fill: Theme.text.primary, name: 'caret-down' }}
                      background={{ color: 'transparent' }}
                      border={{ width: 1, style: 'solid', color: Theme.text.primary, radius: 8 }}
                      width={300}
                      maxWidth="100%"
                      height={36}
                      margin={{ top: 4, bottom: 16, left: 'auto', right: 'auto' }}
                      onClick={this.onToggleDetail}
                      visible={false}
                    />
                    <i-hstack id='pnlQty'
                      width="100%"
                      justifyContent="space-between"
                      alignItems='center'
                      gap="0.5rem"
                      lineHeight={1.5}
                      visible={false}
                    >
                      <i-label caption='Quantity' font={{ bold: true, size: '1rem' }}></i-label>
                      <i-panel width="50%">
                        <i-input
                          id='edtQty'
                          height={35}
                          width="100%"
                          onChanged={this.onQtyChanged.bind(this)}
                          class={inputStyle}
                          inputType='number'
                          font={{ size: '1rem' }}
                          border={{ radius: 4, style: 'none' }}
                          padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }}
                        >
                        </i-input>
                      </i-panel>
                    </i-hstack>
                    <i-hstack
                      width="100%"
                      justifyContent="space-between"
                      alignItems='center'
                      gap="0.5rem"
                      lineHeight={1.5}
                    >
                      <i-hstack verticalAlignment='center' gap="0.5rem">
                        <i-label id="lbOrderTotalTitle" caption='Total' font={{ bold: true, size: '1rem' }}></i-label>
                        <i-icon id="iconOrderTotal" name="question-circle" fill={Theme.background.modal} width={20} height={20}></i-icon>
                      </i-hstack>
                      <i-label id='lbOrderTotal' font={{ size: '1rem' }} caption="0"></i-label>
                    </i-hstack>
                    <i-vstack id="pnlTokenInput" gap='0.25rem' margin={{ bottom: '1rem' }} visible={false}>
                      <i-hstack horizontalAlignment='space-between' verticalAlignment='center' gap="0.5rem">
                        <i-label caption="Your donation" font={{ weight: 500, size: '1rem' }}></i-label>
                        <i-hstack horizontalAlignment='end' verticalAlignment='center' gap="0.5rem" opacity={0.6}>
                          <i-label caption='Balance:' font={{ size: '1rem' }}></i-label>
                          <i-label id='lblBalance' font={{ size: '1rem' }} caption="0.00"></i-label>
                        </i-hstack>
                      </i-hstack>
                      <i-stack
                        direction="horizontal"
                        overflow="hidden"
                        background={{ color: Theme.input.background }}
                        font={{ color: Theme.input.fontColor }}
                        height={56} width="50%"
                        margin={{ left: 'auto', right: 'auto' }}
                        alignItems="center"
                        border={{ radius: 16, width: '2px', style: 'solid', color: 'transparent' }}
                      >
                        <i-scom-token-input
                          id="tokenInput"
                          tokenReadOnly={true}
                          isBtnMaxShown={false}
                          isCommonShown={false}
                          isBalanceShown={false}
                          isSortBalanceShown={false}
                          class={tokenSelectionStyle}
                          padding={{ left: '11px' }}
                          font={{ size: '1.25rem' }}
                          width="100%"
                          height="100%"
                          placeholder="0.00"
                          modalStyles={{
                            maxHeight: '50vh'
                          }}
                          onSelectToken={this.selectToken}
                          onInputAmountChanged={this.onAmountChanged}
                        />
                      </i-stack>
                    </i-vstack>
                    <i-vstack
                      horizontalAlignment="center" verticalAlignment='center'
                      gap="8px" width="100%"
                      margin={{ top: '0.5rem' }}
                    >
                      <i-button
                        id="btnApprove"
                        width='100%'
                        caption="Approve"
                        padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                        font={{ size: '1rem', color: Theme.colors.primary.contrastText, bold: true }}
                        rightIcon={{ visible: false, fill: Theme.colors.primary.contrastText }}
                        background={{ color: Theme.background.gradient }}
                        border={{ radius: 12 }}
                        visible={false}
                        onClick={this.onApprove.bind(this)}
                      ></i-button>
                      <i-button
                        id='btnSubmit'
                        width='100%'
                        caption='Submit'
                        padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                        font={{ size: '1rem', color: Theme.colors.primary.contrastText, bold: true }}
                        rightIcon={{ visible: false, fill: Theme.colors.primary.contrastText }}
                        background={{ color: Theme.background.gradient }}
                        border={{ radius: 12 }}
                        onClick={this.onSubmit.bind(this)}
                        enabled={false}
                      ></i-button>
                    </i-vstack>
                    <i-vstack id="pnlAddress" gap='0.25rem' margin={{ top: '1rem' }}>
                      <i-label id='lblRef' font={{ size: '0.875rem' }} opacity={0.5}></i-label>
                      <i-label id='lblAddress' font={{ size: '0.875rem' }} overflowWrap='anywhere'></i-label>
                    </i-vstack>
                  </i-vstack>
                  <i-vstack id='pnlUnsupportedNetwork' visible={false} horizontalAlignment='center'>
                    <i-label caption='This network or this token is not supported.' font={{ size: '1.5rem' }}></i-label>
                  </i-vstack>
                  <i-hstack id='pnlLink' visible={false} verticalAlignment='center' gap='0.25rem'>
                    <i-label caption='Details here: ' font={{ size: '1rem' }}></i-label>
                    <i-label id='lblLink' font={{ size: '1rem' }}></i-label>
                  </i-hstack>
                </i-stack>
              </i-stack>
            </i-grid-layout>
            <i-scom-wallet-modal id="mdWallet" wallets={[]} />
            <i-scom-tx-status-modal id="txStatusModal" />
          </i-panel>
        </i-scom-dapp-container>
      </i-panel>
    )
  }
}