"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setXhrHeaders = void 0;
const trim_1 = __importDefault(require("lodash/trim"));
const setXhrHeaders = (formio, xhr) => {
    const { headers } = formio.options;
    if (headers) {
        const ValidHeaders = {
            'Content-Disposition': true,
            'Authorization': true,
        };
        for (const header in headers) {
            if (ValidHeaders[header]) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }
    }
};
exports.setXhrHeaders = setXhrHeaders;
const XHR = {
    trim(text) {
        return (0, trim_1.default)(text, '/');
    },
    path(items) {
        return items.filter(item => !!item).map(XHR.trim).join('/');
    },
    upload(formio, type, xhrCallback, file, fileName, dir, progressCallback, groupPermissions, groupId, abortCallback, multipartOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            // make request to Form.io server
            const token = formio.getToken();
            let response;
            try {
                response = yield fetch(`${formio.formUrl}/storage/${type}`, {
                    method: 'POST',
                    headers: Object.assign({ 'Accept': 'application/json', 'Content-Type': 'application/json; charset=UTF-8' }, (token ? { 'x-jwt-token': token } : {})),
                    body: JSON.stringify({
                        name: XHR.path([dir, fileName]),
                        size: file.size,
                        type: file.type,
                        groupPermissions,
                        groupId,
                        multipart: multipartOptions
                    })
                });
            }
            catch (err) {
                // only throws on network errors
                err.networkError = true;
                throw err;
            }
            if (!response.ok) {
                if (response.status === 504) {
                    const error = new Error('Network request failed');
                    error.networkError = true;
                    throw error;
                }
                const message = yield response.text();
                throw new Error(message || 'Unable to sign file.');
            }
            const serverResponse = yield response.json();
            return yield XHR.makeXhrRequest(formio, xhrCallback, serverResponse, progressCallback, abortCallback);
        });
    },
    makeXhrRequest(formio, xhrCallback, serverResponse, progressCallback, abortCallback) {
        return new Promise((resolve, reject) => {
            // Send the file with data.
            const xhr = new XMLHttpRequest();
            xhr.openAndSetHeaders = (...params) => {
                xhr.open(...params);
                (0, exports.setXhrHeaders)(formio, xhr);
            };
            Promise.resolve(xhrCallback(xhr, serverResponse, abortCallback)).then((payload) => {
                // if payload is nullish we can assume the provider took care of the entire upload process
                if (!payload) {
                    return resolve(serverResponse);
                }
                // Fire on network error.
                xhr.onerror = (err) => {
                    err.networkError = true;
                    reject(err);
                };
                // Fire on network abort.
                xhr.onabort = (err) => {
                    err.networkError = true;
                    reject(err);
                };
                // Set the onabort error callback.
                xhr.onabort = reject;
                if (typeof progressCallback === 'function') {
                    xhr.upload.onprogress = progressCallback;
                }
                if (typeof abortCallback === 'function') {
                    abortCallback(() => xhr.abort());
                }
                // Fired when the response has made it back from the server.
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(serverResponse);
                    }
                    else if (xhr.status === 504) {
                        const error = new Error('Network request failed');
                        error.networkError = true;
                        reject(error);
                    }
                    else {
                        reject(xhr.response || 'Unable to upload file');
                    }
                };
                // Get the request and send it to the server.
                xhr.send(payload);
            }).catch(reject);
        });
    }
};
exports.default = XHR;
