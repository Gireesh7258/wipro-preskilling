import React, { useContext } from "react";
import UserContext from "./UserContext";

function Child() {
  // Directly grab the username from the "warehouse" (Context)
  const username = useContext(UserContext);

  return (
    <div style={{ border: "2px solid red", padding: "10px" }}>
      <h3>Child Component (The Consumer)</h3>
      <h4 style={{ color: "darkorange" }}>Hello {username} 👋</h4>
    </div>
  );
}

export default Child;