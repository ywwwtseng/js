import { TonConnectUI } from '@tonconnect/ui';
import { MockTonConnectUI } from './MockTonConnectUI';
const DEFAULT_TON_CONNECT_PARAMETERS = {
    TonConnectUI: TonConnectUI,
};
export { MockTonConnectUI, TonConnectUI };
export class TonConnect {
    tonConnectUI;
    constructor({ TonConnectUI, onStatusChange } = DEFAULT_TON_CONNECT_PARAMETERS) {
        this.tonConnectUI = new TonConnectUI({
            manifestUrl: new URL('tonconnect-manifest.json', window.location.href).toString(),
        });
        if (onStatusChange) {
            this.tonConnectUI.onStatusChange(onStatusChange);
        }
    }
    async connect() {
        if (!this.connected) {
            // await this.tonConnectUI.openSingleWalletModal('telegram-wallet');
            await this.tonConnectUI.openModal();
        }
    }
    async disconnect() {
        await this.tonConnectUI.disconnect();
    }
    async sendTransaction(message) {
        try {
            const result = await this.tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 360, // 360 sec
                messages: [message]
            });
            return result;
        }
        catch (error) {
            console.error('Transaction failed:', error);
            throw error; // 抛出错误以便外部处理
        }
    }
    get wallet() {
        return this.tonConnectUI.wallet;
    }
    get connected() {
        return this.tonConnectUI.connected;
    }
}
