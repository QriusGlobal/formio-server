"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConditionOperator_1 = __importDefault(require("./ConditionOperator"));
const moment_1 = __importDefault(require("moment"));
class DateGeaterThan extends ConditionOperator_1.default {
    static get operatorKey() {
        return 'dateGreaterThan';
    }
    static get displayedName() {
        return 'Greater Than';
    }
    getFormattedDates({ value, comparedValue, conditionTriggerComponent }) {
        const hasValidationFormat = conditionTriggerComponent ? conditionTriggerComponent.getValidationFormat : null;
        const date = hasValidationFormat ? (0, moment_1.default)(value, conditionTriggerComponent.getValidationFormat()) : (0, moment_1.default)(value);
        const comparedDate = hasValidationFormat ? (0, moment_1.default)(comparedValue, conditionTriggerComponent.getValidationFormat()) : (0, moment_1.default)(comparedValue);
        return { date, comparedDate };
    }
    execute(options, functionName = 'isAfter') {
        var _a;
        const { value, instance, path } = options;
        if (!value) {
            return false;
        }
        let conditionTriggerComponent = null;
        if ((_a = instance === null || instance === void 0 ? void 0 : instance.root) === null || _a === void 0 ? void 0 : _a.getComponent) {
            conditionTriggerComponent = instance.root.getComponent(path);
        }
        if (conditionTriggerComponent && conditionTriggerComponent.isPartialDay && conditionTriggerComponent.isPartialDay(value)) {
            return false;
        }
        const { date, comparedDate } = this.getFormattedDates(Object.assign(Object.assign({}, options), { conditionTriggerComponent }));
        return date[functionName](comparedDate);
    }
}
exports.default = DateGeaterThan;
