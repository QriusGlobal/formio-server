declare const _default: ({
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    input: boolean;
    defaultValue?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    placeholder?: undefined;
    title?: undefined;
    collapsible?: undefined;
    collapsed?: undefined;
    style?: undefined;
    customConditional?: undefined;
    components?: undefined;
} | {
    weight: number;
    type: string;
    key: string;
    defaultValue: string;
    input: boolean;
    label: string;
    tooltip: string;
    dataSrc: string;
    data: {
        values: {
            label: string;
            value: string;
        }[];
    };
    placeholder?: undefined;
    title?: undefined;
    collapsible?: undefined;
    collapsed?: undefined;
    style?: undefined;
    customConditional?: undefined;
    components?: undefined;
} | {
    weight: number;
    type: string;
    input: boolean;
    key: string;
    label: string;
    placeholder: string;
    tooltip: string;
    defaultValue?: undefined;
    dataSrc?: undefined;
    data?: undefined;
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
    weight: number;
    customConditional(): boolean;
    components: ({
        type: string;
        tag: string;
        content: string;
    } | {
        type: string;
        key: string;
        rows: number;
        editor: string;
        hideLabel: boolean;
        as: string;
        input: boolean;
        components?: undefined;
    } | {
        type: string;
        components: {
            weight: number;
            type: string;
            label: string;
            tooltip: string;
            description: string;
            key: string;
            input: boolean;
        }[];
        key?: undefined;
        rows?: undefined;
        editor?: undefined;
        hideLabel?: undefined;
        as?: undefined;
        input?: undefined;
    })[];
    label?: undefined;
    tooltip?: undefined;
    input?: undefined;
    defaultValue?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    placeholder?: undefined;
} | {
    type: string;
    title: string;
    collapsible: boolean;
    collapsed: boolean;
    key: string;
    weight: number;
    components: ({
        type: string;
        tag: string;
        content: string;
        key?: undefined;
        hideLabel?: undefined;
        rows?: undefined;
        editor?: undefined;
        as?: undefined;
        input?: undefined;
    } | {
        type: string;
        key: string;
        hideLabel: boolean;
        rows: number;
        editor: string;
        as: string;
        input: boolean;
        tag?: undefined;
        content?: undefined;
    })[];
    label?: undefined;
    tooltip?: undefined;
    input?: undefined;
    defaultValue?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    placeholder?: undefined;
    style?: undefined;
    customConditional?: undefined;
})[];
export default _default;
