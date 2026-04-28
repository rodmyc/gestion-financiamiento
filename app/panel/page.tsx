import { ShieldCheck } from "lucide-react";

import { SignOutButton } from "@/components/shared/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireResolvedSession } from "@/lib/auth-helpers";

export default async function PanelPage() {
  const session = await requireResolvedSession();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary">Panel de usuario</Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Bienvenido, {session.user.name}
            </h1>
            <p className="text-sm text-slate-600">
              Tu sesión está protegida por Better Auth y las validaciones del servidor ya están activas.
            </p>
          </div>

          <SignOutButton />
        </div>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-sky-700" />
              Estado del acceso
            </CardTitle>
            <CardDescription>
              Este panel confirma que el flujo de autenticación y protección de rutas ya está operativo.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-slate-700 md:grid-cols-2">
            <div>
              <p className="font-medium text-slate-900">Correo</p>
              <p>{session.user.email}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Rol</p>
              <p>{session.user.role ?? "user"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
