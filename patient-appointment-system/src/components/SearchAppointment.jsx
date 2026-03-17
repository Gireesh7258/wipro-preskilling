const SearchAppointment = ({ searchTerm, setSearchTerm }) => {

  return (
    <div>
      <input
        type="text"
        placeholder="Search by ID or Patient Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchAppointment;