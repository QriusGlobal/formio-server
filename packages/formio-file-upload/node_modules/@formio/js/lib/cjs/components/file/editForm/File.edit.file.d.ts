declare const _default: ({
    type: string;
    input: boolean;
    key: string;
    label: string;
    placeholder: string;
    weight: number;
    tooltip: string;
    valueProperty: string;
    dataSrc: string;
    data: {
        custom(): any;
    };
    conditional?: undefined;
    tableView?: undefined;
    components?: undefined;
    rows?: undefined;
    editor?: undefined;
    as?: undefined;
    optionsLabelPosition?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    conditional: {
        json: {
            '===': (string | {
                var: string;
            })[];
            in?: undefined;
            '!=='?: undefined;
            '=='?: undefined;
        };
    };
    placeholder?: undefined;
    weight?: undefined;
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    tableView?: undefined;
    components?: undefined;
    rows?: undefined;
    editor?: undefined;
    as?: undefined;
    optionsLabelPosition?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
} | {
    label: string;
    tableView: boolean;
    key: string;
    type: string;
    input: boolean;
    components: {
        label: string;
        applyMaskOn: string;
        mask: boolean;
        tableView: boolean;
        delimiter: boolean;
        requireDecimal: boolean;
        inputFormat: string;
        truncateMultipleSpaces: boolean;
        validate: {
            min: number;
            max: number;
        };
        key: string;
        type: string;
        input: boolean;
        defaultValue: number;
    }[];
    conditional: {
        json: {
            '===': (boolean | {
                var: string;
            })[];
            in?: undefined;
            '!=='?: undefined;
            '=='?: undefined;
        };
    };
    placeholder?: undefined;
    weight?: undefined;
    tooltip?: undefined;
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    rows?: undefined;
    editor?: undefined;
    as?: undefined;
    optionsLabelPosition?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    weight: number;
    placeholder: string;
    tooltip: string;
    conditional: {
        json: {
            '===': (string | {
                var: string;
            })[];
            in?: undefined;
            '!=='?: undefined;
            '=='?: undefined;
        };
    };
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    tableView?: undefined;
    components?: undefined;
    rows?: undefined;
    editor?: undefined;
    as?: undefined;
    optionsLabelPosition?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    weight: number;
    placeholder: string;
    conditional: {
        json: {
            in: (string[] | {
                var: string;
            })[];
            '==='?: undefined;
            '!=='?: undefined;
            '=='?: undefined;
        };
    };
    tooltip?: undefined;
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    tableView?: undefined;
    components?: undefined;
    rows?: undefined;
    editor?: undefined;
    as?: undefined;
    optionsLabelPosition?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
} | {
    type: string;
    key: string;
    label: string;
    tooltip: string;
    rows: number;
    editor: string;
    as: string;
    input: boolean;
    weight: number;
    placeholder: string;
    conditional: {
        json: {
            '===': (string | {
                var: string;
            })[];
            in?: undefined;
            '!=='?: undefined;
            '=='?: undefined;
        };
    };
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    tableView?: undefined;
    components?: undefined;
    optionsLabelPosition?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    placeholder: string;
    tooltip: string;
    weight: number;
    conditional: {
        json: {
            '!==': (string | {
                var: string;
            })[];
            '==='?: undefined;
            in?: undefined;
            '=='?: undefined;
        };
    };
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    tableView?: undefined;
    components?: undefined;
    rows?: undefined;
    editor?: undefined;
    as?: undefined;
    optionsLabelPosition?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    placeholder: string;
    tooltip: string;
    weight: number;
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    conditional?: undefined;
    tableView?: undefined;
    components?: undefined;
    rows?: undefined;
    editor?: undefined;
    as?: undefined;
    optionsLabelPosition?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    weight: number;
    placeholder?: undefined;
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    conditional?: undefined;
    tableView?: undefined;
    components?: undefined;
    rows?: undefined;
    editor?: undefined;
    as?: undefined;
    optionsLabelPosition?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    weight: number;
    conditional: {
        json: {
            '===': (string | {
                var: string;
            })[];
            in?: undefined;
            '!=='?: undefined;
            '=='?: undefined;
        };
    };
    placeholder?: undefined;
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    tableView?: undefined;
    components?: undefined;
    rows?: undefined;
    editor?: undefined;
    as?: undefined;
    optionsLabelPosition?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    placeholder: string;
    tooltip: string;
    weight: number;
    conditional: {
        json: {
            '==': (boolean | {
                var: string;
            })[];
            '==='?: undefined;
            in?: undefined;
            '!=='?: undefined;
        };
    };
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    tableView?: undefined;
    components?: undefined;
    rows?: undefined;
    editor?: undefined;
    as?: undefined;
    optionsLabelPosition?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
} | {
    type: string;
    input: boolean;
    key: string;
    label: string;
    tooltip: string;
    optionsLabelPosition: string;
    inline: boolean;
    defaultValue: boolean;
    values: {
        label: string;
        value: string;
    }[];
    placeholder?: undefined;
    weight?: undefined;
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    conditional?: undefined;
    tableView?: undefined;
    components?: undefined;
    rows?: undefined;
    editor?: undefined;
    as?: undefined;
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
    placeholder?: undefined;
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    conditional?: undefined;
    tableView?: undefined;
    rows?: undefined;
    editor?: undefined;
    as?: undefined;
    optionsLabelPosition?: undefined;
    inline?: undefined;
    defaultValue?: undefined;
    values?: undefined;
})[];
export default _default;
