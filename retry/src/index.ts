import { delay } from '@libs/delay';

interface RetrySettings<T> {
  retries: number;
  delay_ms?: number;
  condition?: (result: T) => boolean;
}

export const retry = <T>({
  retries,
  delay_ms = 3000,
  condition,
}: RetrySettings<T>) => {
  return async function retry(exec: () => Promise<T>) {
    let attempts = 0;
    let result: T;

    while (attempts <= retries) {
      try {
        result = await exec();
        if (condition) {
          if (condition(result)) {
            return result; // 如果满足条件，返回结果
          }
        } else {
          return result; // 如果条件为空，直接返回结果
        }
      } catch (error) {
        if (attempts === 0) {
          console.error(`retry: Request failed, tap to retry`, error);
        } else {
          console.error(`retry: Attempt ${attempts} failed:`, error);
        }
      }
  
      attempts++;
  
      if (attempts < retries) {
        await delay(delay_ms * attempts);
      }
    }
  
    throw new Error(`retry: Failed after ${retries} attempts`);
  }
}