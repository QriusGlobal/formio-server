"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextField_1 = __importDefault(require("../textfield/TextField"));
class EmailComponent extends TextField_1.default {
    static schema(...extend) {
        return TextField_1.default.schema({
            type: 'email',
            label: 'Email',
            key: 'email',
            inputType: 'email',
            kickbox: {
                enabled: false
            }
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Email',
            group: 'advanced',
            icon: 'at',
            documentation: '/userguide/form-building/advanced-components#email',
            weight: 10,
            schema: EmailComponent.schema()
        };
    }
    init() {
        super.init();
    }
    get defaultSchema() {
        return EmailComponent.schema();
    }
    get inputInfo() {
        const info = super.inputInfo;
        info.attr.type = this.component.mask ? 'password' : 'email';
        return info;
    }
    normalizeValue(value, flags = {}) {
        value = super.normalizeValue(value, flags);
        if (this.options.server && !!value) {
            if (Array.isArray(value)) {
                value = value.map(val => val.toLowerCase());
            }
            else {
                value = value.toLowerCase();
            }
        }
        return value;
    }
}
exports.default = EmailComponent;
