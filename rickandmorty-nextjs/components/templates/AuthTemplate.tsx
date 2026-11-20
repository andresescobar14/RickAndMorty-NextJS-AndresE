import type { ReactNode } from "react";
import Link from "next/link";

/** Contenido variable de la distribución compartida por login y registro. */
type ContenidoAcceso = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

/**
 * Organiza las pantallas de autenticación sin manejar los datos del formulario.
 *
 * @param {Object} props - Contenido proporcionado por cada página.
 * @param {string} props.title - Encabezado principal de la pantalla.
 * @param {string} props.description - Explicación breve bajo el título.
 * @param {React.ReactNode} props.children - Formulario colocado dentro de la tarjeta.
 * @param {React.ReactNode} props.footer - Enlace para alternar entre login y registro.
 * @returns {React.JSX.Element} Distribución compartida de autenticación.
 */
export default function PlantillaAcceso({ title: tituloPagina, description: descripcionPagina, children, footer }: ContenidoAcceso) {
  return (
    <main className="auth-page">
      <div className="auth-frame">
        <header className="auth-masthead">
          <Link href="/" className="brand-link" aria-label="Rick & Morty Explorer, inicio">
            <span className="brand-mark" aria-hidden="true">R&M</span>
            <span>RICK &amp; MORTY <span className="brand-subtitle">ARCHIVO MULTIVERSAL</span></span>
          </Link>
          <p className="masthead-coordinate">
            EXPLORER / R&M<br />COORDENADAS: C-137
          </p>
        </header>
        <div className="auth-layout">
          <div className="auth-intro">
            <p className="auth-eyebrow">MÁS ALLÁ DE TU DIMENSIÓN</p>
            <p className="auth-headline">El caos tiene<br /><span>nombre y ficha.</span></p>
            <p className="auth-description">
              Explora personajes, conecta sus historias y guarda tus favoritos del multiverso.
            </p>
            <div className="portal-diagram" aria-hidden="true">
              <span className="portal-ring" />
              <span className="portal-ring portal-ring-inner" />
              <div className="portal-center">
                <span>DIMENSIÓN</span>
                <strong>C-137</strong>
              </div>
              <span className="portal-caption">FIG. 01 / PUNTO DE ORIGEN</span>
            </div>
          </div>
          <section className="auth-card">
            <div className="card-index">
              <span>EXPLORER / ACCESO PERSONAL</span>
              <span aria-hidden="true">↗</span>
            </div>
            <header className="auth-card-header">
              <h1>{tituloPagina}</h1>
              <p>{descripcionPagina}</p>
            </header>
            {children}
            <footer className="auth-footer">{footer}</footer>
          </section>
        </div>
      </div>
    </main>
  );
}
