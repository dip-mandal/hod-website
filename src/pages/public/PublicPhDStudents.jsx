import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function PublicPhDStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await api.get("/phd-students/?skip=0&limit=100");
      setStudents(res.data.data);
    };

    fetchStudents();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        PhD Students
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-white border rounded-xl shadow hover:shadow-lg transition p-6 text-center"
          >
            <img
              src={
                student.profile_image ||
                "https://via.placeholder.com/150"
              }
              alt=""
              className="w-28 h-28 mx-auto rounded-full object-cover mb-4"
            />

            <h2 className="font-semibold text-lg">
              {student.name}
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              {student.university}
            </p>

            <p className="text-sm text-gray-600 mb-2">
              {student.research_area}
            </p>

            <p className="text-xs text-gray-500">
              {student.bio}
            </p>

            <span
              className={`inline-block mt-3 px-3 py-1 text-xs rounded-full ${
                student.status === "completed"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {student.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}