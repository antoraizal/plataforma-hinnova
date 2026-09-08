"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../providers";
import { supabase } from "@/lib/supabaseClient";

const TABS = [
  { href: "/inicio", label: "Inicio", icon: "⌂" },
  { href: "/cartera", label: "Cartera", icon: "♡" },
  { href: "/anuncios", label: "Anuncios", icon: "⌂" },
  { href: "/foro", label: "Foro", icon: "✦" },
  { href: "/calendario", label: "Calendario", icon: "◷" },
];

export default function DashboardLayout({ children }) {
  const { session, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { if (!loading && !session) router.replace("/login"); }, [loading, session, router]);

  useEffect(() => {
    if (!profile || !process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) return;
    (async () => {
      try {
        const OneSignal = (await import("react-onesignal")).default;
        await OneSignal.init({ appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID, allowLocalhostAsSecureOrigin: true });
        const id = await OneSignal.User.PushSubscription.id;
        if (id) await supabase.from("profiles").update({ onesignal_player_id: id }).eq("id", profile.id);
      } catch (error) { console.warn("Notificaciones pendientes de configurar:", error?.message); }
    })();
  }, [profile]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#fffaf3] text-[#526171]"><div className="text-center"><div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#dcebf5] border-t-[#1f6aa5]" /><p>Preparando tu espacio HINOVA…</p></div></div>;
  if (!session) return <div className="min-h-screen bg-[#fffaf3]" />;

  return (
    <div className="min-h-screen bg-[#fffaf3]">
      <header className="sticky top-0 z-10 border-b border-[#e7e2da] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/inicio" className="flex items-center gap-3"><img src="/logo.png" alt="HINOVA" className="h-10 w-28 object-contain" /><span className="hidden border-l border-[#e7e2da] pl-3 text-sm font-semibold text-[#526171] sm:inline">Equipo HINOVA</span></Link>
          <div className="flex items-center gap-3 text-sm"><span className="hidden rounded-full bg-[#eaf4fb] px-3 py-1.5 font-semibold text-[#1f6aa5] sm:inline">{profile?.nombre || "Equipo"}</span><button className="btn-secondary" onClick={() => supabase.auth.signOut().then(() => router.replace("/login"))}>Salir</button></div>
        </div>
      </header>
      <nav className="border-b border-[#e7e2da] bg-white px-3 py-2"><div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto">{TABS.map((t) => <Link key={t.href} href={t.href} className={`tab flex items-center gap-1.5 ${pathname.startsWith(t.href) ? "tab-active" : "tab-inactive"}`}><span aria-hidden="true">{t.icon}</span>{t.label}</Link>)}</div></nav>
      <main className="soft-enter mx-auto max-w-5xl p-4 pb-10 sm:p-6">{children}</main>
    </div>
  );
}
