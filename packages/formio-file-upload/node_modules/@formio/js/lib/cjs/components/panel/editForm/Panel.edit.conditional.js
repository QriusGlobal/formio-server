"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("../../_classes/component/editForm/utils"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const omit_1 = __importDefault(require("lodash/omit"));
const difference_1 = __importDefault(require("lodash/difference"));
const keys_1 = __importDefault(require("lodash/keys"));
/* eslint-disable quotes, max-len */
const title = 'Advanced Next Page';
const jsonProp = 'nextPage';
const jsProp = 'nextPage';
const jsDocHTML = (`
  <p>You must assign the <strong>next</strong> variable with the API key of the next page.</p>
  <p>The global variable <strong>data</strong> is provided, and allows you to access the data of any form component, by using its API key.</p>
  <p>Also <strong>moment</strong> library is available, and allows you to manipulate dates in a convenient way.</p>
  <h5>Example</h5><pre>next = data.addComment ? 'page3' : 'page4';</pre>
`);
const jsonDocHTML = (`
  <p>Submission data is available as JsonLogic variables, with the same api key as your components.</p>
`);
const settingComponent = utils_1.default.javaScriptValue(title, jsProp, jsonProp, 110, jsDocHTML, jsonDocHTML);
exports.default = [
    Object.assign(Object.assign({}, settingComponent), { customConditional(context) {
            let isWizardPanel = false;
            if (context.instance.options.editForm.display === 'wizard') {
                const { components } = context.instance.options.editForm;
                const component = context.instance.options.editComponent;
                if (components && component) {
                    isWizardPanel = components.some((comp) => {
                        const diff = (0, difference_1.default)((0, keys_1.default)(comp), (0, keys_1.default)(component)) || [];
                        diff.push('components');
                        return (0, isEqual_1.default)((0, omit_1.default)(comp, diff), (0, omit_1.default)(component, diff));
                    });
                }
            }
            return isWizardPanel;
        } })
];
/* eslint-enable quotes, max-len */
