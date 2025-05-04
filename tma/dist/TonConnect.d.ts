import { type ConnectedWallet, TonConnectUI } from '@tonconnect/ui';
import { MockTonConnectUI } from './MockTonConnectUI';
import type { TransactionMessage } from './types';
interface TonConnectParameters {
    TonConnectUI: typeof TonConnectUI | typeof MockTonConnectUI;
    onStatusChange?: (wallet?: ConnectedWallet | null) => void;
}
export { MockTonConnectUI, TonConnectUI };
export type { ConnectedWallet };
export declare class TonConnect {
    tonConnectUI: TonConnectUI | MockTonConnectUI;
    constructor({ TonConnectUI, onStatusChange }?: TonConnectParameters);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(message: TransactionMessage): Promise<import("@tonconnect/ui").SendTransactionResponse>;
    get wallet(): import("@tonconnect/ui").Wallet | (import("@tonconnect/ui").Wallet & import("@tonconnect/ui").WalletInfoInjectable) | (import("@tonconnect/ui").Wallet & import("@tonconnect/ui").WalletInfoRemote & {
        openMethod?: import("@tonconnect/ui").WalletOpenMethod;
    }) | (import("@tonconnect/ui").Wallet & import("@tonconnect/ui").WalletInfoInjectable & import("@tonconnect/ui").WalletInfoRemote & {
        openMethod?: import("@tonconnect/ui").WalletOpenMethod;
    });
    get connected(): boolean;
}
