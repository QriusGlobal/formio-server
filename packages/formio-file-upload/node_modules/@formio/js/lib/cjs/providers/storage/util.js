"use strict";
/**
 * @typedef {any[]} Args
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetries = void 0;
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
function withRetries(fn, args, retries = 3, err = null) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!retries) {
            throw new Error(err);
        }
        return fn(...args).catch(() => withRetries(fn, args, retries - 1, err));
    });
}
exports.withRetries = withRetries;
