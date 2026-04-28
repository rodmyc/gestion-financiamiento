import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .max(128, "La contraseña no puede superar los 128 caracteres.")
  .regex(/[A-Za-z]/, "La contraseña debe incluir al menos una letra.")
  .regex(/\d/, "La contraseña debe incluir al menos un numero.");

export const loginSchema = z.object({
  email: z.email("Ingresa un correo valido.").transform((value) => value.toLowerCase().trim()),
  password: z.string().min(1, "La contraseña es obligatoria."),
});

export const createUserSchema = z.object({
  email: z.email("Ingresa un correo valido.").transform((value) => value.toLowerCase().trim()),
  provisionalPassword: passwordSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es obligatoria."),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirma la nueva contraseña."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "La confirmacion no coincide con la nueva contraseña.",
    path: ["confirmPassword"],
  });

export function deriveNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? email;
  const normalized = localPart.replace(/[._-]+/g, " ").trim();

  if (!normalized) {
    return email;
  }

  return normalized.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
