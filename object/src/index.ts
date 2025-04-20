export const prune = (src: Record<string, unknown>): Record<string, unknown> => {
  const obj: Record<string, unknown> = {};

  for (const key in src) {
    const value = src[key];

    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      obj[key] = prune(value as Record<string, unknown>);
    } else {
      obj[key] = value;
    }
  }

  return obj;
};