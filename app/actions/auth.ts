"use server";

import { headers } from "next/headers";
import { isAPIError } from "better-auth/api";

import { auth } from "@/lib/auth";
import { getDefaultRedirectPath, requireSession } from "@/lib/auth-helpers";
import { type FormState, initialFormState } from "@/lib/form-state";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema, loginSchema } from "@/lib/validations/auth";

function mapApiErrorMessage(error: unknown) {
  if (isAPIError(error)) {
    switch (error.status) {
      case 400:
      case 401:
        return "Correo o contraseña incorrectos.";
      case 403:
        return "Tu cuenta no puede iniciar sesión con esta configuracion.";
      default:
        return error.message || "No se pudo completar la operación.";
    }
  }

  return "Ocurrio un error inesperado. Intenta nuevamente.";
}

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Corrige los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await auth.api.signInEmail({
      body: parsed.data,
      headers: await headers(),
    });

    return {
      status: "success",
      message: "Inicio de sesión correcto.",
      redirectTo: getDefaultRedirectPath(result.user),
    };
  } catch (error) {
    return {
      status: "error",
      message: mapApiErrorMessage(error),
    };
  }
}

export async function changePasswordAction(_: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const requestHeaders = await headers();
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Corrige los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: true,
      },
      headers: requestHeaders,
    });

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        mustChangePassword: false,
      },
    });

    await auth.api.signOut({
      headers: requestHeaders,
    });

    return {
      status: "success",
      message: "Contraseña actualizada correctamente.",
      redirectTo: "/login",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        isAPIError(error) && error.status === 400
          ? "La contraseña actual no es valida o la nueva contraseña no cumple el formato requerido."
          : mapApiErrorMessage(error),
    };
  }
}

export { initialFormState };
