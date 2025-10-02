"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextField_form_1 = __importDefault(require("../textfield/TextField.form"));
const Currency_edit_display_1 = __importDefault(require("./editForm/Currency.edit.display"));
const Currency_edit_data_1 = __importDefault(require("./editForm/Currency.edit.data"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return (0, TextField_form_1.default)([
        {
            key: 'display',
            components: Currency_edit_display_1.default
        },
        {
            key: 'data',
            components: Currency_edit_data_1.default
        },
        {
            key: 'validation',
            components: [
                {
                    key: 'validate.minLength',
                    ignore: true,
                },
                {
                    key: 'validate.maxLength',
                    ignore: true,
                },
                {
                    key: 'validate.minWords',
                    ignore: true,
                },
                {
                    key: 'validate.maxWords',
                    ignore: true,
                },
                {
                    key: 'validate.pattern',
                    ignore: true,
                },
            ]
        },
    ], ...extend);
}
exports.default = default_1;
