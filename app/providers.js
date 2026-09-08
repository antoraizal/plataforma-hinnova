"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext({ session: null, profile: null, loading: true });
const withTimeout = (promise, ms) => Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId) {
    try {
      const { data, error } = await withTimeout(supabase.from("profiles").select("*").eq("id", userId).single(), 5000);
      if (error) console.warn("Perfil pendiente:", error.message);
      setProfile(data || null);
    } catch (error) { console.warn("Perfil no disponible todavía:", error.message); }
  }

  useEffect(() => {
    let mounted = true;
    const failSafe = setTimeout(() => { if (mounted) setLoading(false); }, 3500);
    withTimeout(supabase.auth.getSession(), 5000).then(async ({ data: { session } }) => {
      if (!mounted) return;
      setSession(session || null);
      setLoading(false);
      if (session) await loadProfile(session.user.id);
    }).catch((error) => { console.warn("Sesión no disponible:", error.message); if (mounted) setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      if (!nextSession) setProfile(null);
      else loadProfile(nextSession.user.id);
      setLoading(false);
    });
    return () => { mounted = false; clearTimeout(failSafe); listener.subscription.unsubscribe(); };
  }, []);

  return <AuthContext.Provider value={{ session, profile, loading }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
