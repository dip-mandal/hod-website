import { useEffect, useState } from "react";
import api from "../../api/axios";
import { BookOpen, FolderKanban, FileText, GraduationCap } from "lucide-react";

export default function About() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      const res = await api.get("/public/faculty");
      setData(res.data);
    };

    fetchFaculty();
  }, []);

  if (!data) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  const { profile, metrics } = data;

  const statCards = [
    {
      label: "Publications",
      value: metrics.publications,
      icon: <BookOpen size={20} />,
    },
    {
      label: "Projects",
      value: metrics.projects,
      icon: <FolderKanban size={20} />,
    },
    {
      label: "Patents",
      value: metrics.patents,
      icon: <FileText size={20} />,
    },
    {
      label: "PhD Supervised",
      value: metrics.phd_students,
      icon: <GraduationCap size={20} />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">

      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        <img
          src={
            profile.profile_image ||
            "https://via.placeholder.com/200"
          }
          alt=""
          className="w-52 h-52 rounded-full object-cover shadow-xl"
        />

        <div>
          <h1 className="text-4xl font-bold text-indigo-700">
            {profile.full_name}
          </h1>

          <p className="text-lg text-gray-600 mt-2">
            {profile.designation}
          </p>

          <p className="text-gray-500 mt-1">
            {profile.department}, {profile.university}
          </p>

          <p className="mt-3 text-gray-700">
            📧 {profile.email}
          </p>
        </div>
      </div>

      {/* METRICS SECTION */}
      <div className="grid md:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-white border rounded-xl p-6 text-center shadow hover:shadow-lg transition"
          >
            <div className="flex justify-center mb-3 text-indigo-600">
              {card.icon}
            </div>
            <h3 className="text-2xl font-bold">{card.value}</h3>
            <p className="text-gray-500 text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      {/* FUNDING SECTION */}
      <div className="bg-indigo-50 p-8 rounded-xl text-center shadow">
        <h2 className="text-xl font-semibold mb-2">
          Total Research Funding
        </h2>
        <p className="text-3xl font-bold text-indigo-700">
          ₹ {metrics.funding.toLocaleString("en-IN")}
        </p>
      </div>

      {/* BIO */}
      <div className="bg-gray-50 p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">
          Biography
        </h2>

        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {profile.bio}
        </p>
      </div>

    </div>
  );
}