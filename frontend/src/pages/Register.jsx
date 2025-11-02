import React, { useState } from "react";
import { motion } from "framer-motion";
import { registerUser } from "../api/authService";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from "../assets/bg-notes.jpg";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    if (!name.trim()) { setError("El nombre es obligatorio"); return false; }
    if (name.trim().length < 3) { setError("El nombre debe tener al menos 3 caracteres"); return false; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) { setError("El email es obligatorio"); return false; }
    if (!emailRegex.test(email)) { setError("El email no es válido"); return false; }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!password) { setError("La contraseña es obligatoria"); return false; }
    if (!passwordRegex.test(password)) {
      setError("La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await registerUser({ name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Nou<span className="font-light">team</span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Crea tu cuenta
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
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

            <div>
              <label className="block text-gray-700 mb-1">Confirmar contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Registrarse
            </button>
          </form>

          <div className="text-center mt-4 text-gray-600 text-sm">
            <p>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Inicia sesión
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
  );
}
