import React, { useRef } from "react";
function Demo() {
  const counterRef = useRef(1);
  const increment = () => {
    counterRef.current.value++;
    counterRef.current.style.color = "red";
    counterRef.current.style.background = "blue";
    console.log(counterRef.current.value);
  };
  const decrement = () => {
    counterRef.current.style.width = "400px";
    counterRef.current.value = counterRef.current.value - 1;
    console.log(counterRef.current.value);
  };
  return (
    <div>
      <h1>Counter usinf UseRef Hook</h1>
      <input type="number" ref={counterRef} />{" "}
      <button onClick={increment}>Increment</button>{" "}
      <button onClick={decrement}>Decrement</button>{" "}
    </div>
  );
}
export default Demo;
