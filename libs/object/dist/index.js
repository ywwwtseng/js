export const prune = (src) => {
    const obj = {};
    for (const key in src) {
        const value = src[key];
        if (value === null || value === undefined) {
            continue;
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
            obj[key] = prune(value);
        }
        else {
            obj[key] = value;
        }
    }
    return obj;
};
