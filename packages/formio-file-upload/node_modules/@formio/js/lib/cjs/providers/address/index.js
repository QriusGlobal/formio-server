"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AzureAddressProvider_1 = require("./AzureAddressProvider");
const CustomAddressProvider_1 = require("./CustomAddressProvider");
const GoogleAddressProvider_1 = require("./GoogleAddressProvider");
const NominatimAddressProvider_1 = require("./NominatimAddressProvider");
exports.default = {
    [AzureAddressProvider_1.AzureAddressProvider.name]: AzureAddressProvider_1.AzureAddressProvider,
    [CustomAddressProvider_1.CustomAddressProvider.name]: CustomAddressProvider_1.CustomAddressProvider,
    [GoogleAddressProvider_1.GoogleAddressProvider.name]: GoogleAddressProvider_1.GoogleAddressProvider,
    [NominatimAddressProvider_1.NominatimAddressProvider.name]: NominatimAddressProvider_1.NominatimAddressProvider,
};
