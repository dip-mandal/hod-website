import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Send,
  GraduationCap,
  Linkedin,
} from "lucide-react";

export default function Contact() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/public/contact");
        setInfo(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/public/contact", form);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      alert("Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading contact information...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-16 text-white text-center">
        <h1 className="text-4xl font-bold">Contact</h1>
        <p className="mt-3 opacity-90">
          Feel free to reach out for research collaboration, academic inquiries, or speaking invitations.
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">

        {/* ================= CONTACT INFO ================= */}
        <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Contact Information
          </h2>

          {info?.address && (
            <div className="flex gap-4 items-start">
              <MapPin className="text-indigo-600" />
              <p className="text-gray-700">{info.address}</p>
            </div>
          )}

          {info?.phone && (
            <div className="flex gap-4 items-center">
              <Phone className="text-indigo-600" />
              <p className="text-gray-700">{info.phone}</p>
            </div>
          )}

          {info?.email && (
            <div className="flex gap-4 items-center">
              <Mail className="text-indigo-600" />
              <a
                href={`mailto:${info.email}`}
                className="text-indigo-600 hover:underline"
              >
                {info.email}
              </a>
            </div>
          )}

          {info?.website && (
            <div className="flex gap-4 items-center">
              <Globe className="text-indigo-600" />
              <a
                href={info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Official Website
              </a>
            </div>
          )}

          {info?.google_scholar && (
            <div className="flex gap-4 items-center">
              <GraduationCap className="text-indigo-600" />
              <a
                href={info.google_scholar}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Google Scholar Profile
              </a>
            </div>
          )}

          {info?.linkedin && (
            <div className="flex gap-4 items-center">
              <Linkedin className="text-indigo-600" />
              <a
                href={info.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                LinkedIn Profile
              </a>
            </div>
          )}
        </div>

        {/* ================= CONTACT FORM ================= */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Send a Message
          </h2>

          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
              Message sent successfully. Thank you!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              required
              placeholder="Your Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={submitting}
            />

            <input
              required
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={submitting}
            />

            <input
              required
              placeholder="Subject"
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={submitting}
            />

            <textarea
              required
              rows="5"
              placeholder="Your Message"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={submitting}
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}