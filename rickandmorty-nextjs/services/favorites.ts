import { z } from "zod";
import type { PersonajeApi } from "@/types/character";

/**
 * Devuelve una clave distinta para los favoritos de cada cuenta.
 * @param {string} identificadorExplorador - Identificador del usuario.
 * @returns {string} Clave de almacenamiento de su lista.
 */
export function crearClaveFavoritos(identificadorExplorador: string): string {
  return `rick-morty:favorites:${identificadorExplorador}`;
}

/**
 * Lee y valida los identificadores guardados por una cuenta.
 * @param {string} identificadorExplorador - Identificador de la cuenta activa.
 * @returns {number[]} Favoritos sin identificadores duplicados.
 * @throws {Error} Si el almacenamiento no está disponible o sus datos son inválidos.
 */
export function leerFavoritosExplorador(identificadorExplorador: string): number[] {
  const textoGuardadoFavoritos = localStorage.getItem(crearClaveFavoritos(identificadorExplorador));
  if (!textoGuardadoFavoritos) return [];
  const identificadoresFavoritos = z.array(z.number().int().positive()).parse(JSON.parse(textoGuardadoFavoritos));
  return [...new Set(identificadoresFavoritos)];
}

/**
 * Guarda los favoritos de una cuenta sin modificar los de las demás.
 * @param {string} identificadorExplorador - Identificador de la cuenta activa.
 * @param {number[]} identificadoresFavoritos - Nueva lista de favoritos.
 * @returns {void} Persiste la lista como JSON.
 * @throws {Error} Si el navegador impide el guardado.
 */
export function guardarFavoritosExplorador(identificadorExplorador: string, identificadoresFavoritos: number[]) {
  localStorage.setItem(crearClaveFavoritos(identificadorExplorador), JSON.stringify(identificadoresFavoritos));
}

/**
 * Consulta varios personajes de una sola vez para construir la página de favoritos.
 * @param {number[]} identificadoresFavoritos - Identificadores favoritos de la cuenta.
 * @param {AbortSignal} [senalCancelacion] - Permite cancelar una petición que ya no se necesita.
 * @returns {Promise<PersonajeApi[]>} Personajes pedidos en una sola consulta.
 * @throws {Error} Si falla la API o se cancela la petición.
 */
export async function consultarPersonajesFavoritos(identificadoresFavoritos: number[], senalCancelacion?: AbortSignal): Promise<PersonajeApi[]> {
  if (identificadoresFavoritos.length === 0) return [];
  const respuestaHttpFavoritos = await fetch(`https://rickandmortyapi.com/api/character/${identificadoresFavoritos.join(",")}`, { signal: senalCancelacion });
  if (!respuestaHttpFavoritos.ok) throw new Error("No pudimos cargar tus personajes favoritos.");
  const datosFavoritos = await respuestaHttpFavoritos.json();
  return Array.isArray(datosFavoritos) ? datosFavoritos : [datosFavoritos];
}
