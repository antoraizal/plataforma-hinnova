"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../providers";

export default function CalendarioPage() {
  const { profile } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [equipo, setEquipo] = useState([]);
  const [creando, setCreando] = useState(false);
  const [form, setForm] = useState({ titulo: "", fecha_hora: "", notas: "", minutos_antes: 30, responsables: [] });

  async function cargar() {
    const { data: ev } = await supabase
      .from("eventos")
      .select("*, evento_responsables(usuario_id, profiles(nombre))")
      .order("fecha_hora", { ascending: true });
    setEventos(ev || []);
    const { data: perfiles } = await supabase.from("profiles").select("id, nombre");
    setEquipo(perfiles || []);
  }

  useEffect(() => { cargar(); }, []);

  function toggleResponsable(id) {
    setForm((f) => ({
      ...f,
      responsables: f.responsables.includes(id)
        ? f.responsables.filter((r) => r !== id)
        : [...f.responsables, id],
    }));
  }

  async function crear(e) {
    e.preventDefault();
    const { data: evento } = await supabase
      .from("eventos")
      .insert({
        titulo: form.titulo,
        fecha_hora: form.fecha_hora,
        notas: form.notas,
        minutos_antes: form.minutos_antes,
        creado_por: profile.id,
      })
      .select()
      .single();

    if (evento) {
      const filas = form.responsables.map((usuario_id) => ({ evento_id: evento.id, usuario_id }));
      if (filas.length) await supabase.from("evento_responsables").insert(filas);
    }
    setForm({ titulo: "", fecha_hora: "", notas: "", minutos_antes: 30, responsables: [] });
    setCreando(false);
    cargar();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Calendario del equipo</h1>
        <button className="btn-primary" onClick={() => setCreando(!creando)}>
          {creando ? "Cerrar" : "+ Evento"}
        </button>
      </div>

      {creando && (
        <form onSubmit={crear} className="card space-y-3">
          <input className="input" placeholder="Título (ej. Visita casa de Gaby)" required
            value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          <input className="input" type="datetime-local" required
            value={form.fecha_hora} onChange={(e) => setForm({ ...form, fecha_hora: e.target.value })} />
          <textarea className="input" placeholder="Notas (ej. necesitamos conductor)" value={form.notas}
            onChange={(e) => setForm({ ...form, notas: e.target.value })} />
          <div>
            <label className="text-sm text-plomo-600">Avisar con cuánta anticipación (minutos):</label>
            <input className="input" type="number" value={form.minutos_antes}
              onChange={(e) => setForm({ ...form, minutos_antes: e.target.value })} />
          </div>
          <div>
            <p className="text-sm text-plomo-600 mb-1">¿Quién es responsable? (recibe el push)</p>
            <div className="flex flex-wrap gap-2">
              {equipo.map((u) => (
                <button type="button" key={u.id}
                  className={`tab ${form.responsables.includes(u.id) ? "tab-active" : "tab-inactive"}`}
                  onClick={() => toggleResponsable(u.id)}>
                  {u.nombre}
                </button>
              ))}
            </div>
          </div>
          <button className="btn-primary w-full">Crear evento</button>
        </form>
      )}

      <div className="space-y-3">
        {eventos.map((ev) => (
          <div key={ev.id} className="card">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{ev.titulo}</h3>
              <span className="text-xs bg-azul-100 text-azul-700 rounded-full px-2 py-0.5">
                {new Date(ev.fecha_hora).toLocaleString("es-EC", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
            {ev.notas && <p className="text-sm text-plomo-600">{ev.notas}</p>}
            {ev.evento_responsables?.length > 0 && (
              <p className="text-xs text-plomo-500 mt-1">
                Responsable(s): {ev.evento_responsables.map((r) => r.profiles?.nombre).join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
