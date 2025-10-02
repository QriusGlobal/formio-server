/**
 * @typedef {object} NominatimAddressProviderOptionsParams
 * @property {{ addressdetails: string, format: string } } params - The parameters for the Nominatim API request.
 */
/**
 * Represents an Nominatim address provider.
 * {extends AddressProvider}
 */
export class NominatimAddressProvider extends AddressProvider {
    /**
     * Gets the default options for the address provider.
     * @returns {NominatimAddressProviderOptionsParams}  The default options.
     */
    get defaultOptions(): NominatimAddressProviderOptionsParams;
    /**
     * Gets the display value property for the address provider.
     * @returns {string} The property to use for display value.
     */
    get displayValueProperty(): string;
    /**
     * Generates the request URL for the address provider with options.
     * @param {NominatimAddressProviderOptionsParams} options - The request options.
     * @returns {string} The formatted Url.
     */
    getRequestUrl(options?: NominatimAddressProviderOptionsParams): string;
}
export type NominatimAddressProviderOptionsParams = {
    /**
     * - The parameters for the Nominatim API request.
     */
    params: {
        addressdetails: string;
        format: string;
    };
};
import { AddressProvider } from './AddressProvider';
