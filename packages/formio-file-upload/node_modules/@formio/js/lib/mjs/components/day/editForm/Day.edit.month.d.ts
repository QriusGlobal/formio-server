declare const _default: ({
    wieght: number;
    type: string;
    datasrc: string;
    key: string;
    label: string;
    data: {
        values: {
            label: string;
            value: string;
        }[];
    };
    weight?: undefined;
    input?: undefined;
    placeholder?: undefined;
    tooltip?: undefined;
    onChange?: undefined;
} | {
    weight: number;
    type: string;
    input: boolean;
    key: string;
    label: string;
    placeholder: string;
    tooltip: string;
    wieght?: undefined;
    datasrc?: undefined;
    data?: undefined;
    onChange?: undefined;
} | {
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    onChange: ({ data }: {
        data: any;
    }) => void;
    input: boolean;
    wieght?: undefined;
    datasrc?: undefined;
    data?: undefined;
    placeholder?: undefined;
})[];
export default _default;
