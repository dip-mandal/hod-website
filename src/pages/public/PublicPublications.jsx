import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function PublicPublications() {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    const fetchPublications = async () => {
      const res = await api.get("/public/publications");
      setPublications(res.data);
    };

    fetchPublications();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-10 text-indigo-700">
        Publications
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {publications.map((pub) => {

          const link =
            pub.official_url ||
            (pub.doi ? `https://doi.org/${pub.doi}` : null);

          return (
            <div
              key={pub.id}
              onClick={() => link && window.open(link, "_blank")}
              className="cursor-pointer bg-white border rounded-xl shadow-sm hover:shadow-lg transition p-6 flex gap-4"
            >
              {/* Cover */}
              <img
                src={
                  pub.cover_image ||
                  "https://via.placeholder.com/120x160"
                }
                alt=""
                className="w-28 h-40 object-cover rounded"
              />

              {/* Content */}
              <div className="flex-1">

                <h3 className="font-semibold text-lg text-gray-900">
                  {pub.title}
                </h3>

                <p className="text-gray-600 text-sm mt-1">
                  {pub.authors}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  <em>
                    {pub.journal_name || pub.publisher}
                  </em>{" "}
                  ({pub.year})
                </p>

                {pub.abstract && (
                  <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                    {pub.abstract}
                  </p>
                )}

                <div className="flex gap-3 mt-4 text-xs flex-wrap">

                  {pub.is_scopus_indexed && (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      Scopus
                    </span>
                  )}

                  {pub.is_web_of_science && (
                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded">
                      WoS
                    </span>
                  )}

                  {pub.impact_factor && (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                      IF {pub.impact_factor}
                    </span>
                  )}

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}