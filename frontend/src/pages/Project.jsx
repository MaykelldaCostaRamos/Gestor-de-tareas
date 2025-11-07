import React, { useEffect, useState } from "react";
import { CheckCircleIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  getProjects,
  getProject,
  createTask,
  toggleTaskState,
  deleteTask,
  updateTask,
} from "../api/projectService";
import { useParams } from "react-router-dom";

export default function Project() {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const handleUnauthorized = () => {
    // Token inválido o expirado
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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

  const fetchProjectDetails = async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getProject(projectId);
      setProyectoSeleccionado(data.project);
      setTareas(data.tareas || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleUnauthorized();
      else {
        setError(err.response?.data?.message || "No se pudo cargar el proyecto.");
        setProyectoSeleccionado(null);
        setTareas([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    if(id){
      fetchProjectDetails(id);
    }

  }, [id]);

  const agregarTarea = async () => {
    if (!nuevaTarea.trim() || !proyectoSeleccionado) return;
    try {
      const tarea = await createTask(
        proyectoSeleccionado._id,
        nuevaTarea.trim(),
        nuevaDescripcion.trim()
      );
      setTareas((prev) => [...prev, tarea]);
      setNuevaTarea("");
      setNuevaDescripcion("");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleUnauthorized();
      else setError(err.response?.data?.message || "No se pudo crear la tarea.");
    }
  };

  const toggleEstado = async (taskId) => {
    try {
      const updated = await toggleTaskState(taskId);
      setTareas((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleUnauthorized();
      else setError("No se pudo cambiar el estado.");
    }
  };

  const eliminarTarea = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTareas((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleUnauthorized();
      else setError("No se pudo eliminar la tarea.");
    }
  };

  const editarTarea = async (taskId) => {
    const tarea = tareas.find((t) => t._id === taskId);
    const nuevoTitulo = prompt("Nuevo título de la tarea:", tarea.title);
    if (nuevoTitulo === null) return;
    const nuevaDesc = prompt("Nueva descripción (opcional):", tarea.description || "");
    try {
      const updated = await updateTask(taskId, { title: nuevoTitulo, description: nuevaDesc });
      setTareas((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleUnauthorized();
      else setError("No se pudo editar la tarea.");
    }
  };

  if (loading) return <div className="p-6">Cargando proyecto...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-4">
        {proyectos.length === 0 ? (
          <p className="text-gray-500">Sin proyectos existentes</p>
        ) : (
          <select
            value={proyectoSeleccionado?._id || ""}
            onChange={(e) => fetchProjectDetails(e.target.value)}
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar proyecto</option>
            {proyectos.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        )}
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {proyectoSeleccionado && (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{proyectoSeleccionado.name}</h2>
          {proyectoSeleccionado.description && <p className="text-gray-500 mb-4">{proyectoSeleccionado.description}</p>}

          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <input
              type="text"
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              placeholder="Título de la tarea..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={nuevaDescripcion}
              onChange={(e) => setNuevaDescripcion(e.target.value)}
              placeholder="Descripción (opcional)"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={agregarTarea}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              Agregar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {tareas.map((tarea) => (
              <div key={tarea._id} className="bg-white/90 p-4 rounded-2xl shadow-md flex flex-col items-start justify-between transition transform hover:scale-105">
                <div className="flex flex-col flex-1 mb-6 ">
                  <div className="flex items-start sm:items-center space-x-3">
                    {tarea.status === "completada" ? (
                      <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    ) : (
                      <PencilSquareIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                    )}
                    <span className={tarea.status === "completada" ? "line-through font-semibold" : "font-semibold"}>
                      {tarea.title}
                    </span>
                  </div>
                  {tarea.description && <p className="text-gray-500 text-sm mt-1">{tarea.description}</p>}
                </div>

                <div className="flex space-x-2 mt-2 sm:mt-0">
                  <button onClick={() => editarTarea(tarea._id)} className="p-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition">
                    <PencilSquareIcon className="w-4 h-4 text-white" />
                  </button>
                  <button onClick={() => eliminarTarea(tarea._id)} className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition">
                    <TrashIcon className="w-4 h-4 text-white" />
                  </button>
                  <button onClick={() => toggleEstado(tarea._id)} className={`px-3 py-1 rounded-lg text-white font-medium transition ${tarea.status === "completada" ? "bg-green-400 hover:bg-green-500" : "bg-yellow-400 hover:bg-yellow-500"}`}>
                    {tarea.status === "completada" ? "Completada" : "Pendiente"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
