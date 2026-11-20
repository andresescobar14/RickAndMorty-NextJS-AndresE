import type { Metadata } from "next";

const direccionConfigurada = process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

/** Dirección absoluta usada por metadata, robots y sitemap. */
export const direccionSitio = new URL(direccionConfigurada);

/**
 * Construye títulos, descripciones y tarjetas sociales consistentes.
 * @param {string} tituloPagina - Título propio de la página.
 * @param {string} descripcionPagina - Descripción propia de la página.
 * @param {string} [rutaInterna='/'] - Ruta canónica dentro de la aplicación.
 * @param {string} [imagenPersonaje='/social-preview.png'] - Imagen social local o del personaje.
 * @returns {Metadata} Metadatos de Next.js, Open Graph y Twitter.
 */
export function crearMetadatosPagina(tituloPagina: string, descripcionPagina: string, rutaInterna = "/", imagenPersonaje = "/social-preview.png"): Metadata {
  return {
    title: tituloPagina,
    description: descripcionPagina,
    alternates: { canonical: rutaInterna },
    openGraph: { title: `${tituloPagina} | Rick & Morty Explorer`, description: descripcionPagina, url: rutaInterna, type: "website", locale: "es_ES", siteName: "Rick & Morty Explorer", images: [{ url: imagenPersonaje, alt: tituloPagina }] },
    twitter: { card: "summary_large_image", title: `${tituloPagina} | Rick & Morty Explorer`, description: descripcionPagina, images: [imagenPersonaje] },
  };
}
