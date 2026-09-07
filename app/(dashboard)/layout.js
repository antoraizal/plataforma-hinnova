"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../providers";
import { supabase } from "@/lib/supabaseClient";

const TABS = [
  { href: "/cartera", label: "Cartera" },
  { href: "/anuncios", label: "Anuncios" },
  { href: "/foro", label: "Foro" },
  { href: "/calendario", label: "Calendario" },
];

export default function DashboardLayout({ children }) {
  const { session, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [loading, session, router]);

  // Registro de notificaciones push (OneSignal) al entrar a la app
  useEffect(() => {
    if (!profile) return;
    (async () => {
      const OneSignal = (await import("react-onesignal")).default;
      await OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        allowLocalhostAsSecureOrigin: true,
      });
      OneSignal.Slidedown.promptPush();
      const id = await OneSignal.User.PushSubscription.id;
      if (id) {
        await supabase.from("profiles").update({ onesignal_player_id: id }).eq("id", profile.id);
      }
    })();
  }, [profile]);

  if (loading || !session) {
    return <div className="min-h-screen flex items-center justify-center bg-plomo-50">Cargando…</div>;
  }

  return (
    <div className="min-h-screen bg-plomo-50">
      <header className="bg-white border-b border-plomo-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-plomo-200 flex items-center justify-center text-[10px] text-plomo-500">
            LOGO
          </div>
          <span className="font-semibold">Plataforma Innova</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-plomo-600 hidden sm:inline">{profile?.nombre}</span>
          <button className="btn-secondary" onClick={() => supabase.auth.signOut().then(() => router.replace("/login"))}>
            Salir
          </button>
        </div>
      </header>

      <nav className="bg-white border-b border-plomo-200 px-4 py-2 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`tab ${pathname.startsWith(t.href) ? "tab-active" : "tab-inactive"}`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <main className="p-4 max-w-3xl mx-auto">{children}</main>
    </div>
  );
}
