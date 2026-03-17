import React, { useRef, useEffect } from "react";
function FocusInput() {
  const usernameRef = useRef(null);
//   const focusInput = (e) => {
//     e.preventDefault();
//     usernameRef.current.focus();
    useEffect(() => {
    // runs once when component loads
    usernameRef.current.focus();
  }, []);
  
  return (
    <div>
        <form>
            <h1>Login form</h1>
            

      <input ref={usernameRef} type="text"  placeholder="enter username"/>
       <input type="text" placeholder="enter password" />
      {/* <button onClick={focusInput}>Login</button> */}
      <button type ="submit">Login</button>
      </form>
    </div>
       
  );
}
export default FocusInput;