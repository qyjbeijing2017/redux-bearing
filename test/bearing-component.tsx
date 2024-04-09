import useBearing from "../src/usebearing";
import { states } from "./bearing";

export function BearingComponent() {
    const [num, setNum] = useBearing(states.num);
    return <button onClick={() => {
        setNum(num + 1);
    }}>{num}</button>
}