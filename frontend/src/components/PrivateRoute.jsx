import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function PrivateRoute() {
  const isAuth = useAuthStore((state) => state.isAuth);
  const token = useAuthStore((state) => state.token);

  if (token === null) return <p>Cargando...</p>;

  if (!isAuth) return <Navigate to="/login" replace />;

  return <Outlet />;
}
