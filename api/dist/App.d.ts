import type { WebhookCallback } from './services';
export declare class App {
    #private;
    constructor();
    use: (service: unknown) => this;
    bot: ({ onText }: {
        onText: Record<string, WebhookCallback>;
    }) => this;
    listen: (port?: number) => Bun.Server;
}
