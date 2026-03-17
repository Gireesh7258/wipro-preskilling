import React, { useState, useContext } from "react";
import { StudentContext } from "../context/StudentContext";
import { addCourse } from "../services/CourseService";
import { v4 as uuid } from "uuid";

function AddCourse() {
  const { dispatch } = useContext(StudentContext);
  const [course, setCourse] = useState({ title: "", duration: "" });

  const handleSubmit = e => {
    e.preventDefault();
    addCourse(dispatch, { ...course, id: uuid() });
    setCourse({ title: "", duration: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Course</h3>
      <input
        placeholder="Title"
        value={course.title}
        onChange={e => setCourse({ ...course, title: e.target.value })}
      />
      <input
        placeholder="Duration"
        value={course.duration}
        onChange={e => setCourse({ ...course, duration: e.target.value })}
      />
      <button>Add</button>
    </form>
  );
}

export default AddCourse;