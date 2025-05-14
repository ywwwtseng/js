type WebhookCallback = ({ chat_id, language_code }: {
    chat_id: number;
    language_code: string;
}) => Promise<void>;
export declare const telegramBotWebhook: <T extends string>(path: T, callkack: Record<string, WebhookCallback>) => {
    [x: string]: {
        POST: (req: Bun.BunRequest<T>) => Promise<Response>;
    };
};
export {};
