"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
exports.default = [
    {
        wieght: 200,
        type: 'select',
        datasrc: 'values',
        key: 'fields.day.type',
        label: 'Type',
        data: {
            values: [
                {
                    label: 'Number',
                    value: 'number'
                },
                {
                    label: 'Select',
                    value: 'select'
                },
            ]
        }
    },
    {
        weight: 210,
        type: 'textfield',
        input: true,
        key: 'fields.day.placeholder',
        label: 'Placeholder',
        placeholder: 'Day Placeholder',
        tooltip: 'The placeholder text that will appear when Day field is empty.'
    },
    {
        weight: 215,
        type: 'checkbox',
        label: 'Hidden',
        tooltip: 'Hide the Day part of the component.',
        key: 'fields.day.hide',
        onChange: ({ data }) => {
            if (data.defaultValue) {
                const defaultValueParts = data.defaultValue.split('/');
                if (!data.fields.day.hide && defaultValueParts.length !== 3) {
                    const newDefaultValue = ['00'];
                    if (!data.fields.month.hide) {
                        data.dayFirst ? newDefaultValue.push(defaultValueParts[0]) : newDefaultValue.unshift(defaultValueParts[0]);
                    }
                    if (!data.fields.year.hide) {
                        newDefaultValue.push(defaultValueParts[1]);
                    }
                    lodash_1.default.set(data, 'defaultValue', newDefaultValue.join('/'));
                }
            }
        },
        input: true
    },
    {
        weight: 214,
        type: 'checkbox',
        label: 'Day First',
        tooltip: 'Display the Day field before the Month field.',
        key: 'dayFirst',
        input: true
    },
];
