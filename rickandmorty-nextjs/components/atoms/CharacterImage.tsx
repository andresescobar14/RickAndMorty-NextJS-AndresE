"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Optimiza el retrato y conserva una ficha legible si falla la imagen externa.
 * @param {Object} props - Configuración del retrato.
 * @param {string} props.direccion - URL de la imagen en la API.
 * @param {string} props.nombre - Nombre del personaje para el texto alternativo.
 * @param {number} props.ancho - Ancho original reservado.
 * @param {number} props.alto - Alto original reservado.
 * @param {string} props.tamanos - Ancho visible según la pantalla.
 * @param {boolean} [props.precargar=false] - Prioriza únicamente la imagen principal.
 * @returns {React.JSX.Element} Retrato optimizado o alternativa cuando no esté disponible.
 * @example
 * <RetratoPersonaje direccion={personaje.image} nombre={personaje.name} ancho={300} alto={300} tamanos="50vw" />
 */
export default function RetratoPersonaje({ direccion, nombre, ancho, alto, tamanos, precargar = false }: {
  direccion: string; nombre: string; ancho: number; alto: number; tamanos: string; precargar?: boolean;
}) {
  const [retratoFallido, marcarRetratoFallido] = useState(false);

  if (retratoFallido) {
    return <div className="portrait-fallback" role="img" aria-label={`Retrato no disponible de ${nombre}`}><span aria-hidden="true">R&M</span><p>Retrato no disponible</p></div>;
  }

  return <Image src={direccion} alt={`Retrato de ${nombre}`} width={ancho} height={alto} sizes={tamanos} preload={precargar} onError={() => marcarRetratoFallido(true)} />;
}
