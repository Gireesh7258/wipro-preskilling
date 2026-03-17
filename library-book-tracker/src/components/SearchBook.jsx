const SearchBook = ({ searchTerm, setSearchTerm }) => {

  return (
    <div>
      <h3>Search Book</h3>
      <input
        type="text"
        placeholder="Search by ID or Title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBook;