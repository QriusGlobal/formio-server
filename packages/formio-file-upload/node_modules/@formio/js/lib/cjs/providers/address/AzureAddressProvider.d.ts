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
export class AzureAddressProvider extends AddressProvider {
    /**
     * Gets the default options for the address provider.
     * @returns {{ params: { 'api-version': string, typeahead: string } }} The default options.
     */
    get defaultOptions(): {
        params: {
            'api-version': string;
            typeahead: string;
        };
    };
    /**
     * Gets the response property for the address provider.
     * @type {string}
     */
    get responseProperty(): string;
    /**
     * Gets the display value property for the address provider.
     * @type {string}
     */
    get displayValueProperty(): string;
    /**
     * Gets the request URL for the address provider.
     * @param {{params: any}} options - The request options.
     * @returns {string} The request URL.
     */
    getRequestUrl(options?: {
        params: any;
    }): string;
}
export type AzureAddressProviderOptionsParams = {
    /**
     * 'api-version' - The version of the Azure Maps API.
     */
    "": string;
    /**
     * - Whether to enable typeahead in the search.
     */
    typeahead: string;
};
export type AzureAddressProviderOptions = {
    /**
     * - The parameters for the Azure Maps API request.
     */
    params: AzureAddressProviderOptionsParams;
};
import { AddressProvider } from './AddressProvider';
