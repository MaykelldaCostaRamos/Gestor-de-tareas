import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, memo } from "react";
import { useAuthStore } from "../../store/authStore";
import CloseButton from "../common/CloseButton";
import { getProjects } from "../../api/projectService";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Componente para listar proyectos al estilo Desktop
const ProjectList = memo(function ProjectList({ projects, expanded, selectedProjectId, setOpen }) {
  return (
    <ul
      id="project-list"
      className={`ml-4 mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
        expanded ? "max-h-64" : "max-h-0"
      }`}
    >
      <div className={`overflow-y-auto ${expanded ? "max-h-64" : "max-h-0"} transition-all`}>
        {projects.length === 0 ? (
          <li className="px-2 py-1 text-sm text-gray-400">No hay proyectos</li>
        ) : (
          projects.map((project) => (
            <li key={project._id}>
              <Link
                to={`/project/${project._id}`}
                onClick={() => setOpen(false)}
                className={`flex items-center px-2 py-2 rounded text-sm transition transform hover:scale-105 hover:bg-blue-50 ${
                  selectedProjectId === project._id ? "bg-blue-100 text-blue-700 font-semibold" : ""
                }`}
              >
                {/* Icono con inicial del proyecto */}
                <div className="w-6 h-6 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center mr-2 text-xs font-semibold">
                  {project.name.charAt(0).toUpperCase()}
                </div>
                {project.name}
              </Link>
            </li>
          ))
        )}
      </div>
    </ul>
  );
});

export default function SidebarMobile({ open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [projects, setProjects] = useState([]);
  const [expanded, setExpanded] = useState(false);

  // Cargar proyectos y ordenarlos alfabéticamente
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        const sortedProjects = (data.projects || []).sort((a, b) =>
          a.name.localeCompare(b.name, "es", { sensitivity: "base" })
        );
        setProjects(sortedProjects);
      } catch (err) {
        console.error("Error cargando proyectos", err);
      }
    };
    fetchProjects();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/project", label: "Proyectos" },
    { to: "/settings", label: "Configuración" },
  ];

  const selectedProjectId = location.pathname.startsWith("/project/")
    ? location.pathname.split("/project/")[1]
    : null;

  return (
    <div
      className={`fixed inset-0 z-40 md:hidden transition-transform transform ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black opacity-30"
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <div className="relative w-64 bg-white h-full shadow-md p-6 flex flex-col">
        <CloseButton onClick={() => setOpen(false)} />

        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          Nou<span className="font-light">team</span>
        </h2>

        <nav className="flex flex-col justify-between h-full">
          <div className="space-y-2">
            {navLinks.map(({ to, label }) => (
              <div key={to}>
                {label === "Proyectos" && projects.length > 0 ? (
                  <button
                    aria-expanded={expanded}
                    aria-controls="project-list"
                    onClick={() => setExpanded(!expanded)}
                    className={`w-full flex justify-between items-center px-4 py-2 rounded transition hover:bg-blue-50 ${
                      location.pathname.startsWith(to)
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
                    <span>{label}</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 transform transition-transform duration-300 ${
                        expanded ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={to}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-2 rounded transition hover:bg-blue-50 ${
                      location.pathname.startsWith(to)
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
                    {label}
                  </Link>
                )}

                {label === "Proyectos" && (
                  <ProjectList
                    projects={projects}
                    expanded={expanded}
                    selectedProjectId={selectedProjectId}
                    setOpen={setOpen}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Salir
          </button>
        </nav>
      </div>
    </div>
  );
}
