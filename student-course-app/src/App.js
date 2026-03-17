import React from "react";
import { StudentProvider } from "./context/StudentContext";
import AddStudent from "./components/AddStudent";
import AddCourse from "./components/AddCourse";
import StudentList from "./components/StudentList";

function App() {
  return (
    <StudentProvider>
      <h2>Student & Course Management</h2>
      <AddStudent />
      <AddCourse />
      <StudentList />
    </StudentProvider>
  );
}

export default App;