export default class EndsWith extends ConditionOperator {
    execute({ value, comparedValue }: {
        value: any;
        comparedValue: any;
    }): any;
}
import ConditionOperator from './ConditionOperator';
