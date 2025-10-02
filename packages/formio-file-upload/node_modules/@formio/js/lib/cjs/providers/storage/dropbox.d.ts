export default dropbox;
/**
 * Dropbox provider for file storage.
 * @param {object} formio formio instance
 * @returns {import('./typedefs').FileProvider} The FileProvider interface defined in index.js.
 */
declare function dropbox(formio: object): any;
declare namespace dropbox {
    let title: string;
}
