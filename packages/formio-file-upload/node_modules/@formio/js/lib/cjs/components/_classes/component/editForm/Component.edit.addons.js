"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addons_1 = require("../../../../addons");
const addons_2 = __importDefault(require("../../../../addons"));
exports.default = [
    {
        type: 'editgrid',
        addAnother: 'Add Addon',
        saveRow: 'Save Addon',
        weight: 28,
        input: true,
        key: 'addons',
        label: 'Addons',
        templates: {
            // eslint-disable-next-line quotes
            header: `<div class="row">
                <div class="col-6">{{ t(components[0].label) }}</div>
                <div class="col-4">Settings</div>
              </div>`,
            // eslint-disable-next-line quotes
            row: `<div class="row">
              <div class="col-6">
                {{ row.name.label }}
              </div>
              <div class="col-4 text-muted">
                Click Edit to see addon's settings
              </div>

              {% if (!instance.options.readOnly && !instance.disabled) { %}
                <div class="col-2">
                  <div class="btn-group pull-right">
                    <button class="btn btn-default btn-light btn-sm editRow"><i class="{{ iconClass('edit') }}"></i></button>
                    {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}
                      <button class="btn btn-danger btn-sm removeRow"><i class="{{ iconClass('trash') }}"></i></button>
                    {% } %}
                  </div>
                </div>
              {% } %}
            </div>`,
        },
        components: [
            {
                label: 'Name',
                tableView: true,
                key: 'name',
                type: 'select',
                dataSrc: 'custom',
                data: {
                    custom: function ({ instance }) {
                        var _a, _b;
                        const componentType = (_b = (_a = instance === null || instance === void 0 ? void 0 : instance.root) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.type;
                        const availableAddons = Object.keys(addons_2.default).filter((key) => {
                            var _a, _b, _c;
                            if ((_c = (_b = (_a = addons_2.default[key]) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.supportedComponents) === null || _c === void 0 ? void 0 : _c.includes(componentType)) {
                                return true;
                            }
                            return false;
                        });
                        return availableAddons.map((addonKey) => ({
                            value: addonKey,
                            label: addons_2.default[addonKey].info.label || addonKey,
                        }));
                    },
                },
                input: true,
                validate: {
                    required: true,
                },
            },
            ...addons_1.editForms,
        ]
    }
];
