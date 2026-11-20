import type { FiltrosPersonajes, ParametrosBusquedaUrl } from "@/types/character";

/**
 * Obtiene el primer texto de un parámetro que puede venir repetido.
 * @param {string | string[] | undefined} valorRecibido - Valor de la URL.
 * @returns {string} Texto del parámetro o cadena vacía.
 */
function leerParametroTexto(valorRecibido: string | string[] | undefined): string {
  return Array.isArray(valorRecibido) ? valorRecibido[0] || "" : valorRecibido || "";
}

/**
 * Convierte los parámetros de la URL en filtros válidos para la API.
 * @param {ParametrosBusquedaUrl} valoresBusqueda - Parámetros recibidos por Next.js.
 * @returns {FiltrosPersonajes} Página positiva y filtros normalizados.
 */
export function leerFiltrosDeUrl(valoresBusqueda: ParametrosBusquedaUrl): FiltrosPersonajes {
  const paginaSolicitada = Number(leerParametroTexto(valoresBusqueda.page));
  const estadoPersonaje = leerParametroTexto(valoresBusqueda.status).toLowerCase();
  const generoPersonaje = leerParametroTexto(valoresBusqueda.gender).toLowerCase();
  return {
    page: Number.isSafeInteger(paginaSolicitada) && paginaSolicitada > 0 ? paginaSolicitada : 1,
    name: leerParametroTexto(valoresBusqueda.name).trim(),
    status: ["alive", "dead", "unknown"].includes(estadoPersonaje) ? estadoPersonaje : "",
    gender: ["female", "male", "genderless", "unknown"].includes(generoPersonaje) ? generoPersonaje : "",
    species: leerParametroTexto(valoresBusqueda.species).trim(),
  };
}

/**
 * Construye una consulta compartible a partir de los filtros del listado.
 * @param {FiltrosPersonajes} filtrosPersonajes - Valores normalizados del listado.
 * @returns {string} Consulta sin el signo de interrogación.
 */
export function crearConsultaPersonajes(filtrosPersonajes: FiltrosPersonajes): string {
  const consultaPersonajes = new URLSearchParams();
  if (filtrosPersonajes.page > 1) consultaPersonajes.set("page", String(filtrosPersonajes.page));
  if (filtrosPersonajes.name) consultaPersonajes.set("name", filtrosPersonajes.name);
  if (filtrosPersonajes.status) consultaPersonajes.set("status", filtrosPersonajes.status);
  if (filtrosPersonajes.gender) consultaPersonajes.set("gender", filtrosPersonajes.gender);
  if (filtrosPersonajes.species) consultaPersonajes.set("species", filtrosPersonajes.species);
  return consultaPersonajes.toString();
}

/**
 * Acepta únicamente destinos internos del listado o de favoritos.
 * @param {string | string[] | undefined} valorRecibido - Destino recibido en la URL del detalle.
 * @returns {string} Ruta interna a la que se puede volver con seguridad.
 */
export function elegirRegresoSeguro(valorRecibido: string | string[] | undefined): string {
  const rutaInterna = leerParametroTexto(valorRecibido);
  if (rutaInterna === "/" || rutaInterna === "/favoritos") return rutaInterna;
  if (rutaInterna.startsWith("/?")) return rutaInterna;
  return "/";
}
