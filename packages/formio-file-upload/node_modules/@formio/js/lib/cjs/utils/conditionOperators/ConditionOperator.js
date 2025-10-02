"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
/* eslint-disable no-unused-vars */
class ConditionOperator {
    static get operatorKey() {
        return '';
    }
    static get displayedName() {
        return '';
    }
    static get requireValue() {
        return true;
    }
    execute(options) {
        return true;
    }
    getResult(options = {}) {
        const { value } = options;
        if (lodash_1.default.isArray(value)) {
            return lodash_1.default.some(value, valueItem => this.execute(Object.assign(Object.assign({}, options), { value: valueItem })));
        }
        return this.execute(options);
    }
}
exports.default = ConditionOperator;
