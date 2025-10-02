declare const _default: ({
    key: string;
    customConditional: ({ data }: {
        data: any;
    }) => boolean;
    type?: undefined;
    label?: undefined;
    weight?: undefined;
    placeholder?: undefined;
    tooltip?: undefined;
    input?: undefined;
    customDefaultValue?: undefined;
} | {
    type: string;
    label: string;
    key: string;
    weight: number;
    placeholder: string;
    tooltip: string;
    input: boolean;
    customDefaultValue: ({ instance }: {
        instance: any;
    }) => {
        mode: string;
        address: {};
    } | {
        mode?: undefined;
        address?: undefined;
    };
    customConditional?: undefined;
})[];
export default _default;
