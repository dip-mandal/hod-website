import { useEffect, useState } from "react";
import api from "../../api/axios";
import { FileText, Plus, Pencil, Trash2, Filter } from "lucide-react";

export default function Patents() {
  const [patents, setPatents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editPatent, setEditPatent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const limit = 10;

  const fetchPatents = async () => {
    setLoading(true);
    try {
      let url = `/patents/?skip=${page * limit}&limit=${limit}`;

      if (status) url += `&status=${status}`;
      if (type) url += `&patent_type=${type}`;

      const res = await api.get(url);
      setPatents(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching patents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatents();
  }, [page, status, type]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this patent?")) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/patents/${id}`);
      await fetchPatents();
    } catch (err) {
      console.error("Error deleting patent:", err);
      alert("Failed to delete patent");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 -mt-6 -mx-6 mb-6 px-6 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText className="text-white" size={28} />
            <div>
              <h1 className="text-3xl font-bold text-white">Patents</h1>
              <p className="text-indigo-100 mt-1">Manage your patent portfolio</p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditPatent(null);
              setShowModal(true);
            }}
            className="bg-white text-indigo-600 px-5 py-2.5 rounded-lg hover:bg-indigo-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium flex items-center gap-2"
          >
            <Plus size={18} />
            Add Patent
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Filter size={18} />
          <span className="font-medium">Filters:</span>
        </div>
        
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(0);
          }}
          className="border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
        >
          <option value="">All Types</option>
          <option value="domestic">Domestic</option>
          <option value="international">International</option>
          <option value="copyright">Copyright</option>
          <option value="design">Design</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
          className="border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
        >
          <option value="">All Status</option>
          <option value="filed">Filed</option>
          <option value="published">Published</option>
          <option value="granted">Granted</option>
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center gap-3 text-gray-500">
              <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg">Loading patents...</span>
            </div>
          </div>
        ) : patents.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-lg">No patents found</p>
            <button
              onClick={() => {
                setEditPatent(null);
                setShowModal(true);
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Add your first patent
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Filing Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patents.map((patent) => (
                  <tr key={patent.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{patent.title}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${patent.patent_type === 'domestic' ? 'bg-green-100 text-green-700' : ''}
                        ${patent.patent_type === 'international' ? 'bg-blue-100 text-blue-700' : ''}
                        ${patent.patent_type === 'copyright' ? 'bg-purple-100 text-purple-700' : ''}
                        ${patent.patent_type === 'design' ? 'bg-orange-100 text-orange-700' : ''}
                      `}>
                        {patent.patent_type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${patent.status === 'filed' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${patent.status === 'published' ? 'bg-blue-100 text-blue-700' : ''}
                        ${patent.status === 'granted' ? 'bg-green-100 text-green-700' : ''}
                      `}>
                        {patent.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{patent.filing_date || '-'}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setEditPatent(patent);
                            setShowModal(true);
                          }}
                          disabled={deletingId === patent.id}
                          className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(patent.id)}
                          disabled={deletingId === patent.id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Delete"
                        >
                          {deletingId === patent.id ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  page === i 
                    ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <PatentModal
          editPatent={editPatent}
          close={() => setShowModal(false)}
          refresh={fetchPatents}
        />
      )}
    </div>
  );
}

function PatentModal({ editPatent, close, refresh }) {
  const [submitting, setSubmitting] = useState(false);
  
  // Initialize form with empty strings matching backend schema
  const [form, setForm] = useState({
    faculty_id: 1,
    title: "",
    patent_type: "domestic",
    application_number: "",
    registration_number: "",
    filing_date: "",
    publication_date: "",
    issue_date: "",
    inventors: "",
    status: "filed",
  });

  // Load edit data when available
  useEffect(() => {
    if (editPatent) {
      setForm({
        faculty_id: editPatent.faculty_id || 1,
        title: editPatent.title || "",
        patent_type: editPatent.patent_type || "domestic",
        application_number: editPatent.application_number || "",
        registration_number: editPatent.registration_number || "",
        filing_date: editPatent.filing_date || "",
        publication_date: editPatent.publication_date || "",
        issue_date: editPatent.issue_date || "",
        inventors: editPatent.inventors || "",
        status: editPatent.status || "filed",
      });
    } else {
      setForm({
        faculty_id: 1,
        title: "",
        patent_type: "domestic",
        application_number: "",
        registration_number: "",
        filing_date: "",
        publication_date: "",
        issue_date: "",
        inventors: "",
        status: "filed",
      });
    }
  }, [editPatent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare payload matching backend schema exactly
      const payload = {
        faculty_id: 1, // Always include faculty_id
        title: form.title,
        patent_type: form.patent_type,
        application_number: form.application_number || "",
        registration_number: form.registration_number || "",
        filing_date: form.filing_date || null,
        publication_date: form.publication_date || null,
        issue_date: form.issue_date || null,
        inventors: form.inventors || "",
        status: form.status,
      };

      if (editPatent) {
        await api.put(`/patents/${editPatent.id}`, payload);
      } else {
        await api.post("/patents/", payload);
      }

      refresh();
      close();
    } catch (err) {
      console.error("Error saving patent:", err.response?.data || err);
      alert(`Failed to save patent: ${err.response?.data?.detail || "Please check all fields"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 sticky top-0">
          <h2 className="text-xl font-bold text-white">
            {editPatent ? "Edit Patent" : "Add New Patent"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="Enter patent title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
              disabled={submitting}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>

          {/* Type and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patent Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.patent_type}
                onChange={(e) =>
                  setForm({ ...form, patent_type: e.target.value })
                }
                required
                disabled={submitting}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              >
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
                <option value="copyright">Copyright</option>
                <option value="design">Design</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                required
                disabled={submitting}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              >
                <option value="filed">Filed</option>
                <option value="published">Published</option>
                <option value="granted">Granted</option>
              </select>
            </div>
          </div>

          {/* Application and Registration Numbers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Number
              </label>
              <input
                placeholder="Application number"
                value={form.application_number}
                onChange={(e) =>
                  setForm({ ...form, application_number: e.target.value })
                }
                disabled={submitting}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Number
              </label>
              <input
                placeholder="Registration number"
                value={form.registration_number}
                onChange={(e) =>
                  setForm({ ...form, registration_number: e.target.value })
                }
                disabled={submitting}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filing Date
              </label>
              <input
                type="date"
                value={form.filing_date || ""}
                onChange={(e) =>
                  setForm({ ...form, filing_date: e.target.value })
                }
                disabled={submitting}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publication Date
              </label>
              <input
                type="date"
                value={form.publication_date || ""}
                onChange={(e) =>
                  setForm({ ...form, publication_date: e.target.value })
                }
                disabled={submitting}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                value={form.issue_date || ""}
                onChange={(e) =>
                  setForm({ ...form, issue_date: e.target.value })
                }
                disabled={submitting}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Inventors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inventors
            </label>
            <input
              placeholder="List all inventors"
              value={form.inventors}
              onChange={(e) =>
                setForm({ ...form, inventors: e.target.value })
              }
              disabled={submitting}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={close}
              disabled={submitting}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 min-w-[120px] justify-center font-medium transition-colors"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {editPatent ? "Updating..." : "Adding..."}
                </>
              ) : (
                editPatent ? "Update Patent" : "Add Patent"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}