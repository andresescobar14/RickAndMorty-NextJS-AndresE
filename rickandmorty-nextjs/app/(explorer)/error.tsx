"use client";

import ErrorDelPortal from "@/components/organisms/ErrorState";

/**
 * Recupera errores de las páginas privadas sin perder su navegación.
 * @param {Object} props - Acción de recuperación de Next.js.
 * @param {Function} props.retry - Repite la petición de la ruta actual.
 * @returns {React.JSX.Element} Pantalla de error de carga.
 */
export default function ErrorExplorador({ retry: reintentarExplorador }: { retry: () => void }) {
  return <ErrorDelPortal retry={reintentarExplorador} />;
}
