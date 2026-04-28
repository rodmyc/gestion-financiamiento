"use client";

import { useActionState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { loginAction, initialFormState } from "@/app/actions/auth";
import { FieldError } from "@/components/shared/field-error";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(loginAction, initialFormState);

  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }

    if (state.status === "success") {
      toast.success(state.message ?? "Bienvenido.");

      if (state.redirectTo) {
        router.replace(state.redirectTo);
        router.refresh();
      }
    }
  }, [router, state]);

  return (
    <Card className="border-border/60 shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
        <CardDescription>
          Accede con tu correo y contraseña para entrar al módulo de usuarios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input autoComplete="email" id="email" name="email" placeholder="usuario@empresa.com" type="email" />
            <FieldError errors={state.fieldErrors?.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input autoComplete="current-password" id="password" name="password" placeholder="********" type="password" />
            <FieldError errors={state.fieldErrors?.password} />
          </div>

          <SubmitButton label="Ingresar" pending={pending} pendingLabel="Validando acceso..." />
        </form>
      </CardContent>
    </Card>
  );
}
