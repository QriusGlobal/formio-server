export default class FormBuilder extends Form {
    /**
     * @typedef FormBuilderOptions
     * @property {string[]} [disabled] - An array of "keys" of components that should be disabled within the form builder. Example: ['firstName', 'lastName']
     * @property {boolean} [noNewEdit] - When set to TRUE no modal is shown when a component is dragged onto the form.
     * @property {boolean} [noDefaultSubmitButton] - Set to TRUE to not include the default submit button in Webforms.
     * @property {boolean} [alwaysConfirmComponentRemoval] - Set to TRUE to always require confirmation before removing a component.
     * @property {object} [formConfig] - Form configurations to apply to forms being created. These configurations are added to the "config" property of the form object.
     * @property {string} [resourceTag] - The tag to use to query for the "Existing Resource Fields" section of the builder.
     * @property {import('./Form').FormOptions} [editForm] - The options to apply to the Edit Form (the form that shows inside the modal when you edit a component).
     * @property {string} [language] - The language to load into the form builder.
     * @property {object} [builder] - The builder options to pass to the builder.
     * @property {'form'|'wizard'|'pdf'} [display] - The display mode of the builder.
     * @property {string} [resourceFilter] - Filter applied to the resources that appear in the builder's Existing Resource Fields.
     * @property {boolean} [noSource] - When set to TRUE, the resource ID in the builder's Existing Resource Fields will not be linked.
     * @property {boolean} [showFullJsonSchema] - When set to TRUE, the full JSON schema will be displayed in the JSON edit menu.
     */
    /** @type {FormBuilderOptions} */
    static options: {
        /**
         * - An array of "keys" of components that should be disabled within the form builder. Example: ['firstName', 'lastName']
         */
        disabled?: string[] | undefined;
        /**
         * - When set to TRUE no modal is shown when a component is dragged onto the form.
         */
        noNewEdit?: boolean | undefined;
        /**
         * - Set to TRUE to not include the default submit button in Webforms.
         */
        noDefaultSubmitButton?: boolean | undefined;
        /**
         * - Set to TRUE to always require confirmation before removing a component.
         */
        alwaysConfirmComponentRemoval?: boolean | undefined;
        /**
         * - Form configurations to apply to forms being created. These configurations are added to the "config" property of the form object.
         */
        formConfig?: object | undefined;
        /**
         * - The tag to use to query for the "Existing Resource Fields" section of the builder.
         */
        resourceTag?: string | undefined;
        /**
         * - The options to apply to the Edit Form (the form that shows inside the modal when you edit a component).
         */
        editForm?: any;
        /**
         * - The language to load into the form builder.
         */
        language?: string | undefined;
        /**
         * - The builder options to pass to the builder.
         */
        builder?: object | undefined;
        /**
         * - The display mode of the builder.
         */
        display?: "form" | "pdf" | "wizard" | undefined;
        /**
         * - Filter applied to the resources that appear in the builder's Existing Resource Fields.
         */
        resourceFilter?: string | undefined;
        /**
         * - When set to TRUE, the resource ID in the builder's Existing Resource Fields will not be linked.
         */
        noSource?: boolean | undefined;
        /**
         * - When set to TRUE, the full JSON schema will be displayed in the JSON edit menu.
         */
        showFullJsonSchema?: boolean | undefined;
    };
    /**
     * Creates a new form builder.
     * @param {HTMLElement} element - The HTML element to place the form builder.
     * @param {string | object} form - The form to pass to the builder
     * @param {FormBuilderOptions} options - The options to create this builder.
     * @returns {FormBuilder} - The form builder instance.
     */
    constructor(element: HTMLElement, form: string | object, options: {
        /**
         * - An array of "keys" of components that should be disabled within the form builder. Example: ['firstName', 'lastName']
         */
        disabled?: string[] | undefined;
        /**
         * - When set to TRUE no modal is shown when a component is dragged onto the form.
         */
        noNewEdit?: boolean | undefined;
        /**
         * - Set to TRUE to not include the default submit button in Webforms.
         */
        noDefaultSubmitButton?: boolean | undefined;
        /**
         * - Set to TRUE to always require confirmation before removing a component.
         */
        alwaysConfirmComponentRemoval?: boolean | undefined;
        /**
         * - Form configurations to apply to forms being created. These configurations are added to the "config" property of the form object.
         */
        formConfig?: object | undefined;
        /**
         * - The tag to use to query for the "Existing Resource Fields" section of the builder.
         */
        resourceTag?: string | undefined;
        /**
         * - The options to apply to the Edit Form (the form that shows inside the modal when you edit a component).
         */
        editForm?: any;
        /**
         * - The language to load into the form builder.
         */
        language?: string | undefined;
        /**
         * - The builder options to pass to the builder.
         */
        builder?: object | undefined;
        /**
         * - The display mode of the builder.
         */
        display?: "form" | "pdf" | "wizard" | undefined;
        /**
         * - Filter applied to the resources that appear in the builder's Existing Resource Fields.
         */
        resourceFilter?: string | undefined;
        /**
         * - When set to TRUE, the resource ID in the builder's Existing Resource Fields will not be linked.
         */
        noSource?: boolean | undefined;
        /**
         * - When set to TRUE, the full JSON schema will be displayed in the JSON edit menu.
         */
        showFullJsonSchema?: boolean | undefined;
    });
    /** @type {FormBuilderOptions} */
    options: {
        /**
         * - An array of "keys" of components that should be disabled within the form builder. Example: ['firstName', 'lastName']
         */
        disabled?: string[] | undefined;
        /**
         * - When set to TRUE no modal is shown when a component is dragged onto the form.
         */
        noNewEdit?: boolean | undefined;
        /**
         * - Set to TRUE to not include the default submit button in Webforms.
         */
        noDefaultSubmitButton?: boolean | undefined;
        /**
         * - Set to TRUE to always require confirmation before removing a component.
         */
        alwaysConfirmComponentRemoval?: boolean | undefined;
        /**
         * - Form configurations to apply to forms being created. These configurations are added to the "config" property of the form object.
         */
        formConfig?: object | undefined;
        /**
         * - The tag to use to query for the "Existing Resource Fields" section of the builder.
         */
        resourceTag?: string | undefined;
        /**
         * - The options to apply to the Edit Form (the form that shows inside the modal when you edit a component).
         */
        editForm?: any;
        /**
         * - The language to load into the form builder.
         */
        language?: string | undefined;
        /**
         * - The builder options to pass to the builder.
         */
        builder?: object | undefined;
        /**
         * - The display mode of the builder.
         */
        display?: "form" | "pdf" | "wizard" | undefined;
        /**
         * - Filter applied to the resources that appear in the builder's Existing Resource Fields.
         */
        resourceFilter?: string | undefined;
        /**
         * - When set to TRUE, the resource ID in the builder's Existing Resource Fields will not be linked.
         */
        noSource?: boolean | undefined;
        /**
         * - When set to TRUE, the full JSON schema will be displayed in the JSON edit menu.
         */
        showFullJsonSchema?: boolean | undefined;
    };
    create(display: any): any;
}
import Form from './Form';
