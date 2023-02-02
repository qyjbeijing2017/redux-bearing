import { combineReducers, createStore, Reducer, Store } from "redux";
import { BearingState } from "./bearing-state";
import { composeWithDevTools } from 'redux-devtools-extension'

interface BreaingStartOption {
    [key: string]: BreaingStartOption | { new(pos: string): BearingStates<any> };
}

type BearingStates<T extends BreaingStartOption> = {
    [P in keyof T]: T[P] extends { new(pos?: string): any } ? InstanceType<T[P]> : T[P] extends BreaingStartOption ? BearingStates<T[P]> : null;
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

export default class Bearing<T extends BreaingStartOption> {
    private readonly _store: Store;
    private readonly _states: BearingStates<T>
    constructor(startType: T, reducer?: Reducer) {
        this._states = this.createStates(startType);
        const myReducer = this.reducer(this._states);
        this._store = createStore(combinedReducer2SamePoint([myReducer as any, reducer]), composeWithDevTools());
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

    reducer(states: BearingStates<any>) {
        const reducer: any = {};
        for (const key in states) {
            if (states.hasOwnProperty(key)) {
                const state = states[key];
                if (state instanceof BearingState) {
                    reducer[key] = state.reducer;
                } else {
                    reducer[key] = this.reducer(state);
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

