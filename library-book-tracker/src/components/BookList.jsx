const BookList = ({ books, onDelete, onToggle }) => {

  return (
    <div>
      <h3>Book List</h3>
      <ul>
        {books.map(book => (
          <li key={book.id}>
            <strong>{book.title}</strong> | {book.author} | {book.status}

            <button onClick={() => onToggle(book.id)}>
              Toggle Status
            </button>

            <button onClick={() => onDelete(book.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;