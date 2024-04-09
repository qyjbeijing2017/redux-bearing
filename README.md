# redux-bearing

Redux Bearing is designed to simplify the use of Redux with React hooks. It can also be used without hooks, offering flexibility in state management within React applications.

### Installation

#### npm

For Node.js environments:

```shell
npm install redux-bearing
```

For browser environments, include `events`:

```shell
npm install events redux-bearing
```

#### yarn

For Node.js environments:

```shell
yarn add redux-bearing
```

For browser environments, include `events`:

```shell
yarn add events redux-bearing
```

### Quick Start

1. **Create a Bearing**

   Initialize your state with default values using `BearingState.fromDefaultVal`.

```javascript
// bearing.js
import Bearing, { BearingState } from 'redux-bearing';

// Create properties with default values
export const bearing = new Bearing({
    num: BearingState.fromDefaultVal(0),
    str: BearingState.fromDefaultVal('test bearing'),
    sub: {
        num: BearingState.fromDefaultVal(1),
        str: BearingState.fromDefaultVal('sub bearing'),
    }
});
// Export states for external use
export const states = bearing.states;
```

1. **Update Values**

   Demonstrates how to update and log state values.

```javascript
console.log(states.num.val); // Initial value: 0
console.log(states.sub.num.val); // Initial value: 1

// Update 'num' state value
states.num.val = 3;
console.log(states.num.val); // Updated value: 3

// Update 'sub.num' state value
states.sub.num.val = 4;
console.log(states.sub.num.val); // Updated value: 4
```

1. **Using the React Hook**

   Shows how to use the `useBearing` hook within a React component to interact with the state.

```javascript
import { useBearing } from 'redux-bearing';
import { states } from "./bearing";

// React Component
export function BearingComponent() {
    // Utilize hooks for state management
    const [num, setNum] = useBearing(states.num);
    
    return (
        <button onClick={() => setNum(num + 1)}>
            {num}
        </button>
    );
}
```