import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { logoutUser } from "../api/authService";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error al hacer logout:", error);
    } finally {
      setOpen(false);
    }
  };

  // 🧭 Determinar el título según la ruta actual
  const getTitle = () => {
    if (location.pathname.startsWith("/dashboard")) return "Dashboard";
    if (location.pathname.startsWith("/project")) return "Proyectos";
    return "NouTeam";
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar escritorio */}
      <aside className="hidden md:flex w-64 bg-white shadow-md p-6 flex-col space-y-3">
        <h2 className="text-2xl font-bold text-blue-600">
          Nou<span className="font-light">team</span>
        </h2>
        <nav className="flex-1 flex flex-col">
          <Link
            to="/dashboard"
            className={`block px-4 py-2 rounded transition ${
              location.pathname.startsWith("/dashboard")
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-blue-100"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/project"
            className={`block px-4 py-2 rounded transition ${
              location.pathname.startsWith("/project")
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-blue-100"
            }`}
          >
            Proyectos
          </Link>

          <div className="flex-1"></div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Salir
          </button>
        </nav>
      </aside>

      {/* Drawer móvil */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0 bg-black opacity-30"
          onClick={() => setOpen(false)}
        ></div>
        <div className="relative w-64 bg-white h-full shadow-md p-6 flex flex-col">
          <button
            className="absolute top-4 right-4 text-gray-600"
            onClick={() => setOpen(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Nou<span className="font-light">team</span>
          </h2>

          <nav className="space-y-3 flex-1 flex flex-col">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 rounded transition ${
                location.pathname.startsWith("/dashboard")
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-blue-100"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/project"
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 rounded transition ${
                location.pathname.startsWith("/project")
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-blue-100"
              }`}
            >
              Proyectos
            </Link>

            <div className="flex-1"></div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Salir
            </button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-semibold">{getTitle()}</h1>
          <button onClick={() => setOpen(true)}>
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>
        </header>

        <main className="p-6 flex-1 overflow-auto">
          <h1 className="hidden md:block text-2xl font-bold mb-4 text-gray-800">
            {getTitle()}
          </h1>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
