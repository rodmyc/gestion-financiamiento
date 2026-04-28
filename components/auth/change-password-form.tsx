"use client";

import { useActionState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { changePasswordAction, initialFormState } from "@/app/actions/auth";
import { FieldError } from "@/components/shared/field-error";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(changePasswordAction, initialFormState);

  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }

    if (state.status === "success") {
      toast.success(state.message ?? "Contraseña actualizada.");

      if (state.redirectTo) {
        router.replace(state.redirectTo);
        router.refresh();
      }
    }
  }, [router, state]);

  return (
    <Card className="border-border/60 shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Cambio obligatorio de contraseña</CardTitle>
        <CardDescription>
          Tu acceso inicial usa una contraseña provisional. Debes reemplazarla antes de continuar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <Input autoComplete="current-password" id="currentPassword" name="currentPassword" type="password" />
            <FieldError errors={state.fieldErrors?.currentPassword} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input autoComplete="new-password" id="newPassword" name="newPassword" type="password" />
            <FieldError errors={state.fieldErrors?.newPassword} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
            <Input autoComplete="new-password" id="confirmPassword" name="confirmPassword" type="password" />
            <FieldError errors={state.fieldErrors?.confirmPassword} />
          </div>

          <SubmitButton
            label="Actualizar contraseña"
            pending={pending}
            pendingLabel="Actualizando contraseña..."
          />
        </form>
      </CardContent>
    </Card>
  );
}
