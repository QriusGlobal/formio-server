export default class Builders {
    static builders: {
        pdf: typeof pdf;
        webform: typeof webform;
        wizard: typeof wizard;
    };
    static addBuilder(name: any, builder: any): void;
    static addBuilders(builders: any): void;
    static getBuilder(name: any): any;
    static getBuilders(): {
        pdf: typeof pdf;
        webform: typeof webform;
        wizard: typeof wizard;
    };
}
import pdf from '../PDFBuilder';
import webform from '../WebformBuilder';
import wizard from '../WizardBuilder';
