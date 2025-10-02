export default class Displays {
    static displays: {
        pdf: typeof pdf;
        webform: typeof webform;
        wizard: typeof wizard;
    };
    static addDisplay(name: any, display: any): void;
    static addDisplays(displays: any): void;
    static getDisplay(name: any): any;
    static getDisplays(): {
        pdf: typeof pdf;
        webform: typeof webform;
        wizard: typeof wizard;
    };
}
import pdf from '../PDF';
import webform from '../Webform';
import wizard from '../Wizard';
