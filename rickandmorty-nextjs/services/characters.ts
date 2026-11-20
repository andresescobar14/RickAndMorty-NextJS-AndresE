import { crearConsultaPersonajes } from "@/lib/filters";
import type { PersonajeApi, FiltrosPersonajes, RespuestaPersonajesApi, EpisodioSerie } from "@/types/character";

const URL_API_MULTIVERSO = "https://rickandmortyapi.com/api";

/**
 * Pide el listado desde el efecto del componente cliente.
 * @param {FiltrosPersonajes} filtrosPersonajes - Búsqueda, filtros y página del listado.
 * @param {AbortSignal} [senalCancelacion] - Permite cancelar una consulta anterior.
 * @returns {Promise<RespuestaPersonajesApi>} Resultados o una lista vacía si la API responde 404.
 * @throws {Error} Si falla la conexión o la API responde con otro error.
 */
export async function consultarPersonajes(filtrosPersonajes: FiltrosPersonajes, senalCancelacion?: AbortSignal): Promise<RespuestaPersonajesApi> {
  const respuestaHttpApi = await fetch(`${URL_API_MULTIVERSO}/character?${crearConsultaPersonajes(filtrosPersonajes)}`, { signal: senalCancelacion });
  if (respuestaHttpApi.status === 404) {
    return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };
  }
  if (!respuestaHttpApi.ok) throw new Error("No pudimos cargar los personajes. Vuelve a intentarlo.");
  return respuestaHttpApi.json();
}

/**
 * Obtiene una ficha y distingue un personaje inexistente de un fallo de servicio.
 * @param {number} identificadorApi - Identificador entero positivo del personaje.
 * @param {AbortSignal} [senalCancelacion] - Permite cancelar la consulta si cambia la pantalla.
 * @returns {Promise<PersonajeApi | null>} Personaje o null para un identificador inexistente.
 * @throws {Error} Si la petición falla por un motivo distinto a 404.
 */
export async function consultarPersonaje(identificadorApi: number, senalCancelacion?: AbortSignal): Promise<PersonajeApi | null> {
  if (!Number.isSafeInteger(identificadorApi) || identificadorApi < 1) return null;
  const respuestaHttpApi = await fetch(`${URL_API_MULTIVERSO}/character/${identificadorApi}`, { signal: senalCancelacion });
  if (respuestaHttpApi.status === 404) return null;
  if (!respuestaHttpApi.ok) throw new Error("No pudimos cargar la ficha del personaje.");
  return respuestaHttpApi.json();
}

/**
 * Obtiene todos los episodios del personaje con una única petición.
 * @param {number[]} identificadoresEpisodios - Identificadores de los episodios.
 * @param {AbortSignal} [senalCancelacion] - Permite cancelar la consulta del detalle.
 * @returns {Promise<EpisodioSerie[]>} Episodios, normalizados a una lista incluso si hay uno.
 * @throws {Error} Si no se puede cargar la información.
 */
export async function consultarEpisodios(identificadoresEpisodios: number[], senalCancelacion?: AbortSignal): Promise<EpisodioSerie[]> {
  if (identificadoresEpisodios.length === 0) return [];
  const respuestaHttpApi = await fetch(`${URL_API_MULTIVERSO}/episode/${identificadoresEpisodios.join(",")}`, { signal: senalCancelacion });
  if (!respuestaHttpApi.ok) throw new Error("No pudimos cargar los episodios del personaje.");
  const datosApi = await respuestaHttpApi.json();
  return Array.isArray(datosApi) ? datosApi : [datosApi];
}

/**
 * Consulta en el servidor los datos necesarios para el título y la tarjeta social.
 * La interfaz carga sus propios datos con useEffect; esta función solo sirve al SEO.
 * @param {number} identificadorApi - Identificador del personaje de la ruta.
 * @returns {Promise<PersonajeApi | null>} Ficha con caché de cinco minutos para los metadatos.
 * @throws {Error} Si la API falla por un motivo distinto a un personaje inexistente.
 */
export async function consultarPersonajeParaSeo(identificadorApi: number): Promise<PersonajeApi | null> {
  if (!Number.isSafeInteger(identificadorApi) || identificadorApi < 1) return null;
  const respuestaHttpApi = await fetch(`${URL_API_MULTIVERSO}/character/${identificadorApi}`, { next: { revalidate: 300 } });
  if (respuestaHttpApi.status === 404) return null;
  if (!respuestaHttpApi.ok) throw new Error("No pudimos cargar los metadatos del personaje.");
  return respuestaHttpApi.json();
}
