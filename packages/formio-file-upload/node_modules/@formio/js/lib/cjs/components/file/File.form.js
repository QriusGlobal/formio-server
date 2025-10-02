"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Components_1 = __importDefault(require("../Components"));
const File_edit_data_1 = __importDefault(require("./editForm/File.edit.data"));
const File_edit_display_1 = __importDefault(require("./editForm/File.edit.display"));
const File_edit_file_1 = __importDefault(require("./editForm/File.edit.file"));
const File_edit_validation_1 = __importDefault(require("./editForm/File.edit.validation"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    return Components_1.default.baseEditForm([
        {
            key: 'display',
            components: File_edit_display_1.default
        },
        {
            key: 'data',
            components: File_edit_data_1.default
        },
        {
            label: 'File',
            key: 'file',
            weight: 5,
            components: File_edit_file_1.default
        },
        {
            key: 'validation',
            components: File_edit_validation_1.default
        },
    ], ...extend);
}
exports.default = default_1;
