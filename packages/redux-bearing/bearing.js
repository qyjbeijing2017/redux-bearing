"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combinedReducer2SamePoint = void 0;
const redux_1 = require("redux");
const bearing_state_1 = require("./bearing-state");
const redux_devtools_extension_1 = require("redux-devtools-extension");
const combinedReducer2SamePoint = (reducers) => {
    return (state, action) => {
        let stateNew = state;
        for (const reducer of reducers) {
            if (reducer)
                stateNew = Object.assign(Object.assign({}, stateNew), reducer(stateNew, action));
        }
        return stateNew;
    };
};
exports.combinedReducer2SamePoint = combinedReducer2SamePoint;
class Bearing {
    constructor(startType, options) {
        var _a;
        this.release = () => { this.foreachStates(this._states, state => state.release()); };
        this._states = this.createStates(startType);
        const myReducer = this.createReducer(this._states);
        this._store = (0, redux_1.createStore)((0, exports.combinedReducer2SamePoint)([myReducer, options === null || options === void 0 ? void 0 : options.reducer]), (_a = options === null || options === void 0 ? void 0 : options.enhancer) !== null && _a !== void 0 ? _a : (0, redux_devtools_extension_1.composeWithDevTools)());
        this.foreachStates(this._states, (state) => state.store = this._store);
    }
    get store() {
        return this._store;
    }
    get states() {
        return this._states;
    }
    get storeStates() {
        return this.store.getState();
    }
    createReducer(states) {
        const reducer = {};
        for (const key in states) {
            if (states.hasOwnProperty(key)) {
                const state = states[key];
                if (state instanceof bearing_state_1.BearingState) {
                    reducer[key] = state.reducer;
                }
                else {
                    reducer[key] = this.createReducer(state);
                }
            }
        }
        return (0, redux_1.combineReducers)(reducer);
    }
    createStates(startType, key) {
        const states = {};
        const currentKey = key || '';
        for (const key in startType) {
            if (startType.hasOwnProperty(key)) {
                const state = startType[key];
                if (typeof state === 'object') {
                    states[key] = this.createStates(state, currentKey + '.' + key);
                }
                else {
                    states[key] = new state(currentKey + '.' + key);
                }
            }
        }
        return states;
    }
    foreachStates(bstate, callback) {
        for (const key in bstate) {
            const state = bstate[key];
            if (state instanceof bearing_state_1.BearingState) {
                callback(state);
            }
            else {
                this.foreachStates(state, callback);
            }
        }
    }
}
exports.default = Bearing;
//# sourceMappingURL=bearing.js.map