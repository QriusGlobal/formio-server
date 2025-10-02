"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Radio_form_1 = __importDefault(require("../radio/Radio.form"));
const SelectBoxes_edit_validation_1 = __importDefault(require("./editForm/SelectBoxes.edit.validation"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return (0, Radio_form_1.default)([
        {
            key: 'data',
            components: [
                {
                    key: 'dataType',
                    ignore: true,
                }
            ]
        },
        {
            key: 'validation',
            components: SelectBoxes_edit_validation_1.default
        },
    ], ...extend);
}
exports.default = default_1;
