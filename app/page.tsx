import Link from "next/link";

import { redirect } from "next/navigation";
import { ArrowRight, LockKeyhole, ShieldCheck, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDefaultRedirectPath, getSession } from "@/lib/auth-helpers";

const highlights = [
  {
    title: "Better Auth + Prisma 7",
    description: "Sesiones seguras, hash scrypt por defecto y base preparada para crecer hacia organizaciones y equipos.",
    icon: ShieldCheck,
  },
  {
    title: "Primer ingreso controlado",
    description: "Cada usuario creado por el admin entra con contraseña provisional y debe reemplazarla antes de usar el sistema.",
    icon: LockKeyhole,
  },
  {
    title: "Gestión modular",
    description: "El proyecto arranca con autenticación y administración de usuarios, manteniendo bajo acoplamiento para los próximos módulos.",
    icon: Users,
  },
];

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect(getDefaultRedirectPath(session.user));
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(2,132,199,0.20),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eff6ff_100%)] px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <section className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary">Módulo 1 · Autenticación</Badge>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Base sólida para escalar el proyecto módulo por módulo.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                El sistema ya está preparado para autenticar usuarios con correo y contraseña, proteger rutas,
                forzar cambio de clave en el primer acceso y delegar altas únicamente al Super Admin.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild className="h-12 gap-2 px-6">
                <Link href="/login">
                  Ir al login
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <Card className="border-border/60 bg-white/90 shadow-xl backdrop-blur">
            <CardContent className="grid gap-6 p-8">
              {highlights.map(({ title, description, icon: Icon }) => (
                <div className="flex gap-4" key={title}>
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-800">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="font-medium text-slate-950">{title}</h2>
                    <p className="text-sm leading-6 text-slate-600">{description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
