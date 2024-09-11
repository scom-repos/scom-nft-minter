import {
  Module,
  customModule,
  customElements,
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
  Form,
  StackLayout,
  Datepicker,
  moment,
  ComboBox,
  IComboItem
} from '@ijstech/components';
import { BigNumber, Constants, IERC20ApprovalAction, IEventBusRegistry, TransactionReceipt, Utils, Wallet } from '@ijstech/eth-wallet';
import { IChainSpecificProperties, IDiscountRule, IEmbedData, INetworkConfig, IProductInfo, IWalletPlugin, PaymentModel, ProductType } from './interface/index';
import { delay, formatNumber, getProxySelectors, getTokenBalance, registerSendTxEvents, nullAddress, getTokenInfo } from './utils/index';
import { State, isClientWalletConnected } from './store/index';
import { inputStyle, linkStyle, markdownStyle, tokenSelectionStyle } from './index.css';
import { buyProduct, createSubscriptionNFT, donate, fetchOswapTrollNftInfo, fetchUserNftBalance, getDiscountRules, getNFTBalance, getProductId, getProductIdFromEvent, getProductInfo, getProxyTokenAmountIn, mintOswapTrollNft, newDefaultBuyProduct, subscribe, updateCommissionCampaign, updateDiscountRules } from './API';
import configData from './data.json';
import ScomDappContainer from '@scom/scom-dapp-container';
import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
import { ChainNativeTokenByChainId, ITokenObject, tokenStore } from '@scom/scom-token-list';
import ScomTxStatusModal from '@scom/scom-tx-status-modal';
import ScomTokenInput, { CUSTOM_TOKEN } from '@scom/scom-token-input';
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
  productType?: 'Buy' | 'Subscription' | 'DonateToOwner' | 'DonateToEveryone';
  //ERC1155NewIndex
  tokenToMint?: string;
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
  onMintedNFT?: () => void;
}

export interface IBuilderConfigurator {
  name: string;
  target: string;
  getActions: (category?: string) => any[];
  getData: () => IEmbedData;
  setData: (data: IEmbedData) => Promise<void>;
  setupData?: (data: IEmbedData) => Promise<boolean>;
  getTag: () => any;
  setTag: (value: any) => void;
  updateDiscountRules?: (productId: number, rules: IDiscountRule[], ruleIdsToDelete: number[]) => Promise<IDiscountRule[]>;
  updateCommissionCampaign?: (productId: number, commissionRate: string, affiliates: string[]) => Promise<boolean>;
}

const Theme = Styles.Theme.ThemeVars;

