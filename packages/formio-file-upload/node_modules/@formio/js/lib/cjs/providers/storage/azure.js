"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xhr_1 = __importDefault(require("./xhr"));
/**
 * Azure File Services provider for file storage.
 * @param {object} formio formio instance
 * @returns {import('./typedefs').FileProvider} The FileProvider interface defined in index.js.
 */
function azure(formio) {
    return {
        uploadFile(file, fileName, dir, progressCallback, url, options, fileKey, groupPermissions, groupId, abortCallback) {
            return xhr_1.default.upload(formio, 'azure', (xhr, response) => {
                xhr.openAndSetHeaders('PUT', response.url);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
                return file;
            }, file, fileName, dir, progressCallback, groupPermissions, groupId, abortCallback).then((response) => {
                return {
                    storage: 'azure',
                    name: xhr_1.default.path([dir, fileName]),
                    size: file.size,
                    type: file.type,
                    groupPermissions,
                    groupId,
                    key: response.key,
                };
            });
        },
        downloadFile(file) {
            return formio.makeRequest('file', `${formio.formUrl}/storage/azure?name=${xhr_1.default.trim(file.name)}`, 'GET');
        },
        deleteFile: function deleteFile(fileInfo) {
            var url = `${formio.formUrl}/storage/azure?name=${xhr_1.default.trim(fileInfo.name)}&key=${xhr_1.default.trim(fileInfo.key)}`;
            return formio.makeRequest('', url, 'delete');
        }
    };
}
azure.title = 'Azure File Services';
exports.default = azure;
