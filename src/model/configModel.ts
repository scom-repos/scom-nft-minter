
import { Button, Form, HStack, Module, Styles, VStack } from "@ijstech/components";
import { isClientWalletConnected, State } from "../store/index";
import { BigNumber, Constants, IEventBusRegistry, Utils, Wallet } from "@ijstech/eth-wallet";
import { getBuilderSchema, getProjectOwnerSchema3 as getProjectOwnerSchema } from "../formSchema.json";
import ScomCommissionFeeSetup from "@scom/scom-commission-fee-setup";
import configData from "../data.json";
import { ICommissionInfo, IDiscountRule, IEmbedData, INetworkConfig, IProductInfo, IWalletPlugin, PaymentModel, ProductType } from "../interface/index";
import { delay, getProxySelectors, getTokenInfo, nullAddress } from "../utils/index";
import { createSubscriptionNFT, getDiscountRules, getProductId, getProductIdFromEvent, getProductInfo, newDefaultBuyProduct, updateCommissionCampaign, updateDiscountRules } from "../API";
import { CUSTOM_TOKEN } from "@scom/scom-token-input";
import { ChainNativeTokenByChainId, ITokenObject, tokenStore } from "@scom/scom-token-list";
const Theme = Styles.Theme.ThemeVars;

interface IConfigOptions {
  refreshWidget: (isDataUpdated?: boolean) => Promise<void>;
  refreshDappContainer: () => void;
  setContaiterTag: (value: any) => void;
  updateTheme: () => void;
  onChainChanged: () => Promise<void>;
  onWalletConnected: () => Promise<void>;
  connectWallet: () => Promise<void>;
  showTxStatusModal: (status: 'warning' | 'success' | 'error', content?: string | Error, exMessage?: string) => void;
  updateUIBySetData: () => Promise<void>;
}

export class ConfigModel {
  private state: State;
  private module: Module;
  private options: IConfigOptions = {
    refreshWidget: async (isDataUpdated?: boolean) => { },
    refreshDappContainer: () => { },
    setContaiterTag: (value: any) => { },
    updateTheme: () => { },
    onChainChanged: async () => { },
    onWalletConnected: async () => { },
    connectWallet: async () => { },
    showTxStatusModal: (status: 'warning' | 'success' | 'error', content?: string | Error, exMessage?: string) => { },
    updateUIBySetData: async () => { }
  };
  private _data: IEmbedData = {
    wallets: [],
    networks: [],
    defaultChainId: 0
  };
  private productInfo: IProductInfo;
  private rpcWalletEvents: IEventBusRegistry[] = [];
  private isConfigNewIndex: boolean;
  private isOnChangeUpdated: boolean;

  constructor(state: State, module: Module, options: IConfigOptions) {
    this.state = state;
    this.module = module;
    this.options = options;
    this._createProduct = this._createProduct.bind(this);
  }

  get chainId() {
    return this.state.getChainId();
  }

  get defaultChainId() {
    return this._data.defaultChainId;
  }

