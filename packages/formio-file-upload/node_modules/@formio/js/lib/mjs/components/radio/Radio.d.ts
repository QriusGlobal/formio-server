export default class RadioComponent extends ListComponent {
    static get builderInfo(): {
        title: string;
        group: string;
        icon: string;
        weight: number;
        documentation: string;
        schema: any;
    };
    static get conditionOperatorsSettings(): {
        valueComponent(classComp: any): any;
    };
    static get serverConditionSettings(): {
        valueComponent(classComp: any): any;
    };
    static savedValueTypes(schema: any): any[];
    constructor(component: any, options: any, data: any);
    previousValue: any;
    get inputInfo(): any;
    get emptyValue(): string;
    get isRadio(): boolean;
    get optionSelectedClass(): string;
    get listData(): any;
    get selectMetadata(): any;
    templateData: {} | undefined;
    triggerUpdate: ((...args: any[]) => any) | undefined;
    itemsLoadedResolve: ((value: any) => void) | undefined;
    optionsLoaded: boolean | undefined;
    loadedOptions: any[] | undefined;
    beforeSubmit(): Promise<any>;
    render(): string;
    attach(element: any): Promise<void>;
    detach(element: any): void;
    validateValueProperty(): boolean;
    validateValueAvailability(setting: any, value: any): boolean;
    getValueAsString(value: any, options?: {}): any;
    setValueAt(index: any, value: any): void;
    loadItems(url: any, search: any, headers: any, options: any, method: any, body: any): void;
    loadItemsFromMetadata(): void;
    setItems(items: any): void;
    setSelectedClasses(): void;
    updateValue(value: any, flags: any): boolean;
    currentValue: any;
}
import ListComponent from '../_classes/list/ListComponent';
