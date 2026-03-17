import { createContext, useReducer } from "react";
import { appointmentReducer } from "./appointmentReducer";
import { AppointmentService } from "../services/AppointmentService";

export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {

  const [state, dispatch] = useReducer(
    appointmentReducer,
    AppointmentService.getInitialAppointments()
  );

  return (
    <AppointmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AppointmentContext.Provider>
  );
};