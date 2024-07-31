import { Module, customModule, Container, VStack, application, Form, Modal, Styles } from '@ijstech/components';
import { getMulticallInfoList } from '@scom/scom-multicall';
import { INetwork } from '@ijstech/eth-wallet';
import getNetworkList from '@scom/scom-network-list';
import ScomNftMinter from '@scom/scom-nft-minter';

Styles.Theme.darkTheme.text.primary = '#fff';
Styles.Theme.darkTheme.text.secondary = '#fff';
Styles.Theme.darkTheme.background.modal = '#1A1A1A';
Styles.Theme.darkTheme.input.background = '#232B5A';
Styles.Theme.darkTheme.input.fontColor = '#fff';
Styles.Theme.applyTheme(Styles.Theme.darkTheme);

@customModule
export default class Module1 extends Module {
  private nftMinter: ScomNftMinter;
  private mdConfig: Modal;
  private actionForm: Form;
  private nftMinterPreview: ScomNftMinter;

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

  private getThemeValues(theme: any) {
    if (!theme || typeof theme !== 'object') return null;
    let values = {};
    for (let prop in theme) {
      if (theme[prop]) values[prop] = theme[prop];
    }
    return Object.keys(values).length ? values : null;
  }

  private compareThemes(oldValues: any, newValues: any) {
    for (let prop in newValues) {
      if (!oldValues.hasOwnProperty(prop) || newValues[prop] !== oldValues[prop]) {
        return true;
      }
    }
    return false;
  }

  private async onShowConfig() {
    const editor = this.nftMinter.getConfigurators().find(v => v.target === 'Editor');
    const builder = this.nftMinterPreview.getConfigurators().find((conf: any) => conf.target === 'Builders');
    const action = editor.getActions()[0];
    this.actionForm.uiSchema = action.userInputUISchema;
    this.actionForm.jsonSchema = action.userInputDataSchema;
    this.actionForm.formOptions = {
      columnWidth: '100%',
      columnsPerRow: 1,
      confirmButtonOptions: {
        caption: 'Confirm',
        padding: { top: '0.5rem', bottom: '0.5rem', right: '1rem', left: '1rem' },
        border: { radius: '0.5rem' },
        hide: false,
        onClick: async () => {
          const data = await this.actionForm.getFormData();
          editor.setData(data);
        }
      },
      onChange: async () => {
        const formData = await this.actionForm.getFormData();
        if (formData) {
          const oldTag = builder.getTag();
          const oldDark = this.getThemeValues(oldTag?.dark);
          const oldLight = this.getThemeValues(oldTag?.light);
          const { dark, light } = formData;
          let tag = {};
          const darkTheme = this.getThemeValues(dark);
          const lightTheme = this.getThemeValues(light);
          let isTagChanged = false;
          if (darkTheme) {
            tag['dark'] = darkTheme;
            isTagChanged = this.compareThemes(oldDark, darkTheme);
          }
          if (lightTheme) {
            tag['light'] = lightTheme;
            if (!isTagChanged) {
              isTagChanged = this.compareThemes(oldLight, lightTheme);
            }
          }
          if (Object.keys(tag).length) {
            builder.setTag(tag);
          }
          if (isTagChanged) return;
        }
        const validationResult = this.actionForm.validate(formData, this.actionForm.jsonSchema, { changing: false });
        if (validationResult.valid) {
          builder.setData(formData);
        }
      },
      customControls: action.customControls,
      dateTimeFormat: {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss',
        dateTime: 'MM/DD/YYYY HH:mm'
      }
    };
    const data = await editor.getData();
    this.actionForm.renderForm();
    this.actionForm.clearFormData();
    this.actionForm.setFormData({ ...data });
    builder.setData(data);

    this.mdConfig.refresh();
    this.mdConfig.visible = true;
  }

  private onCloseConfig() {
    this.mdConfig.visible = false;
  }

  async init() {
    super.init();
  }

  render() {
    return (
      <i-panel>
        <i-vstack
          id='mainStack'
          margin={{ top: '1rem', left: '1rem' }}
          gap='2rem'
        >
          <i-button caption="Config" onClick={this.onShowConfig} width={160} padding={{ top: 5, bottom: 5 }} margin={{ left: 'auto', right: 20 }} font={{ color: '#fff' }} />
          <i-scom-nft-minter
            id="nftMinter"
            nftType='ERC1155NewIndex'
            nftAddress='0xa5CDA5D7F379145b97B47aD1c2d78f827C053D91'
            productType='OswapTroll'
            chainId={97}
            networks={[
              {
                chainId: 97
              }
            ]}
            defaultChainId={97}
            wallets={[{ name: 'metamask' }]}
          />
        </i-vstack>

        <i-modal
          id="mdConfig"
          width={'90vw'}
          minWidth={'90%'}
          maxWidth={'50rem'}
          padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
          closeOnBackdropClick={true}
        >
          <i-hstack gap={8} justifyContent="space-between" margin={{ top: 10, bottom: 10 }} padding={{ left: 10, right: 10 }}>
            <i-label caption="Config" font={{ bold: true }} />
            <i-icon name="times" width={20} height={20} fill="#f50057" cursor="pointer" onClick={this.onCloseConfig} />
          </i-hstack>
          <i-grid-layout
            gap={{ column: '0.5rem' }}
            templateColumns={['calc(50% - 0.25rem)', 'calc(50% - 0.25rem)']}
            mediaQueries={[
              {
                maxWidth: '768px',
                properties: {
                  templateColumns: ['100%']
                }
              }
            ]}
          >
            <i-scom-nft-minter
              id="nftMinterPreview"
              networks={[
                {
                  chainId: 97
                }
              ]}
              defaultChainId={97}
              wallets={[{ name: 'metamask' }]}
            />
            <i-form id="actionForm" />
          </i-grid-layout>
        </i-modal>
      </i-panel>
    )
  }
}