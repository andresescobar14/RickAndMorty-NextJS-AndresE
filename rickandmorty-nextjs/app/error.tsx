"use client";

import ErrorDelPortal from "@/components/organisms/ErrorState";

/**
 * Maneja errores de cualquier página situada bajo el layout raíz.
 * @param {Object} props - Acción de recuperación de Next.js.
 * @param {Function} props.retry - Vuelve a solicitar el contenido de la ruta.
 * @returns {React.JSX.Element} Estado de error general.
 */
export default function ErrorAplicacion({ retry: reintentarCargaPagina }: { retry: () => void }) {
  return <main className="session-screen"><ErrorDelPortal retry={reintentarCargaPagina} /></main>;
}
