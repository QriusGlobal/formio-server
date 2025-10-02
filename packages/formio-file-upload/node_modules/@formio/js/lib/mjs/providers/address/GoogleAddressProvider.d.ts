/**
 * @typedef {object} AutocompleteOptions
 * @property {string[]} fields - The fields to include in the autocomplete response.
 * @property {object} componentRestrictions - The component restrictions for the autocomplete response.
 * @property {string[]} componentRestrictions.country - The country codes to restrict the autocomplete response to.
 */
/**
 * @typedef {object} ProviderOptions
 * @property {string} region - The region to restrict the autocomplete response to.
 * @property {string} key - The API key for Google Maps.
 * @property {AutocompleteOptions} autocompleteOptions - The options for the autocomplete functionality.
 */
/**
 * @typedef {object} Place
 * @property {object} address_components - The address components of the place.
 * @property {string} formatted_address - The formatted address of the place.
 * @property {object} geometry - The geometry information of the place.
 * @property {string} place_id - The place ID of the place.
 * @property {object} plus_code - The plus code of the place.
 * @property {string[]} types - The types of the place.
 * @property {string} formattedPlace - The formatted place value.
 */
/**
 * @class GoogleAddressProvider
 * @augments AddressProvider
 */
export class GoogleAddressProvider extends AddressProvider {
    /**
     
     * @param {ProviderOptions} options - The options for the provider.
     */
    constructor(options?: ProviderOptions);
    /**
     * get display value property
     * @returns {string} The property to use for display value.
     */
    get displayValueProperty(): string;
    /**
     * @returns {string} The alternative property to use for display value.
     */
    get alternativeDisplayValueProperty(): string;
    /**
     * @param {AutocompleteOptions} options - The autocomplete options.
     */
    set autocompleteOptions(options: AutocompleteOptions);
    /**
     * @returns {AutocompleteOptions} The autocomplete options.
     */
    get autocompleteOptions(): AutocompleteOptions;
    _autocompleteOptions: AutocompleteOptions | undefined;
    /**
     * Sets the autocomplete options based on the provider options.
     
     */
    setAutocompleteOptions(): void;
    /**
     
     * Converts the region to autocomplete option if it exists.
     * @param {ProviderOptions} options - The provider options.
     */
    beforeMergeOptions(options: ProviderOptions): void;
    /**
     * @returns {string} The name of the library.
     */
    getLibraryName(): string;
    /**
     * Converts the region to autocomplete option.
     * @param {ProviderOptions} options - The provider options.
     */
    convertRegionToAutocompleteOption(options: ProviderOptions): void;
    /**
     * @returns {string[]} The required address properties.
     */
    getRequiredAddressProperties(): string[];
    /**
     * Adds the required provider options to the options.
     * @param {AutocompleteOptions} options - The autocomplete options.
     */
    addRequiredProviderOptions(options: AutocompleteOptions): void;
    filterPlace(place: any): {};
    attachAutocomplete(elem: any, index: any, onSelectAddress: any): void;
    search(): Promise<void>;
    makeRequest(): Promise<void>;
    getDisplayValue(address: any): any;
    /**
     * Tries to remove the library if api key for loaded script is different.
     * @param {ProviderOptions} options - The options for the provider.
     */
    tryRemoveLibrary(options?: ProviderOptions): void;
}
export type AutocompleteOptions = {
    /**
     * - The fields to include in the autocomplete response.
     */
    fields: string[];
    /**
     * - The component restrictions for the autocomplete response.
     */
    componentRestrictions: {
        country: string[];
    };
};
export type ProviderOptions = {
    /**
     * - The region to restrict the autocomplete response to.
     */
    region: string;
    /**
     * - The API key for Google Maps.
     */
    key: string;
    /**
     * - The options for the autocomplete functionality.
     */
    autocompleteOptions: AutocompleteOptions;
};
export type Place = {
    /**
     * - The address components of the place.
     */
    address_components: object;
    /**
     * - The formatted address of the place.
     */
    formatted_address: string;
    /**
     * - The geometry information of the place.
     */
    geometry: object;
    /**
     * - The place ID of the place.
     */
    place_id: string;
    /**
     * - The plus code of the place.
     */
    plus_code: object;
    /**
     * - The types of the place.
     */
    types: string[];
    /**
     * - The formatted place value.
     */
    formattedPlace: string;
};
import { AddressProvider } from './AddressProvider';
