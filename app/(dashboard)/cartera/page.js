"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../providers";
import { ESTADOS } from "@/lib/estados";
import ClienteCard from "@/components/ClienteCard";
import ClienteForm from "@/components/ClienteForm";

export default function CarteraPage() {
  const { profile } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [tab, setTab] = useState("nuevo");
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null);
  const [creando, setCreando] = useState(false);

  async function cargar() {
    if (!profile) return;
    const { data } = await supabase
      .from("clientes")
      .select("*")
      .eq("asesora_id", profile.id)
      .eq("archivado", false)
      .order("created_at", { ascending: false });
    setClientes(data || []);
  }

  useEffect(() => { cargar(); }, [profile]);

  const [guardando, setGuardando] = useState(false);

  function limpiarPayload(form) {
    return {
      ...form,
      asesora_id: profile.id,
      num_hijos: form.num_hijos === "" || form.num_hijos == null ? 0 : Number(form.num_hijos),
      num_carros: form.num_carros === "" || form.num_carros == null ? 0 : Number(form.num_carros),
      presupuesto: form.presupuesto === "" || form.presupuesto == null ? null : Number(form.presupuesto),
      monto_credito: form.monto_credito === "" || form.monto_credito == null ? null : Number(form.monto_credito),
      fecha_recontacto: form.fecha_recontacto === "" ? null : form.fecha_recontacto,
    };
  }

  async function guardar(form) {
    setGuardando(true);
    const payload = limpiarPayload(form);
    let error;
    if (editando?.id) {
      ({ error } = await supabase.from("clientes").update(payload).eq("id", editando.id));
    } else {
      ({ error } = await supabase.from("clientes").insert(payload));
    }
    setGuardando(false);
    if (error) {
      alert("No se pudo guardar: " + error.message);
      return;
    }
    setEditando(null);
    setCreando(false);
    cargar();
  }

  const visibles = clientes
    .filter((c) => (busqueda ? `${c.nombres} ${c.apellidos}`.toLowerCase().includes(busqueda.toLowerCase()) : c.estado === tab));

  if (creando || editando) {
    return (
      <ClienteForm
        inicial={editando}
        onGuardar={guardar}
        onCancelar={() => { setEditando(null); setCreando(false); }}
        guardando={guardando}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Mi cartera</h1>
        <button className="btn-primary" onClick={() => setCreando(true)}>+ Cliente</button>
      </div>

      <input
        className="input"
        placeholder="Buscar por nombre…"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {!busqueda && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ESTADOS.map((e) => (
            <button
              key={e.valor}
              onClick={() => setTab(e.valor)}
              className={`tab ${tab === e.valor ? "tab-active" : "tab-inactive"}`}
            >
              {e.etiqueta}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {visibles.length === 0 && <p className="text-plomo-500 text-sm">No hay clientes aquí todavía.</p>}
        {visibles.map((c) => (
          <ClienteCard key={c.id} cliente={c} onClick={() => setEditando(c)} />
        ))}
      </div>
    </div>
  );
}
