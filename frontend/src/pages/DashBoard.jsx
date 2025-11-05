import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { PencilSquareIcon, TrashIcon, XMarkIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { getProjects, createProject, deleteProject, updateProject } from "../api/projectService";
import Calendar from "../components/Calendar";

export default function Dashboard() {
  const [proyectos, setProyectos] = useState([]);
  const [nuevoProyecto, setNuevoProyecto] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [date, setDate] = useState(null); // CAMBIO: iniciar en null para calendario vacío
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal de creación
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState(null); // CAMBIO: iniciar en null

  // Cargar proyectos
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProyectos(data.projects || []);
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

  // Crear nuevo proyecto
  const handleCrearProyecto = async () => {
    if (!nuevoProyecto.trim()) return;
    try {
      const { project } = await createProject(
        nuevoProyecto.trim(),
        nuevaDescripcion.trim(),
        date
      );
      setProyectos((prev) => [...prev, project]);
      setNuevoProyecto("");
      setNuevaDescripcion("");
      setDate(null); // CAMBIO: resetear a null
      setShowCreateModal(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el proyecto.");
    }
  };

  // Abrir modal edición
  const openEditModal = (project) => {
    setEditProject(project);
    setEditName(project.name);
    setEditDescription(project.description || "");
    setEditDate(project.date || null); // CAMBIO: usar null si no hay fecha
    setShowEditModal(true);
  };

  // Guardar edición
  const handleGuardarEdicion = async () => {
    try {
      const updated = await updateProject(
        editProject._id,
        editName.trim(),
        editDescription.trim(),
        editDate
      );
      setProyectos((prev) =>
        prev.map((p) => (p._id === editProject._id ? updated : p))
      );
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo editar el proyecto.");
    }
  };

  // Eliminar proyecto
  const handleEliminarProyecto = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProyectos((prev) => prev.filter((p) => p._id !== projectId));
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
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold transition"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Nuevo Proyecto
        </button>
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      {/* Lista de proyectos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map((project) => (
          <motion.div
            key={project._id}
            whileHover={{ scale: 1.03 }}
            className="p-5 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border border-gray-100 transition"
          >
            <Link to={`/project/${project._id}`} className="block mb-3">
              <h3 className="font-bold text-lg text-gray-800">{project.name}</h3>
              {project.description && (
                <p className="text-gray-500 mt-1 text-sm">{project.description}</p>
              )}
              {project.date && (
                <p className="text-xs text-gray-400 mt-1">
                  Entrega:{" "}
                  {new Date(project.date).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </Link>
            <div className="flex space-x-2">
              <button
                onClick={() => openEditModal(project)}
                className="p-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition"
              >
                <PencilSquareIcon className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => handleEliminarProyecto(project._id)}
                className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
              >
                <TrashIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Crear Proyecto */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
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
                onClick={() => setShowCreateModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Nuevo Proyecto</h3>

              <input
                type="text"
                value={nuevoProyecto}
                onChange={(e) => setNuevoProyecto(e.target.value)}
                placeholder="Nombre del proyecto"
                className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={nuevaDescripcion}
                onChange={(e) => setNuevaDescripcion(e.target.value)}
                placeholder="Descripción del proyecto"
                className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Calendar value={date} onChange={setDate} />

              <div className="flex justify-end mt-5 space-x-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCrearProyecto}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  Crear Proyecto
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Editar Proyecto */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
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
                onClick={() => setShowEditModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Editar Proyecto</h3>

              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Calendar value={editDate} onChange={setEditDate} />

              <div className="flex justify-end mt-5 space-x-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarEdicion}
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