import Login from "./Login"



function App() {
  
const x=2;
const student={rollno:1,name:"Sai",password:"1234"};
const p=100;
const r=20;
const t=6;
const SI=(p*t*r)/100;



  return (
  
      <div>
       
       
        <p> {x} is {(x%2==0 ? "even" : "odd")} number</p>
        <p>rollno:{student.rollno}</p>
        <p>name:{student.name}</p>
        <p>password:{student.password}</p>
        <p> Simple interest:{SI}</p>
     
      <Login/>
       </div>
        
  
  )
}

export default App
