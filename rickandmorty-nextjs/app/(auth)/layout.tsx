import type { ReactNode } from "react";
import ControlSesion from "@/components/organisms/AuthGate";

/**
 * Muestra login y registro solamente a visitantes sin sesión.
 * @param {Object} props - Rutas públicas del grupo.
 * @param {React.ReactNode} props.children - Página de login o registro.
 * @returns {React.JSX.Element} Control de acceso para las pantallas públicas.
 */
export default function DistribucionPublica({ children }: { children: ReactNode }) {
  return <ControlSesion requireSession={false}>{children}</ControlSesion>;
}
