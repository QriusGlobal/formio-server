"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextField_1 = __importDefault(require("../textfield/TextField"));
const lodash_1 = __importDefault(require("lodash"));
class PhoneNumberComponent extends TextField_1.default {
    static schema(...extend) {
        return TextField_1.default.schema({
            type: 'phoneNumber',
            label: 'Phone Number',
            key: 'phoneNumber',
            inputType: 'tel',
            inputMask: '(999) 999-9999',
            inputMode: 'decimal',
            displayMask: '',
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Phone Number',
            group: 'advanced',
            icon: 'phone-square',
            weight: 30,
            documentation: '/userguide/form-building/advanced-components#phone-number',
            schema: PhoneNumberComponent.schema()
        };
    }
    get defaultSchema() {
        return PhoneNumberComponent.schema();
    }
    getValueAsString(value, options) {
        if ((options === null || options === void 0 ? void 0 : options.email) && this.visible && !this.skipInEmail && lodash_1.default.isObject(value)) {
            const result = (`
        <table border="1" style="width:100%">
          <tbody>
          <tr>
            <th style="padding: 5px 10px;">${value.maskName}</th>
            <td style="width:100%;padding:5px 10px;">${value.value}</td>
          </tr>
          </tbody>
        </table>
      `);
            return result;
        }
        return super.getValueAsString(value, options);
    }
}
exports.default = PhoneNumberComponent;
