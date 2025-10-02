"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextField_form_1 = __importDefault(require("../textfield/TextField.form"));
const Number_edit_display_1 = __importDefault(require("./editForm/Number.edit.display"));
const Number_edit_data_1 = __importDefault(require("./editForm/Number.edit.data"));
const Number_edit_validation_1 = __importDefault(require("./editForm/Number.edit.validation"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return (0, TextField_form_1.default)([
        {
            key: 'display',
            components: Number_edit_display_1.default
        },
        {
            key: 'data',
            components: Number_edit_data_1.default
        },
        {
            key: 'validation',
            components: Number_edit_validation_1.default
        },
    ], ...extend);
}
exports.default = default_1;
