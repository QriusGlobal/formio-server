export default class DateGeaterThan extends ConditionOperator {
    getFormattedDates({ value, comparedValue, conditionTriggerComponent }: {
        value: any;
        comparedValue: any;
        conditionTriggerComponent: any;
    }): {
        date: moment.Moment;
        comparedDate: moment.Moment;
    };
    execute(options: any, functionName?: string): any;
}
import ConditionOperator from './ConditionOperator';
import moment from 'moment';
