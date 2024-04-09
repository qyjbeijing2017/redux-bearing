import { useEffect, useState } from 'react';
import { BearingState } from './bearing-state';

export default function useBearingState<T extends BearingState<any>>(state: T): T {
    const [val, setVal] = useState<T>(state.val);
    useEffect(() => {
        const updateFun = (val: T) => setVal(val);
        state.addListener("update", updateFun);
        return () => {
            state.removeListener("update", updateFun);
        }
    }, [state]);
    return state;
}
