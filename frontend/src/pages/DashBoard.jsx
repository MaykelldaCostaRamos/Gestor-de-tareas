import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-lg text-gray-600">Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold transition"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Nuevo Proyecto
        </button>
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      {/* Lista de proyectos */}
      <div className="gap-6 grid max-w-[620px] md:grid-cols-3 md:max-w-full">
        {projects.map((project) => (
          <Link key={project._id} to={`/project/${project._id}`}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="p-5 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border border-gray-100 transition cursor-pointer"
            >
              {/* Título + botones */}
              <div className="grid grid-cols-[1fr_auto] items-center mb-3 gap-4">
                <h3 className="font-bold text-lg text-gray-800 truncate">
                  {project.name}
                </h3>

                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openEditModal(project);
                    }}
                    className="p-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition"
                  >
                    <PencilSquareIcon className="w-5 h-5 text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
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
          </Link>
        ))}
      </div>

      {/* MODAL CREAR */}
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
                className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-between mt-5">
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

      {/* MODAL EDITAR */}
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
                className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-end mt-5 space-x-2">
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
