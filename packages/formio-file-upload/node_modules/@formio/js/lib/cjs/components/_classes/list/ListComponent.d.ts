export default class ListComponent extends Field {
    get isSelectURL(): boolean;
    get selectData(): any;
    get dataReady(): any;
    get shouldLoad(): boolean;
    getTemplateKeys(): void;
    templateKeys: string[] | undefined;
    get requestHeaders(): any;
    setItems(): void;
    updateCustomItems(): void;
    loadItems(): void;
    getOptionTemplate(data: any, value: any, index: any): any;
    itemTemplate(data: any, value: any, index: any): any;
    set itemsLoaded(promise: any);
    get itemsLoaded(): any;
    _itemsLoaded: any;
    handleLoadingError(err: any): void;
    loading: boolean | undefined;
    networkError: boolean | undefined;
    updateItems(searchInput: any, forceUpdate: any): void;
}
import Field from '../field/Field';
