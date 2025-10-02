"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ListComponent_form_1 = __importDefault(require("../_classes/list/ListComponent.form"));
const Select_edit_data_1 = __importDefault(require("./editForm/Select.edit.data"));
const Select_edit_display_1 = __importDefault(require("./editForm/Select.edit.display"));
const Select_edit_validation_1 = __importDefault(require("./editForm/Select.edit.validation"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return (0, ListComponent_form_1.default)([
        {
            key: 'display',
            components: Select_edit_display_1.default
        },
        {
            key: 'data',
            components: Select_edit_data_1.default
        },
        {
            key: 'validation',
            components: Select_edit_validation_1.default
        },
    ], ...extend);
}
exports.default = default_1;
