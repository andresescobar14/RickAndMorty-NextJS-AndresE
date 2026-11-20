"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import BotonAccion from "@/components/atoms/Button";
import CampoFormulario from "@/components/molecules/FormField";
import { reglasRegistroExplorador } from "@/schemas/auth";
import { registrarExplorador } from "@/services/auth";

/** Cada campo puede tener un mensaje de error o no tenerlo. */
type ErroresRegistro = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

/**
 * Controla los cuatro campos del registro y muestra sus errores de validación.
 * Guarda una cuenta después de comprobar los datos y que el correo no exista.
 *
 * @returns {React.JSX.Element} Formulario de registro interactivo.
 */
export default function FormularioRegistro() {
  const [nombreExplorador, cambiarNombreExplorador] = useState("");
  const [correoExplorador, cambiarCorreoExplorador] = useState("");
  const [claveExplorador, cambiarClaveExplorador] = useState("");
  const [confirmacionClave, cambiarConfirmacionClave] = useState("");
  const [erroresRegistro, mostrarErroresRegistro] = useState<ErroresRegistro>({});
  const [confirmacionRegistro, mostrarConfirmacionRegistro] = useState("");
  const [problemaEnvioRegistro, mostrarProblemaEnvioRegistro] = useState("");
  const [enviandoRegistro, marcarEnvioRegistro] = useState(false);

  /**
   * Valida los datos al enviar y conserva el primer error de cada campo.
   *
   * @param {React.FormEvent<HTMLFormElement>} eventoRegistro - Envío del formulario.
   * @returns {Promise<void>} Registra la cuenta o muestra el error del guardado.
   */
  async function registrarCuentaExplorador(eventoRegistro: FormEvent<HTMLFormElement>) {
    eventoRegistro.preventDefault();
    if (enviandoRegistro) return;
    mostrarConfirmacionRegistro("");
    mostrarProblemaEnvioRegistro("");

    const resultadoRegistro = reglasRegistroExplorador.safeParse({ name: nombreExplorador, email: correoExplorador, password: claveExplorador, confirmPassword: confirmacionClave });

    if (!resultadoRegistro.success) {
      const erroresCamposRegistro = z.flattenError(resultadoRegistro.error).fieldErrors;
      mostrarErroresRegistro({
        name: erroresCamposRegistro.name?.[0],
        email: erroresCamposRegistro.email?.[0],
        password: erroresCamposRegistro.password?.[0],
        confirmPassword: erroresCamposRegistro.confirmPassword?.[0],
      });
      return;
    }

    mostrarErroresRegistro({});
    marcarEnvioRegistro(true);
    try {
      await registrarExplorador(resultadoRegistro.data);
      mostrarConfirmacionRegistro("Cuenta creada. Ya puedes iniciar sesión con el enlace de abajo.");
      cambiarClaveExplorador("");
      cambiarConfirmacionClave("");
    } catch (problemaRegistro) {
      mostrarProblemaEnvioRegistro(problemaRegistro instanceof Error ? problemaRegistro.message : "No pudimos crear la cuenta.");
    } finally {
      marcarEnvioRegistro(false);
    }
  }

  return (
    <form
      onSubmit={registrarCuentaExplorador}
      onChange={() => { mostrarConfirmacionRegistro(""); mostrarProblemaEnvioRegistro(""); }}
      noValidate
      className="auth-form"
    >
      <CampoFormulario
        id="register-name"
        name="name"
        label="Nombre"
        type="text"
        autoComplete="name"
        value={nombreExplorador}
        onChange={(eventoRegistro) => cambiarNombreExplorador(eventoRegistro.target.value)}
        error={erroresRegistro.name}
        placeholder="Tu nombre"
        required
      />
      <CampoFormulario
        id="register-email"
        name="email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        value={correoExplorador}
        onChange={(eventoRegistro) => cambiarCorreoExplorador(eventoRegistro.target.value)}
        error={erroresRegistro.email}
        placeholder="correo@ejemplo.com"
        required
      />
      <CampoFormulario
        id="register-password"
        name="password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        value={claveExplorador}
        onChange={(eventoRegistro) => cambiarClaveExplorador(eventoRegistro.target.value)}
        error={erroresRegistro.password}
        placeholder="Mínimo 8 caracteres"
        required
      />
      <CampoFormulario
        id="register-confirm-password"
        name="confirmPassword"
        label="Confirmar contraseña"
        type="password"
        autoComplete="new-password"
        value={confirmacionClave}
        onChange={(eventoRegistro) => cambiarConfirmacionClave(eventoRegistro.target.value)}
        error={erroresRegistro.confirmPassword}
        placeholder="Repite tu contraseña"
        required
      />
      {problemaEnvioRegistro && <p role="alert" className="form-error">{problemaEnvioRegistro}</p>}
      <BotonAccion type="submit" disabled={enviandoRegistro}>
        {enviandoRegistro ? "Creando cuenta…" : "Crear cuenta"}
      </BotonAccion>
      <p role="status" className="form-status">{confirmacionRegistro}</p>
    </form>
  );
}
