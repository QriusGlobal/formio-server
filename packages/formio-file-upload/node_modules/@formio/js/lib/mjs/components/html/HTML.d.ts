export default class HTMLComponent extends Component {
    static get builderInfo(): {
        title: string;
        group: string;
        icon: string;
        weight: number;
        documentation: string;
        showPreview: boolean;
        schema: any;
    };
    static savedValueTypes(): never[];
    get content(): any;
    get singleTags(): string[];
    checkRefreshOn(changed: any): void;
    renderContent(): any;
    render(): string;
    get dataReady(): any;
    attach(element: any): Promise<void>;
}
import Component from '../_classes/component/Component';
