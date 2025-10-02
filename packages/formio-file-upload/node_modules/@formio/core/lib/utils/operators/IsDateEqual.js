"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DateGreaterThan_1 = __importDefault(require("./DateGreaterThan"));
class IsDateEqual extends DateGreaterThan_1.default {
    static get operatorKey() {
        return 'isDateEqual';
    }
    static get displayedName() {
        return 'Is Equal To';
    }
    execute(options) {
        return super.execute(options, 'isSame');
    }
}
exports.default = IsDateEqual;
