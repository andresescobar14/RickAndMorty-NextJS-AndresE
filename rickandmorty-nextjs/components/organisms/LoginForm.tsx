"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import BotonAccion from "@/components/atoms/Button";
import CampoFormulario from "@/components/molecules/FormField";
import { reglasInicioSesion } from "@/schemas/auth";
import { useSesionExplorador } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

/** Mensajes de validación que pueden aparecer bajo cada campo. */
type ErroresAcceso = { email?: string; password?: string };

/**
 * Valida el formulario y comprueba las credenciales de una cuenta registrada.
 *
 * @returns {React.JSX.Element} Formulario de acceso con errores por campo.
 */
export default function FormularioAcceso() {
  const { abrirSesionExplorador } = useSesionExplorador();
  const navegacionAplicacion = useRouter();
  const [correoExplorador, cambiarCorreoExplorador] = useState("");
  const [claveExplorador, cambiarClaveExplorador] = useState("");
  const [erroresAcceso, mostrarErroresAcceso] = useState<ErroresAcceso>({});
  const [problemaEnvioAcceso, mostrarProblemaEnvioAcceso] = useState("");
  const [enviandoAcceso, marcarEnvioAcceso] = useState(false);

  /**
   * Evita la recarga del navegador y comprueba los datos con Zod.
   *
   * @param {React.FormEvent<HTMLFormElement>} eventoAcceso - Envío del formulario.
   * @returns {Promise<void>} Inicia sesión o presenta el error de credenciales.
   */
  async function comprobarAccesoExplorador(eventoAcceso: FormEvent<HTMLFormElement>) {
    eventoAcceso.preventDefault();
    if (enviandoAcceso) return;
    mostrarProblemaEnvioAcceso("");

    const resultadoAcceso = reglasInicioSesion.safeParse({ email: correoExplorador, password: claveExplorador });

    if (!resultadoAcceso.success) {
      const erroresCamposAcceso = z.flattenError(resultadoAcceso.error).fieldErrors;
      mostrarErroresAcceso({
        email: erroresCamposAcceso.email?.[0],
        password: erroresCamposAcceso.password?.[0],
      });
      return;
    }

    mostrarErroresAcceso({});
    marcarEnvioAcceso(true);
    try {
      await abrirSesionExplorador(resultadoAcceso.data.email, resultadoAcceso.data.password);
      navegacionAplicacion.replace("/");
    } catch (problemaAcceso) {
      mostrarProblemaEnvioAcceso(problemaAcceso instanceof Error ? problemaAcceso.message : "No pudimos iniciar sesión.");
    } finally {
      marcarEnvioAcceso(false);
    }
  }

  return (
    <form
      onSubmit={comprobarAccesoExplorador}
      onChange={() => mostrarProblemaEnvioAcceso("")}
      noValidate
      className="auth-form"
    >
      <CampoFormulario
        id="login-email"
        name="email"
        label="Correo electrónico"
        type="email"
        autoComplete="username"
        value={correoExplorador}
        onChange={(eventoAcceso) => cambiarCorreoExplorador(eventoAcceso.target.value)}
        error={erroresAcceso.email}
        placeholder="correo@ejemplo.com"
        required
      />
      <CampoFormulario
        id="login-password"
        name="password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        value={claveExplorador}
        onChange={(eventoAcceso) => cambiarClaveExplorador(eventoAcceso.target.value)}
        error={erroresAcceso.password}
        placeholder="Mínimo 8 caracteres"
        required
      />
      {problemaEnvioAcceso && <p role="alert" className="form-error">{problemaEnvioAcceso}</p>}
      <BotonAccion type="submit" disabled={enviandoAcceso}>
        {enviandoAcceso ? "Abriendo portal…" : "Iniciar sesión"}
      </BotonAccion>
    </form>
  );
}
