import React, { useEffect, useState } from "react";
import {
  PlusCircleIcon,
  XMarkIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import {
  getProjects,
  getProject,
  toggleTaskState,
  deleteTask,
} from "../api/projectService";
import Calendar from "../components/Calendar";
import { motion, AnimatePresence } from "framer-motion";
import useTaskModal from "../hooks/useTaskModal";

export default function Project() {
  const { id } = useParams();
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Hook para tareas
  const {
    tasks,
    setTasks,
    formState,
    setFormState,
    showCreateModal,
    showEditModal,
    openCreateModal,
    openEditModal,
    closeModal,
    handleCreate,
    handleEdit,
  } = useTaskModal([], proyectoSeleccionado?._id);

  // Fetch proyectos
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProyectos(data.projects || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleUnauthorized();
      else setError("No se pudieron cargar los proyectos.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch proyecto y tareas
  const fetchProjectDetails = async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getProject(projectId);
      setProyectoSeleccionado(data.project);
      setTasks(data.tareas || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleUnauthorized();
      else {
        setError(
          err.response?.data?.message || "No se pudo cargar el proyecto."
        );
        setProyectoSeleccionado(null);
        setTasks([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    if (id) fetchProjectDetails(id);
  }, [id]);

  const toggleEstado = async (taskId) => {
    try {
      const updated = await toggleTaskState(taskId);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleUnauthorized();
      else setError("No se pudo cambiar el estado.");
    }
  };

  const eliminarTarea = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleUnauthorized();
      else setError("No se pudo eliminar la tarea.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-lg text-gray-600">Cargando tareas...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-6 space-y-10 overflow-auto">
      {/* Botón y selector */}
      <div className="md:flex gap-4 justify-between items-center">
        {/* Botón Nueva Tarea – solo si hay proyecto seleccionado */}
        {proyectoSeleccionado && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold transition"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Nueva Tarea
          </button>
        )}

        {/* Selector de proyecto*/} 
        <div>
          {proyectos.length > 0 && (
            <select
              value={proyectoSeleccionado?._id || ""}
              onChange={(e) => fetchProjectDetails(e.target.value)}
              className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar proyecto</option>
              {proyectos.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* MENSAJES SEGÚN ESTADO */}
      {proyectos.length === 0 && (
        <p className="text-gray-500 text-lg mt-6">
          No tienes proyectos creados. Crea uno para empezar.
        </p>
      )}

      {proyectos.length > 0 && !proyectoSeleccionado && (
        <p className="text-gray-500 text-lg mt-6">
          Selecciona un proyecto para ver sus tareas.
        </p>
      )}

      {proyectoSeleccionado && tasks.length === 0 && (
        <p className="text-gray-500 text-lg mt-6">
          Este proyecto no tiene tareas. Crea tu primera tarea.
        </p>
      )}

      {/* GRID DE TAREAS */}
      {proyectoSeleccionado && tasks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white/90 p-4 rounded-2xl shadow-md flex flex-col justify-between transition transform hover:scale-105"
            >
              <div className="flex flex-col flex-1 mb-4">
                <div className="flex items-center space-x-2">
                  {task.status === "completada" ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  ) : (
                    <PencilSquareIcon className="w-5 h-5 text-yellow-600" />
                  )}
                  <span
                    className={
                      task.status === "completada"
                        ? "line-through font-semibold"
                        : "font-semibold"
                    }
                  >
                    {task.title}
                  </span>
                </div>
                {task.description && (
                  <p className="text-gray-500 text-sm mt-1">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => openEditModal(task)}
                  className="p-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition"
                >
                  <PencilSquareIcon className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => eliminarTarea(task._id)}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
                >
                  <TrashIcon className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => toggleEstado(task._id)}
                  className={`px-3 py-1 rounded-lg text-white font-medium transition ${
                    task.status === "completada"
                      ? "bg-green-400 hover:bg-green-500"
                      : "bg-yellow-400 hover:bg-yellow-500"
                  }`}
                >
                  {task.status === "completada" ? "Completada" : "Pendiente"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL Crear/Editar */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
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
                {showCreateModal ? "Nueva Tarea" : "Editar Tarea"}
              </h3>

              <input
                type="text"
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                placeholder="Nombre de la tarea"
                className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                value={formState.description}
                onChange={(e) =>
                  setFormState({ ...formState, description: e.target.value })
                }
                placeholder="Descripción de la tarea"
                className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <Calendar
                value={formState.date}
                onChange={(date) => setFormState({ ...formState, date })}
              />

              <div className="flex justify-end mt-5 space-x-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>

                <button
                  onClick={showCreateModal ? handleCreate : handleEdit}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  {showCreateModal ? "Crear" : "Guardar cambios"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
