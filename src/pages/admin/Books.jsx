import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const limit = 10;

  const fetchBooks = async () => {
    try {
      setLoading(true);
      let url = `/books/?skip=${page * limit}&limit=${limit}`;
      if (category) url += `&category=${category}`;

      const res = await api.get(url);
      setBooks(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, category]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/books/${id}`);
      await fetchBooks();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Books</h1>

        <button
          onClick={() => {
            setEditBook(null);
            setShowModal(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Add Book
        </button>
      </div>

      {/* Filter */}
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setPage(0);
        }}
        className="mb-4 border p-2 rounded"
      >
        <option value="">All Categories</option>
        <option value="authored">Authored</option>
        <option value="edited">Edited</option>
        <option value="monograph">Monograph</option>
      </select>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading books...
          </div>
        ) : books.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No books found.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Cover</th>
                <th className="p-3">Title</th>
                <th className="p-3">Publisher</th>
                <th className="p-3">Year</th>
                <th className="p-3">Category</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-t">
                  <td className="p-3">
                    {book.cover_image ? (
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-3 font-medium">{book.title}</td>
                  <td className="p-3">{book.publisher}</td>
                  <td className="p-3">{book.year}</td>
                  <td className="p-3 capitalize">{book.category}</td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => {
                        setEditBook(book);
                        setShowModal(true);
                      }}
                      disabled={deletingId === book.id}
                      className="text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(book.id)}
                      disabled={deletingId === book.id}
                      className="text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                    >
                      {deletingId === book.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-4 flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              disabled={loading}
              className={`px-3 py-1 border rounded ${
                page === i ? "bg-indigo-600 text-white" : "bg-white hover:bg-gray-50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <BookModal
          editData={editBook}
          onClose={() => setShowModal(false)}
          onSuccess={fetchBooks}
        />
      )}
    </div>
  );
}

/* ---------------- BOOK MODAL ---------------- */

function BookModal({ editData, onClose, onSuccess }) {
  const isEdit = !!editData;
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const initialState = {
    title: "",
    publisher: "",
    year: "",
    category: "authored",
    isbn: "",
    doi: "",
    official_url: "",
    cover_image: "",
  };

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editData) {
      setForm({ ...initialState, ...editData });
    } else {
      setForm(initialState);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "year" ? Number(value) : value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const res = await api.post("/upload/image", formData);

      setForm((prev) => ({
        ...prev,
        cover_image: res.data.url,
      }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        faculty_id: 1, // Always inject faculty
      };

      if (isEdit) {
        await api.put(`/books/${editData.id}`, payload);
      } else {
        await api.post("/books/", payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitting = submitting || uploading;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Book" : "Add Book"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="publisher"
            placeholder="Publisher"
            value={form.publisher}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="year"
            type="number"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="authored">Authored</option>
            <option value="edited">Edited</option>
            <option value="monograph">Monograph</option>
          </select>

          <input
            name="isbn"
            placeholder="ISBN"
            value={form.isbn}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="doi"
            placeholder="DOI"
            value={form.doi}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="official_url"
            placeholder="Official Link"
            value={form.official_url}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <div className="relative">
            <input
              type="file"
              onChange={handleImageUpload}
              disabled={isSubmitting}
              className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>

          {form.cover_image && (
            <img
              src={form.cover_image}
              alt="Cover"
              className="w-24 h-32 object-cover rounded mt-2"
            />
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 min-w-[100px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {uploading ? "Uploading..." : isEdit ? "Updating..." : "Adding..."}
                </>
              ) : (
                isEdit ? "Update" : "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}