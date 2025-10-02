"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = __importDefault(require("../../../utils/builder"));
const lodash_1 = __importDefault(require("lodash"));
exports.default = [
    {
        key: 'labelPosition',
        ignore: true,
    },
    {
        key: 'labelWidth',
        ignore: true,
    },
    {
        key: 'labelMargin',
        ignore: true
    },
    {
        key: 'placeholder',
        ignore: true,
    },
    {
        type: 'select',
        input: true,
        weight: 350,
        label: 'Shortcut',
        key: 'shortcut',
        tooltip: 'Shortcut for this component.',
        dataSrc: 'custom',
        valueProperty: 'value',
        customDefaultValue: () => '',
        template: '{{ item.label }}',
        data: {
            custom(context) {
                return builder_1.default.getAvailableShortcuts(lodash_1.default.get(context, 'instance.options.editForm', {}), lodash_1.default.get(context, 'instance.options.editComponent', {}));
            },
        },
    },
    {
        type: 'select',
        input: true,
        key: 'inputType',
        label: 'Input Type',
        tooltip: 'This is the input type used for this checkbox.',
        dataSrc: 'values',
        weight: 410,
        data: {
            values: [
                { label: 'Checkbox', value: 'checkbox' },
                { label: 'Radio', value: 'radio' },
            ],
        },
    },
    {
        type: 'textfield',
        input: true,
        key: 'name',
        label: 'Radio Key',
        tooltip: 'The key used to trigger the radio button toggle.',
        weight: 420,
        conditional: {
            json: { '===': [{ var: 'data.inputType' }, 'radio'] },
        },
    },
    {
        type: 'textfield',
        input: true,
        label: 'Radio Value',
        key: 'value',
        tooltip: 'The value used with this radio button.',
        weight: 430,
        conditional: {
            json: { '===': [{ var: 'data.inputType' }, 'radio'] },
        },
    },
];
