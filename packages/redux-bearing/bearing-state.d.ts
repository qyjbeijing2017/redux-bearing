/// <reference types="node" />
import { AnyAction, Store } from "redux";
import { EventEmitter } from "events";
export declare enum BearingOption {
    UPDATE = 0,
    DELETE = 1
}
export interface BearingAction<T> extends AnyAction {
    pos: string;
    option?: number;
    data: T;
}
export declare class BearingState<T> extends EventEmitter {
    private readonly _pos;
    private readonly _defaultVal;
    private _store;
    protected lastVal: T;
    static fromDefaultVal: <T_1>(defaultVal: T_1) => new (pos?: string) => BearingState<T_1>;
    constructor(pos: string, defaultVal: T);
    get pos(): string;
    get val(): T;
    set val(val: T);
    release: () => void;
    private releaseStore;
    set store(store: Store);
    reducer: (state: T | undefined, action: BearingAction<T>) => T;
    updateAction(val: T): BearingAction<T>;
    update(valLast: T, val?: T): void;
    addListener(eventName: 'update', listener: (val: T) => void): this;
    addListener(eventName: 'delete', listener: () => void): this;
    removeListener(eventName: 'update', listener: (val: T) => void): this;
    removeListener(eventName: 'delete', listener: () => void): this;
}
