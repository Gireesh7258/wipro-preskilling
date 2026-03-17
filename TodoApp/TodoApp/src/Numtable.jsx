function Numtable(){
    const num=2;
    const rows=[];
    for(let i=1;i<=10;i++){
        rows.push(
      <li key={i}>
        {num}*{i}= {num*i}
      </li>)}
    
    return(
        <div>
<h1>table of {num}</h1>
     <ul>
        {rows}
      </ul>
        </div>
    )
}
export default Numtable