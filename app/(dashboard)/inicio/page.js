"use client";

import Link from "next/link";
import { useAuth } from "../../providers";

const ACCESOS = [
  { href: "/cartera", titulo: "Mi cartera", texto: "Acompaña cada oportunidad", color: "bg-[#eaf4fb]", icono: "♡" },
  { href: "/foro", titulo: "Foro del equipo", texto: "Comparte, pregunta y aprende", color: "bg-[#fff0bf]", icono: "✦" },
  { href: "/calendario", titulo: "Calendario", texto: "Organicemos el camino", color: "bg-[#e9f4e7]", icono: "◷" },
];

export default function InicioPage() {
  const { profile } = useAuth();
  const nombre = profile?.nombre?.split(" ")[0] || "equipo";
  return <div className="space-y-6">
    <section className="relative overflow-hidden rounded-[2rem] bg-[#102b4e] p-6 text-white shadow-xl sm:p-8">
      <div className="relative z-[1] max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#b9d9ee]">Buenos días, {nombre}</p><h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Juntos construimos confianza y hacemos crecer nuestra familia HINOVA.</h1><p className="mt-4 max-w-xl leading-7 text-[#d7e6f1]">Este es nuestro espacio para acompañar clientes, compartir ideas y avanzar con el apoyo de todo el equipo.</p></div><div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#1f6aa5]/50" /><div className="absolute -bottom-24 right-20 h-48 w-48 rounded-full bg-[#e6b84d]/25" />
    </section>
    <section><div className="mb-3 flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-wide text-[#718094]">Tu espacio de hoy</p><h2 className="text-2xl font-bold text-[#102b4e]">¿Por dónde empezamos?</h2></div></div><div className="grid gap-4 md:grid-cols-3">{ACCESOS.map((item) => <Link key={item.href} href={item.href} className={`${item.color} group rounded-3xl p-5 transition hover:-translate-y-1 hover:shadow-lg`}><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-xl text-[#102b4e]">{item.icono}</span><h3 className="mt-5 text-lg font-bold text-[#102b4e]">{item.titulo}</h3><p className="mt-1 text-sm text-[#526171]">{item.texto}</p><span className="mt-5 inline-block text-sm font-bold text-[#1f6aa5]">Ir ahora →</span></Link>)}</div></section>
    <section className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-[#e09f18]">Una frase para el equipo</p><p className="mt-1 text-lg font-semibold text-[#102b4e]">“Cuando trabajamos unidos, cada cliente siente la diferencia.”</p></div><span className="text-3xl" aria-hidden="true">✦</span></section>
  </div>;
}
