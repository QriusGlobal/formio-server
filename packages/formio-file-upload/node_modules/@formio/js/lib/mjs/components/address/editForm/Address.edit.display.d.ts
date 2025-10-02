declare const _default: ({
    weight: number;
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    customConditional: ({ data }: {
        data: any;
    }) => boolean;
    defaultValue?: undefined;
    placeholder?: undefined;
    validate?: undefined;
} | {
    weight: number;
    type: string;
    input: boolean;
    key: string;
    defaultValue: string;
    label: string;
    placeholder: string;
    tooltip: string;
    validate: {
        required: boolean;
    };
    customConditional: ({ data }: {
        data: any;
    }) => boolean;
} | {
    weight: number;
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    customConditional?: undefined;
    defaultValue?: undefined;
    placeholder?: undefined;
    validate?: undefined;
} | {
    type: string;
    label: string;
    key: string;
    tooltip: string;
    placeholder: string;
    weight: number;
    input: boolean;
    customConditional: ({ data }: {
        data: any;
    }) => any;
    defaultValue?: undefined;
    validate?: undefined;
})[];
export default _default;
