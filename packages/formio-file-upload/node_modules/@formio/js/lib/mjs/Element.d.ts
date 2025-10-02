/**
 * The root component for all elements within the Form.io renderer.
 */
export default class Element {
    constructor(options: any);
    /**
     * The options for this component.
     * @type {{}}
     */
    options: {};
    /**
     * The ID of this component. This value is auto-generated when the component is created, but
     * can also be provided from the component.id value passed into the constructor.
     * @type {string}
     */
    id: string;
    /**
     * An array of event handlers so that the destry command can deregister them.
     * @type {Array}
     */
    eventHandlers: any[];
    i18next: any;
    /**
     * An instance of the EventEmitter class to handle the emitting and registration of events.
     * @type {EventEmitter}
     */
    events: EventEmitter;
    defaultMask: any[] | null;
    /**
     * Conditional to show or hide helplinks in editForm
     * @type {*|boolean}
     */
    helplinks: any | boolean;
    /**
     * Register for a new event within this component.
     * @example
     * let component = new BaseComponent({
     *   type: 'textfield',
     *   label: 'First Name',
     *   key: 'firstName'
     * });
     * component.on('componentChange', (changed) => {
     *   console.log('this element is changed.');
     * });
     * @param {string} event - The event you wish to register the handler for.
     * @param {Function} cb - The callback handler to handle this event.
     * @param {boolean} [internal] - This is an internal event handler.
     * @param {boolean} [once] - This event should only fire once.
     * @returns {EventEmitter | void} - The event emitter instance.
     */
    on(event: string, cb: Function, internal?: boolean | undefined, once?: boolean | undefined): EventEmitter | void;
    /**
     * Register for a new single-fire event within this component.
     * @param {string} event - The event you wish to register the handler for.
     * @param {Function} cb - The callback handler to handle this event.
     * @param {boolean} internal - This is an internal event handler.
     * @returns {EventEmitter} - The event emitter instance.
     */
    once(event: string, cb: Function, internal: boolean): EventEmitter;
    /**
     * Allow catching any event.
     * @param {Function} cb - The callback handler to handle this event.
     * @returns {EventEmitter | void} - The event emitter instance.
     */
    onAny(cb: Function): EventEmitter | void;
    /**
     * Removes the listener that will be fired when any event is emitted.
     * @param {Function} cb - The callback handler to handle this event.
     * @returns {EventEmitter | void} - The event emitter instance.
     */
    offAny(cb: Function): EventEmitter | void;
    /**
     * Removes a listener for a certain event. Not passing the 2nd arg will remove all listeners for that event.
     * @param {string} event - The event you wish to register the handler for.
     * @param {Function | undefined} cb - The callback handler to handle this event.
     */
    off(event: string, cb: Function | undefined): void;
    /**
     * Emit a new event.
     * @param {string} event - The event to emit.
     * @param {object} data - The data to emit with the handler.
     */
    emit(event: string, ...data: object): void;
    /**
     * Check if the component has an event handler set up for the event.
     * @param {string} event - The event name.
     * @returns {boolean} - TRUE if the event is registered, FALSE otherwise.
     */
    hasEventHandler(event: string): boolean;
    /**
     * Wrapper method to add an event listener to an HTML element.
     * @param {HtmlElement} obj - The DOM element to add the event to.
     * @param {string} type - The event name to add.
     * @param {Function} func - The callback function to be executed when the listener is triggered.
     * @param {boolean} persistent - If this listener should persist beyond "destroy" commands.
     * @param {boolean} capture - If this listener should be executed in the capture phase.
     * @returns {void | this} - The instance of the element.
     */
    addEventListener(obj: HtmlElement, type: string, func: Function, persistent: boolean, capture: boolean): void | this;
    /**
     * Remove an event listener from the object.
     * @param {HTMLElement} obj - The DOM element to remove the event from.
     * @param {string} type - The event name to remove.
     * @param {Function} func - The callback function to remove.
     * @returns {this | void} - The instance of the element.
     */
    removeEventListener(obj: HTMLElement, type: string, func?: Function): this | void;
    removeEventListeners(): void;
    removeAllEvents(includeExternal: any): void;
    teardown(): void;
    /**
     * Removes all event listeners attached to this component.
     * @param {boolean} all - If all events should be removed, including external events.
     */
    destroy(all?: boolean): void;
    /**
     * Append an HTML DOM element to a container.
     * @param {HTMLElement} element - The DOM element to append.
     * @param {HTMLElement} container - The DOM element that is the container of the element getting appended.
     * @returns {this} - The instance of the element.
     */
    appendTo(element: HTMLElement, container: HTMLElement): this;
    /**
     * Prepend an HTML DOM element to a container.
     * @param {HTMLElement} element - The DOM element to prepend.
     * @param {HTMLElement} container - The DOM element that is the container of the element getting prepended.
     * @returns {this} - The instance of the element.
     */
    prependTo(element: HTMLElement, container: HTMLElement): this;
    /**
     * Removes an HTML DOM element from its bounding container.
     * @param {HTMLElement} element - The element to remove.
     * @param {HTMLElement} container - The DOM element that is the container of the element to remove.
     * @returns {this} - The instance of the element.
     */
    removeChildFrom(element: HTMLElement, container: HTMLElement): this;
    /**
     * Alias for document.createElement.
     * @param {string} type - The type of element to create
     * @param {object} attr - The element attributes to add to the created element.
     * @param {Various} children - Child elements. Can be a DOM Element, string or array of both.
     * @returns {HTMLElement} - The created element.
     */
    ce(type: string, attr: object, children?: Various): HTMLElement;
    /**
     * Append different types of children.
     * @param {HTMLElement} element - The element to append to.
     * @param {HTMLElement} child - The child element to append.
     * @returns {this} - The instance of the element.
     */
    appendChild(element: HTMLElement, child: HTMLElement): this;
    /**
     * Creates a new input mask placeholder.
     * @param {HTMLElement} mask - The input mask.
     * @returns {string} - The placeholder that will exist within the input as they type.
     */
    maskPlaceholder(mask: HTMLElement): string;
    /**
     * Get the placeholder character for the input mask.
     * @returns {string} - The placeholder character.
     */
    get placeholderChar(): string;
    /**
     * Sets the input mask for an input.
     * @param {HTMLElement} input - The html input to apply the mask to.
     * @param {string} inputMask - The input mask to add to this input.
     * @param {boolean} usePlaceholder - Set the mask placeholder on the input.
     */
    setInputMask(input: HTMLElement, inputMask: string, usePlaceholder: boolean): void;
    /**
     * Translate a text using the i18n system.
     * @param {string|Array<string>} text - The i18n identifier.
     * @param {...any} args - The arguments to pass to the i18n translation.
     * @returns {string} - The translated text.
     */
    t(text: string | Array<string>, ...args: any[]): string;
    /**
     * Alias to create a text node.
     * @param {string} text - The text to create.
     * @returns {HtmlElement} - The created text node.
     */
    text(text: string): HtmlElement;
    /**
     * Adds an object of attributes onto an element.
     * @param {HtmlElement} element - The element to add the attributes to.
     * @param {object} attr - The attributes to add to the input element.
     */
    attr(element: HtmlElement, attr: object): void;
    /**
     * Determines if an element has a class.
     *
     * Taken from jQuery https://j11y.io/jquery/#v=1.5.0&fn=jQuery.fn.hasClass
     * @param {HTMLElement} element - The element to check for the class.
     * @param {string} className - The class to check for.
     * @returns {boolean} - TRUE if the element has the class, FALSE otherwise.
     */
    hasClass(element: HTMLElement, className: string): boolean;
    /**
     * Adds a class to a DOM element.
     * @param {HTMLElement} element - The element to add a class to.
     * @param {string} className - The name of the class to add.
     * @returns {this} - The instance of the element.
     */
    addClass(element: HTMLElement, className: string): this;
    /**
     * Remove a class from a DOM element.
     * @param {HTMLElement} element - The DOM element to remove the class from.
     * @param {string} className - The name of the class that is to be removed.
     * @returns {this} - The instance of the element.
     */
    removeClass(element: HTMLElement, className: string): this;
    /**
     * Empty's an HTML DOM element.
     * @param {HTMLElement} element - The element you wish to empty.
     */
    empty(element: HTMLElement): void;
    /**
     * Create an evaluation context for all script executions and interpolations.
     * @param {object} additional - Additional context to apply to the evaluation context.
     * @returns {*} - The evaluation context.
     */
    evalContext(additional: object): any;
    /**
     * Performs an interpolation using the evaluation context of this component.
     * @param {string} string - The string to interpolate.
     * @param {object} data - The data to use in the interpolation.
     * @param {object} options - The options to pass to the interpolation.
     * @returns {XML|string|*|void} - The interpolated string.
     */
    interpolate(string: string, data: object, options?: object): XML | string | any | void;
    /**
     * Performs an evaluation using the evaluation context of this component.
     * @param {string|Function|object} func - The function or string to evaluate.
     * @param {object} args - The arguments to pass to the evaluation.
     * @param {string} ret - The name of the variable within the evaluation context to return.
     * @param {boolean} interpolate - Determines if it should replace all {{ }} token references with actual data.
     * @param {import('@formio/core').EvaluatorOptions} options - The options to pass to the evaluation.
     * @returns {*} - The result of the evaluation.
     */
    evaluate(func: string | Function | object, args: object, ret: string, interpolate: boolean, options?: import('@formio/core').EvaluatorOptions): any;
    /**
     * Allow for options to hook into the functionality of this renderer.
     * @returns {*} - The result of the hook function.
     */
    hook(...args: any[]): any;
}
import EventEmitter from './EventEmitter';
