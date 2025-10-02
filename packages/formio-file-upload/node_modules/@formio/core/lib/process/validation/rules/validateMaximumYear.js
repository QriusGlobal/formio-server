"use strict";
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
exports.validateMaximumYearInfo = exports.validateMaximumYearSync = exports.validateMaximumYear = exports.shouldValidate = void 0;
const error_1 = require("../../../error");
const isValidatableDayComponent = (component) => {
    var _a, _b;
    return (component &&
        component.type === 'day' &&
        (component.hasOwnProperty('maxYear') || ((_b = (_a = component.fields) === null || _a === void 0 ? void 0 : _a.year) === null || _b === void 0 ? void 0 : _b.hasOwnProperty('maxYear'))));
};
const shouldValidate = (context) => {
    const { component } = context;
    if (!isValidatableDayComponent(component)) {
        return false;
    }
    if (!component.maxYear && !component.fields.year.maxYear) {
        return false;
    }
    return true;
};
exports.shouldValidate = shouldValidate;
const validateMaximumYear = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.validateMaximumYearSync)(context);
});
exports.validateMaximumYear = validateMaximumYear;
const validateMaximumYearSync = (context) => {
    var _a, _b;
    const { component, value } = context;
    if (!(0, exports.shouldValidate)(context)) {
        return null;
    }
    if (typeof value !== 'string' && typeof value !== 'number') {
        throw new error_1.ProcessorError(`Cannot validate maximum year for value ${value}`, context, 'validate:validateMaximumYear');
    }
    const testValue = typeof value === 'string' ? value : String(value);
    const testArr = /\d{4}$/.exec(testValue);
    const year = testArr ? testArr[0] : null;
    if (component.maxYear &&
        ((_b = (_a = component.fields) === null || _a === void 0 ? void 0 : _a.year) === null || _b === void 0 ? void 0 : _b.maxYear) &&
        component.maxYear !== component.fields.year.maxYear) {
        throw new error_1.ProcessorError('Cannot validate maximum year, component.maxYear and component.fields.year.maxYear are not equal', context, 'validate:validateMaximumYear');
    }
    const maxYear = component.maxYear || component.fields.year.maxYear;
    if (!maxYear || !year) {
        return null;
    }
    return +year <= +maxYear
        ? null
        : new error_1.FieldError('maxYear', Object.assign(Object.assign({}, context), { maxYear: String(maxYear), setting: String(maxYear) }));
};
exports.validateMaximumYearSync = validateMaximumYearSync;
exports.validateMaximumYearInfo = {
    name: 'validateMaximumYear',
    process: exports.validateMaximumYear,
    processSync: exports.validateMaximumYearSync,
    shouldProcess: exports.shouldValidate,
};