  set defaultChainId(value: number) {
    this._data.defaultChainId = value;
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

  get commissions() {
    return this._data.commissions ?? [];
  }

  set commissions(value: ICommissionInfo[]) {
    this._data.commissions = value;
  }

  get rpcWallet() {
    return this.state.getRpcWallet();
  }

  get nftType() {
    return this._data.nftType;
  }

  get nftAddress() {
    return this._data.nftAddress;
  }

  get newPrice() {
    return this._data.paymentModel === PaymentModel.Subscription ? this._data.perPeriodPrice : this._data.oneTimePrice;
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

  get recipients() {
    return this._data.recipients || [];
  }

  get referrer() {
    return this._data.referrer;
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

  get discountRuleId() {
    return this._data.discountRuleId;
  }

  set discountRuleId(value: number) {
    this._data.discountRuleId = value;
  }

  get chainSpecificProperties() {
    return this._data.chainSpecificProperties ?? {};
  }

  set chainSpecificProperties(value: any) {
    this._data.chainSpecificProperties = value;
  }

  get link() {
    return this._data.link ?? '';
  }

  set link(value: string) {
    this._data.link = value;
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
                duration,
                perPeriodPirce,
                oneTimePirce,
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
                duration,
                perPeriodPirce,
                oneTimePirce,
                maxQty,
                txnMaxQty,
                uri
              };

              Object.assign(this._data, generalSettings);
              await this.resetRpcWallet();
              if (builder?.setData) builder.setData(this._data);
              await this.options.refreshWidget(true);

              oldTag = JSON.parse(JSON.stringify(this.module.tag));
              if (builder?.setTag) builder.setTag(themeSettings);
              else this.setTag(themeSettings);
              this.options.setContaiterTag(themeSettings);
            },
            undo: async () => {
              this._data = JSON.parse(JSON.stringify(oldData));
              await this.options.refreshWidget(true);
              if (builder?.setData) builder.setData(this._data);

              const tag = JSON.parse(JSON.stringify(oldTag));
              this.module.tag = tag;
              if (builder?.setTag) builder.setTag(tag);
              else this.setTag(tag);
              this.options.setContaiterTag(tag);
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
      refreshUI: this.options.refreshWidget,
      connectWallet: this.options.connectWallet,
      showTxStatusModal: this.options.showTxStatusModal
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
              this.options.connectWallet();
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
              this._data.tokenToMint = this.productInfo.token.address;
              const price = Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals).toNumber();
              if (this._data.productType === ProductType.Subscription) {
                this._data.durationInDays = Math.ceil((this.productInfo.priceDuration?.toNumber() || 0) / 86400);
                this._data.perPeriodPrice = price;
              } else {
                this._data.oneTimePrice = price;
              }
            }
          }
          return true;
        },
        updateDiscountRules: async (productId: number, rules: IDiscountRule[], ruleIdsToDelete: number[] = []) => {
          return new Promise(async (resolve, reject) => {
            const callback = (err: Error, receipt?: string) => {
              if (err) {
                this.options.showTxStatusModal('error', err);
              }
            };
            const confirmationCallback = async (receipt: any) => {
              const discountRules = await getDiscountRules(this.state, productId);
              resolve(discountRules);
            };
            try {
              await updateDiscountRules(this.state, productId, rules, ruleIdsToDelete, callback, confirmationCallback);
            } catch (error) {
              this.options.showTxStatusModal('error', 'Something went wrong updating discount rule!');
              console.log('updateDiscountRules', error);
              reject(error);
            }
          });
        },
        updateCommissionCampaign: async (productId: number, commissionRate: string, affiliates: string[]) => {
          return new Promise(async (resolve, reject) => {
            const callback = (err: Error, receipt?: string) => {
              if (err) {
                this.options.showTxStatusModal('error', err);
              }
            };
            const confirmationCallback = async (receipt: any) => {
              resolve(true);
            };
            try {
              await updateCommissionCampaign(this.state, productId, commissionRate, affiliates, callback, confirmationCallback);
            } catch (error) {
              this.options.showTxStatusModal('error', 'Something went wrong updating commission campaign!');
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

  getData() {
    return this._data;
  }

  async setData(data: IEmbedData) {
    this._data = data;
    await this.options.updateUIBySetData();
  }

  getTag() {
    return this.module.tag;
  }

  setTag(value: any) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop)) {
        if (prop === 'light' || prop === 'dark')
          this.updateTag(prop, newValue[prop]);
        else
          this.module.tag[prop] = newValue[prop];
      }
    }
    this.options.setContaiterTag(this.module.tag);
    this.options.updateTheme();
  }

  private updateTag(type: 'light' | 'dark', value: any) {
    this.module.tag[type] = this.module.tag[type] ?? {};
    for (let prop in value) {
      if (value.hasOwnProperty(prop))
        this.module.tag[type][prop] = value[prop];
    }
  }

  private async updateFormConfig(isEvent?: boolean) {
    if (this.isConfigNewIndex) {
      try {
        const wrapper = this.module.parentElement?.parentElement;
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

  removeRpcWalletEvents = () => {
    const rpcWallet = this.rpcWallet;
    for (let event of this.rpcWalletEvents) {
      rpcWallet.unregisterWalletEvent(event);
    }
    this.rpcWalletEvents = [];
  }

  resetRpcWallet = async () => {
    this.removeRpcWalletEvents();
    const rpcWalletId = await this.state.initRpcWallet(this._data.chainId || this.defaultChainId);
    this.updateFormConfig();
    const rpcWallet = this.rpcWallet;
    const chainChangedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.ChainChanged, async (chainId: number) => {
      await this.options.onChainChanged();
    });
    const connectedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.Connected, async (connected: boolean) => {
      await this.updateFormConfig(true);
      this.options.onWalletConnected();
    });
    this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);
    this.options.refreshDappContainer();
  }

  initWallet = async () => {
    try {
      await Wallet.getClientInstance().init();
      await this.rpcWallet.init();
    } catch (err) {
      console.log(err);
    }
  }

  updateDataIndex = async () => {
    if (this.nftType === 'ERC721' && this._data.erc1155Index != null) this._data.erc1155Index = undefined;
    if (!this.productId && this.nftAddress && (this.nftType === 'ERC721' || this._data.erc1155Index)) {
      await this.initWallet();
      let productId = await getProductId(this.state, this.nftAddress, this._data.erc1155Index);
      if (productId) this._data.productId = productId;
    }
  }

  private getProductTypeByCode = (code: number) => {
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

  private async _createProduct(
    productMarketplaceAddress: string,
    quantity: number,
    price: string,
    uri: string,
    durationInDays?: number,
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
        (durationInDays || 1) * 86400, // per day
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
            this.options.showTxStatusModal('error', err);
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
          const price = Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals).toNumber();
          if (this._data.productType === ProductType.Subscription) {
            this._data.perPeriodPrice = price;
          } else {
            this._data.oneTimePrice = price;
          }
          this._data.tokenToMint = this.productInfo.token.address;
          this._data.durationInDays = Math.ceil((this.productInfo.priceDuration?.toNumber() || 0) / 86400);
          return resolve(true);
        }
        if (!isClientWalletConnected()) {
          this.options.connectWallet();
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
          this.options.showTxStatusModal('error', 'This network is not supported!');
          return resolve(false);
        }
        try {
          const { tokenToMint, customMintToken, uri, durationInDays } = this._data;
          const isCustomToken = tokenToMint?.toLowerCase() === CUSTOM_TOKEN.address.toLowerCase();
          if (!tokenToMint || (isCustomToken && !customMintToken)) {
            this.options.showTxStatusModal('error', 'TokenToMint is missing!');
            return resolve(false);
          }
          const tokenAddress = isCustomToken ? customMintToken : tokenToMint;
          if (tokenAddress === nullAddress || !tokenAddress.startsWith('0x')) {
            const address = tokenAddress.toLowerCase();
            const nativeToken = ChainNativeTokenByChainId[this.chainId];
            if (!address.startsWith('0x') && address !== nativeToken?.symbol.toLowerCase() && address !== 'native token') {
              this.options.showTxStatusModal('error', 'Invalid token!');
              return resolve(false);
            }
            //pay native token
            await this._createProduct(
              contract,
              maxQty,
              price,
              uri,
              durationInDays,
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
              this.options.showTxStatusModal('error', 'Invalid token!');
              return resolve(false);
            }
            await this._createProduct(
              contract,
              maxQty,
              price,
              uri,
              durationInDays,
              token,
              callback,
              confirmationCallback
            );
          }
        } catch (error) {
          this.options.showTxStatusModal('error', 'Something went wrong creating new product!');
          console.log('newProduct', error);
          resolve(false);
        }
      }
    });
  }
}