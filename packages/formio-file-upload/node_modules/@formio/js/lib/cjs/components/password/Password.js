"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextField_1 = __importDefault(require("../textfield/TextField"));
const lodash_1 = __importDefault(require("lodash"));
class PasswordComponent extends TextField_1.default {
    static schema(...extend) {
        return TextField_1.default.schema({
            type: 'password',
            label: 'Password',
            key: 'password',
            protected: true,
            tableView: false,
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Password',
            icon: 'asterisk',
            group: 'basic',
            documentation: '/userguide/form-building/form-components#password',
            weight: 40,
            schema: PasswordComponent.schema()
        };
    }
    get defaultSchema() {
        return lodash_1.default.omit(PasswordComponent.schema(), ['protected', 'tableView']);
    }
    get inputInfo() {
        const info = super.inputInfo;
        info.attr.type = 'password';
        return info;
    }
    get autocompleteDisableAttrName() {
        return 'new-password';
    }
}
exports.default = PasswordComponent;
