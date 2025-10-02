export default indexeddb;
/**
 * indexedDb provider for file storage.
 * @returns {import('./typedefs').FileProvider} The FileProvider interface defined in index.js.
 */
declare function indexeddb(): any;
declare namespace indexeddb {
    let title: string;
}
