"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Components_1 = __importDefault(require("../Components"));
const EditGrid_edit_data_1 = __importDefault(require("./editForm/EditGrid.edit.data"));
const EditGrid_edit_display_1 = __importDefault(require("./editForm/EditGrid.edit.display"));
const EditGrid_edit_templates_1 = __importDefault(require("./editForm/EditGrid.edit.templates"));
const EditGrid_edit_validation_1 = __importDefault(require("./editForm/EditGrid.edit.validation"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return Components_1.default.baseEditForm([
        {
            label: 'Templates',
            key: 'templates',
            weight: 5,
            components: EditGrid_edit_templates_1.default
        },
        {
            key: 'display',
            components: EditGrid_edit_display_1.default,
        },
        {
            key: 'data',
            components: EditGrid_edit_data_1.default,
        },
        {
            key: 'validation',
            components: EditGrid_edit_validation_1.default
        },
    ], ...extend);
}
exports.default = default_1;
