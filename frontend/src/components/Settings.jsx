import { useAuthStore } from "../store/authStore";
import { deleteUser } from "../api/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Settings() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    if (!window.confirm("¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible.")) return;

    try {
      setLoading(true);
      await deleteUser(); // Llama a tu API
      logout(); // Limpia Zustand y localStorage
      navigate("/"); // Redirige al landing
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Error al eliminar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Configuración</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleDeleteAccount}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        {loading ? "Eliminando..." : "Eliminar mi cuenta"}
      </button>
    </div>
  );
}
