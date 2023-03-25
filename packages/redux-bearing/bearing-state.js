"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearingState = exports.BearingOption = void 0;
const events_1 = require("events");
var BearingOption;
(function (BearingOption) {
    BearingOption[BearingOption["UPDATE"] = 0] = "UPDATE";
    BearingOption[BearingOption["DELETE"] = 1] = "DELETE";
})(BearingOption = exports.BearingOption || (exports.BearingOption = {}));
class BearingState extends events_1.EventEmitter {
    constructor(pos, defaultVal) {
        super();
        this._pos = this.constructor.name;
        this._store = null;
        this.release = () => {
            this.releaseStore();
        };
        this.releaseStore = () => { };
        this.reducer = (state = this._defaultVal, action) => {
            if (action.pos !== this._pos)
                return state;
            switch (action.option) {
                case BearingOption.UPDATE:
                    this.update(state, action.data);
                    return action.data;
                default:
                    return state;
            }
        };
        if (pos)
            this._pos = pos;
        this._defaultVal = defaultVal;
        this.lastVal = defaultVal;
    }
    get pos() {
        return this._pos;
    }
    get val() {
        const positions = this.pos.split('.');
        positions.shift();
        if (!this._store) {
            throw new Error(`the store of ${this.pos} is not set, please init state with bearing first!`);
        }
        let state = this._store.getState();
        for (let i = 0; i < positions.length; i++) {
            state = state[positions[i]];
        }
        return state;
    }
    set val(val) {
        if (!this._store) {
            throw new Error(`the store of ${this.pos} is not set, please init state with bearing first!`);
        }
        this._store.dispatch(this.updateAction(val));
    }
    set store(store) {
        this._store = store;
        this.releaseStore = this._store.subscribe(() => {
            if (this.val !== this.lastVal) {
                this.lastVal = this.val;
                this.emit('update', this.val);
            }
        });
    }
    updateAction(val) {
        return {
            type: 'BearingAction',
            pos: this._pos,
            option: BearingOption.UPDATE,
            data: val,
        };
    }
    update(valLast, val) {
    }
    addListener(eventName, listener) {
        return super.addListener(eventName, listener);
    }
    removeListener(eventName, listener) {
        return super.removeListener(eventName, listener);
    }
}
exports.BearingState = BearingState;
BearingState.fromDefaultVal = (defaultVal) => {
    return class extends BearingState {
        constructor(pos) {
            super(pos, defaultVal);
        }
    };
};
//# sourceMappingURL=bearing-state.js.map