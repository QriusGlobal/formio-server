"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInvalidDate = exports.lessOrGreater = exports.CALENDAR_ERROR_MESSAGES = void 0;
const moment_1 = __importDefault(require("moment"));
const lodash_1 = __importDefault(require("lodash"));
exports.CALENDAR_ERROR_MESSAGES = {
    INVALID: 'You entered the Invalid Date',
    INCOMPLETE: 'You entered an incomplete date.',
    greater(date, format) {
        return `The entered date is greater than ${date.format(format)}`;
    },
    less(date, format) {
        return `The entered date is less than ${date.format(format)}`;
    }
};
/**
 * Builds the response for checkInvalidDate.
 * @param {string} message
 *   The message for response.
 * @param {boolean} result
 *   The boolean flag for response.
 * @returns {{message: string, result: boolean}} - The response object.
 */
function buildResponse(message, result) {
    return {
        message,
        result
    };
}
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
function lessOrGreater(value, format, maxDate, minDate) {
    let message = '';
    let result = true;
    if (maxDate && value.isValid()) {
        const maxDateMoment = (0, moment_1.default)(maxDate, format);
        if (value > maxDateMoment) {
            message = exports.CALENDAR_ERROR_MESSAGES.greater(maxDateMoment, format);
            result = false;
        }
    }
    if (minDate && value.isValid()) {
        const minDateMoment = (0, moment_1.default)(minDate, format);
        if (value < minDateMoment) {
            message = exports.CALENDAR_ERROR_MESSAGES.less(minDateMoment, format);
            result = false;
        }
    }
    return {
        message,
        result
    };
}
exports.lessOrGreater = lessOrGreater;
/**
 * Checks the entered date for validity.
 * @param {string} value - The value to check.
 * @param {[string]} format - A moment formats.
 * @param {Date} minDate - The minimum date.
 * @param {Date} maxDate - The maximum date.
 * @returns {{message: string, result: boolean}} - The response object.
 */
function checkInvalidDate(value, format, minDate, maxDate) {
    const date = (0, moment_1.default)(value, format, true);
    const isValidDate = date.isValid();
    if (!isValidDate) {
        const delimeters = value.match(/[^a-z0-9_]/gi);
        const delimetersRegEx = new RegExp(delimeters.join('|'), 'gi');
        const inputParts = value.replace(/_*/gi, '').split(delimetersRegEx);
        const formatParts = format[1] ? format[1].split(delimetersRegEx) : format[0].split(delimetersRegEx);
        const timeIndex = lodash_1.default.findIndex(formatParts, (part, index) => part.length === 1 && index === formatParts.length - 1);
        const yearIndex = lodash_1.default.findIndex(formatParts, part => part.match(/yyyy/gi));
        if (inputParts[yearIndex] / 1000 < 1) {
            return buildResponse(exports.CALENDAR_ERROR_MESSAGES.INVALID, false);
        }
        if (inputParts[0].length === formatParts[0].length) {
            const modifiedParts = inputParts.map((part, index) => {
                let partValue = part;
                if (!part && index === timeIndex) {
                    partValue = 'AM';
                }
                else if (!part) {
                    partValue = '01';
                }
                if (delimeters[index]) {
                    partValue = `${partValue}${delimeters[index]}`;
                }
                return partValue;
            });
            const problemDate = (0, moment_1.default)(modifiedParts.join(''), format, true);
            if (problemDate.isValid()) {
                const checkedLessOrGreater = lessOrGreater(problemDate, format[0], maxDate, minDate);
                if (!checkedLessOrGreater.result) {
                    const { message, result } = checkedLessOrGreater;
                    return buildResponse(message, result);
                }
                return buildResponse(exports.CALENDAR_ERROR_MESSAGES.INCOMPLETE, false);
            }
            else {
                return buildResponse(exports.CALENDAR_ERROR_MESSAGES.INVALID, false);
            }
        }
        else {
            return buildResponse(exports.CALENDAR_ERROR_MESSAGES.INVALID, false);
        }
    }
    else if (isValidDate && value.indexOf('_') === -1) {
        const checkedLessOrGreater = lessOrGreater(date, format[0], maxDate, minDate);
        if (!checkedLessOrGreater.result) {
            const { message, result } = checkedLessOrGreater;
            return buildResponse(message, result);
        }
    }
    return buildResponse('', true);
}
exports.checkInvalidDate = checkInvalidDate;
