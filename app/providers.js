"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext({ session: null, profile: null, loading: true });
const withTimeout = (promise, ms) => Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useRef(null);

  async function loadProfile(userId) {
    if (!userId) { setProfile(null); return; }
    try {
      const { data } = await withTimeout(supabase.from("profiles").select("*").eq("id", userId).maybeSingle(), 7000);
      if (currentUser.current === userId) setProfile(data || null);
    } catch (error) {
      console.warn("Perfil no disponible todavía:", error.message);
      if (currentUser.current === userId) setProfile(null);
    }
  }

  useEffect(() => {
    let mounted = true;
    let settled = false;
    const finish = (nextSession) => {
      if (!mounted) return;
      settled = true;
      currentUser.current = nextSession?.user?.id || null;
      setSession(nextSession || null);
      setLoading(false);
      if (nextSession?.user?.id) loadProfile(nextSession.user.id);
      else setProfile(null);
    };
    const failSafe = setTimeout(() => { if (!settled) finish(null); }, 6000);
    withTimeout(supabase.auth.getSession(), 5000)
      .then(({ data }) => finish(data?.session || null))
      .catch((error) => { console.warn("No se pudo restaurar la sesión:", error.message); finish(null); });
    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT") finish(null);
      else finish(nextSession || null);
    });
    return () => { mounted = false; clearTimeout(failSafe); listener.subscription.unsubscribe(); };
  }, []);

  return <AuthContext.Provider value={{ session, profile, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
