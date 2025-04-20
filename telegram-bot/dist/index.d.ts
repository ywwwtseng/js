export declare const MAX_MESSAGES_PER_MINUTE = 24;
export declare const DELAY_BETWEEN_MESSAGES_MS: number;
export type InlineKeyboard = {
    text: string;
    url: string;
}[][];
export type ReplyMarkup = {
    inline_keyboard: InlineKeyboard;
};
export declare function sendPhoto({ token, message, chat_id, photo_url, reply_markup, }: {
    token: string;
    message: string;
    chat_id: string;
    photo_url: string;
    reply_markup?: ReplyMarkup;
}): Promise<any>;
