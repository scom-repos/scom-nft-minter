import {
  customElements,
  ControlElement,
  customModule,
  Module,
  Button,
  Styles,
  Modal,
  GridLayout,
  HStack,
  application,
  Panel,
  Container,
  Control
} from '@ijstech/components'
import { } from '@ijstech/eth-contract'
import Assets from '../assets'
import customStyles from './index.css'

interface INetwork {
  chainId: number;
  name: string;
  img?: string;
  rpc?: string;
	symbol?: string;
	env?: string;
  explorerName?: string;
  explorerTxUrl?: string;
  explorerAddressUrl?: string;
  isDisabled?: boolean;
};

interface PickerElement extends ControlElement {
  networks?: INetwork[] | '*'
}
const Theme = Styles.Theme.ThemeVars

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-nft-minter-network-picker']: PickerElement
    }
  }
}

@customModule
@customElements('i-scom-nft-minter-network-picker')
export default class ScomNetworkPicker extends Module {
  private mdNetwork: Modal
  private gridNetworkGroup: GridLayout
  private pnlNetwork: Panel
  private btnNetwork: Button

  private networkMapper: Map<number, HStack>
  private _networkList: INetwork[] = []
  private _selectedNetwork: INetwork | undefined

  constructor(parent?: Container, options?: any) {
    super(parent, options)
  }

  get selectedNetwork() {
    return this._selectedNetwork
  }

  private onSelectNetwork(network: INetwork) {
    this.mdNetwork.visible = false;
    this._selectedNetwork = network
    const img = this._selectedNetwork?.img
      ? Assets.img.network[this._selectedNetwork.img] ||
      application.assets(this._selectedNetwork.img)
      : undefined
    this.btnNetwork.caption = `<i-hstack verticalAlignment="center" gap="1.125rem">
      <i-panel>
        <i-image width=${17} height=${17} url="${img}"></i-image>
      </i-panel>
      <i-label caption="${this._selectedNetwork?.name ?? ''}"></i-label>
    </i-hstack>`
    this.networkMapper.forEach((value, key) => {
      const chainId = this._selectedNetwork?.chainId
      if (key === chainId) {
        value.classList.add('is-active')
      }
      else {
        value.classList.remove('is-active')
      }
    });
  }

  private renderNetworks() {
    this.gridNetworkGroup.clearInnerHTML()
    this.networkMapper = new Map()
    this.gridNetworkGroup.append(
      ...this._networkList.map((network) => {
        const img = network.img ? (
          <i-image
            url={Assets.img.network[network.img] || application.assets(network.img)}
            width={16}
            height={16}
          />
        ) : (
          []
        )

        const isActive = this._selectedNetwork ? this._selectedNetwork.chainId === network.chainId : false
        const hsNetwork = (
          <i-hstack
            onClick={() => this.onSelectNetwork(network)}
            background={{ color: 'transparent' }}
            position='relative'
            class={isActive ? 'is-active list-item' : 'list-item'}
            verticalAlignment="center"
            overflow="hidden"
            padding={{top: '5px', bottom: '5px', left: '0.75rem', right: '0.75rem'}}
          >
            <i-hstack
              verticalAlignment='center'
              gap='1.125rem'
              lineHeight={1.375}
            >
              <i-panel>{img}</i-panel>
              <i-label
                caption={network.name}
                wordBreak='break-word'
                font={{
                  size: '.875rem',
                  color: Theme.text.primary,
                  weight: 400
                }}
                class="is-ellipsis"
              />
            </i-hstack>
          </i-hstack>
        )
        this.networkMapper.set(network.chainId, hsNetwork)
        return hsNetwork
      })
    )
  }

  private renderModalItem() {
    const grid = (
      <i-grid-layout
        id='gridNetworkGroup'
        width='100%'
        columnsPerRow={1}
        templateRows={['max-content']}
        class='list-view is-combobox'
      ></i-grid-layout>
    )
    return (
      <i-panel
        margin={{ top: '0.25rem' }}
        padding={{ top: 5, bottom: 5 }}
        overflow={{ y: 'auto' }}
        maxHeight={300}
        border={{ radius: 2 }}
      >
        {grid}
      </i-panel>
    )
  }

  private async renderUI() {
    this.pnlNetwork.clearInnerHTML()
    await this.renderCombobox()
    this.mdNetwork.item = this.renderModalItem()
    this.mdNetwork.classList.add('os-modal')
    this.btnNetwork.classList.add('btn-network')
    this.pnlNetwork.appendChild(this.btnNetwork)
    this.pnlNetwork.appendChild(this.mdNetwork)
    this.renderNetworks()
  }

  private async renderCombobox() {
    this.mdNetwork = await Modal.create({
      showBackdrop: false,
      minWidth: 200,
      popupPlacement: 'bottom'
    });
    this.mdNetwork.classList.add('full-width')
    this.btnNetwork = await Button.create({
      lineHeight: 1.875,
      width: '100%',
      padding: {
        top: '0.5rem',
        bottom: '0.5rem',
        left: '0.75rem',
        right: '0.75rem',
      },
      border: { radius: 5, width: '1px', style: 'solid', color: Theme.divider },
      font: { color: Theme.text.primary },
      rightIcon: { name: 'angle-down', width: 20, height: 20, fill: 'rgba(0,0,0,.45)' },
      background: { color: 'transparent' },
      caption: 'Select a network',
      onClick: () => {
        this.mdNetwork.visible = !this.mdNetwork.visible
        this.btnNetwork.classList.add('btn-focus')
      }
    })
    this.btnNetwork.classList.add('btn-cb-network')
    this.mdNetwork.classList.add('box-shadow')
    this.mdNetwork.onClose = () => {
      this.btnNetwork.opacity = 1
    }
    this.mdNetwork.onOpen = () => {
      this.btnNetwork.opacity = 0.5
    }
  }

  init() {
    this.classList.add(customStyles)
    super.init()
    this._networkList = this.getAttribute('networks', true)
    document.addEventListener('click', (event) => {
      const target = event.target as Control
      const btnNetwork = target.closest('.btn-network')
      if (!btnNetwork || !btnNetwork.isSameNode(this.btnNetwork)) {
        this.btnNetwork.classList.remove('btn-focus')
      } else {
        this.btnNetwork.classList.add('btn-focus')
      }
    })
    this.renderUI();
  }
  render() {
    return (
      <i-panel id='pnlNetwork' width='100%'></i-panel>
    )
  }
}
