"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NestedComponent_1 = __importDefault(require("../_classes/nested/NestedComponent"));
class FieldsetComponent extends NestedComponent_1.default {
    static schema(...extend) {
        return NestedComponent_1.default.schema({
            label: 'Field Set',
            key: 'fieldSet',
            type: 'fieldset',
            legend: '',
            components: [],
            input: false,
            persistent: false
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Field Set',
            icon: 'th-large',
            group: 'layout',
            documentation: '/userguide/form-building/layout-components#field-set',
            showPreview: false,
            weight: 20,
            schema: FieldsetComponent.schema()
        };
    }
    static savedValueTypes() {
        return [];
    }
    get defaultSchema() {
        return FieldsetComponent.schema();
    }
    get className() {
        return `${this.transform('class', 'form-group')} ${super.className}`;
    }
    get templateName() {
        return 'fieldset';
    }
    constructor(...args) {
        super(...args);
        this.noField = true;
    }
}
exports.default = FieldsetComponent;
