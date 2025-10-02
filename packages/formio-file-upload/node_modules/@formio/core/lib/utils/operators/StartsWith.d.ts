export default class StartsWith extends ConditionOperator {
    execute({ value, comparedValue }: {
        value: any;
        comparedValue: any;
    }): boolean;
}
import ConditionOperator from './ConditionOperator';
