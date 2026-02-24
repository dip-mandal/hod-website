import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Award, Plus, Pencil, Trash2 } from "lucide-react";

export default function Awards() {
  const [awards, setAwards] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    award_date: "",
    description: "",
  });

  const fetchAwards = async () => {
    try {
      setLoading(true);
      const skip = (page - 1) * limit;
      const res = await api.get(`/awards/?skip=${skip}&limit=${limit}`);
      setAwards(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching awards", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editId) {
        await api.put(`/awards/${editId}`, formData);
      } else {
        await api.post("/awards/", {
          ...formData,
          faculty_id: 1,
        });
      }
      resetForm();
      fetchAwards();
    } catch {
      alert("Error saving award");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (award) => {
    setEditId(award.id);
    setFormData({
      title: award.title,
      organization: award.organization,
      award_date: award.award_date,
      description: award.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this award?")) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/awards/${id}`);
      await fetchAwards();
    } catch {
      alert("Error deleting award");
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({
      title: "",
      organization: "",
      award_date: "",
      description: "",
    });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Award className="text-indigo-600" />
          <h1 className="text-2xl font-bold">Awards</h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add Award
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <div className="flex justify-center items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading awards...
          </div>
        </div>
      ) : awards.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
          <Award size={40} className="mx-auto mb-3 text-gray-300" />
          No awards added yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Organization</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {awards.map((award) => (
                <tr
                  key={award.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">
                    {award.title}
                    {award.description && (
                      <div className="text-sm text-gray-500 mt-1">
                        {award.description}
                      </div>
                    )}
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full">
                      {award.organization}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="text-gray-600">
                      {new Date(award.award_date).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="p-4 flex justify-end gap-3">
                    <button
                      onClick={() => handleEdit(award)}
                      disabled={deletingId === award.id}
                      className="text-blue-600 hover:text-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(award.id)}
                      disabled={deletingId === award.id}
                      className="text-red-600 hover:text-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === award.id ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-[420px] p-6 rounded-xl shadow-xl animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Award" : "Add Award"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                disabled={submitting}
              />

              <input
                type="text"
                placeholder="Organization"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organization: e.target.value,
                  })
                }
                required
                disabled={submitting}
              />

              <input
                type="date"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
                value={formData.award_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    award_date: e.target.value,
                  })
                }
                required
                disabled={submitting}
              />

              <textarea
                placeholder="Description (optional)"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                disabled={submitting}
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 min-w-[100px] justify-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editId ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    editId ? "Update" : "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}