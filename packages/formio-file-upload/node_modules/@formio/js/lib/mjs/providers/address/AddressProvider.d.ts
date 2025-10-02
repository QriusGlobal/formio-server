/**
 * @typedef {object} RequestOptions
 * @property {object} params - The request parameters.
 * @property {boolean} noToken - Whether to include a token in the request.
 */
/**
 * @typedef {object} Address
 * @property {string} street - The street address.
 * @property {string} city - The city.
 * @property {string} state - The state.
 * @property {string} country - The country.
 * @property {string} postalCode - The postal code.
 */
/**
 * @class AddressProvider
 * @classdesc Represents an address provider.
 */
export class AddressProvider {
    /**
     * @static
     * @type {string}
     * @description The name of the address provider.
     */
    static get name(): string;
    /**
     * @static
     * @type {string}
     * @description The display name of the address provider.
     */
    static get displayName(): string;
    /**
     * @class
     * @param {object} options - The options for the address provider.
     */
    constructor(options?: object);
    options: any;
    /**
     * @private
     * @description Executes before merging the options.
     */
    private beforeMergeOptions;
    /**
     * @private
     * @type {object}
     * @description The default options for the address provider.
     */
    private get defaultOptions();
    /**
     * @private
     * @type {string}
     * @description The query property name.
     */
    private get queryProperty();
    /**
     * @private
     * @type {string|null}
     * @description The response property name.
     */
    private get responseProperty();
    /**
     * @private
     * @type {string|null}
     * @description The display value property name.
     */
    private get displayValueProperty();
    /**
     * @private
     * @param {object} params - The parameters to serialize.
     * @returns {string} The serialized parameters.
     */
    private serialize;
    /**
     * @private
     * @param {object} options - The request options.
     * @returns {RequestOptions} The merged request options.
     */
    private getRequestOptions;
    /**
     * @private
     * @param {object} _options - The request options.
     * @throws {Error} Throws an error if the method is not implemented.
     */
    private getRequestUrl;
    /**
     * @private
     * @param {object} options - The request options.
     * @returns {Promise} A promise that resolves with the request result.
     */
    private makeRequest;
    /**
     * @public
     * @description The search parameters for the request.
     * @param {string} query - The search query.
     * @param {object} options - The search options.
     * @returns {Promise<Address[]>} A promise that resolves with the search results.
     */
    public search(query: string, options?: object): Promise<Address[]>;
    /**
     * @public
     * @param {Address} address - The address object.
     * @returns {string} The display value of the address.
     */
    public getDisplayValue(address: Address): string;
}
export type RequestOptions = {
    /**
     * - The request parameters.
     */
    params: object;
    /**
     * - Whether to include a token in the request.
     */
    noToken: boolean;
};
export type Address = {
    /**
     * - The street address.
     */
    street: string;
    /**
     * - The city.
     */
    city: string;
    /**
     * - The state.
     */
    state: string;
    /**
     * - The country.
     */
    country: string;
    /**
     * - The postal code.
     */
    postalCode: string;
};
