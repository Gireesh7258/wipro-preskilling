import React from "react";
import UserContext from "./UserContext";
import Parent from "./Parent";

function App() {
  const username = "Gireesh"; // This data is now available to all children

  return (
    <UserContext.Provider value={username}>
      <div style={{ textAlign: "center", border: "2px solid blue", padding: "20px" }}>
        <h1>App Component (The Provider)</h1>
        <Parent />
      </div>
    </UserContext.Provider>
  );
}

export default App;