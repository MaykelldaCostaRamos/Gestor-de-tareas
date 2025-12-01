import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true,
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // 🔹 Leer token desde Zustand
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
