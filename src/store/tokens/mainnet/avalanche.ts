import { ChainNativeTokenByChainId } from "@scom/scom-token-list";

export const Tokens_Avalanche = [
  {
    "name": "OpenSwap",
    "symbol": "OSWAP",
    "address": "0xb32aC3C79A94aC1eb258f3C830bBDbc676483c93",
    "decimals": 18,
    "isCommon": true
  },
  {
    "address": "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
    "name": "Tether USD",
    "symbol": "USDT.e",
    "decimals": 6,
    "isCommon": true
  },
  {
    ...ChainNativeTokenByChainId[43114]
  }
]
