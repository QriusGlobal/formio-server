"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formio = exports.Builders = exports.FormBuilder = void 0;
const FormBuilder_1 = __importDefault(require("./FormBuilder"));
exports.FormBuilder = FormBuilder_1.default;
const Builders_1 = __importDefault(require("./builders/Builders"));
exports.Builders = Builders_1.default;
const formio_form_1 = require("./formio.form");
Object.defineProperty(exports, "Formio", { enumerable: true, get: function () { return formio_form_1.Formio; } });
formio_form_1.Formio.Builders = Builders_1.default;
formio_form_1.Formio.isBuilder = true;
formio_form_1.Formio.use = (0, formio_form_1.useModule)((key, mod) => {
    if (key === 'builders') {
        formio_form_1.Formio.Builders.addBuilders(mod.builders);
        return true;
    }
    return false;
});
__exportStar(require("./formio.form"), exports);
