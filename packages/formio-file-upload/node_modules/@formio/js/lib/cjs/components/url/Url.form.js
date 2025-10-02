"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextField_form_1 = __importDefault(require("../textfield/TextField.form"));
const Url_edit_display_1 = __importDefault(require("./editForm/Url.edit.display"));
const Url_edit_data_1 = __importDefault(require("./editForm/Url.edit.data"));
const Url_edit_validation_1 = __importDefault(require("./editForm/Url.edit.validation"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return (0, TextField_form_1.default)([
        {
            key: 'display',
            components: Url_edit_display_1.default
        },
        {
            key: 'data',
            components: Url_edit_data_1.default
        },
        {
            key: 'validation',
            components: Url_edit_validation_1.default
        },
    ], ...extend);
}
exports.default = default_1;
