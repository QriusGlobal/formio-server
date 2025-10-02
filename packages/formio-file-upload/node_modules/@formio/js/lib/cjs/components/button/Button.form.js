"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Components_1 = __importDefault(require("../Components"));
const Button_edit_display_1 = __importDefault(require("./editForm/Button.edit.display"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return Components_1.default.baseEditForm([
        {
            key: 'display',
            components: Button_edit_display_1.default
        },
        {
            key: 'data',
            ignore: true,
        },
        {
            key: 'validation',
            ignore: true,
        },
    ], ...extend);
}
exports.default = default_1;
