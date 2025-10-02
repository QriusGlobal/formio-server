"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Components_1 = __importDefault(require("../Components"));
const Content_edit_display_1 = __importDefault(require("./editForm/Content.edit.display"));
const Content_edit_logic_1 = __importDefault(require("./editForm/Content.edit.logic"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    const editForm = Components_1.default.baseEditForm([
        {
            key: 'display',
            components: Content_edit_display_1.default,
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
            components: Content_edit_logic_1.default,
        },
    ], ...extend);
    // Add content as full width above the settings.
    editForm.components = [{
            weight: 0,
            type: 'textarea',
            editor: 'ckeditor',
            label: 'Content',
            hideLabel: true,
            input: true,
            key: 'html',
            as: 'html',
            rows: 3,
            tooltip: 'The HTML template for the result data items.',
        }].concat(editForm.components);
    return editForm;
}
exports.default = default_1;
