import { useEffect, useState } from "react";
import AddBook from "./components/AddBook";
import BookList from "./components/BookList";
import SearchBook from "./components/SearchBook";
import { BookService } from "./services/BookService";

function App() {

  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setBooks(BookService.getBooks());
  }, []);

  const handleAdd = (book) => {
    BookService.addBook(book);
    setBooks([...BookService.getBooks()]);
  };

  const handleDelete = (id) => {
    BookService.deleteBook(id);
    setBooks([...BookService.getBooks()]);
  };

  const handleToggle = (id) => {
    BookService.toggleStatus(id);
    setBooks([...BookService.getBooks()]);
  };

  const filteredBooks = books.filter(book =>
    book.id.includes(searchTerm) ||
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 Library Book Tracker</h1>

      <AddBook onAdd={handleAdd} />
      <SearchBook searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <BookList
        books={filteredBooks}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
    </div>
  );
}

export default App;