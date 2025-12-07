// useModal.js
import { useState } from "react";

export function useConfirmModal() {
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    resolve: null
  });

  const openConfirm = (message) => {
    return new Promise((resolve) => {
      setModal({ isOpen: true, message, resolve });
    });
  };

  const closeConfirm = (result) => {
    modal.resolve(result);
    setModal({ ...modal, isOpen: false });
  };

  return {
    modal,
    openConfirm,
    closeConfirm
  };
}
