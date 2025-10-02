declare const _default: ({
    type: string;
    title: any;
    theme: string;
    collapsible: boolean;
    collapsed: boolean;
    key: string;
    weight: any;
    components: ({
        type: string;
        tag: string;
        content: string;
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
            key: any;
            rows: number;
            editor: string;
            hideLabel: boolean;
            as: string;
            input: boolean;
            tag?: undefined;
            content?: undefined;
        } | {
            type: string;
            tag: string;
            content: string;
            key?: undefined;
            rows?: undefined;
            editor?: undefined;
            hideLabel?: undefined;
            as?: undefined;
            input?: undefined;
        })[];
    } | {
        type: string;
        title: string;
        collapsible: boolean;
        collapsed: boolean;
        key: string;
        components: ({
            type: string;
            tag: string;
            content: string;
            key?: undefined;
            rows?: undefined;
            editor?: undefined;
            hideLabel?: undefined;
            as?: undefined;
            input?: undefined;
        } | {
            type: string;
            key: any;
            rows: number;
            editor: string;
            hideLabel: boolean;
            as: string;
            input: boolean;
            tag?: undefined;
            content?: undefined;
        })[];
        style?: undefined;
        customConditional?: undefined;
    })[];
} | {
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    input: boolean;
    placeholder?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
    logic?: undefined;
    dataSrc?: undefined;
    valueProperty?: undefined;
    data?: undefined;
    conditional?: undefined;
} | {
    type: string;
    label: string;
    key: string;
    weight: number;
    placeholder: string;
    tooltip: string;
    input: boolean;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
    logic?: undefined;
    dataSrc?: undefined;
    valueProperty?: undefined;
    data?: undefined;
    conditional?: undefined;
} | {
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    input: boolean;
    inline: boolean;
    defaultValue: boolean;
    values: ({
        label: string;
        value: boolean;
    } | {
        label: string;
        value: string;
    })[];
    placeholder?: undefined;
    logic?: undefined;
    dataSrc?: undefined;
    valueProperty?: undefined;
    data?: undefined;
    conditional?: undefined;
} | {
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    input: boolean;
    logic: ({
        name: string;
        trigger: {
            type: string;
            javascript: string;
        };
        actions: {
            name: string;
            type: string;
            property: {
                label: string;
                value: string;
                type: string;
            };
            state: boolean;
        }[];
    } | {
        name: string;
        trigger: {
            type: string;
            javascript: string;
        };
        actions: {
            name: string;
            type: string;
            property: {
                label: string;
                value: string;
                type: string;
            };
            text: string;
        }[];
    })[];
    placeholder?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
    dataSrc?: undefined;
    valueProperty?: undefined;
    data?: undefined;
    conditional?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    weight: number;
    tooltip: string;
    dataSrc: string;
    valueProperty: string;
    data: {
        custom(context: any): {
            label: string;
            value: string;
        }[];
    };
    conditional: {
        json: {
            '!': {
                var: string;
            }[];
        };
    };
    placeholder?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
    logic?: undefined;
} | {
    weight: number;
    type: string;
    label: string;
    key: string;
    defaultValue: boolean;
    tooltip: string;
    input: boolean;
    placeholder?: undefined;
    inline?: undefined;
    values?: undefined;
    logic?: undefined;
    dataSrc?: undefined;
    valueProperty?: undefined;
    data?: undefined;
    conditional?: undefined;
})[];
export default _default;
