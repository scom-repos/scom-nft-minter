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
  ControlElement,
  Icon,
} from '@ijstech/components';
import { } from '@ijstech/eth-contract';
import { BigNumber, Constants, IEventBusRegistry, Utils, Wallet } from '@ijstech/eth-wallet';
import { IChainSpecificProperties, IEmbedData, INetworkConfig, IProductInfo, IWalletPlugin, ProductType } from './interface/index';
import { getERC20ApprovalModelAction, getTokenBalance, IERC20ApprovalAction } from './utils/index';
import { EventId, getEmbedderCommissionFee, getContractAddress, getIPFSGatewayUrl, setDataFromSCConfig, initRpcWallet, getRpcWallet, getChainId } from './store/index';
import { imageStyle, inputStyle, markdownStyle, tokenSelectionStyle, inputGroupStyle } from './index.css';
import { buyProduct, donate, getProductInfo, getProxyTokenAmountIn, newProduct } from './API';
import configData from './data.json';
import ScomDappContainer from '@scom/scom-dapp-container';
import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
import { ITokenObject } from '@scom/scom-token-list';
import ScomTxStatusModal from '@scom/scom-tx-status-modal';
import ScomTokenInput from '@scom/scom-token-input';
import formSchema from './formSchema.json';

interface ScomNftMinterElement extends ControlElement {
  lazyLoad?: boolean;
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
  private tokenInput: ScomTokenInput;
  private txStatusModal: ScomTxStatusModal;
  private lbOrderTotal: Label;
  private lbOrderTotalTitle: Label;
  private iconOrderTotal: Icon;
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
  private rpcWalletEvents: IEventBusRegistry[] = [];
  private clientEvents: any[] = [];

  constructor(parent?: Container, options?: ScomNftMinterElement) {
    super(parent, options);
    setDataFromSCConfig(configData);
    this.$eventBus = application.EventBus;
    this.registerEvent();
  }

  onHide() {
    this.containerDapp.onHide();
    const rpcWallet = getRpcWallet();
    for (let event of this.rpcWalletEvents) {
      rpcWallet.unregisterWalletEvent(event);
    }
    this.rpcWalletEvents = [];
    for (let event of this.clientEvents) {
      event.unregister();
    }
    this.clientEvents = [];
  }

