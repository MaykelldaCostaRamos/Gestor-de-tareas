
import { useState } from "react";
import { createProject, updateProject } from "../api/projectService";

export default function useProjectModal(initialProjects = []) {
  const [projects, setProjects] = useState(initialProjects);

  // Formularios
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    date: null,
  });

  // Modal Crear
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Modal Editar
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProject, setEditProject] = useState(null);

  // Error
  const [error, setError] = useState(null);

  // Abrir modal crear
  const openCreateModal = () => {
    setFormState({ name: "", description: "", date: null });
    setShowCreateModal(true);
  };

  // Abrir modal editar
  const openEditModal = (project) => {
    setEditProject(project);
    setFormState({
      name: project.name,
      description: project.description || "",
      date: project.date || null,
    });
    setShowEditModal(true);
  };

  // Cerrar cualquier modal
  const closeModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditProject(null);
    setFormState({ name: "", description: "", date: null });
    setError(null);
  };

  // Crear proyecto
  const handleCreate = async () => {
    if (!formState.name.trim()) return;

    try {
      const { project } = await createProject(
        formState.name.trim(),
        formState.description.trim(),
        formState.date
      );
      setProjects((prev) => [...prev, project]);
      closeModal();
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el proyecto.");
    }
  };

  // Editar proyecto
  const handleEdit = async () => {
    if (!editProject) return;

    try {
      const updated = await updateProject(
        editProject._id,
        formState.name.trim(),
        formState.description.trim(),
        formState.date
      );
      setProjects((prev) =>
        prev.map((p) => (p._id === editProject._id ? updated : p))
      );
      closeModal();
    } catch (err) {
      console.error(err);
      setError("No se pudo editar el proyecto.");
    }
  };

  return {
    projects,
    setProjects,
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
