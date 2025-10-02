export default class WizardBuilder extends WebformBuilder {
    _form: {
        components: {
            title: string;
            label: string;
            type: string;
            key: string;
            components: any[];
        }[];
    };
    page: number;
    removeComponent(component: any, parent: any, original: any): boolean | undefined;
    allowDrop(element: any): boolean;
    get pages(): any;
    get currentPage(): any;
    setForm(value: any): void;
    set form(value: {
        components: {
            title: string;
            label: string;
            type: string;
            key: string;
            components: any[];
        }[];
    });
    get form(): {
        components: {
            title: string;
            label: string;
            type: string;
            key: string;
            components: any[];
        }[];
    };
    navigationDragula: any;
    rebuild(): Promise<void> | Promise<boolean>;
    addPage(page: any): Promise<void> | Promise<boolean>;
    removePage(pageIndex: any, componentIndex: any): Promise<void> | Promise<boolean> | undefined;
    onReorder(element: any, _target: any, _source: any, sibling: any): Promise<void> | undefined;
    setPage(index: any): Promise<void> | Promise<boolean> | undefined;
    getPageConfig(index: any, components?: any[]): {
        title: string;
        label: string;
        type: string;
        key: string;
        components: any[];
    };
    pasteComponent(component: any): void;
}
import WebformBuilder from './WebformBuilder';
