"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InputWidget_1 = __importDefault(require("./InputWidget"));
const CalendarWidget_1 = __importDefault(require("./CalendarWidget"));
exports.default = {
    input: InputWidget_1.default,
    calendar: CalendarWidget_1.default
};
