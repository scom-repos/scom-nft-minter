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
  IEventBus,
  application,
  VStack,
  IDataSchema,
  ControlElement,
} from '@ijstech/components';
import { BigNumber, Wallet, WalletPlugin } from '@ijstech/eth-wallet';
import { IConfig, ITokenObject, PageBlock, ProductType } from './interface/index';
import { getERC20ApprovalModelAction, getTokenBalance, IERC20ApprovalAction } from './utils/index';
import { DefaultTokens, EventId, getCommissionFee, getContractAddress, getIPFSGatewayUrl, getNetworkName, getTokenList, setDataFromSCConfig } from './store/index';
import { connectWallet, getChainId, hasWallet, isWalletConnected } from './wallet/index';
import Config from './config/index';
import { TokenSelection } from './token-selection/index';
import { imageStyle, inputStyle, markdownStyle, tokenSelectionStyle, inputGroupStyle } from './index.css';
import { Alert } from './alert/index';
import { buyProduct, donate, getNFTBalance, getProductInfo, getProxyTokenAmountIn, newProduct } from './API';
import scconfig from './scconfig.json';

interface ScomNftMinterElement extends ControlElement {
  name?: string;
  chainId?: number;
  productType?: string;
  description?: string;
  hideDescription?: boolean;
  logo?: string;
  donateTo?: string;
  maxOrderQty?: number;
  maxPrice?: string;
  price?: string;
  qty?: number;
  tokenAddress?: string;
  productId?: number;
  link?: string;
  feeTo?: string;
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
export default class ScomNftMinter extends Module implements PageBlock {
  private gridDApp: GridLayout;
  private imgLogo: Image;
  private imgLogo2: Image;
  private markdownViewer: Markdown;
  private pnlLink: HStack;
  private lblLink: Label;
  private lblTitle: Label;
  private pnlSpotsRemaining: HStack;
  private lblSpotsRemaining: Label;
  private pnlBlockchain: HStack;
  private lblBlockchain: Label;
  private pnlQty: HStack;
  private edtQty: Input;
  private lblBalance: Label;
  private btnSubmit: Button;
  private btnApprove: Button;
  private lblRef: Label;
  private lblAddress: Label;
  private gridTokenInput: GridLayout;
  private tokenSelection: TokenSelection;
  private edtAmount: Input;
  private configDApp: Config;
  private mdAlert: Alert;
  private pnlDescription: VStack;
  private lbOrderTotal: Label;
  private lbOrderTotalTitle: Label;

  private _type: ProductType | undefined;
  private _productId: number | undefined;
  private _oldData: IConfig = {};
  private _data: IConfig = {};
  private $eventBus: IEventBus;
  private approvalModelAction: IERC20ApprovalAction;
  private isApproving: boolean = false;
  private tokenAmountIn: string;
  private oldTag: any = {};
  tag: any = {};
  defaultEdit: boolean = true;
  private contractAddress: string;

  readonly onConfirm: () => Promise<void>;
  readonly onDiscard: () => Promise<void>;
  readonly onEdit: () => Promise<void>;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    setDataFromSCConfig(scconfig);
    this.$eventBus = application.EventBus;
    this.registerEvent();
  }

  async init() {
    super.init();
    await this.initWalletData();
    await this.onSetupPage(isWalletConnected());

    if (!this.tag || (typeof this.tag === 'object' && !Object.keys(this.tag).length)) {
      const defaultTag = {
        inputFontColor: '#ffffff',
        inputBackgroundColor: 'linear-gradient(#232B5A, #232B5A), linear-gradient(254.8deg, #E75B66 -8.08%, #B52082 84.35%)',
        fontColor: '#323232',
        backgroundColor: '#DBDBDB'
      }
      this.setTag(defaultTag);
      if (this.parentElement) {
        const toolbar = this.parentElement.closest('ide-toolbar') as any;
        if (toolbar) toolbar.setTag(defaultTag);
        const element = this.parentElement.closest('sc-page-viewer-page-element') as any;
        if (element) {
          element.style.setProperty('--text-primary', defaultTag.fontColor);
          element.style.setProperty('--background-main', defaultTag.backgroundColor);
          element.style.setProperty('--input-font_color', defaultTag.inputFontColor);
          element.style.setProperty('--input-background', defaultTag.inputBackgroundColor);
        }
      }
    }

    this._data.chainId = this.getAttribute('chainId', true);
    this._data.donateTo = this.getAttribute('donateTo', true);
    this._data.link = this.getAttribute('link', true);
    this._data.feeTo = this.getAttribute('feeTo', true);
    this._data.maxOrderQty = this.getAttribute('maxOrderQty', true);
    this._data.maxPrice = this.getAttribute('maxPrice', true);
    this._data.price = this.getAttribute('price', true);
    this._data.qty = this.getAttribute('qty', true);
    const tokenAddress = this.getAttribute('tokenAddress', true);
    if (tokenAddress) {
      this._data.token = DefaultTokens[this.chainId]?.find(t => t.address?.toLowerCase() == tokenAddress.toLowerCase());
    }
    this._data.productId = this.getAttribute('productId', true);
    this._data.productType = this.getAttribute('productType', true);
    this._data.name = this.getAttribute('name', true);
    this._data.description = this.getAttribute('description', true);
    this._data.hideDescription = this.getAttribute('hideDescription', true);
    this._data.logo = this.getAttribute('logo', true);

    const commissionFee = getCommissionFee();
    this.lbOrderTotalTitle.caption = `Total (+${new BigNumber(commissionFee).times(100)}% Commission Fee)`;
    if (new BigNumber(commissionFee).gt(0) && this._data.feeTo != undefined) {
      this._data.commissions = [{
        walletAddress: this._data.feeTo,
        share: commissionFee
      }]
    }
    this._productId = this._data.productId;

    if (this.approvalModelAction) {
      if (!this._data.commissions || this._data.commissions.length == 0) {
        this.contractAddress = getContractAddress('ProductInfo');
      }
      else {
        this.contractAddress = getContractAddress('Proxy');
      }
      this.approvalModelAction.setSpenderAddress(this.contractAddress);
    }

    this.refreshDApp();
  }

  static async create(options?: ScomNftMinterElement, parent?: Container){
    let self = new this(parent, options);
    await self.ready();
    return self;
  }   

  get chainId() {
    return this._data.chainId ?? 0;
  }

  set chainId(value: number) {
    this._data.chainId = value;
  }

  get donateTo() {
    return this._data.donateTo ?? '';
  }

  set donateTo(value: string) {
    this._data.donateTo = value;
  }

  get link() {
    return this._data.link ?? '';
  }

  set link(value: string) {
    this._data.link = value;
  }

  get feeTo() {
    return this._data.feeTo ?? '';
  }

  set feeTo(value: string) {
    this._data.feeTo = value;
  }

  get maxOrderQty() {
    return this._data.maxOrderQty ?? 0;
  }

  set maxOrderQty(value: number) {
    this._data.maxOrderQty = value;
  }

  get maxPrice() {
    return this._data.maxPrice ?? "0";
  }

  set maxPrice(value: string) {
    this._data.maxPrice = value;
  }

  get price() {
    return this._data.price ?? "0";
  }

  set price(value: string) {
    this._data.price = value;
  }

  get qty() {
    return this._data.qty ?? 0;
  }

  set qty(value: number) {
    this._data.qty = value;
  }

  get tokenAddress() {
    return this._data.token?.address ?? '';
  }

  set tokenAddress(value: string) {
    this._data.token = DefaultTokens[this.chainId]?.find(t => t.address?.toLowerCase() == value.toLowerCase());
  }

  get productId() {
    return this._data.productId ?? 0;
  }

