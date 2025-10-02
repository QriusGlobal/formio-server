declare const _default: ({
    type: string;
    input: boolean;
    key: string;
    label: string;
    persistent: boolean;
    weight: number;
    tooltip: string;
    applyMaskOn?: undefined;
    logic?: undefined;
    skipMerge?: undefined;
    tableView?: undefined;
    validateWhenHidden?: undefined;
    enableTime?: undefined;
} | {
    label: string;
    tooltip: string;
    applyMaskOn: string;
    key: string;
    logic: ({
        name: string;
        trigger: {
            type: string;
            javascript: string;
            event?: undefined;
        };
        actions: {
            name: string;
            type: string;
            schemaDefinition: string;
        }[];
    } | {
        name: string;
        trigger: {
            type: string;
            event: string;
            javascript?: undefined;
        };
        actions: {
            name: string;
            type: string;
            customAction: string;
        }[];
    })[];
    type: string;
    input: boolean;
    skipMerge: boolean;
    weight: number;
    persistent?: undefined;
    tableView?: undefined;
    validateWhenHidden?: undefined;
    enableTime?: undefined;
} | {
    label: string;
    tooltip: string;
    applyMaskOn: string;
    tableView: boolean;
    validateWhenHidden: boolean;
    key: string;
    logic: ({
        name: string;
        trigger: {
            type: string;
            javascript: string;
            event?: undefined;
        };
        actions: {
            name: string;
            type: string;
            schemaDefinition: string;
        }[];
    } | {
        name: string;
        trigger: {
            type: string;
            event: string;
            javascript?: undefined;
        };
        actions: {
            name: string;
            type: string;
            customAction: string;
        }[];
    })[];
    type: string;
    input: boolean;
    enableTime: boolean;
    skipMerge: boolean;
    weight: number;
    persistent?: undefined;
})[];
export default _default;
