export default class FormioAddon extends Element {
    static get info(): {
        supportedComponents: never[];
        name: string;
        components: never[];
        label: string;
        defaultSettings: {};
    };
    constructor(settings: any, componentInstance: any);
    get defaultSettings(): {};
    get element(): any;
    namespace: string;
    component: any;
    settings: any;
    attach(element: any): Promise<void>;
    _element: any;
    destroy(): void;
}
import Element from '../Element';
