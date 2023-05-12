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
  Icon,
} from '@ijstech/components';
import {} from '@ijstech/eth-contract';
import { BigNumber, INetwork, Utils } from '@ijstech/eth-wallet';
import { IChainSpecificProperties, IEmbedData, INetworkConfig, IProductInfo, ITokenObject, IWalletPlugin, PageBlock, ProductType } from './interface/index';
import { getERC20ApprovalModelAction, getTokenBalance, IERC20ApprovalAction } from './utils/index';
import { EventId, getEmbedderCommissionFee, getContractAddress, getIPFSGatewayUrl, switchNetwork, setDataFromSCConfig, SupportedNetworks } from './store/index';
import { getChainId, isWalletConnected } from './wallet/index';
import Config from './config/index';
import { TokenSelection } from './token-selection/index';
import { imageStyle, inputStyle, markdownStyle, tokenSelectionStyle, inputGroupStyle } from './index.css';
import { Alert } from './alert/index';
import { buyProduct, donate, getNFTBalance, getProductInfo, getProxyTokenAmountIn, newProduct } from './API';
import configData from './data.json';
// import ScomNetworkPicker, { INetworkConfig } from '@scom/scom-network-picker';
import ScomDappContainer from '@scom/scom-dapp-container';

interface ScomNftMinterElement extends ControlElement {
  name?: string;
  title?: string;
  productType?: string;
  description?: string;
  logo?: string;
  logoUrl?: string;
  link?: string;
  chainSpecificProperties?: Record<number, IChainSpecificProperties>;
  defaultChainId: number;
  wallets: IWalletPlugin[];
  networks: INetworkConfig[];
  showHeader?: boolean;
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
  private gridDApp: GridLayout;
  private imgLogo: Image;
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
  private lbOrderTotal: Label;
  private lbOrderTotalTitle: Label;
  private iconOrderTotal: Icon;
  // private networkPicker: ScomNetworkPicker;
  private pnlInputFields: VStack;
  private pnlUnsupportedNetwork: VStack;
  private containerDapp: ScomDappContainer;

  private productInfo: IProductInfo;
  private _type: ProductType | undefined;
  private _data: IEmbedData = {
    wallets: [],
    networks: [],
    defaultChainId: 0
  };
  private $eventBus: IEventBus;
  private approvalModelAction: IERC20ApprovalAction;
  private isApproving: boolean = false;
  private tokenAmountIn: string;
  tag: any = {};
  defaultEdit: boolean = true;
  private contractAddress: string;

