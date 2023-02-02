import { AnyAction, Store } from "redux";
import { EventEmitter } from "events";

export enum BearingOption {
    UPDATE,
    DELETE,
}

export interface BearingAction<T> extends AnyAction {
    pos: string,
    option?: number,
    data?: T,
}

export class BearingState<T> extends EventEmitter {
    private readonly _pos = this.constructor.name;
    private readonly _defaultVal: T | null = null;

    private _store: Store | null = null;

    protected lastVal = this._defaultVal;

    static fromDefaultVal = <T>(defaultVal: T) => {
        return class extends BearingState<T> {
            constructor(pos?: string) {
                super(pos, defaultVal);
            }
        } as { new(pos?: string): BearingState<T> };
    }

    constructor(pos?: string, defaultVal?: T) {
        super();
        if (pos) this._pos = pos;
        if (defaultVal) {
            this._defaultVal = defaultVal;
            this.lastVal = defaultVal;
        }
    }



    get pos() {
        return this._pos;
    }

    get val(): T | null {
        if (!this._store)
            return null;
        const positions = this.pos.split('.');
        positions.shift();
        let state = this._store.getState();
        for (let i = 0; i < positions.length; i++) {
            state = state[positions[i]];
        }
        return state;
    }

    set val(val: T | null) {
        if (this._store) {
            if (val) {
                this._store.dispatch(this.updateAction(val));
            } else {
                this._store.dispatch(this.delAction());
            }
        }
    }

    release = () => {
        this.releaseStore();
    }

    private releaseStore = () => { };

    set store(store: Store) {
        this._store = store;
        this.releaseStore = this._store.subscribe(() => {
            if (this.val !== this.lastVal) {
                this.lastVal = this.val;
                if (this.val)
                    this.emit('update', this.val);
                else
                    this.emit('delete');
            }
        });
    }


    reducer = (state: T | null = this._defaultVal, action: BearingAction<T>): T | null => {
        if (action.pos !== this._pos) return state;
        switch (action.option as BearingOption) {
            case BearingOption.UPDATE:
                this.update(state, action.data);
                return action.data || null;
            case BearingOption.DELETE:
                this.delete(state);
                return null;
            default:
                return state;
        }
    }

    updateAction(val: T): BearingAction<T> {
        return {
            type: 'BearingAction',
            pos: this._pos,
            option: BearingOption.UPDATE,
            data: val,
        }
    }

    delAction(): BearingAction<T> {
        return {
            type: 'BearingAction',
            pos: this._pos,
            option: BearingOption.DELETE,
        }
    }

    update(valLast: T | null, val?: T) {

    }

    delete(valLast: T | null) {

    }

    addListener(eventName: 'update', listener: (val: T) => void): this;
    addListener(eventName: 'delete', listener: () => void): this;
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return super.addListener(eventName, listener);
    }

    removeListener(eventName: 'update', listener: (val: T) => void): this;
    removeListener(eventName: 'delete', listener: () => void): this;
    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return super.removeListener(eventName, listener);
    }
}
