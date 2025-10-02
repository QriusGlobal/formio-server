"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Input_1 = __importDefault(require("../_classes/input/Input"));
class HiddenComponent extends Input_1.default {
    static schema(...extend) {
        return Input_1.default.schema({
            type: 'hidden',
            tableView: false,
            inputType: 'hidden'
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Hidden',
            group: 'data',
            icon: 'user-secret',
            weight: 0,
            documentation: '/userguide/form-building/data-components#hidden',
            showPreview: false,
            schema: HiddenComponent.schema()
        };
    }
    get defaultSchema() {
        return HiddenComponent.schema();
    }
    get inputInfo() {
        const info = super.elementInfo();
        info.type = 'input';
        info.attr.type = 'hidden';
        info.changeEvent = 'change';
        return info;
    }
    get skipInEmail() {
        return true;
    }
    /**
     * Check if a component is eligible for multiple validation
     * @returns {boolean} - If the component is eligible for multiple validation.
     */
    validateMultiple() {
        // Since "arrays" are able to be stored in hidden components, we need to turn off multiple validation.
        return false;
    }
    labelIsHidden() {
        return true;
    }
    get emptyValue() {
        return '';
    }
    setValue(value, flags = {}) {
        return this.updateValue(value, flags);
    }
    getValue() {
        return this.dataValue;
    }
}
exports.default = HiddenComponent;
