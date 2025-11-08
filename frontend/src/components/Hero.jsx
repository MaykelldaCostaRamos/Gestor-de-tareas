import mockup from "../assets/mockup.jpg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="flex-1 flex flex-col md:flex-row lg:flex-row items-center px-8 lg:px-24 py-12 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="md:w-[80%] lg:w-1/2 space-y-6"
      >
        <h2 className="text-4xl font-bold text-gray-800">
          Organiza tus proyectos y tareas de manera eficiente
        </h2>
        <p className="text-gray-600 text-lg">
          Mantén tus tareas bajo control, visualiza tu progreso y aumenta tu
          productividad.
        </p>

        <motion.div
          whileHover={{ scale: 0.95 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            to="/register"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Empieza ahora
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.0 }}
        viewport={{ once: true }}
        className="flex justify-center items-center drop-shadow-sm px-1 mt-8 md:mt-0"
      >
        <div className="xl:pl-5">
          <img
            src={mockup}
            alt="Foto de Mikhail Nilov"
            className="md:w-[560px] lg:w-[400px] xl:w-[400px] 2xl:w-[620px] rounded-2xl shadow-xl object-cover contrast-125"
          />
        </div>
      </motion.div>
    </section>
  );
}