  set productId(value: number) {
    this._data.productId = value;
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

  get hideDescription() {
    return this._data.hideDescription ?? false;
  }

  set hideDescription(value: boolean) {
    this._data.hideDescription = value;
  }

  get logo() {
    return this._data.logo ?? '';
  }

  set logo(value: string) {
    this._data.logo = value;
  }

  get commissions() {
    return this._data.commissions ?? [];
  }

  set commissions(value: any) {
    this._data.commissions = value;
  }

  private registerEvent() {
    this.$eventBus.register(this, EventId.IsWalletConnected, () => this.onWalletConnect(true));
    this.$eventBus.register(this, EventId.IsWalletDisconnected, () => this.onWalletConnect(false));
    this.$eventBus.register(this, EventId.chainChanged, this.onChainChanged);
  }

  onWalletConnect = async (connected: boolean) => {
    let chainId = getChainId();
    if (connected && !chainId) {
      this.onSetupPage(true);
    } else {
      this.onSetupPage(connected);
    }
    if (connected) {
      await this.updateTokenBalance();
    }
  }

  onChainChanged = async () => {
    this.onSetupPage(true);
    await this.updateTokenBalance();
  }

  private updateTokenBalance = async () => {
    if (!this._data.token) return;
    try {
      let chainId = getChainId();
      const _tokenList = getTokenList(chainId);
      const token = _tokenList.find(t => (t.address && t.address == this._data.token?.address) || (t.symbol == this._data.token?.symbol))
      const symbol = token?.symbol || '';
      this.lblBalance.caption = token ? `${(await getTokenBalance(token)).toFixed(2)} ${symbol}` : `0 ${symbol}`;
    } catch { }
  }

  private async onSetupPage(isWalletConnected: boolean) {
    if (isWalletConnected) {
      await this.initApprovalAction();
    }
  }

  getEmbedderActions() {
    const propertiesSchema: IDataSchema = {
      type: 'object',
      properties: {
        "chainId": {
          title: 'Chain ID',
          type: 'number',
          readOnly: true
        },
        "feeTo": {
          type: 'string',
          default: Wallet.getClientInstance().address,
          format: "wallet-address"
        }
      }
    };
    if (!this._data.hideDescription) {
      propertiesSchema.properties['description'] = {
        type: 'string',
        format: 'multi'
      };
      propertiesSchema.properties['logo'] = {
        type: 'string',
        format: 'data-url'
      };
    }
    const themeSchema: IDataSchema = {
      type: 'object',
      properties: {
        backgroundColor: {
          type: 'string',
          format: 'color',
          readOnly: true
        },
        fontColor: {
          type: 'string',
          format: 'color',
          readOnly: true
        },
        inputBackgroundColor: {
          type: 'string',
          format: 'color',
          readOnly: true
        },
        inputFontColor: {
          type: 'string',
          format: 'color',
          readOnly: true
        }
      }
    }

    return this._getActions(propertiesSchema, themeSchema);
  }

  getActions() {
    const propertiesSchema: IDataSchema = {
      type: 'object',
      properties: {
        // "name": {
        //   type: 'string'
        // },
        // "productType": {
        //   type: 'string'
        // },
        // "chainId": {
        //   title: 'Chain ID',
        //   type: 'number'
        // },    
        // "token": {
        //   type: 'object'
        // },            
        "donateTo": {
          type: 'string',
          default: Wallet.getClientInstance().address,
          format: "wallet-address"
        },
        // "productId": {
        //   type: 'number'
        // },
        "link": {
          type: 'string'
        },
        // "price": {
        //   type: 'string'
        // },
        // "maxPrice": {
        //   type: 'string'
        // },
        // "maxOrderQty": {
        //   type: 'number'
        // },
        // "qty": {
        //   type: 'number'
        // }
      }
    };
    if (!this._data.hideDescription) {
      propertiesSchema.properties['description'] = {
        type: 'string',
        format: 'multi'
      };
      propertiesSchema.properties['logo'] = {
        type: 'string',
        format: 'data-url'
      };
    }
    const themeSchema: IDataSchema = {
      type: 'object',
      properties: {
        backgroundColor: {
          type: 'string',
          format: 'color'
        },
        fontColor: {
          type: 'string',
          format: 'color'
        },
        inputBackgroundColor: {
          type: 'string',
          format: 'color'
        },
        inputFontColor: {
          type: 'string',
          format: 'color'
        }
      }
    }

    return this._getActions(propertiesSchema, themeSchema);
  }

  _getActions(propertiesSchema: IDataSchema, themeSchema: IDataSchema) {
    const actions = [
      {
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          return {
            execute: async () => {
              this._oldData = { ...this._data };
              if (userInputData.name != undefined) this._data.name = userInputData.name;
              if (userInputData.productType != undefined) this._data.productType = userInputData.productType;
              if (userInputData.productId != undefined) this._data.productId = userInputData.productId;
              if (userInputData.donateTo != undefined) this._data.donateTo = userInputData.donateTo;
              if (userInputData.logo != undefined) this._data.logo = userInputData.logo;
              if (userInputData.description != undefined) this._data.description = userInputData.description;
              if (userInputData.link != undefined) this._data.link = userInputData.link;
              if (userInputData.chainId != undefined) this._data.chainId = userInputData.chainId;
              if (userInputData.price != undefined) this._data.price = userInputData.price;
              if (userInputData.maxPrice != undefined) this._data.maxPrice = userInputData.maxPrice;
              if (userInputData.maxOrderQty != undefined) this._data.maxOrderQty = userInputData.maxOrderQty;
              if (userInputData.qty != undefined) this._data.qty = userInputData.qty;
              if (userInputData.token != undefined) this._data.token = userInputData.token;
              const commissionFee = getCommissionFee();
              if (new BigNumber(commissionFee).gt(0) && userInputData.feeTo != undefined) {
                this._data.feeTo = userInputData.feeTo;
                this._data.commissions = [{
                  walletAddress: userInputData.feeTo,
                  share: commissionFee
                }]
              }
              this._productId = this._data.productId;
              this.configDApp.data = this._data;
              this.refreshDApp();
              await this.newProduct((error: Error, receipt?: string) => {
                if (error) {
                  this.mdAlert.message = {
                    status: 'error',
                    content: error.message
                  };
                  this.mdAlert.showModal();
                }
              }, this.updateSpotsRemaining);
              if (builder?.setData) builder.setData(this._data);
            },
            undo: () => {
              this._data = { ...this._oldData };
              this._productId = this._data.productId;
              this.configDApp.data = this._data;
              this.refreshDApp();
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: propertiesSchema
      },
      {
        name: 'Theme Settings',
        icon: 'palette',
        command: (builder: any, userInputData: any) => {
          return {
            execute: async () => {
              if (!userInputData) return;
              this.oldTag = { ...this.tag };
              if (builder) builder.setTag(userInputData);
              else this.setTag(userInputData);
              // this.setTag(userInputData);
            },
            undo: () => {
              if (!userInputData) return;
              this.tag = { ...this.oldTag };
              if (builder) builder.setTag(this.tag);
              else this.setTag(this.oldTag);
              // this.setTag(this.oldTag);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: themeSchema
      }
    ]
    return actions
  }

  getData() {
    return this._data;
  }

  async setData(data: IConfig) {
    this._data = data;
    this._productId = data.productId;
    this.configDApp.data = data;
    const commissionFee = getCommissionFee();
    this.lbOrderTotalTitle.caption = `Total (+${new BigNumber(commissionFee).times(100)}% Commission Fee)`;
    if (new BigNumber(commissionFee).gt(0) && this._data.feeTo != undefined) {
      this._data.commissions = [{
        walletAddress: this._data.feeTo,
        share: commissionFee
      }]
    }
    if (this.approvalModelAction) {
      if (!this._data.commissions || this._data.commissions.length == 0) {
        this.contractAddress = getContractAddress('ProductInfo');
      }
      else {
        this.contractAddress = getContractAddress('Proxy');
      }
      this.approvalModelAction.setSpenderAddress(this.contractAddress);
    }

    this.refreshDApp();
  }

  getTag() {
    return this.tag;
  }

  async setTag(value: any) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop))
        this.tag[prop] = newValue[prop];
    }
    this.updateTheme();
  }

  private updateStyle(name: string, value: any) {
    value ?
      this.style.setProperty(name, value) :
      this.style.removeProperty(name);
  }

  private updateTheme() {
    this.updateStyle('--text-primary', this.tag?.fontColor);
    this.updateStyle('--background-main', this.tag?.backgroundColor);
    this.updateStyle('--input-font_color', this.tag?.inputFontColor);
    this.updateStyle('--input-background', this.tag?.inputBackgroundColor);
    this.updateStyle('--colors-primary-main', this.tag?.buttonBackgroundColor);
  }

  async edit() {
    this.gridDApp.visible = false;
    this.configDApp.visible = true;
  }

  async preview() {
    this.gridDApp.visible = true;
    this.configDApp.visible = false;
    this._data = this.configDApp.data;
    this._data.chainId = this._data.token ? getChainId() : undefined;
    this._data.productId = this._productId;
    this._data.maxPrice = this._data.maxPrice || '0';
    this.refreshDApp();
  }

  async confirm() {
    return new Promise<void>(async (resolve, reject) => {
      await this.preview();
      await this.newProduct((error: Error, receipt?: string) => {
        if (error) {
          this.mdAlert.message = {
            status: 'error',
            content: error.message
          };
          this.mdAlert.showModal();
          reject(error);
        }
      }, this.updateSpotsRemaining);
      if (!this._productId) {
        reject(new Error('productId missing'));
      }
      resolve();
    })
  }

  private newProduct = async (callback?: any, confirmationCallback?: any) => {
    if (
      this._data.productId >= 0
    ) return;
    const result = await newProduct(
      this._data.productType,
      this._data.qty,
      this._data.maxOrderQty,
      this._data.price,
      this._data.maxPrice,
      this._data.token,
      callback,
      confirmationCallback
    );
    this._productId = this._data.productId = result.productId;
  }

  async discard() {
    this.gridDApp.visible = true;
    this.configDApp.visible = false;
  }

  async config() { }

  validate() {
    const data = this.configDApp.data;
    if (
      !data ||
      !data.token ||
      !data.name ||
      data.maxOrderQty === undefined ||
      data.maxOrderQty === null ||
      data.price === undefined ||
      data.price === null ||
      data.qty === undefined ||
      data.qty === null
    ) {
      this.mdAlert.message = {
        status: 'error',
        content: 'Required field is missing.'
      };
      this.mdAlert.showModal();
      return false;
    }
    return true;
  }

  private async refreshDApp() {
    this._type = this._data.productType;
    if (this._data.hideDescription) {
      this.pnlDescription.visible = false;
      this.gridDApp.templateColumns = ['1fr'];
      this.imgLogo2.visible = true;
    }
    else {
      this.pnlDescription.visible = true;
      this.gridDApp.templateColumns = ['repeat(2, 1fr)'];
      this.imgLogo2.visible = false;
    }
    if (this._data.logo?.startsWith('ipfs://')) {
      const ipfsGatewayUrl = getIPFSGatewayUrl();
      this.imgLogo.url = this.imgLogo2.url = this._data.logo.replace('ipfs://', ipfsGatewayUrl);
    }
    else {
      this.imgLogo.url = this.imgLogo2.url = this._data.logo;
    }
    this.markdownViewer.load(this._data.description || '');
    this.pnlLink.visible = !!this._data.link;
    this.lblLink.caption = this._data.link || '';
    this.lblLink.link.href = this._data.link;
    if (this._type === ProductType.Buy) {
      this.lblTitle.caption = `Mint Fee: ${this._data.price ?? ""} ${this._data.token?.symbol || ""}`;
      this.btnSubmit.caption = 'Mint';
      this.lblRef.caption = 'smart contract:';
      if (this._data.chainId !== null && this._data.chainId !== undefined) {
        this.lblBlockchain.caption = getNetworkName(this._data.chainId) || this._data.chainId.toString();
      } else {
        this.lblBlockchain.caption = "";
      }
      await this.updateSpotsRemaining();
      this.gridTokenInput.visible = false;
    } else {
      this.lblTitle.caption = new BigNumber(this._data.price).isZero() ? 'Make a Contributon' : '';
      this.btnSubmit.caption = 'Submit';
      this.lblRef.caption = new BigNumber(this._data.price).isZero() ? 'All proceeds will go to following vetted wallet address:' : '';
      this.gridTokenInput.visible = true;
    }
    this.edtQty.value = "";
    this.edtAmount.value = "";
    this.lbOrderTotal.caption = "0";
    this.pnlSpotsRemaining.visible = new BigNumber(this._data.price).gt(0);
    this.pnlBlockchain.visible = new BigNumber(this._data.price).gt(0);
    this.pnlQty.visible = new BigNumber(this._data.price).gt(0) && this._data.maxOrderQty > 1;
    this.lblAddress.caption = this.contractAddress;
    // this.tokenSelection.readonly = this._data.token ? true : new BigNumber(this._data.price).gt(0);
    this.tokenSelection.chainId = this._data.chainId;
    this.tokenSelection.token = this._data.token;
    this.updateTokenBalance();
    // this.lblBalance.caption = (await getTokenBalance(this._data.token)).toFixed(2);
  }

  private updateSpotsRemaining = async () => {
    if (this._data.productId >= 0) {
      const product = await getProductInfo(this._data.productId);
      this.lblSpotsRemaining.caption = `${product.quantity.toFixed()}/${this._data.qty ?? 0}`;
    } else {
      this.lblSpotsRemaining.caption = `${this._data.qty ?? 0}/${this._data.qty ?? 0}`;
    }
  }

  private async initWalletData() {
    const selectedProvider = localStorage.getItem('walletProvider') as WalletPlugin;
    const isValidProvider = Object.values(WalletPlugin).includes(selectedProvider);
    if (hasWallet() && isValidProvider) {
      await connectWallet(selectedProvider);
    }
  }

  private async initApprovalAction() {
    if (!this.approvalModelAction) {
      this.contractAddress = getContractAddress('Proxy');
      this.approvalModelAction = getERC20ApprovalModelAction(this.contractAddress, {
        sender: this,
        payAction: async () => {
          await this.doSubmitAction();
        },
        onToBeApproved: async (token: ITokenObject) => {
          this.btnApprove.visible = true;
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
          this.isApproving = false;
          this.btnSubmit.enabled = new BigNumber(this.tokenAmountIn).gt(0);
        },
        onApproving: async (token: ITokenObject, receipt?: string) => {
          this.isApproving = true;
          this.btnApprove.rightIcon.spin = true;
          this.btnApprove.rightIcon.visible = true;
          this.btnApprove.caption = `Approving ${token.symbol}`;
          this.btnSubmit.visible = false;
          if (receipt) {
            this.mdAlert.message = {
              status: 'success',
              content: receipt
            };
            this.mdAlert.showModal();
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
          this.mdAlert.message = {
            status: 'error',
            content: err.message
          };
          this.mdAlert.showModal();
          this.btnApprove.caption = 'Approve';
          this.btnApprove.rightIcon.visible = false;
        },
        onPaying: async (receipt?: string) => {
          if (receipt) {
            this.mdAlert.message = {
              status: 'success',
              content: receipt
            };
            this.mdAlert.showModal();
            this.btnSubmit.enabled = false;
            this.btnSubmit.rightIcon.visible = true;
          }
        },
        onPaid: async (receipt?: any) => {
          this.btnSubmit.rightIcon.visible = false;
        },
        onPayingError: async (err: Error) => {
          this.mdAlert.message = {
            status: 'error',
            content: err.message
          };
          this.mdAlert.showModal();
        }
      });
    }
  }

  private async selectToken(token: ITokenObject) {
    const symbol = token?.symbol || '';
    this.lblBalance.caption = `${(await getTokenBalance(token)).toFixed(2)} ${symbol}`;
  }

  private updateSubmitButton(submitting: boolean) {
    this.btnSubmit.rightIcon.spin = submitting;
    this.btnSubmit.rightIcon.visible = submitting;
  }

  private onApprove() {
    this.mdAlert.message = {
      status: 'warning',
      content: 'Approving'
    };
    this.mdAlert.showModal();
    this.approvalModelAction.doApproveAction(this._data.token, this.tokenAmountIn);
  }

  private async onQtyChanged() {
    const qty = Number(this.edtQty.value);
    if (qty === 0) {
      this.tokenAmountIn = '0';
    }
    else {
      this.tokenAmountIn = getProxyTokenAmountIn(this._data.price, qty, this._data.commissions);
    }
    this.approvalModelAction.checkAllowance(this._data.token, this.tokenAmountIn);
  }

  private async onAmountChanged() {
    const amount = Number(this.edtAmount.value);
    if (amount === 0) {
      this.tokenAmountIn = '0';
    }
    else {
      this.tokenAmountIn = getProxyTokenAmountIn(this._data.price, amount, this._data.commissions);
    }
    const commissionFee = getCommissionFee();
    const total = new BigNumber(amount).plus(new BigNumber(amount).times(commissionFee));
    this.lbOrderTotal.caption = `${total} ${this._data.token.symbol}`;
    this.approvalModelAction.checkAllowance(this._data.token, this.tokenAmountIn);
  }

  private async doSubmitAction() {
    if (!this._data || !this._productId) return;
    this.updateSubmitButton(true);
    const chainId = getChainId();
    if ((this._type === ProductType.DonateToOwner || this._type === ProductType.DonateToEveryone) && !this.tokenSelection.token) {
      this.mdAlert.message = {
        status: 'error',
        content: 'Token Required'
      };
      this.mdAlert.showModal();
      this.updateSubmitButton(false);
      return;
    }
    if (this._type === ProductType.Buy && chainId !== this._data.chainId) {
      this.mdAlert.message = {
        status: 'error',
        content: 'Unsupported Network'
      };
      this.mdAlert.showModal();
      this.updateSubmitButton(false);
      return;
    }
    const balance = await getTokenBalance(this._type === ProductType.Buy ? this._data.token : this.tokenSelection.token);
    if (this._type === ProductType.Buy) {
      if (this.edtQty.value && Number(this.edtQty.value) > this._data.maxOrderQty) {
        this.mdAlert.message = {
          status: 'error',
          content: 'Quantity Greater Than Max Quantity'
        };
        this.mdAlert.showModal();
        this.updateSubmitButton(false);
        return;
      }
      if (this._data.maxOrderQty > 1 && (!this.edtQty.value || !Number.isInteger(Number(this.edtQty.value)))) {
        this.mdAlert.message = {
          status: 'error',
          content: 'Invalid Quantity'
        };
        this.mdAlert.showModal();
        this.updateSubmitButton(false);
        return;
      }
      const requireQty = this._data.maxOrderQty > 1 && this.edtQty.value ? Number(this.edtQty.value) : 1;
      if (this._data.productId >= 0) {
        const product = await getProductInfo(this._data.productId);
        if (product.quantity.lt(requireQty)) {
          this.mdAlert.message = {
            status: 'error',
            content: 'Out of stock'
          };
          this.mdAlert.showModal();
          this.updateSubmitButton(false);
          return;
        }
      }
      const maxOrderQty = new BigNumber(this._data.maxOrderQty ?? 0);
      if (maxOrderQty.minus(requireQty).lt(0)) {
        this.mdAlert.message = {
          status: 'error',
          content: 'Over Maximum Order Quantity'
        };
        this.mdAlert.showModal();
        this.updateSubmitButton(false);
        return;
      }

      const amount = new BigNumber(this._data.price).times(requireQty);
      if (balance.lt(amount)) {
        this.mdAlert.message = {
          status: 'error',
          content: `Insufficient ${this.tokenSelection.token.symbol} Balance`
        };
        this.mdAlert.showModal();
        this.updateSubmitButton(false);
        return;
      }
      await this.buyToken(requireQty);
    } else {
      if (!this.edtAmount.value) {
        this.mdAlert.message = {
          status: 'error',
          content: 'Amount Required'
        };
        this.mdAlert.showModal();
        this.updateSubmitButton(false);
        return;
      }
      if (balance.lt(this.edtAmount.value)) {
        this.mdAlert.message = {
          status: 'error',
          content: `Insufficient ${this.tokenSelection.token.symbol} Balance`
        };
        this.mdAlert.showModal();
        this.updateSubmitButton(false);
        return;
      }
      await this.buyToken(1);
    }
    this.updateSubmitButton(false);
  }

  private async onSubmit() {
    this.mdAlert.message = {
      status: 'warning',
      content: 'Confirming'
    };
    this.mdAlert.showModal();
    this.approvalModelAction.doPayAction();
  }

  buyToken = async (quantity: number) => {
    if (this._data.productId === undefined || this._data.productId === null) return;
    const callback = (error: Error, receipt?: string) => {
      if (error) {
        this.mdAlert.message = {
          status: 'error',
          content: error.message
        };
        this.mdAlert.showModal();
      }
    };
    if (this._data.productType == ProductType.DonateToOwner || this._data.productType == ProductType.DonateToEveryone) {
      await donate(this._data.productId, this._data.donateTo, this.edtAmount.value, this._data.commissions, this._data.token, callback,
        async () => {
          await this.updateTokenBalance();
        }
      );
    }
    else if (this._data.productType == ProductType.Buy) {
      await buyProduct(this._data.productId, quantity, '0', this._data.commissions, this._data.token, callback,
        async () => {
          await this.updateTokenBalance();
          await this.updateSpotsRemaining();
        }
      );
    }
  }

  render() {
    return (
      <i-panel background={{ color: Theme.background.main }}>
        <i-grid-layout
          id='gridDApp'
          width='100%'
          height='100%'
          templateColumns={['repeat(2, 1fr)']}
          padding={{ bottom: '1.563rem' }}
        >
          <i-vstack id="pnlDescription" padding={{ top: '0.5rem', bottom: '0.5rem', left: '5.25rem', right: '5.25rem' }}>
            <i-hstack margin={{ bottom: '1.25rem' }}>
              <i-image id='imgLogo' class={imageStyle} height={100}></i-image>
            </i-hstack>
            <i-markdown
              id='markdownViewer'
              class={markdownStyle}
              width='100%'
              height='100%'
              margin={{ bottom: '0.563rem' }}
            ></i-markdown>
          </i-vstack>
          <i-vstack gap="0.5rem" padding={{ top: '1.75rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }} verticalAlignment='space-between'>
            <i-vstack class="text-center" margin={{ bottom: '0.25rem' }}>
              <i-image id='imgLogo2' class={imageStyle} height={100}></i-image>
              <i-label id='lblTitle' font={{ bold: true, size: '1.5rem' }}></i-label>
              <i-label caption="I don't have a digital wallet" link={{ href: 'https://metamask.io/' }} opacity={0.6} font={{ size: '1rem' }}></i-label>
            </i-vstack>
            <i-hstack id='pnlSpotsRemaining' visible={false} gap='0.25rem'>
              <i-label caption='Spots Remaining:' font={{ bold: true, size: '0.875rem' }}></i-label>
              <i-label id='lblSpotsRemaining' font={{ size: '0.875rem' }}></i-label>
            </i-hstack>
            <i-hstack id='pnlBlockchain' visible={false} gap='0.25rem'>
              <i-label caption='Blockchain:' font={{ bold: true, size: '0.875rem' }}></i-label>
              <i-label id='lblBlockchain' font={{ size: '0.875rem' }}></i-label>
            </i-hstack>
            <i-vstack gap='0.5rem'>
              <i-vstack gap='0.25rem'>
                <i-hstack id='pnlQty' visible={false} horizontalAlignment='end' verticalAlignment='center' gap="0.5rem">
                  <i-label caption='Qty' font={{ size: '0.875rem' }}></i-label>
                  <i-input id='edtQty' onChanged={this.onQtyChanged.bind(this)} class={inputStyle} inputType='number' font={{ size: '0.875rem' }} border={{ radius: 4 }}></i-input>
                </i-hstack>
                <i-hstack horizontalAlignment='space-between' verticalAlignment='center' gap="0.5rem">
                  <i-label caption="Your donation" font={{ weight: 500, size: '1rem' }}></i-label>
                  <i-hstack horizontalAlignment='end' verticalAlignment='center' gap="0.5rem" opacity={0.6}>
                    <i-label caption='Balance:' font={{ size: '1rem' }}></i-label>
                    <i-label id='lblBalance' font={{ size: '1rem' }}></i-label>
                  </i-hstack>
                </i-hstack>
                <i-grid-layout
                  id='gridTokenInput'
                  templateColumns={['60%', 'auto']}
                  overflow="hidden"
                  background={{ color: Theme.input.background }}
                  font={{ color: Theme.input.fontColor }}
                  height={56}
                  verticalAlignment="center"
                  class={inputGroupStyle}
                >
                  <nft-minter-token-selection
                    id='tokenSelection'
                    class={tokenSelectionStyle}
                    background={{ color: 'transparent' }}
                    width="100%"
                    readonly={true}
                    onSelectToken={this.selectToken.bind(this)}
                  ></nft-minter-token-selection>
                  <i-input
                    id="edtAmount"
                    width='100%'
                    height='100%'
                    minHeight={40}
                    class={inputStyle}
                    inputType='number'
                    font={{ size: '1.25rem' }}
                    opacity={0.3}
                    onChanged={this.onAmountChanged.bind(this)}
                  ></i-input>
                </i-grid-layout>
                <i-vstack horizontalAlignment="center" verticalAlignment='center' gap="8px" margin={{ top: '0.75rem' }}>
                  <i-button
                    id="btnApprove"
                    width='100%'
                    caption="Approve"
                    padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}
                    font={{ size: '1rem', color: Theme.colors.primary.contrastText, bold: true }}
                    rightIcon={{ visible: false, fill: Theme.colors.primary.contrastText }}
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
              </i-vstack>
              <i-hstack
                horizontalAlignment="space-between"
                verticalAlignment='center'
              >
                <i-label id="lbOrderTotalTitle" caption='Total' font={{ size: '1rem' }}></i-label>
                <i-label id='lbOrderTotal' font={{ size: '1rem' }} caption="0"></i-label>
              </i-hstack>
              <i-vstack gap='0.25rem' margin={{ top: '1rem' }}>
                <i-label id='lblRef' font={{ size: '0.875rem' }} opacity={0.5}></i-label>
                <i-label id='lblAddress' font={{ size: '0.875rem' }} overflowWrap='anywhere'></i-label>
              </i-vstack>
              <i-label
                caption='Terms & Condition'
                font={{ size: '0.875rem' }}
                link={{ href: 'https://docs.scom.dev/' }}
                opacity={0.6}
                margin={{ top: '1rem' }}
              ></i-label>
            </i-vstack>
          </i-vstack>
          <i-hstack id='pnlLink' visible={false} verticalAlignment='center' gap='0.25rem' padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}>
            <i-label caption='Details here: ' font={{ size: '1rem' }}></i-label>
            <i-label id='lblLink' font={{ size: '1rem' }}></i-label>
          </i-hstack>
        </i-grid-layout>
        <nft-minter-config id='configDApp' visible={false}></nft-minter-config>
        <nft-minter-alert id='mdAlert'></nft-minter-alert>
      </i-panel>
    )
  }
}