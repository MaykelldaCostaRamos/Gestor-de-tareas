import { useState } from "react";

export default function Calendar() {
  const [dateTime, setDateTime] = useState("");

  return (
    <div className="p-4 space-y-2">
      <label className="block text-gray-700 font-medium">Selecciona fecha y hora:</label>
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        className="border rounded-lg px-3 py-2"
      />
      <p className="text-sm text-gray-600">Valor seleccionado: {dateTime}</p>
    </div>
  );
}
