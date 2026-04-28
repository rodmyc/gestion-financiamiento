import "server-only";

import { cache } from "react";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
type SessionUser = Session["user"];

export function isAdminRole(role: string | null | undefined) {
  if (!role) {
    return false;
  }

  return role
    .split(",")
    .map((value) => value.trim())
    .includes("admin");
}

export function getDefaultRedirectPath(user: {
  role?: string | null;
  mustChangePassword?: boolean | null;
}) {
  if (user.mustChangePassword) {
    return "/cambiar-contrasena";
  }

  return isAdminRole(user.role) ? "/admin/usuarios" : "/panel";
}

export const getSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireResolvedSession() {
  const session = await requireSession();

  if (session.user.mustChangePassword) {
    redirect("/cambiar-contrasena");
  }

  return session;
}

export async function requireAdminSession() {
  const session = await requireResolvedSession();

  if (!isAdminRole(session.user.role)) {
    redirect("/panel");
  }

  return session;
}
