import { retry } from '@lib/retry';
export const ipAddress = (headers) => {
    if (headers instanceof Headers) {
        return headers.get('x-forwarded-for')?.split(',')?.[0] || headers.get('x-real-ip') || '127.0.0.1';
    }
    return headers?.['x-forwarded-for']?.split(',')?.[0] || headers?.['x-real-ip'] || '127.0.0.1';
};
export const ipinfo = async (headers) => {
    const ip = ipAddress(headers).replace('::ffff:', '');
    const data = await retry({
        retries: 3,
        delay_ms: 1000,
    })(() => fetch(`https://ipinfo.io/${ip}/json`).then((res) => res.json()));
    if (!data || data.bogon || data.ip === '::1') {
        return {
            ip: undefined,
            country: undefined,
            city: undefined,
            loc: undefined,
            timezone: undefined,
        };
    }
    return {
        ip: data.ip || undefined,
        country: data.country || undefined,
        city: data.city || undefined,
        loc: data.loc || undefined,
        timezone: data.timezone || undefined,
    };
};
