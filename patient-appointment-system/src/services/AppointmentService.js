export const AppointmentService = {

  getInitialAppointments: () => {
    return [
      {
        id: "A101",
        patientName: "Ravi Kumar",
        doctorName: "Dr. Sharma",
        date: "2026-03-10",
        status: "Scheduled"
      },
      {
        id: "A102",
        patientName: "Priya Singh",
        doctorName: "Dr. Reddy",
        date: "2026-03-12",
        status: "Completed"
      }
    ];
  }

};