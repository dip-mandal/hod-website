import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function PublicBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/public/books");
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to load books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading books...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
        Books & Monographs
      </h1>

      <p className="text-center text-gray-500 mb-12">
        Authored and Edited Academic Books
      </p>

      {books.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          No books available.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() =>
                book.official_url &&
                window.open(book.official_url, "_blank")
              }
              className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              {/* Cover */}
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full h-72 object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-400">
                  No Cover
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                  {book.title}
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  {book.publisher} • {book.year}
                </p>

                {book.isbn && (
                  <p className="text-xs text-gray-500 mt-2">
                    ISBN: {book.isbn}
                  </p>
                )}

                {book.category && (
                  <span className="inline-block mt-4 px-3 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full capitalize">
                    {book.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}