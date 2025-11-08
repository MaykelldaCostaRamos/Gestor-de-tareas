import React, { useState } from "react";
import { motion } from "framer-motion";
import { loginUser } from "../api/authService";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from "../assets/bg-notes.jpg";
import Footer from "../components/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) { setError("El email es obligatorio"); return false; }
    if (!emailRegex.test(email)) { setError("El email no es válido"); return false; }
    if (!password) { setError("La contraseña es obligatoria"); return false; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return false; }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await loginUser({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
     
      <div className="absolute top-0 px-8 py-4 w-full bg-white shadow-md">
          <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-blue-600 text-center"
            >
              Nou<span className="font-light">team</span>
          </motion.h1>   
      </div>

      <div className="w-full flex flex-1 justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg max-w-md w-full" >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Inicia sesión</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Introduce tu correo electrónico"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
              >
                Login
              </button>
            </form>

            <div className="text-center mt-4 text-gray-600 text-sm">
              <p>
                ¿No tienes cuenta?{" "}
                <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                  Regístrate
                </Link>
              </p>
              <p>
                <Link to="/" className="text-blue-600 hover:underline">
                  Volver a inicio
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
