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
  ComboBox,
  Table,
  Icon,
  Modal
} from '@ijstech/components';
import { dappType, ICommissionInfo, IConfig } from '@modules/interface';
import { textareaStyle } from './index.css';
import { TokenSelection } from '@modules/token-selection';
import { BigNumber } from '@ijstech/eth-wallet';
import { formatNumber } from '@modules/utils';

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
  private tableCommissions: Table;
  private modalAddCommission: Modal;
  private inputWalletAddress: Input;
  private inputShare: Input;
  private commissionInfoList: ICommissionInfo[];
  private commissionsTableColumns = [
    {
      title: 'Wallet Address',
      fieldName: 'walletAddress',
      key: 'walletAddress'
    },
    {
      title: 'Share',
      fieldName: 'share',
      key: 'share',
      onRenderCell: function (source: Control, columnData: number, rowData: any) {
        return formatNumber(new BigNumber(columnData).times(100).toFixed(), 4) + '%';
      }
    },
    {
      title: '',
      fieldName: '',
      key: '',
      textAlign: 'center' as any,
      onRenderCell: async (source: Control, data: any, rowData: any) => {
        const icon = new Icon(undefined, {
          name: "times",
          fill: "#f7d063", 
          height: 18,
          width: 18
        })
        icon.onClick = async (source: Control) => { 
          const index = this.commissionInfoList.findIndex(v => v.walletAddress == rowData.walletAddress);
          if (index >= 0) {
            this.commissionInfoList.splice(index, 1);
            this.tableCommissions.data = this.commissionInfoList;
          }
        }
        return icon;
      }
    }
  ]
  
  async init() {
    super.init();
    this.commissionInfoList = [];
  }

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
    config.commissions = this.tableCommissions.data;
    return config;
  }

  set data(config: IConfig) {
    this.uploadLogo.clear();
    if (config.logo) {
      this.uploadLogo.preview(config.logo);
    }
    this.comboDappType.selectedItem = ComboDappTypeItems.find(v => v.value == config.dappType);
    this.onComboDappTypeChanged();
    this._logo = config.logo;
    this.edtLink.value = config.link || "";
    this.edtPrice.value = config.price || "";
    this.edtMaxOrderQty.value = config.maxOrderQty || "";
    this.edtQty.value = config.qty || "";
    this.edtDescription.value = config.description || "";
    this.tokenSelection.token = config.token;
    this.tableCommissions.data = config.commissions || [];
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

  onAddCommissionClicked() {
    this.modalAddCommission.visible = true;
  }

  onConfirmCommissionClicked() {
    if (!this.inputWalletAddress.value || !this.inputShare.value) return;
    this.modalAddCommission.visible = false;
    this.commissionInfoList.push({
      walletAddress: this.inputWalletAddress.value,
      share: new BigNumber(this.inputShare.value).div(100).toFixed()
    })
    this.tableCommissions.data = this.commissionInfoList;
    this.inputWalletAddress.value = '';
    this.inputShare.value = '';
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
        </i-hstack>
        <i-input id='edtPrice' width='100%' inputType='number'></i-input>
        <i-hstack gap={4} verticalAlignment="center">
          <i-label caption='Qty'></i-label>
        </i-hstack>
        <i-input id='edtQty' width='100%' inputType='number'></i-input>
        <i-hstack gap={4} verticalAlignment="center">
          <i-label caption='Max Order Qty'></i-label>
        </i-hstack>
        <i-input id='edtMaxOrderQty' width='100%' inputType='number'></i-input>     
        <i-hstack gap={4} verticalAlignment="center" horizontalAlignment="space-between">
          <i-label caption='Commissions'></i-label>
          <i-button 
            caption="Add" 
            padding={{ top: '0.4rem', bottom: '0.4rem', left: '2rem', right: '2rem' }} 
            onClick={this.onAddCommissionClicked.bind(this)}>
          </i-button>   
        </i-hstack>   
        <i-table
          id='tableCommissions'
          data={this.commissionInfoList}
          columns={this.commissionsTableColumns}
        ></i-table> 
        <i-modal
          id='modalAddCommission' maxWidth='500px' closeIcon={{ name: 'times-circle' }}>
          <i-grid-layout
            width='100%'
            verticalAlignment='center' gap={{ row: 5 }}
            padding={{ top: '1rem', bottom: '1rem', left: '2rem', right: '2rem' }}
            templateColumns={['1fr', '1fr']}
            templateRows={['auto', 'auto', 'auto', 'auto']}
            templateAreas={
              [
                ['title', 'title'],
                ["lbWalletAddress", "walletAddress"],
                ["lbShare", "share"],
                ['btnConfirm', 'btnConfirm']
              ]
            }>

            <i-hstack width='100%' horizontalAlignment='center' grid={{ area: 'title' }} padding={{ bottom: '1rem' }}>
              <i-label caption="Add Commission"></i-label>
            </i-hstack>

            <i-label caption="Wallet Address" grid={{ area: 'lbWalletAddress' }} />
            <i-input id='inputWalletAddress' grid={{ area: 'walletAddress' }} width='100%' />

            <i-label caption="Share" grid={{ area: 'lbShare' }} />
            <i-hstack verticalAlignment="center" grid={{ area: 'share' }} width='100%'>
              <i-input id='inputShare' />
              <i-label caption="%" />
            </i-hstack>

            <i-hstack width='100%' horizontalAlignment='center' grid={{ area: 'btnConfirm' }} padding={{ top: '1rem' }}>
              <i-button 
                caption="Confirm" 
                padding={{ top: '0.4rem', bottom: '0.4rem', left: '2rem', right: '2rem' }} 
                onClick={this.onConfirmCommissionClicked.bind(this)} 
              />
            </i-hstack>

          </i-grid-layout>
        </i-modal>            
      </i-vstack>
    )
  }
}