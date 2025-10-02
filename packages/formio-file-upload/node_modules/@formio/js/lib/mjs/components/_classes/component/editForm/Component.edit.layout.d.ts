declare const _default: ({
    label: string;
    type: string;
    input: boolean;
    key: string;
    keyLabel: string;
    valueComponent: {
        type: string;
        key: string;
        label: string;
        input: boolean;
    };
    tooltip: string;
    addAnother: string;
    legend?: undefined;
    title?: undefined;
    weight?: undefined;
    collapsible?: undefined;
    collapsed?: undefined;
    components?: undefined;
} | {
    type: string;
    legend: string;
    title: string;
    key: string;
    tooltip: string;
    weight: number;
    collapsible: boolean;
    collapsed: boolean;
    components: {
        type: string;
        input: boolean;
        key: string;
        label: string;
        placeholder: string;
        tooltip: string;
    }[];
    label?: undefined;
    input?: undefined;
    keyLabel?: undefined;
    valueComponent?: undefined;
    addAnother?: undefined;
})[];
export default _default;
