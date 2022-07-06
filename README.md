# redux-bearing



### install

```shell
npm install redux-bearing
# or
yarn add redux-bearing
```



> `redux-bearing` 并没有提供`react`, 记得在工程时先安装`react`
>
> 但是`redux-bearing`集成了 `redux-devtools-extension`，无需重复安装。

### Quick Start



```typescript
/*
    redux-bearing 是一个位于Redux上层的应用库。
    * 它能够有效的节省创建Redux Reducer的时间，并且它保留了创建自定义reducer的能力。
    * 它能够让你在不需要创建Reducer的情况下，创建一个简单的Reducer，并且定义update和delete函数。
    * 它能够在使用时为typescript提供完整的类型检查，这使得它在ide中能够提供传统Redux方案没有的State智能提示。
    * 它能够很好的和传统的Redux应用结合，可以在不改动传统代码结构的同时增量使用它。
    * 它提供了在React下的hooks，这是传统的react-redux所不包含的，这同样能够节省创建mapStateToProps的时间。
    * 它能够很方便的将state分开包装，以保证和上下文解耦。
*/

import { combineReducers } from "redux";
import Bearing from "./bearing";
import { BearingState } from "./bearing-state";

// --------- 生成一个传统的Reducer ----------
// 这个Reducer将所有传统redux状态都设置成一个值

const baseReducer = <T>(state: T, action: {
    type: 'upload' | 'delete',
    payload?: string
}) => {
    switch (action.type) {
        case 'upload':
            return action.payload;
        case 'delete':
            return null;
        default:
            return state;
    }
}

const reducer1 = (state: string = '', action: any) => {
    return baseReducer(state, action);
}

const reducer2 = (state: string = '', action: any) => {
    return baseReducer(state, action);
}

const reducer3 = (state: string = '', action: any) => {
    return baseReducer(state, action);
}

// ---------- 传统的Action ----------
// 这个action 将所有的传统redux生成的状态都设置成 hello
export const testAction = () => {
    console.log(`testAction`);
    return {
        type: 'upload',
        payload: 'hello'
    };
}

// ---------- 创建一个自定义的bearing状态 ----------
// 自定义的bearing状态从BearingState<T>继承，这个值的类型是T。

class TestBearingState extends BearingState<number> {
    // pos是这个值的位置信息，由Bearing生成，必须将它传递给BearingState，否则BearingState将在state中丢失它的位置。
    constructor(pos?: string) {
        // 第二个参数是这个值的默认值。
        super(pos, -1);
    }

    // 我们可以在这个值更新时做些事情，如果没有重写reducer，Bearing将会自动调用它。
    update(payload: number) {
        console.log(`onTestBearingStateUpdate`);
        // 比如将它记录到localStorage中
        // localStorage.setItem('testBearingState', JSON.stringify(payload));
    }

    // 我们也可以在这个值删除时做些事情，如果没有重写reducer，Bearing将会自动调用它。
    delete() {
        // 比如将它从localStorage中删除
        // localStorage.removeItem('testBearingState');
    }

    // 在这里重写reducer函数，用于自定义reducer。
    // 这里我们将所有进来的值都设置成-1，这将改变之前设置的默认值，同时由于值相等，所以Bearing不会触发update事件。
    reducer = (state: number | null = 1, action: any) => {
        // 不要忘记呼叫update、delete函数，否则Bearing将无法自动调用它们。
        this.update(-1);
        // this.delete(state);
        return -1;
    }
}


// ---------- 创建一个Bearing ----------
// Bearing创建时，将会按照第一个参数传递的参数列表自动生成整个状态树，并且生成对应的映射树。
// 

const bearing = new Bearing({
    // 你可以直接传入一个基本的BearingState<T>的类型，这样Bearing将会自动生成一个对应T的状态。
    bearingVal1: BearingState<string>,
    bearingVal2: BearingState<string>,
    // Bearing同样支持树结构的状态，虽然不推荐这样做，但是为了兼容之前的Redux树，或者为了其他什么事情，我们还是提供了这样的方式。
    bearingVal3: {
        bearingVal31: BearingState<number>,
        bearingVal32: BearingState<string>,
        // 你也可以自定义一个BearingState的类型，创建方法就如同上面TestBearingState创建方法一样。
        testStateVal: TestBearingState,
    },
    // 当然Bearing是可以通过它的方式去操作传统Redux定义的状态的，这与react-redux也是同样兼容的。
    val1: BearingState<string>,
    val2: {
        val21: BearingState<string>,
        val22: BearingState<string>,
    },

},
    // 第二个参数可以填入之前工程设定的reducer，这将让Bearing和传统的Redux还有其他框架一起工作，当然如果你不想要这个功能，或者这是一个新的工程，这个参数可以不填。
    combineReducers({
        val1: reducer1,
        val2: combineReducers({
            val21: reducer2,
            val22: reducer3
        })
    })
);

// 可以通过bearing.storeStates获取当前的状态树，除非用于输出，否则不推荐这么使用。因为这回绕开类型检查，它将返回一个any类型的对象。
console.log(bearing.storeStates);

// 这时生成的state如下
// {
//   bearingVal1: null,
//   bearingVal2: null,
//   bearingVal3: { bearingVal31: null, bearingVal32: null, testStateVal: -1 },
//   val1: null,
//   val2: { val21: null, val22: null }
// }


// 使用Bearing也可以拿到Redux的store，这样就可以让Bearing和Redux一起工作了。
const store = bearing.store;

// 传统的redux事件注册
store.subscribe(() => {
    console.log(`---------------- store.getState() ----------------`);
    console.log(store.getState())
});

// 传统的redux事件。
store.dispatch(testAction());

// 这时生成的state如下
// {
//   bearingVal1: null,
//   bearingVal2: null,
//   bearingVal3: { bearingVal31: null, bearingVal32: null, testStateVal: -1 },
//   val1: 'hello',
//   val2: { val21: 'hello', val22: 'hello' }
// }


// 通过bearing.states获取映射类，映射类并不会对store做任何的入侵，它只是对状态树节点的访问。
// 通过映射类，我们可以拿到整颗树的结构，并且可以对状态进行操作。
const val21 = bearing.states.val2.val21;

// 注册监听当前节点状态的变化，这里只会监听这个节点的变化数值。
val21.addListener('update', (val) => {
    console.log(`----------------- val21.update ----------------`);
    console.log(`val21` + val);
    console.log(bearing.storeStates);
});

// 更新当前节点状态
val21.val = 'helloBearing';

// 这时生成的state如下
// {
//   bearingVal1: null,
//   bearingVal2: null,
//   bearingVal3: { bearingVal31: null, bearingVal32: null, testStateVal: -1 },
//   val1: 'hello',
//   val2: { val21: 'helloBearing', val22: 'hello' }
// }

// 同时store.subscribe也触发了，但是并不会触发之前的reducer，因为Bearing只会使用 名为BearingAction的type类型，在传统的Reducer中请注意避开这个type。

// 下面是对Bearing生成节点的操作
const bearingVal32 = bearing.states.bearingVal3.bearingVal32;
bearingVal32.addListener('update', (val) => {
    console.log(`----------------- bearingVal32.update ----------------`);
    console.log(`bearingVal32 ` + val);
    console.log(bearing.storeStates);
});

bearingVal32.val = '123';

// 这时生成的state如下
// {
//   bearingVal1: null,
//   bearingVal2: null,
//   bearingVal3: { bearingVal31: null, bearingVal32: '123', testStateVal: -1 },
//   val1: 'hello',
//   val2: { val21: 'helloBearing', val22: 'hello' }
// }

// 下面是对自定义节点的操作
const testVal = bearing.states.bearingVal3.testStateVal;
testVal.addListener('update', (val) => {
    console.log(`----------------- testVal.update ----------------`);
    console.log(`testVal` + val);
    console.log(bearing.storeStates);
});

testVal.val = 3;

// 注意，这里不会触发update事件，因为在自定义reducer中，我们没有去实际改变状态树的值，Bearing会使用===对比他们，以便于针对性的处理某个状态值。
// 但是同样的===会对类似Object.assign({},state)的情况有效，因为它并会返回一个新的对象，这和React的state是一样的。

```

