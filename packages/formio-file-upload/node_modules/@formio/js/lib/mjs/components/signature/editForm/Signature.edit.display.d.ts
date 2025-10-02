declare const _default: ({
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    placeholder: string;
    weight: number;
    conditional?: undefined;
    customConditional?: undefined;
    ignore?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    placeholder: string;
    conditional: {
        json: {
            '!': {
                var: string;
            }[];
        };
    };
    weight: number;
    customConditional?: undefined;
    ignore?: undefined;
} | {
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    customConditional: ({ options }: {
        options: any;
    }) => boolean;
    input: boolean;
    placeholder?: undefined;
    conditional?: undefined;
    ignore?: undefined;
} | {
    key: string;
    ignore: boolean;
    type?: undefined;
    input?: undefined;
    label?: undefined;
    tooltip?: undefined;
    placeholder?: undefined;
    weight?: undefined;
    conditional?: undefined;
    customConditional?: undefined;
})[];
export default _default;
