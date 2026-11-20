import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { consultarPersonajeParaSeo } from "@/services/characters";
import { elegirRegresoSeguro } from "@/lib/filters";
import { crearMetadatosPagina } from "@/lib/metadata";
import FichaPersonaje from "@/components/organisms/CharacterDetail";
import type { ParametrosBusquedaUrl } from "@/types/character";

type ParametrosFicha = { params: Promise<{ id: string }>; searchParams: Promise<ParametrosBusquedaUrl> };

/**
 * Genera el título y la imagen social del personaje desde el servidor.
 * @param {ParametrosFicha} props - Parámetros de la ruta dinámica.
 * @returns {Promise<Metadata>} Metadatos propios de la ficha.
 */
export async function generateMetadata({ params }: ParametrosFicha): Promise<Metadata> {
  const { id: identificadorPantalla } = await params;
  const personajeDelArchivo = await consultarPersonajeParaSeo(Number(identificadorPantalla));
  if (!personajeDelArchivo) notFound();
  return crearMetadatosPagina(
    personajeDelArchivo.name,
    `Conoce a ${personajeDelArchivo.name}: ${personajeDelArchivo.species}, origen ${personajeDelArchivo.origin.name} y ${personajeDelArchivo.episode.length} episodios en Rick y Morty.`,
    `/personaje/${personajeDelArchivo.id}`,
    personajeDelArchivo.image,
  );
}

/**
 * Define la ruta y entrega el id al componente que pedirá la API con useEffect.
 * @param {ParametrosFicha} props - Id y URL de regreso recibidos por Next.js.
 * @returns {Promise<React.JSX.Element>} Componente cliente de la ficha.
 */
export default async function PaginaPersonaje({ params, searchParams: parametrosBusqueda }: ParametrosFicha) {
  const { id: identificadorPantalla } = await params;
  const rutaRegreso = elegirRegresoSeguro((await parametrosBusqueda).from);
  return <FichaPersonaje key={identificadorPantalla} identificadorPersonaje={Number(identificadorPantalla)} rutaRegreso={rutaRegreso} />;
}
