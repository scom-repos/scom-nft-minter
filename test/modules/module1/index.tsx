import { Module, customModule, Container, VStack } from '@ijstech/components';
import ScomNftMinter from '@scom/scom-nft-minter'
@customModule
export default class Module1 extends Module {
    private nftMinter1: ScomNftMinter;
    private mainStack: VStack;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
        this.nftMinter1 = await ScomNftMinter.create({
            name: "Donation Dapp",
            logo: "ipfs://bafkreid4rgdbomv7lbboqo7kvmyruwulotrvqslej4jbwmd2ruzkmn4xte",
            chainId: 43113,
            productType: "DonateToEveryone",
            description: "#### If you'd like to support my work and help me create more exciting content, you can now make a donation using OSWAP. Your donation will help me continue creating high-quality videos and projects, and it's much appreciated. Thank you for your support, and please feel free to contact me if you have any questions or feedback.",
            link: "",
            hideDescription: true,
            donateTo: '0xb15E094957c31D6b0d08714015fF85Bec7842635',
            maxOrderQty: 1,
            maxPrice: "0",
            price: "0",
            qty: 999999999,
            tokenAddress: "0x78d9D80E67bC80A11efbf84B7c8A65Da51a8EF3C",
            productId: 1,
        });
        this.mainStack.appendChild(this.nftMinter1);
    }

    render() {
        return <i-panel>
            <i-hstack id="mainStack" margin={{top: '1rem', left: '1rem'}} gap="2rem">
                <i-scom-nft-minter
                    chainId={43113}
                    logo="ipfs://bafkreid4rgdbomv7lbboqo7kvmyruwulotrvqslej4jbwmd2ruzkmn4xte"
                    productType="DonateToEveryone"
                    hideDescription={true}
                    maxOrderQty={1}
                    maxPrice="0"
                    price="0"   
                    qty={999999999}
                    productId={1}
                    tokenAddress="0x78d9D80E67bC80A11efbf84B7c8A65Da51a8EF3C"
                    donateTo="0xb15E094957c31D6b0d08714015fF85Bec7842635"
                ></i-scom-nft-minter>
            </i-hstack>
        </i-panel>
    }
}