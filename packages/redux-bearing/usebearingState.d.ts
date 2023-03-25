import { BearingState } from './bearing-state';
export default function useBearingState<T extends BearingState<any>>(state: T): T;
