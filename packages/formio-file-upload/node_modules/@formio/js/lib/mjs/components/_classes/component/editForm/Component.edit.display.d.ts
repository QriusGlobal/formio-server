declare const _default: ({
    weight: number;
    type: string;
    input: boolean;
    key: string;
    label: string;
    placeholder: string;
    tooltip: string;
    validate: {
        required: boolean;
        min?: undefined;
        max?: undefined;
    };
    autofocus: boolean;
    defaultValue?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    clearOnHide?: undefined;
    suffix?: undefined;
    conditional?: undefined;
    editor?: undefined;
    as?: undefined;
    wysiwyg?: undefined;
    customConditional?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    weight: number;
    defaultValue: string;
    dataSrc: string;
    data: {
        values: {
            label: string;
            value: string;
        }[];
    };
    placeholder?: undefined;
    validate?: undefined;
    autofocus?: undefined;
    clearOnHide?: undefined;
    suffix?: undefined;
    conditional?: undefined;
    editor?: undefined;
    as?: undefined;
    wysiwyg?: undefined;
    customConditional?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    clearOnHide: boolean;
    weight: number;
    placeholder: string;
    suffix: string;
    validate: {
        min: number;
        max: number;
        required?: undefined;
    };
    conditional: {
        json: {
            and: {
                '!==': (string | {
                    var: string;
                })[];
            }[];
        };
    };
    autofocus?: undefined;
    defaultValue?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    editor?: undefined;
    as?: undefined;
    wysiwyg?: undefined;
    customConditional?: undefined;
} | {
    weight: number;
    type: string;
    input: boolean;
    key: string;
    label: string;
    placeholder: string;
    tooltip: string;
    validate?: undefined;
    autofocus?: undefined;
    defaultValue?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    clearOnHide?: undefined;
    suffix?: undefined;
    conditional?: undefined;
    editor?: undefined;
    as?: undefined;
    wysiwyg?: undefined;
    customConditional?: undefined;
} | {
    weight: number;
    type: string;
    input: boolean;
    key: string;
    label: string;
    placeholder: string;
    tooltip: string;
    editor: string;
    as: string;
    wysiwyg: {
        minLines: number;
        isUseWorkerDisabled: boolean;
    };
    validate?: undefined;
    autofocus?: undefined;
    defaultValue?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    clearOnHide?: undefined;
    suffix?: undefined;
    conditional?: undefined;
    customConditional?: undefined;
} | {
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    input: boolean;
    placeholder?: undefined;
    validate?: undefined;
    autofocus?: undefined;
    defaultValue?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    clearOnHide?: undefined;
    suffix?: undefined;
    conditional?: undefined;
    editor?: undefined;
    as?: undefined;
    wysiwyg?: undefined;
    customConditional?: undefined;
} | {
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    input: boolean;
    customConditional(context: any): any;
    placeholder?: undefined;
    validate?: undefined;
    autofocus?: undefined;
    defaultValue?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    clearOnHide?: undefined;
    suffix?: undefined;
    conditional?: undefined;
    editor?: undefined;
    as?: undefined;
    wysiwyg?: undefined;
})[];
export default _default;
