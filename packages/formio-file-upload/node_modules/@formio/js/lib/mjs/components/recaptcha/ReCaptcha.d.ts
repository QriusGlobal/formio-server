export default class ReCaptchaComponent extends Component {
    static get builderInfo(): {};
    static savedValueTypes(): never[];
    static get conditionOperatorsSettings(): {
        operators: string[];
    };
    static get serverConditionSettings(): {
        operators: string[];
    };
    render(): string;
    recaptchaResult: any;
    createInput(): void;
    recaptchaApiReady: any;
    createLabel(): void;
    verify(actionName: any): Promise<void>;
    recaptchaVerifiedPromise: Promise<any> | undefined;
    isLoading: boolean | undefined;
    loading: boolean | undefined;
    sendVerificationRequest(token: any): any;
    checkComponentValidity(data: any, dirty: any, row: any, options?: {}, errors?: any[]): boolean | Promise<boolean>;
    normalizeValue(newValue: any): any;
}
import Component from '../_classes/component/Component';
