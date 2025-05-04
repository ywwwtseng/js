export const parse = (src) => {
    try {
        if (typeof src !== 'string') {
            return src;
        }
        return JSON.parse(src);
    }
    catch {
        return null;
    }
};
