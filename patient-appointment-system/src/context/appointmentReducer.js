export const appointmentReducer = (state, action) => {
  switch (action.type) {

    case "ADD_APPOINTMENT":
      return [...state, action.payload];

    case "DELETE_APPOINTMENT":
      return state.filter(app => app.id !== action.payload);

    case "TOGGLE_STATUS":
      return state.map(app =>
        app.id === action.payload
          ? {
              ...app,
              status: app.status === "Scheduled" ? "Completed" : "Scheduled"
            }
          : app
      );

    case "UPDATE_APPOINTMENT":
      return state.map(app =>
        app.id === action.payload.id
          ? { ...app, ...action.payload }
          : app
      );

    default:
      return state;
  }
};