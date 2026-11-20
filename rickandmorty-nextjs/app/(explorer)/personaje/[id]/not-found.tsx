import Link from "next/link";

/** Muestra un personaje inexistente dentro del layout del explorador. @returns {React.JSX.Element} */
export default function PersonajeNoEncontrado() {
  return <section className="empty-state"><p className="auth-eyebrow">EXPEDIENTE INEXISTENTE / 404</p><h1>Este personaje no está en el archivo</h1><p>Comprueba sus coordenadas o vuelve a explorar el listado.</p><Link href="/" className="text-link">Volver al inicio</Link></section>;
}
