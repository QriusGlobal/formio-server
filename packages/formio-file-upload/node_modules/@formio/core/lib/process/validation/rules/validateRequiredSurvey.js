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
exports.validateRequiredSurveyInfo = exports.validateRequiredSurveySync = exports.shouldValidate = exports.validateRequiredSurvey = void 0;
const error_1 = require("../../../error");
const isValidatableSurveyDataObject = (obj) => {
    return Object.entries(obj).every(([key, value]) => typeof key === 'string' && typeof value === 'string');
};
const isValidatableSurveyComponent = (component) => {
    var _a;
    return component && component.type === 'survey' && ((_a = component.validate) === null || _a === void 0 ? void 0 : _a.required);
};
const validateRequiredSurvey = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.validateRequiredSurveySync)(context);
});
exports.validateRequiredSurvey = validateRequiredSurvey;
const shouldValidate = (context) => {
    const { component, value } = context;
    if (!isValidatableSurveyComponent(component)) {
        return false;
    }
    if (!value) {
        return false;
    }
    return true;
};
exports.shouldValidate = shouldValidate;
const validateRequiredSurveySync = (context) => {
    const { component, value } = context;
    if (!(0, exports.shouldValidate)(context)) {
        return null;
    }
    if (!isValidatableSurveyDataObject(value)) {
        throw new error_1.ProcessorError(`Cannot validate survey component because ${value} is not valid`, context, 'validate:validateRequiredSurvey');
    }
    for (const question of component.questions) {
        if (!value[question.value]) {
            const error = new error_1.FieldError('requiredSurvey', context, 'required');
            return error;
        }
    }
    return null;
};
exports.validateRequiredSurveySync = validateRequiredSurveySync;
exports.validateRequiredSurveyInfo = {
    name: 'validateRequiredSurvey',
    process: exports.validateRequiredSurvey,
    processSync: exports.validateRequiredSurveySync,
    shouldProcess: exports.shouldValidate,
};
