export default class PDF extends Webform {
    components: any[];
    init(): void;
    render(): any;
    submitButton: any;
    attachComponents(element: any, components: any, container: any): Promise<void>;
    attach(element: any): Promise<void>;
    iframeReady: Promise<any> | undefined;
    iframeReadyResolve: ((value: any) => void) | undefined;
    iframeReadyReject: ((reason?: any) => void) | undefined;
    iframeElement: any;
    /**
     * Get the submission from the iframe.
     * @returns {Promise<any>} - The submission from the iframe.
     */
    getSubmission(): Promise<any>;
    /**
     * Ensure we have the submission from the iframe before we submit the form.
     * @param {any} options - The options for submission.
     * @returns {Promise<any>} - Resolves when the form is submitted.
     */
    submitForm(options?: any): Promise<any>;
    getSrc(): string;
    setForm(form: any, flags?: {}): Promise<void>;
    /**
     * Set's the value of this form component.
     * @param {import('@formio/core').Submission} submission - The submission JSON to set the value of this form.
     * @param {any} flags - The flags to use when setting the submission.
     * @returns {boolean} - If the value changed or not.
     */
    setValue(submission: import('@formio/core').Submission, flags?: any): boolean;
    postMessage(message: any): void;
    iframeFormSetUp: boolean | undefined;
    focusOnComponent(key: any): void;
    showErrors(error: any, triggerEvent: any): void;
    isSubmitButtonHidden(): boolean;
}
import Webform from './Webform';
