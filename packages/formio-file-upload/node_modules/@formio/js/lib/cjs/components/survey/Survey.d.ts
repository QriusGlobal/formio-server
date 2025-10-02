export default class SurveyComponent extends Field {
    static get builderInfo(): {
        title: string;
        group: string;
        icon: string;
        weight: number;
        documentation: string;
        schema: any;
    };
    static get serverConditionSettings(): {
        operators: string[];
    };
    static get conditionOperatorsSettings(): {
        operators: string[];
    };
    static savedValueTypes(schema: any): string[];
    render(): string;
    attach(element: any): Promise<void>;
    setValue(value: any, flags?: {}): boolean;
    get emptyValue(): {};
    validateRequired(setting: any, value: any): any;
    getInputName(question: any): string;
    getValueAsString(value: any, options: any): any;
}
import Field from '../_classes/field/Field';
