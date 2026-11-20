import { z } from "zod";

/** Correo obligatorio, sin espacios externos y normalizado a minúsculas. */
const reglasCorreoExplorador = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "El correo es obligatorio")
  .pipe(z.email("Escribe un correo válido"));

/** Contraseña obligatoria de al menos ocho caracteres; no se modifica su contenido. */
const reglasClaveExplorador = z
  .string()
  .min(1, "La contraseña es obligatoria")
  .min(8, "La contraseña debe tener al menos 8 caracteres");

/**
 * Comprueba el formato del login; no verifica si el usuario está registrado.
 */
export const reglasInicioSesion = z.object({
  email: reglasCorreoExplorador,
  password: reglasClaveExplorador,
});

/**
 * Esquema de validación para el formulario de registro de usuario.
 */
export const reglasRegistroExplorador = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "El nombre es obligatorio")
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    email: reglasCorreoExplorador,
    password: reglasClaveExplorador,
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((datosRegistro) => datosRegistro.password === datosRegistro.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

/** Tipos inferidos de los esquemas de autenticación */
export type DatosAccesoExplorador = z.infer<typeof reglasInicioSesion>;
export type DatosRegistroExplorador = z.infer<typeof reglasRegistroExplorador>;
