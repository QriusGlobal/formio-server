export default class SelectBoxesComponent extends RadioComponent {
    static savedValueTypes(schema: any): string[];
    constructor(...args: any[]);
    get emptyValue(): any;
    /**
     * Only empty if the values are all false.
     * @param {any} value - The value to check if empty.
     * @returns {boolean} - If the value is empty.
     */
    isEmpty(value?: any): boolean;
    setInputsDisabled(value: any, onlyUnchecked: any): void;
    checkComponentValidity(data: any, dirty: any, rowData: any, options: any, errors?: any[]): boolean;
}
import RadioComponent from '../radio/Radio';
