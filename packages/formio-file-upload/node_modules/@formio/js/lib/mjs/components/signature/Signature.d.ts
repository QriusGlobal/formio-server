export default class SignatureComponent extends Input {
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
    currentWidth: any;
    scale: any;
    ratio: number | undefined;
    get emptyValue(): string;
    setValue(value: any, flags?: {}): boolean;
    showCanvas(show: any): void;
    onDisabled(): void;
    checkSize(force: any, scale: any): void;
    signaturePad: SignaturePad | null | undefined;
    observer: any;
    getValueAsString(value: any): "" | "Yes" | "No";
    focus(): void;
    setDataToSigaturePad(): void;
}
import Input from '../_classes/input/Input';
import SignaturePad from 'signature_pad';
