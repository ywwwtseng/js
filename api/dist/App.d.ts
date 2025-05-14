import type { WebhookCallback } from './services';
interface AppOptions {
    port?: number;
    routes?: Record<string, any>;
    bot?: Record<string, WebhookCallback>;
}
export declare function App({ routes, bot, port }?: AppOptions): Bun.Server;
export {};
