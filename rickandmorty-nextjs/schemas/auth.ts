import { z } from "zod";

/**
 * Esquema de validación para el formulario de inicio de sesión.
 */
export const loginScheme = z.object({
email: z
  .string()
  .min(1, "El correo es obligatorio")
  .pipe(z.email("Escriba un correo válido")),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

/**
 * Esquema de validación para el formulario de registro de usuario.
 */
export const registerScheme = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres"),
email: z
  .string()
  .min(1, "El correo es obligatorio")
  .pipe(z.email("Escriba un correo válido")),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "Confirme su contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

/** Tipos inferidos de los esquemas de autenticación */
export type LoginFormData = z.infer<typeof loginScheme>;
export type RegisterFormData = z.infer<typeof registerScheme>;