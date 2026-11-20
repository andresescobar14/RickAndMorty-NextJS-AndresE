import RetratoPersonaje from "@/components/atoms/CharacterImage";
import Link from "next/link";
import type { PersonajeApi } from "@/types/character";
import { etiquetasGeneroPersonaje } from "@/lib/labels";
import BotonFavorito from "@/components/atoms/FavoriteButton";
import EtiquetaEstado from "@/components/atoms/StatusBadge";

/**
 * Presenta un personaje y conserva la URL del listado al abrir su ficha.
 * @param {Object} props - Datos y destino de regreso.
 * @param {PersonajeApi} props.personaje - Personaje obtenido de la API.
 * @param {string} [props.rutaRegreso='/'] - Listado con sus filtros o página de favoritos.
 * @returns {React.JSX.Element} Tarjeta enlazada con imagen optimizada y favorito.
 */
export default function TarjetaPersonaje({ personaje: personajeDelArchivo, rutaRegreso = "/" }: { personaje: PersonajeApi; rutaRegreso?: string }) {
  const enlacePersonaje = `/personaje/${personajeDelArchivo.id}?from=${encodeURIComponent(rutaRegreso)}`;
  return (
    <article className="character-card">
      <div className="character-portrait">
        <Link href={enlacePersonaje}>
          <RetratoPersonaje direccion={personajeDelArchivo.image} nombre={personajeDelArchivo.name} ancho={300} alto={300}
            tamanos="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw" />
        </Link>
        <span className="portrait-index">ARCHIVO / {String(personajeDelArchivo.id).padStart(3, "0")}</span>
        <BotonFavorito identificadorPersonaje={personajeDelArchivo.id} nombrePersonaje={personajeDelArchivo.name} />
      </div>
      <div className="character-info">
        <EtiquetaEstado status={personajeDelArchivo.status} />
        <h2><Link href={enlacePersonaje}>{personajeDelArchivo.name}</Link></h2>
        <p>{personajeDelArchivo.species} <span aria-hidden="true">/</span> {etiquetasGeneroPersonaje[personajeDelArchivo.gender]}</p>
      </div>
    </article>
  );
}
