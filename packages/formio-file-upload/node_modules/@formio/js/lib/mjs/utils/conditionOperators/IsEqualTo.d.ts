export default class IsEqualTo extends ConditionOperator {
    execute({ value, comparedValue, instance, path }: {
        value: any;
        comparedValue: any;
        instance: any;
        path: any;
    }): any;
}
import ConditionOperator from './ConditionOperator';
