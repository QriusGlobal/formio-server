export default class Field extends Component {
    /**
     * @param {object} element - The component to create.
     * @returns {string} - The rendered HTML string of a component
     */
    render(element: object): string;
    /**
    /* Saves current caret position to restore it after the component is redrawn
     * @param {HTMLElement} element - The element to save the caret position for.
     * @param {number} index - The index of the element.
     */
    saveCaretPosition(element: HTMLElement, index: number): void;
}
import Component from '../component/Component';
