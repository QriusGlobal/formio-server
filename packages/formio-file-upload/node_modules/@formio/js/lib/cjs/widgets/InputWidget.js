"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Element_1 = __importDefault(require("../Element"));
class InputWidget extends Element_1.default {
    static get defaultSettings() {
        return {
            type: 'input'
        };
    }
    constructor(settings, component, instance, index) {
        super(settings);
        this.valueIndex = index || 0;
        this.componentInstance = instance;
        this.namespace = 'formio.widget';
        this.component = component || {};
        this.settings = lodash_1.default.merge({}, this.defaultSettings, settings || {});
    }
    attach(input) {
        this._input = input;
        return Promise.resolve();
    }
    get defaultSettings() {
        return {};
    }
    set disabled(disabled) {
        if (disabled) {
            this._input.setAttribute('disabled', 'disabled');
        }
        else {
            this._input.removeAttribute('disabled');
        }
    }
    get input() {
        return this._input;
    }
    getValue() {
        return this._input.value;
    }
    getValueAsString(value) {
        return value;
    }
    get validationValue() {
        return this.dataValue;
    }
    addPrefix() {
        return null;
    }
    addSuffix() {
        return null;
    }
    setValue(value) {
        this._input.value = value;
    }
    evalContext(additional) {
        return super.evalContext(Object.assign({
            component: this.component,
            row: this.componentInstance.data,
            rowIndex: this.componentInstance.rowIndex,
            data: this.componentInstance.rootValue,
            value: this.componentInstance.dataValue,
            t: this.t.bind(this),
            submission: (this.componentInstance.root ? this.componentInstance.root._submission : {
                data: this.componentInstance.rootValue
            }),
            form: this.componentInstance.root ? this.componentInstance.root._form : {},
            options: this.options,
        }, additional));
    }
}
exports.default = InputWidget;
