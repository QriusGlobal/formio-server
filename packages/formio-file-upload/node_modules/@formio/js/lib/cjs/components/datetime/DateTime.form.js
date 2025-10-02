"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Components_1 = __importDefault(require("../Components"));
const DateTime_edit_data_1 = __importDefault(require("./editForm/DateTime.edit.data"));
const DateTime_edit_date_1 = __importDefault(require("./editForm/DateTime.edit.date"));
const DateTime_edit_display_1 = __importDefault(require("./editForm/DateTime.edit.display"));
const DateTime_edit_time_1 = __importDefault(require("./editForm/DateTime.edit.time"));
const DateTime_edit_validation_1 = __importDefault(require("./editForm/DateTime.edit.validation"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return Components_1.default.baseEditForm([
        {
            key: 'display',
            components: DateTime_edit_display_1.default
        },
        {
            label: 'Date',
            key: 'date',
            weight: 1,
            components: DateTime_edit_date_1.default
        },
        {
            label: 'Time',
            key: 'time',
            weight: 2,
            components: DateTime_edit_time_1.default
        },
        {
            key: 'data',
            components: DateTime_edit_data_1.default
        },
        {
            key: 'validation',
            components: DateTime_edit_validation_1.default
        },
    ], ...extend);
}
exports.default = default_1;
