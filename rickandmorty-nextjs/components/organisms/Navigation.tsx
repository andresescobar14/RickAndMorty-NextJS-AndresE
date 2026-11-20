"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSesionExplorador } from "@/context/AuthContext";
import BotonAccion from "@/components/atoms/Button";
import { useFavoritosExplorador } from "@/context/FavoritesContext";

/**
 * Presenta los enlaces privados y permite cerrar la sesión del usuario.
 * @returns {React.JSX.Element} Cabecera de navegación del explorador.
 */
export default function BarraExplorador() {
  const { exploradorActual, cerrarSesionActual } = useSesionExplorador();
  const { identificadoresFavoritos, problemaFavoritos: problemaFavoritosNavegacion } = useFavoritosExplorador();
  const rutaActual = usePathname();
  const navegacionAplicacion = useRouter();
  const [problemaNavegacion, mostrarProblemaNavegacion] = useState("");

  /** Cierra la sesión y sustituye la ruta actual por login. @returns {void} */
  function salirDelExplorador() {
    try {
      cerrarSesionActual();
      navegacionAplicacion.replace("/login");
    } catch {
      mostrarProblemaNavegacion("No pudimos cerrar la sesión. Vuelve a intentarlo.");
    }
  }

  return (
    <header className="explorer-header">
      <div className="explorer-nav">
        <Link href="/" className="brand-link" aria-label="Rick & Morty Explorer, inicio">
          <span className="brand-mark" aria-hidden="true">R&M</span>
          <span>RICK &amp; MORTY <span className="brand-subtitle">ARCHIVO MULTIVERSAL</span></span>
        </Link>
        <nav aria-label="Navegación principal" className="nav-links">
          <Link href="/" aria-current={rutaActual === "/" ? "page" : undefined}>Personajes</Link>
          <Link href="/favoritos" aria-current={rutaActual === "/favoritos" ? "page" : undefined}>Favoritos <span className="nav-count">{identificadoresFavoritos.length}</span></Link>
          <Link href="/mi-cuenta" aria-current={rutaActual === "/mi-cuenta" ? "page" : undefined}>Mi cuenta</Link>
        </nav>
        <div className="nav-actions">
          <span className="nav-user">{exploradorActual?.name}</span>
          <BotonAccion className="button-quiet" onClick={salirDelExplorador}>Salir</BotonAccion>
        </div>
      </div>
      {problemaNavegacion && <p className="form-error" role="alert">{problemaNavegacion}</p>}
      {problemaFavoritosNavegacion && <p className="storage-notice" role="alert">{problemaFavoritosNavegacion}</p>}
    </header>
  );
}
