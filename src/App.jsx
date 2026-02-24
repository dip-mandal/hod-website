import { Routes, Route, Navigate } from "react-router-dom";

/* ================= ADMIN ================= */
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Publications from "./pages/admin/Publications";
import Projects from "./pages/admin/Projects";
import PhDStudents from "./pages/admin/PhDStudents";
import Awards from "./pages/admin/Awards";
import Books from "./pages/admin/Books";
import Patents from "./pages/admin/Patents";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

/* ================= PUBLIC ================= */
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/public/Home";
import PublicPhDStudents from "./pages/public/PublicPhDStudents";
import About from "./pages/public/About";
import AdminProfile from "./pages/admin/AdminProfile";
import PublicPublications from "./pages/public/PublicPublications";
import PublicBooks from "./pages/public/PublicBooks";
import PublicProjects from "./pages/public/PublicProjects";
import PublicAwards from "./pages/public/Awards";
import PublicPatents from "./pages/public/PublicPatents";


/* ================= CONTACT ================= */
import Contact from "./pages/public/Contact";
import ContactAdmin from "./pages/admin/Contact";

/* ================= GALLERY ================= */
import Gallery from "./pages/admin/Gallery";
// import GalleryModal from "./components/GalleryModal";

// (We will add more public pages later)

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/phd-students" element={<PublicPhDStudents />} />
        <Route path="/about" element={<About />} />
        <Route path="/publications" element={<PublicPublications />} />
        <Route path="books" element={<PublicBooks />} />
        <Route path="projects" element={<PublicProjects />} />
        <Route path="patents" element={<PublicPatents />} />
        <Route path="/awards" element={<PublicAwards />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* ================= ADMIN LOGIN ================= */}
      <Route path="/admin/login" element={<Login />} />

      {/* ================= ADMIN PROTECTED ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="publications" element={<Publications />} />
        <Route path="projects" element={<Projects />} />
        <Route path="phd-students" element={<PhDStudents />} />
        <Route path="awards" element={<Awards />} />
        <Route path="books" element={<Books />} />
        <Route path="patents" element={<Patents />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="contact" element={<ContactAdmin />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;