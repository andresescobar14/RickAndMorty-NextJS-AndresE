import type { ReactNode } from "react";
import Link from "next/link";
import PortalOrb from "@/components/motion/PortalOrb";
import SplitHeading from "@/components/motion/SplitHeading";

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
            <SplitHeading as="p" className="auth-headline" lineas={[{ texto: "El caos tiene" }, { texto: "nombre y ficha.", className: "text-gradient" }]} />
            <p className="auth-description" data-aos="fade-up" data-aos-delay="300">
              Explora personajes, conecta sus historias y guarda tus favoritos del multiverso.
            </p>
            <PortalOrb className="auth-portal" etiqueta="DIMENSIÓN" titulo="C-137" />
          </div>
          <section className="auth-card" data-aos="fade-left" data-aos-duration="1000">
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
