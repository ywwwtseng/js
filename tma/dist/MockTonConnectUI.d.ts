import { type ConnectedWallet } from '@tonconnect/ui';
export declare class MockTonConnectUI {
    wallet: ConnectedWallet | null;
    handleStatusChange: ((wallet: ConnectedWallet | null) => void) | undefined;
    openModal(): void;
    openSingleWalletModal(): void;
    get connected(): boolean;
    disconnect(): void;
    onStatusChange(callback: (wallet: ConnectedWallet | null) => void): void;
    sendTransaction(transaction: unknown): Promise<{
        boc: string;
    }>;
}
