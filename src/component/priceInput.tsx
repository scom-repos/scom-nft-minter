import {
  customElements,
  ControlElement,
  Styles,
  Module,
  Container,
  Input,
  Label,
} from '@ijstech/components';
import { formInputStyle } from '../index.css';

const Theme = Styles.Theme.ThemeVars;

interface ScomNftMinterPriceInputElement extends ControlElement {
  value?: number;
  isUnitShown?: boolean;
}


declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-nft-minter-price-input']: ScomNftMinterPriceInputElement;
    }
  }
}

@customElements('i-scom-nft-minter-price-input')
export class ScomNftMinterPriceInput extends Module {
  private inputField: Input;
  private lbUnit: Label;

  static async create(options?: ScomNftMinterPriceInputElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  constructor(parent?: Container, options?: ScomNftMinterPriceInputElement) {
    super(parent, options);
  }

  get value() {
    const val = this.inputField?.value;
    return this.isNumber(val) ? Number(val) : undefined;
  }

  set value(val: number) {
    if (this.inputField) {
      this.inputField.value = val;
    }
  }

  set isUnitShown(val: boolean) {
    if (this.lbUnit) {
      this.lbUnit.visible = val;
    }
    if (this.inputField) {
      this.inputField.maxWidth = val ? 'calc(100% - 60px)' : '100%'
    }
  }

  onChanged() {

  }

  private isNumber(value: string | number) {
    if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
        return false;
    }
    return true;
}

  init() {
    super.init();
    const val = this.getAttribute('value', true);
    if (val) this.inputField.value = val;
    this.isUnitShown = this.getAttribute('isUnitShown', true, false);
  }

  render() {
    return (
      <i-hstack verticalAlignment="center">
        <i-input
          id="inputField"
          inputType="number"
          width="100%"
          minWidth="100px"
          height="42px"
          class={formInputStyle}
          onChanged={this.onChanged}
        />
        <i-label
          id="lbUnit"
          caption="Per Day"
          visible={false}
          margin={{ left: '0.5rem' }}
          font={{ color: Theme.text.primary }}
          stack={{ shrink: '0' }}
        />
      </i-hstack>
    )
  }
}
