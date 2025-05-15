export const cookies = (headers) => {
    const cookieHeader = headers.get('cookie') || '';
    return Object.fromEntries(cookieHeader.split(';').map(cookie => {
        const [key, value] = cookie.trim().split('=');
        return [key, value];
    }));
};
