export default fileProcessor;
/**
 * Creates a file processor function.
 * @param {Formio} formio - The Formio instance.
 * @param {object} config - The configuration object.
 * @returns {function(File, object): Promise<FormData>} A function that takes a file and options, and returns a Promise that resolves with the processed file.
 */
declare function fileProcessor(formio: Formio, config: object): (arg0: File, arg1: object) => Promise<FormData>;
