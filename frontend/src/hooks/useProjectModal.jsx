import { useState } from "react";
import { createProject, updateProject } from "../api/projectService";

export default function useProjectModal(initialProjects = []) {
  const [projects, setProjects] = useState(initialProjects);

  // Formulario (solo nombre)
  const [formState, setFormState] = useState({
    name: "",
  });

  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProject, setEditProject] = useState(null);

  // Error
  const [error, setError] = useState(null);

  // Abrir modal crear
  const openCreateModal = () => {
    setFormState({ name: "" });
    setShowCreateModal(true);
  };

  // Abrir modal editar
  const openEditModal = (project) => {
    setEditProject(project);
    setFormState({
      name: project.name,
    });
    setShowEditModal(true);
  };

  // Cerrar modales
  const closeModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditProject(null);
    setFormState({ name: "" });
    setError(null);
  };

  // Crear proyecto
  const handleCreate = async () => {
    if (!formState.name.trim()) return;

    try {
      const { project } = await createProject(formState.name.trim());
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
        formState.name.trim()
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
