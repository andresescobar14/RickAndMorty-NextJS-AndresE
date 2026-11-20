"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { consultarPersonajes } from "@/services/characters";
import { crearConsultaPersonajes, leerFiltrosDeUrl } from "@/lib/filters";
import type { RespuestaPersonajesApi } from "@/types/character";
import TarjetaPersonaje from "@/components/molecules/CharacterCard";
import TarjetasCargando from "@/components/molecules/CharacterSkeletons";
import ArchivoVacio from "@/components/molecules/EmptyState";
import Pagination from "@/components/molecules/Pagination";
import BotonAccion from "@/components/atoms/Button";

/**
 * Pide los personajes en useEffect cuando cambia la búsqueda de la URL.
 * @returns {React.JSX.Element} Carga, error, estado vacío o tarjetas paginadas.
 */
export default function ResultadosPersonajes() {
  const parametrosBusqueda = useSearchParams();
  const filtrosPersonajes = leerFiltrosDeUrl(Object.fromEntries(parametrosBusqueda));
  const consultaPersonajes = crearConsultaPersonajes(filtrosPersonajes);
  const [datosPersonajes, guardarDatosPersonajes] = useState<RespuestaPersonajesApi | null>(null);
  const [cargandoPersonajes, marcarCargaPersonajes] = useState(true);
  const [problemaPersonajes, mostrarProblemaPersonajes] = useState("");
  const [intentosPersonajes, aumentarIntentosPersonajes] = useState(0);

  useEffect(() => {
    const cancelacionPeticion = new AbortController();

    /** Pide la consulta actual y actualiza la pantalla al recibirla. @returns {Promise<void>} */
    async function cargarPersonajes() {
      marcarCargaPersonajes(true);
      mostrarProblemaPersonajes("");
      try {
        const filtrosAplicados = leerFiltrosDeUrl(Object.fromEntries(new URLSearchParams(consultaPersonajes)));
        const resultadoPersonajes = await consultarPersonajes(filtrosAplicados, cancelacionPeticion.signal);
        if (!cancelacionPeticion.signal.aborted) guardarDatosPersonajes(resultadoPersonajes);
      } catch {
        if (!cancelacionPeticion.signal.aborted) mostrarProblemaPersonajes("No pudimos cargar los personajes. Comprueba tu conexión y vuelve a intentarlo.");
      } finally {
        if (!cancelacionPeticion.signal.aborted) marcarCargaPersonajes(false);
      }
    }

    void cargarPersonajes();
    return () => cancelacionPeticion.abort();
  }, [consultaPersonajes, intentosPersonajes]);

  if (cargandoPersonajes) return <TarjetasCargando />;
  if (problemaPersonajes) return <section className="empty-state"><h2>No pudimos abrir este sector</h2><p role="alert">{problemaPersonajes}</p><BotonAccion className="button-quiet" onClick={() => aumentarIntentosPersonajes(intentosPersonajes + 1)}>Reintentar</BotonAccion></section>;
  if (!datosPersonajes || datosPersonajes.results.length === 0) return <ArchivoVacio title="No encontramos personajes" message="Prueba con otro nombre o limpia los filtros para explorar de nuevo." linkLabel="Limpiar la búsqueda" />;

  const rutaRegreso = consultaPersonajes ? `/?${consultaPersonajes}` : "/";
  return (
    <>
      <p className="results-count" role="status">{datosPersonajes.info.count} personajes en el archivo <span>SECTOR / {String(filtrosPersonajes.page).padStart(2, "0")}</span></p>
      <div className="character-grid">{datosPersonajes.results.map((personajeDelArchivo) => <TarjetaPersonaje key={personajeDelArchivo.id} personaje={personajeDelArchivo} rutaRegreso={rutaRegreso} />)}</div>
      <Pagination filtrosPersonajes={filtrosPersonajes} totalPaginas={datosPersonajes.info.pages} />
    </>
  );
}
