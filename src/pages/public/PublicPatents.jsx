import { useEffect, useState } from "react";
import api from "../../api/axios";

function getStatusColor(status) {
  if (!status) return "bg-gray-100 text-gray-600";

  switch (status.toLowerCase()) {
    case "granted":
      return "bg-green-100 text-green-700";
    case "published":
      return "bg-blue-100 text-blue-700";
    case "filed":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function PublicPatents() {
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/public/patents")
      .then((res) => {
        setPatents(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch patents:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading patents...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Page Header */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
        Patents & Intellectual Property
      </h1>

      <p className="text-center text-gray-500 mb-16">
        Innovations and Contributions to Research & Technology
      </p>

      {patents.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          No patents available.
        </div>
      ) : (
        <div className="relative border-l-2 border-indigo-200 space-y-12 pl-8">
          {patents.map((patent) => (
            <div key={patent.id} className="relative">

              {/* Timeline Dot */}
              <div className="absolute -left-[10px] top-2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow"></div>

              <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">

                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-800">
                  {patent.title}
                </h2>

                {/* Badges Row */}
                <div className="flex flex-wrap gap-2 mt-3">

                  {patent.status && (
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(patent.status)}`}
                    >
                      {patent.status}
                    </span>
                  )}

                  {patent.patent_type && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-600">
                      {patent.patent_type}
                    </span>
                  )}

                </div>

                {/* Meta Info */}
                <div className="mt-4 text-sm text-gray-600 space-y-1">

                  {patent.application_number && (
                    <p>
                      <strong>Application No:</strong> {patent.application_number}
                    </p>
                  )}

                  {patent.registration_number && (
                    <p>
                      <strong>Registration No:</strong> {patent.registration_number}
                    </p>
                  )}

                  {patent.filing_date && (
                    <p>
                      <strong>Filing Date:</strong> {patent.filing_date}
                    </p>
                  )}

                  {patent.publication_date && (
                    <p>
                      <strong>Publication Date:</strong> {patent.publication_date}
                    </p>
                  )}

                  {patent.issue_date && (
                    <p>
                      <strong>Issue Date:</strong> {patent.issue_date}
                    </p>
                  )}

                  {patent.inventors && (
                    <p className="mt-3 text-gray-700">
                      <strong>Inventors:</strong> {patent.inventors}
                    </p>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}