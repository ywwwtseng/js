import { env, redis, randomUUIDv7 } from 'bun';
import * as model from '@lib/model';
import * as telegramBot from '@lib/telegram-bot'; 

export const admin = () => ({
  '/admin': async ({ chat_id }) => {
    const user = await model.receive(String(chat_id), 'user');
    if (user.meta.role === 'admin') {
      const code = randomUUIDv7();
      const key = `admin:code:${code}`;

      await redis.set(key, String(chat_id));
      await redis.expire(key, 10);

      if (env.NODE_ENV === 'development') {
        console.log(`https://${env.DOMAIN}/api/admin/sigin?code=${code}`);
        return;
      }

      await telegramBot.sendMessage({
        token: env.TELEGRAM_BOT_TOKEN!,
        chat_id: String(chat_id),
        message: 'Admin Sign in',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Go',
                url: `https://${env.DOMAIN}/api/admin/sigin?code=${code}`,
              },
            ]
          ],
        }
      });
    }
  },
});