  readonly onConfirm: () => Promise<void>;
  readonly onEdit: () => Promise<void>;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    setDataFromSCConfig(configData);
    this.$eventBus = application.EventBus;
    this.registerEvent();
  }

  async init() {
    this.isReadyCallbackQueued = true;
    super.init();
    // if (!this.containerDapp.isConnected) await this.containerDapp.ready();
    await this.onSetupPage(isWalletConnected());
    this._data.link = this.getAttribute('link', true);
    this._data.productType = this.getAttribute('productType', true);
    this._data.name = this.getAttribute('name', true);
    this._data.title = this.getAttribute('title', true);
    this._data.description = this.getAttribute('description', true);
    this._data.logo = this.getAttribute('logo', true);
    this._data.chainSpecificProperties = this.getAttribute('chainSpecificProperties', true);
    this._data.networks = this.getAttribute('networks', true);
    this._data.wallets = this.getAttribute('wallets', true);
    this._data.showHeader = this.getAttribute('showHeader', true);
    this._data.defaultChainId = this.getAttribute('defaultChainId', true);

    const commissionFee = getEmbedderCommissionFee();
    if (!this.lbOrderTotalTitle.isConnected) await this.lbOrderTotalTitle.ready();
    this.lbOrderTotalTitle.caption = `Total`;
    this.iconOrderTotal.tooltip.content = `A commission fee of ${new BigNumber(commissionFee).times(100)}% will be applied to the amount you input.`;

    this.updateContractAddress();
    await this.refreshDApp();
    this.isReadyCallbackQueued = false;
    this.executeReadyCallback();
  }

  static async create(options?: ScomNftMinterElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get donateTo() {
    return this._data.chainSpecificProperties?.[getChainId()]?.donateTo ?? '';
  }

  get link() {
    return this._data.link ?? '';
  }

  set link(value: string) {
    this._data.link = value;
  }

  get productId() {
    return this._data.chainSpecificProperties?.[getChainId()]?.productId ?? 0;
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

  get logo() {
    return this._data.logo ?? '';
  }

  set logo(value: string) {
    this._data.logo = value;
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
    return this._data.networks ?? [];
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

  private registerEvent() {
    this.$eventBus.register(this, EventId.IsWalletConnected, () => this.onWalletConnect(true));
    this.$eventBus.register(this, EventId.IsWalletDisconnected, () => this.onWalletConnect(false));
    this.$eventBus.register(this, EventId.chainChanged, this.onChainChanged);
  }

  private onWalletConnect = async (connected: boolean) => {
    let chainId = getChainId();
    if (connected && !chainId) {
      this.onSetupPage(true);
    } else {
      this.onSetupPage(connected);
    }
    if (connected) {
      this.updateContractAddress();
      this.refreshDApp();
    }
  }

  private onChainChanged = async () => {
    this.onSetupPage(true);
    this.updateContractAddress();
    this.refreshDApp();
  }

  private updateTokenBalance = async () => {
    const token = this.productInfo?.token;
    if (!token) return;
    try {
      const symbol = token?.symbol || '';
      this.lblBalance.caption = token ? `${(await getTokenBalance(token)).toFixed(2)} ${symbol}` : `0 ${symbol}`;
    } catch { }
  }

  private async onSetupPage(isWalletConnected: boolean) {
    if (isWalletConnected) {
      // this.networkPicker.setNetworkByChainId(getChainId());
      await this.initApprovalAction();
    }
  }

  private _getActions(propertiesSchema: IDataSchema, themeSchema: IDataSchema) {
    let self = this;
    const actions = [
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
              _oldData = {...this._data};
              let resultingData = {
                ...self._data,
                commissions: userInputData.commissions
              };
              await self.setData(resultingData);
              if (builder?.setData) builder.setData(this._data);
            },
            undo: async () => {
              this._data = {..._oldData};
              this.configDApp.data = this._data;
              await self.setData(this._data);
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        customUI: {
          render: (data?: any, onConfirm?: (result: boolean, data: any) => void) => {
            const vstack = new VStack();
            const config = new Config(null, {
              commissions: self._data.commissions
            });
            const button = new Button(null, {
              caption: 'Confirm',
            });
            vstack.append(config);
            vstack.append(button);
            button.onClick = async () => {
              const commissions = config.data.commissions;
              if (onConfirm) onConfirm(true, {commissions});
            }
            return vstack;
          }
        }
      },         
      {
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          let _oldData: IEmbedData = {
            wallets: [],
            networks: [],
            defaultChainId: 0
          };
          return {
            execute: async () => {
              _oldData = { ...this._data };
              if (userInputData.name != undefined) this._data.name = userInputData.name;
              if (userInputData.productType != undefined) this._data.productType = userInputData.productType;
              if (userInputData.logo != undefined) this._data.logo = userInputData.logo;
              if (userInputData.logoUrl != undefined) this._data.logoUrl = userInputData.logoUrl;
              if (userInputData.description != undefined) this._data.description = userInputData.description;
              if (userInputData.link != undefined) this._data.link = userInputData.link;
              this.configDApp.data = this._data;
              this.refreshDApp();
              // await this.newProduct((error: Error, receipt?: string) => {
              //   if (error) {
              //     this.mdAlert.message = {
              //       status: 'error',
              //       content: error.message
              //     };
              //     this.mdAlert.showModal();
              //   }
              // }, this.updateSpotsRemaining);
              if (builder?.setData) builder.setData(this._data);
            },
            undo: () => {
              this._data = { ..._oldData };
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
          let oldTag = {};
          return {
            execute: async () => {
              if (!userInputData) return;
              oldTag = JSON.parse(JSON.stringify(this.tag));
              if (builder) builder.setTag(userInputData);
              else this.setTag(userInputData);
              if (this.containerDapp) this.containerDapp.setTag(userInputData);
            },
            undo: () => {
              if (!userInputData) return;
              this.tag = JSON.parse(JSON.stringify(oldTag));
              if (builder) builder.setTag(this.tag);
              else this.setTag(this.tag);
              if (this.containerDapp) this.containerDapp.setTag(this.tag);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: themeSchema
      }
    ]
    return actions
  }

  getConfigurators() {
    let self = this;
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: () => {
          const propertiesSchema: IDataSchema = {
            type: 'object',
            properties: {
              "title": {
                type: 'string'
              },              
              "description": {
                type: 'string',
                format: 'multi'  
              },
              "logo": {
                type: 'string',
                format: 'data-url'
              },
              "logoUrl": {
                type: 'string',
                title: 'Logo URL'
              },
              "link": {
                type: 'string'
              }
            }
          };
      
          const themeSchema: IDataSchema = {
            type: 'object',
            properties: {
              "dark": {
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
              },
              "light": {
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
            }
          }
      
          return this._getActions(propertiesSchema, themeSchema);
        },
        getData: this.getData.bind(this),
        setData: async (data: IEmbedData) => {
          const defaultData = configData.defaultBuilderData as any;
          await this.setData({...defaultData, ...data})
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Emdedder Configurator',
        target: 'Embedders',
        elementName: 'i-scom-nft-minter-config',
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
        bindOnChanged: (element: Config, callback: (data: any) => Promise<void>) => {
          element.onCustomCommissionsChanged = async (data: any) => {
            let resultingData = {
              ...self._data,
              ...data
            };
            await self.setData(resultingData);
            await callback(data);
          }
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

  private async setData(data: IEmbedData) {
    this._data = data;
    this.configDApp.data = data;
    const commissionFee = getEmbedderCommissionFee();
    this.lbOrderTotalTitle.caption = `Total`;
    this.iconOrderTotal.tooltip.content = `A commission fee of ${new BigNumber(commissionFee).times(100)}% will be applied to the amount you input.`;
    this.updateContractAddress();
    await this.refreshDApp();
  }

  private getTag() {
    return this.tag;
  }

  private updateTag(type: 'light'|'dark', value: any) {
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
    const themeVar = this.containerDapp?.theme || 'light';
    this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
    this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
    this.updateStyle('--input-font_color', this.tag[themeVar]?.inputFontColor);
    this.updateStyle('--input-background', this.tag[themeVar]?.inputBackgroundColor);
    this.updateStyle('--colors-primary-main', this.tag[themeVar]?.buttonBackgroundColor);
  }

  // private newProduct = async (callback?: any, confirmationCallback?: any) => {
  //   if (
  //     this._data.productId >= 0
  //   ) return;
  //   const result = await newProduct(
  //     this._data.productType,
  //     this._data.qty,
  //     this._data.maxOrderQty,
  //     this._data.price,
  //     this._data.maxPrice,
  //     this._data.token,
  //     callback,
  //     confirmationCallback
  //   );
  //   this._productId = this._data.productId = result.productId;
  // }

  private async refreshDApp() {
    this._type = this._data.productType;
    this.markdownViewer.load(this._data.description || '');
    this.pnlLink.visible = !!this._data.link;
    (!this.lblLink.isConnected) && await this.lblLink.ready();
    this.lblLink.caption = this._data.link || '';
    this.lblLink.link.href = this._data.link;
    let _logo = this._data.logo || this._data.logoUrl;
    if (_logo?.startsWith('ipfs://')) {
      const ipfsGatewayUrl = getIPFSGatewayUrl();
      this.imgLogo.url = _logo.replace('ipfs://', ipfsGatewayUrl);
    }
    else {
      this.imgLogo.url = _logo;
    }
    const data: any = {
      wallets: this.wallets,
      networks: this.networks,
      showHeader: this.showHeader,
      defaultChainId: this.defaultChainId
    }
    if (this.containerDapp?.setData) this.containerDapp.setData(data);
    if (!this.productId || this.productId === 0) return;
    this.productInfo = await getProductInfo(this.productId);
    if (this.productInfo) {
      const token = this.productInfo.token;
      this.pnlInputFields.visible = true;
      this.pnlUnsupportedNetwork.visible = false;
      const price = Utils.fromDecimals(this.productInfo.price, token.decimals).toFixed();
      (!this.lblTitle.isConnected) && await this.lblTitle.ready();
      (!this.lblRef.isConnected) && await this.lblRef.ready();
      if (this._type === ProductType.Buy) {
        this.lblTitle.caption = this._data.title || `Mint Fee: ${price ?? ""} ${token?.symbol || ""}`;
        this.btnSubmit.caption = 'Mint';
        this.lblRef.caption = 'smart contract:';
        this.updateSpotsRemaining();
        this.gridTokenInput.visible = false;
      } else {
        this.lblTitle.caption = this._data.title || 'Make a Contributon';
        this.btnSubmit.caption = 'Submit';
        this.lblRef.caption = 'All proceeds will go to following vetted wallet address:';
        this.gridTokenInput.visible = true;
      }
      this.edtQty.value = "";
      this.edtAmount.value = "";
      this.lbOrderTotal.caption = "0";
      this.pnlSpotsRemaining.visible = new BigNumber(price).gt(0);
      this.pnlBlockchain.visible = new BigNumber(price).gt(0);
      this.pnlQty.visible = new BigNumber(price).gt(0) && this.productInfo.maxQuantity.gt(1);
      (!this.lblAddress.isConnected) && await this.lblAddress.ready();
      this.lblAddress.caption = this.contractAddress;
      // this.tokenSelection.readonly = this._data.token ? true : new BigNumber(price).gt(0);
      this.tokenSelection.chainId = getChainId();
      this.tokenSelection.token = token;
      this.updateTokenBalance();
      // this.lblBalance.caption = (await getTokenBalance(this._data.token)).toFixed(2);
    }
    else {
      this.pnlInputFields.visible = false;
      this.pnlUnsupportedNetwork.visible = true;
    }
  }

  private updateSpotsRemaining() {
    if (this.productId >= 0) {
      this.lblSpotsRemaining.caption = `${this.productInfo.quantity.toFixed()}`;
    } else {
      this.lblSpotsRemaining.caption = '';
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

  private updateContractAddress() {
    if (this.approvalModelAction) {
      if (!this._data.commissions || this._data.commissions.length == 0 || !this._data.commissions.find(v => v.chainId == getChainId())) {
        this.contractAddress = getContractAddress('ProductInfo');
      }
      else {
        this.contractAddress = getContractAddress('Proxy');
      }
      this.approvalModelAction.setSpenderAddress(this.contractAddress);
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
    this.approvalModelAction.doApproveAction(this.productInfo.token, this.tokenAmountIn);
  }

  private async onQtyChanged() {
    const qty = Number(this.edtQty.value);
    if (qty === 0 || !this.productInfo) {
      this.tokenAmountIn = '0';
    }
    else {
      this.tokenAmountIn = getProxyTokenAmountIn(this.productInfo.price.toFixed(), qty, this._data.commissions);
    }
    if (this.productInfo)
      this.approvalModelAction.checkAllowance(this.productInfo.token, this.tokenAmountIn);
  }

  private async onAmountChanged() {
    let amount = Number(this.edtAmount.value);
    if (amount === 0 || !this.productInfo) {
      this.tokenAmountIn = '0';
      this.edtAmount.value = '0';
    }
    else {
      this.tokenAmountIn = getProxyTokenAmountIn(this.productInfo.price.toFixed(), amount, this._data.commissions);
    }
    amount = Number(this.edtAmount.value);
    const commissionFee = getEmbedderCommissionFee();
    const total = new BigNumber(amount).plus(new BigNumber(amount).times(commissionFee));
    const token = this.productInfo?.token
    this.lbOrderTotal.caption = `${total} ${token?.symbol || ''}`;
    token && this.approvalModelAction.checkAllowance(token, this.tokenAmountIn);
  }

  private async doSubmitAction() {
    if (!this._data || !this.productId) return;
    this.updateSubmitButton(true);
    // const chainId = getChainId();
    if ((this._type === ProductType.DonateToOwner || this._type === ProductType.DonateToEveryone) && !this.tokenSelection.token) {
      this.mdAlert.message = {
        status: 'error',
        content: 'Token Required'
      };
      this.mdAlert.showModal();
      this.updateSubmitButton(false);
      return;
    }
    // if (this._type === ProductType.Buy && chainId !== this._data.chainId) {
    //   this.mdAlert.message = {
    //     status: 'error',
    //     content: 'Unsupported Network'
    //   };
    //   this.mdAlert.showModal();
    //   this.updateSubmitButton(false);
    //   return;
    // }
    const token = this.productInfo.token
    const balance = await getTokenBalance(token);
    if (this._type === ProductType.Buy) {
      if (this.edtQty.value && new BigNumber(this.edtQty.value).gt(this.productInfo.maxQuantity)) {
        this.mdAlert.message = {
          status: 'error',
          content: 'Quantity Greater Than Max Quantity'
        };
        this.mdAlert.showModal();
        this.updateSubmitButton(false);
        return;
      }
      if (this.productInfo.maxQuantity.gt(1) && (!this.edtQty.value || !Number.isInteger(Number(this.edtQty.value)))) {
        this.mdAlert.message = {
          status: 'error',
          content: 'Invalid Quantity'
        };
        this.mdAlert.showModal();
        this.updateSubmitButton(false);
        return;
      }
      const requireQty = this.productInfo.maxQuantity.gt(1) && this.edtQty.value ? Number(this.edtQty.value) : 1;
      if (this.productId >= 0) {
        const product = await getProductInfo(this.productId);
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
      const maxOrderQty = new BigNumber(this.productInfo.maxQuantity ?? 0);
      if (maxOrderQty.minus(requireQty).lt(0)) {
        this.mdAlert.message = {
          status: 'error',
          content: 'Over Maximum Order Quantity'
        };
        this.mdAlert.showModal();
        this.updateSubmitButton(false);
        return;
      }

      const amount = this.productInfo.price.times(requireQty);
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

  private async buyToken(quantity: number) {
    if (this.productId === undefined || this.productId === null) return;
    const callback = (error: Error, receipt?: string) => {
      if (error) {
        this.mdAlert.message = {
          status: 'error',
          content: error.message
        };
        this.mdAlert.showModal();
      }
    };
    const token = this.productInfo.token;
    if (this._data.productType == ProductType.DonateToOwner || this._data.productType == ProductType.DonateToEveryone) {
      await donate(this.productId, this.donateTo, this.edtAmount.value, this._data.commissions, token, callback,
        async () => {
          await this.updateTokenBalance();
        }
      );
    }
    else if (this._data.productType == ProductType.Buy) {
      await buyProduct(this.productId, quantity, this._data.commissions, token, callback,
        async () => {
          await this.updateTokenBalance();
          this.updateSpotsRemaining();
        }
      );
    }
  }

  render() {
    return (
      <i-panel>
        <i-scom-dapp-container id="containerDapp">
          <i-panel background={{ color: Theme.background.main }}>
            <i-grid-layout
              id='gridDApp'
              width='100%'
              height='100%'
              templateColumns={['1fr']}
              padding={{ bottom: '1.563rem' }}
            >
              <i-vstack gap="0.5rem" padding={{ top: '1.75rem', bottom: '1rem', left: '1rem', right: '1rem' }} verticalAlignment='space-between'>
                <i-vstack class="text-center" margin={{ bottom: '0.25rem' }} gap="0.5rem">
                  <i-image id='imgLogo' class={imageStyle} height={100}></i-image>
                  <i-label id='lblTitle' font={{ bold: true, size: '1.5rem' }}></i-label>
                  <i-markdown
                    id='markdownViewer'
                    class={markdownStyle}
                    width='100%'
                    height='100%'
                    margin={{ bottom: '0.563rem' }}
                  ></i-markdown>
                  {/* <i-label caption="I don't have a digital wallet" link={{ href: 'https://metamask.io/' }} opacity={0.6} font={{ size: '1rem' }}></i-label> */}
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
                  {/* <i-grid-layout
                    width='100%'
                    verticalAlignment='center'
                    padding={{ top: '1rem', bottom: '1rem' }}
                    templateColumns={['1fr', '2fr']}
                    templateRows={['auto']}
                    templateAreas={
                      [
                        ['lbNetwork', 'network']
                      ]
                    }>
                    <i-label caption="Network" grid={{ area: 'lbNetwork' }} font={{ size: '0.875rem' }} />
                    <i-scom-network-picker
                      id='networkPicker'
                      grid={{ area: 'network' }}
                      type="combobox"
                      networks={SupportedNetworks}
                      switchNetworkOnSelect={true}
                      selectedChainId={getChainId()}
                      onCustomNetworkSelected={this.onNetworkSelected}
                    />
                  </i-grid-layout> */}
                  <i-vstack gap='0.5rem' id='pnlInputFields'>
                    <i-vstack gap='0.25rem' margin={{bottom: '1rem'}}>
                      <i-hstack id='pnlQty' visible={false} horizontalAlignment='end' verticalAlignment='center' gap="0.5rem">
                        <i-label caption='Qty' font={{ size: '0.875rem' }}></i-label>
                        <i-input id='edtQty' onChanged={this.onQtyChanged.bind(this)} class={inputStyle} inputType='number' font={{ size: '0.875rem' }} border={{ radius: 4 }}></i-input>
                      </i-hstack>
                      <i-hstack horizontalAlignment='space-between' verticalAlignment='center' gap="0.5rem">
                        <i-label caption="Your donation" font={{ weight: 500, size: '1rem' }}></i-label>
                        <i-hstack horizontalAlignment='end' verticalAlignment='center' gap="0.5rem" opacity={0.6}>
                          <i-label caption='Balance:' font={{ size: '1rem' }}></i-label>
                          <i-label id='lblBalance' font={{ size: '1rem' }} caption="0.00"></i-label>
                        </i-hstack>
                      </i-hstack>
                      <i-grid-layout
                        id='gridTokenInput'
                        templateColumns={['60%', 'auto']}
                        overflow="hidden"
                        background={{ color: Theme.input.background }}
                        font={{ color: Theme.input.fontColor }}
                        height={56} width="50%"
                        margin={{left: 'auto', right: 'auto'}}
                        verticalAlignment="center"
                        class={inputGroupStyle}
                      >
                        <i-scom-nft-minter-token-selection
                          id='tokenSelection'
                          class={tokenSelectionStyle}
                          background={{ color: 'transparent' }}
                          width="100%"
                          readonly={true}
                          onSelectToken={this.selectToken.bind(this)}
                        ></i-scom-nft-minter-token-selection>
                        <i-input
                          id="edtAmount"
                          width='100%'
                          height='100%'
                          minHeight={40}
                          class={inputStyle}
                          inputType='number'
                          font={{ size: '1.25rem' }}
                          border={{ radius: 4, style: 'none' }}
                          placeholder='0.00'
                          onChanged={this.onAmountChanged.bind(this)}
                        ></i-input>
                      </i-grid-layout>
                      <i-vstack
                        horizontalAlignment="center" verticalAlignment='center'
                        gap="8px" width="50%"
                        margin={{top: '0.75rem', left: 'auto', right: 'auto'}}
                      >
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
                      <i-hstack verticalAlignment='center' gap="0.5rem">
                        <i-label id="lbOrderTotalTitle" caption='Total' font={{ size: '1rem' }}></i-label>
                        <i-icon id="iconOrderTotal" name="question-circle" fill={Theme.background.modal} width={20} height={20}></i-icon>
                      </i-hstack>
                      <i-label id='lbOrderTotal' font={{ size: '1rem' }} caption="0"></i-label>
                    </i-hstack>
                    <i-vstack gap='0.25rem' margin={{ top: '1rem' }}>
                      <i-label id='lblRef' font={{ size: '0.875rem' }} opacity={0.5}></i-label>
                      <i-label id='lblAddress' font={{ size: '0.875rem' }} overflowWrap='anywhere'></i-label>
                    </i-vstack>
                  </i-vstack>
                  <i-vstack id='pnlUnsupportedNetwork' visible={false} horizontalAlignment='center'>
                    <i-label caption='This network is not supported.' font={{ size: '1.5rem'}}></i-label>
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
            <i-scom-nft-minter-config id='configDApp' visible={false}></i-scom-nft-minter-config>
            <i-scom-nft-minter-alert id='mdAlert'></i-scom-nft-minter-alert>
          </i-panel>
        </i-scom-dapp-container>
      </i-panel>
    )
  }
}