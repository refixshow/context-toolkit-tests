import React from 'react';
import { ExampleProvider, useExampleCtx } from './store' 

// use hook
function Inner(){
  const {state, actions} = useExampleCtx()
  
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


// use provider
function App() {
  return (
    <ExampleProvider>
      <div className="App">
        <Inner/>
      </div>
    </ExampleProvider>
  );
}

export default App;
