"use client";

import { useTemaVisual } from "@/context/ThemeContext";

/**
 * Ofrece el mismo interruptor de tema en todas las rutas, incluidas las públicas.
 * @returns {React.JSX.Element} Interruptor accesible y posible aviso de persistencia.
 * @example
 * <ThemeToggle />
 */
export default function InterruptorTema() {
  const { temaElegido, temaPreparado, problemaTema: problemaPantalla, alternarTemaVisual } = useTemaVisual();
  return <div className="theme-control"><button type="button" role="switch" aria-checked={temaElegido === "dark"} aria-label="Modo oscuro" title={temaElegido === "dark" ? "Activar modo claro" : "Activar modo oscuro"} className="theme-toggle" disabled={!temaPreparado} onClick={alternarTemaVisual}><span aria-hidden="true">{temaElegido === "dark" ? "☾" : "☼"}</span> {temaElegido === "dark" ? "Oscuro" : "Claro"}</button>{problemaPantalla && <p role="alert" className="theme-notice">{problemaPantalla}</p>}</div>;
}
