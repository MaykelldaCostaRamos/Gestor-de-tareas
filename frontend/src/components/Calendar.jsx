import { useState, useEffect } from "react";

export default function Calendar({ value, onChange }) {
  const [dateTime, setDateTime] = useState("");

  // Sincronizar con el valor externo solo cuando cambie desde fuera
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setDateTime(local);
    } else {
      setDateTime("");
    }
  }, [value]);

  const handleChange = (e) => {
    const localValue = e.target.value;
    
    // Validar que la fecha sea válida y no sea anterior a hoy
    if (localValue) {
      const selectedDate = new Date(localValue);
      const now = new Date();
      now.setSeconds(0, 0); // Resetear segundos y milisegundos para comparar
      
      // Verificar que sea una fecha válida
      if (isNaN(selectedDate.getTime())) {
        return; // Ignorar fecha inválida
      }
      
      // Verificar que no sea anterior a ahora
      if (selectedDate < now) {
        return; // Ignorar fechas pasadas
      }
    }
    
    setDateTime(localValue); // Actualizar inmediatamente el input

    if (!localValue) {
      onChange?.(null);
      return;
    }

    // Convertir a ISO para guardar
    const date = new Date(localValue);
    onChange?.(date.toISOString());
  };

  // Calcular fecha mínima (ahora)
  const minDateTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Selecciona fecha y hora:
      </label>

      <input
        type="datetime-local"
        value={dateTime}
        min={minDateTime}
        max="2099-12-31T23:59" // Fecha máxima razonable
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}