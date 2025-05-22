import { type ConnectedWallet, CHAIN } from '@tonconnect/ui';
import { parse } from '@lib/json';

export class MockTonConnectUI {
  public wallet: ConnectedWallet | null = (parse(sessionStorage.getItem('mock-tonconnect-wallet')) ?? null) as ConnectedWallet | null;
  public handleStatusChange: ((wallet: ConnectedWallet | null) => void) | undefined;

  public openModal() {
    this.wallet = {
      aboutUrl: 'https://wallet.tg/',
      account: {
        address: '0:31d4a6efd24c52b6e957e6fde4e2beb6139062ddad6fce4533e5920891060834',
        chain: CHAIN.MAINNET,
        publicKey: '',
        walletStateInit: '',
      },
      appName: 'telegram-wallet',
      bridgeUrl: 'https://walletbot.me/tonconnect-bridge/bridge',
      deepLink: undefined,
      device: {
        appName: 'telegram-wallet',
        appVersion: '1',
        maxProtocolVersion: 2,
        platform: 'iphone',
        features: [],
      },
      imageUrl: 'https://wallet.tg/images/logo-288.png',
      name: 'Wallet',
      openMethod: 'universal-link',
      platforms: [],
      provider: 'http',
      tondns: undefined,
      universalLink: 'https://t.me/wallet?attach=wallet',
    };

    sessionStorage.setItem('mock-tonconnect-wallet', JSON.stringify(this.wallet));

    this.handleStatusChange?.(this.wallet);
  }

  public openSingleWalletModal() {
    this.openModal();
  }

  get connected() {
    return Boolean(this.wallet);
  }

  public disconnect() {
    this.wallet = null;
    sessionStorage.removeItem('mock-tonconnect-wallet');

    this.handleStatusChange?.(null);
  }

  public onStatusChange(callback: (wallet: ConnectedWallet | null) => void) {
    this.handleStatusChange = callback;
  }

  public async sendTransaction(transaction: unknown) {
    if (!transaction) {
      throw new Error('No transaction provided');
    }

    return await Promise.resolve({
      boc: 'te6cckECBQEAAQ8AAeWIAGOpTd+kmKVt0q/N+8nFfWwnIMW7Wt+cimfLJBEiDBBoA5tLO3P///iLPC8cgAAAAFywpbPt0SyjKKP+pgdoCS3HOGx4DsPFJdoqlaYvVlI2MFgVWFq+Amn0HGCymL/Yp1oRcGcoQrd1e0RZYvDlzYQdAQIKDsPIbQMCAwAAAWhCACb9E6FPLcWEBk0D1M9egeSR+vDsWub7vsfG45zRS1emoI8NGAAAAAAAAAAAAAAAAAABBACqD4p+pQAAAAAAAAAAUCVAvkAIADmw7hDD2jYgSy8Rb0/sWJwW23I4Y/wpm480YKSU+pvrAAx1Kbv0kxStulX5v3k4r62E5Bi3a1vzkUz5ZIIkQYINAIz4HuA='
    });
  }
}