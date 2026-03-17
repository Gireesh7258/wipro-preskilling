import React, { createContext, useReducer } from "react";

export const StudentContext = createContext();

const initialState = {
  students: [],
  courses: []
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_STUDENT":
      return { ...state, students: [...state.students, action.payload] };

    case "DELETE_STUDENT":
      return {
        ...state,
        students: state.students.filter(s => s.id !== action.payload)
      };

    case "ADD_COURSE":
      return { ...state, courses: [...state.courses, action.payload] };

    case "DELETE_COURSE":
      return {
        ...state,
        courses: state.courses.filter(c => c.id !== action.payload)
      };

    case "ENROLL_COURSE":
      return {
        ...state,
        students: state.students.map(student =>
          student.id === action.payload.studentId
            ? {
                ...student,
                courses: [...(student.courses || []), action.payload.course]
              }
            : student
        )
      };

    case "REMOVE_COURSE_FROM_STUDENT":
      return {
        ...state,
        students: state.students.map(student =>
          student.id === action.payload.studentId
            ? {
                ...student,
                courses: student.courses.filter(
                  c => c.id !== action.payload.courseId
                )
              }
            : student
        )
      };

    default:
      return state;
  }
}

export const StudentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StudentContext.Provider value={{ state, dispatch }}>
      {children}
    </StudentContext.Provider>
  );
};