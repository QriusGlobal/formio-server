declare const _default: ({
    key: string;
    ignore: boolean;
    type?: undefined;
    label?: undefined;
    tooltip?: undefined;
    weight?: undefined;
    input?: undefined;
    placeholder?: undefined;
    customConditional?: undefined;
} | {
    type: string;
    label: string;
    key: string;
    tooltip: string;
    weight: number;
    input: boolean;
    ignore?: undefined;
    placeholder?: undefined;
    customConditional?: undefined;
} | {
    type: string;
    label: string;
    key: string;
    tooltip: string;
    placeholder: string;
    weight: number;
    input: boolean;
    customConditional(context: any): boolean;
    ignore?: undefined;
})[];
export default _default;
