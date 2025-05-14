export declare const MAX_MESSAGES_PER_MINUTE = 24;
export declare const DELAY_BETWEEN_MESSAGES_MS: number;
export type InlineKeyboard = {
    text: string;
    url: string;
}[][];
export type ReplyMarkup = {
    inline_keyboard: InlineKeyboard;
};
export declare function sendPhoto({ token, chat_id, photo_url, message, reply_markup, }: {
    token: string;
    chat_id: string;
    photo_url: string;
    message: string;
    reply_markup?: ReplyMarkup;
}): Promise<any>;
export declare function sendMessage({ token, chat_id, message, reply_markup, }: {
    token: string;
    chat_id: string;
    message: string;
    reply_markup?: ReplyMarkup;
}): Promise<any>;
