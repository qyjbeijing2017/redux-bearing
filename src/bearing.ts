import { AnyAction, combineReducers, createStore, Reducer, Store, StoreEnhancer } from "redux";
import { BearingState } from "./bearing-state";
import { composeWithDevTools } from 'redux-devtools-extension'

interface BreaingStartOption {
    [key: string]: BreaingStartOption | { new(pos: string): BearingStates<any> };
}

type BearingStates<T extends BreaingStartOption> = {
    [P in keyof T]: T[P] extends { new(pos: string): any } ? InstanceType<T[P]> : T[P] extends BreaingStartOption ? BearingStates<T[P]> : T[P];
}

export const combinedReducer2SamePoint = (reducers: (Reducer | undefined)[]) => {
    return (state: any, action: any) => {
        let stateNew = state;
        for (const reducer of reducers) {
            if (reducer)
                stateNew = { ...stateNew, ...reducer(stateNew, action) };
        }
        return stateNew;
    }
}

export interface BearingOptions {
    reducer: Reducer;
    enhancer: StoreEnhancer<Store<any, AnyAction>>
}

export default class Bearing<T extends BreaingStartOption> {
    private readonly _store: Store;
    private readonly _states: BearingStates<T>
    constructor(startType: T, options?: Partial<BearingOptions>) {
        this._states = this.createStates(startType);
        const myReducer = this.createReducer(this._states);
        this._store = createStore(combinedReducer2SamePoint([myReducer as any, options?.reducer]), options?.enhancer ?? composeWithDevTools());
        this.foreachStates(this._states, (state) => state.store = this._store);
    }

    get store() {
        return this._store;
    }

    get states(): BearingStates<T> {
        return this._states;
    }

    get storeStates(){
        return this.store.getState();
    }

    release = () => { this.foreachStates(this._states, state => state.release()) }

    createReducer(states: BearingStates<any>) {
        const reducer: any = {};
        for (const key in states) {
            if (states.hasOwnProperty(key)) {
                const state = states[key];
                if (state instanceof BearingState) {
                    reducer[key] = state.reducer;
                } else {
                    reducer[key] = this.createReducer(state);
                }
            }
        }
        return combineReducers(reducer);
    }


    createStates<T extends BreaingStartOption>(startType: T, key?: string): BearingStates<T> {
        const states: any = {};
        const currentKey = key || '';
        for (const key in startType) {
            if (startType.hasOwnProperty(key)) {
                const state = startType[key];
                if (typeof state === 'object') {
                    states[key] = this.createStates(state, currentKey + '.' + key);
                } else {
                    states[key] = new (state as any)(currentKey + '.' + key);
                }
            }
        }
        return states;
    }

    foreachStates(bstate: BearingStates<any>, callback: (state: BearingState<any>) => void) {
        for (const key in bstate) {
            const state = bstate[key];
            if (state instanceof BearingState) {
                callback(state);
            } else {
                this.foreachStates(state as BearingStates<any>, callback);
            }
        }
    }
}

