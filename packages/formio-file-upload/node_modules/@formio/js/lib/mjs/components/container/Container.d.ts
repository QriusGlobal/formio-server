export default class ContainerComponent extends NestedDataComponent {
    static get builderInfo(): {
        title: string;
        icon: string;
        group: string;
        documentation: string;
        showPreview: boolean;
        weight: number;
        schema: any;
    };
    constructor(...args: any[]);
    addComponents(data: any, options: any): void;
    checkData(data: any, flags: any, row: any, components: any): void;
    focus(): void;
}
import NestedDataComponent from '../_classes/nesteddata/NestedDataComponent';
