import {
  Module,
  customModule,
  customElements,
  ControlElement,
  Control,
  Styles,
  Input,
  Upload,
  Markdown,
  IComboItem,
  ComboBox
} from '@ijstech/components';
import { dappType, IConfig } from '@modules/interface';
import { textareaStyle } from './index.css';
import { TokenSelection } from '@modules/token-selection';

const Theme = Styles.Theme.ThemeVars;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['nft-minter-config']: ControlElement;
    }
  }
}

const ComboDappTypeItems = [
  {
    value: 'nft-minter',
    label: 'NFT Minter'
  }, {
    value: 'donation',
    label: 'Donation'
  }
];

@customModule
@customElements("nft-minter-config")
export default class Config extends Module {
  private uploadLogo: Upload;
  private edtDescription: Input;
  private markdownViewer: Markdown;
  private edtLink: Input;
  private edtPrice: Input;
  private edtMaxOrderQty: Input;
  private edtQty: Input;
  private tokenSelection: TokenSelection;
  private comboDappType: ComboBox;
  private _logo: any;

  get data(): IConfig {
    const config: IConfig = {
      dappType: (this.comboDappType.selectedItem as IComboItem).value as dappType,
      description: this.edtDescription.value || "",
      link: this.edtLink.value || ""
    };
    if (this.edtPrice.value) {
      config.price = this.edtPrice.value;
    }
    const qty = Number(this.edtQty.value);
    if (this.edtQty.value && Number.isInteger(qty)) {
      config.qty = qty;
    }
    const maxOrderQty = Number(this.edtMaxOrderQty.value);
    if (this.edtMaxOrderQty.value && Number.isInteger(maxOrderQty)) {
      config.maxOrderQty = maxOrderQty;
    }
    if (this._logo) {
      config.logo = this._logo;
    }
    if (this.tokenSelection.token) {
      config.token = this.tokenSelection.token;
    }
    return config;
  }

  set data(config: IConfig) {
    this.uploadLogo.clear();
    if (config.logo) {
      this.uploadLogo.preview(config.logo);
    }
    this.comboDappType.selectedItem = ComboDappTypeItems.find(v => v.label == config.dappType);
    this._logo = config.logo;
    this.edtLink.value = config.link || "";
    this.edtPrice.value = config.price || "";
    this.edtMaxOrderQty.value = config.maxOrderQty || "";
    this.edtQty.value = config.qty || "";
    this.edtDescription.value = config.description || "";
    this.tokenSelection.token = config.token;
    this.onMarkdownChanged();
  }

  async onChangeFile(source: Control, files: File[]) {
    this._logo = files.length ? await this.uploadLogo.toBase64(files[0]) : undefined;
  }

  onRemove(source: Control, file: File) {
    this._logo = undefined;
  }

  onMarkdownChanged() {
    this.markdownViewer.load(this.edtDescription.value || "");
  }
  
  onComboDappTypeChanged() {
    const selectedItem = this.comboDappType.selectedItem as IComboItem;
    if (selectedItem.value == 'nft-minter') {
      this.edtPrice.enabled = true;
      this.edtQty.enabled = true;
    }
    else if (selectedItem.value == 'donation') {
      this.edtPrice.enabled = false;
      this.edtQty.enabled = false;
    }
  }

  render() {
    return (
      <i-vstack gap='0.5rem' padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}>
        <i-label caption='Dapp Type:'></i-label>
        <i-combo-box
          id='comboDappType'
          width='100%'
          items={ComboDappTypeItems}
          selectedItem={ComboDappTypeItems[0]}
          onChanged={this.onComboDappTypeChanged.bind(this)}
        ></i-combo-box>
        <i-label caption='Logo:'></i-label>
        <i-upload
          id='uploadLogo'
          margin={{ top: 8, bottom: 0 }}
          accept='image/*'
          draggable
          caption='Drag and drop image here'
          showFileList={false}
          onChanged={this.onChangeFile.bind(this)}
          onRemoved={this.onRemove.bind(this)}
        ></i-upload>
        <i-label caption='Descriptions:'></i-label>
        <i-grid-layout
          templateColumns={['50%', '50%']}
        >
          <i-input
            id='edtDescription'
            class={textareaStyle}
            width='100%'
            height='100%'
            display='flex'
            stack={{ grow: '1' }}
            resize="none"
            inputType='textarea'
            font={{ size: Theme.typography.fontSize, name: Theme.typography.fontFamily }}
            onChanged={this.onMarkdownChanged.bind(this)}
          ></i-input>
          <i-markdown
            id='markdownViewer'
            width='100%'
            height='100%'
            padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
          ></i-markdown>
        </i-grid-layout>
        <i-label caption='Link:'></i-label>
        <i-input id='edtLink' width='100%'></i-input>
        <i-hstack gap={4} verticalAlignment="center">
          <i-label caption='Token'></i-label>
          <i-label caption="*" font={{ color: Theme.colors.error.main }} />
        </i-hstack>
        <nft-minter-token-selection
          id='tokenSelection'
          width='100%'
          background={{ color: Theme.input.background }}
          border={{ width: 1, style: 'solid', color: Theme.divider }}
        ></nft-minter-token-selection>
        <i-hstack gap={4} verticalAlignment="center">
          <i-label caption='Price'></i-label>
          <i-label caption="*" font={{ color: Theme.colors.error.main }} />
        </i-hstack>
        <i-input id='edtPrice' width='100%' inputType='number'></i-input>
        <i-hstack gap={4} verticalAlignment="center">
          <i-label caption='Qty'></i-label>
          <i-label caption="*" font={{ color: Theme.colors.error.main }} />
        </i-hstack>
        <i-input id='edtQty' width='100%' inputType='number'></i-input>
        <i-hstack gap={4} verticalAlignment="center">
          <i-label caption='Max Order Qty'></i-label>
          <i-label caption="*" font={{ color: Theme.colors.error.main }} />
        </i-hstack>
        <i-input id='edtMaxOrderQty' width='100%' inputType='number'></i-input>        
      </i-vstack>
    )
  }
}