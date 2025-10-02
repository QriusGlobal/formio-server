export default class Alert {
    constructor(container: any, component: any);
    container: any;
    alert: any;
    parentComponent: any;
    refs: {};
    loadRefs: any;
    get refsNames(): {
        messageRef: string;
    };
    get alertTypes(): {
        error: string;
        success: string;
        info: string;
        warning: string;
    };
    showErrors(errors?: any[], triggerEvent?: boolean, options?: {}): any[];
    showMessage(message: any, type: any, options?: {}): void;
    createMessagesList(type: any, ...args: any[]): any;
    createErrorList(errors: any): any;
    showAlert(type: any, messagesList: any, options?: {}): void;
    setAlert(type: any, messagesList: any, options?: {}): void;
    attach(options: any): void;
    eventListenersKeys: any[] | undefined;
    clear(): void;
    focusOnComponent(keyOrPath: any): void;
    createMessage(type: any, element: any, message: any, index: any, err: any): void;
    createErrorMessage(element: any, message: any, index: any, err: any): void;
    appendErrorToList(err: any, ul: any): void;
}
