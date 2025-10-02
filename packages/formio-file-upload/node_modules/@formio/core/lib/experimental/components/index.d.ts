import { HTMLComponent } from './html';
import { HTMLContainerComponent } from './htmlcontainer';
import { DataTableComponent } from './datatable';
import { DataValueComponent } from './datavalue';
import { InputComponent } from './input/input';
export { HTML, HTMLComponent } from './html';
export { HTMLContainer, HTMLContainerComponent } from './htmlcontainer';
export { DataTable, DataTableComponent } from './datatable';
export { DataValueComponent } from './datavalue';
export { Input, InputComponent } from './input/input';
declare const _default: {
    components: {
        html: typeof HTMLComponent;
        htmlcontainer: typeof HTMLContainerComponent;
        datatable: typeof DataTableComponent;
        datavalue: typeof DataValueComponent;
        input: typeof InputComponent;
    };
    templates: {
        bootstrap: typeof import("./templates/bootstrap");
    };
};
export default _default;
