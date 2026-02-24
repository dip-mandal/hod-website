import { useEffect, useState } from "react";
import api from "../../api/axios";
import { User, Mail, Building2, BookOpen, University, Image, Save } from "lucide-react";

export default function AdminProfile() {
  const [form, setForm] = useState({
    full_name: "",
    designation: "",
    department: "",
    university: "",
    email: "",
    bio: "",
    profile_image: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setFetching(true);
    try {
      const res = await api.get("/faculty/");
      setForm(res.data);
      setPreview(res.data.profile_image);
    } catch (err) {
      console.log("No profile yet");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const res = await api.post("/upload/image", formData);
      setForm({ ...form, profile_image: res.data.url });
      setPreview(res.data.url);
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put("/faculty/", form);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-gray-500">
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  const isSubmitting = loading || uploading;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-t-2xl px-8 py-6">
          <div className="flex items-center gap-3">
            <User className="text-white" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
              <p className="text-indigo-100 text-sm mt-1">Manage your personal information and public profile</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-b-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Profile Image Section */}
            <div className="border-b pb-6">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
                <Image size={20} className="text-indigo-600" />
                Profile Photo
              </label>

              <div className="flex items-center gap-6">
                {preview ? (
                  <div className="relative group">
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-md"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs">Change</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-indigo-200">
                    <User size={32} className="text-indigo-400" />
                  </div>
                )}

                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      disabled={isSubmitting}
                      accept="image/*"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Recommended: Square image, at least 400x400 pixels</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <User size={16} className="text-indigo-600" />
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Dr. John Doe"
                  value={form.full_name || ""}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Building2 size={16} className="text-indigo-600" />
                    Designation
                  </span>
                </label>
                <input
                  type="text"
                  name="designation"
                  placeholder="Professor"
                  value={form.designation || ""}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <BookOpen size={16} className="text-indigo-600" />
                    Department
                  </span>
                </label>
                <input
                  type="text"
                  name="department"
                  placeholder="Computer Science"
                  value={form.department || ""}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                />
              </div>

              {/* University */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <University size={16} className="text-indigo-600" />
                    University
                  </span>
                </label>
                <input
                  type="text"
                  name="university"
                  placeholder="University Name"
                  value={form.university || ""}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1">
                  <Mail size={16} className="text-indigo-600" />
                  Email Address
                </span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="john.doe@university.edu"
                value={form.email || ""}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biography
              </label>
              <textarea
                name="bio"
                placeholder="Write a brief biography..."
                value={form.bio || ""}
                onChange={handleChange}
                rows="5"
                disabled={isSubmitting}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum 500 characters</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 min-w-[160px] justify-center font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {uploading ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}