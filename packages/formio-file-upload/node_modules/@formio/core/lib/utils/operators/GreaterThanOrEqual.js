"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConditionOperator_1 = __importDefault(require("./ConditionOperator"));
const lodash_1 = require("lodash");
class GreaterThanOrEqual extends ConditionOperator_1.default {
    static get operatorKey() {
        return 'greaterThanOrEqual';
    }
    static get displayedName() {
        return 'Greater Than Or Equal To';
    }
    execute({ value, comparedValue }) {
        return (0, lodash_1.isNumber)(value) && (value > comparedValue || (0, lodash_1.isEqual)(value, comparedValue));
    }
}
exports.default = GreaterThanOrEqual;
