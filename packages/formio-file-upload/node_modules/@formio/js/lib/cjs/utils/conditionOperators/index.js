"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IsNotEqualTo_1 = __importDefault(require("./IsNotEqualTo"));
const IsEmptyValue_1 = __importDefault(require("./IsEmptyValue"));
const IsNotEmptyValue_1 = __importDefault(require("./IsNotEmptyValue"));
const LessThan_1 = __importDefault(require("./LessThan"));
const GreaterThan_1 = __importDefault(require("./GreaterThan"));
const IsEqualTo_1 = __importDefault(require("./IsEqualTo"));
const DateGreaterThan_1 = __importDefault(require("./DateGreaterThan"));
const DateLessThan_1 = __importDefault(require("./DateLessThan"));
const Includes_1 = __importDefault(require("./Includes"));
const StartsWith_1 = __importDefault(require("./StartsWith"));
const NotIncludes_1 = __importDefault(require("./NotIncludes"));
const EndsWith_1 = __importDefault(require("./EndsWith"));
const DateGreaterThanOrEqual_1 = __importDefault(require("./DateGreaterThanOrEqual"));
const DateLessThanOrEqual_1 = __importDefault(require("./DateLessThanOrEqual"));
const LessThanOrEqual_1 = __importDefault(require("./LessThanOrEqual"));
const GreaterThanOrEqual_1 = __importDefault(require("./GreaterThanOrEqual"));
const IsDateEqual_1 = __importDefault(require("./IsDateEqual"));
const IsNotDateEqual_1 = __importDefault(require("./IsNotDateEqual"));
const ConditionOperators = {
    [`${IsNotEqualTo_1.default.operatorKey}`]: IsNotEqualTo_1.default,
    [`${IsEqualTo_1.default.operatorKey}`]: IsEqualTo_1.default,
    [`${IsEmptyValue_1.default.operatorKey}`]: IsEmptyValue_1.default,
    [`${IsNotEmptyValue_1.default.operatorKey}`]: IsNotEmptyValue_1.default,
    [`${LessThan_1.default.operatorKey}`]: LessThan_1.default,
    [`${GreaterThan_1.default.operatorKey}`]: GreaterThan_1.default,
    [`${DateGreaterThan_1.default.operatorKey}`]: DateGreaterThan_1.default,
    [`${DateLessThan_1.default.operatorKey}`]: DateLessThan_1.default,
    [`${Includes_1.default.operatorKey}`]: Includes_1.default,
    [`${StartsWith_1.default.operatorKey}`]: StartsWith_1.default,
    [`${EndsWith_1.default.operatorKey}`]: EndsWith_1.default,
    [`${NotIncludes_1.default.operatorKey}`]: NotIncludes_1.default,
    [`${DateGreaterThanOrEqual_1.default.operatorKey}`]: DateGreaterThanOrEqual_1.default,
    [`${DateLessThanOrEqual_1.default.operatorKey}`]: DateLessThanOrEqual_1.default,
    [`${LessThanOrEqual_1.default.operatorKey}`]: LessThanOrEqual_1.default,
    [`${GreaterThanOrEqual_1.default.operatorKey}`]: GreaterThanOrEqual_1.default,
    [`${IsDateEqual_1.default.operatorKey}`]: IsDateEqual_1.default,
    [`${IsNotDateEqual_1.default.operatorKey}`]: IsNotDateEqual_1.default
};
exports.default = ConditionOperators;
