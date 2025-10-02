export default ConditionOperators;
declare const ConditionOperators: {
    [x: string]: typeof IsEqualTo | typeof DateGreaterThan;
};
import IsEqualTo from './IsEqualTo';
import DateGreaterThan from './DateGreaterThan';
