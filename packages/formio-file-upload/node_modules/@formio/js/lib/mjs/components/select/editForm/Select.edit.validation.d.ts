declare const _default: ({
    weight: number;
    type: string;
    label: string;
    tooltip: string;
    key: string;
    input: boolean;
    conditional: {
        json: {
            var: string;
            in?: undefined;
        };
    };
} | {
    weight: number;
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
            var?: undefined;
        };
    };
})[];
export default _default;
