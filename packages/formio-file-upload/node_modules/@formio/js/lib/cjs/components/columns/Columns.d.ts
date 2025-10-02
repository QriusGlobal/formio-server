export default class ColumnsComponent extends NestedComponent {
    static get builderInfo(): {
        title: string;
        icon: string;
        group: string;
        documentation: string;
        showPreview: boolean;
        weight: number;
        schema: any;
    };
    static savedValueTypes(): never[];
    rows: any[];
    get schema(): any;
    get columnKey(): string;
    columns: any[] | undefined;
    labelIsHidden(): boolean;
    render(): string;
    justifyColumn(items: any, index: any): boolean;
    justify(): any;
    get gridSize(): number;
    /**
     * Group columns in rows.
     * @returns {Array.<ColumnComponent[]>} - The array of columns
     */
    groupByRow(): Array<ColumnComponent[]>;
    checkData(data: any, flags: any, row: any, components: any): void;
    detach(all: any): void;
}
import NestedComponent from '../_classes/nested/NestedComponent';
