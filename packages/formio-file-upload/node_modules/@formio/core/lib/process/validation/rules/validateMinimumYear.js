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
exports.validateMinimumYearInfo = exports.validateMinimumYearSync = exports.validateMinimumYear = exports.shouldValidate = void 0;
const error_1 = require("../../../error");
const isValidatableDayComponent = (component) => {
    var _a;
    return (component &&
        (component === null || component === void 0 ? void 0 : component.type) === 'day' &&
        (component.hasOwnProperty('minYear') || ((_a = component.year) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('minYear'))));
};
const shouldValidate = (context) => {
    var _a, _b;
    const { component } = context;
    if (!isValidatableDayComponent(component)) {
        return false;
    }
    if (!component.minYear && !((_b = (_a = component.fields) === null || _a === void 0 ? void 0 : _a.year) === null || _b === void 0 ? void 0 : _b.minYear)) {
        return false;
    }
    return true;
};
exports.shouldValidate = shouldValidate;
const validateMinimumYear = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.validateMinimumYearSync)(context);
});
exports.validateMinimumYear = validateMinimumYear;
const validateMinimumYearSync = (context) => {
    var _a, _b;
    const { component, value } = context;
    if (!(0, exports.shouldValidate)(context)) {
        return null;
    }
    if (typeof value !== 'string' && typeof value !== 'number') {
        throw new error_1.ProcessorError(`Cannot validate minimum year for value ${value}`, context, 'validate:validateMinimumYear');
    }
    const testValue = typeof value === 'string' ? value : String(value);
    const testArr = /\d{4}$/.exec(testValue);
    const year = testArr ? testArr[0] : null;
    if (component.minYear &&
        ((_b = (_a = component.fields) === null || _a === void 0 ? void 0 : _a.year) === null || _b === void 0 ? void 0 : _b.minYear) &&
        component.minYear !== component.fields.year.minYear) {
        throw new error_1.ProcessorError('Cannot validate minimum year, component.minYear and component.fields.year.minYear are not equal', context, 'validate:validateMinimumYear');
    }
    const minYear = component.minYear;
    if (!minYear || !year) {
        return null;
    }
    return +year >= +minYear
        ? null
        : new error_1.FieldError('minYear', Object.assign(Object.assign({}, context), { minYear: String(minYear), setting: String(minYear) }));
};
exports.validateMinimumYearSync = validateMinimumYearSync;
exports.validateMinimumYearInfo = {
    name: 'validateMinimumYear',
    process: exports.validateMinimumYear,
    processSync: exports.validateMinimumYearSync,
    shouldProcess: exports.shouldValidate,
};
