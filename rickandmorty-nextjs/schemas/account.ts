import { z } from "zod";

/** Reglas para editar únicamente el nombre público de la cuenta. */
export const reglasNombreCuenta = z.object({ name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres") });

/** Reglas para pedir la contraseña actual y confirmar una nueva. */
export const reglasCambioClave = z.object({
  currentPassword: z.string().min(1, "Escribe tu contraseña actual"),
  newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string().min(1, "Confirma tu nueva contraseña"),
}).refine((datosCuenta) => datosCuenta.newPassword === datosCuenta.confirmPassword, { message: "Las contraseñas no coinciden", path: ["confirmPassword"] });
