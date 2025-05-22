import { prune } from '@lib/object';
export const MAX_MESSAGES_PER_MINUTE = 24;
export const DELAY_BETWEEN_MESSAGES_MS = (60 * 1000) / MAX_MESSAGES_PER_MINUTE;
export async function sendPhoto({ token, chat_id, photo_url, message, reply_markup, }) {
    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prune({
                chat_id,
                photo: photo_url,
                caption: message,
                parse_mode: 'Markdown',
                reply_markup,
            })),
        });
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
}
export async function sendMessage({ token, chat_id, message, reply_markup, }) {
    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prune({
                chat_id,
                text: message,
                parse_mode: 'Markdown',
                reply_markup,
            })),
        });
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
}
