import {
  Module,
  customModule,
  GridLayout,
  Markdown,
  Image,
  Label,
  Styles,
  HStack,
  Input,
  Button,
  Container
} from '@ijstech/components';
import { BigNumber, Utils, Wallet, WalletPlugin } from '@ijstech/eth-wallet';
import { IConfig, ITokenObject, PageBlock, dappType } from '@modules/interface';
import { getTokenBalance, registerSendTxEvents } from '@modules/utils';
import { getContractAddress, getNetworkName, setDataFromSCConfig } from '@modules/store';
import { connectWallet, getChainId, hasWallet } from '@modules/wallet';
import Config from '@modules/config';
import { TokenSelection } from '@modules/token-selection';
import { imageStyle, inputStyle, markdownStyle, tokenSelectionStyle } from './index.css';
import { Alert } from '@modules/alert';
import { buyProduct, getNFTBalance, getProductInfo, newProduct } from './API';

const Theme = Styles.Theme.ThemeVars;

@customModule
export default class Main extends Module implements PageBlock {
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
  private lblRef: Label;
  private lblAddress: Label;
  private gridTokenInput: GridLayout;
  private tokenSelection: TokenSelection;
  private edtAmount: Input;
  private configDApp: Config;
  private mdAlert: Alert;

  private _type: dappType | undefined;
  private _productId: number | undefined;
  private _data: IConfig = {};
  tag: any;
  defaultEdit: boolean = true;
  readonly onConfirm: () => Promise<void>;
  readonly onDiscard: () => Promise<void>;
  readonly onEdit: () => Promise<void>;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    if (options) {
      setDataFromSCConfig(options);
    }
  }
  
  getData() {
    return this._data;
  }

  async setData(data: IConfig) {
    this._data = data;
    this._productId = data.productId;
    this.configDApp.data = data;
    this.refreshDApp();
  }

  getTag() {
    return this.tag;
  }

  async setTag(value: any) {
    this.tag = value;
  }

  async edit() {
    this.gridDApp.visible = false;
    this.configDApp.visible = true;
  }

  async confirm() {
    this.gridDApp.visible = true;
    this.configDApp.visible = false;
    this._data = this.configDApp.data;
    this._data.chainId = this._data.token ? getChainId() : undefined;
    this._data.productId = this._productId;
    this.refreshDApp();
    await this.newProduct(undefined, this.updateSpotsRemaining);
  }
  
  private newProduct = async (callback?: any, confirmationCallback?: any) => {
    if (
      this._data.qty === undefined ||
      this._data.qty === null ||
      this._data.price === undefined ||
      this._data.price === null ||
      this._data.productId >= 0
    ) return;
    const result = await newProduct(this._data.qty, this._data.price, this._data.token, callback, confirmationCallback);
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
      data.price === undefined ||
      data.price === null ||
      data.maxOrderQty === undefined ||
      data.maxOrderQty === null ||
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
    this._type = this._data.dappType;
    this.imgLogo.url = this._data.logo;
    this.markdownViewer.load(this._data.description || '');
    this.pnlLink.visible = !!this._data.link;
    this.lblLink.caption = this._data.link || '';
    this.lblLink.link.href = this._data.link;
    if (this._type === 'donation') {
      this.lblTitle.caption = new BigNumber(this._data.price).isZero() ? 'Make a Contributon' : '';
      this.btnSubmit.caption = 'Submit';
      this.lblRef.caption = new BigNumber(this._data.price).isZero() ? 'All proceeds will go to following vetted wallet address:' : '';
      this.gridTokenInput.visible = true;
    } else {
      this.lblTitle.caption = `Mint Fee: ${this._data.price} ${this._data.token?.symbol || ""}`;
      this.btnSubmit.caption = 'Mint';
      this.lblRef.caption = 'smart contract:';
      if (this._data.chainId !== null && this._data.chainId !== undefined) {
        this.lblBlockchain.caption = getNetworkName(this._data.chainId) || this._data.chainId.toString();
      } else {
        this.lblBlockchain.caption = "";
      }
      await this.updateSpotsRemaining();
      this.gridTokenInput.visible = false;
    }
    this.edtQty.value = "";
    this.edtAmount.value = "";
    this.pnlSpotsRemaining.visible = new BigNumber(this._data.price).gt(0);
    this.pnlBlockchain.visible = new BigNumber(this._data.price).gt(0);
    this.pnlQty.visible = new BigNumber(this._data.price).gt(0) && this._data.maxOrderQty > 1;
    this.lblAddress.caption = getContractAddress('ProductInfo');
    this.tokenSelection.readonly = this._data.token ? true : new BigNumber(this._data.price).gt(0);
    this.tokenSelection.token = this._data.token;
    this.lblBalance.caption = (await getTokenBalance(this._data.token)).toFixed(2);
  }

  private updateSpotsRemaining = async () => {
    if (this._data.productId >= 0) {
      const product = await getProductInfo(this._data.productId);
      this.lblSpotsRemaining.caption = `${product.quantity.toFixed()}/${this._data.qty??0}`;
    } else {
      this.lblSpotsRemaining.caption = `${this._data.qty??0}/${this._data.qty??0}`;
    }
  }

  init() {
    super.init();
    this.initWalletData();
  }

  private async initWalletData() {
    const selectedProvider = localStorage.getItem('walletProvider') as WalletPlugin;
    const isValidProvider = Object.values(WalletPlugin).includes(selectedProvider);
    if (hasWallet() && isValidProvider) {
      await connectWallet(selectedProvider);
    }
  }

  private async selectToken(token: ITokenObject) {
    this.lblBalance.caption = (await getTokenBalance(token)).toFixed(2);
  }

  private udpateSubmitButton(submitting: boolean) {
    this.btnSubmit.rightIcon.spin = submitting;
    this.btnSubmit.rightIcon.visible = submitting;
  }

  private async onSubmit() {
    if (!this._data || !this._productId) return;
    this.udpateSubmitButton(true);
    const chainId = getChainId();
    const wallet = Wallet.getInstance();
    if (this._type === 'donation' && !this.tokenSelection.token) {
      this.mdAlert.message = {
        status: 'error',
        content: 'Token Required'
      };
      this.mdAlert.showModal();
      this.udpateSubmitButton(false);
      return;
    }
    if (this._type === 'nft-minter' && chainId !== this._data.chainId) {
      this.mdAlert.message = {
        status: 'error',
        content: 'Unsupported Network'
      };
      this.mdAlert.showModal();
      this.udpateSubmitButton(false);
      return;
    }
    const balance = await getTokenBalance(this._type === 'donation' ? this.tokenSelection.token : this._data.token);
    if (this._type === 'nft-minter') {
      if (this.edtQty.value && Number(this.edtQty.value) > this._data.maxOrderQty) {
        this.mdAlert.message = {
          status: 'error',
          content: 'Quantity Greater Than Max Quantity'
        };
        this.mdAlert.showModal();
        this.udpateSubmitButton(false);
        return;
      }
      if (this._data.maxOrderQty > 1 && (!this.edtQty.value || !Number.isInteger(Number(this.edtQty.value)))) {
        this.mdAlert.message = {
          status: 'error',
          content: 'Invalid Quantity'
        };
        this.mdAlert.showModal();
        this.udpateSubmitButton(false);
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
          this.udpateSubmitButton(false);
          return;
        }
      }
      const tokenBalance = await getNFTBalance(this._productId);
      if (this._data.maxOrderQty && tokenBalance.gte(this._data.maxOrderQty - requireQty)) {
        this.mdAlert.message = {
          status: 'error',
          content: 'Over Maximum Order Quantity'
        };
        this.mdAlert.showModal();
        this.udpateSubmitButton(false);
        return;
      }

      const amount = new BigNumber(this._data.price).times(requireQty);
      if (balance.lt(amount)) {
        this.mdAlert.message = {
          status: 'error',
          content: `Insufficient ${this.tokenSelection.token.symbol} Balance`
        };
        this.mdAlert.showModal();
        this.udpateSubmitButton(false);
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
        this.udpateSubmitButton(false);
        return;
      }
      if (balance.lt(this.edtAmount.value)) {
        this.mdAlert.message = {
          status: 'error',
          content: `Insufficient ${this.tokenSelection.token.symbol} Balance`
        };
        this.mdAlert.showModal();
        this.udpateSubmitButton(false);
        return;
      }
      await this.buyToken(1);
    }
    this.udpateSubmitButton(false);
  }

  buyToken = async (quantity: number) => {
    if (this._data.productId === undefined || this._data.productId === null) return;
    await buyProduct(this._data.productId, quantity, this._data.commissions, this._data.token);
  }

  render() {
    return (
      <i-panel>
        <i-grid-layout
          id='gridDApp'
          width='100%'
          height='100%'
          templateColumns={['60%', 'auto']}
        >
          <i-vstack padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}>
            <i-hstack horizontalAlignment='center'>
              <i-image id='imgLogo' class={imageStyle} height={100}></i-image>
            </i-hstack>
            <i-markdown
              id='markdownViewer'
              class={markdownStyle}
              width='100%'
              height='100%'
            ></i-markdown>
            <i-hstack id='pnlLink' visible={false} verticalAlignment='center' gap='0.25rem'>
              <i-label caption='Details here: ' font={{ size: '0.875rem' }}></i-label>
              <i-label id='lblLink' font={{ size: '0.875rem' }}></i-label>
            </i-hstack>
          </i-vstack>
          <i-vstack gap="0.5rem" padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }} background={{ color: '#f1f1f1' }} verticalAlignment='space-between'>
            <i-vstack>
              <i-label id='lblTitle' font={{ bold: true, size: '1rem' }}></i-label>
              <i-label caption="I don't have a digital wallet" font={{ size: '0.8125rem' }} link={{ href: 'https://metamask.io/' }}></i-label>
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
                  <i-input id='edtQty' class={inputStyle} inputType='number' font={{ size: '0.875rem' }} border={{ radius: 4 }}></i-input>
                </i-hstack>
                <i-hstack horizontalAlignment='end' verticalAlignment='center' gap="0.5rem">
                  <i-label caption='Balance:' font={{ size: '0.875rem' }}></i-label>
                  <i-label id='lblBalance' font={{ size: '0.875rem' }}></i-label>
                </i-hstack>
                <i-grid-layout id='gridTokenInput' templateColumns={['60%', 'auto']} border={{ radius: 5 }} overflow="hidden">
                  <nft-minter-token-selection
                    id='tokenSelection'
                    class={tokenSelectionStyle}
                    background={{ color: '#fff' }}
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
                    font={{ size: '0.875rem' }}
                  ></i-input>
                </i-grid-layout>
                <i-button
                  id='btnSubmit'
                  width='100px'
                  caption='Submit'
                  padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                  margin={{ left: 'auto', right: 'auto' }}
                  font={{ size: '0.875rem', color: Theme.colors.primary.contrastText }}
                  rightIcon={{ visible: false, fill: Theme.colors.primary.contrastText }}
                  onClick={this.onSubmit.bind(this)}
                ></i-button>
              </i-vstack>
              <i-vstack gap='0.25rem'>
                <i-label id='lblRef' font={{ size: '0.75rem' }}></i-label>
                <i-label id='lblAddress' font={{ size: '0.75rem' }} overflowWrap='anywhere'></i-label>
              </i-vstack>
              <i-label caption='Terms & Condition' font={{ size: '0.75rem' }} link={{ href: 'https://docs.scom.dev/' }}></i-label>
            </i-vstack>
          </i-vstack>
        </i-grid-layout>
        <nft-minter-config id='configDApp' visible={false}></nft-minter-config>
        <nft-minter-alert id='mdAlert'></nft-minter-alert>
      </i-panel>
    )
  }
}