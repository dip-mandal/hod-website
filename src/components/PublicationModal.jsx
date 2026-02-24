import { useEffect, useState } from "react";
import api from "../api/axios";

export default function PublicationModal({
  isOpen,
  onClose,
  onSuccess,
  editData,
  submitting: externalSubmitting,
}) {
  const isEdit = !!editData;
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const initialState = {
    title: "",
    authors: "",
    publication_type: "journal",
    year: "",
    official_url: "",
    abstract: "",
    cover_image: "",
  };

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editData) {
      setForm({
        ...initialState,
        ...editData,
      });
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
        faculty_id: 1, // 🔥 IMPORTANT FIX
      };

      if (isEdit) {
        await api.put(`/publications/${editData.id}`, payload);
      } else {
        await api.post("/publications/", payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Operation failed. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isSubmitting = submitting || externalSubmitting || uploading;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">

        <h2 className="text-2xl font-bold mb-6">
          {isEdit ? "Edit Publication" : "Add Publication"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          {/* Authors */}
          <input
            name="authors"
            placeholder="Authors"
            value={form.authors}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          {/* Type */}
          <select
            name="publication_type"
            value={form.publication_type}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="journal">Journal</option>
            <option value="conference">Conference</option>
          </select>

          {/* Year */}
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

          {/* Official URL */}
          <input
            type="text"
            name="official_url"
            placeholder="Official Publication URL"
            value={form.official_url}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          {/* Abstract */}
          <textarea
            name="abstract"
            placeholder="Abstract"
            value={form.abstract}
            onChange={handleChange}
            rows="4"
            disabled={isSubmitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          {/* Cover Upload */}
          <div>
            <div className="relative">
              <input
                type="file"
                onChange={handleImageUpload}
                disabled={isSubmitting}
                className="border p-2 rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                className="mt-3 w-24 h-32 object-cover rounded"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
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