"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IsEmptyValue_1 = __importDefault(require("./IsEmptyValue"));
class IsNotEmptyValue extends IsEmptyValue_1.default {
    static get operatorKey() {
        return 'isNotEmpty';
    }
    static get displayedName() {
        return 'Is Not Empty';
    }
    getResult(options) {
        return !super.getResult(options);
    }
}
exports.default = IsNotEmptyValue;
