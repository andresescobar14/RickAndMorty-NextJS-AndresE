"use client";

import { useEffect, useState } from "react";
import RetratoPersonaje from "@/components/atoms/CharacterImage";
import Link from "next/link";
import { consultarPersonaje, consultarEpisodios } from "@/services/characters";
import type { PersonajeApi, EpisodioSerie } from "@/types/character";
import { etiquetasGeneroPersonaje } from "@/lib/labels";
import BotonFavorito from "@/components/atoms/FavoriteButton";
import EtiquetaEstado from "@/components/atoms/StatusBadge";
import BotonAccion from "@/components/atoms/Button";

/**
 * Pide personaje y episodios con useEffect al abrir una ficha.
 * @param {Object} props - Identificador y URL validada de regreso.
 * @param {number} props.identificadorPersonaje - Personaje que debe cargar el efecto.
 * @param {string} props.rutaRegreso - Listado con sus filtros o favoritos.
 * @returns {React.JSX.Element} Ficha completa, carga, error o personaje inexistente.
 */
export default function FichaPersonaje({ identificadorPersonaje: identificadorFicha, rutaRegreso }: { identificadorPersonaje: number; rutaRegreso: string }) {
  const [personajeDelArchivo, guardarFichaPersonaje] = useState<PersonajeApi | null>(null);
  const [episodiosPersonaje, guardarEpisodiosPersonaje] = useState<EpisodioSerie[]>([]);
  const [cargandoFicha, marcarCargaFicha] = useState(true);
  const [problemaFicha, mostrarProblemaFicha] = useState("");
  const [intentosFicha, aumentarIntentosFicha] = useState(0);

  useEffect(() => {
    const cancelacionPeticion = new AbortController();

    /** Pide la ficha y reúne sus episodios en una sola consulta adicional. @returns {Promise<void>} */
    async function cargarFichaPersonaje() {
      marcarCargaFicha(true);
      mostrarProblemaFicha("");
      try {
        const resultadoFicha = await consultarPersonaje(identificadorFicha, cancelacionPeticion.signal);
        if (cancelacionPeticion.signal.aborted) return;
        guardarFichaPersonaje(resultadoFicha);
        if (resultadoFicha) {
          const identificadoresEpisodios = resultadoFicha.episode.map((url) => Number(url.split("/").pop()));
          const episodiosRecibidos = await consultarEpisodios(identificadoresEpisodios, cancelacionPeticion.signal);
          if (!cancelacionPeticion.signal.aborted) guardarEpisodiosPersonaje(episodiosRecibidos);
        }
      } catch {
        if (!cancelacionPeticion.signal.aborted) mostrarProblemaFicha("No pudimos cargar la ficha y sus episodios. Vuelve a intentarlo.");
      } finally {
        if (!cancelacionPeticion.signal.aborted) marcarCargaFicha(false);
      }
    }

    void cargarFichaPersonaje();
    return () => cancelacionPeticion.abort();
  }, [identificadorFicha, intentosFicha]);

  if (cargandoFicha) return <div className="detail-skeleton" role="status">Cargando expediente…</div>;
  if (problemaFicha) return <section className="empty-state"><h1>No pudimos abrir el expediente</h1><p role="alert">{problemaFicha}</p><BotonAccion className="button-quiet" onClick={() => aumentarIntentosFicha(intentosFicha + 1)}>Reintentar</BotonAccion></section>;
  if (!personajeDelArchivo) return <section className="empty-state"><h1>Este personaje no está en el archivo</h1><Link href="/" className="text-link">Volver al inicio</Link></section>;

  return (
    <>
      <Link className="text-link detail-back" href={rutaRegreso}>← Volver al listado</Link>
      <article className="character-detail">
        <div className="detail-image">
          <RetratoPersonaje direccion={personajeDelArchivo.image} nombre={personajeDelArchivo.name} ancho={600} alto={600} tamanos="(max-width: 700px) 100vw, 40vw" precargar />
          <p className="auth-eyebrow">EXPEDIENTE / {String(personajeDelArchivo.id).padStart(3, "0")}</p>
        </div>
        <div className="detail-content">
          <div className="detail-title-row"><EtiquetaEstado status={personajeDelArchivo.status} /><BotonFavorito identificadorPersonaje={personajeDelArchivo.id} nombrePersonaje={personajeDelArchivo.name} /></div>
          <h1>{personajeDelArchivo.name}</h1>
          <dl className="detail-facts">
            <div><dt>Especie</dt><dd>{personajeDelArchivo.species}</dd></div>
            <div><dt>Tipo</dt><dd>{personajeDelArchivo.type || "No especificado"}</dd></div>
            <div><dt>Género</dt><dd>{etiquetasGeneroPersonaje[personajeDelArchivo.gender]}</dd></div>
            <div><dt>Origen</dt><dd>{personajeDelArchivo.origin.name === "unknown" ? "Desconocido" : personajeDelArchivo.origin.name}</dd></div>
            <div><dt>Ubicación actual</dt><dd>{personajeDelArchivo.location.name === "unknown" ? "Desconocida" : personajeDelArchivo.location.name}</dd></div>
            <div><dt>Episodios</dt><dd>{personajeDelArchivo.episode.length} apariciones</dd></div>
          </dl>
        </div>
      </article>
      <section className="episodes-section" aria-labelledby="episodes-title">
        <div className="section-heading"><h2 id="episodes-title">Su recorrido por la serie</h2><span>{episodiosPersonaje.length} episodios</span></div>
        <ol className="episode-list">{episodiosPersonaje.map((episodioSerie) => <li key={episodioSerie.id}><span>{episodioSerie.episode}</span><h3>{episodioSerie.name}</h3></li>)}</ol>
      </section>
    </>
  );
}
