declare const _default: ({
    key: string;
    ignore: boolean;
    type?: undefined;
    label?: undefined;
    tooltip?: undefined;
    input?: undefined;
    conditional?: undefined;
} | {
    type: string;
    label: string;
    tooltip: string;
    key: string;
    input: boolean;
    conditional: {
        json: {
            in: (string[] | {
                var: string;
            })[];
        };
    };
    ignore?: undefined;
})[];
export default _default;
