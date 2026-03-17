import React from "react";

function Greeting({ person }) {
  return (
    <>
      <h1>Welcome to Greeting Component!</h1>
      <p>Name: {person.name}</p>
      <p>Occupation: {person.occupation}</p>
    </>
  );
}

export default Greeting;