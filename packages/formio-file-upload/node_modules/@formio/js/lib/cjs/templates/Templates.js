"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const experimental_1 = require("@formio/core/experimental");
experimental_1.Template.addTemplates(index_1.default);
experimental_1.Template.defaultTemplates = experimental_1.Template.templates.bootstrap;
exports.default = experimental_1.Template;
