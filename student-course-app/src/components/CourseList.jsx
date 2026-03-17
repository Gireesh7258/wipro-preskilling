import React, { useContext } from "react";
import { StudentContext } from "../context/StudentContext";
import { deleteCourse } from "../services/CourseService";

function CourseList() {
  const { state, dispatch } = useContext(StudentContext);

  return (
    <div>
      <h3>Courses</h3>

      {state.courses.length === 0 && <p>No courses added yet</p>}

      {state.courses.map(course => (
        <div key={course.id} style={{ marginBottom: "8px" }}>
          <strong>{course.title}</strong> ({course.duration})
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => deleteCourse(dispatch, course.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default CourseList;