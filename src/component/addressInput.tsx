import {
    customElements,
    ControlElement,
    Styles,
    Module,
    Container,
    Input,
    Label,
    FormatUtils,
    StackLayout,
} from '@ijstech/components';
import { Utils } from '@ijstech/eth-wallet';
import { getProductId, getProductInfo } from '../API';
import { formInputStyle, readOnlyInfoStyle, readOnlyStyle } from '../index.css';
import { State } from '../store/index';

const Theme = Styles.Theme.ThemeVars;

interface ScomNftMinterAddressInputElement extends ControlElement {
    state: State;
    value?: number;
    readOnly?: boolean;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-nft-minter-address-input']: ScomNftMinterAddressInputElement;
        }
    }
}

@customElements('i-scom-nft-minter-address-input')
export class ScomNftMinterAddressInput extends Module {
    private edtAddress: Input;
    private pnlProductInfo: StackLayout;
    private pnlDurationInDays: StackLayout;
    private lblPaymentModel: Label;
    private lblDurationInDays: Label;
    private lblTitlePrice: Label;
    private lblPriceToMint: Label;
    private state: State;
    private timeout: any;
    private _nftType: 'ERC721' | 'ERC1155';
    private _nftId: number;
    private _readonly: boolean;
    private isInfoParentUpdated = false;

    get nftType() {
        return this._nftType;
    }

    set nftType(value: 'ERC721' | 'ERC1155') {
        this._nftType = value;
    }

    get nftId() {
        return this._nftId;
    }

    set nftId(value: number) {
        this._nftId = value;
    }

    get value() {
        return this.edtAddress.value;
    }

    set value(val: string) {
        if (this.edtAddress) this.edtAddress.value = val;
    }

    init() {
        super.init();
        this.state = this.getAttribute('state', true);
        const val = this.getAttribute('value', true);
        if (val) this.edtAddress.value = val;
        const readOnly = this.getAttribute('readOnly', true, false);
        this.edtAddress.readOnly = readOnly;
        if (readOnly) {
            this.edtAddress.classList.add(readOnlyStyle);
        }
    }

    handleAddressChanged() {
        if (this['onChanged']) this['onChanged']();
        if (this.timeout) clearTimeout(this.timeout);
        this.pnlProductInfo.visible = false;
        if (!this.edtAddress.value || !this.nftType || (this.nftType === 'ERC1155' && !this.nftId)) return;
        this.timeout = setTimeout(async () => {
            const wallet = this.state.getRpcWallet();
            if (!wallet.isAddress(this.edtAddress.value)) return;
            const productId = await getProductId(this.state, this.edtAddress.value, this.nftType === 'ERC1155' ? this.nftId : undefined);
            if (!this.isInfoParentUpdated) {
                this.isInfoParentUpdated = true;
                const currentFromGroup = this.closest('.form-group');
                const indexFormGroup = currentFromGroup.nextElementSibling || currentFromGroup;
                if (indexFormGroup) indexFormGroup.after(this.pnlProductInfo);
            }
            this.pnlProductInfo.visible = !!productId;
            if (productId) {
                const productInfo = await getProductInfo(this.state, productId);
                const isSubscription = productInfo.productType.toNumber() === 1;
                const durationInDays = Math.ceil((productInfo.priceDuration?.toNumber() || 0) / 86400);
                this.lblPaymentModel.caption = isSubscription ? 'Subscription' : 'One-Time Purchase';
                const price = FormatUtils.formatNumber(
                    Utils.fromDecimals(productInfo.price, productInfo.token.decimals).toFixed(),
                    { minValue: '0.0000001', hasTrailingZero: false }
                );
                const symbol = productInfo.token?.symbol || '';
                this.lblTitlePrice.caption = isSubscription ? 'Subscription Price per Period' : 'Price'
                this.lblPriceToMint.caption = `${price} ${symbol}`;
                this.lblDurationInDays.caption = durationInDays.toString();
                this.pnlDurationInDays.visible = isSubscription;
            }
        })
    }

    render() {
        <i-stack direction="vertical">
            <i-input
                id="edtAddress"
                width="100%"
                minWidth="100px"
                height={42}
                class={formInputStyle}
                onChanged={this.handleAddressChanged}
            ></i-input>
            <i-stack id="pnlProductInfo" class={readOnlyInfoStyle} direction="vertical" width="100%" visible={false}>
                <i-panel padding={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                    <i-stack direction="vertical" width="100%" justifyContent="center" gap={5}>
                        <i-stack direction="horizontal" width="100%" alignItems="center" gap={2}>
                            <i-label caption="Payment Model"></i-label>
                        </i-stack>
                        <i-stack
                            direction="horizontal"
                            alignItems="center"
                            width="100%"
                            height={42}
                            background={{ color: Theme.input.background }}
                            border={{ width: 0.5, style: 'solid', color: Theme.input.background, radius: '0.625rem' }}
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                        >
                            <i-label id="lblPaymentModel" font={{ color: Theme.input.fontColor }}></i-label>
                        </i-stack>
                    </i-stack>
                </i-panel>
                <i-panel id="pnlDurationInDays" visible={false} padding={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                    <i-stack direction="vertical" width="100%" justifyContent="center" gap={5}>
                        <i-stack direction="horizontal" width="100%" alignItems="center" gap={2}>
                            <i-label caption="Minimum Subscription Period (in Days)"></i-label>
                        </i-stack>
                        <i-stack
                            direction="horizontal"
                            alignItems="center"
                            width="100%"
                            height={42}
                            background={{ color: Theme.input.background }}
                            border={{ width: 0.5, style: 'solid', color: Theme.input.background, radius: '0.625rem' }}
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                        >
                            <i-label id="lblDurationInDays" font={{ color: Theme.input.fontColor }}></i-label>
                        </i-stack>
                    </i-stack>
                </i-panel>
                <i-panel padding={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                    <i-stack direction="vertical" width="100%" justifyContent="center" gap={5}>
                        <i-stack direction="horizontal" width="100%" alignItems="center" gap={2}>
                            <i-label id="lblTitlePrice" caption="Subscription Price"></i-label>
                            <i-icon
                                width="1rem"
                                height="1rem"
                                margin={{ left: 2 }}
                                name="info-circle"
                                tooltip={{ content: 'Amount of token to pay for the subscription', placement: 'bottom' }}
                            ></i-icon>
                        </i-stack>
                        <i-stack
                            direction="horizontal"
                            alignItems="center"
                            width="100%"
                            height={42}
                            background={{ color: Theme.input.background }}
                            border={{ width: 0.5, style: 'solid', color: Theme.input.background, radius: '0.625rem' }}
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                        >
                            <i-label id="lblPriceToMint" font={{ color: Theme.input.fontColor }}></i-label>
                        </i-stack>
                    </i-stack>
                </i-panel>
            </i-stack>
        </i-stack>
    }
}