"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DateGreaterThan_1 = __importDefault(require("./DateGreaterThan"));
class DateLessThanOrEqual extends DateGreaterThan_1.default {
    static get operatorKey() {
        return 'dateLessThanOrEqual';
    }
    static get displayedName() {
        return 'Less Than Or Equal To';
    }
    execute(options) {
        return super.execute(options, 'isSameOrBefore');
    }
}
exports.default = DateLessThanOrEqual;
