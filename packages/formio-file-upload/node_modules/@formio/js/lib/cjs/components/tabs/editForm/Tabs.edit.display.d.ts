declare const _default: ({
    key: string;
    ignore: boolean;
    weight?: undefined;
    type?: undefined;
    input?: undefined;
    label?: undefined;
    placeholder?: undefined;
    tooltip?: undefined;
    validate?: undefined;
    autofocus?: undefined;
    overrideEditForm?: undefined;
    reorder?: undefined;
    components?: undefined;
} | {
    weight: number;
    type: string;
    input: boolean;
    key: string;
    label: string;
    placeholder: string;
    tooltip: string;
    validate: {
        required: boolean;
    };
    autofocus: boolean;
    overrideEditForm: boolean;
    ignore?: undefined;
    reorder?: undefined;
    components?: undefined;
} | {
    key: string;
    type: string;
    input: boolean;
    label: string;
    weight: number;
    reorder: boolean;
    components: ({
        type: string;
        input: boolean;
        key: string;
        label: string;
        allowCalculateOverride?: undefined;
        calculateValue?: undefined;
    } | {
        type: string;
        input: boolean;
        key: string;
        label: string;
        allowCalculateOverride: boolean;
        calculateValue: {
            _camelCase: {
                var: string;
            }[];
        };
    })[];
    ignore?: undefined;
    placeholder?: undefined;
    tooltip?: undefined;
    validate?: undefined;
    autofocus?: undefined;
    overrideEditForm?: undefined;
} | {
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    input: boolean;
    ignore?: undefined;
    placeholder?: undefined;
    validate?: undefined;
    autofocus?: undefined;
    overrideEditForm?: undefined;
    reorder?: undefined;
    components?: undefined;
})[];
export default _default;
