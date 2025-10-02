export default class ContentComponent extends Component {
    static get builderInfo(): {
        title: string;
        group: string;
        icon: string;
        preview: boolean;
        showPreview: boolean;
        documentation: string;
        weight: number;
        schema: any;
    };
    static savedValueTypes(): never[];
    get content(): any;
    render(): string;
    get dataReady(): any;
    attach(element: any): Promise<void>;
    get emptyValue(): string;
}
import Component from '../_classes/component/Component';
