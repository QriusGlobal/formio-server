"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Components_1 = __importDefault(require("../Components"));
const DataGrid_edit_data_1 = __importDefault(require("./editForm/DataGrid.edit.data"));
const DataGrid_edit_display_1 = __importDefault(require("./editForm/DataGrid.edit.display"));
const DataGrid_edit_validation_1 = __importDefault(require("./editForm/DataGrid.edit.validation"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return Components_1.default.baseEditForm([
        {
            key: 'display',
            components: DataGrid_edit_display_1.default
        },
        {
            key: 'data',
            components: DataGrid_edit_data_1.default
        },
        {
            key: 'validation',
            components: DataGrid_edit_validation_1.default
        },
    ], ...extend);
}
exports.default = default_1;
