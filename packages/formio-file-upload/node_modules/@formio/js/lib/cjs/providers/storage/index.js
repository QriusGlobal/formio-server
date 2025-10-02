"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base64_1 = __importDefault(require("./base64"));
const s3_1 = __importDefault(require("./s3"));
const azure_1 = __importDefault(require("./azure"));
const url_1 = __importDefault(require("./url"));
const indexeddb_1 = __importDefault(require("./indexeddb"));
const googleDrive_1 = __importDefault(require("./googleDrive"));
exports.default = {
    base64: base64_1.default,
    s3: s3_1.default,
    url: url_1.default,
    azure: azure_1.default,
    indexeddb: indexeddb_1.default,
    googledrive: googleDrive_1.default
};
