import "./globals.css";
import { AuthProvider } from "./providers";

export const metadata = {
  title: "HINOVA | Plataforma del equipo",
  description: "Espacio interno para crecer juntos como equipo HINOVA.",
  manifest: "/manifest.json",
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
};

export default function RootLayout({ children }) {
  return <html lang="es"><body><AuthProvider>{children}</AuthProvider></body></html>;
}
