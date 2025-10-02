export default class InputWidget extends Element {
    static get defaultSettings(): {
        type: string;
    };
    constructor(settings: any, component: any, instance: any, index: any);
    valueIndex: any;
    componentInstance: any;
    namespace: string;
    component: any;
    settings: any;
    attach(input: any): Promise<void>;
    _input: any;
    get defaultSettings(): {};
    set disabled(disabled: any);
    get input(): any;
    getValue(): any;
    getValueAsString(value: any): any;
    get validationValue(): any;
    addPrefix(): null;
    addSuffix(): null;
    setValue(value: any): void;
    evalContext(additional: any): any;
}
import Element from '../Element';
