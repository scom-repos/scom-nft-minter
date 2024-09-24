import { ITokenObject, tokenStore } from "@scom/scom-token-list";
import { BigNumber } from "@ijstech/eth-contract";
import { isClientWalletConnected, State } from "../store/index";
import { ICommissionInfo, IDiscountRule, IOswapTroll, IProductInfo, ProductType } from "../interface/index";
import { getTokenBalance, getTokenInfo, registerSendTxEvents } from "../utils/index";
import { buyProduct, donate, fetchOswapTrollNftInfo, fetchUserNftBalance, getDiscountRules, getNFTBalance, getProductInfo, getProxyTokenAmountIn, mintOswapTrollNft, renewSubscription, subscribe } from "../API";
import { Utils } from "@ijstech/eth-wallet";
import { ConfigModel } from "./configModel";

interface INFTMinterOptions {
  updateSubmitButton: (submitting?: boolean) => void;
  showTxStatusModal: (status: 'warning' | 'success' | 'error', content?: string | Error, exMessage?: string) => void;
  closeTxStatusModal: () => void;
  onMintedNft: (oswapTroll: IOswapTroll, nftBalance: string) => void;
  onDonated: () => Promise<void>;
  onSubscribed: (nftBalance: string) => void;
  onBoughtProduct: (nftBalance: string) => Promise<void>;
}

export class NFTMinterModel {
  private state: State;
  private options: INFTMinterOptions = {
    updateSubmitButton: async (submitting?: boolean) => { },
    showTxStatusModal: (status: 'warning' | 'success' | 'error', content?: string | Error, exMessage?: string) => { },
    closeTxStatusModal: () => { },
    onMintedNft: (oswapTroll: IOswapTroll, nftBalance: string) => { },
    onDonated: async () => { },
    onSubscribed: (nftBalance: string) => { },
    onBoughtProduct: async (nftBalance: string) => { }
  }
  private _productInfo: IProductInfo;
  private _oswapTrollInfo: IOswapTroll;
  private _discountRules: IDiscountRule[];
  private _discountApplied: IDiscountRule;
  private _cap: number;
  private _isRenewal: boolean;
  private _tokenAmountIn: string;

  constructor(state: State, options: INFTMinterOptions) {
    this.state = state;
    this.options = options;
  }

  get rpcWallet() {
    return this.state.getRpcWallet();
  }

  get chainId() {
    return this.state.getChainId();
  }

  set productInfo(value: IProductInfo) {
    this._productInfo = value;
  }

  get productInfo() {
    return this._productInfo;
  }

  get discountRules() {
    return this._discountRules || [];
  }

  set discountRules(value: IDiscountRule[]) {
    this._discountRules = value;
  }

  get oswapTrollInfo() {
    return this._oswapTrollInfo;
  }

  get tokenSymbol() {
    return this._productInfo?.token?.symbol || '';
  }

  get cap() {
    return this._cap;
  }

  get isRenewal() {
    return this._isRenewal;
  }

  set isRenewal(value: boolean) {
    this._isRenewal = value;
  }

  get discountApplied() {
    return this._discountApplied;
  }

  set discountApplied(value: IDiscountRule) {
    this._discountApplied = value;
  }

  get tokenAmountIn() {
    return this._tokenAmountIn;
  }

  updateTokenAmountIn = (qty: number, commissions: ICommissionInfo[], value?: string) => {
    if (value) {
      this._tokenAmountIn = value;
      return;
    }
    if (!qty) {
      this._tokenAmountIn = '0';
      return;
    }
    const { token, price } = this.productInfo;
    const productPrice = Utils.fromDecimals(price, token.decimals);
    this._tokenAmountIn = getProxyTokenAmountIn(productPrice.toFixed(), qty, commissions);
  }

