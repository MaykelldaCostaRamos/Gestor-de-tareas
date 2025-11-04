// pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getProjects, createProject, deleteProject, updateProject } from "../api/projectService";
import Calendar from "../components/Calendar";

export default function Dashboard() {
  const [proyectos, setProyectos] = useState([]);
  const [nuevoProyecto, setNuevoProyecto] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fecha, setFecha] = useState(new Date());

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
      const { project } = await createProject(nuevoProyecto.trim(), nuevaDescripcion.trim(), fecha);
      setProyectos((prev) => [...prev, project]);
      setNuevoProyecto("");
      setNuevaDescripcion("");
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el proyecto.");
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

  // Editar proyecto
  const handleEditarProyecto = async (projectId) => {
    const name = prompt("Nuevo nombre del proyecto:");
    const description = prompt("Nueva descripción del proyecto:");
    if (!name) return;
    try {
      const updated = await updateProject(projectId, name, description);

      if (!updated || !updated._id) {
        console.error("Proyecto actualizado inválido:", updated);
        return;
      }

      setProyectos((prev) =>
        prev.map((p) => (p._id === projectId ? updated : p))
      );

    } catch (err) {
      console.error(err);
      setError("No se pudo editar el proyecto.");
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
      {/* Header y creación de proyecto */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold">Crear Proyecto</h2>
        <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 w-full md:w-auto">
          <input
            type="text"
            value={nuevoProyecto}
            onChange={(e) => setNuevoProyecto(e.target.value)}
            placeholder="Nombre del proyecto"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          />
          <input
            type="text"
            value={nuevaDescripcion}
            onChange={(e) => setNuevaDescripcion(e.target.value)}
            placeholder="Descripción del proyecto"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          />

          < Calendar value="fecha" onChange={setFecha} />

          <button
            onClick={handleCrearProyecto}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            + Nuevo Proyecto
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      {/* Listado de proyectos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map((project) => (
          <div
            key={project._id}
            className="p-4 bg-white shadow rounded-2xl hover:shadow-xl transition transform hover:scale-105 flex flex-col justify-between"
          >
            <Link to={`/project/${project._id}`} className="flex-1">
              <h3 className="font-bold text-lg">{project.name}</h3>
              {project.description && (
                <p className="text-gray-500 mt-1 text-sm">{project.description}</p>
              )}
            </Link>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => handleEditarProyecto(project._id)}
                className="p-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition"
              >
                <PencilSquareIcon className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => handleEliminarProyecto(project._id)}
                className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
              >
                <TrashIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
