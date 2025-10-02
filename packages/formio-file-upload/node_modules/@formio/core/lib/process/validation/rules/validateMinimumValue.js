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
exports.validateMinimumValueInfo = exports.validateMinimumValueSync = exports.validateMinimumValue = exports.shouldValidate = void 0;
const error_1 = require("../../../error");
const isValidatableNumberComponent = (component) => {
    var _a;
    return component && ((_a = component.validate) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('min'));
};
const getValidationSetting = (component) => {
    var _a;
    let min = (_a = component.validate) === null || _a === void 0 ? void 0 : _a.min;
    if (typeof min === 'string') {
        min = parseFloat(min);
    }
    return min;
};
const shouldValidate = (context) => {
    const { component, value } = context;
    if (!isValidatableNumberComponent(component)) {
        return false;
    }
    if (Number.isNaN(parseFloat(value))) {
        return false;
    }
    if (Number.isNaN(getValidationSetting(component))) {
        return false;
    }
    return true;
};
exports.shouldValidate = shouldValidate;
const validateMinimumValue = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.validateMinimumValueSync)(context);
});
exports.validateMinimumValue = validateMinimumValue;
const validateMinimumValueSync = (context) => {
    const { component, value } = context;
    if (!(0, exports.shouldValidate)(context)) {
        return null;
    }
    const min = getValidationSetting(component);
    if (min === undefined) {
        return null;
    }
    const parsedValue = typeof value === 'string' ? parseFloat(value) : Number(value);
    if (Number.isNaN(parsedValue)) {
        throw new error_1.ProcessorError(`Cannot validate value ${parsedValue} because it is invalid`, context, 'validate:validateMinimumValue');
    }
    return parsedValue >= min
        ? null
        : new error_1.FieldError('min', Object.assign(Object.assign({}, context), { min: String(min), setting: String(min) }));
};
exports.validateMinimumValueSync = validateMinimumValueSync;
exports.validateMinimumValueInfo = {
    name: 'validateMinimumValue',
    process: exports.validateMinimumValue,
    processSync: exports.validateMinimumValueSync,
    shouldProcess: exports.shouldValidate,
};
