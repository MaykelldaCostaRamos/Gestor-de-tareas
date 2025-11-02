import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { logoutUser } from "../api/authService";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

 const handleLogout = async () => {
  try {
    await logoutUser(); // axios ya apunta al backend
    localStorage.removeItem("token");
    navigate("/");
  } catch (error) {
    console.error("Error al hacer logout:", error);
  } finally {
    setOpen(false);
  }

};

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar escritorio */}
      <aside className="hidden md:flex w-64 bg-white shadow-md p-6 flex-col">
        <h2 className="text-xl font-bold mb-6">Nouteam</h2>
        <nav className="space-y-3 flex-1 flex flex-col">
          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded hover:bg-blue-100 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/project"
            className="block px-4 py-2 rounded hover:bg-blue-100 transition"
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
          <h2 className="text-xl font-bold mb-6">Nouteam</h2>
          <nav className="space-y-3 flex-1 flex flex-col">
            <Link
              to="/dashboard"
              className="block px-4 py-2 rounded hover:bg-blue-100 transition"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/project"
              className="block px-4 py-2 rounded hover:bg-blue-100 transition"
              onClick={() => setOpen(false)}
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
          <h1 className="text-xl font-semibold">Mi Panel</h1>
          <button onClick={() => setOpen(true)}>
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>
        </header>

        <main className="p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
