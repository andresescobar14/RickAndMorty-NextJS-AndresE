"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Entrada suave de cada página: una cortina verde barre la pantalla y el contenido sube.
 * Se usa desde template.tsx, que Next.js vuelve a montar en cada navegación.
 * @param {Object} props - Página actual.
 * @param {React.ReactNode} props.children - Contenido.
 * @returns {React.JSX.Element} Contenido con transición.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const linea = gsap.timeline();
    linea.fromTo(".page-wipe", { scaleY: 1, transformOrigin: "top" }, { scaleY: 0, duration: 0.7, ease: "expo.inOut" })
      .from(".page-body", { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.35");
  }, { scope: raiz });

  return (
    <div ref={raiz} style={{ position: "relative" }}>
      <div className="page-wipe" aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 90, background: "var(--acid)", transform: "scaleY(0)", pointerEvents: "none" }} />
      <div className="page-body">{children}</div>
    </div>
  );
}
