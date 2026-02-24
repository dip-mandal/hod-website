import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ProjectModal({
  isOpen,
  onClose,
  onSuccess,
  editData,
}) {
  const isEdit = !!editData;
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    funding_agency: "",
    amount: "",
    role: "",
    duration: "",
    status: "ongoing",
    description: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        funding_agency: editData.funding_agency || "",
        amount: editData.amount || "",
        role: editData.role || "",
        duration: editData.duration || "",
        status: editData.status || "ongoing",
        description: editData.description || "",
      });
    } else {
      setForm({
        title: "",
        funding_agency: "",
        amount: "",
        role: "",
        duration: "",
        status: "ongoing",
        description: "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare the payload in the exact format the backend expects
      const payload = {
        title: form.title,
        funding_agency: form.funding_agency,
        amount: form.amount ? parseFloat(form.amount) : 0, // Convert to number
        role: form.role,
        duration: form.duration,
        status: form.status,
        description: form.description,
        faculty_id: 1, // Add the required faculty_id
      };

      console.log("Sending payload:", payload); // For debugging

      if (isEdit) {
        await api.put(`/projects/${editData.id}`, payload);
      } else {
        await api.post("/projects/", payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error details:", err.response?.data || err);
      alert(`Operation failed: ${err.response?.data?.detail || "Check console for details"}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6">
          {isEdit ? "Edit Project" : "Add Project"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            required
            disabled={submitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="funding_agency"
            placeholder="Funding Agency"
            value={form.funding_agency}
            onChange={handleChange}
            required
            disabled={submitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="amount"
            type="number"
            placeholder="Funding Amount"
            value={form.amount}
            onChange={handleChange}
            required
            disabled={submitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="role"
            placeholder="Role (PI / Co-PI)"
            value={form.role}
            onChange={handleChange}
            required
            disabled={submitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="duration"
            placeholder="Duration (e.g. 2023-2026)"
            value={form.duration}
            onChange={handleChange}
            required
            disabled={submitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            disabled={submitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
            disabled={submitting}
            className="w-full border p-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <div className="flex justify-end gap-3 mt-6">
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