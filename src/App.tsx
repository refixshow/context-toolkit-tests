import React from 'react';
import {Provider, useCtx} from './store' 

// użycie
function Inner(){
  const {state, actions} = useCtx()
  
  return <div>
    <small>{JSON.stringify(state)}</small>
    <button 
    disabled={state.imBusy}
    onClick={()=>{
    actions.changeValue({
      user:{
        name:`${Math.random()}`
      }
    })
    }}>changeState</button>
  </div>
}

function App() {
  return (
    <Provider>
      <div className="App">
        <Inner/>
      </div>
    </Provider>
  );
}

export default App;