  updateDiscount = (duration: number, startDate: any, days: number) => {
    this.discountApplied = undefined;
    if (!this.discountRules?.length || !duration || !startDate) return;
    const price = Utils.fromDecimals(this.productInfo.price, this.productInfo.token.decimals);
    const startTime = startDate.value.unix();
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

  getTokenBalance = async (_token?: ITokenObject) => {
    const token = _token || this.productInfo?.token || this.oswapTrollInfo?.token;
    if (!token) return;
    let balance = new BigNumber(0);
    try {
      balance = await getTokenBalance(this.rpcWallet, token);
    } catch { }
    return balance;
  }

  fetchOswapTrollNftInfo = async (nftAddress: string) => {
    const oswapTroll = await fetchOswapTrollNftInfo(this.state, nftAddress);
    if (!oswapTroll) {
      this._oswapTrollInfo = null;
      return null;
    }
    const nftBalance = isClientWalletConnected() ? await fetchUserNftBalance(this.state, nftAddress) : 0;
    const { price, cap, tokenAddress } = oswapTroll;
    let token = tokenStore.getTokenList(this.chainId).find(v => v.address === tokenAddress);
    if (!token) {
      token = await getTokenInfo(tokenAddress, this.chainId);
    }
    const info = {
      price,
      cap,
      tokenAddress,
      token,
      nftBalance
    }
    this._oswapTrollInfo = info;
    this._cap = cap.toNumber();
    return info;
  }

  fetchProductInfo = async (productId: number, type: ProductType, isDataUpdated?: boolean) => {
    const info = await getProductInfo(this.state, productId);
    this._productInfo = info;
    if (isDataUpdated && type === ProductType.Subscription) {
      await this.fetchDiscountRules(productId);
    }
  }

  fetchDiscountRules = async (productId: number) => {
    this._discountRules = await getDiscountRules(this.state, productId);
  }

  fetchNftBalance = async (productId: number) => {
    const nftBalance = isClientWalletConnected() ? await getNFTBalance(this.state, productId) : 0;
    return nftBalance;
  }

  getProductInfo = async (productId: number) => {
    if (!productId || !this.productInfo) return null;
    if (this.productInfo.productId.isEqualTo(productId)) return this.productInfo;
    try {
      const productInfo = await getProductInfo(this.state, productId);
      return productInfo;
    } catch {
      return null;
    }
  }

  doSubmitAction = async (
    configModel: ConfigModel,
    token: ITokenObject,
    tokenValue: string,
    qty: string,
    startDate: any,
    duration: any,
    days: number
  ) => {
    const { productId, nftType, productType, nftAddress } = configModel;
    if (!configModel.getData() || (!productId && nftType !== 'ERC721')) return;
    this.options.updateSubmitButton(true);
    if ((productType === ProductType.DonateToOwner || productType === ProductType.DonateToEveryone) && !token) {
      this.options.showTxStatusModal('error', 'Token Required');
      this.options.updateSubmitButton(false);
      return;
    }
    if (nftType === 'ERC721' && !productId) {
      const oswapTroll = await this.fetchOswapTrollNftInfo(nftAddress);
      if (!oswapTroll || oswapTroll.cap.lte(0)) {
        this.options.showTxStatusModal('error', 'Out of stock');
        this.options.updateSubmitButton(false);
        return;
      }
      const token = this.oswapTrollInfo.token;
      const balance = await this.getTokenBalance(token);
      if (oswapTroll.price.gt(balance)) {
        this.options.showTxStatusModal('error', `Insufficient ${token.symbol} Balance`);
        this.options.updateSubmitButton(false);
        return;
      }
      await this.mintNft(nftAddress);
      return;
    }
    const balance = await getTokenBalance(this.rpcWallet, this.productInfo.token);
    try {
      const { maxQuantity, price } = this.productInfo;
      if (productType === ProductType.Buy) {
        if (qty && new BigNumber(qty).gt(maxQuantity)) {
          this.options.showTxStatusModal('error', 'Quantity Greater Than Max Quantity');
          this.options.updateSubmitButton(false);
          return;
        }
        if (maxQuantity.gt(1) && (!qty || !Number.isInteger(Number(qty)))) {
          this.options.showTxStatusModal('error', 'Invalid Quantity');
          this.options.updateSubmitButton(false);
          return;
        }
        const requireQty = maxQuantity.gt(1) && qty ? Number(qty) : 1;
        if (productId >= 0) {
          const product = await getProductInfo(this.state, productId);
          if (product.quantity.lt(requireQty)) {
            this.options.showTxStatusModal('error', 'Out of stock');
            this.options.updateSubmitButton(false);
            return;
          }
        }
        const maxOrderQty = new BigNumber(maxQuantity ?? 0);
        if (maxOrderQty.minus(requireQty).lt(0)) {
          this.options.showTxStatusModal('error', 'Over Maximum Order Quantity');
          this.options.updateSubmitButton(false);
          return;
        }

        const amount = price.times(requireQty).shiftedBy(-token.decimals);
        if (balance.lt(amount)) {
          this.options.showTxStatusModal('error', `Insufficient ${token.symbol} Balance`);
          this.options.updateSubmitButton(false);
          return;
        }
        await this.buyToken(configModel, tokenValue, startDate, days, requireQty);
      } else if (productType === ProductType.Subscription) {
        if (!startDate) {
          this.options.showTxStatusModal('error', 'Start Date Required');
          this.options.updateSubmitButton(false);
          return;
        }
        const _duration = Number(duration) || 0;
        if (!_duration || _duration <= 0 || !Number.isInteger(_duration)) {
          this.options.showTxStatusModal('error', !duration ? 'Duration Required' : 'Invalid Duration');
          this.options.updateSubmitButton(false);
          return;
        }
        await this.buyToken(configModel, tokenValue, startDate, days);
      } else {
        if (!tokenValue) {
          this.options.showTxStatusModal('error', 'Amount Required');
          this.options.updateSubmitButton(false);
          return;
        }
        if (balance.lt(tokenValue)) {
          this.options.showTxStatusModal('error', `Insufficient ${token.symbol} Balance`);
          this.options.updateSubmitButton(false);
          return;
        }
        await this.buyToken(configModel, tokenValue, startDate, days);
      }
      this.options.updateSubmitButton(false);
      this.options.closeTxStatusModal();
    } catch (error) {
      this.options.showTxStatusModal('error', error);
      this.options.updateSubmitButton(false);
    }
  }

  private async mintNft(nftAddress: string) {
    const txHashCallback = (err: Error, receipt?: string) => {
      if (err) {
        this.options.showTxStatusModal('error', err);
        this.options.updateSubmitButton(false);
      }
    }
    const confirmationCallback = async (receipt: any) => {
      const oswapTroll = await fetchOswapTrollNftInfo(this.state, nftAddress);
      if (oswapTroll) {
        this._cap = oswapTroll.cap.toNumber();
      }
      const nftBalance = await fetchUserNftBalance(this.state, nftAddress);
      this.options.onMintedNft(oswapTroll, nftBalance);
    }
    registerSendTxEvents({
      transactionHash: txHashCallback,
      confirmation: confirmationCallback
    });

    await mintOswapTrollNft(nftAddress, txHashCallback);
  }

  private async buyToken(
    configModel: ConfigModel,
    tokenValue: string,
    startDate: any,
    days: number,
    quantity?: number
  ) {
    const { productId, productType, recipient, referrer, commissions } = configModel;
    if (!productId) return;
    const callback = (error: Error, receipt?: string) => {
      if (error) {
        this.options.showTxStatusModal('error', error);
      }
    };
    const token = this.productInfo.token;
    if (productType == ProductType.DonateToOwner || productType == ProductType.DonateToEveryone) {
      await donate(this.state, productId, recipient, tokenValue, commissions, token, callback,
        async () => {
          await this.options.onDonated();
        }
      );
    }
    else if (productType === ProductType.Subscription) {
      const startTime = startDate.unix();
      const duration = days * 86400;
      const confirmationCallback = async () => {
        this.productInfo = await getProductInfo(this.state, productId);
        const nftBalance = await getNFTBalance(this.state, productId);
        this.options.onSubscribed(nftBalance);
      };
      if (this.isRenewal) {
        await renewSubscription(this.state, productId, duration, recipient, this.discountApplied?.id ?? 0, callback, confirmationCallback);
      } else {
        await subscribe(this.state, productId, startTime, duration, recipient, referrer, this.discountApplied?.id ?? 0, callback, confirmationCallback);
      }
    }
    else if (productType == ProductType.Buy) {
      await buyProduct(this.state, productId, quantity, commissions, token, callback,
        async () => {
          this.productInfo = await getProductInfo(this.state, productId);
          const nftBalance = await getNFTBalance(this.state, productId);
          this.options.onBoughtProduct(nftBalance);
        }
      );
    }
  }
}