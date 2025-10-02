"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastCloneDeep = void 0;
/**
 * Performs a fast clone deep operation.
 *
 * @param obj
 */
function fastCloneDeep(obj) {
    try {
        return JSON.parse(JSON.stringify(obj));
    }
    catch (err) {
        console.log(`Clone Failed: ${err.message}`);
        return null;
    }
}
exports.fastCloneDeep = fastCloneDeep;
