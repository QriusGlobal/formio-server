export default class GreaterThanOrEqual extends ConditionOperator {
    execute({ value, comparedValue }: {
        value: any;
        comparedValue: any;
    }): boolean;
}
import ConditionOperator from './ConditionOperator';
