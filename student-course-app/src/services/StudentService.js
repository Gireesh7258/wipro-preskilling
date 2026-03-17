export const addStudent = (dispatch, student) => {
  dispatch({ type: "ADD_STUDENT", payload: student });
};

export const deleteStudent = (dispatch, id) => {
  dispatch({ type: "DELETE_STUDENT", payload: id });
};