import { BearingState } from './bearing-state';
export default function useBearing<U>(state: BearingState<U>): [U, (value: U) => void, BearingState<U>];
