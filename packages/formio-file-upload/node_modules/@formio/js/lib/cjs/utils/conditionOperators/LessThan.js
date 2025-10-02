"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConditionOperator_1 = __importDefault(require("./ConditionOperator"));
const lodash_1 = __importDefault(require("lodash"));
class LessThan extends ConditionOperator_1.default {
    static get operatorKey() {
        return 'lessThan';
    }
    static get displayedName() {
        return 'Less Than';
    }
    execute({ value, comparedValue }) {
        return lodash_1.default.isNumber(value) && value < comparedValue;
    }
}
exports.default = LessThan;
