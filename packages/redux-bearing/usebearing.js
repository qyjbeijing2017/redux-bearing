"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useBearing(state) {
    const [val, setVal] = (0, react_1.useState)(state.val);
    (0, react_1.useEffect)(() => {
        const updateFun = (val) => setVal(val);
        state.addListener("update", updateFun);
        return () => {
            state.removeListener("update", updateFun);
        };
    }, [state]);
    return [val, (value) => {
            state.val = value;
        }, state];
}
exports.default = useBearing;
//# sourceMappingURL=usebearing.js.map