import mongoose from "mongoose";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

// Validadores
const validateName = (name) =>
  typeof name === "string" && name.trim().length >= 3 && name.trim().length <= 100;

const cleanText = (text) => (typeof text === "string" ? text.trim() : "");

// ===== CREAR PROYECTO =====
export const createProject = async (req, res) => {
  try {
    const name = cleanText(req.body.name);
    const description = cleanText(req.body.description);
    const date = cleanText(req.body.date);

    if (!validateName(name)) {
      return res.status(400).json({
        success: false,
        message:
          "El nombre del proyecto es obligatorio y debe tener entre 3 y 100 caracteres",
      });
    }

    const existing = await Project.findOne({ name, ownerId: req.user.userId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Ya existe un proyecto con este nombre" });
    }

    const newProject = await Project.create({ name, description, date, ownerId: req.user.userId });

    res.status(201).json({ success: true, message: "Proyecto creado con éxito", project: newProject });
  } catch (error) {
    console.error("Error en createProject:", error.message);
    res.status(500).json({ success: false, message: "Error al crear el proyecto" });
  }
};

// ===== OBTENER TODOS LOS PROYECTOS =====
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ ownerId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    console.error("Error en getProjects:", error.message);
    res.status(500).json({ success: false, message: "Error al obtener los proyectos" });
  }
};

// ===== OBTENER PROYECTO ESPECÍFICO + TAREAS =====
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Validación de ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID de proyecto inválido" });
    }

    // Validar usuario autenticado
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: "Usuario no autenticado" });
    }

    // Buscar proyecto
    const project = await Project.findOne({ _id: id, ownerId: req.user.userId });
    if (!project) {
      return res.status(404).json({ success: false, message: "Proyecto no encontrado o no autorizado" });
    }

    // Buscar tareas del proyecto
    const tareas = await Task.find({ projectId: id }).sort({ createdAt: -1 });
    res.json({ success: true, project, tareas });
  } catch (error) {
    console.error("Error en getProject:", error);
    res.status(500).json({ success: false, message: "Error al obtener el proyecto" });
  }
};



// ===== ACTUALIZAR PROYECTO =====
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const name = cleanText(req.body.name);
    const description = cleanText(req.body.description);
    const date = cleanText(req.body.date);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID de proyecto inválido" });
    }

    const project = await Project.findOneAndUpdate(
      { _id: id, ownerId: req.user.userId },
      { name, description, date },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: "Proyecto no encontrado o no autorizado" });
    }

    res.json({ success: true, message: "Proyecto actualizado correctamente", project });
  } catch (error) {
    console.error("Error en updateProject:", error.message);
    res.status(500).json({ success: false, message: "Error al actualizar el proyecto" });
  }
};

// ===== ELIMINAR PROYECTO =====
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID de proyecto inválido" });
    }

    // 1. Buscar el proyecto primero para validar propietario
    const project = await Project.findOne({ _id: id, ownerId: req.user.userId });
    if (!project) {
      return res.status(404).json({ success: false, message: "Proyecto no encontrado o no autorizado" });
    }

    // 2. Eliminar todas las tareas asociadas al proyecto
    await Task.deleteMany({ projectId: project._id });

    // 3. Eliminar el proyecto
    await Project.findByIdAndDelete(project._id);

    res.json({ success: true, message: "Proyecto y todas sus tareas eliminadas correctamente" });
  } catch (error) {
    console.error("Error en deleteProject:", error.message);
    res.status(500).json({ success: false, message: "Error al eliminar el proyecto" });
  }
};
