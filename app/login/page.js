"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Revisa tu correo y contraseña para volver a intentarlo.");
      return;
    }
    router.replace("/inicio");
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_.9fr] gap-8 items-center">
        <section className="hidden lg:block soft-enter px-8">
          <p className="text-sm font-semibold uppercase tracking-[.22em] text-[#1f6aa5]">Hinojosa Group Real Estate</p>
          <h1 className="mt-5 text-5xl font-bold leading-tight text-[#102b4e]">Crecemos juntos, acompañamos sueños.</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-[#526171]">Un espacio para cuidar cada relación, compartir ideas y avanzar como una sola familia HINOVA.</p>
          <div className="mt-8 flex gap-3 text-sm text-[#526171]"><span className="rounded-full bg-[#eaf4fb] px-4 py-2">Equipo</span><span className="rounded-full bg-[#fff0bf] px-4 py-2">Confianza</span><span className="rounded-full bg-[#e9f4e7] px-4 py-2">Crecimiento</span></div>
        </section>
        <form onSubmit={handleSubmit} className="card w-full max-w-md mx-auto soft-enter">
          <div className="flex flex-col items-center text-center mb-7">
            <img src="/logo.png" alt="HINOVA - Hinojosa Group Real Estate" className="w-56 h-24 object-contain" />
            <p className="mt-3 text-sm text-[#718094]">Plataforma interna del equipo</p>
          </div>
          <div className="space-y-4">
            <div><label className="text-sm font-semibold text-[#526171]">Correo</label><input className="input mt-1.5" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><label className="text-sm font-semibold text-[#526171]">Contraseña</label><input className="input mt-1.5" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            {error && <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>{loading ? "Ingresando…" : "Entrar a HINOVA"}</button>
          </div>
        </form>
      </div>
    </main>
  );
}
