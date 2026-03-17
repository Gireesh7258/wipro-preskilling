import axios from "axios";
import { useEffect, useState } from "react";

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/todos")
      .then((response) => setTodos(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <h3>Fetching the data from the todo database file...</h3>
      <ul>
        {todos.map((obj) => (
          <li key={obj.id}>
            {obj.title} - {obj.description} ({obj.createdAt})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;