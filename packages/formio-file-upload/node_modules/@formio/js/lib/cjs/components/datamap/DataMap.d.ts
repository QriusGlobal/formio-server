export default class DataMapComponent extends DataGridComponent {
    static savedValueTypes(schema: any): string[];
    constructor(component: any, options: any, data: any);
    get schema(): any;
    get emptyValue(): {};
    set dataValue(value: any);
    get dataValue(): any;
    get defaultValue(): any;
    get keySchema(): {
        type: string;
        input: boolean;
        hideLabel: boolean;
        label: any;
        key: string;
        disableBuilderActions: boolean;
    };
    get valueKey(): any;
    get iteratableRows(): {
        components: any;
        data: any;
    }[][];
    hasHeader(): boolean;
    getRowKey(rowIndex: any): string;
    get defaultRowKey(): string;
    getValueAsString(value: any, options: any): any;
    createRowComponents(row: any, rowIndex: any): {
        __key: any;
    };
    addChildComponent(component: any): void;
    saveChildComponent(component: any): void;
    removeChildComponent(): void;
    checkColumns(): {
        rebuild: boolean;
        show: boolean;
    };
}
import DataGridComponent from '../datagrid/DataGrid';
