function Student() {

const student1={name:'Sai',rollno:1,marks:300};
const student2={name:'Ram',rollno:2,marks:400};
const student3={name:'Shiva',rollno:3,marks:370};
const students=[student1,student2,student3];

  return (
    <>
      <div>
      <h1>Student data</h1>
<table>
<tr>
    <th>Name</th>
    <th>Percentage(%)</th>

</tr>
{students.map((x)=><tr>
    <td>{x.name}</td>
   <td>{(x.marks/500)*100}</td></tr>
)}
</table>
      </div>
    </>
  )
}

export default Student