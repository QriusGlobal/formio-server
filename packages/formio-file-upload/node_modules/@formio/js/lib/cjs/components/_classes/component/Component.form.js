"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Component_edit_conditional_1 = __importDefault(require("./editForm/Component.edit.conditional"));
const Component_edit_data_1 = __importDefault(require("./editForm/Component.edit.data"));
const Component_edit_api_1 = __importDefault(require("./editForm/Component.edit.api"));
const Component_edit_display_1 = __importDefault(require("./editForm/Component.edit.display"));
const Component_edit_logic_1 = __importDefault(require("./editForm/Component.edit.logic"));
const Component_edit_validation_1 = __importDefault(require("./editForm/Component.edit.validation"));
const Component_edit_layout_1 = __importDefault(require("./editForm/Component.edit.layout"));
const utils_1 = __importDefault(require("./editForm/utils"));
/**
 * The Edit Form function.
 * @param {...any} extend - The components that extend the edit form.
 * @returns {import('@formio/core').Component[]} - The edit form components.
 */
function default_1(...extend) {
    const components = lodash_1.default.cloneDeep([
        {
            type: 'tabs',
            key: 'tabs',
            components: [
                {
                    label: 'Display',
                    key: 'display',
                    weight: 0,
                    components: Component_edit_display_1.default
                },
                {
                    label: 'Data',
                    key: 'data',
                    weight: 10,
                    components: Component_edit_data_1.default
                },
                {
                    label: 'Validation',
                    key: 'validation',
                    weight: 20,
                    components: Component_edit_validation_1.default
                },
                {
                    label: 'API',
                    key: 'api',
                    weight: 30,
                    components: Component_edit_api_1.default
                },
                {
                    label: 'Conditional',
                    key: 'conditional',
                    weight: 40,
                    components: Component_edit_conditional_1.default
                },
                {
                    label: 'Logic',
                    key: 'logic',
                    weight: 50,
                    components: Component_edit_logic_1.default
                },
                {
                    label: 'Layout',
                    key: 'layout',
                    weight: 60,
                    components: Component_edit_layout_1.default
                },
            ]
        }
    ]).concat(extend.map((items) => ({
        type: 'tabs',
        key: 'tabs',
        components: lodash_1.default.cloneDeep(items),
    })));
    return {
        components: lodash_1.default.unionWith(components, utils_1.default.unifyComponents).concat({
            type: 'hidden',
            key: 'type'
        })
    };
}
exports.default = default_1;
