declare const _default: ({
    type: string;
    input: boolean;
    key: string;
    label: string;
    weight: number;
    tooltip: string;
    placeholder?: undefined;
    validate?: undefined;
    title?: undefined;
    collapsible?: undefined;
    collapsed?: undefined;
    style?: undefined;
    customConditional?: undefined;
    components?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    placeholder: string;
    tooltip: string;
    validate: {
        custom: string;
    };
    weight: number;
    title?: undefined;
    collapsible?: undefined;
    collapsed?: undefined;
    style?: undefined;
    customConditional?: undefined;
    components?: undefined;
} | {
    type: string;
    title: string;
    collapsible: boolean;
    collapsed: boolean;
    style: {
        'margin-bottom': string;
    };
    key: string;
    customConditional(): boolean;
    components: ({
        type: string;
        tag: string;
        content: string;
    } | {
        type: string;
        input: boolean;
        editor: string;
        key: string;
        label: string;
        description: string;
        weight: number;
    })[];
    input?: undefined;
    label?: undefined;
    weight?: undefined;
    tooltip?: undefined;
    placeholder?: undefined;
    validate?: undefined;
})[];
export default _default;
