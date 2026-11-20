import type { ReactNode } from "react";
import PageTransition from "@/components/motion/PageTransition";

/**
 * Next.js vuelve a montar template.tsx en cada navegación, ideal para la transición de página.
 * @param {Object} props - Página actual.
 * @param {React.ReactNode} props.children - Contenido de la ruta.
 * @returns {React.JSX.Element} Página con transición de entrada.
 */
export default function PlantillaTransicion({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
