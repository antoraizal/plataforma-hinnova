"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../providers";
import { supabase } from "@/lib/supabaseClient";

const TABS = [
  { href: "/inicio", label: "Inicio", icon: "⌂" },
  { href: "/cartera", label: "Mi cartera", icon: "♡" },
  { href: "/anuncios", label: "Propiedades", icon: "⌂" },
  { href: "/foro", label: "Foro", icon: "✦" },
  { href: "/calendario", label: "Calendario", icon: "◷" },
];

export default function DashboardLayout({ children }) {
  const { session, profile, loading } = useAuth();
  const router = useRouter(); const pathname = usePathname(); const [menu, setMenu] = useState(false); const [pendientes, setPendientes] = useState(0);
  useEffect(() => { if (!loading && !session) router.replace("/login"); }, [loading, session, router]);
  useEffect(() => { if (!profile || !process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) return; (async () => { try { const OneSignal = (await import("react-onesignal")).default; await OneSignal.init({ appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID, allowLocalhostAsSecureOrigin: true }); const id = await OneSignal.User.PushSubscription.id; if (id) await supabase.from("profiles").update({ onesignal_player_id: id }).eq("id", profile.id); } catch (error) { console.warn("Notificaciones pendientes de configurar:", error?.message); } })(); }, [profile]);
  useEffect(() => { if (profile?.rol !== "admin") return; supabase.from("preguntas").select("id", { count: "exact", head: true }).eq("estado", "pendiente").then(({ count }) => setPendientes(count || 0)); }, [profile, pathname]);
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#fffaf3] text-[#526171]"><div className="text-center"><div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#dcebf5] border-t-[#1f6aa5]" /><p>Preparando tu espacio HINOVA…</p></div></div>;
  if (!session) return <div className="min-h-screen bg-[#fffaf3]" />;
  return <div className="min-h-screen bg-[#fffaf3]"><header className="sticky top-0 z-20 border-b border-[#e7e2da] bg-white/95 px-4 py-3 backdrop-blur"><div className="mx-auto flex max-w-5xl items-center justify-between"><button aria-label="Abrir menú" className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-2xl bg-[#eaf4fb] text-[#102b4e]" onClick={() => setMenu(true)}><span className="h-0.5 w-5 bg-current" /><span className="h-0.5 w-5 bg-current" /><span className="h-0.5 w-5 bg-current" /></button><Link href="/inicio" className="flex items-center gap-2"><img src="/logo.png" alt="HINOVA" className="h-10 w-28 object-contain" /><span className="hidden text-sm font-semibold text-[#526171] sm:inline">Equipo HINOVA</span></Link><span className="max-w-[120px] truncate rounded-full bg-[#fff0bf] px-3 py-1.5 text-xs font-semibold text-[#7a5c12]">{profile?.nombre || "Equipo"}</span></div></header>{menu && <><button aria-label="Cerrar menú" className="fixed inset-0 z-30 bg-[#102b4e]/30" onClick={() => setMenu(false)} /><aside className="soft-enter fixed inset-y-0 left-0 z-40 w-[min(86vw,330px)] bg-[#fffaf3] p-5 shadow-2xl"><div className="flex items-center justify-between"><img src="/logo.png" alt="HINOVA" className="h-12 w-32 object-contain" /><button className="btn-secondary px-3" onClick={() => setMenu(false)}>×</button></div><p className="mt-5 text-sm text-[#718094]">Hola, {profile?.nombre || "equipo"}</p><nav className="mt-5 space-y-2">{TABS.map((t) => <Link key={t.href} href={t.href} onClick={() => setMenu(false)} className={`flex items-center justify-between rounded-2xl px-4 py-3 font-semibold ${pathname.startsWith(t.href) ? "bg-[#1f6aa5] text-white" : "bg-white text-[#526171] hover:bg-[#eaf4fb]"}`}><span><span className="mr-3">{t.icon}</span>{t.label}</span>{t.href === "/foro" && profile?.rol === "admin" && pendientes > 0 && <span className="rounded-full bg-[#e09f18] px-2 py-0.5 text-xs text-white">{pendientes}</span>}</Link>)}</nav><div className="mt-8 border-t border-[#e7e2da] pt-5"><button className="btn-secondary w-full" onClick={() => supabase.auth.signOut().then(() => router.replace("/login"))}>Cerrar sesión</button></div></aside></>}<main className="soft-enter mx-auto max-w-5xl p-4 pb-10 sm:p-6">{children}</main></div>;
}
