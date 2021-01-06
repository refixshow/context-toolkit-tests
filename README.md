# Getting Started with `react-context-toolkit`

This lib converts standard React Context Api into redux-toolkit styled abstract wrapper served by hook. To get rid of some boilerplate code. We use this code in small and medium sized projects with success. Feel free to change

## You only need to handle 4 things to prepare ready-to-use react-context-toolkit Store:

#### 1. State
```javascript
// your state
const initialState: IExampleState = {
  imBusy: true,
  user: {
    name: ''
  }
// ...
}
```

#### 2. Reducer actions
```javascript
// your actions
const reducerActions: GenericActionsPattern<IExampleState> = {
    changeValue(state, { payload }) {
        return {
            ...state,
            ...payload
        }
    },
    loaded(state) {
        // to conditionally prevent rerender if not necessary to flow
        if (!state.imBusy) {
            return state
        }

        return {
            ...state,
            imBusy: false
        }
    }
// ...
}
```


#### 3. (optional) on App load logic - onLoad Function
```javascript
// your onLoad function
const onLoad: onLoadFunction = async (contextActions) => {
  try {

    // fetch some data here
    const data = await doSomeFetch()

    // change your store by action here
    contextActions.changeValue({ imBusy: false, ...data })

    // or do nothing
  } catch (error) {
    contextActions.changeValue({
      imBusy: false, error: {
        message: error.message
      }
    })
    throw new Error('onLoad - appStoreCtx ' + error.message)
  }
}
```

#### 4. Builder function for create provider and hook
```javascript
// your store file
import makeContextStore from '../lib'

const {
    Provider, useCtx
} = makeContextStore('ExampleStore', initialState, reducerActions, onLoad)

const ExampleProvider = Provider
const useExampleCtx = useCtx

export {
    ExampleProvider, useExampleCtx
}
```

## You have only 2 steps to implement:
#### 1. Implement Provider
```javascript
// your example context hook provider
import { ExampleProvider } from './store' 

function App() {
  return (
    <ExampleProvider>
      <div className="App">
        <Inner />
        {/* some components */}
      </div>
    </ExampleProvider>
  );
}
```

#### 2. Implement hook
```javascript
// your example context hook
import { useExampleCtx } from './store' 

function Inner(){
  const { state, actions } = useExampleCtx()
  
  return <div>
    <small>{JSON.stringify(state)}</small>
    <button 
    disabled={state.imBusy}
    onClick={()=>{
        actions.changeValue({
            user: {
                name: `${Math.random()}`
            }
        })
    }}>changeState</button>
  </div>
}
```


## To see source code (+/- 150 lines):
```javascript
// src/lib/creator
// src/lib/types.d
```


## Todos:
```javascript
// - automatic tests for use cases
// - better TS support
```