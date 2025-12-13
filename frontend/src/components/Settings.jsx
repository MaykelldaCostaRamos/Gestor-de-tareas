import { useAuthStore } from "../store/authStore";
import { deleteUser } from "../api/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useConfirmModal } from "../hooks/useConfirmModal";
import ConfirmModal from "../components/common/ConfirmModal";

export default function Settings() {
  const { modal, openConfirm, closeConfirm } = useConfirmModal();
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    const confirm = await openConfirm(
      "¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible."
    );

    if (!confirm) return;

    try {
      setLoading(true);
      await deleteUser(); // Llama a tu API
      logout(); // Limpia Zustand y localStorage
      navigate("/"); // Redirige al landing
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al eliminar la cuenta"
      );
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="flex justify-center items-center min-h-[70vh] px-4">
    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl p-10 max-w-xl w-full text-center border border-gray-200">

      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Eliminar cuenta
      </h1>

      <p className="text-gray-600 mb-8 leading-relaxed">
        Si eliminas tu cuenta, todos tus proyectos, tareas y datos asociados 
        serán eliminados permanentemente.
      </p>

      {error && (
        <p className="text-red-600 font-medium mb-4">{error}</p>
      )}

      <button
        disabled={loading}
        onClick={handleDeleteAccount}
        className={`
          w-full max-w-xs mx-auto block
          bg-red-600 text-white font-medium px-6 py-3 rounded-lg 
          hover:bg-red-700 transition
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
      >
        {loading ? "Eliminando..." : "Eliminar cuenta"}
      </button>
    </div>

    <ConfirmModal modal={modal} closeConfirm={closeConfirm} />
  </div>
);

}
