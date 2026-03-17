export const addCourse = (dispatch, course) => {
  dispatch({ type: "ADD_COURSE", payload: course });
};

export const deleteCourse = (dispatch, id) => {
  dispatch({ type: "DELETE_COURSE", payload: id });
};

export const enrollCourse = (dispatch, studentId, course) => {
  dispatch({
    type: "ENROLL_COURSE",
    payload: { studentId, course }
  });
};

export const removeCourseFromStudent = (dispatch, studentId, courseId) => {
  dispatch({
    type: "REMOVE_COURSE_FROM_STUDENT",
    payload: { studentId, courseId }
  });
};