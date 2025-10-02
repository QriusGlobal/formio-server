/**
 * @class Providers
 * @classdesc Represents a collection of providers.
 */
/**
 * Represents a collection of providers.
 */
export default class Providers {
    static providers: {
        address: {
            [x: string]: typeof import("./address/AzureAddressProvider").AzureAddressProvider | typeof import("./address/CustomAddressProvider").CustomAddressProvider | typeof import("./address/GoogleAddressProvider").GoogleAddressProvider | typeof import("./address/NominatimAddressProvider").NominatimAddressProvider;
        };
        auth: {};
        storage: {
            base64: typeof import("./storage/base64").default;
            s3: typeof import("./storage/s3").default;
            url: typeof import("./storage/url").default;
            azure: typeof import("./storage/azure").default;
            indexeddb: typeof import("./storage/indexeddb").default;
            googledrive: typeof import("./storage/googleDrive").default;
        };
    };
    /**
     * Adds a provider to the collection.
     * @param {string} type - The type of the provider.
     * @param {string} name - The name of the provider.
     * @param {Provider} provider - The provider object.
     */
    static addProvider(type: string, name: string, provider: Provider): void;
    /**
     * Adds multiple providers to the collection.
     * @param {string} type - The type of the providers.
     * @param {{ [key: string]: Provider }} providers - The collection of providers.
     */
    static addProviders(type: string, providers: {
        [key: string]: Provider;
    }): void;
    /**
     * Retrives a provider a provider from the collection.
     * @param {string} type - The type of the provider.
     * @param {string} name - The name of the provider.
     * @returns {Provider | void} The provider object.
     */
    static getProvider(type: string, name: string): Provider | void;
    /**
     * Retrives all providers of a given type.
     * @param {string} type - The type of the providers.
     * @returns {Provider[] | void} The collection of providers.
     */
    static getProviders(type: string): Provider[] | void;
}
