import "./globals.css";
import { AuthProvider } from "./providers";

export const metadata = {
  title: "Plataforma Innova",
  description: "CRM interno de Innova Constructora / Inmobiliaria",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
