"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import gsap from "gsap";

/**
 * Inicia AOS (animaciones al hacer scroll) y el halo de cursor con GSAP.
 * Respeta prefers-reduced-motion y vuelve a calcular AOS al cambiar de ruta.
 * @param {Object} props - Árbol de la aplicación.
 * @param {React.ReactNode} props.children - Páginas.
 * @returns {React.JSX.Element} Contenido con el halo decorativo.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  const halo = useRef<HTMLDivElement>(null);
  const rutaActual = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 40,
      disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);

  useEffect(() => {
    const espera = window.setTimeout(() => AOS.refreshHard(), 60);
    return () => window.clearTimeout(espera);
  }, [rutaActual]);

  useEffect(() => {
    const elemento = halo.current;
    if (!elemento || window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    const moverX = gsap.quickTo(elemento, "x", { duration: 0.9, ease: "power3.out" });
    const moverY = gsap.quickTo(elemento, "y", { duration: 0.9, ease: "power3.out" });
    /** Sigue el puntero con inercia. @param {PointerEvent} evento - Movimiento. @returns {void} */
    function seguirPuntero(evento: PointerEvent) {
      elemento!.dataset.active = "true";
      moverX(evento.clientX);
      moverY(evento.clientY);
    }
    /** Oculta el halo al salir de la ventana. @returns {void} */
    function ocultarHalo() { elemento!.dataset.active = "false"; }
    window.addEventListener("pointermove", seguirPuntero, { passive: true });
    document.documentElement.addEventListener("pointerleave", ocultarHalo);
    return () => {
      window.removeEventListener("pointermove", seguirPuntero);
      document.documentElement.removeEventListener("pointerleave", ocultarHalo);
    };
  }, []);

  return <>{children}<div ref={halo} className="cursor-glow" aria-hidden="true" /></>;
}
