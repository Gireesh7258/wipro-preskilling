import { useState } from "react";

const AddBook = ({ onAdd }) => {

  const [book, setBook] = useState({
    id: "",
    title: "",
    author: "",
    status: "Available"
  });

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(book);
    setBook({ id: "", title: "", author: "", status: "Available" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Book</h3>

      <input
        type="text"
        name="id"
        placeholder="Book ID"
        value={book.id}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="title"
        placeholder="Book Title"
        value={book.title}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="author"
        placeholder="Author Name"
        value={book.author}
        onChange={handleChange}
        required
      />

      <select name="status" value={book.status} onChange={handleChange}>
        <option value="Available">Available</option>
        <option value="Issued">Issued</option>
      </select>

      <button type="submit">Add Book</button>
    </form>
  );
};

export default AddBook;