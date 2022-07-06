import { useEffect, useState } from 'react';
import { BearingState } from './bearing-state';

export default function useBearing<U, T extends BearingState<U>>(state: T): [U | null, (value: U | null) => void] {
    const [val, setVal] = useState<U | null>(state.val);
    useEffect(() => {
        const updateFun = (val: U) => setVal(val);
        const delFun = () => setVal(null);
        state.addListener("update", updateFun);
        state.addListener("delete", delFun);
        return () => {
            state.removeListener("update", updateFun);
            state.removeListener("delete", delFun);
        }
    }, [state]);
    return [val, (value: U | null) => {
        // state.val = value;
        setVal(value);
    }];
}
