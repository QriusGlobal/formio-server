"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Components_1 = __importDefault(require("../Components"));
const Hidden_edit_display_1 = __importDefault(require("./editForm/Hidden.edit.display"));
const Hidden_edit_data_1 = __importDefault(require("./editForm/Hidden.edit.data"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return Components_1.default.baseEditForm([
        {
            key: 'display',
            components: Hidden_edit_display_1.default
        },
        {
            key: 'data',
            components: Hidden_edit_data_1.default
        },
        {
            key: 'validation',
            ignore: true
        },
        {
            key: 'conditional',
            ignore: true
        },
    ], ...extend);
}
exports.default = default_1;
