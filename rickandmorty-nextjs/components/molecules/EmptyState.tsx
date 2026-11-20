import Link from "next/link";

/**
 * Explica un listado vacío y ofrece un destino para continuar.
 * @param {Object} props - Mensaje y enlace de recuperación.
 * @param {string} props.title - Encabezado del estado vacío.
 * @param {string} props.message - Explicación de la ausencia de resultados.
 * @param {string} [props.href='/'] - Destino interno para continuar.
 * @param {string} [props.linkLabel='Volver al listado'] - Texto del enlace.
 * @returns {React.JSX.Element} Estado vacío con una acción útil.
 */
export default function ArchivoVacio({ title: tituloPagina, message: confirmacionPantalla, href: enlacePersonaje = "/", linkLabel = "Volver al listado" }: {
  title: string; message: string; href?: string; linkLabel?: string;
}) {
  return <section className="empty-state"><p className="auth-eyebrow">SIN COINCIDENCIAS EN ESTE SECTOR</p><h2>{tituloPagina}</h2><p>{confirmacionPantalla}</p><Link href={enlacePersonaje} className="text-link">{linkLabel}</Link></section>;
}
