import { useContext, useState } from "react";
import { AppointmentContext } from "../context/AppointmentContext";

const AddAppointment = () => {

  const { dispatch } = useContext(AppointmentContext);

  const [form, setForm] = useState({
    id: "",
    patientName: "",
    doctorName: "",
    date: "",
    status: "Scheduled"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.id || !form.patientName || !form.doctorName || !form.date) {
      alert("All fields are required!");
      return;
    }

    dispatch({ type: "ADD_APPOINTMENT", payload: form });

    setForm({
      id: "",
      patientName: "",
      doctorName: "",
      date: "",
      status: "Scheduled"
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Appointment</h3>

      <input name="id" placeholder="Appointment ID" value={form.id} onChange={handleChange} />
      <input name="patientName" placeholder="Patient Name" value={form.patientName} onChange={handleChange} />
      <input name="doctorName" placeholder="Doctor Name" value={form.doctorName} onChange={handleChange} />
      <input type="date" name="date" value={form.date} onChange={handleChange} />

      <select name="status" value={form.status} onChange={handleChange}>
        <option value="Scheduled">Scheduled</option>
        <option value="Completed">Completed</option>
      </select>

      <button type="submit">Add</button>
    </form>
  );
};

export default AddAppointment;