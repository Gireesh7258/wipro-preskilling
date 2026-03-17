import React from "react";
import { StudentProvider } from "./context/StudentContext";
import AddStudent from "./components/AddStudent";
import AddCourse from "./components/AddCourse";
import CourseList from "./components/CourseList";
import StudentList from "./components/StudentList";

function App() {
  return (
    <StudentProvider>
      <div style={{ padding: "20px" }}>
        <h2>Student & Course Management</h2>

        <AddStudent />
        <AddCourse />

        <CourseList />
        <StudentList />
      </div>
    </StudentProvider>
  );
}

export default App;