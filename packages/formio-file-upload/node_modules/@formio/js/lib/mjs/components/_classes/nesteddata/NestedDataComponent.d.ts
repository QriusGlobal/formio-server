export default class NestedDataComponent extends NestedComponent {
    static savedValueTypes(schema: any): string[];
    hasChanged(newValue: any, oldValue: any): boolean;
    get allowData(): boolean;
    get emptyValue(): {};
    componentContext(): any;
    getValueAsString(value: any, options: any): string;
    getDataValueAsTable(value: any, options: any): string;
    /**
     * Get the value of this component.
     * @returns {any} - Return the value of this component.
     */
    getValue(): any;
    updateValue(value: any, flags?: {}): boolean;
    setValue(value: any, flags?: {}): boolean;
}
import NestedComponent from '../nested/NestedComponent';
