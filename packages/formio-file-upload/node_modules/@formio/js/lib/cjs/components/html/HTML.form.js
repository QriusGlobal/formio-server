"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Components_1 = __importDefault(require("../Components"));
const HTML_edit_display_1 = __importDefault(require("./editForm/HTML.edit.display"));
const HTML_edit_logic_1 = __importDefault(require("./editForm/HTML.edit.logic"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return Components_1.default.baseEditForm([
        {
            key: 'display',
            components: HTML_edit_display_1.default,
        },
        {
            key: 'data',
            ignore: true,
        },
        {
            key: 'validation',
            ignore: true,
        },
        {
            key: 'logic',
            components: HTML_edit_logic_1.default,
        },
    ], ...extend);
}
exports.default = default_1;
