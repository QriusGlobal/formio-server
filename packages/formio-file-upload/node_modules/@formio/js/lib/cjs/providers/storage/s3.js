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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const xhr_1 = __importDefault(require("./xhr"));
const util_1 = require("./util");
const loadAbortControllerPolyfill = () => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof AbortController === 'undefined') {
        yield Promise.resolve().then(() => __importStar(require('abortcontroller-polyfill/dist/polyfill-patch-fetch')));
    }
});
/**
 * S3 File Services provider for file storage.
 * @param {object} formio formio instance
 * @returns {import('./typedefs').FileProvider} The FileProvider interface defined in index.js.
 */
function s3(formio) {
    return {
        uploadFile(file, fileName, dir, progressCallback, url, options, fileKey, groupPermissions, groupId, abortCallback, multipartOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const xhrCallback = (xhr, response, abortCallback) => __awaiter(this, void 0, void 0, function* () {
                    response.data.fileName = fileName;
                    response.data.key = xhr_1.default.path([response.data.key, dir, fileName]);
                    if (response.signed) {
                        if (multipartOptions && Array.isArray(response.signed)) {
                            // patch abort callback
                            yield loadAbortControllerPolyfill();
                            const abortController = new AbortController();
                            const abortSignal = abortController.signal;
                            if (typeof abortCallback === 'function') {
                                abortCallback(() => abortController.abort());
                            }
                            try {
                                const parts = yield this.uploadParts(file, response.signed, response.data.headers, response.partSizeActual, multipartOptions, abortSignal);
                                yield (0, util_1.withRetries)(this.completeMultipartUpload, [response, parts, multipartOptions], 3);
                                return;
                            }
                            catch (err) {
                                // abort in-progress fetch requests
                                abortController.abort();
                                // attempt to cancel the multipart upload
                                this.abortMultipartUpload(response);
                                throw err;
                            }
                        }
                        else {
                            xhr.openAndSetHeaders('PUT', response.signed);
                            xhr.setRequestHeader('Content-Type', file.type);
                            if (response.data.headers) {
                                Object.keys(response.data.headers).forEach((key) => {
                                    xhr.setRequestHeader(key, response.data.headers[key]);
                                });
                            }
                            return file;
                        }
                    }
                    else {
                        const fd = new FormData();
                        for (const key in response.data) {
                            fd.append(key, response.data[key]);
                        }
                        fd.append('file', file);
                        xhr.openAndSetHeaders('POST', response.url);
                        return fd;
                    }
                });
                const response = yield xhr_1.default.upload(formio, 's3', xhrCallback, file, fileName, dir, progressCallback, groupPermissions, groupId, abortCallback, multipartOptions);
                return {
                    storage: 's3',
                    name: fileName,
                    bucket: response.bucket,
                    key: response.data.key,
                    url: xhr_1.default.path([response.url, response.data.key]),
                    acl: response.data.acl,
                    size: file.size,
                    type: file.type
                };
            });
        },
        completeMultipartUpload(serverResponse, parts, multipart) {
            return __awaiter(this, void 0, void 0, function* () {
                const { changeMessage } = multipart;
                changeMessage('Completing AWS S3 multipart upload...');
                const token = formio.getToken();
                const response = yield fetch(`${formio.formUrl}/storage/s3/multipart/complete`, {
                    method: 'POST',
                    headers: Object.assign({ 'Content-Type': 'application/json' }, (token ? { 'x-jwt-token': token } : {})),
                    body: JSON.stringify({ parts, uploadId: serverResponse.uploadId, key: serverResponse.key })
                });
                const message = yield response.text();
                if (!response.ok) {
                    throw new Error(message);
                }
                // the AWS S3 SDK CompleteMultipartUpload command can return a HTTP 200 status header but still error;
                // we need to parse, and according to AWS, to retry
                if (message.match(/Error/)) {
                    throw new Error(message);
                }
            });
        },
        abortMultipartUpload(serverResponse) {
            const { uploadId, key } = serverResponse;
            const token = formio.getToken();
            fetch(`${formio.formUrl}/storage/s3/multipart/abort`, {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/json' }, (token ? { 'x-jwt-token': token } : {})),
                body: JSON.stringify({ uploadId, key })
            }).catch((err) => console.error('Error while aborting multipart upload:', err));
        },
        uploadParts(file, urls, headers, partSize, multipart, abortSignal) {
            const { changeMessage, progressCallback } = multipart;
            changeMessage('Chunking and uploading parts to AWS S3...');
            const promises = [];
            for (let i = 0; i < urls.length; i++) {
                const start = i * partSize;
                const end = (i + 1) * partSize;
                const blob = i < urls.length ? file.slice(start, end) : file.slice(start);
                const promise = fetch(urls[i], {
                    method: 'PUT',
                    headers,
                    body: blob,
                    signal: abortSignal,
                }).then((res) => {
                    if (res.ok) {
                        progressCallback(urls.length);
                        const eTag = res.headers.get('etag');
                        if (!eTag) {
                            throw new Error('ETag header not found; it must be exposed in S3 bucket CORS settings');
                        }
                        return { ETag: eTag, PartNumber: i + 1 };
                    }
                    else {
                        throw new Error(`Part no ${i} failed with status ${res.status}`);
                    }
                });
                promises.push(promise);
            }
            return Promise.all(promises);
        },
        downloadFile(file) {
            if (file.acl !== 'public-read') {
                return formio.makeRequest('file', `${formio.formUrl}/storage/s3?bucket=${xhr_1.default.trim(file.bucket)}&key=${xhr_1.default.trim(file.key)}`, 'GET');
            }
            else {
                return Promise.resolve(file);
            }
        },
        deleteFile(fileInfo) {
            const url = `${formio.formUrl}/storage/s3?bucket=${xhr_1.default.trim(fileInfo.bucket)}&key=${xhr_1.default.trim(fileInfo.key)}`;
            return formio.makeRequest('', url, 'delete');
        },
    };
}
s3.title = 'S3';
exports.default = s3;