const DurationUnits = [
  {
    label: 'Day(s)',
    value: 'days'
  },
  {
    label: 'Month(s)',
    value: 'months'
  },
  {
    label: 'Year(s)',
    value: 'years'
  }
]

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
  private iconCopyToken: Icon;
  private lbOwn: Label;
  private lbERC1155Index: Label;
  private pnlTokenInput: VStack;
  private pnlQty: HStack;
  private edtQty: Input;
  private pnlSubscriptionPeriod: StackLayout;
  private edtRecipient: Input;
  private edtStartDate: Datepicker;
  private edtDuration: Input;
  private comboDurationUnit: ComboBox;
  private lblEndDate: Label;
  private lblBalance: Label;
  private btnSubmit: Button;
  private btnApprove: Button;
  private pnlAddress: VStack;
  private lblRef: Label;
  private lblAddress: Label;
  private tokenInput: ScomTokenInput;
  private txStatusModal: ScomTxStatusModal;
  private pnlDiscount: StackLayout;
  private lblDiscount: Label;
  private lblDiscountAmount: Label;
  private lbOrderTotal: Label;
  private lbOrderTotalTitle: Label;
  private iconOrderTotal: Icon;
  private pnlInputFields: VStack;
  private pnlUnsupportedNetwork: VStack;
  private imgUri: Image;
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
  private isConfigNewIndex: boolean;
  private isOnChangeUpdated: boolean;
  private discountRules: IDiscountRule[];
  private discountApplied: IDiscountRule;
  private isRenewal = false;
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

  get recipient() {
    return this._data.recipient ?? this._data.chainSpecificProperties?.[this.chainId]?.recipient ?? '';
  }

  get link() {
    return this._data.link ?? '';
  }

  set link(value: string) {
    this._data.link = value;
  }

  get productId() {
    return this._data.productId ?? this._data.chainSpecificProperties?.[this.chainId]?.productId ?? 0;
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

  private getProductTypeByCode(code: number) {
    let productType: ProductType;
    switch (code) {
      case 0:
        productType = ProductType.Buy;
        break;
      case 1:
        productType = ProductType.Subscription;
        break;
      case 2:
        productType = ProductType.DonateToOwner;
        break;
      case 3:
        productType = ProductType.DonateToEveryone;
        break;
    }
    return productType;
  }

  private onChainChanged = async () => {
    this.tokenInput.chainId = this.state.getChainId();
    await this.onSetupPage();
    this.updateContractAddress();
    await this.refreshDApp();
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
                erc1155Index,
                nftType,
                chainId,
                nftAddress,
                chainSpecificProperties,
                defaultChainId,
                tokenToMint,
                customMintToken,
                priceToMint,
                maxQty,
                txnMaxQty,
                uri,
                ...themeSettings
              } = userInputData;

              const generalSettings = {
                name,
                title,
                productType,
                logoUrl,
                description,
                link,
                erc1155Index,
                nftType,
                chainId,
                nftAddress,
                chainSpecificProperties,
                defaultChainId,
                tokenToMint,
                customMintToken,
                priceToMint,
                maxQty,
                txnMaxQty,
                uri
              };

              Object.assign(this._data, generalSettings);
              await this.resetRpcWallet();
              if (builder?.setData) builder.setData(this._data);
              await this.refreshDApp(true);

              oldTag = JSON.parse(JSON.stringify(this.tag));
              if (builder?.setTag) builder.setTag(themeSettings);
              else this.setTag(themeSettings);
              if (this.containerDapp) this.containerDapp.setTag(themeSettings);
            },
            undo: async () => {
              this._data = JSON.parse(JSON.stringify(oldData));
              await this.refreshDApp(true);
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

  private getProjectOwnerActions(isDefault1155New: boolean, readonly?: boolean, isPocily?: boolean) {
    //const isDonation = this._data.productType === ProductType.DonateToOwner || this._data.productType === ProductType.DonateToEveryone;
    const formSchema = getProjectOwnerSchema(isDefault1155New, readonly, isPocily, this.state, {
      refreshUI: this.refreshDApp,
      connectWallet: this.connectWallet,
      showTxStatusModal: this.showTxStatusModal
    });
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

  getConfigurators(type?: 'new1155' | 'customNft', readonly?: boolean, isPocily?: boolean) {
    let isNew1155 = (type && type === 'new1155');
    const { defaultBuilderData, defaultExistingNft, defaultCreate1155Index } = configData;
    const defaultData = isNew1155 ? defaultCreate1155Index : defaultExistingNft as IEmbedData;
    this.isConfigNewIndex = isNew1155;
    this.isOnChangeUpdated = false;

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
          return this.getProjectOwnerActions(isNew1155, readonly, isPocily);
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
          await this.setData({ ...defaultBuilderData, ...defaultData, ...data });
        },
        setupData: async (data: IEmbedData) => {
          this._data = { ...defaultBuilderData, ...data };
          if (!this.nftType) {
            if (isPocily) {
              this._data.maxQty = new BigNumber(10).pow(12).toNumber();
            }
            if (new BigNumber(this.newMaxQty).lte(0)) {
              return false;
            }
            const maxQty = this.newMaxQty;
            this._data.erc1155Index = undefined;
            await this.resetRpcWallet();
            await this.initWallet();
            return await this.newProduct(maxQty);
          } else {
            await this.resetRpcWallet();
            await this.initWallet();
            if (!isClientWalletConnected()) {
              this.connectWallet();
              return;
            }
            if (!this.state.isRpcWalletConnected()) {
              const clientWallet = Wallet.getClientInstance();
              await clientWallet.switchNetwork(this.chainId);
              return;
            }
            if (this.nftType === 'ERC721' && this._data.erc1155Index != null) this._data.erc1155Index = undefined;
            let productId = await getProductId(this.state, this.nftAddress, this._data.erc1155Index);
            if (productId) {
              this._data.productId = productId;
              this.productInfo = await getProductInfo(this.state, this.productId);
              this._data.productType = this.getProductTypeByCode(this.productInfo.productType.toNumber());
              this._data.priceToMint = Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals).toNumber();
              this._data.tokenToMint = this.productInfo.token.address;
              if (this._data.productType === ProductType.Subscription) {
                this._data.durationInDays = Math.ceil((this.productInfo.priceDuration?.toNumber() || 0) / 86400);
              }
            }
          }
          return true;
        },
        updateDiscountRules: async (productId: number, rules: IDiscountRule[], ruleIdsToDelete: number[] = []) => {
          return new Promise(async (resolve, reject) => {
            const callback = (err: Error, receipt?: string) => {
              if (err) {
                this.showTxStatusModal('error', err);
              }
            };
            const confirmationCallback = async (receipt: any) => {
              const discountRules = await getDiscountRules(this.state, productId);
              resolve(discountRules);
            };
            try {
              await updateDiscountRules(this.state, productId, rules, ruleIdsToDelete, callback, confirmationCallback);
            } catch (error) {
              this.showTxStatusModal('error', 'Something went wrong updating discount rule!');
              console.log('updateDiscountRules', error);
              reject(error);
            }
          });
        },
        updateCommissionCampaign: async (productId: number, commissionRate: string, affiliates: string[]) => {
          return new Promise(async (resolve, reject) => {
            const callback = (err: Error, receipt?: string) => {
              if (err) {
                this.showTxStatusModal('error', err);
              }
            };
            const confirmationCallback = async (receipt: any) => {
              resolve(true);
            };
            try {
              await updateCommissionCampaign(this.state, productId, commissionRate, affiliates, callback, confirmationCallback);
            } catch (error) {
              this.showTxStatusModal('error', 'Something went wrong updating commission campaign!');
              console.log('updateCommissionCampaign', error);
              reject(error);
            }
          });
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
          const actions = this.getProjectOwnerActions(isNew1155, readonly, isPocily);
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
    await this.updateFormConfig();
    const chainChangedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.ChainChanged, async (chainId: number) => {
      await this.onChainChanged();
    });
    const connectedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.Connected, async (connected: boolean) => {
      await this.updateFormConfig(true);
      await this.onSetupPage();
      this.updateContractAddress();
      await this.refreshDApp();
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
    if (this.containerDapp?.setData) await this.containerDapp.setData(data);
  }

  private async setData(data: IEmbedData) {
    this._data = data;
    this.discountRules = [];
    await this.resetRpcWallet();
    if (!this.tokenInput.isConnected) await this.tokenInput.ready();
    this.tokenInput.chainId = this.state.getChainId() ?? this.defaultChainId;
    await this.onSetupPage();
    const commissionFee = this.state.embedderCommissionFee;
    if (!this.lbOrderTotalTitle.isConnected) await this.lbOrderTotalTitle.ready();
    this.lbOrderTotalTitle.caption = `You are going to pay`;
    this.iconOrderTotal.tooltip.content = `A commission fee of ${new BigNumber(commissionFee).times(100)}% will be applied to the amount you input.`;
    this.updateContractAddress();
    if (this.nftType === 'ERC721' && this._data.erc1155Index != null) this._data.erc1155Index = undefined;
    if (!this.productId && this.nftAddress && (this.nftType === 'ERC721' || this._data.erc1155Index)) {
      await this.initWallet();
      let productId = await getProductId(this.state, this.nftAddress, this._data.erc1155Index);
      if (productId) this._data.productId = productId;
    }
    this.edtRecipient.value = this._data.recipient;
    this.edtStartDate.value = undefined;
    this.edtDuration.value = '';
    this.comboDurationUnit.selectedItem = DurationUnits[0];
    await this.refreshDApp(true);
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

  private async updateFormConfig(isEvent?: boolean) {
    if (this.isConfigNewIndex) {
      try {
        const wrapper = this.parentElement?.parentElement;
        if (!wrapper) return;
        const form = (wrapper.querySelector('i-form') || wrapper.parentElement?.querySelector('i-form')) as Form;
        if (!form) return;
        const btnConfirm = form.lastElementChild?.lastElementChild as Button;
        if (btnConfirm) {
          const updateButton = async () => {
            const data = await form.getFormData();
            const validation = form.validate(data, form.jsonSchema, { changing: false });
            btnConfirm.caption = !isClientWalletConnected() && validation.valid ? 'Connect Wallet' : 'Confirm';
          }
          if (isEvent) {
            await updateButton();
          } else if (!this.isOnChangeUpdated) {
            this.isOnChangeUpdated = true;
            const onFormChange = form.formOptions.onChange;
            form.formOptions.onChange = async () => {
              if (onFormChange) onFormChange();
              await updateButton();
            }
            await updateButton();
          }
        }
      } catch { }
    }
  }

  private async _createProduct(
    productMarketplaceAddress: string,
    quantity: number,
    price: string,
    uri: string,
    token?: ITokenObject,
    callback?: any,
    confirmationCallback?: any
  ) {
    if (this._data.paymentModel === PaymentModel.Subscription) {
      await createSubscriptionNFT(
        productMarketplaceAddress,
        quantity,
        price,
        token?.address || nullAddress,
        token?.decimals || 18,
        uri,
        1 * 86400, // per day
        callback,
        confirmationCallback
      );
    } else {
      await newDefaultBuyProduct(
        productMarketplaceAddress,
        quantity,
        price,
        token?.address || nullAddress,
        token?.decimals || 18,
        uri,
        callback,
        confirmationCallback
      );
    }
  }

  private newProduct = async (maxQty: number) => {
    return new Promise<boolean>(async (resolve, reject) => {
      let contract = this.state.getContractAddress('ProductMarketplace');
      // const txnMaxQty = this.newTxnMaxQty;
      const price = new BigNumber(this.newPrice).toFixed();
      if ((!this.nftType) && new BigNumber(maxQty).gt(0)) {
        if (this._data.erc1155Index >= 0) {
          this._data.nftType = 'ERC1155';
          return resolve(true);
        };
        const callback = (err: Error, receipt?: string) => {
          if (err) {
            this.showTxStatusModal('error', err);
          }
        }
        const confirmationCallback = async (receipt: any) => {
          let productId: number = getProductIdFromEvent(contract, receipt);
          this._data.productId = productId;
          this._data.nftType = this._data.paymentModel === PaymentModel.Subscription ? 'ERC721' : 'ERC1155';
          this.productInfo = await getProductInfo(this.state, this.productId);
          if (this._data.nftType === 'ERC1155') {
            this._data.erc1155Index = this.productInfo.nftId.toNumber();
          }
          this._data.nftAddress = this.productInfo.nft;
          this._data.productType = this.getProductTypeByCode(this.productInfo.productType.toNumber());
          this._data.priceToMint = Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals).toNumber();
          this._data.tokenToMint = this.productInfo.token.address;
          this._data.durationInDays = Math.ceil((this.productInfo.priceDuration?.toNumber() || 0) / 86400);
          return resolve(true);
        }
        if (!isClientWalletConnected()) {
          this.connectWallet();
          return resolve(false);
        }
        if (!this.state.isRpcWalletConnected()) {
          const clientWallet = Wallet.getClientInstance();
          let isConnected = false;
          try {
            isConnected = await clientWallet.switchNetwork(this.chainId);
          } catch {
            return resolve(false);
          }
          if (!isConnected) return resolve(false);
          await delay(3000);
          contract = this.state.getContractAddress('ProductMarketplace');
        }
        if (!contract) {
          this.showTxStatusModal('error', 'This network is not supported!');
          return resolve(false);
        }
        try {
          const { tokenToMint, customMintToken, uri } = this._data;
          const isCustomToken = tokenToMint?.toLowerCase() === CUSTOM_TOKEN.address.toLowerCase();
          if (!tokenToMint || (isCustomToken && !customMintToken)) {
            this.showTxStatusModal('error', 'TokenToMint is missing!');
            return resolve(false);
          }
          const tokenAddress = isCustomToken ? customMintToken : tokenToMint;
          if (tokenAddress === nullAddress || !tokenAddress.startsWith('0x')) {
            const address = tokenAddress.toLowerCase();
            const nativeToken = ChainNativeTokenByChainId[this.chainId];
            if (!address.startsWith('0x') && address !== nativeToken?.symbol.toLowerCase() && address !== 'native token') {
              this.showTxStatusModal('error', 'Invalid token!');
              return resolve(false);
            }
            //pay native token
            await this._createProduct(
              contract,
              maxQty,
              price,
              uri,
              null,
              callback,
              confirmationCallback
            );
          } else { //pay erc20
            let token: ITokenObject;
            if (isCustomToken) {
              token = await getTokenInfo(tokenAddress, this.chainId);
            } else {
              token = tokenStore.getTokenList(this.chainId).find(v => v.address?.toLowerCase() === tokenAddress.toLowerCase());
            }
            if (!token) {
              this.showTxStatusModal('error', 'Invalid token!');
              return resolve(false);
            }
            await this._createProduct(
              contract,
              maxQty,
              price,
              uri,
              token,
              callback,
              confirmationCallback
            );
          }
        } catch (error) {
          this.showTxStatusModal('error', 'Something went wrong creating new product!');
          console.log('newProduct', error);
          resolve(false);
        }
      }
    });
  }

  private connectWallet = async () => {
    if (this.mdWallet) {
      await application.loadPackage('@scom/scom-wallet-modal', '*');
      this.mdWallet.networks = this.networks;
      this.mdWallet.wallets = this.wallets;
      this.mdWallet.showModal();
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

  private async refreshDApp(isDataUpdated: boolean = false) {
    setTimeout(async () => {
      this._type = this.productType;
      await this.updateDAppUI(this._data);
      this.determineBtnSubmitCaption();
      if (!this.nftType) return;
      await this.initWallet();
      this.btnSubmit.enabled = isClientWalletConnected() && this.state.isRpcWalletConnected();
      // OswapTroll
      if (this.nftType === 'ERC721' && !this.productId) {
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
        let token = tokenStore.getTokenList(this.chainId).find(v => v.address === tokenAddress);
        if (!token) {
          token = await getTokenInfo(tokenAddress, this.chainId);
        }
        this.pnlInputFields.visible = true;
        this.pnlUnsupportedNetwork.visible = false;
        this.detailWrapper.visible = true;
        this.onToggleDetail();
        this.btnDetail.visible = true;
        this.erc1155Wrapper.visible = false;
        this.lbContract.caption = FormatUtils.truncateWalletAddress(this.nftAddress);
        this.updateTokenAddress(tokenAddress);
        this.lbOwn.caption = formatNumber(nftBalance || 0, 0);
        this.pnlMintFee.visible = true;
        this.oswapTrollInfo = { token, price };
        this.lblMintFee.caption = `${formatNumber(price)} ${token?.symbol || ''}`;
        this.lblSpotsRemaining.caption = formatNumber(cap, 0);
        this.cap = cap.toNumber();
        //this.pnlQty.visible = true;
        this.pnlSubscriptionPeriod.visible = false;
        this.edtQty.readOnly = true;
        this.edtQty.value = '1';
        this.lbOrderTotal.caption = `${formatNumber(price, 6)} ${token?.symbol || ''}`;
        this.pnlTokenInput.visible = false;
        this.imgUri.visible = false;
        this.determineBtnSubmitCaption();
        return;
      }
      //this.edtQty.readOnly = false;
      this.edtQty.readOnly = true;
      this.productInfo = await getProductInfo(this.state, this.productId);
      if (this.productInfo) {
        if (isDataUpdated && this._type === ProductType.Subscription) {
          this.discountRules = await getDiscountRules(this.state, this._data.productId);
        }
        const token = this.productInfo.token;
        this.pnlInputFields.visible = true;
        this.pnlUnsupportedNetwork.visible = false;
        const price = Utils.fromDecimals(this.productInfo.price, token.decimals).toFixed();
        (!this.lblRef.isConnected) && await this.lblRef.ready();
        if (this._type === ProductType.Buy || this._type === ProductType.Subscription) {
          const nftBalance = isClientWalletConnected() ? await getNFTBalance(this.state, this.productId) : 0;
          this.detailWrapper.visible = true;
          this.onToggleDetail();
          this.btnDetail.visible = true;
          this.erc1155Wrapper.visible = this.nftType === 'ERC1155';
          this.lbERC1155Index.caption = `${this.productInfo.nftId?.toNumber() || ''}`;
          this.lbContract.caption = FormatUtils.truncateWalletAddress(this.contractAddress || this.nftAddress);
          this.updateTokenAddress(token.address);
          this.lbOwn.caption = formatNumber(nftBalance, 0);
          this.pnlMintFee.visible = true;
          const days = Math.ceil((this.productInfo.priceDuration?.toNumber() || 0) / 86400);
          const duration = this._type === ProductType.Subscription ? days > 1 ? ` for ${days} days` : ' per day' : '';
          this.lblMintFee.caption = `${price ? formatNumber(price) : ""} ${token?.symbol || ""}${duration}`;
          this.lblTitle.caption = this._data.title;
          this.lblRef.caption = 'smart contract:';
          this.updateSpotsRemaining();
          this.tokenInput.inputReadOnly = true;
          this.pnlQty.visible = false;
          this.pnlSubscriptionPeriod.visible = this._type === ProductType.Subscription;
          if (isDataUpdated && this._type === ProductType.Subscription) {
            this.edtStartDate.value = moment();
            const rule = this._data.discountRuleId ? this.discountRules.find(rule => rule.id === this._data.discountRuleId) : null;
            const isExpired = rule && rule.endTime && rule.endTime < moment().unix();
            if (isExpired) this._data.discountRuleId = undefined;
            if (rule && !isExpired) {
              if (rule.startTime && rule.startTime > this.edtStartDate.value.unix()) {
                this.edtStartDate.value = moment(rule.startTime * 1000);
              }
              this.edtDuration.value = rule.minDuration.div(86400).toNumber();
              this.comboDurationUnit.selectedItem = DurationUnits[0];
              this.discountApplied = rule;
              this._updateEndDate();
              this._updateTotalAmount();
              if (this.approvalModelAction) {
                this.approvalModelAction.checkAllowance(this.productInfo.token, this.tokenAmountIn);
              }
            } else {
              this.edtDuration.value = Math.ceil((this.productInfo.priceDuration?.toNumber() || 0) / 86400);
              this.onDurationChanged();
            }
          }
          //this.pnlQty.visible = true;
          this.pnlTokenInput.visible = false;
          if (this.productInfo.uri) {
            this.imgUri.visible = true;
            this.imgUri.url = this.productInfo.uri;
          } else {
            this.imgUri.visible = false;
          }
          this.edtQty.value = '1';
          if (this._type !== ProductType.Subscription) await this.onQtyChanged();
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
          this.imgUri.visible = false;
          this.edtQty.value = "";
          this.lbOrderTotal.caption = "0";
        }
        this.tokenInput.value = "";
        this.pnlAddress.visible = this._type === ProductType.DonateToOwner || this._type === ProductType.DonateToEveryone;
        (!this.lblAddress.isConnected) && await this.lblAddress.ready();
        this.lblAddress.caption = this.contractAddress || this.nftAddress;
        this.tokenInput.token = token?.address === nullAddress ? {
          ...token,
          isNative: true,
          address: undefined
        } : token;
        await this.updateTokenBalance();
      }
      else {
        this.pnlInputFields.visible = false;
        this.pnlUnsupportedNetwork.visible = true;
      }
      this.determineBtnSubmitCaption();
    });
  }

  async getProductInfo() {
    if (!this.productId || !this.productInfo) return null;
    if (this.productInfo.productId.isEqualTo(this.productId)) return this.productInfo;
    try {
      const productInfo = await getProductInfo(this.state, this.productId);
      return productInfo;
    } catch {
      return null;
    }
  }

  private updateTokenAddress(address: string) {
    const isNativeToken = !address || address === nullAddress || !address.startsWith('0x');
    if (isNativeToken) {
      const network = this.state.getNetworkInfo(this.chainId);
      this.lbToken.caption = `${network?.chainName || ''} Native Token`;
      this.lbToken.textDecoration = 'none';
      this.lbToken.font = { size: '1rem', color: Theme.text.primary };
      this.lbToken.style.textAlign = 'right';
      this.lbToken.classList.remove(linkStyle);
      this.lbToken.onClick = () => { };
    } else {
      this.lbToken.caption = FormatUtils.truncateWalletAddress(address);
      this.lbToken.textDecoration = 'underline';
      this.lbToken.font = { size: '1rem', color: Theme.colors.primary.main };
      this.lbToken.classList.add(linkStyle);
      this.lbToken.onClick = () => this.onCopyToken();
    }
    this.iconCopyToken.visible = !isNativeToken;
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
    const token = this.nftType === 'ERC721' && !this.productId ? this.oswapTrollInfo.token : this.productInfo.token;
    this.state.viewExplorerByAddress(this.chainId, token.address || token.symbol);
  }

  private onCopyContract() {
    application.copyToClipboard(this.nftType === 'ERC721' ? this.nftAddress : (this.contractAddress || this.nftAddress));
  }

  private onCopyToken() {
    const token = this.nftType === 'ERC721' && !this.productId ? this.oswapTrollInfo.token : this.productInfo.token;
    application.copyToClipboard(token.address || token.symbol);
  }

  private showTxStatusModal = (status: 'warning' | 'success' | 'error', content?: string | Error, exMessage?: string) => {
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
      this.updateContractAddress();
      if (this.productInfo?.token?.address !== nullAddress && this.tokenAmountIn) {
        this.approvalModelAction.checkAllowance(this.productInfo.token, this.tokenAmountIn);
      }
    }
  }

  private updateContractAddress() {
    if (this.approvalModelAction) {
      if (this._data.referrer) {
        this.contractAddress = this.state.getContractAddress('Commission');
      }
      else {
        this.contractAddress = this.state.getContractAddress('ProductMarketplace');
      }
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
    else if (this.nftType === 'ERC721' && !this.productId) {
      this.btnSubmit.caption = this.cap ? 'Mint' : 'Out of stock';
      this.btnSubmit.enabled = !!this.cap;
    }
    else if (this._type === ProductType.Buy) {
      this.btnSubmit.caption = 'Mint';
    }
    else if (this._type === ProductType.Subscription) {
      this.btnSubmit.caption = 'Subscribe';
    }
    else {
      this.btnSubmit.caption = 'Submit';
    }
  }

  private async onApprove() {
    if (this.nftType === 'ERC721' && !this.productId) {
      const { price, token } = this.oswapTrollInfo;
      // const contractAddress = this.state.getExplorerByAddress(this.chainId, this.nftAddress);
      const contractAddress = this.state.getContractAddress('ProductMarketplace');
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
      this.lbOrderTotal.caption = `${formatNumber(total, 6)} ${this.productInfo.token?.symbol || ''}`;
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
    this.lbOrderTotal.caption = `${formatNumber(total, 6)} ${token?.symbol || ''}`;
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
    if (this.nftType === 'ERC721' && !this.productId) {
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
    try {
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
      } else if (this._type === ProductType.Subscription) {
        if (!this.edtStartDate.value) {
          this.showTxStatusModal('error', 'Start Date Required');
          this.updateSubmitButton(false);
          return;
        }
        if (!this.edtDuration.value) {
          this.showTxStatusModal('error', 'Duration Required');
          this.updateSubmitButton(false);
          return;
        }
        await this.buyToken();
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
        await this.buyToken();
      }
      this.updateSubmitButton(false);
      if (this.txStatusModal) this.txStatusModal.closeModal();
    } catch (error) {
      this.showTxStatusModal('error', error);
      this.updateSubmitButton(false);
    }
  }

  private async onSubmit() {
    if (!isClientWalletConnected()) {
      this.connectWallet();
      return;
    }
    if (!this.state.isRpcWalletConnected()) {
      const clientWallet = Wallet.getClientInstance();
      await clientWallet.switchNetwork(this.chainId);
      return;
    }
    if (this.nftType === 'ERC721' && !this.productId) {
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

  private async buyToken(quantity?: number) {
    if (!this.productId) return;
    const callback = (error: Error, receipt?: string) => {
      if (error) {
        this.showTxStatusModal('error', error);
      }
    };
    const token = this.productInfo.token;
    if (this.productType == ProductType.DonateToOwner || this.productType == ProductType.DonateToEveryone) {
      await donate(this.state, this.productId, this.recipient, this.tokenInput.value, this._data.commissions, token, callback,
        async () => {
          await this.updateTokenBalance();
        }
      );
    }
    else if (this.productType === ProductType.Subscription) {
      const startTime = this.edtStartDate.value.unix();
      const days = this.getDurationInDays();
      await subscribe(this.state, this.productId, startTime, days * 86400, this.recipient, this._data.referrer, this.discountApplied?.id ?? 0, callback,
        async () => {
          await this.updateTokenBalance();
          this.productInfo = await getProductInfo(this.state, this.productId);
          const nftBalance = await getNFTBalance(this.state, this.productId);
          this.lbOwn.caption = nftBalance;
          this.updateSpotsRemaining();
          if (this.onMintedNFT) this.onMintedNFT();
        })
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

  private getDurationInDays() {
    const unit = ((this.comboDurationUnit.selectedItem as IComboItem)?.value || DurationUnits[0].value) as 'days' | 'months' | 'years';
    const duration = Number(this.edtDuration.value) || 0;
    if (unit === 'days') {
      return duration;
    } else {
      const dateFormat = 'YYYY-MM-DD';
      const startDate = this.edtStartDate.value ? moment(this.edtStartDate.value.format(dateFormat), dateFormat) : moment();
      const endDate = moment(startDate).add(duration, unit);
      const diff = endDate.diff(startDate, 'days');
      return diff;
    }
  }

  private _updateEndDate() {
    const dateFormat = 'YYYY-MM-DD';
    if (!this.edtStartDate.value) {
      this.lblEndDate.caption = '-';
      return;
    }
    const startDate = moment(this.edtStartDate.value.format(dateFormat), dateFormat);
    const unit = ((this.comboDurationUnit.selectedItem as IComboItem)?.value || DurationUnits[0].value) as 'days' | 'months' | 'years';
    const duration = Number(this.edtDuration.value) || 0;
    this.lblEndDate.caption = startDate.add(duration, unit).format('DD/MM/YYYY');
  }

  private _updateDiscount() {
    this.discountApplied = undefined;
    const duration = Number(this.edtDuration.value) || 0;
    if (!this.discountRules?.length || !duration || !this.edtStartDate.value) return;
    const price = Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals);
    const startTime = this.edtStartDate.value.unix();
    const days = this.getDurationInDays();
    const durationInSec = days * 86400;
    let discountAmount: BigNumber;
    for (let rule of this.discountRules) {
      if (rule.discountApplication === 0 && this.isRenewal) continue;
      if (rule.discountApplication === 1 && !this.isRenewal) continue;
      if ((rule.startTime > 0 && startTime < rule.startTime) || (rule.endTime > 0 && startTime > rule.endTime) || rule.minDuration.gt(durationInSec)) continue;
      let basePrice: BigNumber = price;
      if (rule.discountPercentage > 0) {
        basePrice = price.times(1 - rule.discountPercentage / 100)
      } else if (rule.fixedPrice.gt(0)) {
        basePrice = rule.fixedPrice;
      }
      let tmpDiscountAmount = price.minus(basePrice).div(this.productInfo.priceDuration.div(86400)).times(days);
      if (!this.discountApplied || tmpDiscountAmount.gt(discountAmount)) {
        this.discountApplied = rule;
        discountAmount = tmpDiscountAmount;
      }
    }
  }

  private _updateTotalAmount() {
    const duration = Number(this.edtDuration.value) || 0;
    if (!duration) this.lbOrderTotal.caption = `0 ${this.productInfo.token?.symbol || ''}`;
    const price = this.productInfo.price;
    let basePrice: BigNumber = price;
    this.pnlDiscount.visible = false;
    if (this.discountApplied) {
      if (this.discountApplied.discountPercentage > 0) {
        basePrice = price.times(1 - this.discountApplied.discountPercentage / 100);
        this.lblDiscount.caption = `Discount (${this.discountApplied.discountPercentage}% off)`;
        this.pnlDiscount.visible = true;
      } else if (this.discountApplied.fixedPrice.gt(0)) {
        basePrice = this.discountApplied.fixedPrice as BigNumber;
        this.lblDiscount.caption = "Discount";
        this.pnlDiscount.visible = true;
      }
    }
    const pricePerDay = basePrice.div(this.productInfo.priceDuration.div(86400));
    const days = this.getDurationInDays();
    const amountRaw = pricePerDay.times(days);
    const amount = Utils.fromDecimals(amountRaw, this.productInfo.token.decimals);
    this.tokenAmountIn = amount.toFixed();
    if (this.discountApplied) {
      const discountAmountRaw = price.minus(basePrice).div(this.productInfo.priceDuration.div(86400)).times(days);
      const discountAmount = Utils.fromDecimals(discountAmountRaw, this.productInfo.token.decimals);
      this.lblDiscountAmount.caption = `-${formatNumber(discountAmount, 6)} ${this.productInfo.token?.symbol || ''}`;
    }
    this.lbOrderTotal.caption = `${formatNumber(amount, 6)} ${this.productInfo.token?.symbol || ''}`;
  }

  private onStartDateChanged() {
    this._updateEndDate();
    this._updateDiscount();
  }
  
  private onDurationChanged() {
    this._updateEndDate();
    this._updateDiscount();
    this._updateTotalAmount();
    if (this.approvalModelAction) {
      this.approvalModelAction.checkAllowance(this.productInfo.token, this.tokenAmountIn);
    }
  }
  
  private onDurationUnitChanged() {
    this._updateEndDate();
    this._updateDiscount();
    this._updateTotalAmount();
    if (this.approvalModelAction) {
      this.approvalModelAction.checkAllowance(this.productInfo.token, this.tokenAmountIn);
    }
  }

  async init() {
    super.init();
    this._createProduct = this._createProduct.bind(this);
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
      const tokenToMint = this.getAttribute('tokenToMint', true);
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
        tokenToMint,
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
                    <i-image
                      visible={false}
                      id="imgUri"
                      width={280}
                      maxWidth="100%"
                      height="auto"
                      maxHeight={150}
                      margin={{ top: 4, bottom: 16, left: 'auto', right: 'auto' }}
                    />
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
                          <i-icon id="iconCopyToken" visible={false} fill={Theme.text.primary} name="copy" width={16} height={16} onClick={this.onCopyToken} cursor="pointer" />
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
                      width={280}
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
                    <i-stack id='pnlRecipient' width='100%' direction="horizontal" alignItems="center" justifyContent="space-between" gap={10}>
                      <i-label caption='Recipient' font={{ bold: true, size: '1rem' }}></i-label>
                      <i-input
                        id='edtRecipient'
                        height={35}
                        width="100%"
                        class={inputStyle}
                        font={{ size: '1rem' }}
                        border={{ radius: 4, style: 'none' }}
                        padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }}
                      >
                      </i-input>
                    </i-stack>
                    <i-stack id="pnlSubscriptionPeriod" direction="vertical" width="100%" gap="0.5rem" visible={false}>
                      <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="space-between" gap={10}>
                        <i-label caption="Starts" font={{ bold: true, size: '1rem' }}></i-label>
                        <i-panel width="50%">
                          <i-datepicker
                            id='edtStartDate'
                            height={36}
                            width="100%"
                            type="date"
                            placeholder="dd/mm/yyyy"
                            background={{ color: Theme.input.background }}
                            font={{ size: '1rem' }}
                            border={{ radius: "0.375rem" }}
                            onChanged={this.onStartDateChanged}
                          ></i-datepicker>
                        </i-panel>
                      </i-stack>
                      <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="space-between" gap={10}>
                        <i-label caption="Duration" font={{ bold: true, size: '1rem' }}></i-label>
                        <i-stack direction="horizontal" width="50%" alignItems="center" gap="0.5rem">
                          <i-panel width="50%">
                            <i-input
                              id='edtDuration'
                              height={36}
                              width="100%"
                              class={inputStyle}
                              inputType='number'
                              font={{ size: '1rem' }}
                              border={{ radius: 4, style: 'none' }}
                              padding={{ top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }}
                              onChanged={this.onDurationChanged}
                            >
                            </i-input>
                          </i-panel>
                          <i-panel width="50%">
                            <i-combo-box
                              id="comboDurationUnit"
                              height={36}
                              width="100%"
                              icon={{ width: 14, height: 14, name: 'angle-down', fill: Theme.divider }}
                              border={{ width: 1, style: 'solid', color: Theme.divider, radius: 5 }}
                              items={DurationUnits}
                              selectedItem={DurationUnits[0]}
                              onChanged={this.onDurationUnitChanged}
                            ></i-combo-box>
                          </i-panel>
                        </i-stack>
                      </i-stack>
                      <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="space-between" gap={10}>
                        <i-label caption="Ends" font={{ bold: true, size: '1rem' }}></i-label>
                        <i-label id="lblEndDate" font={{ size: '1rem' }} />
                      </i-stack>
                    </i-stack>
                    <i-stack
                      id="pnlDiscount"
                      direction="horizontal"
                      width="100%"
                      justifyContent="space-between"
                      alignItems="center"
                      gap="0.5rem"
                      lineHeight={1.5}
                      visible={false}
                    >
                      <i-label id="lblDiscount" caption="Discount" font={{ bold: true, size: '1rem' }}></i-label>
                      <i-label id="lblDiscountAmount" font={{ size: '1rem' }}></i-label>
                    </i-stack>
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