"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const PDFBuilder_1 = __importDefault(require("../PDFBuilder"));
const WebformBuilder_1 = __importDefault(require("../WebformBuilder"));
const WizardBuilder_1 = __importDefault(require("../WizardBuilder"));
class Builders {
    static addBuilder(name, builder) {
        Builders.builders[name] = builder;
    }
    static addBuilders(builders) {
        Builders.builders = lodash_1.default.merge(Builders.builders, builders);
    }
    static getBuilder(name) {
        return Builders.builders[name];
    }
    static getBuilders() {
        return Builders.builders;
    }
}
Builders.builders = {
    pdf: PDFBuilder_1.default,
    webform: WebformBuilder_1.default,
    wizard: WizardBuilder_1.default,
};
exports.default = Builders;
