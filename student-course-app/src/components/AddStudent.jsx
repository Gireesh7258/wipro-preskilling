import React, { useState, useContext } from "react";
import { StudentContext } from "../context/StudentContext";
import { addStudent } from "../services/StudentService";
import { v4 as uuid } from "uuid";

function AddStudent() {
  const { dispatch } = useContext(StudentContext);
  const [student, setStudent] = useState({ name: "", email: "" });

  const handleSubmit = e => {
    e.preventDefault();
    addStudent(dispatch, { ...student, id: uuid(), courses: [] });
    setStudent({ name: "", email: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Student</h3>
      <input
        placeholder="Name"
        value={student.name}
        onChange={e => setStudent({ ...student, name: e.target.value })}
      />
      <input
        placeholder="Email"
        value={student.email}
        onChange={e => setStudent({ ...student, email: e.target.value })}
      />
      <button>Add</button>
    </form>
  );
}

export default AddStudent;