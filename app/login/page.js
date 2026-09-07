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
      setError("Correo o contraseña incorrectos.");
      return;
    }
    router.replace("/cartera");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-plomo-50 px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-4">
        <div className="flex flex-col items-center gap-2 mb-2">
          {/* Placeholder de logo: reemplazar /public/logo.png cuando Innova lo comparta */}
          <div className="w-16 h-16 rounded-2xl bg-plomo-200 flex items-center justify-center text-plomo-500 text-xs text-center">
            LOGO
          </div>
          <h1 className="text-xl font-semibold">Plataforma Innova</h1>
        </div>
        <div>
          <label className="text-sm text-plomo-600">Correo</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-plomo-600">Contraseña</label>
          <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
