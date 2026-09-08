"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./providers";

export default function Home() {
  const { session, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading) router.replace(session ? "/inicio" : "/login"); }, [loading, session, router]);
  return <div className="min-h-screen flex items-center justify-center bg-[#fffaf3] text-[#526171]">Preparando HINOVA…</div>;
}
