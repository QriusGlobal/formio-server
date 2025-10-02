"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DateGreaterThan_1 = __importDefault(require("./DateGreaterThan"));
class DateLessThan extends DateGreaterThan_1.default {
    static get operatorKey() {
        return 'dateLessThan';
    }
    static get displayedName() {
        return 'Less Than';
    }
    execute(options) {
        return super.execute(options, 'isBefore');
    }
}
exports.default = DateLessThan;
