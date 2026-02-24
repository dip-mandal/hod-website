import { useEffect, useState } from "react";
import api from "../../api/axios";
import ProjectModal from "../../components/ProjectModal";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const totalPages = Math.ceil(total / limit);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await api.get("/projects/", {
        params: {
          skip: (page - 1) * limit,
          limit,
          search: search || undefined,
          status: status || undefined,
        },
      });

      setProjects(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, search, status]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/projects/${id}`);
      await fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const openAddModal = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditData(project);
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Projects Management</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 bg-white p-4 rounded shadow-sm">
        <input
          type="text"
          placeholder="Search project..."
          className="border px-3 py-2 rounded w-60"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          className="border px-3 py-2 rounded"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={openAddModal}
          className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded"
        >
          + Add Project
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border text-left">Title</th>
                <th className="p-3 border">Agency</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Duration</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-gray-50">
                  <td className="p-3 border font-medium">
                    {proj.title}
                  </td>
                  <td className="p-3 border">{proj.funding_agency}</td>
                  <td className="p-3 border">
                    ₹ {proj.amount?.toLocaleString()}
                  </td>
                  <td className="p-3 border">{proj.duration}</td>
                  <td className="p-3 border">{proj.role}</td>
                  <td className="p-3 border capitalize">
                    {proj.status}
                  </td>
                  <td className="p-3 border text-center space-x-2">
                    <button
                      onClick={() => openEditModal(proj)}
                      disabled={deletingId === proj.id}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      disabled={deletingId === proj.id}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                    >
                      {deletingId === proj.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProjects}
        editData={editData}
      />
    </div>
  );
}