import React, { useContext } from "react";
import { StudentContext } from "../context/StudentContext";
import { deleteStudent } from "../services/StudentService";
import EnrollCourse from "./EnrollCourse";

function StudentList() {
  const { state, dispatch } = useContext(StudentContext);

  return (
    <div>
      <h3>Students</h3>
      {state.students.map(student => (
        <div key={student.id}>
          <p>
            {student.name} ({student.email})
            <button onClick={() => deleteStudent(dispatch, student.id)}>
              Delete
            </button>
          </p>

          <p>Courses:</p>
          <ul>
            {student.courses?.map(course => (
              <li key={course.id}>{course.title}</li>
            ))}
          </ul>

          <EnrollCourse studentId={student.id} />
        </div>
      ))}
    </div>
  );
}

export default StudentList;