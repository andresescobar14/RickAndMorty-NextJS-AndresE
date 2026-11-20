"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import gsap from "gsap";

/**
 * Envoltorio de tarjeta con inclinación 3D y brillo que sigue al cursor (GSAP).
 * @param {Object} props - Contenido y atributos.
 * @param {React.ReactNode} props.children - Contenido de la tarjeta.
 * @param {string} props.className - Clases del artículo.
 * @param {number} [props.indice=0] - Posición para escalonar la entrada AOS.
 * @returns {React.JSX.Element} Artículo interactivo.
 */
export default function TiltCard({ children, className, indice = 0 }: { children: ReactNode; className: string; indice?: number }) {
  const tarjeta = useRef<HTMLElement>(null);

  useEffect(() => {
    const elemento = tarjeta.current;
    return () => { if (elemento) gsap.killTweensOf(elemento); };
  }, []);

  /** Inclina la tarjeta hacia el cursor. @param {PointerEvent<HTMLElement>} evento - Movimiento. @returns {void} */
  function mover(evento: PointerEvent<HTMLElement>) {
    const elemento = evento.currentTarget;
    if (evento.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const caja = elemento.getBoundingClientRect();
    const x = (evento.clientX - caja.left) / caja.width;
    const y = (evento.clientY - caja.top) / caja.height;
    elemento.style.setProperty("--mx", `${x * 100}%`);
    elemento.style.setProperty("--my", `${y * 100}%`);
    gsap.to(elemento, { rotationY: (x - 0.5) * 12, rotationX: (0.5 - y) * 12, y: -6, duration: 0.5, ease: "power3.out", transformPerspective: 900, overwrite: "auto" });
  }

  /** Devuelve la tarjeta a su sitio con rebote. @param {PointerEvent<HTMLElement>} evento - Salida. @returns {void} */
  function soltar(evento: PointerEvent<HTMLElement>) {
    gsap.to(evento.currentTarget, { rotationY: 0, rotationX: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
  }

  return (
    <article ref={tarjeta} className={className} onPointerMove={mover} onPointerLeave={soltar}
      data-aos="fade-up" data-aos-delay={(indice % 4) * 80}>
      {children}
    </article>
  );
}
