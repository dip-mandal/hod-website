import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Trophy } from "lucide-react";

export default function PublicAwards() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await api.get("/public/awards");
        setAwards(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading awards...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 py-16 text-white text-center">
        <h1 className="text-4xl font-bold">Awards & Recognition</h1>
        <p className="mt-3 opacity-90">
          Academic achievements and honors received over the years.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">

        {awards.length === 0 ? (
          <p className="text-center text-gray-500">
            No awards available.
          </p>
        ) : (
          <div className="space-y-10">

            {awards.map((award) => (
              <div
                key={award.id}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Trophy className="text-yellow-500" size={28} />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {award.title}
                    </h2>
                    <p className="text-indigo-600 font-medium">
                      {award.organization}
                    </p>
                  </div>
                </div>

                {award.award_date && (
                  <p className="text-sm text-gray-500 mb-4">
                    Awarded on {new Date(award.award_date).toLocaleDateString()}
                  </p>
                )}

                {award.description && (
                  <p className="text-gray-700 leading-relaxed">
                    {award.description}
                  </p>
                )}
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}