"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DateGreaterThan_1 = __importDefault(require("./DateGreaterThan"));
class IsNotDateEqual extends DateGreaterThan_1.default {
    static get operatorKey() {
        return 'isNotDateEqual';
    }
    static get displayedName() {
        return 'Is Not Equal To';
    }
    execute(options) {
        return !super.execute(options, 'isSame');
    }
}
exports.default = IsNotDateEqual;
