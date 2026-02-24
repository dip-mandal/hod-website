import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const limit = 12;

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/gallery/?skip=${page * limit}&limit=${limit}`
      );
      setItems(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this media item?")) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/gallery/${id}`);
      await fetchGallery();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Showcase</h1>

        <button
          onClick={() => {
            setEditItem(null);
            setShowModal(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Add Media
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex items-center gap-3 text-gray-500">
            <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading gallery...</span>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No media items found
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow rounded-xl overflow-hidden group"
            >
              <img
                src={item.media_url}
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition"
              />

              <div className="p-4">
                <h3 className="font-semibold text-sm">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {item.media_type}
                </p>

                <div className="flex justify-between mt-3 text-sm">
                  <button
                    onClick={() => {
                      setEditItem(item);
                      setShowModal(true);
                    }}
                    disabled={deletingId === item.id}
                    className="text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                  >
                    {deletingId === item.id ? (
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-3 py-1 border rounded ${
                page === i ? "bg-indigo-600 text-white" : "bg-white hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <GalleryModal
          editData={editItem}
          onClose={() => setShowModal(false)}
          onSuccess={fetchGallery}
        />
      )}
    </div>
  );
}

/* ------------------ MODAL ------------------ */

function GalleryModal({ editData, onClose, onSuccess }) {
  const isEdit = !!editData;
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const initialState = {
    title: "",
    description: "",
    media_url: "",
    media_type: "image",
  };

  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editData) {
      setForm(editData);
      setPreview(editData.media_url);
    } else {
      setForm(initialState);
      setPreview(null);
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const res = await api.post("/upload/image", formData);

      setForm((prev) => ({
        ...prev,
        media_url: res.data.url,
      }));

      setPreview(res.data.url);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        await api.put(`/gallery/${editData.id}`, form);
      } else {
        await api.post("/gallery/", form);
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
          {isEdit ? "Edit Media" : "Add Media"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <select
            name="media_type"
            value={form.media_type}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="image">Image</option>
          </select>

          <div className="relative">
            <input
              type="file"
              onChange={handleUpload}
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

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded"
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