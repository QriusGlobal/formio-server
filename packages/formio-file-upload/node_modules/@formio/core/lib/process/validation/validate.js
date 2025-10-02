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
exports.validateSync = exports.validate = exports.validatorSync = exports.validator = exports.processValidateSync = exports.processValidate = void 0;
const process_1 = require("../process");
const _1 = require(".");
const rules_1 = require("./rules");
function processValidate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, process_1.process)(context);
    });
}
exports.processValidate = processValidate;
function processValidateSync(context) {
    return (0, process_1.processSync)(context);
}
exports.processValidateSync = processValidateSync;
const validator = (rules) => {
    return (components, data, instances) => __awaiter(void 0, void 0, void 0, function* () {
        const scope = yield processValidate({
            components,
            data,
            instances,
            scope: { errors: [] },
            processors: [_1.validateProcessInfo],
            rules,
        });
        return scope.errors;
    });
};
exports.validator = validator;
const validatorSync = (rules) => {
    return (components, data, instances) => {
        return processValidateSync({
            components,
            data,
            instances,
            scope: { errors: [] },
            processors: [_1.validateProcessInfo],
            rules,
        }).errors;
    };
};
exports.validatorSync = validatorSync;
// Perform a validation on a form asynchonously.
function validate(components, data, instances) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, exports.validator)(rules_1.rules)(components, data, instances);
    });
}
exports.validate = validate;
// Perform a validation on a form synchronously.
function validateSync(components, data, instances) {
    return (0, exports.validatorSync)(rules_1.rules)(components, data, instances);
}
exports.validateSync = validateSync;
