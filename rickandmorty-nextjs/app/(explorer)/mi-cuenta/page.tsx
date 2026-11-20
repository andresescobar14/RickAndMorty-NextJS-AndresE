import { crearMetadatosPagina } from "@/lib/metadata";
import PanelCuenta from "@/components/organisms/AccountPanel";

/** Metadatos de la pantalla de cuenta. */
export const metadata = crearMetadatosPagina("Mi cuenta", "Consulta y administra tu cuenta de Rick & Morty Explorer.", "/mi-cuenta");

/**
 * Muestra datos y acciones de edición de la cuenta activa.
 *
 * @returns {React.JSX.Element} Encabezado y panel de la cuenta.
 */
export default function PaginaCuenta() {
  return (
    <><header className="page-heading"><p className="auth-eyebrow">ARCHIVO / IDENTIDAD DEL EXPLORADOR</p><h1>Mi cuenta</h1><p>Tu perfil y tus preferencias, en un solo lugar.</p></header><PanelCuenta /></>
  );
}
