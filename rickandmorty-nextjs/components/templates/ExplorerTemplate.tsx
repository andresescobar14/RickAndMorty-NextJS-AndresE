import type { ReactNode } from "react";
import BarraExplorador from "@/components/organisms/Navigation";
import Marquee from "@/components/motion/Marquee";

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
      <footer className="explorer-footer">
        <Marquee variant="outline" items={["Archivo multiversal", "Dimensión C-137", "Explora más allá de tu dimensión", "Expedientes abiertos", "Portal estable"]} />
        <span className="footer-wordmark" aria-hidden="true">R&amp;M ARCHIVE</span>
        <div className="footer-meta"><span>RICK &amp; MORTY / ARCHIVO MULTIVERSAL</span><span>EXPLORA MÁS ALLÁ DE TU DIMENSIÓN</span></div>
      </footer>
    </div>
  );
}
