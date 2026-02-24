import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ContactAdmin() {
  const [contactInfo, setContactInfo] = useState({
    address: "",
    phone: "",
    email: "",
    website: "",
    google_scholar: "",
    linkedin: "",
  });

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ---------------- FETCH CONTACT INFO ---------------- */
  const fetchContactInfo = async () => {
    try {
      const res = await api.get("/contact/");
      if (res.data) {
        setContactInfo(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- FETCH MESSAGES ---------------- */
  const fetchMessages = async () => {
    try {
      const res = await api.get("/contact/messages");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchContactInfo();
      await fetchMessages();
      setLoading(false);
    };
    load();
  }, []);

  /* ---------------- UPDATE CONTACT INFO ---------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put("/contact/", contactInfo);
      alert("Contact information updated successfully");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        <div className="flex justify-center items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg">Loading contact settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">

      {/* ================= CONTACT INFO SETTINGS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">
          Contact Information Settings
        </h1>

        <form onSubmit={handleUpdate} className="space-y-4">

          <textarea
            placeholder="Office Address"
            value={contactInfo.address || ""}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, address: e.target.value })
            }
            disabled={saving}
            className="w-full border p-3 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            placeholder="Phone"
            value={contactInfo.phone || ""}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, phone: e.target.value })
            }
            disabled={saving}
            className="w-full border p-3 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            placeholder="Official Email"
            value={contactInfo.email || ""}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, email: e.target.value })
            }
            disabled={saving}
            className="w-full border p-3 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            placeholder="Website"
            value={contactInfo.website || ""}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, website: e.target.value })
            }
            disabled={saving}
            className="w-full border p-3 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            placeholder="Google Scholar Link"
            value={contactInfo.google_scholar || ""}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, google_scholar: e.target.value })
            }
            disabled={saving}
            className="w-full border p-3 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            placeholder="LinkedIn Profile"
            value={contactInfo.linkedin || ""}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, linkedin: e.target.value })
            }
            disabled={saving}
            className="w-full border p-3 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 min-w-[150px] justify-center"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>

      {/* ================= RECEIVED MESSAGES ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-6">
          Visitor Messages
        </h2>

        {messages.length === 0 ? (
          <p className="text-gray-500">No messages received yet.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span className="font-medium text-gray-700">{msg.name} ({msg.email})</span>
                  <span>
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>

                <h3 className="font-semibold text-indigo-700">{msg.subject}</h3>

                <p className="mt-2 text-gray-700">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}