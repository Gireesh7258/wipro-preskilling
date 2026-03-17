import React from "react";
import AddProduct from "./AddProduct";
import Greeting from "./Greeting";
// import AddProduct from "./AddProduct"; // Remove if not used

function GreetingWithBorders(WrappedComponent) {
  return function NewComponent(props) {
    return (
      <div style={{ border: "2px solid blue", padding: "10px" }}>
        <WrappedComponent {...props} />
        <p>Extra content is added in the greeting component!!!</p>
      </div>
    );
  };
}

const MyHoc = GreetingWithBorders(Greeting);

export default MyHoc;