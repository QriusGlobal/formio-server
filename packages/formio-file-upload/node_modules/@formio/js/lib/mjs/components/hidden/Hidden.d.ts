export default class HiddenComponent extends Input {
    static get builderInfo(): {
        title: string;
        group: string;
        icon: string;
        weight: number;
        documentation: string;
        showPreview: boolean;
        schema: any;
    };
    get inputInfo(): any;
    labelIsHidden(): boolean;
    get emptyValue(): string;
    setValue(value: any, flags?: {}): boolean;
}
import Input from '../_classes/input/Input';
