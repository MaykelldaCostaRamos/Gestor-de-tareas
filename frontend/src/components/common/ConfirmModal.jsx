// ConfirmModal.jsx
export default function ConfirmModal({ modal, closeConfirm }) {
  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-center">
        <p className="mb-4">{modal.message}</p>

        <div className="flex gap-4 justify-center">
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={() => closeConfirm(false)}
          >
            Cancelar
          </button>

          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => closeConfirm(true)}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
