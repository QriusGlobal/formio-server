export class Formio {
    static FormioClass: null;
    static baseUrl: any;
    static projectUrl: any;
    static pathType: any;
    static language: any;
    static config: {};
    static cdn: any;
    static modules: any[];
    static icons: string;
    static license: string;
    static formioReady: Promise<any>;
    static version: string;
    static setLicense(license: any, norecurse?: boolean): void;
    static setBaseUrl(url: any, norecurse?: boolean): void;
    static setApiUrl(url: any, norecurse?: boolean): void;
    static setProjectUrl(url: any, norecurse?: boolean): void;
    static setAppUrl(url: any, norecurse?: boolean): void;
    static setPathType(type: any, norecurse?: boolean): void;
    static debug(...args: any[]): void;
    static clearCache(): void;
    static global(prop: any, flag?: string): any;
    static use(module: any): void;
    static createElement(type: any, attrs: any, children: any): any;
    static addScript(wrapper: any, src: any, name: any, flag?: string): Promise<any>;
    static addStyles(wrapper: any, href: any): Promise<void>;
    static submitDone(instance: any, submission: any): Promise<void>;
    static formioScript(script: any, builder: any): any;
    static addLibrary(libWrapper: any, lib: any, name: any): Promise<void>;
    static addLoader(wrapper: any): Promise<void>;
    static init(element: any, options?: {}, builder?: boolean): Promise<any>;
    static afterCreate(instance: any, wrapper: any, readyEvent: any): Promise<any>;
    static createForm(element: any, form: any, options?: {}): Promise<any>;
    static builder(element: any, form: any, options?: {}): Promise<any>;
    static Report: {
        create: (element: any, submission: any, options?: {}) => Promise<any>;
    };
}
export namespace Formio {
    export { Form };
    export { FormBuilder };
}
export class Form {
    constructor(element: any, form: any, options: any);
    form: any;
    element: any;
    options: any;
    instance: {
        proxy: boolean;
        ready: Promise<any> | Promise<void> | undefined;
        destroy: () => void;
    };
    init(): void;
    ready: Promise<any> | Promise<void> | undefined;
    create(): Promise<any>;
    setForm(form: any): void;
    setDisplay(display: any): Promise<any> | undefined;
}
export class FormBuilder extends Form {
}
