import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import CloseButton from "../common/CloseButton";

export default function SidebarMobile({ open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/project", label: "Proyectos" },
    { to: "/settings", label: "⚙️ Configuración" },
  ];

  return (
    <div
      className={`fixed inset-0 z-40 md:hidden transition-transform transform ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-black opacity-30" onClick={() => setOpen(false)} />

      {/* Sidebar */}
      <div className="relative w-64 bg-white h-full shadow-md p-6 flex flex-col">
        <CloseButton onClick={() => setOpen(false)} />

        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          Nou<span className="font-light">team</span>
        </h2>

        <nav className="space-y-3 flex-1 flex flex-col">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 rounded transition ${
                location.pathname.startsWith(to)
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-blue-100"
              }`}
            >
              {label}
            </Link>
          ))}

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
  );
}
