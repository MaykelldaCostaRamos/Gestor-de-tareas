import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";

export default function SectionFeatures() {
  return (
    <section className="py-16 px-8 lg:px-24 bg-white">
      <h3 className="text-3xl font-bold text-center mb-12">Funcionalidades</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            icon: ClipboardDocumentIcon,
            color: "text-blue-500",
            title: "Organiza tus proyectos",
            text: "Crea y gestiona todos tus proyectos en un solo lugar.",
          },
          {
            icon: CheckCircleIcon,
            color: "text-green-500",
            title: "Mantén tus tareas al día",
            text: "Marca tareas completadas y sigue tu progreso fácilmente.",
          },
          {
            icon: ClockIcon,
            color: "text-yellow-500",
            title: "Visualiza tu progreso",
            text: "Revisa estadísticas y avances de tus proyectos rápidamente.",
          },
          {
            icon: PaperClipIcon,
            color: "text-cyan-400",
            title: "Agrega archivos",
            text: "Adjunta imágenes o documentos PDF a tus proyectos y tareas.",
          },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            whileHover={{
              scale: 1.0,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
              },
            }}
            className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center space-y-4"
          >
            <feature.icon className={`w-12 h-12 ${feature.color}`} />
            <h4 className="font-semibold text-xl">{feature.title}</h4>
            <p className="text-gray-600">{feature.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
