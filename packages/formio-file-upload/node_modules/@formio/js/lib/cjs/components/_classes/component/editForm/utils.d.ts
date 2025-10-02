export default EditFormUtils;
declare namespace EditFormUtils {
    function sortAndFilterComponents(components: any): any;
    function unifyComponents(objValue: any, srcValue: any): any;
    function logicVariablesTable(additional: any): {
        type: string;
        tag: string;
        content: string;
    };
    function javaScriptValue(title: any, property: any, propertyJSON: any, weight: any, exampleHTML: any, exampleJSON: any, additionalParams: string | undefined, excludeJSONLogic: any): {
        type: string;
        title: any;
        theme: string;
        collapsible: boolean;
        collapsed: boolean;
        key: string;
        weight: any;
        components: ({
            type: string;
            tag: string;
            content: string;
        } | {
            type: string;
            title: string;
            collapsible: boolean;
            collapsed: boolean;
            style: {
                'margin-bottom': string;
            };
            key: string;
            customConditional(): boolean;
            components: ({
                type: string;
                key: any;
                rows: number;
                editor: string;
                hideLabel: boolean;
                as: string;
                input: boolean;
                tag?: undefined;
                content?: undefined;
            } | {
                type: string;
                tag: string;
                content: string;
                key?: undefined;
                rows?: undefined;
                editor?: undefined;
                hideLabel?: undefined;
                as?: undefined;
                input?: undefined;
            })[];
        } | {
            type: string;
            title: string;
            collapsible: boolean;
            collapsed: boolean;
            key: string;
            components: ({
                type: string;
                tag: string;
                content: string;
                key?: undefined;
                rows?: undefined;
                editor?: undefined;
                hideLabel?: undefined;
                as?: undefined;
                input?: undefined;
            } | {
                type: string;
                key: any;
                rows: number;
                editor: string;
                hideLabel: boolean;
                as: string;
                input: boolean;
                tag?: undefined;
                content?: undefined;
            })[];
            style?: undefined;
            customConditional?: undefined;
        })[];
    };
}
