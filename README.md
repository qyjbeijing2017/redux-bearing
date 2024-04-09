# redux-bearing



### install

##### npm

```shell
# For Node.js
npm install redux-bearing

# For browser
npm install events redux-bearing
```

##### yarn

```shell
# For Node.js
yarn add redux-bearing

# For browser
yarn add events redux-bearing
```



### Quick Start

1. **Create a Bearing**

```javascript
// bearing.js
import Bearing, { BearingState } from 'redux-bearing';

// Create properties with default values using BearingState.fromDefaultVal
export const bearing = new Bearing({
    num: BearingState.fromDefaultVal(0),
    str: BearingState.fromDefaultVal('test bearing'),
    sub: {
        num: BearingState.fromDefaultVal(1),
        str: BearingState.fromDefaultVal('sub bearing'),
    }
});
// Export states
export const states = bearing.states;


```

2. Update value

```javascript
console.log(states.num.val) // 0
console.log(states.sub.num.val) // 1

// update num
states.num.val = 3;
console.log(states.num.val) // 3

states.sub.num.val = 4
console.log(states.sub.num.val) //4
```

3. React Hook

```javascript
import { useBearing } from 'redux-bearing';
import { states } from "./bearing";

// React Component
export function BearingComponent() {
    // Hooks for bearing
    const [num, setNum] = useBearing(states.num);
    
    return <button onClick={() => {
        setNum(num + 1);
    }}>{num}</button>
}
```

