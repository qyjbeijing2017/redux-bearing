import { AnyAction, Reducer, Store, StoreEnhancer } from "redux";
import { BearingState } from "./bearing-state";
interface BreaingStartOption {
    [key: string]: BreaingStartOption | {
        new (pos: string): BearingStates<any>;
    };
}
declare type BearingStates<T extends BreaingStartOption> = {
    [P in keyof T]: T[P] extends {
        new (pos: string): any;
    } ? InstanceType<T[P]> : T[P] extends BreaingStartOption ? BearingStates<T[P]> : T[P];
};
export declare const combinedReducer2SamePoint: (reducers: (Reducer | undefined)[]) => (state: any, action: any) => any;
export interface BearingOptions {
    reducer: Reducer;
    enhancer: StoreEnhancer<Store<any, AnyAction>>;
}
export default class Bearing<T extends BreaingStartOption> {
    private readonly _store;
    private readonly _states;
    constructor(startType: T, options?: Partial<BearingOptions>);
    get store(): Store<any, AnyAction>;
    get states(): BearingStates<T>;
    get storeStates(): any;
    release: () => void;
    createReducer(states: BearingStates<any>): Reducer<import("redux").CombinedState<{
        [x: string]: unknown;
    }>, never>;
    createStates<T extends BreaingStartOption>(startType: T, key?: string): BearingStates<T>;
    foreachStates(bstate: BearingStates<any>, callback: (state: BearingState<any>) => void): void;
}
export {};
