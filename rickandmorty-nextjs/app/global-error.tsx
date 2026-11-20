"use client";

/**
 * Sustituye incluso el documento raíz si falla el layout principal.
 * @param {Object} props - Acción de recuperación de Next.js.
 * @param {Function} props.retry - Repite el renderizado de la aplicación.
 * @returns {React.JSX.Element} Documento mínimo de error con opción de reintento.
 */
export default function ErrorDocumento({ retry: reintentarDocumento }: { retry: () => void }) {
  return <html lang="es"><body style={{ margin: 0, padding: "48px 24px", background: "#050914", color: "#edf4ff", fontFamily: "Arial, sans-serif" }}><title>Error | Rick &amp; Morty Explorer</title><main><h1>No pudimos abrir el multiverso</h1><p>Se produjo un problema inesperado.</p><button onClick={reintentarDocumento} style={{ padding: "12px 24px", background: "#2563eb", color: "white", border: 0, borderRadius: 6 }}>Reintentar</button></main></body></html>;
}
