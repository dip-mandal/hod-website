import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function PublicProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/public/projects").then((res) => {
      setProjects(res.data);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">
        Research Projects
      </h1>

      <div className="space-y-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white shadow rounded-xl p-6 border"
          >
            <h2 className="text-xl font-semibold text-indigo-600">
              {project.title}
            </h2>

            <p className="text-gray-600 mt-2">
              <strong>Funding Agency:</strong> {project.funding_agency}
            </p>

            <p className="text-gray-600">
              <strong>Amount:</strong> ₹ {project.amount?.toLocaleString()}
            </p>

            <p className="text-gray-600">
              <strong>Status:</strong> {project.status}
            </p>

            {project.description && (
              <p className="text-gray-500 mt-3">
                {project.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}