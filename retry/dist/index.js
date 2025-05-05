import { delay } from '@libs/delay';
export const retry = ({ retries, delay_ms = 3000, condition, }) => {
    return async function retry(exec) {
        let attempts = 0;
        let result;
        while (attempts <= retries) {
            try {
                result = await exec();
                if (condition) {
                    if (condition(result)) {
                        return result; // 如果满足条件，返回结果
                    }
                }
                else {
                    return result; // 如果条件为空，直接返回结果
                }
            }
            catch (error) {
                if (attempts === 0) {
                    console.error(`retry: Request failed, tap to retry`, error);
                }
                else {
                    console.error(`retry: Attempt ${attempts} failed:`, error);
                }
            }
            attempts++;
            if (attempts < retries) {
                await delay(delay_ms * attempts);
            }
        }
        throw new Error(`retry: Failed after ${retries} attempts`);
    };
};
