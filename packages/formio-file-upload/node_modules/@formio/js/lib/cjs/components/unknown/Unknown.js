"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("../_classes/component/Component"));
class UnknownComponent extends Component_1.default {
    static schema() {
        return {
            type: 'custom',
            key: 'custom',
            protected: false,
            persistent: true
        };
    }
    static get builderInfo() {
        return {
            title: 'Custom',
            icon: 'cubes',
            group: 'premium',
            documentation: '/userguide/form-building/premium-components#custom',
            weight: 120,
            schema: UnknownComponent.schema()
        };
    }
    get defaultSchema() {
        return UnknownComponent.schema();
    }
}
exports.default = UnknownComponent;
