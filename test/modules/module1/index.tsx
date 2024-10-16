import { Module, customModule, Container, application, ComboBox, IComboItem, HStack, Styles } from '@ijstech/components';
import { getMulticallInfoList } from '@scom/scom-multicall';
import { INetwork } from '@ijstech/eth-wallet';
import getNetworkList from '@scom/scom-network-list';
import ScomNftMinter from '@scom/scom-nft-minter';
import ScomWidgetTest from '@scom/scom-widget-test';
import { nullAddress } from '@ijstech/eth-contract';
const Theme = Styles.Theme.ThemeVars;

type WidgetType = 'new1155' | 'customNft';
const configs = [
  {
    label: 'New 1155 Index',
    value: 'new1155'
  },
  {
    label: 'Existing NFT',
    value: 'customNft'
  }
]

@customModule
export default class Module1 extends Module {
  private nftMinter: ScomNftMinter;
  private widgetModule: ScomWidgetTest;
  private pnlPreview: Module;
  private cbbType: ComboBox;
  private widgetType: WidgetType = 'new1155';

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    const multicalls = getMulticallInfoList();
    const networkMap = this.getNetworkMap(options.infuraId);
    application.store = {
      infuraId: options.infuraId,
      multicalls,
      networkMap
    }
  }

  private getNetworkMap = (infuraId?: string) => {
    const networkMap = {};
    const defaultNetworkList: INetwork[] = getNetworkList();
    const defaultNetworkMap: Record<number, INetwork> = defaultNetworkList.reduce((acc, cur) => {
      acc[cur.chainId] = cur;
      return acc;
    }, {});
    for (const chainId in defaultNetworkMap) {
      const networkInfo = defaultNetworkMap[chainId];
      const explorerUrl = networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length ? networkInfo.blockExplorerUrls[0] : "";
      if (infuraId && networkInfo.rpcUrls && networkInfo.rpcUrls.length > 0) {
        for (let i = 0; i < networkInfo.rpcUrls.length; i++) {
          networkInfo.rpcUrls[i] = networkInfo.rpcUrls[i].replace(/{INFURA_ID}/g, infuraId);
        }
      }
      networkMap[networkInfo.chainId] = {
        ...networkInfo,
        symbol: networkInfo.nativeCurrency?.symbol || "",
        explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
        explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : ""
      }
    }
    return networkMap;
  }

  private onCloseConfig() {
    this.pnlPreview.closeModal();
  }

  private async onShowConfig() {
    const editor = this.nftMinter.getConfigurators(this.widgetType).find(v => v.target === 'Editor');
    const widgetData = editor.getData();
    if (!this.pnlPreview) {
      const onTypeChanged = async () => {
        const item = this.cbbType.selectedItem as IComboItem;
        if (item.value === this.widgetType) return;
        this.widgetType = item.value as WidgetType;
        const config = this.nftMinter.getConfigurators(this.widgetType).find(v => v.target === 'Editor');
        const data = config.getData();
        this.widgetModule.widgetType = this.widgetType;
        this.widgetModule.show(this.widgetType === 'new1155' ? undefined : data);
      }
      this.pnlPreview = await Module.create();
      this.pnlPreview.appendChild(
        <i-hstack gap={8} justifyContent="space-between" margin={{ top: 10, bottom: 10 }} padding={{ left: 10, right: 10 }}>
          <i-hstack gap={48} verticalAlignment="center">
            <i-label caption="Config" font={{ bold: true }} />
            <i-hstack gap={16} verticalAlignment="center">
              <i-label caption="Type" font={{ bold: true, color: Theme.colors.info.main }} />
              <i-combo-box
                id="cbbType"
                selectedItem={configs.find(v => v.value === this.widgetType)}
                items={configs}
                onChanged={onTypeChanged}
              />
            </i-hstack>
          </i-hstack>
          <i-icon name="times" width={20} height={20} fill="#f50057" cursor="pointer" onClick={() => this.onCloseConfig()} />
        </i-hstack>
      )
    }
    if (!this.widgetModule) {
      this.widgetModule = await ScomWidgetTest.create({
        widgetName: 'scom-nft-minter',
        onConfirm: (data: any, tag: any) => {
          editor.setData(data);
          editor.setTag(tag);
          this.onCloseConfig();
        },
        widgetType: this.widgetType
      });
      const header = this.widgetModule.firstElementChild.firstElementChild as HStack;
      if (header) {
        header.visible = false;
      }
      this.pnlPreview.appendChild(this.widgetModule);
    }

    this.widgetModule.show(this.widgetType === 'new1155' ? undefined : widgetData);
    this.pnlPreview.openModal({
      width: '90%',
      maxWidth: '90rem',
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      closeOnBackdropClick: true,
      closeIcon: null
    });
  }

  async init() {
    super.init();
  }

  render() {
    return (
      <i-panel>
        <i-vstack
          margin={{ top: '1rem', left: '1rem', right: '1rem' }}
          gap="1rem"
        >
          <i-button caption="Config" onClick={this.onShowConfig} width={160} padding={{ top: 5, bottom: 5 }} margin={{ left: 'auto', right: 20 }} font={{ color: '#fff' }} />
          <i-scom-nft-minter
            id="nftMinter"
            nftType={'ERC1155'}
            nftAddress="0xDB301a9Ef98843376C835aFB41608d6A319e138D"
            tokenToMint={nullAddress} //Native token
            recipients={["0x0000000000000000000000000000000000000000", "0x1111111111111111111111111111111111111111"]}
            erc1155Index={1}
            chainId={43113}
            networks={[
              {
                chainId: 43113
              }
            ]}
            defaultChainId={43113}
            wallets={[{ name: 'metamask' }]}
          />
        </i-vstack>
      </i-panel>
    )
  }
}