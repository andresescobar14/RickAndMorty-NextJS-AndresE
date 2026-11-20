"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSesionExplorador } from "@/context/AuthContext";
import BotonAccion from "@/components/atoms/Button";

/**
 * Espera la lectura de la sesión antes de mostrar páginas o redirigir.
 * @param {Object} props - Contenido y regla de acceso.
 * @param {React.ReactNode} props.children - Pantalla que se desea mostrar.
 * @param {boolean} [props.requireSession=true] - Exige sesión o exige estar desconectado.
 * @returns {React.JSX.Element} Contenido autorizado o estado de comprobación.
 */
export default function ControlSesion({ children, requireSession: necesitaSesion = true }: {
  children: ReactNode;
  requireSession?: boolean;
}) {
  const { exploradorActual, cargandoSesion: cargandoPantalla, problemaAlmacenamiento: problemaGuardadoPantalla } = useSesionExplorador();
  const navegacionAplicacion = useRouter();
  let destinoSesion = "";
  if (necesitaSesion && !exploradorActual) destinoSesion = "/login";
  if (!necesitaSesion && exploradorActual) destinoSesion = "/";

  useEffect(() => {
    if (!cargandoPantalla && !problemaGuardadoPantalla && destinoSesion) navegacionAplicacion.replace(destinoSesion);
  }, [cargandoPantalla, problemaGuardadoPantalla, destinoSesion, navegacionAplicacion]);

  if (problemaGuardadoPantalla) {
    return (
      <main className="session-screen">
        <h1>No pudimos abrir el portal</h1>
        <p role="alert">{problemaGuardadoPantalla}</p>
        <BotonAccion onClick={() => window.location.reload()}>Reintentar</BotonAccion>
      </main>
    );
  }
  if (cargandoPantalla || destinoSesion) {
    return <div className="session-screen" role="status">Comprobando tu sesión…</div>;
  }
  return <>{children}</>;
}
