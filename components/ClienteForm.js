"use client";

import { useState } from "react";

const VACIO = {
  nombres: "", apellidos: "", cedula: "", estado_civil: "", num_hijos: 0,
  telefono: "", direccion: "",
  tiene_casa: false, detalle_casa: "",
  tiene_terreno: false, detalle_terreno: "",
  tiene_departamento: false, detalle_departamento: "",
  num_carros: 0, presupuesto: "", forma_pago: "contado", monto_credito: "",
  estado: "nuevo", busca_que: "", como_llego: "", observaciones: "", fecha_recontacto: "",
};

export default function ClienteForm({ inicial, onGuardar, onCancelar }) {
  const [form, setForm] = useState(inicial || VACIO);

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onGuardar(form);
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="font-semibold text-lg">Datos personales</h3>
      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="Nombres" required value={form.nombres} onChange={(e) => set("nombres", e.target.value)} />
        <input className="input" placeholder="Apellidos" required value={form.apellidos} onChange={(e) => set("apellidos", e.target.value)} />
        <input className="input" placeholder="Cédula" value={form.cedula} onChange={(e) => set("cedula", e.target.value)} />
        <select className="input" value={form.estado_civil} onChange={(e) => set("estado_civil", e.target.value)}>
          <option value="">Estado civil</option>
          <option>Soltero/a</option>
          <option>Casado/a</option>
          <option>Divorciado/a</option>
          <option>Viudo/a</option>
          <option>Unión libre</option>
        </select>
        <input className="input" type="number" min="0" placeholder="N° de hijos" value={form.num_hijos} onChange={(e) => set("num_hijos", e.target.value)} />
        <input className="input" placeholder="Teléfono" required value={form.telefono} onChange={(e) => set("telefono", e.target.value)} />
      </div>
      <input className="input" placeholder="Dirección completa" value={form.direccion} onChange={(e) => set("direccion", e.target.value)} />

      <h3 className="font-semibold text-lg pt-2">Situación patrimonial</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.tiene_casa} onChange={(e) => set("tiene_casa", e.target.checked)} />
          Tiene casa
        </label>
        {form.tiene_casa && <input className="input" placeholder="Detalle de la casa" value={form.detalle_casa} onChange={(e) => set("detalle_casa", e.target.value)} />}

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.tiene_terreno} onChange={(e) => set("tiene_terreno", e.target.checked)} />
          Tiene terreno
        </label>
        {form.tiene_terreno && <input className="input" placeholder="Detalle del terreno" value={form.detalle_terreno} onChange={(e) => set("detalle_terreno", e.target.value)} />}

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.tiene_departamento} onChange={(e) => set("tiene_departamento", e.target.checked)} />
          Tiene departamento
        </label>
        {form.tiene_departamento && <input className="input" placeholder="Detalle del departamento" value={form.detalle_departamento} onChange={(e) => set("detalle_departamento", e.target.value)} />}

        <input className="input" type="number" min="0" placeholder="N° de carros" value={form.num_carros} onChange={(e) => set("num_carros", e.target.value)} />
      </div>

      <h3 className="font-semibold text-lg pt-2">Situación financiera</h3>
      <div className="grid grid-cols-2 gap-3">
        <input className="input" type="number" placeholder="Presupuesto" value={form.presupuesto} onChange={(e) => set("presupuesto", e.target.value)} />
        <select className="input" value={form.forma_pago} onChange={(e) => set("forma_pago", e.target.value)}>
          <option value="contado">Contado</option>
          <option value="credito">Crédito</option>
          <option value="mixto">Mixto</option>
        </select>
        {form.forma_pago !== "contado" && (
          <input className="input" type="number" placeholder="Monto de crédito solicitado" value={form.monto_credito} onChange={(e) => set("monto_credito", e.target.value)} />
        )}
      </div>

      <h3 className="font-semibold text-lg pt-2">Seguimiento comercial</h3>
      <div className="grid grid-cols-2 gap-3">
        <select className="input" value={form.estado} onChange={(e) => set("estado", e.target.value)}>
          <option value="nuevo">Nuevo</option>
          <option value="seguimiento">Seguimiento</option>
          <option value="en_proceso">En proceso</option>
          <option value="en_espera">En espera</option>
          <option value="cerrado">Cerrado</option>
        </select>
        <input className="input" placeholder="¿Cómo llegó? (referido, IG, FB...)" value={form.como_llego} onChange={(e) => set("como_llego", e.target.value)} />
      </div>
      {form.estado === "en_espera" && (
        <textarea className="input" placeholder="¿Qué está buscando? (tipo, zona, presupuesto deseado)" value={form.busca_que} onChange={(e) => set("busca_que", e.target.value)} />
      )}
      <div>
        <label className="text-sm text-plomo-600">Recordarme volver a contactar el:</label>
        <input className="input" type="date" value={form.fecha_recontacto || ""} onChange={(e) => set("fecha_recontacto", e.target.value)} />
      </div>
      <textarea className="input" placeholder="Observaciones" value={form.observaciones} onChange={(e) => set("observaciones", e.target.value)} />

      <div className="flex gap-2 pt-2">
        <button type="submit" className="btn-primary">Guardar</button>
        <button type="button" className="btn-secondary" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  );
}
