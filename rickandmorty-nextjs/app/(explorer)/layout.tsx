import type { ReactNode } from "react";
import ControlSesion from "@/components/organisms/AuthGate";
import PlantillaExplorador from "@/components/templates/ExplorerTemplate";

/**
 * Comparte navegación y protección entre todas las rutas privadas.
 * @param {Object} props - Contenido de la ruta privada actual.
 * @param {React.ReactNode} props.children - Página del explorador.
 * @returns {React.JSX.Element} Página dentro de la sesión y la plantilla privada.
 */
export default function DistribucionPrivada({ children }: { children: ReactNode }) {
  return <ControlSesion><PlantillaExplorador>{children}</PlantillaExplorador></ControlSesion>;
}
