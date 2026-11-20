import type { MetadataRoute } from "next";
import { direccionSitio } from "@/lib/metadata";

/**
 * Evita indexar las pantallas personales y enlaza el mapa del sitio.
 * @returns {MetadataRoute.Robots} Reglas públicas del archivo robots.txt.
 */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/mi-cuenta", "/favoritos"] }, sitemap: new URL("/sitemap.xml", direccionSitio).toString() };
}
