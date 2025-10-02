declare namespace _default {
    /**
     * Appends a number to a component.key to keep it unique
     * @param {import('@formio/core').Component[]} container - The container of components to uniquify against
     * @param {import('@formio/core').Component} component - The Component to uniqify.
     * @returns {boolean} - If the component was changed.
     */
    function uniquify(container: import("@formio/core").Component[], component: import("@formio/core").Component): boolean;
    namespace additionalShortcuts {
        let button: string[];
    }
    /**
     * Returns the alpha character shortcuts.
     * @returns {string[]} - An array of shortcuts of alpha characters.
     */
    function getAlphaShortcuts(): string[];
    function getAdditionalShortcuts(type: any): any;
    function getBindedShortcuts(components: any, input: any): any[];
    function getAvailableShortcuts(form: any, component: any): {
        label: string;
        value: string;
    }[];
}
export default _default;
