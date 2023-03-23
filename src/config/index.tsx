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
  Modal,
  Label
} from '@ijstech/components';
import { ICommissionInfo, IConfig } from '../interface/index';
import { textareaStyle } from './index.css';
import { BigNumber } from '@ijstech/eth-wallet';
import { formatNumber } from '../utils/index';
import ScomNetworkPicker from '../network-picker/index';
import { getEmbedderCommissionFee, getNetworkName } from '../store/index';

const Theme = Styles.Theme.ThemeVars;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-nft-minter-config']: ControlElement;
    }
  }
}

@customModule
@customElements("i-scom-nft-minter-config")
export default class Config extends Module {
  private tableCommissions: Table;
  private modalAddCommission: Modal;
  private networkPicker: ScomNetworkPicker;
  private inputWalletAddress: Input;
  private lbCommissionShare: Label;
  private commissionInfoList: ICommissionInfo[];
  private commissionsTableColumns = [
    {
      title: 'Network',
      fieldName: 'chainId',
      key: 'chainId',
      onRenderCell: function (source: Control, columnData: number, rowData: any) {
        return getNetworkName(columnData);
      }
    },    
    {
      title: 'Wallet Address',
      fieldName: 'walletAddress',
      key: 'walletAddress'
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
    const embedderFee = getEmbedderCommissionFee();
    this.lbCommissionShare.caption = `${formatNumber(new BigNumber(embedderFee).times(100).toFixed(), 4)} %`;
  }

  get data(): IConfig {
    const config: IConfig = {
    };
    config.commissions = this.tableCommissions.data || [];
    return config;
  }

  set data(config: IConfig) {
    this.tableCommissions.data = config.commissions || [];
  }

  onAddCommissionClicked() {
    this.modalAddCommission.visible = true;
  }

  onConfirmCommissionClicked() {
    if (!this.inputWalletAddress.value) return;
    this.modalAddCommission.visible = false;
    const embedderFee = getEmbedderCommissionFee();
    this.commissionInfoList.push({
      chainId: this.networkPicker.selectedNetwork?.chainId,
      walletAddress: this.inputWalletAddress.value,
      share: embedderFee
    })
    this.tableCommissions.data = this.commissionInfoList;
    this.inputWalletAddress.value = '';
  }

  render() {
    return (
      <i-vstack gap='0.5rem' padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}>
        <i-hstack gap={4} verticalAlignment="center" horizontalAlignment="space-between">
          <i-hstack gap="1rem">
            <i-label caption="Commission Fee:" font={{ bold:true }}/>
            <i-label id="lbCommissionShare" font={{ bold:true }}/>
          </i-hstack>
          <i-button
            caption="Add"
            background={{color: '#03a9f4'}}
            font={{color: '#fff'}}
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
            templateColumns={['2fr', '3fr']}
            templateRows={['auto', 'auto', 'auto', 'auto']}
            templateAreas={
              [
                ['title', 'title'],
                ['lbNetwork', 'network'],
                ["lbWalletAddress", "walletAddress"],
                ['btnConfirm', 'btnConfirm']
              ]
            }>

            <i-hstack width='100%' horizontalAlignment='center' grid={{ area: 'title' }} padding={{ bottom: '1rem' }}>
              <i-label caption="Add Commission"></i-label>
            </i-hstack>

            <i-label caption="Network" grid={{ area: 'lbNetwork' }} />
            <i-scom-nft-minter-network-picker id='networkPicker' grid={{ area: 'network' }} networks={[
              {
                "name": "Avalanche FUJI C-Chain",
                "chainId": 43113,
                "img": "avax"
              },
              {
                "name": "BSC Testnet",
                "chainId": 97,
                "img": "bsc"
              }
            ]} />

            <i-label caption="Wallet Address" grid={{ area: 'lbWalletAddress' }} />
            <i-input id='inputWalletAddress' grid={{ area: 'walletAddress' }} width='100%' />

            <i-hstack width='100%' horizontalAlignment='center' grid={{ area: 'btnConfirm' }} padding={{ top: '1rem' }}>
              <i-button
                caption="Confirm"
                background={{color: '#03a9f4'}}
                font={{color: '#fff'}}
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