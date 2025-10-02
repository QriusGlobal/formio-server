export default class ConditionOperator {
    static get operatorKey(): string;
    static get displayedName(): string;
    static get requireValue(): boolean;
    execute(options: any): boolean;
    getResult(options?: {}): any;
}
