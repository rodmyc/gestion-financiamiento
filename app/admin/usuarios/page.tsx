import { Users } from "lucide-react";

import { CreateUserForm } from "@/components/admin/create-user-form";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdminSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const session = await requireAdminSession();
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      mustChangePassword: true,
      createdAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <Badge variant="secondary">Super Admin</Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Administración de usuarios
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-600">
                Solo las cuentas con rol <span className="font-medium text-slate-900">admin</span> pueden crear usuarios.
                El correo se registra con una contraseña provisional y el sistema obliga el cambio al primer acceso.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-700">
              Sesión actual: {session.user.email}
            </p>
          </div>

          <SignOutButton />
        </div>

        <CreateUserForm />

        <section className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-border/60 px-6 py-4">
            <Users className="size-5 text-sky-700" />
            <div>
              <h2 className="font-medium text-slate-950">Usuarios registrados</h2>
              <p className="text-sm text-slate-600">
                Vista inicial para el módulo de gestión de usuarios.
              </p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Primer ingreso</TableHead>
                <TableHead>Creado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role ?? "user"}</TableCell>
                    <TableCell>{user.mustChangePassword ? "Pendiente" : "Completado"}</TableCell>
                    <TableCell>{user.createdAt.toLocaleDateString("es-BO")}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="text-center text-slate-500" colSpan={5}>
                    Aún no hay usuarios registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      </div>
    </main>
  );
}
