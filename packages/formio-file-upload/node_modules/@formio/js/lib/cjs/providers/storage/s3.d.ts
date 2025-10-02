export default s3;
/**
 * S3 File Services provider for file storage.
 * @param {object} formio formio instance
 * @returns {import('./typedefs').FileProvider} The FileProvider interface defined in index.js.
 */
declare function s3(formio: object): any;
declare namespace s3 {
    let title: string;
}
