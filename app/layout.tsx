import type { CSSProperties } from "react";
import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Gestion de Financiamiento",
  description: "Modulo inicial de autenticacion y gestion de usuarios.",
};

const fontVariables = {
  "--font-sans": '"Segoe UI", "Helvetica Neue", sans-serif',
  "--font-geist-mono": '"IBM Plex Mono", "SFMono-Regular", monospace',
} as CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased" style={fontVariables}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
