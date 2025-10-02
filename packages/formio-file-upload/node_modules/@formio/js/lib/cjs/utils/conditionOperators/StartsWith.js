"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConditionOperator_1 = __importDefault(require("./ConditionOperator"));
const lodash_1 = __importDefault(require("lodash"));
class StartsWith extends ConditionOperator_1.default {
    static get operatorKey() {
        return 'startsWith';
    }
    static get displayedName() {
        return 'Starts With';
    }
    execute({ value, comparedValue }) {
        return lodash_1.default.startsWith(value, comparedValue);
    }
}
exports.default = StartsWith;
