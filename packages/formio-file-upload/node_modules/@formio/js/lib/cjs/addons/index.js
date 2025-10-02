"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editForms = void 0;
const PasswordStrengthAddon_1 = __importDefault(require("./PasswordStrength/PasswordStrengthAddon"));
exports.editForms = [
    PasswordStrengthAddon_1.default.info
].map(({ components, name, defaultSettings }) => ({
    type: 'form',
    key: 'settings',
    display: 'form',
    input: true,
    components: components.map((comp) => {
        comp.tableView = false;
        return comp;
    }),
    tableView: false,
    defaultValue: {
        data: defaultSettings
    },
    customConditional({ row }) {
        return row.name.value === name;
    }
}));
exports.default = {
    passwordStrength: PasswordStrengthAddon_1.default,
};
