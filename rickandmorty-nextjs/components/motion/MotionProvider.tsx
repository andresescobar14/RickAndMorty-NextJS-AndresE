"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "aos/dist/aos.css";
import gsap from "gsap";

/** Clase que usa la hoja de estilos de AOS para mostrar un elemento. */
const CLASE_VISIBLE = "aos-animate";

/**
 * Activa las animaciones de scroll de AOS (sus mismos efectos data-aos) y el halo del cursor con GSAP.
 *
 * La detección se hace con IntersectionObserver en lugar del cálculo interno de AOS: AOS guarda la
 * posición de cada elemento al iniciar y, cuando React agrega resultados de la API, cambia de página
 * o el layout se mueve, esa posición queda desactualizada y el elemento nunca aparece.
 * @param {Object} props - Árbol de la aplicación.
 * @param {React.ReactNode} props.children - Páginas.
 * @returns {React.JSX.Element} Contenido con el halo decorativo.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  const halo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cuerpo = document.body;
    cuerpo.dataset.aosEasing = "ease-out-cubic";
    cuerpo.dataset.aosDuration = "800";
    cuerpo.dataset.aosDelay = "0";

    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sinObservador = typeof IntersectionObserver === "undefined";

    const observadorVista = sinObservador ? null : new IntersectionObserver((entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.classList.add(CLASE_VISIBLE);
        observadorVista!.unobserve(entrada.target);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });

    /** Prepara un elemento animado; si no hay animación posible lo muestra directamente. @param {Element} elemento - Nodo con data-aos. @returns {void} */
    function registrar(elemento: Element) {
      if (elemento.classList.contains("aos-init")) return;
      elemento.classList.add("aos-init");
      if (sinMovimiento || !observadorVista) elemento.classList.add(CLASE_VISIBLE);
      else observadorVista.observe(elemento);
    }

    /** Registra el nodo y todos sus descendientes animados. @param {Node} nodo - Nodo agregado. @returns {void} */
    function registrarArbol(nodo: Node) {
      if (!(nodo instanceof Element)) return;
      if (nodo.hasAttribute("data-aos")) registrar(nodo);
      nodo.querySelectorAll("[data-aos]").forEach(registrar);
    }

    registrarArbol(cuerpo);
    const observadorDom = new MutationObserver((cambios) => {
      for (const cambio of cambios) cambio.addedNodes.forEach(registrarArbol);
    });
    observadorDom.observe(cuerpo, { childList: true, subtree: true });

    return () => {
      observadorDom.disconnect();
      observadorVista?.disconnect();
    };
  }, []);

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
