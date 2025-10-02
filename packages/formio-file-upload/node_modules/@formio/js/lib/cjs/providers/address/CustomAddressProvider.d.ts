/**
 * CustomAddressProvider class extends the AddressProvider class and provides custom functionality for address handling.
 * @augments AddressProvider
 */
export class CustomAddressProvider extends AddressProvider {
    /**
     * Returns the response property of the custom address provider.
     * If not provided, falls back to the response property of the parent class.
     * @type {string}
     */
    get responseProperty(): string;
    /**
     * Returns the display value property of the custom address provider.
     * If not provided, falls back to the display value property of the parent class.
     * @type {string}
     */
    get displayValueProperty(): string;
    /**
     * Returns the request URL for the custom address provider.
     * @param {object} options - The options for the request.
     * @param {object} options.params - The parameters for the request.
     * @param {string} options.url - The URL for the request.
     * @returns {string} The request URL.
     */
    getRequestUrl(options?: {
        params: object;
        url: string;
    }): string;
}
import { AddressProvider } from './AddressProvider';
