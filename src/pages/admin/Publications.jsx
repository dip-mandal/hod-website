import { useEffect, useState } from "react";
import api from "../../api/axios";
import PublicationModal from "../../components/PublicationModal";

export default function Publications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);

  const totalPages = Math.ceil(total / limit);

  // Fetch publications from backend
  const fetchPublications = async () => {
    try {
      setLoading(true);

      const res = await api.get("/publications/", {
        params: {
          skip: (page - 1) * limit,
          limit,
          search: search || undefined,
          year: year || undefined,
          publication_type: type || undefined,
        },
      });

      setPublications(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [page, search, year, type]);

  // Delete publication
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this publication?"))
      return;

    setDeletingId(id);

    try {
      await api.delete(`/publications/${id}`);
      await fetchPublications();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const openEditModal = (publication) => {
    setEditData(publication);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    if (!modalSubmitting) {
      setIsModalOpen(false);
    }
  };

  const handleModalSuccess = async () => {
    setModalSubmitting(true);
    try {
      await fetchPublications();
    } finally {
      setModalSubmitting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Publications Management
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center bg-white p-4 rounded shadow-sm">
        <input
          type="text"
          placeholder="Search title..."
          className="border px-3 py-2 rounded w-60"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <input
          type="number"
          placeholder="Year"
          className="border px-3 py-2 rounded w-28"
          value={year}
          onChange={(e) => {
            setPage(1);
            setYear(e.target.value);
          }}
        />

        <select
          className="border px-3 py-2 rounded"
          value={type}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value);
          }}
        >
          <option value="">All Types</option>
          <option value="journal">Journal</option>
          <option value="conference">Conference</option>
        </select>

        <div className="ml-auto">
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            + Add Publication
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading publications...
          </div>
        ) : publications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No publications found.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Authors</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Year</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {publications.map((pub) => (
                <tr key={pub.id} className="hover:bg-gray-50">
                  <td className="p-3 border font-medium text-gray-700">
                    {pub.title}
                  </td>
                  <td className="p-3 border">{pub.authors}</td>
                  <td className="p-3 border capitalize">
                    {pub.publication_type}
                  </td>
                  <td className="p-3 border">{pub.year}</td>
                  <td className="p-3 border text-center space-x-2">
                    <button
                      onClick={() => openEditModal(pub)}
                      disabled={deletingId === pub.id}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(pub.id)}
                      disabled={deletingId === pub.id}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                    >
                      {deletingId === pub.id ? (
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      <PublicationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editData={editData}
        submitting={modalSubmitting}
      />
    </div>
  );
}