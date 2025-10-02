export default class LessThanOrEqual extends ConditionOperator {
    execute({ value, comparedValue }: {
        value: any;
        comparedValue: any;
    }): boolean;
}
import ConditionOperator from './ConditionOperator';
