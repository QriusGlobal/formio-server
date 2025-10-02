export default class PasswordStrengthAddon extends FormioAddon {
    static get info(): {
        supportedComponents: string[];
        name: string;
        components: ({
            type: string;
            title: any;
            theme: string;
            collapsible: boolean;
            collapsed: boolean;
            key: string;
            weight: any;
            components: ({
                type: string;
                tag: string;
                content: string;
            } | {
                type: string;
                title: string;
                collapsible: boolean;
                collapsed: boolean;
                style: {
                    'margin-bottom': string;
                };
                key: string;
                customConditional(): boolean;
                components: ({
                    type: string;
                    key: any;
                    rows: number;
                    editor: string;
                    hideLabel: boolean;
                    as: string;
                    input: boolean;
                    tag?: undefined;
                    content?: undefined;
                } | {
                    type: string;
                    tag: string;
                    content: string;
                    key?: undefined;
                    rows?: undefined;
                    editor?: undefined;
                    hideLabel?: undefined;
                    as?: undefined;
                    input?: undefined;
                })[];
            } | {
                type: string;
                title: string;
                collapsible: boolean;
                collapsed: boolean;
                key: string;
                components: ({
                    type: string;
                    tag: string;
                    content: string;
                    key?: undefined;
                    rows?: undefined;
                    editor?: undefined;
                    hideLabel?: undefined;
                    as?: undefined;
                    input?: undefined;
                } | {
                    type: string;
                    key: any;
                    rows: number;
                    editor: string;
                    hideLabel: boolean;
                    as: string;
                    input: boolean;
                    tag?: undefined;
                    content?: undefined;
                })[];
                style?: undefined;
                customConditional?: undefined;
            })[];
        } | {
            label: string;
            reorder: boolean;
            addAnotherPosition: string;
            layoutFixed: boolean;
            enableRowGroups: boolean;
            initEmpty: boolean;
            tableView: boolean;
            defaultValue: {}[];
            key: string;
            type: string;
            input: boolean;
            components: ({
                label: string;
                tableView: boolean;
                validate: {
                    required: boolean;
                    min?: undefined;
                    max?: undefined;
                    onlyAvailableItems?: undefined;
                };
                key: string;
                type: string;
                input: boolean;
                description?: undefined;
                mask?: undefined;
                spellcheck?: undefined;
                delimiter?: undefined;
                requireDecimal?: undefined;
                inputFormat?: undefined;
                tooltip?: undefined;
                data?: undefined;
                selectThreshold?: undefined;
                indexeddb?: undefined;
                placeholder?: undefined;
            } | {
                label: string;
                description: string;
                mask: boolean;
                spellcheck: boolean;
                tableView: boolean;
                delimiter: boolean;
                requireDecimal: boolean;
                inputFormat: string;
                validate: {
                    required: boolean;
                    min: number;
                    max: number;
                    onlyAvailableItems?: undefined;
                };
                key: string;
                type: string;
                input: boolean;
                tooltip?: undefined;
                data?: undefined;
                selectThreshold?: undefined;
                indexeddb?: undefined;
                placeholder?: undefined;
            } | {
                label: string;
                tooltip: string;
                tableView: boolean;
                data: {
                    values: {
                        label: string;
                        value: string;
                    }[];
                };
                selectThreshold: number;
                validate: {
                    onlyAvailableItems: boolean;
                    required?: undefined;
                    min?: undefined;
                    max?: undefined;
                };
                key: string;
                type: string;
                indexeddb: {
                    filter: {};
                };
                input: boolean;
                description?: undefined;
                mask?: undefined;
                spellcheck?: undefined;
                delimiter?: undefined;
                requireDecimal?: undefined;
                inputFormat?: undefined;
                placeholder?: undefined;
            } | {
                label: string;
                placeholder: string;
                tooltip: string;
                tableView: boolean;
                key: string;
                type: string;
                input: boolean;
                validate?: undefined;
                description?: undefined;
                mask?: undefined;
                spellcheck?: undefined;
                delimiter?: undefined;
                requireDecimal?: undefined;
                inputFormat?: undefined;
                data?: undefined;
                selectThreshold?: undefined;
                indexeddb?: undefined;
            })[];
            data?: undefined;
            selectThreshold?: undefined;
            validate?: undefined;
            indexeddb?: undefined;
            rowDrafts?: undefined;
            description?: undefined;
            tooltip?: undefined;
            multiple?: undefined;
            hideLabel?: undefined;
            editor?: undefined;
            as?: undefined;
        } | {
            label: string;
            tableView: boolean;
            data: {
                values: {
                    label: string;
                    value: string;
                }[];
            };
            selectThreshold: number;
            validate: {
                onlyAvailableItems: boolean;
            };
            key: string;
            type: string;
            indexeddb: {
                filter: {};
            };
            input: boolean;
            reorder?: undefined;
            addAnotherPosition?: undefined;
            layoutFixed?: undefined;
            enableRowGroups?: undefined;
            initEmpty?: undefined;
            defaultValue?: undefined;
            components?: undefined;
            rowDrafts?: undefined;
            description?: undefined;
            tooltip?: undefined;
            multiple?: undefined;
            hideLabel?: undefined;
            editor?: undefined;
            as?: undefined;
        } | {
            label: string;
            reorder: boolean;
            addAnotherPosition: string;
            layoutFixed: boolean;
            enableRowGroups: boolean;
            initEmpty: boolean;
            tableView: boolean;
            defaultValue: {}[];
            key: string;
            type: string;
            input: boolean;
            components: ({
                label: string;
                tableView: boolean;
                data: {
                    values: {
                        label: string;
                        value: string;
                    }[];
                };
                selectThreshold: number;
                validate: {
                    required: boolean;
                    onlyAvailableItems: boolean;
                };
                key: string;
                type: string;
                indexeddb: {
                    filter: {};
                };
                input: boolean;
                defaultValue?: undefined;
            } | {
                label: string;
                tableView: boolean;
                key: string;
                type: string;
                input: boolean;
                data?: undefined;
                selectThreshold?: undefined;
                validate?: undefined;
                indexeddb?: undefined;
                defaultValue?: undefined;
            } | {
                label: string;
                tableView: boolean;
                key: string;
                type: string;
                input: boolean;
                defaultValue: boolean;
                data?: undefined;
                selectThreshold?: undefined;
                validate?: undefined;
                indexeddb?: undefined;
            })[];
            data?: undefined;
            selectThreshold?: undefined;
            validate?: undefined;
            indexeddb?: undefined;
            rowDrafts?: undefined;
            description?: undefined;
            tooltip?: undefined;
            multiple?: undefined;
            hideLabel?: undefined;
            editor?: undefined;
            as?: undefined;
        } | {
            label: string;
            tableView: boolean;
            rowDrafts: boolean;
            key: string;
            type: string;
            input: boolean;
            components: ({
                type: string;
                title: any;
                theme: string;
                collapsible: boolean;
                collapsed: boolean;
                key: string;
                weight: any;
                components: ({
                    type: string;
                    tag: string;
                    content: string;
                } | {
                    type: string;
                    title: string;
                    collapsible: boolean;
                    collapsed: boolean;
                    style: {
                        'margin-bottom': string;
                    };
                    key: string;
                    customConditional(): boolean;
                    components: ({
                        type: string;
                        key: any;
                        rows: number;
                        editor: string;
                        hideLabel: boolean;
                        as: string;
                        input: boolean;
                        tag?: undefined;
                        content?: undefined;
                    } | {
                        type: string;
                        tag: string;
                        content: string;
                        key?: undefined;
                        rows?: undefined;
                        editor?: undefined;
                        hideLabel?: undefined;
                        as?: undefined;
                        input?: undefined;
                    })[];
                } | {
                    type: string;
                    title: string;
                    collapsible: boolean;
                    collapsed: boolean;
                    key: string;
                    components: ({
                        type: string;
                        tag: string;
                        content: string;
                        key?: undefined;
                        rows?: undefined;
                        editor?: undefined;
                        hideLabel?: undefined;
                        as?: undefined;
                        input?: undefined;
                    } | {
                        type: string;
                        key: any;
                        rows: number;
                        editor: string;
                        hideLabel: boolean;
                        as: string;
                        input: boolean;
                        tag?: undefined;
                        content?: undefined;
                    })[];
                    style?: undefined;
                    customConditional?: undefined;
                })[];
            } | {
                label: string;
                tableView: boolean;
                validate: {
                    required: boolean;
                };
                key: string;
                type: string;
                input: boolean;
                description?: undefined;
                mask?: undefined;
                spellcheck?: undefined;
                delimiter?: undefined;
                requireDecimal?: undefined;
                inputFormat?: undefined;
                tooltip?: undefined;
                defaultValue?: undefined;
            } | {
                label: string;
                description: string;
                mask: boolean;
                spellcheck: boolean;
                tableView: boolean;
                delimiter: boolean;
                requireDecimal: boolean;
                inputFormat: string;
                key: string;
                type: string;
                input: boolean;
                validate?: undefined;
                tooltip?: undefined;
                defaultValue?: undefined;
            } | {
                label: string;
                tooltip: string;
                tableView: boolean;
                key: string;
                type: string;
                input: boolean;
                defaultValue: boolean;
                validate?: undefined;
                description?: undefined;
                mask?: undefined;
                spellcheck?: undefined;
                delimiter?: undefined;
                requireDecimal?: undefined;
                inputFormat?: undefined;
            })[];
            reorder?: undefined;
            addAnotherPosition?: undefined;
            layoutFixed?: undefined;
            enableRowGroups?: undefined;
            initEmpty?: undefined;
            defaultValue?: undefined;
            data?: undefined;
            selectThreshold?: undefined;
            validate?: undefined;
            indexeddb?: undefined;
            description?: undefined;
            tooltip?: undefined;
            multiple?: undefined;
            hideLabel?: undefined;
            editor?: undefined;
            as?: undefined;
        } | {
            label: string;
            description: string;
            tableView: boolean;
            key: string;
            type: string;
            input: boolean;
            defaultValue: boolean;
            reorder?: undefined;
            addAnotherPosition?: undefined;
            layoutFixed?: undefined;
            enableRowGroups?: undefined;
            initEmpty?: undefined;
            components?: undefined;
            data?: undefined;
            selectThreshold?: undefined;
            validate?: undefined;
            indexeddb?: undefined;
            rowDrafts?: undefined;
            tooltip?: undefined;
            multiple?: undefined;
            hideLabel?: undefined;
            editor?: undefined;
            as?: undefined;
        } | {
            label: string;
            tooltip: string;
            tableView: boolean;
            multiple: boolean;
            key: string;
            type: string;
            input: boolean;
            reorder?: undefined;
            addAnotherPosition?: undefined;
            layoutFixed?: undefined;
            enableRowGroups?: undefined;
            initEmpty?: undefined;
            defaultValue?: undefined;
            components?: undefined;
            data?: undefined;
            selectThreshold?: undefined;
            validate?: undefined;
            indexeddb?: undefined;
            rowDrafts?: undefined;
            description?: undefined;
            hideLabel?: undefined;
            editor?: undefined;
            as?: undefined;
        } | {
            label: string;
            tooltip: string;
            tableView: boolean;
            key: string;
            type: string;
            input: boolean;
            defaultValue: boolean;
            reorder?: undefined;
            addAnotherPosition?: undefined;
            layoutFixed?: undefined;
            enableRowGroups?: undefined;
            initEmpty?: undefined;
            components?: undefined;
            data?: undefined;
            selectThreshold?: undefined;
            validate?: undefined;
            indexeddb?: undefined;
            rowDrafts?: undefined;
            description?: undefined;
            multiple?: undefined;
            hideLabel?: undefined;
            editor?: undefined;
            as?: undefined;
        } | {
            label: string;
            hideLabel: boolean;
            tableView: boolean;
            key: string;
            type: string;
            input: boolean;
            components: ({
                label: string;
                tooltip: string;
                tableView: boolean;
                data: {
                    values: {
                        label: string;
                        value: string;
                    }[];
                };
                selectThreshold: number;
                validate: {
                    onlyAvailableItems: boolean;
                };
                key: string;
                type: string;
                indexeddb: {
                    filter: {};
                };
                input: boolean;
                placeholder?: undefined;
                description?: undefined;
            } | {
                label: string;
                placeholder: string;
                description: string;
                tableView: boolean;
                key: string;
                type: string;
                input: boolean;
                tooltip?: undefined;
                data?: undefined;
                selectThreshold?: undefined;
                validate?: undefined;
                indexeddb?: undefined;
            })[];
            reorder?: undefined;
            addAnotherPosition?: undefined;
            layoutFixed?: undefined;
            enableRowGroups?: undefined;
            initEmpty?: undefined;
            defaultValue?: undefined;
            data?: undefined;
            selectThreshold?: undefined;
            validate?: undefined;
            indexeddb?: undefined;
            rowDrafts?: undefined;
            description?: undefined;
            tooltip?: undefined;
            multiple?: undefined;
            editor?: undefined;
            as?: undefined;
        } | {
            label: string;
            editor: string;
            tableView: boolean;
            key: string;
            type: string;
            input: boolean;
            as: string;
            reorder?: undefined;
            addAnotherPosition?: undefined;
            layoutFixed?: undefined;
            enableRowGroups?: undefined;
            initEmpty?: undefined;
            defaultValue?: undefined;
            components?: undefined;
            data?: undefined;
            selectThreshold?: undefined;
            validate?: undefined;
            indexeddb?: undefined;
            rowDrafts?: undefined;
            description?: undefined;
            tooltip?: undefined;
            multiple?: undefined;
            hideLabel?: undefined;
        })[];
        label: string;
        defaultSettings: {
            rulesSettings: {
                name: string;
                required: boolean;
                message: string;
            }[];
            updateOn: string;
            required: boolean;
            levels: {
                name: string;
                maxEntropy: number;
                style: string;
            }[];
            blackList: never[];
            template: string;
            location: {
                insert: string;
                selector: string;
            };
        };
    };
    get defaultSettings(): {
        rulesSettings: {
            name: string;
            required: boolean;
            message: string;
        }[];
        updateOn: string;
        required: boolean;
        levels: {
            name: string;
            maxEntropy: number;
            style: string;
        }[];
        blackList: never[];
        template: string;
        location: {
            insert: string;
            selector: string;
        };
    };
    get rules(): {
        length: {
            check: (value: any, options: any) => string | true;
        };
        upperCase: {
            check: (value: any) => true | "Value must contain uppercased alphabetical characters";
            increaseCharactersPoolSize: number;
        };
        numeric: {
            check: (value: any) => true | "Value must contain numeric characters";
            increaseCharactersPoolSize: number;
        };
        lowerCase: {
            check: (value: any) => true | "Value must contain lowercased alphabetical characters";
            increaseCharactersPoolSize: number;
        };
        symbols: {
            check: (value: any) => true | "Value must contain symbols";
            increaseCharactersPoolSize: number;
        };
    };
    set charactersPoolLength(value: any);
    get charactersPoolLength(): any;
    _charactersPoolLength: any;
    set level(level: any);
    get level(): any;
    _level: any;
    set entropy(value: number);
    get entropy(): number;
    get dictionarySize(): any;
    _entropy: number;
    get template(): any;
    get tooltip(): any;
    get rulesSettings(): any;
    get customRules(): any;
    log2(value: any): number;
    calculatePasswordEntropy(passwordLength: any, charactersPoolSize: any): number;
    calculatePasswordEntropyWords(wordsCount: any): number;
    render(): any;
    checkBlackList(value: any): true | {
        entropy: number;
        blacklistedWords: any[];
    };
    /**
     * Determines is a password is secure enough to submit
     * @returns {boolean} - returns TRUE if password is valid, FALSE if it is not.
     */
    isValid(): boolean;
    /**
     * Handles the result of check and constructs a new error object or returns an amount of points to add to the current entropy
     * @param {boolean|number} valid - Determines if the validation was failed or an amount of points if it was passed
     * @param {*} validation - Validation configuration
     * @param {string} message - Message which should be shown if validation was not passed
     * @param {any[]} errors - The errors array (will be mutated)
     * @returns {number} - Returns an amount of points to add to the current entropy
     */
    handleRuleCheckResult(valid: boolean | number, validation: any, message: string, errors: any[]): number;
    performChecks(value: any): {
        charactersPoolSize: number;
        errors: any[];
    };
    /**
     * Performs checks to validate password security
     * @param {string} value - The password value to be checked.
     * @returns {boolean} - Returns TRUE if password is strong enough, FALSE if it is not.
     */
    checkValidity(value: string): boolean;
    handleBlackListCheckResult(result: any, errors: any): void;
    levels: any[];
    maxEntropy: any;
    attach(element: any): void;
    insertContainer(element: any, container: any): boolean;
    /**
     * Finds the level which one the passed entropy suits
     * @param {number} entropy - Points of password's security
     * @returns {object} - Returns the level object
     */
    getLevel(entropy?: number): object;
    /**
     * Update the current view of the password's security indicator
     */
    updateView(): void;
}
import FormioAddon from '../FormioAddon';
