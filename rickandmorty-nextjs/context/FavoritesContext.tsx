"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { crearClaveFavoritos, leerFavoritosExplorador, guardarFavoritosExplorador } from "@/services/favorites";

type EstadoFavoritos = {
  identificadoresFavoritos: number[];
  cargandoFavoritos: boolean;
  problemaFavoritos: string;
  alternarPersonajeFavorito: (identificadorFavoritos: number) => void;
};

const ContextoFavoritos = createContext<EstadoFavoritos | null>(null);

/**
 * Comparte y persiste los favoritos de una sola cuenta.
 * @param {Object} props - Usuario y contenido que accederá a su lista.
 * @param {string | null} props.userId - Identificador de la cuenta o null sin sesión.
 * @param {React.ReactNode} props.children - Contenido de la aplicación.
 * @returns {React.JSX.Element} Proveedor de favoritos independiente por usuario.
 */
export function ProveedorFavoritos({ userId: identificadorExplorador, children }: { userId: string | null; children: ReactNode }) {
  const [identificadoresFavoritos, actualizarIdentificadoresFavoritos] = useState<number[]>([]);
  const [cargandoFavoritos, marcarCargaFavoritos] = useState(Boolean(identificadorExplorador));
  const [problemaFavoritos, mostrarProblemaFavoritos] = useState("");

  useEffect(() => {
    /** Lee los favoritos externos después de la hidratación. @returns {void} */
    function cargarFavoritosGuardados() {
      try {
        actualizarIdentificadoresFavoritos(identificadorExplorador ? leerFavoritosExplorador(identificadorExplorador) : []);
        mostrarProblemaFavoritos("");
      } catch {
        mostrarProblemaFavoritos("No pudimos leer tus favoritos guardados en este navegador.");
      }
      marcarCargaFavoritos(false);
    }
    /**
     * Sincroniza los favoritos editados desde otra pestaña.
     * @param {StorageEvent} eventoFavoritos - Cambio del almacenamiento.
     * @returns {void} Recarga solo si cambió la lista de esta cuenta.
     */
    function sincronizarAlmacenamiento(eventoFavoritos: StorageEvent) {
      if (eventoFavoritos.key === null || identificadorExplorador && eventoFavoritos.key === crearClaveFavoritos(identificadorExplorador)) cargarFavoritosGuardados();
    }
    cargarFavoritosGuardados();
    window.addEventListener("storage", sincronizarAlmacenamiento);
    return () => window.removeEventListener("storage", sincronizarAlmacenamiento);
  }, [identificadorExplorador]);

  /**
   * Agrega un personaje si falta, o lo quita si ya estaba guardado.
   * @param {number} identificadorFavoritos - Identificador del personaje.
   * @returns {void} Guarda la lista y actualiza tarjetas y contador.
   */
  function alternarPersonajeFavorito(identificadorFavoritos: number) {
    if (!identificadorExplorador || cargandoFavoritos || problemaFavoritos) return;
    const favoritosActualizados = identificadoresFavoritos.includes(identificadorFavoritos) ? identificadoresFavoritos.filter((identificadorGuardado) => identificadorGuardado !== identificadorFavoritos) : [...identificadoresFavoritos, identificadorFavoritos];
    try {
      guardarFavoritosExplorador(identificadorExplorador, favoritosActualizados);
      actualizarIdentificadoresFavoritos(favoritosActualizados);
      mostrarProblemaFavoritos("");
    } catch {
      mostrarProblemaFavoritos("No pudimos guardar el cambio de favoritos. Revisa el almacenamiento del navegador.");
    }
  }

  return <ContextoFavoritos.Provider value={{ identificadoresFavoritos, cargandoFavoritos, problemaFavoritos, alternarPersonajeFavorito }}>{children}</ContextoFavoritos.Provider>;
}

/**
 * Permite consultar y modificar la lista de favoritos de la cuenta activa.
 * @returns {EstadoFavoritos} Favoritos, carga, error y función para alternarlos.
 * @throws {Error} Si falta ProveedorFavoritos en el árbol.
 * @example
 * const { identificadoresFavoritos, alternarPersonajeFavorito } = useFavoritosExplorador();
 */
export function useFavoritosExplorador() {
  const estadoCompartidoFavoritos = useContext(ContextoFavoritos);
  if (!estadoCompartidoFavoritos) throw new Error("useFavoritosExplorador debe utilizarse dentro de ProveedorFavoritos.");
  return estadoCompartidoFavoritos;
}
