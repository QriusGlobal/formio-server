export default class Form extends Element {
    static embed(embed: any): Promise<any>;
    constructor(elementOrForm: any, formOrOptions: any, options?: {});
    /**
     * Represents a JSON value.
     * @typedef {(string | number | boolean | null | JSONArray | JSONObject)} JSON
     */
    /**
     * Represents a JSON array.
     * @typedef {Array<JSON>} JSONArray
     */
    /**
     * Represents a JSON object.
     * @typedef {{[key: string]: JSON}} JSONObject
     */
    /**
     * @typedef {object} FormioHooks
     * @property {Function} [beforeSubmit] - Called before a submission is made.
     * @property {Function} [beforeCancel] - Called before a cancel is made.
     * @property {Function} [beforeNext] - Called before the next page is navigated to.
     * @property {Function} [beforePrev] - Called before the previous page is navigated to.
     * @property {Function} [attachComponent] - Called when a component is attached.
     * @property {Function} [setDataValue] - Called when a data value is set.
     * @property {Function} [addComponents] - Called when components are added.
     * @property {Function} [addComponent] - Called when a component is added.
     * @property {Function} [customValidation] - Called when a custom validation is made.
     * @property {Function} [attachWebform] - Called when a webform is attached.
     */
    /**
     * @typedef {object} SanitizeConfig
     * @property {string[]} [addAttr] - The html attributes to allow with sanitization.
     * @property {string[]} [addTags] - The html tags to allow with sanitization.
     * @property {string[]} [allowedAttrs] - The html attributes to allow with sanitization.
     * @property {string[]} [allowedTags] - The html tags to allow with sanitization.
     * @property {string[]} [allowedUriRegex] - The regex for allowed URIs.
     * @property {string[]} [addUriSafeAttr] - The URI attributes to allow with sanitization.
     */
    /**
     * @typedef {object} ButtonSettings
     * @property {boolean} [showPrevious] - Show the previous button in wizard forms.
     * @property {boolean} [showNext] - Show the next button in wizard forms.
     * @property {boolean} [showCancel] - Show the cancel button in wizard forms.
     * @property {boolean} [showSubmit] - Show the submit button in wizard forms.
     */
    /**
     * @typedef {object} FormOptions
     * @property {boolean} [saveDraft] - Enable the save draft feature.
     * @property {number} [saveDraftThrottle] - The throttle for the save draft feature.
     * @property {boolean} [readOnly] - Set this form to readOnly.
     * @property {boolean} [noAlerts] - Disable the alerts dialog.
     * @property {{[key: string]: string}} [i18n] - The translation file for this rendering.
     * @property {string} [template] - Custom logic for creation of elements.
     * @property {boolean} [noDefaults] - Exclude default values from the settings.
     * @property {any} [fileService] - The file service for this form.
     * @property {EventEmitter} [events] - The EventEmitter for this form.
     * @property {string} [language] - The language to render this form in.
     * @property {{[key: string]: string}} [i18next] - The i18next configuration for this form.
     * @property {boolean} [viewAsHtml] - View the form as raw HTML.
     * @property {'form' | 'html' | 'flat' | 'builder' | 'pdf'} [renderMode] - The render mode for this form.
     * @property {boolean} [highlightErrors] - Highlight any errors on the form.
     * @property {string} [componentErrorClass] - The error class for components.
     * @property {any} [templates] - The templates for this form.
     * @property {string} [iconset] - The iconset for this form.
     * @property {import('@formio/core').Component[]} [components] - The components for this form.
     * @property {{[key: string]: boolean}} [disabled] - Disabled components for this form.
     * @property {boolean} [showHiddenFields] - Show hidden fields.
     * @property {{[key: string]: boolean}} [hide] - Hidden components for this form.
     * @property {{[key: string]: boolean}} [show] - Components to show for this form.
     * @property {Formio} [formio] - The Formio instance for this form.
     * @property {string} [decimalSeparator] - The decimal separator for this form.
     * @property {string} [thousandsSeparator] - The thousands separator for this form.
     * @property {FormioHooks} [hooks] - The hooks for this form.
     * @property {boolean} [alwaysDirty] - Always be dirty.
     * @property {boolean} [skipDraftRestore] - Skip restoring a draft.
     * @property {'form' | 'wizard' | 'pdf'} [display] - The display for this form.
     * @property {string} [cdnUrl] - The CDN url for this form.
     * @property {boolean} [flatten] - Flatten the form.
     * @property {boolean} [sanitize] - Sanitize the form.
     * @property {SanitizeConfig} [sanitizeConfig] - The sanitize configuration for this form.
     * @property {ButtonSettings} [buttonSettings] - The button settings for this form.
     * @property {object} [breadcrumbSettings] - The breadcrumb settings for this form.
     * @property {boolean} [allowPrevious] - Allow the previous button (for Wizard forms).
     * @property {string[]} [wizardButtonOrder] - The order of the buttons (for Wizard forms).
     * @property {boolean} [showCheckboxBackground] - Show the checkbox background.
     * @property {number} [zoom] - The zoom for PDF forms.
     */
    /**
     * Creates an easy to use interface for embedding webforms, pdfs, and wizards into your application.
     * @param {object} elementOrForm - The DOM element you wish to render this form within, or the form definition.
     * @param {object | string | FormOptions} formOrOptions - A Form JSON schema, the URL of a hosted form, or the form options.
     * @param {FormOptions} [options] - The options to create a new form instance.
     * @example
     * import Form from '@formio/js/Form';
     * const form = new Form(document.getElementById('formio'), 'https://examples.form.io/example');
     * form.build();
     */
    /**
     * @type {FormOptions} - the options for this Form.
     */
    options: {
        /**
         * - Enable the save draft feature.
         */
        saveDraft?: boolean | undefined;
        /**
         * - The throttle for the save draft feature.
         */
        saveDraftThrottle?: number | undefined;
        /**
         * - Set this form to readOnly.
         */
        readOnly?: boolean | undefined;
        /**
         * - Disable the alerts dialog.
         */
        noAlerts?: boolean | undefined;
        /**
         * - The translation file for this rendering.
         */
        i18n?: {
            [key: string]: string;
        } | undefined;
        /**
         * - Custom logic for creation of elements.
         */
        template?: string | undefined;
        /**
         * - Exclude default values from the settings.
         */
        noDefaults?: boolean | undefined;
        /**
         * - The file service for this form.
         */
        fileService?: any;
        /**
         * - The EventEmitter for this form.
         */
        events?: any;
        /**
         * - The language to render this form in.
         */
        language?: string | undefined;
        /**
         * - The i18next configuration for this form.
         */
        i18next?: {
            [key: string]: string;
        } | undefined;
        /**
         * - View the form as raw HTML.
         */
        viewAsHtml?: boolean | undefined;
        /**
         * - The render mode for this form.
         */
        renderMode?: "builder" | "form" | "html" | "flat" | "pdf" | undefined;
        /**
         * - Highlight any errors on the form.
         */
        highlightErrors?: boolean | undefined;
        /**
         * - The error class for components.
         */
        componentErrorClass?: string | undefined;
        /**
         * - The templates for this form.
         */
        templates?: any;
        /**
         * - The iconset for this form.
         */
        iconset?: string | undefined;
        /**
         * - The components for this form.
         */
        components?: import("@formio/core").Component[] | undefined;
        /**
         * - Disabled components for this form.
         */
        disabled?: {
            [key: string]: boolean;
        } | undefined;
        /**
         * - Show hidden fields.
         */
        showHiddenFields?: boolean | undefined;
        /**
         * - Hidden components for this form.
         */
        hide?: {
            [key: string]: boolean;
        } | undefined;
        /**
         * - Components to show for this form.
         */
        show?: {
            [key: string]: boolean;
        } | undefined;
        /**
         * - The Formio instance for this form.
         */
        formio?: any;
        /**
         * - The decimal separator for this form.
         */
        decimalSeparator?: string | undefined;
        /**
         * - The thousands separator for this form.
         */
        thousandsSeparator?: string | undefined;
        /**
         * - The hooks for this form.
         */
        hooks?: {
            /**
             * - Called before a submission is made.
             */
            beforeSubmit?: Function | undefined;
            /**
             * - Called before a cancel is made.
             */
            beforeCancel?: Function | undefined;
            /**
             * - Called before the next page is navigated to.
             */
            beforeNext?: Function | undefined;
            /**
             * - Called before the previous page is navigated to.
             */
            beforePrev?: Function | undefined;
            /**
             * - Called when a component is attached.
             */
            attachComponent?: Function | undefined;
            /**
             * - Called when a data value is set.
             */
            setDataValue?: Function | undefined;
            /**
             * - Called when components are added.
             */
            addComponents?: Function | undefined;
            /**
             * - Called when a component is added.
             */
            addComponent?: Function | undefined;
            /**
             * - Called when a custom validation is made.
             */
            customValidation?: Function | undefined;
            /**
             * - Called when a webform is attached.
             */
            attachWebform?: Function | undefined;
        } | undefined;
        /**
         * - Always be dirty.
         */
        alwaysDirty?: boolean | undefined;
        /**
         * - Skip restoring a draft.
         */
        skipDraftRestore?: boolean | undefined;
        /**
         * - The display for this form.
         */
        display?: "form" | "pdf" | "wizard" | undefined;
        /**
         * - The CDN url for this form.
         */
        cdnUrl?: string | undefined;
        /**
         * - Flatten the form.
         */
        flatten?: boolean | undefined;
        /**
         * - Sanitize the form.
         */
        sanitize?: boolean | undefined;
        /**
         * - The sanitize configuration for this form.
         */
        sanitizeConfig?: {
            /**
             * - The html attributes to allow with sanitization.
             */
            addAttr?: string[] | undefined;
            /**
             * - The html tags to allow with sanitization.
             */
            addTags?: string[] | undefined;
            /**
             * - The html attributes to allow with sanitization.
             */
            allowedAttrs?: string[] | undefined;
            /**
             * - The html tags to allow with sanitization.
             */
            allowedTags?: string[] | undefined;
            /**
             * - The regex for allowed URIs.
             */
            allowedUriRegex?: string[] | undefined;
            /**
             * - The URI attributes to allow with sanitization.
             */
            addUriSafeAttr?: string[] | undefined;
        } | undefined;
        /**
         * - The button settings for this form.
         */
        buttonSettings?: {
            /**
             * - Show the previous button in wizard forms.
             */
            showPrevious?: boolean | undefined;
            /**
             * - Show the next button in wizard forms.
             */
            showNext?: boolean | undefined;
            /**
             * - Show the cancel button in wizard forms.
             */
            showCancel?: boolean | undefined;
            /**
             * - Show the submit button in wizard forms.
             */
            showSubmit?: boolean | undefined;
        } | undefined;
        /**
         * - The breadcrumb settings for this form.
         */
        breadcrumbSettings?: object | undefined;
        /**
         * - Allow the previous button (for Wizard forms).
         */
        allowPrevious?: boolean | undefined;
        /**
         * - The order of the buttons (for Wizard forms).
         */
        wizardButtonOrder?: string[] | undefined;
        /**
         * - Show the checkbox background.
         */
        showCheckboxBackground?: boolean | undefined;
        /**
         * - The zoom for PDF forms.
         */
        zoom?: number | undefined;
    };
    ready: Promise<any>;
    readyResolve: (value: any) => void;
    readyReject: (reason?: any) => void;
    instance: any;
    element: any;
    display: string;
    createElement(tag: any, attrs: any, children: any): any;
    set loading(load: any);
    loader: any;
    /**
     * Create a new form instance provided the display of the form.
     * @param {string} display - The display of the form, either "wizard", "form", or "pdf"
     * @returns {Webform|Wizard|PDF} - The new form instance for the display.
     */
    create(display: string): Webform | Wizard | PDF;
    /**
     * Sets the form. Either as JSON or a URL to a form JSON schema.
     * @param {string|object} formParam - Either the form JSON or the URL of the form json.
     * @returns {void}
     */
    set form(formParam: object);
    /**
     * Returns the loaded forms JSON.
     * @returns {object} - The loaded form's JSON
     */
    get form(): object;
    errorForm(err: any): {
        components: {
            label: string;
            tag: string;
            className: string;
            attrs: {
                attr: string;
                value: string;
            }[];
            key: string;
            type: string;
            input: boolean;
            content: any;
        }[];
    };
    /**
     * Check Subdirectories path and provide correct options
     * @param {string} url - The the URL of the form json.
     * @param {import('@formio/core').Form} form - The form json.
     * @returns {object} The initial options with base and project.
     */
    getFormInitOptions(url: string, form: import('@formio/core').Form): object;
    /**
     * Sets the form to the JSON schema of a form.
     * @param {import('@formio/core').Form} formParam - The form JSON to set this form to.
     * @returns {Promise<Webform|Wizard|PDF>} - The webform instance that was created.
     */
    setForm(formParam: import('@formio/core').Form): Promise<Webform | Wizard | PDF>;
    _form: any;
    getSubmission(formio: any, opts: any): any;
    /**
     * Changes the display of the form.
     * @param {string} display - The display to set this form. Either "wizard", "form", or "pdf"
     * @returns {Promise<Webform|Wizard|PDF>} - The form instance that was created after changing the display.
     */
    setDisplay(display: string): Promise<Webform | Wizard | PDF>;
    empty(): void;
    /**
     * Sanitize an html string.
     * @param {string} dirty - The dirty html string to sanitize.
     * @param {boolean} forceSanitize - If the string should be force sanitized.
     * @returns {string} - The sanitized html string.
     */
    sanitize(dirty: string, forceSanitize: boolean): string;
    setContent(element: any, content: any, forceSanitize: any): boolean;
    /**
     * Build a new form.
     * @returns {Promise<Webform|Wizard|PDF>} - The form instance that was created.
     */
    build(): Promise<Webform | Wizard | PDF>;
    render(): Promise<any>;
    attach(element: any): any;
}
import Element from './Element';
