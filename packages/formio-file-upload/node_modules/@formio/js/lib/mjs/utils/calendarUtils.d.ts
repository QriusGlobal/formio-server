/**
 * Checks the value for a min date and max date.
 * @param {moment} value
 *   The value to check.
 * @param {[string]} format
 *   A moment formats.
 * @param {Date} maxDate
 *   The max date.
 * @param {Date} minDate
 *   The min date.
 * @returns {{message: string, result: boolean}} - The response object.
 */
export function lessOrGreater(value: typeof moment, format: [string], maxDate: Date, minDate: Date): {
    message: string;
    result: boolean;
};
/**
 * Checks the entered date for validity.
 * @param {string} value - The value to check.
 * @param {[string]} format - A moment formats.
 * @param {Date} minDate - The minimum date.
 * @param {Date} maxDate - The maximum date.
 * @returns {{message: string, result: boolean}} - The response object.
 */
export function checkInvalidDate(value: string, format: [string], minDate: Date, maxDate: Date): {
    message: string;
    result: boolean;
};
export namespace CALENDAR_ERROR_MESSAGES {
    let INVALID: string;
    let INCOMPLETE: string;
    function greater(date: any, format: any): string;
    function less(date: any, format: any): string;
}
import moment from 'moment';
