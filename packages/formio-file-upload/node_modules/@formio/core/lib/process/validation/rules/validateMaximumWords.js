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
exports.validateMaximumWordsInfo = exports.validateMaximumWordsSync = exports.validateMaximumWords = void 0;
const error_1 = require("../../../error");
const isValidatableTextFieldComponent = (component) => {
    var _a;
    return component && ((_a = component.validate) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('maxWords'));
};
const getValidationSetting = (component) => {
    var _a;
    let maxWords = (_a = component.validate) === null || _a === void 0 ? void 0 : _a.maxWords;
    if (typeof maxWords === 'string') {
        maxWords = parseInt(maxWords, 10);
    }
    return maxWords;
};
const shouldValidate = (context) => {
    const { component } = context;
    if (!isValidatableTextFieldComponent(component)) {
        return false;
    }
    const setting = getValidationSetting(component);
    if (setting === undefined) {
        return false;
    }
    if (!setting || Number.isNaN(setting)) {
        return false;
    }
    return true;
};
const validateMaximumWords = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.validateMaximumWordsSync)(context);
});
exports.validateMaximumWords = validateMaximumWords;
const validateMaximumWordsSync = (context) => {
    const { component, value } = context;
    if (!shouldValidate(context)) {
        return null;
    }
    const maxWords = getValidationSetting(component);
    if (maxWords && typeof value === 'string') {
        if (value.trim().split(/\s+/).length > maxWords) {
            const error = new error_1.FieldError('maxWords', Object.assign(Object.assign({}, context), { length: String(maxWords), setting: String(maxWords) }));
            return error;
        }
    }
    return null;
};
exports.validateMaximumWordsSync = validateMaximumWordsSync;
exports.validateMaximumWordsInfo = {
    name: 'validateMaximumWords',
    process: exports.validateMaximumWords,
    processSync: exports.validateMaximumWordsSync,
    shouldProcess: shouldValidate,
};
