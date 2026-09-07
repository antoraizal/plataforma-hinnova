"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../providers";

export default function ForoPage() {
  const { profile } = useAuth();
  const [preguntas, setPreguntas] = useState([]);
  const [nueva, setNueva] = useState("");
  const [respuestas, setRespuestas] = useState({});
  const [textoRespuesta, setTextoRespuesta] = useState({});

  async function cargar() {
    const { data: p } = await supabase
      .from("preguntas")
      .select("*, profiles(nombre)")
      .order("created_at", { ascending: false });
    setPreguntas(p || []);

    const { data: r } = await supabase.from("respuestas").select("*, profiles(nombre)").order("created_at");
    const agrupadas = {};
    (r || []).forEach((resp) => {
      agrupadas[resp.pregunta_id] = [...(agrupadas[resp.pregunta_id] || []), resp];
    });
    setRespuestas(agrupadas);
  }

  useEffect(() => { cargar(); }, []);

  async function publicarPregunta(e) {
    e.preventDefault();
    if (!nueva.trim()) return;
    await supabase.from("preguntas").insert({ pregunta: nueva, autor_id: profile.id });
    setNueva("");
    cargar();
  }

  async function responder(preguntaId) {
    const texto = textoRespuesta[preguntaId];
    if (!texto?.trim()) return;
    await supabase.from("respuestas").insert({ pregunta_id: preguntaId, autor_id: profile.id, respuesta: texto });
    setTextoRespuesta({ ...textoRespuesta, [preguntaId]: "" });
    cargar();
  }

  async function marcarResuelta(preguntaId) {
    await supabase.from("preguntas").update({ estado: "respondida" }).eq("id", preguntaId);
    cargar();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Foro de preguntas</h1>

      <form onSubmit={publicarPregunta} className="card space-y-2">
        <textarea className="input" placeholder="Escribe tu pregunta o duda para el equipo…"
          value={nueva} onChange={(e) => setNueva(e.target.value)} />
        <button className="btn-primary">Publicar pregunta</button>
      </form>

      <div className="space-y-3">
        {preguntas.map((p) => (
          <div key={p.id} className={`card ${p.estado === "pendiente" ? "border-amarillo-300 border-2" : ""}`}>
            <div className="flex justify-between items-start">
              <p className="font-medium">{p.pregunta}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${p.estado === "pendiente" ? "bg-amarillo-200" : "bg-azul-100 text-azul-700"}`}>
                {p.estado === "pendiente" ? "Pendiente" : "Respondida"}
              </span>
            </div>
            <p className="text-xs text-plomo-500">Preguntó {p.profiles?.nombre}</p>

            <div className="pl-3 mt-2 space-y-1 border-l-2 border-plomo-200">
              {(respuestas[p.id] || []).map((r) => (
                <p key={r.id} className="text-sm"><span className="font-medium">{r.profiles?.nombre}:</span> {r.respuesta}</p>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <input className="input" placeholder="Responder…" value={textoRespuesta[p.id] || ""}
                onChange={(e) => setTextoRespuesta({ ...textoRespuesta, [p.id]: e.target.value })} />
              <button className="btn-secondary" onClick={() => responder(p.id)}>Enviar</button>
            </div>

            {profile?.rol === "admin" && p.estado === "pendiente" && (
              <button className="text-xs text-azul-600 mt-2 underline" onClick={() => marcarResuelta(p.id)}>
                Marcar como respondida
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
