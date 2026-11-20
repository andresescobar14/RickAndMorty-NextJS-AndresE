/** Personaje tal como lo entrega la API pública. */
export type PersonajeApi = {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
};

/** Episodio utilizado en la ficha de un personaje. */
export type EpisodioSerie = { id: number; name: string; episode: string; air_date: string };

/** Datos de la respuesta paginada de personajes. */
export type RespuestaPersonajesApi = {
  info: { count: number; pages: number; next: string | null; prev: string | null };
  results: PersonajeApi[];
};

/** Filtros normalizados que utiliza el listado. */
export type FiltrosPersonajes = {
  page: number;
  name: string;
  status: string;
  gender: string;
  species: string;
};

/** Parámetros de búsqueda recibidos por una página de Next.js. */
export type ParametrosBusquedaUrl = { [clavePreparada: string]: string | string[] | undefined };
