"use client";

import type { ReactNode } from "react";
import { ProveedorSesion, useSesionExplorador } from "@/context/AuthContext";
import { ProveedorFavoritos } from "@/context/FavoritesContext";
import { ProveedorTema } from "@/context/ThemeContext";
import InterruptorTema from "@/components/atoms/ThemeToggle";
import MotionProvider from "@/components/motion/MotionProvider";

/**
 * Reinicia el estado de favoritos al cambiar de cuenta, usando su id como key.
 * @param {Object} props - Contenido de la aplicación.
 * @param {React.ReactNode} props.children - Componentes que usan los favoritos.
 * @returns {React.JSX.Element} Favoritos correspondientes a una sola cuenta.
 */
function FavoritosDeLaCuenta({ children }: { children: ReactNode }) {
  const { exploradorActual } = useSesionExplorador();
  return <ProveedorFavoritos key={exploradorActual?.id || "guest"} userId={exploradorActual?.id || null}>{children}</ProveedorFavoritos>;
}

/**
 * Coloca los proveedores de estado por encima de todas las páginas.
 * @param {Object} props - Contenido que Next.js entrega desde el layout.
 * @param {React.ReactNode} props.children - Árbol de páginas.
 * @returns {React.JSX.Element} Proveedores de la aplicación.
 */
export default function ProveedoresAplicacion({ children }: { children: ReactNode }) {
  return <ProveedorTema><MotionProvider><ProveedorSesion><FavoritosDeLaCuenta>{children}</FavoritosDeLaCuenta></ProveedorSesion></MotionProvider><InterruptorTema /></ProveedorTema>;
}
