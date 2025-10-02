"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const address_1 = __importDefault(require("./address"));
const auth_1 = __importDefault(require("./auth"));
const storage_1 = __importDefault(require("./storage"));
/**
 * @class Providers
 * @classdesc Represents a collection of providers.
 */
/**
 * Represents a collection of providers.
 */
class Providers {
    /**
     * Adds a provider to the collection.
     * @param {string} type - The type of the provider.
     * @param {string} name - The name of the provider.
     * @param {Provider} provider - The provider object.
     */
    static addProvider(type, name, provider) {
        Providers.providers[type] = Providers.providers[type] || {};
        Providers.providers[type][name] = provider;
    }
    /**
     * Adds multiple providers to the collection.
     * @param {string} type - The type of the providers.
     * @param {{ [key: string]: Provider }} providers - The collection of providers.
     */
    static addProviders(type, providers) {
        Providers.providers[type] = lodash_1.default.merge(Providers.providers[type], providers);
    }
    /**
     * Retrives a provider a provider from the collection.
     * @param {string} type - The type of the provider.
     * @param {string} name - The name of the provider.
     * @returns {Provider | void} The provider object.
     */
    static getProvider(type, name) {
        if (Providers.providers[type] && Providers.providers[type][name]) {
            return Providers.providers[type][name];
        }
    }
    /**
     * Retrives all providers of a given type.
     * @param {string} type - The type of the providers.
     * @returns {Provider[] | void} The collection of providers.
     */
    static getProviders(type) {
        if (Providers.providers[type]) {
            return Providers.providers[type];
        }
    }
}
Providers.providers = {
    address: address_1.default,
    auth: auth_1.default,
    storage: storage_1.default,
};
exports.default = Providers;
