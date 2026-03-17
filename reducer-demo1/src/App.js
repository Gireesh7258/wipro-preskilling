import React, { useReducer } from "react";

// 1. Initial State: Starting as OFF (false)
const initialState = { isOn: false };

// 2. Reducer Function: Toggles the boolean value
function reducer(state, action) {
  switch (action.type) {
    case "toggle":
      return { isOn: !state.isOn };
    default:
      return state;
  }
}

function App() {
  // 3. useReducer Hook
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Status: {state.isOn ? "ON" : "OFF"}</h2>
      <button onClick={() => dispatch({ type: "toggle" })}>
        Toggle Switch
      </button>
    </div>
  );
}

export default App;