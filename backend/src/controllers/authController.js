import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Validaciones internas
const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
const validatePassword = (password) => password.length >= 6;
const validateName = (name) => name && name.trim() !== "";

// ===== REGISTRO =====
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validateName(name) || !validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ message: "Datos inválidos o incompletos" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "Usuario registrado con éxito",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Error en registerUser:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


// ===== LOGIN =====
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 🔒 Configuración para Render
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      path: "/",
    });

    // ✅ También devolvemos el token en el cuerpo
    res.json({
      message: "Login exitoso",
      token,
    });
  } catch (error) {
    console.error("Error en loginUser:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


// ===== LOGOUT =====
export const logoutUser = (req, res) => {
  // Limpia cookie correctamente también en producción
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path:"/"
  });
  res.json({ message: "Logout exitoso" });
};

// ===== PERFIL =====
export const getProfile = async (req, res) => {
  try {
    const { userId, name } = req.user;
    res.json({ userId, name });
  } catch (error) {
    console.error("Error en getProfile:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


// ===== ELIMINAR USUARIO + DATOS RELACIONADOS =====
export const deleteUser = async (req, res) => {
  try {
    console.log("🔹 deleteUser iniciado");

    // Obtener userId del token (verifyToken)
    const userId = req.user.userId;
    console.log("UserId a eliminar:", userId);

    // Buscar proyectos del usuario
    const projects = await Project.find({ owner: userId }).select("_id");
    console.log("Proyectos encontrados:", projects);

    const projectIds = projects.map((p) => p._id);
    console.log("IDs de proyectos:", projectIds);

    // Eliminar tareas de esos proyectos
    const deletedTasks = await Task.deleteMany({ projectId: { $in: projectIds } });
    console.log("Tareas eliminadas de proyectos:", deletedTasks);

    // Eliminar proyectos
    const deletedProjects = await Project.deleteMany({ owner: userId });
    console.log("Proyectos eliminados:", deletedProjects);

    // Eliminar tareas donde aparezca asignado
    const deletedAssignedTasks = await Task.deleteMany({ assignedTo: userId });
    console.log("Tareas asignadas eliminadas:", deletedAssignedTasks);

    // Finalmente eliminar al usuario
    const deletedUser = await User.findByIdAndDelete(userId);
    console.log("Usuario eliminado:", deletedUser);

    res.json({ message: "Usuario y todos sus datos fueron eliminados." });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
