"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Element_1 = __importDefault(require("../Element"));
const lodash_1 = __importDefault(require("lodash"));
class FormioAddon extends Element_1.default {
    static get info() {
        return {
            supportedComponents: [],
            name: 'formioAddon',
            components: [],
            label: 'Formio Addon',
            defaultSettings: {}
        };
    }
    get defaultSettings() {
        return FormioAddon.info.defaultSettings;
    }
    get element() {
        return this._element;
    }
    constructor(settings, componentInstance) {
        super(settings);
        this.namespace = 'formio.plugin';
        this.component = componentInstance || {};
        this.settings = lodash_1.default.merge({}, this.defaultSettings, settings || {});
    }
    attach(element) {
        this._element = element;
        return Promise.resolve();
    }
    destroy() { }
}
exports.default = FormioAddon;
