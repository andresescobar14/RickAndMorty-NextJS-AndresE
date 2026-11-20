"use client";

import { Fragment, useRef, type ElementType } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Una línea del título y la clase opcional que la decora. */
export type LineaTitulo = { texto: string; className?: string };

/**
 * Título que entra letra por letra desde abajo con GSAP.
 * El texto completo queda en aria-label para lectores de pantalla.
 * @param {Object} props - Contenido del título.
 * @param {LineaTitulo[]} props.lineas - Líneas a mostrar.
 * @param {React.ElementType} [props.as='h1'] - Etiqueta HTML.
 * @param {string} [props.className=''] - Clases del título.
 * @returns {React.JSX.Element} Título animado.
 */
export default function SplitHeading({ lineas, as: Etiqueta = "h1", className = "" }: { lineas: LineaTitulo[]; as?: ElementType; className?: string }) {
  const titulo = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".split-char", { yPercent: 115, rotate: 8, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.022, delay: 0.1 });
  }, { scope: titulo });

  return (
    <Etiqueta ref={titulo} className={className} aria-label={lineas.map((l) => l.texto).join(" ")}>
      {lineas.map((linea, i) => (
        <span key={i} className={`split-line ${linea.className ?? ""}`} aria-hidden="true">
          {linea.texto.split(" ").map((palabra, j, palabras) => (
            <Fragment key={j}>
              <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                {Array.from(palabra).map((letra, k) => <span key={k} className="split-char">{letra}</span>)}
              </span>
              {j < palabras.length - 1 && " "}
            </Fragment>
          ))}
        </span>
      ))}
    </Etiqueta>
  );
}
