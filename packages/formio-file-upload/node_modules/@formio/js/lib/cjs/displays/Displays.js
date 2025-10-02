"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const PDF_1 = __importDefault(require("../PDF"));
const Webform_1 = __importDefault(require("../Webform"));
const Wizard_1 = __importDefault(require("../Wizard"));
class Displays {
    static addDisplay(name, display) {
        Displays.displays[name] = display;
    }
    static addDisplays(displays) {
        Displays.displays = lodash_1.default.merge(Displays.displays, displays);
    }
    static getDisplay(name) {
        return Displays.displays[name];
    }
    static getDisplays() {
        return Displays.displays;
    }
}
Displays.displays = {
    pdf: PDF_1.default,
    webform: Webform_1.default,
    wizard: Wizard_1.default,
};
exports.default = Displays;
