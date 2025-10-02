declare const _default: ({
    type: string;
    input: boolean;
    weight: number;
    tooltip: string;
    key: string;
    defaultValue: string;
    label: string;
    dataSrc: string;
    placeholder?: undefined;
    conditional?: undefined;
    components?: undefined;
    skipMerge?: undefined;
    clearOnHide?: undefined;
    description?: undefined;
    editor?: undefined;
    as?: undefined;
    rows?: undefined;
    allowCalculateOverride?: undefined;
    calculateValue?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    weight: number;
    label: string;
    placeholder: string;
    tooltip: string;
    conditional: {
        json: {
            '===': (string | {
                var: string;
            })[];
            in?: undefined;
            or?: undefined;
        };
    };
    defaultValue?: undefined;
    dataSrc?: undefined;
    components?: undefined;
    skipMerge?: undefined;
    clearOnHide?: undefined;
    description?: undefined;
    editor?: undefined;
    as?: undefined;
    rows?: undefined;
    allowCalculateOverride?: undefined;
    calculateValue?: undefined;
} | {
    type: string;
    input: boolean;
    label: string;
    key: string;
    tooltip: string;
    weight: number;
    components: {
        label: string;
        key: string;
        input: boolean;
        type: string;
    }[];
    conditional: {
        json: {
            '===': (string | {
                var: string;
            })[];
            in?: undefined;
            or?: undefined;
        };
    };
    defaultValue?: undefined;
    dataSrc?: undefined;
    placeholder?: undefined;
    skipMerge?: undefined;
    clearOnHide?: undefined;
    description?: undefined;
    editor?: undefined;
    as?: undefined;
    rows?: undefined;
    allowCalculateOverride?: undefined;
    calculateValue?: undefined;
} | {
    type: string;
    input: boolean;
    label: string;
    key: string;
    skipMerge: boolean;
    clearOnHide: boolean;
    weight: number;
    description: string;
    tooltip: string;
    conditional: {
        json: {
            in: (string[] | {
                var: string;
            })[];
            '==='?: undefined;
            or?: undefined;
        };
    };
    defaultValue?: undefined;
    dataSrc?: undefined;
    placeholder?: undefined;
    components?: undefined;
    editor?: undefined;
    as?: undefined;
    rows?: undefined;
    allowCalculateOverride?: undefined;
    calculateValue?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    editor: string;
    as: string;
    rows: number;
    weight: number;
    tooltip: string;
    allowCalculateOverride: boolean;
    calculateValue: (context: any) => any;
    defaultValue?: undefined;
    dataSrc?: undefined;
    placeholder?: undefined;
    conditional?: undefined;
    components?: undefined;
    skipMerge?: undefined;
    clearOnHide?: undefined;
    description?: undefined;
} | {
    type: string;
    input: boolean;
    weight: number;
    key: string;
    label: string;
    tooltip: string;
    conditional: {
        json: {
            '===': (string | {
                var: string;
            })[];
            in?: undefined;
            or?: undefined;
        };
    };
    defaultValue?: undefined;
    dataSrc?: undefined;
    placeholder?: undefined;
    components?: undefined;
    skipMerge?: undefined;
    clearOnHide?: undefined;
    description?: undefined;
    editor?: undefined;
    as?: undefined;
    rows?: undefined;
    allowCalculateOverride?: undefined;
    calculateValue?: undefined;
} | {
    type: string;
    input: boolean;
    weight: number;
    key: string;
    label: string;
    tooltip: string;
    conditional: {
        json: {
            or: {
                '===': (string | {
                    var: string;
                })[];
            }[];
            '==='?: undefined;
            in?: undefined;
        };
    };
    defaultValue?: undefined;
    dataSrc?: undefined;
    placeholder?: undefined;
    components?: undefined;
    skipMerge?: undefined;
    clearOnHide?: undefined;
    description?: undefined;
    editor?: undefined;
    as?: undefined;
    rows?: undefined;
    allowCalculateOverride?: undefined;
    calculateValue?: undefined;
})[];
export default _default;
