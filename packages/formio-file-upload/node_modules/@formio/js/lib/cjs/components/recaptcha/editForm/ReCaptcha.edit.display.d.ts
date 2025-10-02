declare const _default: ({
    key: string;
    weight: number;
    type: string;
    tag: string;
    className: string;
    content: string;
    label?: undefined;
    tooltip?: undefined;
    values?: undefined;
    validate?: undefined;
    input?: undefined;
    dataSrc?: undefined;
    valueProperty?: undefined;
    customConditional?: undefined;
    data?: undefined;
    ignore?: undefined;
} | {
    key: string;
    label: string;
    tooltip: string;
    type: string;
    values: {
        label: string;
        value: string;
    }[];
    validate: {
        required: boolean;
    };
    weight: number;
    tag?: undefined;
    className?: undefined;
    content?: undefined;
    input?: undefined;
    dataSrc?: undefined;
    valueProperty?: undefined;
    customConditional?: undefined;
    data?: undefined;
    ignore?: undefined;
} | {
    type: string;
    input: boolean;
    label: string;
    key: string;
    dataSrc: string;
    valueProperty: string;
    tooltip: string;
    weight: number;
    customConditional(context: any): boolean;
    data: {
        custom(context: any): any[];
    };
    tag?: undefined;
    className?: undefined;
    content?: undefined;
    values?: undefined;
    validate?: undefined;
    ignore?: undefined;
} | {
    key: string;
    ignore: boolean;
    weight?: undefined;
    type?: undefined;
    tag?: undefined;
    className?: undefined;
    content?: undefined;
    label?: undefined;
    tooltip?: undefined;
    values?: undefined;
    validate?: undefined;
    input?: undefined;
    dataSrc?: undefined;
    valueProperty?: undefined;
    customConditional?: undefined;
    data?: undefined;
})[];
export default _default;