  async init() {
    this.isReadyCallbackQueued = true;
    super.init();
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      const link = this.getAttribute('link', true);
      const productType = this.getAttribute('productType', true);
      const name = this.getAttribute('name', true);
      const title = this.getAttribute('title', true);
      const description = this.getAttribute('description', true);
      const logo = this.getAttribute('logo', true);
      const logoUrl = this.getAttribute('logoUrl', true);
      const chainSpecificProperties = this.getAttribute('chainSpecificProperties', true);
      const networks = this.getAttribute('networks', true);
      const wallets = this.getAttribute('wallets', true);
      const showHeader = this.getAttribute('showHeader', true);
      const defaultChainId = this.getAttribute('defaultChainId', true);
      await this.setData({
        link,
        productType,
        name,
        title,
        chainSpecificProperties,
        defaultChainId,
        description,
        logo,
        logoUrl,
        networks,
        wallets,
        showHeader,
      });
    }
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
    this.clientEvents.push(this.$eventBus.register(this, EventId.chainChanged, this.onChainChanged));
  }

  private onChainChanged = async () => {
    this.onSetupPage();
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

  private async onSetupPage() {
    await this.initApprovalAction();
  }

  private _getActions(category?: string) {
    let self = this;
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
              fee: getEmbedderCommissionFee(),
              networks: self._data.networks
            });
            const button = new Button(null, {
              caption: 'Confirm',
            });
            vstack.append(config);
            vstack.append(button);
            button.onClick = async () => {
              const commissions = config.commissions;
              if (onConfirm) onConfirm(true, { commissions });
            }
            return vstack;
          }
        }
      }
    ]
    if (category && category !== 'offers') {
      actions.push({
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
              Object.assign(this._data, {
                name: userInputData.name,
                title: userInputData.title,
                productType: userInputData.productType,
                logo: userInputData.logo,
                logoUrl: userInputData.logoUrl,
                description: userInputData.description,
                link: userInputData.link
              })
              if (builder?.setData) builder.setData(this._data);
              this.refreshDApp();
              // await this.newProduct((error: Error, receipt?: string) => {
              //   if (error) {
              //     this.showTxStatusModal('error', error);
              //   }
              // }, this.updateSpotsRemaining);
            },
            undo: () => {
              this._data = { ..._oldData };
              this.refreshDApp();
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: formSchema.general.dataSchema
      });

      actions.push({
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
        userInputDataSchema: formSchema.theme.dataSchema
      })
    }
    return actions;
  }

  getConfigurators() {
    let self = this;
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: (category?: string) => {
          return this._getActions(category);
        },
        getData: this.getData.bind(this),
        setData: async (data: IEmbedData) => {
          const defaultData = configData.defaultBuilderData;
          await this.setData({ ...defaultData, ...data });
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
          const fee = getEmbedderCommissionFee();
          return { ...this.getData(), fee }
        },
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
    const rpcWalletId = await initRpcWallet(this.defaultChainId);
    const rpcWallet = getRpcWallet();
    const event = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.Connected, async (connected: boolean) => {
      this.onSetupPage();
      this.updateContractAddress();
      this.refreshDApp();
    });
    this.rpcWalletEvents.push(event);

    const dappData = {
      wallets: this.wallets,
      networks: this.networks,
      showHeader: this.showHeader,
      defaultChainId: this.defaultChainId,
      rpcWalletId: rpcWallet.instanceId
    }
    if (this.containerDapp?.setData) this.containerDapp.setData(dappData);
    if (!this.tokenInput.isConnected) await this.tokenInput.ready();
    if (this.tokenInput.rpcWalletId !== rpcWallet.instanceId) {
      this.tokenInput.rpcWalletId = rpcWallet.instanceId;
    }
    await this.onSetupPage();
    const commissionFee = getEmbedderCommissionFee();
    if (!this.lbOrderTotalTitle.isConnected) await this.lbOrderTotalTitle.ready();
    this.lbOrderTotalTitle.caption = `Total`;
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

  private async initWallet() {
    try {
      await Wallet.getClientInstance().init();
      const rpcWallet = getRpcWallet();
      await rpcWallet.init();
    } catch { }
  }

  private async updateDAppUI(data: IEmbedData) {
    this.markdownViewer.load(data.description || '');
    this.pnlLink.visible = !!data.link;
    (!this.lblLink.isConnected) && await this.lblLink.ready();
    this.lblLink.caption = data.link || '';
    this.lblLink.link.href = data.link;
    if (data.logo) {
      this.imgLogo.url = getIPFSGatewayUrl() + data.logo;
    } else if (data.logoUrl?.startsWith('ipfs://')) {
      const ipfsGatewayUrl = getIPFSGatewayUrl();
      this.imgLogo.url = data.logoUrl.replace('ipfs://', ipfsGatewayUrl);
    }
    else {
      this.imgLogo.url = data.logoUrl || "";
    }
    (!this.lblTitle.isConnected) && await this.lblTitle.ready();
    this.lblTitle.caption = data.title || '';
  }

  private async refreshDApp() {
    setTimeout(async () => {
      this._type = this._data.productType;
      let tmpData = JSON.parse(JSON.stringify(this._data));
      if (!this._data.title && !this._data.description && !this._data.logo && !this._data.logoUrl && !this._data.link) {
        Object.assign(tmpData, {
          title: "Title",
          description: "#### Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          logoUrl: "https://placehold.co/600x400?text=No+Image"
        })
      }
      await this.updateDAppUI(tmpData);
      if (!this.productId || this.productId === 0) return;
      await this.initWallet();
      this.productInfo = await getProductInfo(this.productId);
      if (this.productInfo) {
        const token = this.productInfo.token;
        this.pnlInputFields.visible = true;
        this.pnlUnsupportedNetwork.visible = false;
        const price = Utils.fromDecimals(this.productInfo.price, token.decimals).toFixed();
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
        this.tokenInput.value = "";
        this.lbOrderTotal.caption = "0";
        this.pnlSpotsRemaining.visible = new BigNumber(price).gt(0);
        this.pnlBlockchain.visible = new BigNumber(price).gt(0);
        this.pnlQty.visible = new BigNumber(price).gt(0) && this.productInfo.maxQuantity.gt(1);
        (!this.lblAddress.isConnected) && await this.lblAddress.ready();
        this.lblAddress.caption = this.contractAddress;
        // this.tokenInput.tokenReadOnly = this._data.token ? true : new BigNumber(price).gt(0);
        this.tokenInput.token = token;
        this.updateTokenBalance();
        // this.lblBalance.caption = (await getTokenBalance(this._data.token)).toFixed(2);
      }
      else {
        this.pnlInputFields.visible = false;
        this.pnlUnsupportedNetwork.visible = true;
      }
    });
  }

  private updateSpotsRemaining() {
    if (this.productId >= 0) {
      this.lblSpotsRemaining.caption = `${this.productInfo.quantity.toFixed()}`;
    } else {
      this.lblSpotsRemaining.caption = '';
    }
  }

  private showTxStatusModal(status: 'warning' | 'success' | 'error', content?: string | Error) {
    if (!this.txStatusModal) return;
    let params: any = { status };
    if (status === 'success') {
      params.txtHash = content;
    } else {
      params.content = content;
    }
    this.txStatusModal.message = { ...params };
    this.txStatusModal.showModal();
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
        },
        onPayingError: async (err: Error) => {
          this.showTxStatusModal('error', err);
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
    this.showTxStatusModal('warning', 'Approving');
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
    let amount = Number(this.tokenInput.value);
    if (amount === 0 || !this.productInfo) {
      this.tokenAmountIn = '0';
      this.tokenInput.value = '0';
    }
    else {
      this.tokenAmountIn = getProxyTokenAmountIn(this.productInfo.price.toFixed(), amount, this._data.commissions);
    }
    amount = Number(this.tokenInput.value);
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
    const token = this.productInfo.token
    const balance = await getTokenBalance(token);
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
        const product = await getProductInfo(this.productId);
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

      const amount = this.productInfo.price.times(requireQty);
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
  }

  private async onSubmit() {
    this.showTxStatusModal('warning', 'Confirming');
    this.approvalModelAction.doPayAction();
  }

  private async buyToken(quantity: number) {
    if (this.productId === undefined || this.productId === null) return;
    const callback = (error: Error, receipt?: string) => {
      if (error) {
        this.showTxStatusModal('error', error);
      }
    };
    const token = this.productInfo.token;
    if (this._data.productType == ProductType.DonateToOwner || this._data.productType == ProductType.DonateToEveryone) {
      await donate(this.productId, this.donateTo, this.tokenInput.value, this._data.commissions, token, callback,
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
                  <i-vstack gap='0.5rem' id='pnlInputFields'>
                    <i-vstack gap='0.25rem' margin={{ bottom: '1rem' }}>
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
                        templateColumns={['100%']}
                        overflow="hidden"
                        background={{ color: Theme.input.background }}
                        font={{ color: Theme.input.fontColor }}
                        height={56} width="50%"
                        margin={{ left: 'auto', right: 'auto' }}
                        verticalAlignment="center"
                        class={inputGroupStyle}
                      >
                        <i-scom-token-input
                          id="tokenInput"
                          tokenReadOnly={true}
                          isBtnMaxShown={false}
                          isCommonShown={false}
                          isBalanceShown={false}
                          isSortBalanceShown={false}
                          class={tokenSelectionStyle}
                          width="100%"
                          height="100%"
                          placeholder="0.00"
                          onSelectToken={this.selectToken}
                          onInputAmountChanged={this.onAmountChanged}
                        />
                      </i-grid-layout>
                      <i-vstack
                        horizontalAlignment="center" verticalAlignment='center'
                        gap="8px" width="50%"
                        margin={{ top: '0.75rem', left: 'auto', right: 'auto' }}
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
                    <i-label caption='This network is not supported.' font={{ size: '1.5rem' }}></i-label>
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
            <i-scom-commission-fee-setup visible={false} />
            <i-scom-tx-status-modal id="txStatusModal" />
          </i-panel>
        </i-scom-dapp-container>
      </i-panel>
    )
  }
}