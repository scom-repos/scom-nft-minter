var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@pageblock-nft-minter/config/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.textareaStyle = void 0;
    exports.textareaStyle = components_1.Styles.style({
        $nest: {
            'textarea': {
                border: 'none',
                outline: 'none'
            }
        }
    });
});
define("@pageblock-nft-minter/config", ["require", "exports", "@ijstech/components", "@pageblock-nft-minter/config/index.css.ts", "@ijstech/eth-wallet", "@pageblock-nft-minter/utils"], function (require, exports, components_2, index_css_1, eth_wallet_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    const ComboProductTypeItems = [
        {
            value: 'nft-minter',
            label: 'NFT Minter'
        }, {
            value: 'donation',
            label: 'Donation'
        }
    ];
    let Config = class Config extends components_2.Module {
        constructor() {
            super(...arguments);
            this.commissionsTableColumns = [
                {
                    title: 'Wallet Address',
                    fieldName: 'walletAddress',
                    key: 'walletAddress'
                },
                {
                    title: 'Share',
                    fieldName: 'share',
                    key: 'share',
                    onRenderCell: function (source, columnData, rowData) {
                        return utils_1.formatNumber(new eth_wallet_1.BigNumber(columnData).times(100).toFixed(), 4) + '%';
                    }
                },
                {
                    title: '',
                    fieldName: '',
                    key: '',
                    textAlign: 'center',
                    onRenderCell: async (source, data, rowData) => {
                        const icon = new components_2.Icon(undefined, {
                            name: "times",
                            fill: "#f7d063",
                            height: 18,
                            width: 18
                        });
                        icon.onClick = async (source) => {
                            const index = this.commissionInfoList.findIndex(v => v.walletAddress == rowData.walletAddress);
                            if (index >= 0) {
                                this.commissionInfoList.splice(index, 1);
                                this.tableCommissions.data = this.commissionInfoList;
                            }
                        };
                        return icon;
                    }
                }
            ];
        }
        async init() {
            super.init();
            this.commissionInfoList = [];
            this.onComboProductTypeChanged();
        }
        get data() {
            const config = {
                name: this.edtName.value || "",
                productType: this.comboProductType.selectedItem.value,
                description: this.edtDescription.value || "",
                link: this.edtLink.value || ""
            };
            if (this.edtPrice.value) {
                config.price = this.edtPrice.value;
            }
            if (this.edtMaxPrice.value) {
                config.maxPrice = this.edtMaxPrice.value;
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
            config.commissions = this.tableCommissions.data || [];
            return config;
        }
        set data(config) {
            this.uploadLogo.clear();
            if (config.logo) {
                this.uploadLogo.preview(config.logo);
            }
            this.edtName.value = config.name || "";
            this.comboProductType.selectedItem = ComboProductTypeItems.find(v => v.value == config.productType);
            this.onComboProductTypeChanged();
            this._logo = config.logo;
            this.edtLink.value = config.link || "";
            this.edtPrice.value = config.price || "";
            this.edtMaxPrice.value = config.maxPrice || "";
            this.edtMaxOrderQty.value = config.maxOrderQty || "";
            this.edtQty.value = config.qty || "";
            this.edtDescription.value = config.description || "";
            this.tokenSelection.token = config.token;
            this.tableCommissions.data = config.commissions || [];
            this.onMarkdownChanged();
        }
        async onChangeFile(source, files) {
            this._logo = files.length ? await this.uploadLogo.toBase64(files[0]) : undefined;
        }
        onRemove(source, file) {
            this._logo = undefined;
        }
        onMarkdownChanged() {
            this.markdownViewer.load(this.edtDescription.value || "");
        }
        onComboProductTypeChanged() {
            const selectedItem = this.comboProductType.selectedItem;
            if (selectedItem.value == 'nft-minter') {
                this.edtMaxOrderQty.enabled = true;
                this.edtPrice.enabled = true;
                this.edtMaxPrice.enabled = false;
                this.edtMaxPrice.value = '0';
                this.edtMaxOrderQty.value = '';
                this.edtPrice.value = '';
            }
            else if (selectedItem.value == 'donation') {
                this.edtMaxOrderQty.enabled = false;
                this.edtPrice.enabled = false;
                this.edtMaxPrice.enabled = true;
                this.edtMaxPrice.value = '';
                this.edtMaxOrderQty.value = '1';
                this.edtPrice.value = '0';
            }
        }
        onAddCommissionClicked() {
            this.modalAddCommission.visible = true;
        }
        onConfirmCommissionClicked() {
            if (!this.inputWalletAddress.value || !this.inputShare.value)
                return;
            this.modalAddCommission.visible = false;
            this.commissionInfoList.push({
                walletAddress: this.inputWalletAddress.value,
                share: new eth_wallet_1.BigNumber(this.inputShare.value).div(100).toFixed()
            });
            this.tableCommissions.data = this.commissionInfoList;
            this.inputWalletAddress.value = '';
            this.inputShare.value = '';
        }
        render() {
            return (this.$render("i-vstack", { gap: '0.5rem', padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                this.$render("i-label", { caption: 'Dapp Type:' }),
                this.$render("i-combo-box", { id: 'comboProductType', width: '100%', icon: { width: 14, height: 14, name: 'angle-down' }, items: ComboProductTypeItems, selectedItem: ComboProductTypeItems[0], onChanged: this.onComboProductTypeChanged.bind(this) }),
                this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                    this.$render("i-label", { caption: 'Name' }),
                    this.$render("i-label", { caption: "*", font: { color: Theme.colors.error.main } })),
                this.$render("i-input", { id: 'edtName', width: '100%' }),
                this.$render("i-label", { caption: 'Logo:' }),
                this.$render("i-upload", { id: 'uploadLogo', margin: { top: 8, bottom: 0 }, accept: 'image/*', draggable: true, caption: 'Drag and drop image here', showFileList: false, onChanged: this.onChangeFile.bind(this), onRemoved: this.onRemove.bind(this) }),
                this.$render("i-label", { caption: 'Descriptions:' }),
                this.$render("i-grid-layout", { templateColumns: ['50%', '50%'] },
                    this.$render("i-input", { id: 'edtDescription', class: index_css_1.textareaStyle, width: '100%', height: '100%', display: 'flex', stack: { grow: '1' }, resize: "none", inputType: 'textarea', font: { size: Theme.typography.fontSize, name: Theme.typography.fontFamily }, onChanged: this.onMarkdownChanged.bind(this) }),
                    this.$render("i-markdown", { id: 'markdownViewer', width: '100%', height: '100%', padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' } })),
                this.$render("i-label", { caption: 'Link:' }),
                this.$render("i-input", { id: 'edtLink', width: '100%' }),
                this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                    this.$render("i-label", { caption: 'Token' }),
                    this.$render("i-label", { caption: "*", font: { color: Theme.colors.error.main } })),
                this.$render("nft-minter-token-selection", { id: 'tokenSelection', width: '100%', background: { color: Theme.input.background }, border: { width: 1, style: 'solid', color: Theme.divider } }),
                this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                    this.$render("i-label", { caption: 'Price' }),
                    this.$render("i-label", { caption: "*", font: { color: Theme.colors.error.main } })),
                this.$render("i-input", { id: 'edtPrice', width: '100%', inputType: 'number' }),
                this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                    this.$render("i-label", { caption: 'Max Price' })),
                this.$render("i-input", { id: 'edtMaxPrice', width: '100%', inputType: 'number' }),
                this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                    this.$render("i-label", { caption: 'Qty' }),
                    this.$render("i-label", { caption: "*", font: { color: Theme.colors.error.main } })),
                this.$render("i-input", { id: 'edtQty', width: '100%', inputType: 'number' }),
                this.$render("i-hstack", { gap: 4, verticalAlignment: "center" },
                    this.$render("i-label", { caption: 'Max Order Qty' }),
                    this.$render("i-label", { caption: "*", font: { color: Theme.colors.error.main } })),
                this.$render("i-input", { id: 'edtMaxOrderQty', width: '100%', inputType: 'number' }),
                this.$render("i-hstack", { gap: 4, verticalAlignment: "center", horizontalAlignment: "space-between" },
                    this.$render("i-label", { caption: 'Commissions' }),
                    this.$render("i-button", { caption: "Add", padding: { top: '0.4rem', bottom: '0.4rem', left: '2rem', right: '2rem' }, onClick: this.onAddCommissionClicked.bind(this) })),
                this.$render("i-table", { id: 'tableCommissions', data: this.commissionInfoList, columns: this.commissionsTableColumns }),
                this.$render("i-modal", { id: 'modalAddCommission', maxWidth: '500px', closeIcon: { name: 'times-circle' } },
                    this.$render("i-grid-layout", { width: '100%', verticalAlignment: 'center', gap: { row: 5 }, padding: { top: '1rem', bottom: '1rem', left: '2rem', right: '2rem' }, templateColumns: ['1fr', '1fr'], templateRows: ['auto', 'auto', 'auto', 'auto'], templateAreas: [
                            ['title', 'title'],
                            ["lbWalletAddress", "walletAddress"],
                            ["lbShare", "share"],
                            ['btnConfirm', 'btnConfirm']
                        ] },
                        this.$render("i-hstack", { width: '100%', horizontalAlignment: 'center', grid: { area: 'title' }, padding: { bottom: '1rem' } },
                            this.$render("i-label", { caption: "Add Commission" })),
                        this.$render("i-label", { caption: "Wallet Address", grid: { area: 'lbWalletAddress' } }),
                        this.$render("i-input", { id: 'inputWalletAddress', grid: { area: 'walletAddress' }, width: '100%' }),
                        this.$render("i-label", { caption: "Share", grid: { area: 'lbShare' } }),
                        this.$render("i-hstack", { verticalAlignment: "center", grid: { area: 'share' }, width: '100%' },
                            this.$render("i-input", { id: 'inputShare' }),
                            this.$render("i-label", { caption: "%" })),
                        this.$render("i-hstack", { width: '100%', horizontalAlignment: 'center', grid: { area: 'btnConfirm' }, padding: { top: '1rem' } },
                            this.$render("i-button", { caption: "Confirm", padding: { top: '0.4rem', bottom: '0.4rem', left: '2rem', right: '2rem' }, onClick: this.onConfirmCommissionClicked.bind(this) }))))));
        }
    };
    Config = __decorate([
        components_2.customModule,
        components_2.customElements("nft-minter-config")
    ], Config);
    exports.default = Config;
});
