import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, memo, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { getProjects } from "../../api/projectService";
import { ChevronDownIcon, ChevronLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";

/* ===============================
   Tooltip solo si truncado
================================ */
function TruncatedTooltip({ children }) {
  const ref = useRef(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setTruncated(ref.current.scrollWidth > ref.current.clientWidth);
    }
  }, [children]);

  return (
    <span ref={ref} className="flex-1 min-w-0 truncate relative group">
      {children}
      {truncated && (
        <span className="absolute left-0 bottom-full mb-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          {children}
        </span>
      )}
    </span>
  );
}

/* ===============================
   Project List con scroll y grupos A-Z
================================ */
const ProjectList = memo(function ProjectList({ projects, expanded, selectedProjectId }) {
  let lastInitial = null;

  return (
    <ul
      id="project-list"
      className={`relative ml-4 mt-2 overflow-hidden transition-all duration-300 ease-out ${
        expanded ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div
        className={`max-h-64 overflow-y-auto overflow-x-hidden scrollbar-hidden transition-all duration-300 ease-out`}
      >
        {projects.length === 0 ? (
          <li className="px-2 py-1 text-sm text-gray-400">No hay proyectos</li>
        ) : (
          projects.map((project) => {
            const initial = project.name.charAt(0).toUpperCase();
            const showHeader = initial !== lastInitial;
            lastInitial = initial;

            return (
              <div key={project._id}>
                {showHeader && (
                  <li className="w-6 h-6 shrink-0 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
                    {initial}
                  </li>
                )}
                <li>
                  <Link
                    to={`/project/${project._id}`}
                    className={`group flex items-center gap-2 w-full px-2 py-2 rounded text-sm transition hover:bg-blue-50 ${
                      selectedProjectId === project._id
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
                    <TruncatedTooltip>{project.name}</TruncatedTooltip>
                  </Link>
                </li>
              </div>
            );
          })
        )}
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-linear-to-t from-white to-transparent z-10" />
    </ul>
  );
});

/* ===============================
   Sidebar Desktop
================================ */
export default function SidebarDesktop() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [projects, setProjects] = useState([]);
  const [expanded, setExpanded] = useState(
    location.pathname.startsWith("/project/") ? true : false
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        const sorted = (data.projects || []).sort((a, b) =>
          a.name.localeCompare(b.name, "es", { sensitivity: "base" })
        );
        setProjects(sorted);
      } catch (err) {
        console.error("Error cargando proyectos", err);
      }
    };
    fetchProjects();
  }, []);

  const selectedProjectId = location.pathname.startsWith("/project/")
    ? location.pathname.split("/project/")[1]
    : null;

  return (
    <aside
      className={`hidden md:flex flex-col bg-white shadow-md p-6 transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16 justify-between"
      }`}
    >
      {/* Botón abrir/cerrar arriba */}
      <div className="flex flex-col items-end">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="mb-6 p-1 rounded hover:bg-gray-100"
        >
          {sidebarOpen ? (
            <ChevronLeftIcon className="w-6 h-6 transform transition-transform duration-300" />
          ) : (
            <ChevronDownIcon className="w-6 h-6 transform transition-transform duration-300" />
          )}
        </button>
      </div>

      {sidebarOpen ? (
        <>
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Nou<span className="font-light">team</span>
          </h2>

          <nav className="flex flex-col justify-between h-full">
            <div className="space-y-2">
              <Link
                to="/dashboard"
                className={`block px-4 py-2 rounded transition hover:bg-blue-200 ${
                  location.pathname === "/dashboard"
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : ""
                }`}
              >
                Dashboard
              </Link>

              <button
                onClick={() => setExpanded((p) => !p)}
                className="w-full flex justify-between items-center px-4 py-2 rounded transition hover:bg-blue-200"
              >
                <span>Proyectos</span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              <ProjectList
                projects={projects}
                expanded={expanded}
                selectedProjectId={selectedProjectId}
              />

              <Link
                to="/settings"
                className={`block px-4 py-2 rounded transition hover:bg-blue-200 ${
                  location.pathname === "/settings"
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : ""
                }`}
              >
                Configuración
              </Link>
            </div>

            {/* Botón cerrar sesión abajo */}
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mt-auto"
            >
              Salir
            </button>
          </nav>
        </>
      ) : (
        // Sidebar cerrado: solo botones arriba y abajo
        <div className="flex flex-col justify-between h-full">
          <div /> {/* espacio superior */}
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition self-center"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </aside>
  );
}
