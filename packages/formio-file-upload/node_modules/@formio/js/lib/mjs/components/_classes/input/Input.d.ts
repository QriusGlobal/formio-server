export default class Input extends Multivalue {
    constructor(component: any, options: any, data: any);
    triggerUpdateValueAt: any;
    get inputInfo(): {
        id: any;
        type: string;
        changeEvent: string;
        content: string;
        attr: {
            name: any;
            type: any;
            class: string;
            lang: any;
        };
    };
    get autocompleteDisableAttrName(): string;
    get maskOptions(): any;
    get isMultipleMasksField(): any;
    getMaskByName(maskName: any): any;
    setInputMask(input: any, inputMask: any): void;
    getMaskOptions(): any;
    getWordCount(value: any): any;
    get remainingWords(): number;
    get prefix(): any;
    get suffix(): any;
    renderElement(value: any, index: any): any;
    setCounter(type: any, element: any, count: any, max: any): void;
    updateValueAt(value: any, flags: any, index: any): void;
    getValueAt(index: any): any;
    updateValue(value: any, flags: any, index: any): boolean;
    parseValue(value: any): any;
    formatValue(value: any): any;
    attach(element: any): Promise<any>;
    getWidget(index: any): any;
    attachElement(element: any, index: any): Promise<void>;
    /**
     * Creates an instance of a widget for this component.
     * @param {number} index - The index of the widget.
     * @returns {*} - The widget instance.
     */
    createWidget(index: number): any;
}
import Multivalue from '../multivalue/Multivalue';
