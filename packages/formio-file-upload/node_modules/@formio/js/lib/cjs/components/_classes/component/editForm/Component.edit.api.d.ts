declare const _default: ({
    weight: number;
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    validate: {
        pattern: string;
        patternMessage: string;
        required: boolean;
    };
    storeas?: undefined;
    valueComponent?: undefined;
} | {
    weight: number;
    type: string;
    input: boolean;
    label: string;
    storeas: string;
    tooltip: string;
    key: string;
    validate?: undefined;
    valueComponent?: undefined;
} | {
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    valueComponent: {
        type: string;
        key: string;
        label: string;
        placeholder: string;
        input: boolean;
    };
    input?: undefined;
    validate?: undefined;
    storeas?: undefined;
})[];
export default _default;
