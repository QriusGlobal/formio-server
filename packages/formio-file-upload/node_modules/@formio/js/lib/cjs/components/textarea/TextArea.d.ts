export default class TextAreaComponent extends TextFieldComponent {
    editors: any[] | undefined;
    editorsReady: any[] | undefined;
    updateSizes: any[] | undefined;
    get autoExpand(): any;
    /**
     * Updates the editor value.
     * @param {number} index - The index of the editor.
     * @param {any} newValue - The new editor value.
     */
    updateEditorValue(index: number, newValue: any): void;
    autoModified: boolean | undefined;
    attachElement(element: any, index: any): any;
    imageHandler(moduleInstance: any, range: any, files: any): void;
    get isPlain(): boolean;
    get htmlView(): any;
    setValueAt(index: any, value: any, flags?: {}): void;
    setValue(value: any, flags?: {}): boolean;
    setContent(element: any, content: any, forceSanitize: any): void;
    setReadOnlyValue(value: any, index: any): void;
    get isJsonValue(): any;
    /**
     * Normalize values coming into updateValue. For example, depending on the configuration, string value `"true"` will be normalized to boolean `true`.
     * @param {*} value - The value to normalize
     * @returns {*} - Returns the normalized value
     */
    normalizeValue(value: any): any;
    normalizeSingleValue(value: any): any;
    setConvertedValue(value: any, index: any): any;
    setAsyncConvertedValue(value: any): Promise<any>;
    setImagesUrl(images: any): Promise<any>;
    addAutoExpanding(textarea: any, index: any): void;
    trimBlanks(value: any): any;
    onChange(flags: any, fromRoot: any): boolean;
    hasChanged(newValue: any, oldValue: any): boolean;
    getConvertedValue(value: any): any;
    focus(): void;
}
import TextFieldComponent from '../textfield/TextField';
