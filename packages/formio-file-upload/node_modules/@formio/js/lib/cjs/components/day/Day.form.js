"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Components_1 = __importDefault(require("../Components"));
const Day_edit_data_1 = __importDefault(require("./editForm/Day.edit.data"));
const Day_edit_display_1 = __importDefault(require("./editForm/Day.edit.display"));
const Day_edit_validation_1 = __importDefault(require("./editForm/Day.edit.validation"));
const Day_edit_day_1 = __importDefault(require("./editForm/Day.edit.day"));
const Day_edit_month_1 = __importDefault(require("./editForm/Day.edit.month"));
const Day_edit_year_1 = __importDefault(require("./editForm/Day.edit.year"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return Components_1.default.baseEditForm([
        {
            key: 'display',
            components: Day_edit_display_1.default
        },
        {
            key: 'data',
            components: Day_edit_data_1.default,
        },
        {
            key: 'validation',
            components: Day_edit_validation_1.default
        },
        {
            key: 'day',
            label: 'Day',
            weight: 3,
            components: Day_edit_day_1.default
        },
        {
            key: 'month',
            label: 'Month',
            weight: 3,
            components: Day_edit_month_1.default
        },
        {
            key: 'year',
            label: 'Year',
            weight: 3,
            components: Day_edit_year_1.default
        },
    ], ...extend);
}
exports.default = default_1;
