"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type TemaVisual = "light" | "dark";
type EstadoTema = {
  temaElegido: TemaVisual;
  temaPreparado: boolean;
  problemaTema: string;
  alternarTemaVisual: () => void;
};
const CLAVE_TEMA_VISUAL = "rick-morty:theme";
const ContextoTema = createContext<EstadoTema | null>(null);

/**
 * Aplica el tema al documento; CSS controla después todos sus colores.
 * @param {'light' | 'dark'} temaElegido - Tema que se desea mostrar.
 * @returns {void} Actualiza la clase y el esquema nativo de color.
 */
function aplicarTemaVisual(temaElegido: TemaVisual) {
  document.documentElement.classList.toggle("dark", temaElegido === "dark");
  document.documentElement.style.colorScheme = temaElegido;
}

/**
 * Comparte la preferencia de tema y escucha cambios del sistema o de otras pestañas.
 * @param {Object} props - Contenido que utiliza el tema.
 * @param {React.ReactNode} props.children - Componentes de la aplicación.
 * @returns {React.JSX.Element} Proveedor del modo claro y oscuro.
 */
export function ProveedorTema({ children }: { children: ReactNode }) {
  const [temaElegido, cambiarTemaElegido] = useState<TemaVisual>("dark");
  const [temaPreparado, marcarTemaPreparado] = useState(false);
  const [problemaTema, mostrarProblemaTema] = useState("");

  useEffect(() => {
    const preferenciaSistema = window.matchMedia("(prefers-color-scheme: dark)");
    /** Lee la elección guardada y utiliza el sistema cuando aún no hay una. @returns {void} */
    function recuperarTemaVisual() {
      let textoGuardadoTema = "";
      try { textoGuardadoTema = localStorage.getItem(CLAVE_TEMA_VISUAL) || ""; } catch { /* El tema del sistema sigue disponible. */ }
      const siguienteTema = textoGuardadoTema === "light" || textoGuardadoTema === "dark" ? textoGuardadoTema : preferenciaSistema.matches ? "dark" : "light";
      aplicarTemaVisual(siguienteTema);
      cambiarTemaElegido(siguienteTema);
      marcarTemaPreparado(true);
    }
    /**
     * Sincroniza el tema elegido en otra pestaña.
     * @param {StorageEvent} eventoTema - Cambio del almacenamiento.
     * @returns {void} Actualiza el tema si cambió su preferencia.
     */
    function sincronizarAlmacenamiento(eventoTema: StorageEvent) {
      if (eventoTema.key === CLAVE_TEMA_VISUAL || eventoTema.key === null) recuperarTemaVisual();
    }
    recuperarTemaVisual();
    preferenciaSistema.addEventListener("change", recuperarTemaVisual);
    window.addEventListener("storage", sincronizarAlmacenamiento);
    return () => { preferenciaSistema.removeEventListener("change", recuperarTemaVisual); window.removeEventListener("storage", sincronizarAlmacenamiento); };
  }, []);

  /** Cambia y persiste el tema sin modificar la cuenta ni los favoritos. @returns {void} */
  function alternarTemaVisual() {
    const siguienteTema = temaElegido === "dark" ? "light" : "dark";
    aplicarTemaVisual(siguienteTema);
    cambiarTemaElegido(siguienteTema);
    try { localStorage.setItem(CLAVE_TEMA_VISUAL, siguienteTema); mostrarProblemaTema(""); }
    catch { mostrarProblemaTema("El tema cambió, pero este navegador no permitió guardar la preferencia."); }
  }

  return <ContextoTema.Provider value={{ temaElegido, temaPreparado, problemaTema, alternarTemaVisual }}>{children}</ContextoTema.Provider>;
}

/**
 * Permite leer y cambiar la preferencia visual compartida.
 * @returns {EstadoTema} Tema actual y acción para alternarlo.
 * @throws {Error} Si falta ProveedorTema en el árbol.
 * @example
 * const { temaElegido, alternarTemaVisual } = useTemaVisual();
 */
export function useTemaVisual() {
  const estadoCompartidoTema = useContext(ContextoTema);
  if (!estadoCompartidoTema) throw new Error("useTemaVisual debe utilizarse dentro de ProveedorTema.");
  return estadoCompartidoTema;
}
