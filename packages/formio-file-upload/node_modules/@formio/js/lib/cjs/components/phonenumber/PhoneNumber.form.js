"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextField_form_1 = __importDefault(require("../textfield/TextField.form"));
const PhoneNumber_edit_validation_1 = __importDefault(require("./editForm/PhoneNumber.edit.validation"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return (0, TextField_form_1.default)([
        {
            key: 'display',
            components: [
                {
                    key: 'showWordCount',
                    ignore: true
                },
                {
                    key: 'showCharCount',
                    ignore: true
                }
            ]
        },
        {
            key: 'data',
            components: [
                {
                    key: 'case',
                    ignore: true
                }
            ]
        },
        {
            key: 'validation',
            components: PhoneNumber_edit_validation_1.default
        },
    ], ...extend);
}
exports.default = default_1;
