"use client";

import { useFavoritosExplorador } from "@/context/FavoritesContext";

/**
 * Permite guardar o quitar un personaje desde cualquier ficha o tarjeta.
 * @param {Object} props - Personaje del botón.
 * @param {number} props.identificadorPersonaje - Identificador del personaje.
 * @param {string} props.nombrePersonaje - Nombre utilizado en la etiqueta accesible.
 * @returns {React.JSX.Element} Botón de favorito con estado pulsado.
 * @example
 * <BotonFavorito identificadorPersonaje={1} nombrePersonaje="Rick Sanchez" />
 */
export default function BotonFavorito({ identificadorPersonaje, nombrePersonaje }: { identificadorPersonaje: number; nombrePersonaje: string }) {
  const { identificadoresFavoritos, alternarPersonajeFavorito, cargandoFavoritos, problemaFavoritos } = useFavoritosExplorador();
  const personajeGuardado = identificadoresFavoritos.includes(identificadorPersonaje);
  return (
    <button
      type="button"
      className="favorite-button"
      aria-label={`${personajeGuardado ? "Quitar a" : "Agregar a"} ${nombrePersonaje} ${personajeGuardado ? "de" : "a"} favoritos`}
      aria-pressed={personajeGuardado}
      disabled={cargandoFavoritos || Boolean(problemaFavoritos)}
      onClick={() => alternarPersonajeFavorito(identificadorPersonaje)}
    >
      <span aria-hidden="true">{personajeGuardado ? "♥" : "♡"}</span>
    </button>
  );
}
