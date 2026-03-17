
function Numarray() {

    const arr=[3,4,5,6,9,10,20];


  return (
    <>
      <div>
        <h1>Even numbers</h1>
        <ul>
        {arr.map((x, index) => {
          if (x % 2 === 0) {
            return <li key={index}>{x}</li>;
          } else {
            return null;   
          }
        })}
      </ul>
        
      </div>
    </>
  )
}

export default Numarray
