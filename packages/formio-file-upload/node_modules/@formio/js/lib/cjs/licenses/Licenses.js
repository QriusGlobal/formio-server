"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
class Licenses {
    static addLicense(name, license) {
        Licenses.licenses[name] = license;
    }
    static getLicense(name) {
        return Licenses.licenses[name];
    }
    static removeLicense(name) {
        lodash_1.default.unset(Licenses.licenses, name);
    }
    static getLicenses() {
        return Licenses.licenses;
    }
}
Licenses.licenses = {};
exports.default = Licenses;
