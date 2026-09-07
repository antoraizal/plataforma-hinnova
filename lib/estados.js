export const ESTADOS = [
  { valor: "nuevo", etiqueta: "Nuevo", color: "bg-azul-100 text-azul-700" },
  { valor: "seguimiento", etiqueta: "Seguimiento", color: "bg-amarillo-200 text-plomo-800" },
  { valor: "en_proceso", etiqueta: "En proceso", color: "bg-azul-400 text-white" },
  { valor: "en_espera", etiqueta: "En espera", color: "bg-plomo-300 text-plomo-800" },
  { valor: "cerrado", etiqueta: "Cerrado", color: "bg-plomo-700 text-white" },
];

export function estadoInfo(valor) {
  return ESTADOS.find((e) => e.valor === valor) || ESTADOS[0];
}
