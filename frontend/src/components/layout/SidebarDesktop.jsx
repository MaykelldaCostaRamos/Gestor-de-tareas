import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function SidebarDesktop() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/project", label: "Proyectos" },
    { to: "/settings", label: "Configuración" },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white shadow-md p-6 flex-col space-y-3 relative z-10">
      <h2 className="text-2xl font-bold text-blue-600">
        Nou<span className="font-light">team</span>
      </h2>
      <nav className="flex-1 flex flex-col">
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
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
    </aside>
  );
}
