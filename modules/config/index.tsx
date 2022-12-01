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
} from '@ijstech/components';
import { IConfig } from '@modules/interface';
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

@customModule
@customElements("nft-minter-config")
export default class Config extends Module {
  private uploadLogo: Upload;
  private edtDescription: Input;
  private markdownViewer: Markdown;
  private edtLink: Input;
  private edtPrice: Input;
  private edtMaxOrderQty: Input;
  private edtMaxQty: Input;
  private edtAddress: Input;
  private tokenSelection: TokenSelection;
  private _logo: any;

  get data(): IConfig {
    const config: IConfig = {
      description: this.edtDescription.value || "",
      link: this.edtLink.value || "",
      address: this.edtAddress.value || ""
    };
    config.price = Number(this.edtPrice.value);
    const maxQty = Number(this.edtMaxQty.value);
    if (Number.isInteger(maxQty)) config.maxQty = maxQty;
    const maxOrderQty = Number(this.edtMaxOrderQty.value);
    if (Number.isInteger(maxOrderQty)) config.maxOrderQty = maxOrderQty;
    if (this._logo) config.logo = this._logo;
    if (this.tokenSelection.token) config.token = this.tokenSelection.token;
    return config;
  }

  set data(config: IConfig) {
    this.uploadLogo.clear();
    if (config.logo) {
      this.uploadLogo.preview(config.logo);
    }
    this._logo = config.logo;
    this.edtLink.value = config.link || "";
    this.edtPrice.value = config.price || "";
    this.edtMaxOrderQty.value = config.maxOrderQty || "";
    this.edtMaxQty.value = config.maxQty || "";
    this.edtDescription.value = config.description || "";
    this.edtAddress.value = config.address|| "";
    this.tokenSelection.token = config.token;
    this.onMarkdownChanged();
  }

  async onChangeFile(source: Control, files: File[]) {
    if (!files.length) return;
    this._logo = await this.uploadLogo.toBase64(files[0]);
  }

  onRemove(source: Control, file: File) {
    this._logo = undefined;
  }

  onMarkdownChanged() {
    this.markdownViewer.load(this.edtDescription.value || "");
  }
  
  render() {
    return (
      <i-vstack gap='0.5rem' padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}>
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
        <i-label caption='Token:'></i-label>
        <nft-minter-token-selection
          id='tokenSelection'
          width='100%'
          background={{ color: Theme.input.background }}
          border={{ width: 1, style: 'solid', color: Theme.divider }}
        ></nft-minter-token-selection>
        <i-label caption='Price:'></i-label>
        <i-input id='edtPrice' width='100%' inputType='number'></i-input>
        <i-label caption='Max Order Qty:'></i-label>
        <i-input id='edtMaxOrderQty' width='100%' inputType='number'></i-input>
        <i-label caption='Max Qty:'></i-label>
        <i-input id='edtMaxQty' width='100%' inputType='number'></i-input>
        <i-label caption='Address:'></i-label>
        <i-input id='edtAddress' width='100%'></i-input>
      </i-vstack>
    )
  }
}