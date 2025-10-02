declare const _default: ({
    key: string;
    ignore: boolean;
    data?: undefined;
    validate?: undefined;
    onChange?: undefined;
    type?: undefined;
    input?: undefined;
    label?: undefined;
    tooltip?: undefined;
    weight?: undefined;
    reorder?: undefined;
    defaultValue?: undefined;
    components?: undefined;
    conditional?: undefined;
    clearOnHide?: undefined;
    template?: undefined;
    dataSrc?: undefined;
} | {
    key: string;
    data: {
        values: {
            label: string;
            value: string;
        }[];
    };
    validate: {
        required: boolean;
    };
    onChange(context: any): void;
    ignore?: undefined;
    type?: undefined;
    input?: undefined;
    label?: undefined;
    tooltip?: undefined;
    weight?: undefined;
    reorder?: undefined;
    defaultValue?: undefined;
    components?: undefined;
    conditional?: undefined;
    clearOnHide?: undefined;
    template?: undefined;
    dataSrc?: undefined;
} | {
    type: string;
    input: boolean;
    label: string;
    key: string;
    tooltip: string;
    weight: number;
    reorder: boolean;
    defaultValue: {
        label: string;
        value: string;
    }[];
    components: ({
        label: string;
        key: string;
        input: boolean;
        type: string;
        allowCalculateOverride?: undefined;
        calculateValue?: undefined;
        validate?: undefined;
        weight?: undefined;
        tooltip?: undefined;
        dataSrc?: undefined;
        valueProperty?: undefined;
        customDefaultValue?: undefined;
        template?: undefined;
        data?: undefined;
    } | {
        label: string;
        key: string;
        input: boolean;
        type: string;
        allowCalculateOverride: boolean;
        calculateValue: string;
        validate: {
            required: boolean;
        };
        weight?: undefined;
        tooltip?: undefined;
        dataSrc?: undefined;
        valueProperty?: undefined;
        customDefaultValue?: undefined;
        template?: undefined;
        data?: undefined;
    } | {
        type: string;
        input: boolean;
        weight: number;
        label: string;
        key: string;
        tooltip: string;
        dataSrc: string;
        valueProperty: string;
        customDefaultValue: () => string;
        template: string;
        data: {
            custom(context: any): {
                label: string;
                value: string;
            }[];
        };
        allowCalculateOverride?: undefined;
        calculateValue?: undefined;
        validate?: undefined;
    })[];
    conditional: {
        json: {
            '===': (string | {
                var: string;
            })[];
        };
    };
    ignore?: undefined;
    data?: undefined;
    validate?: undefined;
    onChange?: undefined;
    clearOnHide?: undefined;
    template?: undefined;
    dataSrc?: undefined;
} | {
    type: string;
    input: boolean;
    label: string;
    key: string;
    clearOnHide: boolean;
    tooltip: string;
    weight: number;
    template: string;
    dataSrc: string;
    data: {
        values: {
            label: string;
            value: string;
        }[];
    };
    ignore?: undefined;
    validate?: undefined;
    onChange?: undefined;
    reorder?: undefined;
    defaultValue?: undefined;
    components?: undefined;
    conditional?: undefined;
} | {
    key: string;
    conditional: {
        json: {
            '===': (string | {
                var: string;
            })[];
        };
    };
    ignore?: undefined;
    data?: undefined;
    validate?: undefined;
    onChange?: undefined;
    type?: undefined;
    input?: undefined;
    label?: undefined;
    tooltip?: undefined;
    weight?: undefined;
    reorder?: undefined;
    defaultValue?: undefined;
    components?: undefined;
    clearOnHide?: undefined;
    template?: undefined;
    dataSrc?: undefined;
})[];
export default _default;
