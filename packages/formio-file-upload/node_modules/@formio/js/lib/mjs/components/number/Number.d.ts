export default class NumberComponent extends Input {
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
    constructor(...args: any[]);
    decimalSeparator: any;
    delimiter: any;
    decimalLimit: number;
    numberMask: any;
    /**
     * Creates the number mask for normal numbers.
     * @returns {*} - The number mask.
     */
    createNumberMask(): any;
    isDecimalAllowed(): any;
    /**
     * parses a numeric string by removing the delimiters and replacing the decimal separator back to '.' so that it can
     * be processed by either parseInt or parseFloat
     * @param {string} value the value to be parsed
     * @returns {number} a parsed number
     */
    parseNumber(value: string): number;
    setInputMask(input: any): void;
    getValueAt(index: any): number | null;
    setValueAt(index: any, value: any, flags?: {}): void;
    /**
     * Converts a string to a floating point number, formats the number based on the parsed float function
     * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat) and then returns the
     * formatted number back as a string
     * Example Input: "123.456,22"
     * Example Output: "123456,22"
     * @param {string | number} input the numeric string to parse
     * @returns {string | null} a parsed string
     */
    parseValue(input: string | number): string | null;
    focus(): void;
    getMaskedValue(value: any): any;
    getValueAsString(value: any, options: any): any;
}
import Input from '../_classes/input/Input';
