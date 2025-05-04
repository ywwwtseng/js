export const parse = (src: unknown) => {
  try {
    if (typeof src !== 'string') {
      return src;
    }

    return JSON.parse(src) as unknown;
  } catch {
    return null;
  }
}