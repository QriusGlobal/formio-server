"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureAddressProvider = void 0;
const AddressProvider_1 = require("./AddressProvider");
/**
 * @typedef {object} AzureAddressProviderOptionsParams
 * @property {string} 'api-version' - The version of the Azure Maps API.
 * @property {string} typeahead - Whether to enable typeahead in the search.
 * @typedef {object} AzureAddressProviderOptions
 * @property {AzureAddressProviderOptionsParams} params - The parameters for the Azure Maps API request.
 */
/**
 * @class
 * @augments AddressProvider
 * @classdesc Represents an Azure Maps address provider.
 */
class AzureAddressProvider extends AddressProvider_1.AddressProvider {
    /**
     * Gets the name of the address provider.
     * @type {string}
     */
    static get name() {
        return 'azure';
    }
    /**
     * Gets the display name of the address provider.
     * @type {string}
     */
    static get displayName() {
        return 'Azure Maps';
    }
    /**
     * Gets the default options for the address provider.
     * @returns {{ params: { 'api-version': string, typeahead: string } }} The default options.
     */
    get defaultOptions() {
        return {
            params: {
                'api-version': '1.0',
                typeahead: 'true',
            },
        };
    }
    /**
     * Gets the response property for the address provider.
     * @type {string}
     */
    get responseProperty() {
        return 'results';
    }
    /**
     * Gets the display value property for the address provider.
     * @type {string}
     */
    get displayValueProperty() {
        return 'address.freeformAddress';
    }
    /**
     * Gets the request URL for the address provider.
     * @param {{params: any}} options - The request options.
     * @returns {string} The request URL.
     */
    getRequestUrl(options = {}) {
        const { params } = options;
        return `https://atlas.microsoft.com/search/address/json?${this.serialize(params)}`;
    }
}
exports.AzureAddressProvider = AzureAddressProvider;
