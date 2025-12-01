
import { useState } from "react";
import { createTask, updateTask } from "../api/projectService";

export default function useTaskModal(initialTasks = [], projectId = null) {
  const [tasks, setTasks] = useState(initialTasks);

  // Formulario
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    date: null,
  });

  // Modal crear
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Modal editar
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Error
  const [error, setError] = useState(null);

  // Abrir modal crear
  const openCreateModal = () => {
    setFormState({ name: "", description: "", date: null });
    setShowCreateModal(true);
  };

  // Abrir modal editar
  const openEditModal = (task) => {
    setEditTask(task);
    setFormState({
      name: task.title,
      description: task.description || "",
      date: task.date || null,
    });
    setShowEditModal(true);
  };

  // Cerrar cualquier modal
  const closeModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditTask(null);
    setFormState({ name: "", description: "", date: null });
    setError(null);
  };

  // Crear tarea
  const handleCreate = async () => {
    if (!formState.name.trim() || !projectId) return;

    try {
      const tarea = await createTask(
        projectId,
        formState.name.trim(),
        formState.description.trim(),
        formState.date
      );
      setTasks((prev) => [...prev, tarea]);
      closeModal();
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la tarea.");
    }
  };

  // Editar tarea
  const handleEdit = async () => {
    if (!editTask) return;

    try {
      const updated = await updateTask(editTask._id, {
        title: formState.name.trim(),
        description: formState.description.trim(),
        date: formState.date,
      });
      setTasks((prev) => prev.map((t) => (t._id === editTask._id ? updated : t)));
      closeModal();
    } catch (err) {
      console.error(err);
      setError("No se pudo editar la tarea.");
    }
  };

  return {
    tasks,
    setTasks,
    formState,
    setFormState,
    showCreateModal,
    showEditModal,
    error,
    openCreateModal,
    openEditModal,
    closeModal,
    handleCreate,
    handleEdit,
  };
}
