import Bearing, { BearingState } from '../src/index';
export const bearing = new Bearing({
    num: BearingState.fromDefaultVal(0),
    str: BearingState.fromDefaultVal('test bearing'),
    sub: {
        num: BearingState.fromDefaultVal(1),
        str: BearingState.fromDefaultVal('sub bearing'),
    }
});
export const states = bearing.states;