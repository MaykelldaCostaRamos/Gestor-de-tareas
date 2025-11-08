import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function SectionCta () {
    return (
        <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-12 bg-blue-50 text-center"
      >
        <h3 className="text-3xl font-bold mb-8">¿Listo para organizar tus tareas?</h3>
        <motion.div whileHover={{ scale: 0.95 }} whileTap={{ scale: 0.95 }} className="inline-block">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Regístrate ahora
          </Link>
        </motion.div>
      </motion.section>
    )
}