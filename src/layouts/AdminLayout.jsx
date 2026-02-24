import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  GraduationCap,
  Award,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Book, FileBadge } from "lucide-react";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition";

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8 text-indigo-600">
          Academic CMS
        </h2>

        <nav className="flex flex-col gap-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/publications"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <BookOpen size={20} />
            Publications
          </NavLink>

          <NavLink
  to="/admin/books"
  className={({ isActive }) =>
    `${linkClass} ${
      isActive
        ? "bg-indigo-100 text-indigo-600 font-semibold"
        : "text-gray-600 hover:bg-gray-100"
    }`
  }
>
  <Book size={20} />
  Books
</NavLink>

          <NavLink
            to="/admin/projects"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <FolderKanban size={20} />
            Projects
          </NavLink>

          <NavLink
            to="/admin/phd-students"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <GraduationCap size={20} />
            PhD Students
          </NavLink>

          <NavLink
            to="/admin/awards"
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Award size={20} />
            Awards
          </NavLink>


          

<NavLink
  to="/admin/patents"
  className={({ isActive }) =>
    `${linkClass} ${
      isActive
        ? "bg-indigo-100 text-indigo-600 font-semibold"
        : "text-gray-600 hover:bg-gray-100"
    }`
  }
>
  <FileBadge size={20} />
  Patents
</NavLink>

<NavLink
  to="/admin/gallery"
  className={({ isActive }) =>
    `${linkClass} ${
      isActive
        ? "bg-indigo-100 text-indigo-600 font-semibold"
        : "text-gray-600 hover:bg-gray-100"
    }`
  }
>
  <FolderKanban size={20} />
  Gallery
</NavLink>


<NavLink
  to="/admin/contact"
  className={({ isActive }) =>
    `${linkClass} ${
      isActive
        ? "bg-indigo-100 text-indigo-600 font-semibold"
        : "text-gray-600 hover:bg-gray-100"
    }`
  }
>
  <FolderKanban size={20} />
  Contact
</NavLink>



<NavLink
  to="/admin/profile"
  className={({ isActive }) =>
    `${linkClass} ${
      isActive
        ? "bg-indigo-100 text-indigo-600 font-semibold"
        : "text-gray-600 hover:bg-gray-100"
    }`
  }
>
  👤 Profile Settings
</NavLink>



        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 flex items-center gap-3 text-red-500 hover:text-red-700"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}