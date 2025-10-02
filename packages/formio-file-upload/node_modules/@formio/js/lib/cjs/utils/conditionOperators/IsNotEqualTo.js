"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IsEqualTo_1 = __importDefault(require("./IsEqualTo"));
class IsNotEqualTo extends IsEqualTo_1.default {
    static get operatorKey() {
        return 'isNotEqual';
    }
    static get displayedName() {
        return 'Is Not Equal To';
    }
    execute(options) {
        return !super.execute(options);
    }
}
exports.default = IsNotEqualTo;
