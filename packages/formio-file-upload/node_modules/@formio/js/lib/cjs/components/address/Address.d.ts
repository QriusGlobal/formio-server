export namespace AddressComponentMode {
    let Autocomplete: string;
    let Manual: string;
}
export default class AddressComponent extends ContainerComponent {
    static get builderInfo(): {
        title: string;
        group: string;
        icon: string;
        documentation: string;
        weight: number;
        schema: any;
    };
    static get serverConditionSettings(): {
        operators: string[];
    };
    static get conditionOperatorsSettings(): {
        operators: string[];
    };
    static get modeSwitcherRef(): string;
    static get removeValueIconRef(): string;
    static get searchInputRef(): string;
    static get addRowButtonRef(): string;
    static get removeRowButtonRef(): string;
    provider: any;
    initializeProvider(provider: any, options?: {}): any;
    get emptyValue(): {
        mode: string;
        address: {};
    } | {
        mode?: undefined;
        address?: undefined;
    };
    set mode(value: any);
    get mode(): any;
    get autocompleteMode(): boolean;
    get manualMode(): boolean;
    get manualModeEnabled(): boolean;
    restoreComponentsContext(): void;
    get isMultiple(): boolean;
    set address(value: any);
    get address(): any;
    isValueInLegacyFormat(value: any): any;
    normalizeValue(value: any): any;
    get modeSwitcher(): any;
    get providerOptions(): {
        params: any;
        url: any;
        queryProperty: any;
        responseProperty: any;
        displayValueProperty: any;
        autocompleteOptions: any;
    };
    get removeValueIcon(): any;
    get searchInput(): any;
    get addRowButton(): any;
    get removeRowButton(): any;
    get searchInputAttributes(): {
        name: any;
        type: string;
        class: string;
        lang: any;
        tabindex: any;
    };
    get gridTemplateName(): string;
    get rowTemplateName(): string;
    get hasChildren(): boolean;
    get addAnother(): string;
    renderElement(value: any): any;
    renderRow(value: any, index: any): any;
    renderGrid(): any;
    render(): string;
    onSelectAddress(address: any, element: any, index: any): void;
    addRow(): void;
    attach(element: any): Promise<void>;
    addChildComponent(component: any): void;
    clearAddress(element: any, index: any): void;
    getDisplayValue(value?: any): any;
    updateRemoveIcon(index: any): void;
    getValueAsString(value: any, options: any): any;
}
import ContainerComponent from '../container/Container';
