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
    type: string;
    title: string;
    key: string;
    theme: string;
    weight: number;
    components: ({
        type: string;
        input: boolean;
        label: string;
        key: string;
        dataSrc: string;
        data: {
            values: {
                label: string;
                value: string;
            }[];
            custom?: undefined;
        };
        valueProperty?: undefined;
    } | {
        type: string;
        input: boolean;
        label: string;
        key: string;
        dataSrc: string;
        valueProperty: string;
        data: {
            custom(context: any): any[];
            values?: undefined;
        };
    } | {
        type: string;
        input: boolean;
        label: string;
        key: string;
        dataSrc?: undefined;
        data?: undefined;
        valueProperty?: undefined;
    })[];
})[];
export default _default;
