import { useEffect, useState } from 'react';
import { BearingState } from './bearing-state';

export default function useBearing<U>(state: BearingState<U>): [U, (value: U) => void, BearingState<U>] {
    const [val, setVal] = useState<U>(state.val);
    useEffect(() => {
        const updateFun = (val: U) => setVal(val);
        state.addListener("update", updateFun);
        return () => {
            state.removeListener("update", updateFun);
        }
    }, [state]);
    return [val, (value: U) => {
        state.val = value;
    }, state];
}
