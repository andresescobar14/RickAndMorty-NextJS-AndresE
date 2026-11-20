"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EntradaTexto from "@/components/atoms/Input";
import BotonAccion from "@/components/atoms/Button";
import { crearConsultaPersonajes, leerFiltrosDeUrl } from "@/lib/filters";

type ControlesBusqueda = { name: string; status: string; gender: string; species: string };
const controlesVacios: ControlesBusqueda = { name: "", status: "", gender: "", species: "" };

/**
 * Recupera los cuatro valores de los controles a partir de una consulta de URL.
 * @param {string} consultaPersonajes - Consulta sin el signo de interrogación.
 * @returns {ControlesBusqueda} Valores visibles de búsqueda y filtros.
 */
function leerControlesDeBusqueda(consultaPersonajes: string): ControlesBusqueda {
  const filtrosPersonajes = leerFiltrosDeUrl(Object.fromEntries(new URLSearchParams(consultaPersonajes)));
  return { name: filtrosPersonajes.name, status: filtrosPersonajes.status, gender: filtrosPersonajes.gender, species: filtrosPersonajes.species };
}

/**
 * Mantiene filtros combinables en la URL; espera 400 ms al escribir texto.
 * @returns {React.JSX.Element} Buscador y filtros con botón para restablecerlos.
 */
export default function FiltrosPersonajes() {
  const navegacionAplicacion = useRouter();
  const consultaPersonajes = useSearchParams().toString();
  const [valoresBusqueda, cambiarValoresBusqueda] = useState(() => leerControlesDeBusqueda(consultaPersonajes));
  const esperaBusqueda = useRef<number | null>(null);
  const ultimaConsultaAplicada = useRef<string | null>(null);

  useEffect(() => {
    // Una actualización propia no debe sobrescribir texto escrito más recientemente.
    if (ultimaConsultaAplicada.current === consultaPersonajes) {
      ultimaConsultaAplicada.current = null;
      return;
    }
    /** Sincroniza los controles al volver o avanzar en el navegador. @returns {void} */
    function recuperarFiltrosDeUrl() {
      if (esperaBusqueda.current !== null) window.clearTimeout(esperaBusqueda.current);
      cambiarValoresBusqueda(leerControlesDeBusqueda(consultaPersonajes));
    }
    recuperarFiltrosDeUrl();
  }, [consultaPersonajes]);

  useEffect(() => () => {
    if (esperaBusqueda.current !== null) window.clearTimeout(esperaBusqueda.current);
  }, []);

  /**
   * Navega al listado filtrado y reinicia la paginación.
   * @param {ControlesBusqueda} filtrosActualizados - Valores que se desean aplicar.
   * @returns {void} Actualiza la URL sin recargar el documento.
   */
  function aplicarBusquedaPersonajes(filtrosActualizados: ControlesBusqueda) {
    const consultaActualizada = crearConsultaPersonajes(leerFiltrosDeUrl(filtrosActualizados));
    ultimaConsultaAplicada.current = consultaActualizada;
    navegacionAplicacion.replace(consultaActualizada ? `/?${consultaActualizada}` : "/", { scroll: false });
  }

  /**
   * Actualiza un control y cancela cualquier búsqueda de texto anterior.
   * @param {'name' | 'status' | 'gender' | 'species'} filtroModificado - Campo que cambia.
   * @param {string} valorRecibido - Nuevo valor del control.
   * @param {boolean} [esperarEscritura=false] - Espera 400 ms para búsqueda y especie.
   * @returns {void} Aplica los filtros inmediatamente o después del debounce.
   */
  function cambiarFiltroPersonajes(filtroModificado: keyof ControlesBusqueda, valorRecibido: string, esperarEscritura = false) {
    const filtrosActualizados = { ...valoresBusqueda, [filtroModificado]: valorRecibido };
    cambiarValoresBusqueda(filtrosActualizados);
    if (esperaBusqueda.current !== null) window.clearTimeout(esperaBusqueda.current);
    if (esperarEscritura) {
      esperaBusqueda.current = window.setTimeout(() => { esperaBusqueda.current = null; aplicarBusquedaPersonajes(filtrosActualizados); }, 400);
    } else {
      aplicarBusquedaPersonajes(filtrosActualizados);
    }
  }

  /** Borra búsqueda y filtros y vuelve a la primera página. @returns {void} */
  function limpiarBusquedaPersonajes() {
    if (esperaBusqueda.current !== null) window.clearTimeout(esperaBusqueda.current);
    cambiarValoresBusqueda(controlesVacios);
    aplicarBusquedaPersonajes(controlesVacios);
  }

  return (
    <form className="filter-panel" role="search" aria-label="Buscar personajes" onSubmit={(eventoBusqueda) => {
      eventoBusqueda.preventDefault();
      if (esperaBusqueda.current !== null) window.clearTimeout(esperaBusqueda.current);
      aplicarBusquedaPersonajes(valoresBusqueda);
    }}>
      <div className="form-field filter-search">
        <label htmlFor="filter-name" className="form-label">Nombre del personaje</label>
        <EntradaTexto id="filter-name" type="search" placeholder="Busca en cualquier dimensión…" value={valoresBusqueda.name} onChange={(eventoBusqueda) => cambiarFiltroPersonajes("name", eventoBusqueda.target.value, true)} />
      </div>
      <div className="form-field">
        <label htmlFor="filter-status" className="form-label">Estado</label>
        <select id="filter-status" className="form-input" value={valoresBusqueda.status} onChange={(eventoBusqueda) => cambiarFiltroPersonajes("status", eventoBusqueda.target.value)}>
          <option value="">Todos los estados</option><option value="alive">Vivo</option><option value="dead">Muerto</option><option value="unknown">Desconocido</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="filter-gender" className="form-label">Género</label>
        <select id="filter-gender" className="form-input" value={valoresBusqueda.gender} onChange={(eventoBusqueda) => cambiarFiltroPersonajes("gender", eventoBusqueda.target.value)}>
          <option value="">Todos los géneros</option><option value="female">Femenino</option><option value="male">Masculino</option><option value="genderless">Sin género</option><option value="unknown">Desconocido</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="filter-species" className="form-label">Especie</label>
        <EntradaTexto id="filter-species" placeholder="Human, Alien…" value={valoresBusqueda.species} onChange={(eventoBusqueda) => cambiarFiltroPersonajes("species", eventoBusqueda.target.value, true)} />
      </div>
      <BotonAccion className="button-quiet filter-clear" onClick={limpiarBusquedaPersonajes}>Limpiar filtros</BotonAccion>
    </form>
  );
}
