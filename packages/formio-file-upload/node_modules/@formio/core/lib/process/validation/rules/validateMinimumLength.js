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
exports.validateMinimumLengthInfo = exports.validateMinimumLengthSync = exports.validateMinimumLength = exports.shouldValidate = void 0;
const error_1 = require("../../../error");
const isValidatableTextFieldComponent = (component) => {
    var _a;
    return component && ((_a = component.validate) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('minLength'));
};
const getValidationSetting = (component) => {
    var _a;
    let minLength = (_a = component.validate) === null || _a === void 0 ? void 0 : _a.minLength;
    if (typeof minLength === 'string') {
        minLength = parseInt(minLength, 10);
    }
    return minLength;
};
const shouldValidate = (context) => {
    const { component, value } = context;
    if (!isValidatableTextFieldComponent(component) || !value) {
        return false;
    }
    if (!value) {
        return false;
    }
    if (!getValidationSetting(component)) {
        return false;
    }
    return true;
};
exports.shouldValidate = shouldValidate;
const validateMinimumLength = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.validateMinimumLengthSync)(context);
});
exports.validateMinimumLength = validateMinimumLength;
const validateMinimumLengthSync = (context) => {
    const { component, value } = context;
    if (!(0, exports.shouldValidate)(context)) {
        return null;
    }
    const minLength = getValidationSetting(component);
    if (value && minLength && typeof value === 'string') {
        if (value.length < minLength) {
            const error = new error_1.FieldError('minLength', Object.assign(Object.assign({}, context), { length: String(minLength), setting: String(minLength) }));
            return error;
        }
    }
    return null;
};
exports.validateMinimumLengthSync = validateMinimumLengthSync;
exports.validateMinimumLengthInfo = {
    name: 'validateMinimumLength',
    process: exports.validateMinimumLength,
    processSync: exports.validateMinimumLengthSync,
    shouldProcess: exports.shouldValidate,
};
