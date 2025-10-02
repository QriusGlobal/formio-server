export default class CurrencyComponent extends NumberComponent {
    constructor(component: any, options: any, data: any);
    currencyPrefix: any;
    currencySuffix: any;
    parseNumber(value: any): number;
    parseValue(value: any): string | null;
    addZerosAndFormatValue(value: any): any;
    stripPrefixSuffix(value: any): any;
}
import NumberComponent from '../number/Number';
