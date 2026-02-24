import { useEffect, useState } from "react";
import api from "../api/axios";

export default function PhDStudentModal({
  isOpen,
  onClose,
  onSuccess,
  editData,
}) {
  const isEdit = !!editData;
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    university: "",
    award_date: "",
    thesis_title: "",
    role: "",
    status: "ongoing",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        ...editData,
        award_date: editData.award_date?.split("T")[0], // Fix date format
      });
    } else {
      setForm({
        name: "",
        university: "",
        award_date: "",
        thesis_title: "",
        role: "",
        status: "ongoing",
      });
    }
  }, [editData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        await api.put(`/phd-students/${editData.id}`, form);
      } else {
        await api.post("/phd-students/", form);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit PhD Student" : "Add PhD Student"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            placeholder="Student Name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={submitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="university"
            placeholder="University"
            value={form.university}
            onChange={handleChange}
            disabled={submitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            type="date"
            name="award_date"
            value={form.award_date}
            onChange={handleChange}
            disabled={submitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="thesis_title"
            placeholder="Thesis Title"
            value={form.thesis_title}
            onChange={handleChange}
            disabled={submitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="role"
            placeholder="Role (Principal Supervisor)"
            value={form.role}
            onChange={handleChange}
            disabled={submitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={submitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 min-w-[100px] justify-center"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEdit ? "Updating..." : "Adding..."}
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