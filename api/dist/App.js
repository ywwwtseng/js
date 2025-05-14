import { env } from 'bun';
import { AppError, ErrorCodes } from '@libs/errors';
import * as services from './services';
import * as webhooks from './webhooks';
import { init, headers } from './utils';
export function App({ routes, bot, port } = {}) {
    init(env, [
        'POSTGRES_URL',
        'REDIS_URL',
        'TELEGRAM_BOT_TOKEN',
        'PUBLIC_ADMIN_TELEGRAM_ID',
        'PUBLIC_TELEGRAM_BOT_LINK',
        'DOMAIN'
    ]);
    const app = Bun.serve({
        routes: {
            '/api/status': new Response('OK'),
            ...services.webhooks('/api/telegram/webhook', {
                ...(routes['/admin/signin'] ? webhooks.admin() : {}),
                ...bot,
            }),
            ...routes,
        },
        error(bunError) {
            const error = bunError instanceof AppError
                ? bunError
                : new AppError(ErrorCodes.INTERNAL_SERVER_ERROR, bunError?.toString() || JSON.stringify(bunError));
            return Response.json(error, {
                status: error.status,
                headers: headers(),
            });
        },
        port: port ?? 3000,
    });
    return app;
}
