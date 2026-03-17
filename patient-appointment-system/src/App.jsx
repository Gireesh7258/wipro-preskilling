import { useState } from "react";
import { AppointmentProvider } from "./context/AppointmentContext";
import AddAppointment from "./components/AddAppointment";
import AppointmentList from "./components/AppointmentList";
import SearchAppointment from "./components/SearchAppointment";

function App() {

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AppointmentProvider>
      <div style={{ padding: "20px" }}>
        <h1>🏥 Patient Appointment Management</h1>

        <AddAppointment />
        <SearchAppointment
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <AppointmentList searchTerm={searchTerm} />
      </div>
    </AppointmentProvider>
  );
}

export default App;