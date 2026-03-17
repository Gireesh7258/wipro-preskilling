import React, { useContext } from "react";
import { StudentContext } from "../context/StudentContext";
import { enrollCourse } from "../services/CourseService";

function EnrollCourse({ studentId }) {
  const { state, dispatch } = useContext(StudentContext);

  return (
    <select
      onChange={e => {
        const course = state.courses.find(c => c.id === e.target.value);
        if (course) enrollCourse(dispatch, studentId, course);
      }}
    >
      <option>Select Course</option>
      {state.courses.map(course => (
        <option key={course.id} value={course.id}>
          {course.title}
        </option>
      ))}
    </select>
  );
}

export default EnrollCourse;