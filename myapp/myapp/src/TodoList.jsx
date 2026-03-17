import axios from "axios";
import { useEffect, useState } from "react";
function TodoList() {
  const [Products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8082/product/all")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log("error is due to :", error);
      });
  }, []);
  return (
    <div>
      <h3>Fetching the data from the todo database file....</h3>{" "}
      <ul>
        {" "}
        {Products.map((obj) => (
          <li>
            {" "}
            {obj.name} - {obj.description} 
          </li>
        ))}
        
        {" "}
      </ul>
      
    </div>
  );
}
export default TodoList;
