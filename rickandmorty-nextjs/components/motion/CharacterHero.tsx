"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitHeading from "@/components/motion/SplitHeading";
import PortalOrb from "@/components/motion/PortalOrb";

gsap.registerPlugin(useGSAP);

/** Datos fijos del archivo mostrados como contadores. */
const cifras = [
  { valor: 826, etiqueta: "Personajes" },
  { valor: 126, etiqueta: "Ubicaciones" },
  { valor: 51, etiqueta: "Episodios" },
];

/**
 * Portada del listado: título partido en letras, portal animado y contadores que suben.
 * @returns {React.JSX.Element} Hero de la página de personajes.
 */
export default function CharacterHero() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((nodo) => {
      const destino = Number(nodo.dataset.count);
      if (reducir) { nodo.textContent = String(destino); return; }
      const estado = { n: 0 };
      gsap.to(estado, { n: destino, duration: 2.2, delay: 0.6, ease: "power2.out", onUpdate: () => { nodo.textContent = String(Math.round(estado.n)); } });
    });
    if (!reducir) gsap.from(".hero-fade", { y: 24, opacity: 0, duration: 0.9, stagger: 0.12, delay: 0.5, ease: "power3.out" });
  }, { scope: raiz });

  return (
    <header ref={raiz} className="hero">
      <div>
        <p className="auth-eyebrow hero-fade">Archivo / Personajes · Dimensión C-137</p>
        <SplitHeading className="hero-title" lineas={[
          { texto: "El multiverso," },
          { texto: "personaje a", className: "hero-outline" },
          { texto: "personaje.", className: "hero-acid" },
        ]} />
        <p className="hero-copy hero-fade">Encuentra tu próxima historia al otro lado del portal. Filtra, abre expedientes y guarda a tus favoritos.</p>
        <div className="hero-stats hero-fade">
          {cifras.map((cifra) => <div key={cifra.etiqueta}><strong data-count={cifra.valor}>{cifra.valor}</strong><span>{cifra.etiqueta}</span></div>)}
        </div>
      </div>
      <PortalOrb className="hero-portal" etiqueta="ABIERTO" titulo="C-137" />
    </header>
  );
}
