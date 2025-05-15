import { redis, env } from 'bun';
import { sign } from '../../utils';

export const signin = (options: { jwt: { expirationTime: string } }) => ({
  '/api/admin/signin': {
    GET: async (req: Bun.BunRequest<'/api/admin/signin'>) => {
      const url = new URL(req.url);
      const code = url.searchParams.get('code');
      const key = `admin:code:${code}`;
      const telegram_id = env.NODE_ENV === 'development'
        ? env.PUBLIC_ADMIN_TELEGRAM_ID
        : await redis.get(key);

      if (!telegram_id) {
        return Response.redirect('/admin', 302);
      }

      await redis.del(key);

      const jwt = await sign({ telegram_id }, options.jwt.expirationTime, env.TELEGRAM_BOT_TOKEN!);

      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/admin',
          'Set-Cookie': `token=${jwt}; Path=/api/admin; HttpOnly; SameSite=Strict`
        }
      });
    },
  },
});