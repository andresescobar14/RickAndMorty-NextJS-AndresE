"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Portal verde animado: anillos que giran a distinta velocidad, núcleo que respira
 * y partículas orbitando. Reacciona al puntero con un ligero paralaje.
 * @param {Object} props - Configuración del portal.
 * @param {string} [props.etiqueta='DIMENSIÓN'] - Texto pequeño del centro.
 * @param {string} [props.titulo='C-137'] - Texto grande del centro.
 * @param {string} [props.className=''] - Clases adicionales.
 * @returns {React.JSX.Element} Ilustración decorativa del portal.
 */
export default function PortalOrb({ etiqueta = "DIMENSIÓN", titulo = "C-137", className = "" }: { etiqueta?: string; titulo?: string; className?: string }) {
  const contenedor = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.from(".portal-svg", { scale: 0.4, opacity: 0, rotate: -90, duration: 1.6, ease: "expo.out" });
    if (reducir) return;
    gsap.to(".ring-a", { rotate: 360, duration: 22, repeat: -1, ease: "none", svgOrigin: "200 200" });
    gsap.to(".ring-b", { rotate: -360, duration: 14, repeat: -1, ease: "none", svgOrigin: "200 200" });
    gsap.to(".ring-c", { rotate: 360, duration: 8, repeat: -1, ease: "none", svgOrigin: "200 200" });
    gsap.to(".portal-core", { scale: 1.06, duration: 2.2, repeat: -1, yoyo: true, ease: "sine.inOut", svgOrigin: "200 200" });
    gsap.to(".swirl", { rotate: 360, duration: 6, repeat: -1, ease: "none", svgOrigin: "200 200" });
    gsap.utils.toArray<SVGCircleElement>(".spark").forEach((chispa, indice) => {
      gsap.to(chispa, { rotate: indice % 2 ? -360 : 360, duration: gsap.utils.random(6, 16), repeat: -1, ease: "none", svgOrigin: "200 200" });
      gsap.to(chispa, { opacity: 0.2, duration: gsap.utils.random(0.6, 1.6), repeat: -1, yoyo: true, ease: "sine.inOut" });
    });

    const elemento = contenedor.current!;
    const inclinarX = gsap.quickTo(elemento, "rotationY", { duration: 1, ease: "power3.out" });
    const inclinarY = gsap.quickTo(elemento, "rotationX", { duration: 1, ease: "power3.out" });
    /** Paralaje según la posición del cursor. @param {PointerEvent} evento - Movimiento. @returns {void} */
    function paralaje(evento: PointerEvent) {
      inclinarX((evento.clientX / window.innerWidth - 0.5) * 24);
      inclinarY((evento.clientY / window.innerHeight - 0.5) * -24);
    }
    window.addEventListener("pointermove", paralaje, { passive: true });
    return () => window.removeEventListener("pointermove", paralaje);
  }, { scope: contenedor });

  const chispas = Array.from({ length: 14 }, (_, i) => {
    const angulo = (i / 14) * Math.PI * 2;
    const radio = 150 + (i % 3) * 22;
    return { x: 200 + Math.cos(angulo) * radio, y: 200 + Math.sin(angulo) * radio, r: 1.5 + (i % 3) };
  });

  return (
    <div ref={contenedor} className={`portal ${className}`} style={{ transformPerspective: 800 } as React.CSSProperties} aria-hidden="true">
      <svg className="portal-svg" viewBox="0 0 400 400">
        <defs>
          <radialGradient id="pg-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e6f0ff" />
            <stop offset="35%" stopColor="#4d8dff" />
            <stop offset="75%" stopColor="#1e4fd8" />
            <stop offset="100%" stopColor="#061a4d" />
          </radialGradient>
          <linearGradient id="pg-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4d8dff" />
            <stop offset="100%" stopColor="#7fd8ff" />
          </linearGradient>
        </defs>
        <g className="ring-a"><circle cx="200" cy="200" r="190" fill="none" stroke="url(#pg-ring)" strokeWidth="1" strokeDasharray="2 10" opacity="0.7" /></g>
        <g className="ring-b">
          <circle cx="200" cy="200" r="168" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
          <path d="M200 32 A168 168 0 0 1 368 200" fill="none" stroke="#4d8dff" strokeWidth="3" strokeLinecap="round" />
          <path d="M200 368 A168 168 0 0 1 32 200" fill="none" stroke="#7fd8ff" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g className="ring-c"><circle cx="200" cy="200" r="142" fill="none" stroke="#4d8dff" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="30 14 4 14" /></g>
        <g className="portal-core">
          <circle cx="200" cy="200" r="118" fill="url(#pg-core)" />
          <g className="swirl" fill="none" stroke="#061a4d" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round">
            <path d="M200 110 C 260 120, 290 180, 260 230" />
            <path d="M290 200 C 280 260, 220 290, 170 260" />
            <path d="M200 290 C 140 280, 110 220, 140 170" />
            <path d="M110 200 C 120 140, 180 110, 230 140" />
          </g>
        </g>
        {chispas.map((c, i) => <circle key={i} className="spark" cx={c.x} cy={c.y} r={c.r} fill={i % 2 ? "#7fd8ff" : "#4d8dff"} />)}
      </svg>
      <div className="portal-label"><span>{etiqueta}</span><strong>{titulo}</strong></div>
    </div>
  );
}
