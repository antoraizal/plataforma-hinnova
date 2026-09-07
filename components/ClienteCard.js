"use client";

import { estadoInfo } from "@/lib/estados";

export default function ClienteCard({ cliente, onClick }) {
  const info = estadoInfo(cliente.estado);
  return (
    <button onClick={onClick} className="card w-full text-left hover:shadow-md transition space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{cliente.nombres} {cliente.apellidos}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${info.color}`}>{info.etiqueta}</span>
      </div>
      <p className="text-sm text-plomo-600">{cliente.telefono}</p>
      {cliente.estado === "en_espera" && cliente.busca_que && (
        <p className="text-xs text-plomo-500 italic">Busca: {cliente.busca_que}</p>
      )}
      {cliente.fecha_recontacto && (
        <p className="text-xs text-azul-600">Recontactar: {cliente.fecha_recontacto}</p>
      )}
    </button>
  );
}
