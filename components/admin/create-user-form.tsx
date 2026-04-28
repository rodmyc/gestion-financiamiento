"use client";

import { useActionState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import { createUserAction, initialFormState } from "@/app/actions/admin-users";
import { FieldError } from "@/components/shared/field-error";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function CreateUserForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [state, action, pending] = useActionState(createUserAction, initialFormState);

  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }

    if (state.status === "success") {
      toast.success(state.message ?? "Usuario creado.");
      formRef.current?.reset();
      router.refresh();
    }
  }, [router, state]);

  return (
    <Card className="border-border/60 shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle>Alta de usuarios</CardTitle>
        <CardDescription>
          Crea cuentas de acceso con correo y contraseña provisional. El sistema forzará el cambio al primer ingreso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-5 md:grid-cols-[1fr_1fr_auto]" ref={formRef}>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" name="email" placeholder="nuevo.usuario@empresa.com" type="email" />
            <FieldError errors={state.fieldErrors?.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provisionalPassword">Contraseña provisional</Label>
            <Input id="provisionalPassword" name="provisionalPassword" placeholder="Temporal123!" type="password" />
            <FieldError errors={state.fieldErrors?.provisionalPassword} />
          </div>

          <div className="flex items-end">
            <SubmitButton label="Crear usuario" pending={pending} pendingLabel="Creando..." />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
