export default class IsEmptyValue extends ConditionOperator {
    execute({ value, instance, path }: {
        value: any;
        instance: any;
        path: any;
    }): any;
    getResult(options: any): any;
}
import ConditionOperator from './ConditionOperator';
