"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  recuperarExploradorActivo, iniciarSesionExplorador, cerrarSesionExplorador, guardarNombreExplorador,
  cambiarClaveExplorador, CLAVE_SESION_ACTIVA, CLAVE_CUENTAS_NAVEGADOR, type PerfilExplorador,
} from "@/services/auth";

/** Información y acciones compartidas por los componentes que usan la sesión. */
type EstadoSesion = {
  exploradorActual: PerfilExplorador | null;
  cargandoSesion: boolean;
  problemaAlmacenamiento: string;
  abrirSesionExplorador: (correoExplorador: string, claveExplorador: string) => Promise<void>;
  cerrarSesionActual: () => void;
  actualizarNombreCuenta: (nombreExplorador: string) => void;
  actualizarClaveCuenta: (claveActual: string, claveNueva: string) => Promise<void>;
};

const ContextoSesion = createContext<EstadoSesion | null>(null);

/**
 * Comparte la sesión de React y la restaura desde el navegador al abrir la app.
 * @param {Object} props - Contenido que tendrá acceso a la sesión.
 * @param {React.ReactNode} props.children - Páginas y componentes de la aplicación.
 * @returns {React.JSX.Element} Proveedor del contexto de autenticación.
 */
export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [exploradorActual, actualizarExploradorActivo] = useState<PerfilExplorador | null>(null);
  const [cargandoSesion, marcarCargaSesion] = useState(true);
  const [problemaGuardadoSesion, mostrarProblemaGuardadoSesion] = useState("");

  useEffect(() => {
    /**
     * Sincroniza el estado con una sesión externa a React.
     * @returns {void} Actualiza usuario, error y fin de carga inicial.
     */
    function recuperarSesionGuardada() {
      try {
        actualizarExploradorActivo(recuperarExploradorActivo());
        mostrarProblemaGuardadoSesion("");
      } catch {
        actualizarExploradorActivo(null);
        mostrarProblemaGuardadoSesion("No pudimos recuperar la sesión. Comprueba el almacenamiento del navegador.");
      }
      marcarCargaSesion(false);
    }

    /**
     * Recoge cambios de sesión y perfil hechos desde otra pestaña.
     * @param {StorageEvent} eventoSesion - Cambio del almacenamiento del mismo sitio.
     * @returns {void} Restaura la sesión si el cambio le afecta.
     */
    function sincronizarAlmacenamiento(eventoSesion: StorageEvent) {
      if (eventoSesion.key === CLAVE_SESION_ACTIVA || eventoSesion.key === CLAVE_CUENTAS_NAVEGADOR || eventoSesion.key === null) {
        recuperarSesionGuardada();
      }
    }

    // La primera lectura del navegador debe ocurrir después de la hidratación.
    recuperarSesionGuardada();
    window.addEventListener("storage", sincronizarAlmacenamiento);
    return () => window.removeEventListener("storage", sincronizarAlmacenamiento);
  }, []);

  /**
   * Inicia sesión y hace que todos los consumidores reciban el usuario.
   * @param {string} correoExplorador - Correo validado.
   * @param {string} claveExplorador - Contraseña validada.
   * @returns {Promise<void>} Actualiza la sesión al comprobar las credenciales.
   */
  async function abrirSesionExplorador(correoExplorador: string, claveExplorador: string) {
    const cuentaEncontrada = await iniciarSesionExplorador(correoExplorador, claveExplorador);
    actualizarExploradorActivo(cuentaEncontrada);
  }

  /** Cierra la sesión persistida y la de React. @returns {void} */
  function cerrarSesionActual() {
    cerrarSesionExplorador();
    actualizarExploradorActivo(null);
  }

  /**
   * Guarda el nuevo nombre y actualiza la interfaz.
   * @param {string} nombreExplorador - Nombre validado.
   * @returns {void} Actualiza los datos compartidos de la cuenta.
   */
  function actualizarNombreCuenta(nombreExplorador: string) {
    if (!exploradorActual) throw new Error("Debes iniciar sesión.");
    actualizarExploradorActivo(guardarNombreExplorador(exploradorActual.id, nombreExplorador));
  }

  /**
   * Cambia la contraseña de la cuenta activa.
   * @param {string} claveActual - Contraseña actual.
   * @param {string} claveNueva - Nueva contraseña validada.
   * @returns {Promise<void>} Persiste la nueva huella de contraseña.
   */
  async function actualizarClaveCuenta(claveActual: string, claveNueva: string) {
    if (!exploradorActual) throw new Error("Debes iniciar sesión.");
    await cambiarClaveExplorador(exploradorActual.id, claveActual, claveNueva);
  }

  return (
    <ContextoSesion.Provider value={{ exploradorActual, cargandoSesion, problemaAlmacenamiento: problemaGuardadoSesion, abrirSesionExplorador, cerrarSesionActual, actualizarNombreCuenta, actualizarClaveCuenta }}>
      {children}
    </ContextoSesion.Provider>
  );
}

/**
 * Permite leer la sesión desde cualquier componente dentro de ProveedorSesion.
 * @returns {EstadoSesion} Usuario actual y acciones de autenticación.
 * @throws {Error} Si el componente no está dentro del proveedor.
 * @example
 * const { exploradorActual, cerrarSesionActual } = useSesionExplorador();
 */
export function useSesionExplorador() {
  const estadoCompartidoSesion = useContext(ContextoSesion);
  if (!estadoCompartidoSesion) throw new Error("useSesionExplorador debe utilizarse dentro de ProveedorSesion.");
  return estadoCompartidoSesion;
}
