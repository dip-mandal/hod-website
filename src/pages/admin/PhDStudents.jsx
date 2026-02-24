import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Plus, Pencil, Trash } from "lucide-react";

export default function PhDStudents() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    university: "",
    thesis_title: "",
    status: "",
    role: "",
    bio: "",
    research_area: "",
    profile_image: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch Students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/phd-students/?skip=${page * limit}&limit=${limit}`
      );
      setStudents(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  // Handle Image Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Upload to Cloudinary
  const uploadImage = async () => {
    if (!selectedFile) return formData.profile_image;

    const data = new FormData();
    data.append("file", selectedFile);

    const res = await api.post("/upload/image", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.url;
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const imageUrl = await uploadImage();

      const payload = {
        ...formData,
        profile_image: imageUrl,
        faculty_id: 1, // Adjust if dynamic
      };

      if (editingStudent) {
        await api.put(`/phd-students/${editingStudent.id}`, payload);
      } else {
        await api.post("/phd-students/", payload);
      }

      setShowModal(false);
      setEditingStudent(null);
      setSelectedFile(null);
      setImagePreview(null);
      fetchStudents();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Edit
  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData(student);
    setImagePreview(student.profile_image);
    setShowModal(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/phd-students/${id}`);
      await fetchStudents();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">PhD Students</h1>
        <button
          onClick={() => {
            setEditingStudent(null);
            setFormData({
              name: "",
              university: "",
              thesis_title: "",
              status: "",
              role: "",
              bio: "",
              research_area: "",
              profile_image: "",
            });
            setImagePreview(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="p-3">Photo</th>
              <th>Name</th>
              <th>University</th>
              <th>Status</th>
              <th>Research Area</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-5 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="p-3">
                    <img
                      src={
                        student.profile_image ||
                        "https://via.placeholder.com/40"
                      }
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td>{student.name}</td>
                  <td>{student.university}</td>
                  <td>{student.status}</td>
                  <td>{student.research_area || "-"}</td>
                  <td className="flex gap-3">
                    <button 
                      onClick={() => handleEdit(student)}
                      disabled={deletingId === student.id}
                      className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      disabled={deletingId === student.id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === student.id ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Trash size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          disabled={(page + 1) * limit >= total}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">
              {editingStudent ? "Edit Student" : "Add Student"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border p-2 rounded disabled:bg-gray-100"
                required
                disabled={submitting}
              />

              <input
                type="text"
                placeholder="University"
                value={formData.university}
                onChange={(e) =>
                  setFormData({ ...formData, university: e.target.value })
                }
                className="w-full border p-2 rounded disabled:bg-gray-100"
                disabled={submitting}
              />

              <input
                type="text"
                placeholder="Research Area"
                value={formData.research_area}
                onChange={(e) =>
                  setFormData({ ...formData, research_area: e.target.value })
                }
                className="w-full border p-2 rounded disabled:bg-gray-100"
                disabled={submitting}
              />

              <textarea
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full border p-2 rounded disabled:bg-gray-100"
                disabled={submitting}
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border p-2 rounded disabled:bg-gray-100"
                disabled={submitting}
              >
                <option value="">Select Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>

              {/* Image Upload */}
              <input 
                type="file" 
                onChange={handleFileChange}
                disabled={submitting}
                className="disabled:opacity-50"
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover mt-2"
                />
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 inline-flex items-center gap-2 min-w-[100px] justify-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingStudent ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    "Save"
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