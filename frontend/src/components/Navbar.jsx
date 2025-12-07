import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-8  py-4  bg-white shadow-md">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold text-blue-600"
      >
        <Link to={"/"}>
          Nou<span className="font-light">team</span>
        </Link>        
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-x-4"
      >
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Registro
        </Link>
      </motion.div>
    </header>
  );
}
