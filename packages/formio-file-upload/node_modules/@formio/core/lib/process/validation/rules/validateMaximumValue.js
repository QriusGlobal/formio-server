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
exports.validateMaximumValueInfo = exports.validateMaximumValueSync = exports.validateMaximumValue = exports.shouldValidate = void 0;
const error_1 = require("../../../error");
const isValidatableNumberComponent = (component) => {
    var _a;
    return component && ((_a = component.validate) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('max'));
};
const getValidationSetting = (component) => {
    var _a;
    let max = (_a = component.validate) === null || _a === void 0 ? void 0 : _a.max;
    if (typeof max === 'string') {
        max = parseFloat(max);
    }
    return max;
};
const shouldValidate = (context) => {
    const { component, value } = context;
    if (!isValidatableNumberComponent(component)) {
        return false;
    }
    if (value === null) {
        return false;
    }
    if (Number.isNaN(getValidationSetting(component))) {
        return false;
    }
    return true;
};
exports.shouldValidate = shouldValidate;
const validateMaximumValue = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.validateMaximumValueSync)(context);
});
exports.validateMaximumValue = validateMaximumValue;
const validateMaximumValueSync = (context) => {
    const { component, value } = context;
    if (!(0, exports.shouldValidate)(context)) {
        return null;
    }
    const max = getValidationSetting(component);
    if (max === undefined || Number.isNaN(max)) {
        return null;
    }
    const parsedValue = typeof value === 'string' ? parseFloat(value) : Number(value);
    if (Number.isNaN(parsedValue)) {
        throw new error_1.ProcessorError(`Cannot validate value ${parsedValue} because it is invalid`, context, 'validate:validateMaximumValue');
    }
    return parsedValue <= max
        ? null
        : new error_1.FieldError('max', Object.assign(Object.assign({}, context), { max: String(max), setting: String(max) }));
};
exports.validateMaximumValueSync = validateMaximumValueSync;
exports.validateMaximumValueInfo = {
    name: 'validateMaximumValue',
    process: exports.validateMaximumValue,
    processSync: exports.validateMaximumValueSync,
    shouldProcess: exports.shouldValidate,
};
