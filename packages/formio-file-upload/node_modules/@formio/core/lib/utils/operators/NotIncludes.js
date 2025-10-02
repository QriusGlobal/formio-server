"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Includes_1 = __importDefault(require("./Includes"));
class NotIncludes extends Includes_1.default {
    static get operatorKey() {
        return 'notIncludes';
    }
    static get displayedName() {
        return 'Not Includes';
    }
    execute(options) {
        return !super.execute(options);
    }
}
exports.default = NotIncludes;
