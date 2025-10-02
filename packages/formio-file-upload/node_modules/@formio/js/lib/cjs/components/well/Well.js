"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NestedComponent_1 = __importDefault(require("../_classes/nested/NestedComponent"));
class WellComponent extends NestedComponent_1.default {
    static schema(...extend) {
        return NestedComponent_1.default.schema({
            type: 'well',
            key: 'well',
            input: false,
            persistent: false,
            components: []
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Well',
            icon: 'square-o',
            group: 'layout',
            documentation: '/userguide/form-building/layout-components#well',
            showPreview: false,
            weight: 60,
            schema: WellComponent.schema()
        };
    }
    static savedValueTypes() {
        return [];
    }
    get defaultSchema() {
        return WellComponent.schema();
    }
    get className() {
        return `${this.component.customClass}`;
    }
    get templateName() {
        return 'well';
    }
    constructor(...args) {
        super(...args);
        this.noField = true;
    }
}
exports.default = WellComponent;
