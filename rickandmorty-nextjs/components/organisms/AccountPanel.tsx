"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import { useSesionExplorador } from "@/context/AuthContext";
import { useFavoritosExplorador } from "@/context/FavoritesContext";
import { reglasNombreCuenta, reglasCambioClave } from "@/schemas/account";
import CampoFormulario from "@/components/molecules/FormField";
import BotonAccion from "@/components/atoms/Button";

type ErroresCambioClave = { currentPassword?: string; newPassword?: string; confirmPassword?: string };

/**
 * Permite consultar el perfil, editar nombre y contraseña y cerrar sesión.
 * @returns {React.JSX.Element | null} Datos y formularios de la cuenta activa.
 */
export default function PanelCuenta() {
  const { exploradorActual, actualizarNombreCuenta, actualizarClaveCuenta, cerrarSesionActual } = useSesionExplorador();
  const { identificadoresFavoritos } = useFavoritosExplorador();
  const [nombreExplorador, cambiarNombreExplorador] = useState(exploradorActual?.name || "");
  const [problemaNombreCuenta, mostrarProblemaNombreCuenta] = useState("");
  const [confirmacionNombreCuenta, mostrarConfirmacionNombreCuenta] = useState("");
  const [claveActual, cambiarClaveActual] = useState("");
  const [claveNueva, cambiarClaveNueva] = useState("");
  const [confirmacionClave, cambiarConfirmacionClave] = useState("");
  const [erroresCambioClave, mostrarErroresCambioClave] = useState<ErroresCambioClave>({});
  const [problemaCambioClave, mostrarProblemaCambioClave] = useState("");
  const [confirmacionCambioClave, mostrarConfirmacionCambioClave] = useState("");
  const [guardandoClave, marcarGuardadoClave] = useState(false);
  const [problemaCierreSesion, mostrarProblemaCierreSesion] = useState("");

  /**
   * Valida y guarda el nombre sin modificar correo ni contraseña.
   * @param {React.FormEvent<HTMLFormElement>} eventoCuenta - Envío del formulario de nombre.
   * @returns {void} Muestra error o confirmación de guardado.
   */
  function guardarNombreCuenta(eventoCuenta: FormEvent<HTMLFormElement>) {
    eventoCuenta.preventDefault();
    mostrarConfirmacionNombreCuenta("");
    const resultadoCuenta = reglasNombreCuenta.safeParse({ name: nombreExplorador });
    if (!resultadoCuenta.success) { mostrarProblemaNombreCuenta(z.flattenError(resultadoCuenta.error).fieldErrors.name?.[0] || "Revisa tu nombre."); return; }
    try {
      actualizarNombreCuenta(resultadoCuenta.data.name);
      cambiarNombreExplorador(resultadoCuenta.data.name);
      mostrarProblemaNombreCuenta("");
      mostrarConfirmacionNombreCuenta("Nombre actualizado.");
    } catch (problemaCuenta) { mostrarProblemaNombreCuenta(problemaCuenta instanceof Error ? problemaCuenta.message : "No pudimos guardar el nombre."); }
  }

  /**
   * Valida la nueva contraseña y comprueba la actual antes de cambiarla.
   * @param {React.FormEvent<HTMLFormElement>} eventoCuenta - Envío del formulario de contraseña.
   * @returns {Promise<void>} Guarda la nueva contraseña o explica el problema.
   */
  async function guardarNuevaContrasena(eventoCuenta: FormEvent<HTMLFormElement>) {
    eventoCuenta.preventDefault();
    if (guardandoClave) return;
    mostrarProblemaCambioClave("");
    mostrarConfirmacionCambioClave("");
    const resultadoCuenta = reglasCambioClave.safeParse({ currentPassword: claveActual, newPassword: claveNueva, confirmPassword: confirmacionClave });
    if (!resultadoCuenta.success) {
      const erroresCuenta = z.flattenError(resultadoCuenta.error).fieldErrors;
      mostrarErroresCambioClave({ currentPassword: erroresCuenta.currentPassword?.[0], newPassword: erroresCuenta.newPassword?.[0], confirmPassword: erroresCuenta.confirmPassword?.[0] });
      return;
    }
    mostrarErroresCambioClave({});
    marcarGuardadoClave(true);
    try {
      await actualizarClaveCuenta(resultadoCuenta.data.currentPassword, resultadoCuenta.data.newPassword);
      cambiarClaveActual(""); cambiarClaveNueva(""); cambiarConfirmacionClave("");
      mostrarConfirmacionCambioClave("Contraseña actualizada.");
    } catch (problemaCuenta) { mostrarProblemaCambioClave(problemaCuenta instanceof Error ? problemaCuenta.message : "No pudimos cambiar la contraseña."); }
    finally { marcarGuardadoClave(false); }
  }

  /** Cierra la sesión desde la página de cuenta. @returns {void} */
  function salirDelExplorador() {
    try { cerrarSesionActual(); } catch { mostrarProblemaCierreSesion("No pudimos cerrar la sesión. Vuelve a intentarlo."); }
  }

  if (!exploradorActual) return null;
  return (
    <>
      <dl className="account-summary" data-aos="fade-up">
        <div><dt>Explorador</dt><dd>{exploradorActual.name}</dd></div>
        <div><dt>Correo electrónico</dt><dd>{exploradorActual.email}</dd></div>
        <div><dt>Fecha de registro</dt><dd>{new Intl.DateTimeFormat("es", { dateStyle: "long" }).format(new Date(exploradorActual.createdAt))}</dd></div>
        <div><dt>Favoritos guardados</dt><dd>{identificadoresFavoritos.length}</dd></div>
      </dl>
      <div className="account-forms">
        <section className="settings-panel" data-aos="fade-up" data-aos-delay="100"><h2>Tu nombre en el archivo</h2><p>El nombre con el que te reconoceremos en el multiverso.</p>
          <form className="auth-form" onSubmit={guardarNombreCuenta} noValidate onChange={() => mostrarConfirmacionNombreCuenta("")}>
            <CampoFormulario id="account-name" label="Nombre" value={nombreExplorador} onChange={(eventoCuenta) => cambiarNombreExplorador(eventoCuenta.target.value)} error={problemaNombreCuenta} autoComplete="name" required />
            <BotonAccion type="submit">Guardar nombre</BotonAccion><p role="status" className="form-status">{confirmacionNombreCuenta}</p>
          </form>
        </section>
        <section className="settings-panel" data-aos="fade-up" data-aos-delay="200"><h2>Cambiar contraseña</h2><p>Confirma tu contraseña actual antes de elegir una nueva.</p>
          <form className="auth-form" onSubmit={guardarNuevaContrasena} noValidate onChange={() => { mostrarConfirmacionCambioClave(""); mostrarProblemaCambioClave(""); }}>
            <CampoFormulario id="current-password" label="Contraseña actual" type="password" value={claveActual} onChange={(eventoCuenta) => cambiarClaveActual(eventoCuenta.target.value)} error={erroresCambioClave.currentPassword} autoComplete="current-password" required />
            <CampoFormulario id="new-password" label="Nueva contraseña" type="password" value={claveNueva} onChange={(eventoCuenta) => cambiarClaveNueva(eventoCuenta.target.value)} error={erroresCambioClave.newPassword} autoComplete="new-password" required />
            <CampoFormulario id="confirm-new-password" label="Confirmar nueva contraseña" type="password" value={confirmacionClave} onChange={(eventoCuenta) => cambiarConfirmacionClave(eventoCuenta.target.value)} error={erroresCambioClave.confirmPassword} autoComplete="new-password" required />
            {problemaCambioClave && <p role="alert" className="form-error">{problemaCambioClave}</p>}
            <BotonAccion type="submit" disabled={guardandoClave}>{guardandoClave ? "Guardando…" : "Actualizar contraseña"}</BotonAccion>
            <p role="status" className="form-status">{confirmacionCambioClave}</p>
          </form>
        </section>
      </div>
      <section className="logout-section" data-aos="fade-up"><div><h2>Cerrar sesión</h2><p>Tu cuenta y tus favoritos seguirán guardados en este navegador.</p></div><BotonAccion className="button-quiet" onClick={salirDelExplorador}>Cerrar sesión</BotonAccion>{problemaCierreSesion && <p role="alert" className="form-error">{problemaCierreSesion}</p>}</section>
    </>
  );
}
