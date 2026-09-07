"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../providers";

export default function AnunciosPage() {
  const { profile } = useAuth();
  const [anuncios, setAnuncios] = useState([]);
  const [creando, setCreando] = useState(false);
  const [form, setForm] = useState({ titulo: "", tipo: "casa", descripcion: "", precio: "", foto_url: "" });

  async function cargar() {
    const { data } = await supabase
      .from("anuncios")
      .select("*, profiles(nombre)")
      .order("created_at", { ascending: false });
    setAnuncios(data || []);
  }

  useEffect(() => { cargar(); }, []);

  async function publicar(e) {
    e.preventDefault();
    await supabase.from("anuncios").insert({ ...form, asesora_id: profile.id });
    setForm({ titulo: "", tipo: "casa", descripcion: "", precio: "", foto_url: "" });
    setCreando(false);
    cargar();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Anuncios del equipo</h1>
        <button className="btn-primary" onClick={() => setCreando(!creando)}>
          {creando ? "Cerrar" : "+ Publicar"}
        </button>
      </div>

      {creando && (
        <form onSubmit={publicar} className="card space-y-3">
          <input className="input" placeholder="Título (ej. Casa 3 dorm. sector La Victoria)" required
            value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          <select className="input" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
            <option value="casa">Casa</option>
            <option value="terreno">Terreno</option>
            <option value="departamento">Departamento</option>
            <option value="otro">Otro</option>
          </select>
          <textarea className="input" placeholder="Descripción" value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          <input className="input" type="number" placeholder="Precio" value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })} />
          <input className="input" placeholder="URL de foto (opcional)" value={form.foto_url}
            onChange={(e) => setForm({ ...form, foto_url: e.target.value })} />
          <button className="btn-primary w-full">Publicar</button>
        </form>
      )}

      <div className="space-y-3">
        {anuncios.map((a) => (
          <div key={a.id} className="card">
            {a.foto_url && <img src={a.foto_url} alt={a.titulo} className="rounded-xl mb-2 w-full object-cover max-h-48" />}
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{a.titulo}</h3>
              <span className="text-xs bg-plomo-100 rounded-full px-2 py-0.5 capitalize">{a.tipo}</span>
            </div>
            <p className="text-sm text-plomo-600">{a.descripcion}</p>
            {a.precio && <p className="text-sm font-medium">${Number(a.precio).toLocaleString()}</p>}
            <p className="text-xs text-plomo-500 mt-1">Publicado por {a.profiles?.nombre}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
