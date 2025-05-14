import { prune } from '@libs/object';

export const MAX_MESSAGES_PER_MINUTE = 24;
export const DELAY_BETWEEN_MESSAGES_MS = (60 * 1000) / MAX_MESSAGES_PER_MINUTE;

export type InlineKeyboard = {
  text: string;
  url: string;
}[][];

export type ReplyMarkup = {
  inline_keyboard: InlineKeyboard;
};

export async function sendPhoto({
  token,
  chat_id,
  photo_url,
  message,
  reply_markup,
}: {
  token: string;
  chat_id: string;
  photo_url: string;
  message: string;
  reply_markup?: ReplyMarkup;
}) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        prune({
          chat_id,
          photo: photo_url,
          caption: message,
          parse_mode: 'Markdown',
          reply_markup,
        }),
      ),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function sendMessage({
  token,
  chat_id,
  message,
  reply_markup,
}: {
  token: string;
  chat_id: string;
  message: string;
  reply_markup?: ReplyMarkup;
}) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        prune({
          chat_id,
          text: message,
          parse_mode: 'Markdown',
          reply_markup,
        }),
      ),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}
