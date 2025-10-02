"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Components_1 = __importDefault(require("../Components"));
const Checkbox_edit_data_1 = __importDefault(require("./editForm/Checkbox.edit.data"));
const Checkbox_edit_display_1 = __importDefault(require("./editForm/Checkbox.edit.display"));
const Checkbox_edit_validation_1 = __importDefault(require("./editForm/Checkbox.edit.validation"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return Components_1.default.baseEditForm([
        {
            key: 'data',
            components: Checkbox_edit_data_1.default
        },
        {
            key: 'display',
            components: Checkbox_edit_display_1.default
        },
        {
            key: 'validation',
            components: Checkbox_edit_validation_1.default
        },
    ], ...extend);
}
exports.default = default_1;
