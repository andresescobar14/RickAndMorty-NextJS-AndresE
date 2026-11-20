import type { ReactNode } from "react";
import BarraExplorador from "@/components/organisms/Navigation";

/**
 * Organiza navegación, contenido y pie del archivo multiversal.
 * @param {Object} props - Contenido que cambia entre páginas.
 * @param {React.ReactNode} props.children - Página privada actual.
 * @returns {React.JSX.Element} Distribución común del explorador.
 */
export default function PlantillaExplorador({ children }: { children: ReactNode }) {
  return (
    <div className="explorer-shell">
      <BarraExplorador />
      <main className="explorer-content">{children}</main>
      <footer className="explorer-footer">RICK &amp; MORTY / ARCHIVO MULTIVERSAL <span>EXPLORA MÁS ALLÁ DE TU DIMENSIÓN</span></footer>
    </div>
  );
}
