/**
 * @typedef {any[]} Args
 */
/**
 * Function to be retried
 * @callback RetryFunction
 * @param {...Args} args
 * @returns {Promise<any>}
 */
/**
 * Executes a function with retries in case of failure.
 * @param {RetryFunction} fn - The function to be executed.
 * @param {Args} args - The arguments to be passed to the function.
 * @param {number} [retries] - The number of retries in case of failure.
 * @param {string} [err] - The error message to be thrown after all retries have failed.
 * @returns {Promise<any>} The result of the function execution.
 * @throws {Error} When all retries have failed.
 */
export function withRetries(fn: RetryFunction, args: Args, retries?: number | undefined, err?: string | undefined): Promise<any>;
export type Args = any[];
/**
 * Function to be retried
 */
export type RetryFunction = (...args: Args[]) => Promise<any>;
