declare const _default: ({
    key: string;
    ignore: boolean;
    hidden?: undefined;
    calculateValue?: undefined;
    weight?: undefined;
    type?: undefined;
    input?: undefined;
    placeholder?: undefined;
    label?: undefined;
    tooltip?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    components?: undefined;
    customConditional?: undefined;
    conditional?: undefined;
} | {
    key: string;
    hidden: boolean;
    calculateValue(context: any): any;
    ignore?: undefined;
    weight?: undefined;
    type?: undefined;
    input?: undefined;
    placeholder?: undefined;
    label?: undefined;
    tooltip?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    components?: undefined;
    customConditional?: undefined;
    conditional?: undefined;
} | {
    key: string;
    hidden: boolean;
    ignore?: undefined;
    calculateValue?: undefined;
    weight?: undefined;
    type?: undefined;
    input?: undefined;
    placeholder?: undefined;
    label?: undefined;
    tooltip?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    components?: undefined;
    customConditional?: undefined;
    conditional?: undefined;
} | {
    weight: number;
    type: string;
    input: boolean;
    placeholder: string;
    label: string;
    key: string;
    tooltip: string;
    ignore?: undefined;
    hidden?: undefined;
    calculateValue?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    components?: undefined;
    customConditional?: undefined;
    conditional?: undefined;
} | {
    weight: number;
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
    };
    ignore?: undefined;
    hidden?: undefined;
    calculateValue?: undefined;
    placeholder?: undefined;
    tooltip?: undefined;
    components?: undefined;
    customConditional?: undefined;
    conditional?: undefined;
} | {
    weight: number;
    type: string;
    input: boolean;
    components: ({
        input: boolean;
        type: string;
        label: string;
        key: string;
        defaultValue: boolean;
        customConditional({ data, buildingForm }: {
            data?: {} | undefined;
            buildingForm?: {} | undefined;
        }): boolean;
        tooltip?: undefined;
        conditional?: undefined;
        weight?: undefined;
        optionsLabelPosition?: undefined;
        values?: undefined;
        inline?: undefined;
        inputType?: undefined;
    } | {
        input: boolean;
        type: string;
        label: string;
        key: string;
        defaultValue: boolean;
        tooltip: string;
        conditional: {
            json: {
                '===': (boolean | {
                    var: string;
                })[];
            };
        };
        customConditional?: undefined;
        weight?: undefined;
        optionsLabelPosition?: undefined;
        values?: undefined;
        inline?: undefined;
        inputType?: undefined;
    } | {
        weight: number;
        label: string;
        optionsLabelPosition: string;
        values: {
            label: string;
            value: string;
        }[];
        inline: boolean;
        type: string;
        key: string;
        input: boolean;
        inputType: string;
        defaultValue: {
            previous: boolean;
            cancel: boolean;
            next: boolean;
        };
        customConditional?: undefined;
        tooltip?: undefined;
        conditional?: undefined;
    } | {
        weight: number;
        label: string;
        type: string;
        key: string;
        input: boolean;
        inputType: string;
        defaultValue: boolean;
        tooltip: string;
        customConditional?: undefined;
        conditional?: undefined;
        optionsLabelPosition?: undefined;
        values?: undefined;
        inline?: undefined;
    })[];
    customConditional(context: any): boolean;
    key?: undefined;
    ignore?: undefined;
    hidden?: undefined;
    calculateValue?: undefined;
    placeholder?: undefined;
    label?: undefined;
    tooltip?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    conditional?: undefined;
} | {
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    input: boolean;
    ignore?: undefined;
    hidden?: undefined;
    calculateValue?: undefined;
    placeholder?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    components?: undefined;
    customConditional?: undefined;
    conditional?: undefined;
} | {
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    input: boolean;
    conditional: {
        json: {
            '===': (boolean | {
                var: string;
            })[];
        };
    };
    ignore?: undefined;
    hidden?: undefined;
    calculateValue?: undefined;
    placeholder?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    components?: undefined;
    customConditional?: undefined;
})[];
export default _default;
