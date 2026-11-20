import type { MetadataRoute } from "next";
import { direccionSitio } from "@/lib/metadata";

/**
 * Enumera las rutas generales sin incluir colecciones o datos personales.
 * @returns {MetadataRoute.Sitemap} Mapa del sitio con URLs absolutas.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/login", "/register"].map((rutaInterna) => ({ url: new URL(rutaInterna, direccionSitio).toString(), changeFrequency: "weekly", priority: rutaInterna === "/" ? 1 : 0.5 }));
}
