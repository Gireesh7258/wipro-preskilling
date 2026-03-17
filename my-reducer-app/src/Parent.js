import React from "react";
import Child from "./Child";

function Parent() {
  return (
    <div style={{ border: "2px solid green", margin: "20px", padding: "10px" }}>
      <h2>Parent Component</h2>
      <p>I am a middleman. I don't touch the username!</p>
      <Child />
    </div>
  );
}

export default Parent;