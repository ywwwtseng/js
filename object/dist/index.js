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
export const get = (obj, path, callback) => {
    const keys = path.split('.');
    let anchor = obj;
    for (let i = 0; i < keys.length; i++) {
        anchor = anchor[keys[i]];
        if (anchor === undefined) {
            return callback ?? undefined;
        }
    }
    return anchor;
};
export const is = (obj) => {
    return obj && typeof obj === 'object' && !Array.isArray(obj);
};
export const merge = (target, ...sources) => {
    for (const source of sources) {
        if (!is(source))
            continue;
        for (const key in source) {
            const sourceValue = source[key];
            const targetValue = target[key];
            if (is(sourceValue)) {
                if (!is(targetValue)) {
                    target[key] = {};
                }
                merge(target[key], sourceValue);
            }
            else {
                target[key] = sourceValue;
            }
        }
    }
    return target;
};
