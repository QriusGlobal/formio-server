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
exports.validateMaximumSelectedCountInfo = exports.validateMaximumSelectedCountSync = exports.validateMaximumSelectedCount = exports.shouldValidate = void 0;
const error_1 = require("../../../error");
const isValidatableSelectBoxesComponent = (component) => {
    var _a;
    return component && ((_a = component.validate) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('maxSelectedCount'));
};
const getValidationSetting = (component) => {
    var _a;
    let max = (_a = component.validate) === null || _a === void 0 ? void 0 : _a.maxSelectedCount;
    if (typeof max === 'string') {
        max = parseFloat(max);
    }
    return max;
};
const shouldValidate = (context) => {
    const { component, value } = context;
    if (!isValidatableSelectBoxesComponent(component)) {
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
function validateValue(value, context) {
    if (value == null || typeof value !== 'object') {
        throw new error_1.ProcessorError(`Cannot validate maximum selected count for value ${value} as it is not an object`, context, 'validate:validateMaximumSelectedCount');
    }
    const subValues = Object.values(value);
    if (!subValues.every((value) => typeof value === 'boolean')) {
        throw new error_1.ProcessorError(`Cannot validate maximum selected count for value ${value} because it has non-boolean members`, context, 'validate:validateMaximumSelectedCount');
    }
}
const validateMaximumSelectedCount = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.validateMaximumSelectedCountSync)(context);
});
exports.validateMaximumSelectedCount = validateMaximumSelectedCount;
const validateMaximumSelectedCountSync = (context) => {
    const { component, value } = context;
    try {
        if (!(0, exports.shouldValidate)(context)) {
            return null;
        }
        validateValue(value, context);
        const max = getValidationSetting(component);
        if (!max) {
            return null;
        }
        const count = Object.keys(value).reduce((sum, key) => (value[key] ? ++sum : sum), 0);
        // Should not be triggered if there is no options selected at all
        if (count <= 0) {
            return null;
        }
        return count > max
            ? new error_1.FieldError(component.maxSelectedCountMessage || 'maxSelectedCount', Object.assign(Object.assign({}, context), { maxCount: String(max), setting: String(max) }))
            : null;
    }
    catch (err) {
        throw new error_1.ProcessorError(err.message || err, context, 'validate:validateMaximumSelectedCount');
    }
};
exports.validateMaximumSelectedCountSync = validateMaximumSelectedCountSync;
exports.validateMaximumSelectedCountInfo = {
    name: 'validateMaximumSelectedCount',
    process: exports.validateMaximumSelectedCount,
    processSync: exports.validateMaximumSelectedCountSync,
    shouldProcess: exports.shouldValidate,
};
