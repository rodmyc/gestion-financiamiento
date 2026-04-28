"use server";

import { headers } from "next/headers";
import { isAPIError } from "better-auth/api";

import { auth } from "@/lib/auth";
import { requireAdminSession } from "@/lib/auth-helpers";
import { type FormState, initialFormState } from "@/lib/form-state";
import { createUserSchema, deriveNameFromEmail } from "@/lib/validations/auth";

export async function createUserAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdminSession();

  const parsed = createUserSchema.safeParse({
    email: formData.get("email"),
    provisionalPassword: formData.get("provisionalPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Corrige los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await auth.api.createUser({
      body: {
        email: parsed.data.email,
        password: parsed.data.provisionalPassword,
        name: deriveNameFromEmail(parsed.data.email),
        role: "user",
        data: {
          mustChangePassword: true,
        },
      },
      headers: await headers(),
    });

    return {
      status: "success",
      message: "Usuario creado. En su primer ingreso deberá cambiar la contraseña.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        isAPIError(error) && error.status === 400
          ? "No se pudo crear el usuario. Verifica si el correo ya existe."
          : "No se pudo crear el usuario.",
    };
  }
}

export { initialFormState };
