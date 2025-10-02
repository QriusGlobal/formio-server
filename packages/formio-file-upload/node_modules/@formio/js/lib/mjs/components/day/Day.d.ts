export default class DayComponent extends Field {
    static get builderInfo(): {
        title: string;
        group: string;
        icon: string;
        documentation: string;
        weight: number;
        schema: any;
    };
    static get conditionOperatorsSettings(): {
        operators: string[];
    };
    static savedValueTypes(schema: any): string[];
    static oldEmptyValue: string;
    static get serverConditionSettings(): {
        operators: string[];
    };
    constructor(component: any, options: any, data: any);
    /**
     * The empty value for day component.
     * @returns {''} - The empty value of the day component.
     */
    get emptyValue(): "";
    get valueMask(): RegExp;
    get dayRequired(): any;
    get showDay(): boolean;
    get monthRequired(): any;
    get showMonth(): boolean;
    get yearRequired(): any;
    get showYear(): boolean;
    get inputInfo(): any;
    inputDefinition(name: any): {
        type: string;
        ref: any;
        attr: {
            id: string;
            class: string;
            type: string;
            placeholder: string;
            step: number;
            min: any;
            max: any;
        };
    };
    selectDefinition(name: any): {
        multiple: boolean;
        ref: any;
        widget: string;
        attr: {
            id: string;
            class: string;
            name: any;
            lang: any;
        };
    };
    get days(): {
        value: string;
        label: any;
    }[];
    _days: {
        value: string;
        label: any;
    }[] | undefined;
    get months(): ({
        value: string;
        label: any;
    } | {
        value: number;
        label: string;
    })[];
    _months: ({
        value: string;
        label: any;
    } | {
        value: number;
        label: string;
    })[] | undefined;
    get years(): {
        value: string;
        label: any;
    }[];
    _years: {
        value: string;
        label: any;
    }[] | undefined;
    setErrorClasses(elements: any, dirty: any, hasError: any): void;
    dayFirst: any;
    render(): string;
    renderField(name: any): any;
    attach(element: any): Promise<void>;
    set disabled(disabled: any);
    validateRequired(setting: any, value: any): boolean;
    normalizeValue(value: any): any;
    /**
     * Set the value at a specific index and updates the component's refs.
     * @param {number} index - The index to set.
     * @param {any} value - The value to set.
     * @returns {null|void} - Returns null if the value is invalid, otherwise void.
     */
    setValueAt(index: number, value: any): null | void;
    getDayWithHiddenFields(parts: any): {
        month: any;
        day: any;
        year: any;
    };
    getFieldValue(name: any): number;
    get parts(): {
        day: number;
        month: number;
        year: number;
    };
    /**
     * Get the format for the value string.
     * @returns {string} - the format for the value string.
     */
    get format(): string;
    /**
     * Return the date for this component.
     * @param {any} value - The value to convert to a date.
     * @returns {null|string} - The date string.
     */
    getDate(value: any): null | string;
    /**
     * Return the date string for this component.
     * @returns {string|null} - The date string for this component.
     */
    get date(): string | null;
    /**
     * Return the raw value.
     * @returns {string} - The raw value of the component.
     */
    get validationValue(): string;
    /**
     * Get the input value of the date.
     * @param {any} value - The value to convert to a string.
     * @returns {string|null} - The string value of the date.
     */
    getValueAsString(value: any): string | null;
    isPartialDay(value: any): boolean;
    getValidationFormat(): string;
}
import Field from '../_classes/field/Field';
