import type { PersonajeApi } from "@/types/character";
import { etiquetasEstadoPersonaje } from "@/lib/labels";

/**
 * Muestra el estado de un personaje mediante texto y un indicador de color.
 * @param {Object} props - Estado del personaje.
 * @param {PersonajeApi['status']} props.status - Estado recibido de la API.
 * @returns {React.JSX.Element} Etiqueta de estado accesible sin depender solo del color.
 * @example
 * <StatusBadge status="Alive" />
 */
export default function EtiquetaEstado({ status: estadoPersonaje }: { status: PersonajeApi["status"] }) {
  return <span className="status-badge" data-status={estadoPersonaje}><span aria-hidden="true" />{etiquetasEstadoPersonaje[estadoPersonaje]}</span>;
}
