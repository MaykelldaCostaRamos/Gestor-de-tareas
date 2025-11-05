// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// ==========================
// Configurar entorno
// ==========================
dotenv.config();

const app = express();

// ==========================
// Conectar a MongoDB
// ==========================
connectDB();


// ==========================
// Lista de orígenes permitidos
// ==========================
const whitelist = [
  "https://nouteam.vercel.app",
  "http://localhost:5173"
];

// ==========================
// Middleware CORS (válido para local y producción)
// ==========================
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // permite Postman o llamadas internas
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true
}));



app.use(express.json());
app.use(cookieParser());

// ==========================
// Rutas API
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);

// ==========================
// Ruta raíz del backend
// ==========================
app.get("/", (req, res) => {
  res.send("Backend funcionando correctamente");
});

// ==========================
// Manejo de errores
// ==========================
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error del servidor"
  });
});

// ==========================
// Iniciar servidor
// ==========================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
