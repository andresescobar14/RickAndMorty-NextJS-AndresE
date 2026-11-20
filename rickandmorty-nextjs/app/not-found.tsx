import Link from "next/link";
import PortalOrb from "@/components/motion/PortalOrb";
import { crearMetadatosPagina } from "@/lib/metadata";

export const metadata = crearMetadatosPagina("Página no encontrada", "Este portal no conduce a una página del archivo.");

/** Presenta un 404 público con un camino de regreso. @returns {React.JSX.Element} */
export default function PaginaNoEncontrada() {
  return <main className="session-screen"><PortalOrb className="auth-portal" etiqueta="ERROR" titulo="404" /><p className="auth-eyebrow">ERROR DE COORDENADAS / 404</p><h1>Este portal no lleva a ninguna parte</h1><p>No encontramos la página o el personaje que buscas.</p><Link href="/" className="text-link">Volver al inicio</Link></main>;
}
