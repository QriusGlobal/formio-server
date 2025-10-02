export default class TextFieldComponent extends Input {
    static get builderInfo(): {
        title: string;
        icon: string;
        group: string;
        documentation: string;
        weight: number;
        schema: any;
    };
    static get serverConditionSettings(): {
        operators: any[];
        valueComponent(classComp: any): any;
    };
    static get conditionOperatorsSettings(): {
        operators: any[];
        valueComponent(classComp: any): any;
    };
    static savedValueTypes(schema: any): string[];
    get emptyValue(): string;
    /**
     * Returns the mask value object (mutates value!).
     * @param {any} [value] - The value to convert to a mask value.
     * @param {any} [flags] - The flags to use when converting to a mask value.
     * @returns {*} - The value as a mask value.
     */
    maskValue(value?: any, flags?: any): any;
    /**
     * Normalize the value set in the data object.
     * @param {any} value - The value to normalize.
     * @param {any} flags - The flags to use when normalizing the value.
     * @returns {*} - Returns the normalized value.
     */
    normalizeValue(value: any, flags?: any): any;
    unmaskValue(value: any, format?: any): string;
    /**
     * Returns the value at this index.
     * @param {number} index - The index to get the value from.
     * @returns {*} - The value at the index.
     */
    getValueAt(index: number): any;
    checkInputMaskValue(inputMask: any): boolean;
    setInputMask(input: any, inputMask: any, usePlaceholder: any): void;
    isHtmlRenderMode(): any;
    truncateMultipleSpaces(value: any): any;
    beforeSubmit(): Promise<any>;
    getValueAsString(value: any, options: any): string;
}
import Input from '../_classes/input/Input';
