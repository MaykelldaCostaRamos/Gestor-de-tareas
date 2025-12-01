import { Link, useLocation } from "react-router-dom";

export default function NavLinkItem({ to, label, onClick }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-4 py-2 rounded transition ${
        isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
}
