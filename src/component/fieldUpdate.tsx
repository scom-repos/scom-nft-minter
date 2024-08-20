import {
  customElements,
  ControlElement,
  Styles,
  Module,
  Container,
  Input,
  Button,
  Form,
} from '@ijstech/components';
import { formInputStyle } from '../index.css';
import { IEmbedData } from '../interface/index';
import { getProductInfo, getProductOwner, updateProductPrice, updateProductUri } from '../API';
import { isClientWalletConnected, State } from '../store/index';
import { Constants, IEventBusRegistry, Wallet } from '@ijstech/eth-wallet';
import { registerSendTxEvents } from '../utils/index';

const Theme = Styles.Theme.ThemeVars;

interface ScomNftMinterFieldUpdateElement extends ControlElement {
  refreshUI: () => void;
  connectWallet: () => void;
  showTxStatusModal: (status: 'warning' | 'success' | 'error', content?: string | Error) => void;
  state: State;
  value: string;
  isUri?: boolean;
}


declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-nft-minter-field-update']: ScomNftMinterFieldUpdateElement;
    }
  }
}

@customElements('i-scom-nft-minter-field-update')
export class ScomNftMinterFieldUpdate extends Module {
  private state: State;
  private inputField: Input;
  private btnUpdate: Button;
  private isUri: boolean;
  refreshUI: () => void;
  connectWallet: () => void;
  showTxStatusModal: (status: 'warning' | 'success' | 'error', content?: string | Error, exMessage?: string) => void;

  private rpcWalletEvents: IEventBusRegistry[] = [];

  static async create(options?: ScomNftMinterFieldUpdateElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  constructor(parent?: Container, options?: ScomNftMinterFieldUpdateElement) {
    super(parent, options);
  }

  get value() {
    return this.inputField?.value || '';
  }

  set value(val: string | number) {
    if (this.inputField) {
      this.inputField.value = val || '';
    }
  }

  private get rpcWallet() {
    return this.state.getRpcWallet();
  }

  private async resetRpcWallet() {
    this.updateButton();
    this.removeRpcWalletEvents();
    const rpcWallet = this.rpcWallet;
    const chainChangedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.ChainChanged, async (chainId: number) => {
      this.updateButton();
    });
    const connectedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.Connected, async (connected: boolean) => {
      this.updateButton();
    });
    this.rpcWalletEvents.push(chainChangedEvent, connectedEvent);
  }

  private removeRpcWalletEvents() {
    const rpcWallet = this.rpcWallet;
    for (let event of this.rpcWalletEvents) {
      rpcWallet.unregisterWalletEvent(event);
    }
    this.rpcWalletEvents = [];
  }

  onHide() {
    this.removeRpcWalletEvents();
  }

  private async onUpdate() {
    const data = await this.getData();
    const { erc1155Index, nftAddress, chainId } = data;
    if (!isClientWalletConnected()) {
      this.connectWallet();
      return;
    }
    if (!this.state.isRpcWalletConnected()) {
      const clientWallet = Wallet.getClientInstance();
      await clientWallet.switchNetwork(chainId);
      return;
    }

    if (!chainId) {
      this.showTxStatusModal('error', `Missing Chain!`);
      return;
    }
    if (!nftAddress) {
      this.showTxStatusModal('error', `Missing NFT Address!`);
      return;
    }
    if (!erc1155Index) {
      this.showTxStatusModal('error', `Missing Index!`);
      return;
    }
    const owner = await getProductOwner(this.state, erc1155Index);
    if (owner !== Wallet.getClientInstance().address) {
      this.showTxStatusModal('error', `You are not the owner`);
      return;
    }

    const callback = (err: Error, receipt?: string) => {
      if (err) {
        this.showTxStatusModal('error', err);
      } else if (receipt) {
        this.showTxStatusModal('success', receipt);
        this.updateEnabledInput(false);
      }
    }

    const confirmationCallback = async (receipt: any) => {
      this.updateEnabledInput(true);
      this.refreshUI();
    }

    registerSendTxEvents({
      transactionHash: callback,
      confirmation: confirmationCallback
    });

    const value = this.inputField.value;
    const text = `${this.isUri ? 'URI' : 'price'}`;
    try {
      this.showTxStatusModal('warning', `Updating ${text}`);
      if (this.isUri) {
        await updateProductUri(nftAddress, erc1155Index, value);
      } else {
        const productInfo = await getProductInfo(this.state, erc1155Index);
        if (productInfo) {
          const decimals = productInfo.token?.decimals || 18;
          await updateProductPrice(nftAddress, erc1155Index, value, decimals);
        }
      }
    } catch (e) {
      console.log(`Update ${text}`, e);
      this.showTxStatusModal('error', `Something went wrong when updating ${text}!`);
    }
    this.updateEnabledInput(true);
  }

  private async onInputChanged() {
    this.updateButton();
  }

  private updateEnabledInput(enabled: boolean) {
    this.inputField.enabled = enabled;
    this.btnUpdate.enabled = enabled;
    this.btnUpdate.rightIcon.spin = !enabled;
    this.btnUpdate.rightIcon.visible = !enabled;
  }

  private async updateButton() {
    if (!isClientWalletConnected() || !this.state.isRpcWalletConnected()) {
      this.btnUpdate.enabled = true;
      this.btnUpdate.caption = isClientWalletConnected() ? 'Switch Network' : 'Connect Wallet';
    } else {
      // const data = await this.getData();
      // const { chainId, erc1155Index, nftAddress } = data;
      // this.btnUpdate.enabled = !!(chainId && erc1155Index && nftAddress && this.inputField.value);
      this.btnUpdate.enabled = !!this.inputField.value;
      this.btnUpdate.caption = 'Update';
    }
  }

  private async getData() {
    const form = this.closest('i-form') as Form;
    const data = await form.getFormData();
    return data;
  }

  init() {
    super.init();
    this.refreshUI = this.getAttribute('refreshUI', true);
    this.connectWallet = this.getAttribute('connectWallet', true);
    this.showTxStatusModal = this.getAttribute('showTxStatusModal', true);
    this.state = this.getAttribute('state', true);
    this.isUri = this.getAttribute('isUri', true);
    this.inputField.inputType = this.isUri ? 'text' : 'number';
    this.inputField.value = this.getAttribute('value', true, '');
    this.resetRpcWallet();
  }

  render() {
    return (
      <i-hstack gap="0.5rem" verticalAlignment="center" wrap="wrap">
        <i-input
          id="inputField"
          width="100%"
          minWidth="140px"
          maxWidth="calc(100% - 148px)"
          height="42px"
          class={formInputStyle}
          onChanged={this.onInputChanged}
        />
        <i-button
          id="btnUpdate"
          width={140}
          height={42}
          padding={{ left: '0.5rem', right: '0.5rem' }}
          margin={{ left: 'auto' }}
          background={{ color: Theme.colors.primary.main }}
          font={{ color: Theme.colors.primary.contrastText }}
          border={{ radius: '0.5rem' }}
          enabled={false}
          caption="Update"
          onClick={this.onUpdate}
        />
      </i-hstack>
    )
  }
}
