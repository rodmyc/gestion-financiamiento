import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getDefaultRedirectPath, getSession } from "@/lib/auth-helpers";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect(getDefaultRedirectPath(session.user));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(12,74,110,0.14),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-700">
            Gestión de Financiamiento
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            Acceso al módulo de usuarios
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Base inicial del proyecto sobre Next.js 16, Better Auth y Prisma 7.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
