import { Module, customModule, Container, VStack, application } from '@ijstech/components';
import { getMulticallInfoList } from '@scom/scom-multicall';
import { INetwork } from '@ijstech/eth-wallet';
import getNetworkList from '@scom/scom-network-list';
import ScomNftMinter from '@scom/scom-nft-minter';
@customModule
export default class Module1 extends Module {
  private nftMinter1: ScomNftMinter;
  private mainStack: VStack;

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
          <i-scom-nft-minter
            logoUrl="ipfs://bafkreicdwbtx5niyhfzctxvxnwxjt3qfb3kyotrdpkdo26wky33lnt7lci"
            productType="DonateToEveryone"
            description="#### If you'd like to support my work and help me create more exciting content, you can now make a donation using OSWAP. Your donation will help me continue creating high-quality videos and projects, and it's much appreciated. Thank you for your support, and please feel free to contact me if you have any questions or feedback."
            chainSpecificProperties={{
              97: {
                productId: 1,
                donateTo: '0xCE001a607402Bba038F404106CA6682fBb1108F6'
              },
              43113: {
                productId: 1,
                donateTo: '0xCE001a607402Bba038F404106CA6682fBb1108F6'
              }
            }}
            networks={[
              {
                chainId: 43113
              },
              {
                chainId: 97
              }
            ]}
            defaultChainId={97}
            wallets={[{ name: 'metamask' }]}
          />
        </i-vstack>
      </i-panel>
    )
  }
}