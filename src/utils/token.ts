import { BigNumber, Erc20, IWallet, ISendTxEventsOptions, Wallet } from "@ijstech/eth-wallet";
import { ITokenObject } from "@scom/scom-token-list";

export const nullAddress = '0x0000000000000000000000000000000000000000'

export const getERC20Amount = async (wallet: IWallet, tokenAddress: string, decimals: number) => {
  try {
    let erc20 = new Erc20(wallet, tokenAddress, decimals);
    return await erc20.balance;
  } catch {
    return new BigNumber(0);
  }
}

export const getTokenBalance = async (wallet: IWallet, token: ITokenObject) => {
  let balance = new BigNumber(0);
  if (!token) return balance;
  if (token.address && token.address !== nullAddress) {
    balance = await getERC20Amount(wallet, token.address, token.decimals);
  } else {
    balance = await wallet.balance;
  }
  return balance;
}

export const getTokenInfo = async (address: string, chainId: number) => {
  let token: ITokenObject;
  const wallet = Wallet.getClientInstance();
  wallet.chainId = chainId;
  const isValidAddress = wallet.isAddress(address);
  if (isValidAddress) {
    const tokenAddress = wallet.toChecksumAddress(address);
    const tokenInfo = await wallet.tokenInfo(tokenAddress);
    if (tokenInfo?.symbol) {
      token = {
        chainId,
        address: tokenAddress,
        name: tokenInfo.name,
        decimals: tokenInfo.decimals,
        symbol: tokenInfo.symbol
      }
    }
  }
  return token;
}

export const registerSendTxEvents = (sendTxEventHandlers: ISendTxEventsOptions) => {
  const wallet = Wallet.getClientInstance();
  wallet.registerSendTxEvents({
    transactionHash: (error: Error, receipt?: string) => {
      if (sendTxEventHandlers.transactionHash) {
        sendTxEventHandlers.transactionHash(error, receipt);
      }
    },
    confirmation: (receipt: any) => {
      if (sendTxEventHandlers.confirmation) {
        sendTxEventHandlers.confirmation(receipt);
      }
    },
  })
}