"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NestedComponent_form_1 = __importDefault(require("../_classes/nested/NestedComponent.form"));
const Form_edit_display_1 = __importDefault(require("./editForm/Form.edit.display"));
const Form_edit_form_1 = __importDefault(require("./editForm/Form.edit.form"));
const Form_edit_data_1 = __importDefault(require("./editForm/Form.edit.data"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return (0, NestedComponent_form_1.default)([
        {
            key: 'display',
            components: Form_edit_display_1.default
        },
        {
            label: 'Form',
            key: 'form',
            weight: 10,
            components: Form_edit_form_1.default
        },
        {
            label: 'Data',
            key: 'data',
            weight: 10,
            components: Form_edit_data_1.default
        },
    ], ...extend);
}
exports.default = default_1;
