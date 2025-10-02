declare const _default: {
    key: string;
    components: {
        key: string;
        components: {
            key: string;
            components: ({
                data: {
                    json: ({
                        label: string;
                        value: string;
                        type: string;
                        component?: undefined;
                    } | {
                        label: string;
                        value: string;
                        type: string;
                        component: string;
                    })[];
                };
                key: string;
                type?: undefined;
                editor?: undefined;
                rows?: undefined;
                as?: undefined;
                label?: undefined;
                tooltip?: undefined;
                defaultValue?: undefined;
                weight?: undefined;
                input?: undefined;
                customConditional?: undefined;
            } | {
                type: string;
                editor: string;
                rows: number;
                as: string;
                label: string;
                tooltip: string;
                defaultValue: string;
                key: string;
                weight: number;
                input: boolean;
                customConditional(context: any): any;
                data?: undefined;
            })[];
        }[];
    }[];
}[];
export default _default;
