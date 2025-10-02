"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextField_1 = __importDefault(require("../textfield/TextField"));
class UrlComponent extends TextField_1.default {
    static schema(...extend) {
        return TextField_1.default.schema({
            type: 'url',
            label: 'Url',
            key: 'url',
            inputType: 'url'
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Url',
            group: 'advanced',
            icon: 'link',
            documentation: '/userguide/form-building/advanced-components#url',
            weight: 20,
            schema: UrlComponent.schema()
        };
    }
    constructor(component, options, data) {
        super(component, options, data);
    }
    get defaultSchema() {
        return UrlComponent.schema();
    }
    elementInfo() {
        const info = super.elementInfo();
        info.attr.type = this.component.mask ? 'password' : 'url';
        return info;
    }
}
exports.default = UrlComponent;
