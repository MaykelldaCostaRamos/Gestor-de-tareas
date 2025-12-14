import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

import { getProjects, deleteProject } from "../api/projectService";
import useProjectModal from "../hooks/useProjectModal";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {
    projects,
    setProjects,
    formState,
    setFormState,
    showCreateModal,
    showEditModal,
    openCreateModal,
    openEditModal,
    closeModal,
    handleCreate,
    handleEdit,
  } = useProjectModal();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los proyectos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEliminarProyecto = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el proyecto.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-1 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-lg text-gray-600">Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-6 space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold transition"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Nuevo Proyecto
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {/* GRID DE PROYECTOS */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <motion.div
            key={project._id}
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate(`/project/${project._id}`)}
            className="relative p-6 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border border-gray-100 transition cursor-pointer"
          >
            {/* TÍTULO */}
            <h3 className="font-bold text-lg text-gray-800 mb-4">
              {project.name}
            </h3>

            {/* ACCIONES */}
            <div className="flex justify-between items-center">
              {/* Acción rápida tipo Trello */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/project/${project._id}?newTask=true`);
                }}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <PlusCircleIcon className="w-4 h-4" />
                Tarea
              </button>

              {/* Editar / Eliminar */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(project);
                  }}
                  className="p-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition"
                >
                  <PencilSquareIcon className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEliminarProyecto(project._id);
                  }}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
                >
                  <TrashIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ===== MODAL CREAR PROYECTO ===== */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Nuevo Proyecto
              </h3>

              <input
                type="text"
                value={formState.name}
                onChange={(e) => setFormState({ name: e.target.value })}
                placeholder="Nombre del proyecto"
                className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-between">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  Crear Proyecto
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MODAL EDITAR PROYECTO ===== */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Editar Proyecto
              </h3>

              <input
                type="text"
                value={formState.name}
                onChange={(e) => setFormState({ name: e.target.value })}
                className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEdit}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  Guardar cambios
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
