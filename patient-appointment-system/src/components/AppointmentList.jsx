import { useContext, useState } from "react";
import { AppointmentContext } from "../context/AppointmentContext";

const AppointmentList = ({ searchTerm }) => {

  const { state, dispatch } = useContext(AppointmentContext);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const filtered = state.filter(app =>
    app.id.includes(searchTerm) ||
    app.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdate = (id) => {
    dispatch({ type: "UPDATE_APPOINTMENT", payload: editData });
    setEditId(null);
  };

  return (
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Patient</th>
          <th>Doctor</th>
          <th>Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {filtered.map(app => (
          <tr key={app.id}>
            <td>{app.id}</td>

            <td>
              {editId === app.id
                ? <input value={editData.patientName}
                         onChange={(e)=>setEditData({...editData, patientName:e.target.value})}/>
                : app.patientName}
            </td>

            <td>
              {editId === app.id
                ? <input value={editData.doctorName}
                         onChange={(e)=>setEditData({...editData, doctorName:e.target.value})}/>
                : app.doctorName}
            </td>

            <td>
              {editId === app.id
                ? <input type="date"
                         value={editData.date}
                         onChange={(e)=>setEditData({...editData, date:e.target.value})}/>
                : app.date}
            </td>

            <td>{app.status}</td>

            <td>
              <button onClick={() =>
                dispatch({ type: "DELETE_APPOINTMENT", payload: app.id })
              }>
                Delete
              </button>

              <button onClick={() =>
                dispatch({ type: "TOGGLE_STATUS", payload: app.id })
              }>
                Toggle
              </button>

              {editId === app.id ? (
                <button onClick={() => handleUpdate(app.id)}>Save</button>
              ) : (
                <button onClick={() => {
                  setEditId(app.id);
                  setEditData(app);
                }}>
                  Edit
                </button>
              )}
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AppointmentList;