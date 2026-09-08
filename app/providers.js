"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext({ session: null, profile: null, loading: true });

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error) console.warn("No se pudo cargar el perfil:", error.message);
    setProfile(data || null);
  }

  useEffect(() => {
    let mounted = true;
    const timeout = setTimeout(() => { if (mounted) setLoading(false); }, 8000);
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) console.error("Error de sesión:", error.message);
      if (!mounted) return;
      setSession(session || null);
      if (session) await loadProfile(session.user.id);
    }).catch((err) => console.error("Fallo al conectar con Supabase:", err.message)).finally(() => {
      clearTimeout(timeout);
      if (mounted) setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      if (nextSession) await loadProfile(nextSession.user.id); else setProfile(null);
    });
    return () => { mounted = false; clearTimeout(timeout); listener.subscription.unsubscribe(); };
  }, []);

  return <AuthContext.Provider value={{ session, profile, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
