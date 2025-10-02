"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConditionOperator_1 = __importDefault(require("./ConditionOperator"));
const lodash_1 = __importDefault(require("lodash"));
class IsEmptyValue extends ConditionOperator_1.default {
    static get operatorKey() {
        return 'isEmpty';
    }
    static get displayedName() {
        return 'Is Empty';
    }
    static get requireValue() {
        return false;
    }
    execute({ value, instance, path }) {
        var _a;
        const isEmptyValue = lodash_1.default.isEmpty(lodash_1.default.isNumber(value) ? String(value) : value);
        if ((_a = instance === null || instance === void 0 ? void 0 : instance.root) === null || _a === void 0 ? void 0 : _a.getComponent) {
            const conditionTriggerComponent = instance.root.getComponent(path);
            return (conditionTriggerComponent === null || conditionTriggerComponent === void 0 ? void 0 : conditionTriggerComponent.isEmpty) ? conditionTriggerComponent.isEmpty() : isEmptyValue;
        }
        return isEmptyValue;
    }
    getResult(options) {
        return this.execute(options);
    }
}
exports.default = IsEmptyValue;
