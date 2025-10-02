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
exports.validateMinimumWordsInfo = exports.validateMinimumWordsSync = exports.validateMinimumWords = exports.shouldValidate = void 0;
const FieldError_1 = require("../../../error/FieldError");
const isValidatableTextFieldComponent = (component) => {
    var _a;
    return component && ((_a = component.validate) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('minWords'));
};
const getValidationSetting = (component) => {
    var _a;
    let minWords = (_a = component.validate) === null || _a === void 0 ? void 0 : _a.minWords;
    if (typeof minWords === 'string') {
        minWords = parseInt(minWords, 10);
    }
    return minWords;
};
const shouldValidate = (context) => {
    const { component, value } = context;
    if (!isValidatableTextFieldComponent(component)) {
        return false;
    }
    if (!getValidationSetting(component)) {
        return false;
    }
    if (!value || typeof value !== 'string') {
        return false;
    }
    return true;
};
exports.shouldValidate = shouldValidate;
const validateMinimumWords = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.validateMinimumWordsSync)(context);
});
exports.validateMinimumWords = validateMinimumWords;
const validateMinimumWordsSync = (context) => {
    const { component, value } = context;
    if (!(0, exports.shouldValidate)(context)) {
        return null;
    }
    const minWords = getValidationSetting(component);
    if (minWords && value && typeof value === 'string') {
        if (value.trim().split(/\s+/).length < minWords) {
            const error = new FieldError_1.FieldError('minWords', Object.assign(Object.assign({}, context), { length: String(minWords), setting: String(minWords) }));
            return error;
        }
    }
    return null;
};
exports.validateMinimumWordsSync = validateMinimumWordsSync;
exports.validateMinimumWordsInfo = {
    name: 'validateMinimumWords',
    process: exports.validateMinimumWords,
    processSync: exports.validateMinimumWordsSync,
    shouldProcess: exports.shouldValidate,
};
