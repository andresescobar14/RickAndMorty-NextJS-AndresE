"use client";

import { useEffect, useState } from "react";
import { useFavoritosExplorador } from "@/context/FavoritesContext";
import { consultarPersonajesFavoritos } from "@/services/favorites";
import type { PersonajeApi } from "@/types/character";
import TarjetaPersonaje from "@/components/molecules/CharacterCard";
import ArchivoVacio from "@/components/molecules/EmptyState";
import BotonAccion from "@/components/atoms/Button";

/**
 * Carga todos los favoritos en una petición y quita tarjetas sin recargar.
 * @returns {React.JSX.Element} Listado personal, carga, error o estado vacío.
 */
export default function ColeccionFavoritos() {
  const { identificadoresFavoritos, cargandoFavoritos: cargandoColeccion, problemaFavoritos: problemaGuardadoColeccion } = useFavoritosExplorador();
  const [personajesEncontrados, guardarPersonajesEncontrados] = useState<PersonajeApi[]>([]);
  const [consultandoFavoritos, marcarConsultaFavoritos] = useState(false);
  const [problemaColeccion, mostrarProblemaColeccion] = useState("");
  const [intentosColeccion, aumentarIntentosColeccion] = useState(0);
  const consultaIdentificadores = identificadoresFavoritos.join(",");

  useEffect(() => {
    const cancelacionPeticion = new AbortController();
    /** Pide las fichas favoritas y descarta respuestas de una pantalla abandonada. @returns {Promise<void>} */
    async function cargarFavoritosGuardados() {
      if (cargandoColeccion) return;
      marcarConsultaFavoritos(true);
      mostrarProblemaColeccion("");
      try {
        const datosColeccion = await consultarPersonajesFavoritos(consultaIdentificadores ? consultaIdentificadores.split(",").map(Number) : [], cancelacionPeticion.signal);
        if (!cancelacionPeticion.signal.aborted) guardarPersonajesEncontrados(datosColeccion);
      } catch {
        if (!cancelacionPeticion.signal.aborted) mostrarProblemaColeccion("No pudimos cargar tus favoritos. Puedes volver a intentarlo.");
      } finally {
        if (!cancelacionPeticion.signal.aborted) marcarConsultaFavoritos(false);
      }
    }
    void cargarFavoritosGuardados();
    return () => cancelacionPeticion.abort();
  }, [consultaIdentificadores, cargandoColeccion, intentosColeccion]);

  if (problemaGuardadoColeccion) return <p role="alert" className="form-error">{problemaGuardadoColeccion}</p>;
  if (problemaColeccion) return <section className="empty-state"><p role="alert">{problemaColeccion}</p><BotonAccion className="button-quiet" onClick={() => aumentarIntentosColeccion(intentosColeccion + 1)}>Reintentar</BotonAccion></section>;
  if (!cargandoColeccion && identificadoresFavoritos.length === 0) return <ArchivoVacio title="Tu archivo personal empieza aquí" message="Guarda personajes con el corazón y los encontrarás juntos en este espacio." linkLabel="Explorar personajes" />;
  return (
    <section aria-busy={cargandoColeccion || consultandoFavoritos}>
      {(cargandoColeccion || consultandoFavoritos) && <p role="status" className="results-count">Cargando favoritos…</p>}
      <div className="character-grid">
        {personajesEncontrados.filter((personajeDelArchivo) => identificadoresFavoritos.includes(personajeDelArchivo.id)).map((personajeDelArchivo) => <TarjetaPersonaje key={personajeDelArchivo.id} personaje={personajeDelArchivo} rutaRegreso="/favoritos" />)}
      </div>
    </section>
  );
}
