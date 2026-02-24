import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

const linkClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium w-full";
const activeLinkClass = "bg-blue-50 text-blue-700 border-l-4 border-blue-700";
const inactiveLinkClass = "text-gray-700 hover:bg-gray-50 hover:text-blue-600";

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <h1 className="font-bold text-xl text-blue-800 hover:text-blue-600 transition-colors cursor-default tracking-tight">
              Dr. Arindam Biswas
            </h1>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`
                }
              >
                About
              </NavLink>
              <NavLink 
                to="/phd-students" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`
                }
              >
                PhD Students
              </NavLink>
              <NavLink 
                to="/publications" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`
                }
              >
                Publications
              </NavLink>
              <NavLink 
                to="/books" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`
                }
              >
                Books
              </NavLink>
              <NavLink 
                to="/projects" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`
                }
              >
                Projects
              </NavLink>
              <NavLink 
                to="/patents" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`
                }
              >
                Patents
              </NavLink>
              <NavLink 
                to="/awards" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`
                }
              >
                Awards
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`
                }
              >
                Contact
              </NavLink>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
            <NavLink 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
              }
            >
              About
            </NavLink>
            <NavLink 
              to="/phd-students" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
              }
            >
              PhD Students
            </NavLink>
            <NavLink 
              to="/publications" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
              }
            >
              Publications
            </NavLink>
            <NavLink 
              to="/books" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
              }
            >
              Books
            </NavLink>
            <NavLink 
              to="/projects" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
              }
            >
              Projects
            </NavLink>
            <NavLink 
              to="/patents" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
              }
            >
              Patents
            </NavLink>
            <NavLink 
              to="/awards" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
              }
            >
              Awards
            </NavLink>
            <NavLink 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
              }
            >
              Contact
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            
            {/* Left section */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Dr. Arindam Biswas</h3>
              <p className="text-sm text-gray-600">Professor & Researcher</p>
              <p className="text-sm text-gray-500">Department of Computer Science</p>
            </div>

            {/* Center section */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Quick Links</h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Publications</a>
                <span className="text-gray-300">|</span>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Projects</a>
                <span className="text-gray-300">|</span>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              </div>
            </div>

            {/* Right section */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Connect</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.294 2.75-1.025 2.75-1.025.545 1.376.201 2.393.099 2.646.64.698 1.03 1.591 1.03 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Dr. Arindam Biswas. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Academic Portfolio | Excellence in Research & Education
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}