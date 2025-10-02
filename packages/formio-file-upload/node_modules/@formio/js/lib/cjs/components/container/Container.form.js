"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Components_1 = __importDefault(require("../Components"));
const Container_edit_display_1 = __importDefault(require("./editForm/Container.edit.display"));
const Container_edit_data_1 = __importDefault(require("./editForm/Container.edit.data"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return Components_1.default.baseEditForm([
        {
            key: 'display',
            components: Container_edit_display_1.default
        },
        {
            key: 'data',
            components: Container_edit_data_1.default
        },
    ], ...extend);
}
exports.default = default_1;
