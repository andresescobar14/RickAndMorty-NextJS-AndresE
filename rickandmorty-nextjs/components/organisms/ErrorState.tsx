"use client";

import BotonAccion from "@/components/atoms/Button";

/**
 * Explica un fallo de carga y permite volver a pedir la ruta.
 * @param {Object} props - Acción de recuperación entregada por Next.js.
 * @param {Function} props.retry - Vuelve a pedir y renderizar el segmento.
 * @returns {React.JSX.Element} Mensaje de error con un botón de reintento.
 */
export default function ErrorDelPortal({ retry: reintentarCargaPortal }: { retry: () => void }) {
  return <section className="empty-state"><p className="auth-eyebrow">CONEXIÓN INTERRUMPIDA</p><h1>Este portal necesita otro intento</h1><p>No pudimos cargar la información. Comprueba tu conexión y vuelve a intentarlo.</p><BotonAccion className="button-quiet" onClick={reintentarCargaPortal}>Reintentar</BotonAccion></section>;
}
